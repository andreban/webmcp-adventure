import { Application, Container, Graphics, Text, TextStyle, Sprite, Assets } from 'pixi.js';
import { Entity, Position2D, Room, WorldStateInterface } from '../types/index.js';
import { EventEmitter } from '../core/EventEmitter.js';

export interface PixiSceneOptions {
  containerElement: HTMLElement;
  width?: number;
  height?: number;
  onEntityClick?: (entity: Entity) => void;
  onExitClick?: (targetRoomId: string) => void;
  onPositionClick?: (position: Position2D) => void;
}

export class PixiSceneManager {
  private app: Application | null = null;
  private rootContainer: Container | null = null;
  private roomLayer: Container | null = null;
  private entityLayer: Container | null = null;
  private uiLayer: Container | null = null;
  private dialogueBubble: Container | null = null;
  private state: WorldStateInterface | null = null;
  private emitter: EventEmitter;
  private options: PixiSceneOptions;

  private entitySprites: Map<string, Container> = new Map();
  private currentAnimation: {
    cancel: () => void;
    promise: Promise<void>;
  } | null = null;

  constructor(options: PixiSceneOptions, emitter: EventEmitter) {
    this.options = options;
    this.emitter = emitter;
  }

  public async init(state: WorldStateInterface): Promise<void> {
    this.state = state;

    const width = this.options.width ?? 800;
    const height = this.options.height ?? 450;

    const app = new Application();
    await app.init({
      width,
      height,
      backgroundColor: 0x07090f,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      antialias: false,
    });

    this.app = app;
    this.options.containerElement.appendChild(app.canvas);

    // Style canvas for pixel art
    app.canvas.style.width = '100%';
    app.canvas.style.height = '100%';
    app.canvas.style.display = 'block';
    app.canvas.style.imageRendering = 'pixelated';
    app.canvas.style.objectFit = 'contain';

    this.rootContainer = new Container();
    this.app.stage.addChild(this.rootContainer);

    this.roomLayer = new Container();
    this.entityLayer = new Container();
    this.uiLayer = new Container();

    this.rootContainer.addChild(this.roomLayer);
    this.rootContainer.addChild(this.entityLayer);
    this.rootContainer.addChild(this.uiLayer);

    this.bindEvents();
    this.renderCurrentScene();
  }

  private bindEvents(): void {
    this.emitter.on('room:changed', () => {
      this.renderCurrentScene();
    });

    this.emitter.on('entity:updated', () => {
      this.refreshEntities();
    });

    this.emitter.on('inventory:added', () => {
      this.refreshEntities();
    });

    this.emitter.on('inventory:removed', () => {
      this.refreshEntities();
    });

    this.emitter.on('player:moved', (data: unknown) => {
      const moveData = data as { position: Position2D };
      if (moveData && moveData.position) {
        this.animatePlayerTo(moveData.position);
      }
    });

    this.emitter.on('dialogue:turn', (data: unknown) => {
      const dialogue = data as { npcId: string; npcName: string; npcReply: string };
      this.showDialogueBubble(dialogue.npcName, dialogue.npcReply);
    });
  }

  public async renderCurrentScene(): Promise<void> {
    if (!this.app || !this.state || !this.roomLayer || !this.entityLayer) return;

    // Cancel any running player animation during scene re-render
    if (this.currentAnimation) {
      this.currentAnimation.cancel();
      this.currentAnimation = null;
    }

    const currentRoom = this.state.rooms.get(this.state.currentRoomId);
    if (!currentRoom) return;

    // Clear previous layers
    for (const sprite of this.entitySprites.values()) {
      sprite.destroy({ children: true });
    }
    this.roomLayer.removeChildren();
    this.entityLayer.removeChildren();
    this.entitySprites.clear();
    this.hideDialogueBubble();

    // 1. Draw Room Environment (Image asset or procedural vector fallback)
    await this.drawRoomBackground(currentRoom);

    // 2. Draw Exits / Doors
    this.drawExits(currentRoom);

    // 3. Draw Room Entities & Actors
    this.drawEntities(currentRoom);
  }

  private async drawRoomBackground(room: Room): Promise<void> {
    if (!this.roomLayer || !this.app) return;

    const w = this.app.screen.width;
    const h = this.app.screen.height;

    let hasLoadedImage = false;

    if (room.backgroundImage) {
      try {
        const texture = await Assets.load(room.backgroundImage);
        if (this.roomLayer && this.state?.currentRoomId === room.id) {
          const bgSprite = new Sprite(texture);
          bgSprite.width = w;
          bgSprite.height = h;
          this.roomLayer.addChild(bgSprite);
          hasLoadedImage = true;
        }
      } catch (err) {
        console.warn(`Could not load background image: ${room.backgroundImage}`, err);
      }
    }

    if (!hasLoadedImage) {
      const bg = new Graphics();
      const floorColor = room.colorTheme?.floor ?? 0x1e2230;
      const wallColor = room.colorTheme?.wall ?? 0x141824;
      const accentColor = room.colorTheme?.accent ?? 0x00e5ff;

      // Outer Space / Far background stars
      bg.rect(0, 0, w, h);
      bg.fill({ color: 0x0a0c14 });

      // Room Walls
      bg.rect(40, 30, w - 80, h - 80);
      bg.fill({ color: wallColor });
      bg.stroke({ color: 0x2d3748, width: 4 });

      // Floor Grid (Sci-fi perspective)
      const floorY = h * 0.45;
      bg.rect(50, floorY, w - 100, h - floorY - 50);
      bg.fill({ color: floorColor });

      // Grid lines on floor
      for (let x = 50; x < w - 50; x += 40) {
        bg.moveTo(x, floorY);
        bg.lineTo(x, h - 50);
        bg.stroke({ color: 0x283149, width: 1 });
      }
      for (let y = floorY; y < h - 50; y += 30) {
        bg.moveTo(50, y);
        bg.lineTo(w - 50, y);
        bg.stroke({ color: 0x283149, width: 1 });
      }

      // Top Accent Light Strip
      bg.rect(60, 45, w - 120, 4);
      bg.fill({ color: accentColor });

      // Room Header Plate (only in procedural rooms)
      const headerGfx = new Graphics();
      headerGfx.rect(w / 2 - 140, 15, 280, 24);
      headerGfx.fill({ color: 0x0f172a, alpha: 0.85 });
      headerGfx.stroke({ color: accentColor, width: 1.5 });

      const titleStyle = new TextStyle({
        fontFamily: 'monospace',
        fontSize: 12,
        fontWeight: 'bold',
        fill: accentColor,
        letterSpacing: 2,
      });
      const titleText = new Text({ text: room.name.toUpperCase(), style: titleStyle });
      titleText.anchor.set(0.5, 0.5);
      titleText.position.set(w / 2, 27);

      this.roomLayer.addChild(bg);
      this.roomLayer.addChild(headerGfx);
      this.roomLayer.addChild(titleText);
    }

    // Interactive Floor Hit Area for Click-to-Move Animation
    const floorY = h * 0.45;
    const floorClickArea = new Graphics();
    floorClickArea.rect(20, floorY, w - 40, h - floorY - 20);
    floorClickArea.fill({ color: 0x000000, alpha: 0.001 });
    floorClickArea.eventMode = 'static';
    floorClickArea.cursor = 'pointer';

    floorClickArea.on('pointerdown', (e) => {
      if (!this.rootContainer) return;
      const localPos = e.getLocalPosition(this.rootContainer);
      const clampedX = Math.max(50, Math.min(w - 50, Math.round(localPos.x)));
      const clampedY = Math.max(Math.round(floorY + 20), Math.min(h - 40, Math.round(localPos.y)));

      this.showClickIndicator(clampedX, clampedY);

      if (this.options.onPositionClick) {
        this.options.onPositionClick({ x: clampedX, y: clampedY });
      } else {
        this.animatePlayerTo({ x: clampedX, y: clampedY });
      }
    });

    this.roomLayer.addChild(floorClickArea);
  }

  private showClickIndicator(x: number, y: number): void {
    if (!this.uiLayer) return;

    const ring = new Graphics();
    ring.position.set(x, y);
    this.uiLayer.addChild(ring);

    const startTime = performance.now();
    const duration = 400;

    const animateRing = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(1, elapsed / duration);

      ring.clear();
      const radius = 4 + progress * 16;
      const alpha = 1 - progress;
      ring.circle(0, 0, radius);
      ring.stroke({ color: 0x38bdf8, width: 2, alpha });

      if (progress < 1) {
        requestAnimationFrame(animateRing);
      } else {
        if (this.uiLayer) {
          this.uiLayer.removeChild(ring);
        }
        ring.destroy();
      }
    };

    requestAnimationFrame(animateRing);
  }

  private drawExits(room: Room): void {
    if (!this.roomLayer) return;

    Object.values(room.exits).forEach((exit) => {
      const exitContainer = new Container();
      exitContainer.position.set(exit.position.x, exit.position.y);
      exitContainer.eventMode = 'static';
      exitContainer.cursor = 'pointer';

      const doorGfx = new Graphics();
      const isLocked = !!exit.isLocked;
      const doorColor = isLocked ? 0xef4444 : 0x10b981;

      if (room.backgroundImage) {
        // Invisible interactive hotspot extending upward from the floor doorway position
        doorGfx.rect(-50, -180, 100, 190);
        doorGfx.fill({ color: 0x000000, alpha: 0.001 });
        exitContainer.addChild(doorGfx);
      } else {
        // Procedural door graphic for fallback rooms
        doorGfx.rect(-24, -40, 48, 80);
        doorGfx.fill({ color: 0x0f172a, alpha: 0.9 });
        doorGfx.stroke({ color: doorColor, width: 2 });

        // Door Lock Indicator Lamp
        doorGfx.circle(0, -25, 4);
        doorGfx.fill({ color: doorColor });

        // Exit Label
        const labelStyle = new TextStyle({
          fontFamily: 'monospace',
          fontSize: 10,
          fill: 0xe2e8f0,
        });
        const label = new Text({ text: exit.name, style: labelStyle });
        label.anchor.set(0.5, 1);
        label.position.set(0, -45);

        exitContainer.addChild(doorGfx);
        exitContainer.addChild(label);
      }

      exitContainer.on('pointerdown', () => {
        if (this.options.onExitClick) {
          this.options.onExitClick(exit.targetRoomId);
        }
      });

      this.roomLayer!.addChild(exitContainer);
    });
  }

  private drawEntities(room: Room): void {
    if (!this.entityLayer || !this.state) return;

    const entitiesInRoom = Array.from(this.state.entities.values()).filter(
      (e) => e.roomId === room.id && e.visible !== false
    );

    entitiesInRoom.forEach((entity) => {
      const spriteContainer = this.createEntitySprite(entity);
      spriteContainer.position.set(entity.position.x, entity.position.y);
      this.entityLayer!.addChild(spriteContainer);
      this.entitySprites.set(entity.id, spriteContainer);
    });
  }

  private createEntitySprite(entity: Entity): Container {
    const container = new Container();
    container.eventMode = 'static';
    container.cursor = 'pointer';

    const gfx = new Graphics();

    if (entity.type === 'player') {
      // Robot Avatar - Unit-7 Yellow Industrial Maintenance Bot
      // Stumpy bipedal mechanical legs & feet
      gfx.rect(-10, -6, 6, 8); // Left leg
      gfx.rect(4, -6, 6, 8);  // Right leg
      gfx.fill({ color: 0xb45309 }); // Dark amber/industrial joint
      gfx.rect(-12, 0, 8, 4); // Left foot
      gfx.rect(4, 0, 8, 4);  // Right foot
      gfx.fill({ color: 0x78350f });

      // Bright Yellow Industrial Body/Torso
      gfx.rect(-15, -28, 30, 22);
      gfx.fill({ color: 0xeab308 }); // Bright yellow industrial shell
      gfx.stroke({ color: 0x854d0e, width: 1.5 });

      // Body plate & wear details
      gfx.rect(-10, -23, 20, 8);
      gfx.fill({ color: 0x713f12 }); // Dark nameplate area (Unit-7)
      gfx.circle(9, -11, 2.5);
      gfx.fill({ color: 0x22c55e }); // Status indicator LED

      // Telescoping multi-tool arms & grippers
      // Left arm with clamp
      gfx.moveTo(-15, -24);
      gfx.lineTo(-22, -18);
      gfx.lineTo(-24, -10);
      gfx.stroke({ color: 0x64748b, width: 2.5 });
      gfx.circle(-25, -9, 2);
      gfx.fill({ color: 0x94a3b8 });

      // Right arm with multi-tool
      gfx.moveTo(15, -24);
      gfx.lineTo(22, -18);
      gfx.lineTo(24, -10);
      gfx.stroke({ color: 0x64748b, width: 2.5 });
      gfx.circle(25, -9, 2);
      gfx.fill({ color: 0x94a3b8 });

      // Neck joint
      gfx.rect(-4, -32, 8, 4);
      gfx.fill({ color: 0x334155 });

      // Green-phosphor CRT Monitor Head
      gfx.rect(-13, -50, 26, 18);
      gfx.fill({ color: 0xd97706 }); // CRT bezel / housing
      gfx.stroke({ color: 0x78350f, width: 1.5 });

      // CRT screen bezel & dark display
      gfx.rect(-10, -47, 20, 12);
      gfx.fill({ color: 0x052e16 }); // Deep CRT green/black

      // Glowing Green Pixel Face (Eyes & Smile)
      gfx.rect(-7, -44, 3, 3); // Left eye
      gfx.rect(4, -44, 3, 3);  // Right eye
      gfx.rect(-6, -39, 2, 2); // Smile left
      gfx.rect(-4, -38, 8, 2); // Smile bottom
      gfx.rect(4, -39, 2, 2);  // Smile right
      gfx.fill({ color: 0x4ade80 }); // Phosphor green glow
    } else if (entity.id === 'navigator') {
      // Navigator Android (ASTRA-NAV) Full-Body In-Game Avatar Sprite
      const isPowered = !!entity.state?.hasPower;

      // Legs / Boots (White ceramic plating with cyan knee cuffs)
      gfx.rect(-8, -14, 6, 14); // Left leg
      gfx.rect(2, -14, 6, 14);  // Right leg
      gfx.fill({ color: 0xf1f5f9 }); // White ceramic
      gfx.stroke({ color: 0x00e5ff, width: 1 });
      gfx.rect(-10, 0, 8, 4);   // Left boot
      gfx.rect(2, 0, 8, 4);    // Right boot
      gfx.fill({ color: 0x334155 });

      // Torso / White Ceramic Suit
      gfx.rect(-13, -36, 26, 23);
      gfx.fill({ color: 0xf8fafc });
      gfx.stroke({ color: 0x00e5ff, width: 1.5 });

      // Chest Control Module (ASTRA-NAV Plate)
      gfx.rect(-8, -30, 16, 11);
      gfx.fill({ color: 0x1e293b });
      gfx.stroke({ color: 0x64748b, width: 1 });

      // Power Status Light on Chest
      gfx.rect(-4, -25, 8, 3);
      gfx.fill({ color: isPowered ? 0x00e5ff : 0xef4444 }); // Cyan ONLINE vs Red OFFLINE

      // Arms (White ceramic with cyan cuffs)
      gfx.rect(-17, -34, 5, 20); // Left arm
      gfx.rect(12, -34, 5, 20);  // Right arm
      gfx.fill({ color: 0xf1f5f9 });
      gfx.stroke({ color: 0x00e5ff, width: 1 });

      if (!isPowered) {
        // UNPOWERED STATE: Slumped head, dormant dark visor, faint amber standby diode
        gfx.rect(-10, -52, 20, 17);
        gfx.fill({ color: 0xcbd5e1 }); // Slumped helmet
        gfx.stroke({ color: 0x64748b, width: 1.5 });

        // Dark dormant visor
        gfx.rect(-7, -49, 14, 11);
        gfx.fill({ color: 0x090d16 });

        // Blinking amber standby diode
        gfx.circle(3, -46, 2);
        gfx.fill({ color: 0xf59e0b });
      } else {
        // POWERED STATE: Upright head, glowing cyan/blue star-tracking visor
        gfx.rect(-10, -58, 20, 19);
        gfx.fill({ color: 0xf8fafc }); // Upright white helmet
        gfx.stroke({ color: 0x00e5ff, width: 1.5 });

        // Glowing Star-tracking visor
        gfx.rect(-7, -55, 14, 13);
        gfx.fill({ color: 0x083344 });

        // Constellation grid & optical sensor eyes
        gfx.rect(-5, -52, 4, 3);
        gfx.rect(1, -52, 4, 3);
        gfx.fill({ color: 0x00e5ff }); // Glowing cyan eyes

        // Star-tracking constellation points
        gfx.circle(-1, -47, 1.5);
        gfx.circle(3, -45, 1.5);
        gfx.fill({ color: 0x38bdf8 });
      }
    } else if (entity.id === 'comms_agent') {
      // Comms Agent (VOX-COM) - Spherical Floating Probe with Holographic Waveform Display
      // Repulsor glow ring at bottom
      gfx.ellipse(0, -6, 8, 3);
      gfx.fill({ color: 0x06b6d4, alpha: 0.6 });

      // Probe chassis (Spherical metallic probe with glowing cyan outline)
      gfx.circle(0, -28, 16);
      gfx.fill({ color: 0x083344 });
      gfx.stroke({ color: 0x06b6d4, width: 1.5 });

      // Holographic face screen (Dark teal backdrop)
      gfx.circle(0, -28, 13);
      gfx.fill({ color: 0x042f2e });

      // Holographic scanlines
      gfx.rect(-10, -36, 20, 1);
      gfx.rect(-12, -32, 24, 1);
      gfx.rect(-12, -28, 24, 1);
      gfx.rect(-12, -24, 24, 1);
      gfx.rect(-10, -20, 20, 1);
      gfx.fill({ color: 0x0e7490, alpha: 0.4 });

      // Holographic optical sensor eyes
      gfx.rect(-6, -34, 4, 2);
      gfx.rect(2, -34, 4, 2);
      gfx.fill({ color: 0x22d3ee });

      // Pulsing Soundwave Frequency Equalizer Bars (Emerald phosphor)
      gfx.rect(-8, -25, 2, 4);
      gfx.rect(-5, -28, 2, 8);
      gfx.rect(-2, -30, 2, 11);
      gfx.rect(1, -29, 2, 9);
      gfx.rect(4, -27, 2, 6);
      gfx.rect(7, -24, 2, 3);
      gfx.fill({ color: 0x10b981 });

      // Antennae & side sensor fins
      gfx.rect(-19, -29, 4, 3);
      gfx.rect(15, -29, 4, 3);
      gfx.fill({ color: 0x0891b2 });
    } else if (entity.id === 'mechanical_agent') {
      // Mechanical Agent (GRIP-9) - Heavy Treaded Repair Droid
      // Heavy Tank Treads at base
      gfx.rect(-17, -10, 34, 10);
      gfx.fill({ color: 0x1e293b });
      gfx.stroke({ color: 0x475569, width: 1.5 });

      // Tread Cogs & Wheels
      gfx.circle(-11, -5, 3.5);
      gfx.circle(0, -5, 3.5);
      gfx.circle(11, -5, 3.5);
      gfx.fill({ color: 0x334155 });
      gfx.stroke({ color: 0x94a3b8, width: 1 });

      // Weathered Steel & Bronze Torso
      gfx.rect(-15, -36, 30, 26);
      gfx.fill({ color: 0x475569 }); // Heavy steel
      gfx.stroke({ color: 0x92400e, width: 1.5 }); // Bronze edge

      // Bronze Reinforced Chest Plate
      gfx.rect(-10, -32, 20, 14);
      gfx.fill({ color: 0x92400e });

      // Piston cables & pipes
      gfx.rect(-12, -18, 4, 8);
      gfx.rect(8, -18, 4, 8);
      gfx.fill({ color: 0x0f172a });

      // Heavy Hydraulic Arms & Tool Vices
      gfx.rect(-21, -34, 6, 20); // Left arm
      gfx.fill({ color: 0x334155 });
      gfx.rect(-23, -14, 8, 5);  // Vice clamp claw
      gfx.fill({ color: 0xd97706 });

      gfx.rect(15, -34, 6, 20);  // Right arm
      gfx.fill({ color: 0x334155 });
      gfx.rect(15, -14, 8, 6);   // Pneumatic wrench / installer
      gfx.fill({ color: 0xa855f7 });

      // Industrial Welding-Mask Head
      gfx.rect(-11, -54, 22, 18);
      gfx.fill({ color: 0x334155 });
      gfx.stroke({ color: 0x92400e, width: 1.5 });

      // Glowing Amber/Violet Optical Slit
      gfx.rect(-8, -47, 16, 4);
      gfx.fill({ color: 0xf59e0b });
      gfx.stroke({ color: 0xa855f7, width: 1 });

      // Overhead Halogen Work-Lamp
      gfx.rect(-4, -58, 8, 4);
      gfx.fill({ color: 0xfef08a });
      gfx.stroke({ color: 0xd97706, width: 1 });
    } else if (entity.type === 'npc') {
      // NPC Avatar
      const npcColor = entity.color ?? 0xa855f7;
      gfx.circle(0, -28, 12);
      gfx.fill({ color: npcColor });
      gfx.stroke({ color: 0xffffff, width: 2 });

      // Eyes/Sensor
      gfx.rect(-6, -32, 4, 4);
      gfx.rect(2, -32, 4, 4);
      gfx.fill({ color: 0x00ffff });

      // Body
      gfx.rect(-12, -16, 24, 20);
      gfx.fill({ color: 0x334155 });
      gfx.stroke({ color: npcColor, width: 2 });
    } else if (entity.type === 'item') {
      // Item sprite (glowing pickup)
      gfx.circle(0, -6, 8);
      gfx.fill({ color: entity.color ?? 0xf59e0b });
      gfx.stroke({ color: 0xffffff, width: 1.5 });
    } else {
      // Interactive Object / Console
      const hasRoomImage = !!(this.state && this.state.rooms.get(entity.roomId)?.backgroundImage);
      if (hasRoomImage) {
        // Transparent hotspot over painted console/fixture in the background
        gfx.rect(-30, -35, 60, 60);
        gfx.fill({ color: 0x000000, alpha: 0.001 });
      } else {
        gfx.rect(-20, -30, 40, 30);
        gfx.fill({ color: 0x1e293b });
        gfx.stroke({ color: 0x64748b, width: 2 });

        // Screen glow
        gfx.rect(-14, -25, 28, 16);
        gfx.fill({ color: 0x06b6d4 });
      }
    }

    const hasRoomImage = !!(this.state && this.state.rooms.get(entity.roomId)?.backgroundImage);
    const isPaintedFixture = hasRoomImage && (entity.type === 'interactive' || entity.type === 'console');

    // Name Label (only for actors, items, or fallback rooms)
    if (!isPaintedFixture) {
      const nameStyle = new TextStyle({
        fontFamily: 'monospace',
        fontSize: 9,
        fill: 0xf1f5f9,
      });
      const nameText = new Text({ text: entity.name, style: nameStyle });
      nameText.anchor.set(0.5, 0);
      nameText.position.set(0, 4);
      container.addChild(nameText);
    }

    container.addChild(gfx);

    container.on('pointerdown', () => {
      if (this.options.onEntityClick) {
        this.options.onEntityClick(entity);
      }
    });

    return container;
  }

  public refreshEntities(): void {
    if (!this.state || !this.entityLayer) return;
    const currentRoom = this.state.rooms.get(this.state.currentRoomId);
    if (currentRoom) {
      for (const sprite of this.entitySprites.values()) {
        sprite.destroy({ children: true });
      }
      this.entityLayer.removeChildren();
      this.entitySprites.clear();
      this.drawEntities(currentRoom);
    }
  }

  public setPlayerPosition(pos: Position2D): void {
    const playerSprite = this.entitySprites.get('robot');
    if (playerSprite) {
      playerSprite.position.set(pos.x, pos.y);
    }
    if (this.state) {
      const player = this.state.getEntity('robot');
      if (player) {
        player.position = { ...pos };
      }
    }
  }

  public animatePlayerTo(
    targetPos: Position2D,
    speed = 280 // Pixels per second
  ): Promise<void> {
    const playerSprite = this.entitySprites.get('robot');
    if (!playerSprite) return Promise.resolve();

    // Cancel existing animation if running
    if (this.currentAnimation) {
      this.currentAnimation.cancel();
      this.currentAnimation = null;
    }

    const startX = playerSprite.position.x;
    const startY = playerSprite.position.y;
    const dx = targetPos.x - startX;
    const dy = targetPos.y - startY;
    const distance = Math.hypot(dx, dy);

    if (distance < 2) {
      playerSprite.position.set(targetPos.x, targetPos.y);
      this.updatePlayerStatePos(targetPos);
      return Promise.resolve();
    }

    const duration = Math.max(180, (distance / speed) * 1000);
    const startTime = performance.now();

    const gfx = playerSprite.children[0] as Graphics | undefined;
    if (gfx && dx !== 0) {
      gfx.scale.x = dx < 0 ? -1 : 1;
    }

    let animationFrameId: number;
    let isCancelled = false;

    const promise = new Promise<void>((resolve) => {
      const animate = (time: number) => {
        if (isCancelled) {
          if (gfx) gfx.y = 0;
          resolve();
          return;
        }

        const elapsed = time - startTime;
        const progress = Math.min(1, elapsed / duration);

        const currentX = startX + dx * progress;
        const currentY = startY + dy * progress;

        playerSprite.position.set(currentX, currentY);

        // Walking bobbing effect
        if (gfx) {
          const bob = Math.abs(Math.sin((elapsed / 1000) * Math.PI * 7)) * 4;
          gfx.y = -bob;
        }

        this.updatePlayerStatePos({ x: currentX, y: currentY });

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          playerSprite.position.set(targetPos.x, targetPos.y);
          if (gfx) gfx.y = 0;
          this.updatePlayerStatePos(targetPos);
          this.currentAnimation = null;
          resolve();
        }
      };

      animationFrameId = requestAnimationFrame(animate);
    });

    this.currentAnimation = {
      cancel: () => {
        isCancelled = true;
        cancelAnimationFrame(animationFrameId);
        if (gfx) gfx.y = 0;
      },
      promise,
    };

    return promise;
  }

  private updatePlayerStatePos(pos: Position2D): void {
    if (!this.state) return;
    const player = this.state.getEntity('robot');
    if (player) {
      player.position = { x: Math.round(pos.x), y: Math.round(pos.y) };
    }
  }

  public showDialogueBubble(speaker: string, text: string): void {
    if (!this.uiLayer || !this.app) return;
    this.hideDialogueBubble();

    const container = new Container();
    const w = Math.min(480, this.app.screen.width - 40);
    const bubbleGfx = new Graphics();

    bubbleGfx.roundRect(-w / 2, 0, w, 70, 8);
    bubbleGfx.fill({ color: 0x0f172a });
    bubbleGfx.stroke({ color: 0x38bdf8, width: 2 });

    const speakerStyle = new TextStyle({
      fontFamily: 'monospace',
      fontSize: 11,
      fontWeight: 'bold',
      fill: 0x38bdf8,
    });
    const speakerText = new Text({ text: `[${speaker}]`, style: speakerStyle });
    speakerText.position.set(-w / 2 + 10, 8);

    const messageStyle = new TextStyle({
      fontFamily: 'monospace',
      fontSize: 10,
      fill: 0xf8fafc,
      wordWrap: true,
      wordWrapWidth: w - 20,
    });
    const msgText = new Text({ text, style: messageStyle });
    msgText.position.set(-w / 2 + 10, 26);

    container.addChild(bubbleGfx);
    container.addChild(speakerText);
    container.addChild(msgText);

    container.position.set(this.app.screen.width / 2, 40);
    this.uiLayer.addChild(container);
    this.dialogueBubble = container;
  }

  public hideDialogueBubble(): void {
    if (this.dialogueBubble && this.uiLayer) {
      this.uiLayer.removeChild(this.dialogueBubble);
      this.dialogueBubble = null;
    }
  }

  public destroy(): void {
    if (this.currentAnimation) {
      this.currentAnimation.cancel();
      this.currentAnimation = null;
    }
    if (this.app) {
      this.app.destroy(true, { children: true });
      this.app = null;
    }
  }
}
