import {
  ActionResult,
  ActionVerb,
  EngineInterface,
  GameDefinition,
  InventoryItem,
  Position2D,
} from '../types/index.js';
import { EventEmitter } from './EventEmitter.js';
import { WorldState } from './WorldState.js';

export class ActionPipeline {
  private definition: GameDefinition;
  private state: WorldState;
  private emitter: EventEmitter;
  private engine: EngineInterface;

  constructor(
    definition: GameDefinition,
    state: WorldState,
    emitter: EventEmitter,
    engine: EngineInterface
  ) {
    this.definition = definition;
    this.state = state;
    this.emitter = emitter;
    this.engine = engine;
  }

  public async execute(
    verb: ActionVerb,
    params: Record<string, unknown>
  ): Promise<ActionResult> {
    // 1. Check custom game action hooks first
    const customHook = this.definition.actionHooks?.[verb];
    if (customHook) {
      const hookResult = await customHook(params, this.engine);
      if (hookResult !== undefined) {
        return hookResult;
      }
    }

    // 2. Default standard engine verb logic
    switch (verb) {
      case 'list_inventory':
        return this.handleListInventory();
      case 'look_at':
        return this.handleLookAt(params);
      case 'walk_to':
        return await this.handleWalkTo(params);
      case 'pick_up':
        return await this.handlePickUp(params);
      case 'open':
        return this.handleOpen(params);
      case 'close':
        return this.handleClose(params);
      case 'push':
        return this.handlePush(params);
      case 'pull':
        return this.handlePull(params);
      case 'use':
        return await this.handleUse(params);
      case 'give':
        return await this.handleGive(params);
      case 'talk_to':
        return await this.handleTalkTo(params);
      default:
        return {
          success: false,
          message: `Unknown action verb: "${verb}"`,
        };
    }
  }

  private handleListInventory(): ActionResult {
    const items = Array.from(this.state.inventory.values());
    if (items.length === 0) {
      return {
        success: true,
        message: 'Your inventory is currently empty.',
        data: { items: [] },
      };
    }
    const itemNames = items.map((i) => `${i.name} (${i.description})`).join(', ');
    return {
      success: true,
      message: `Inventory contains: ${itemNames}`,
      data: { items },
    };
  }

  private handleLookAt(params: Record<string, unknown>): ActionResult {
    const rawTarget = String(params.target || '').trim().toLowerCase();
    if (!rawTarget) {
      return { success: false, message: 'Look at what? Please specify a target.' };
    }

    // Look at current room
    const currentRoom = this.state.rooms.get(this.state.currentRoomId);
    if (
      rawTarget === 'room' ||
      rawTarget === 'area' ||
      rawTarget === 'around' ||
      rawTarget === currentRoom?.name.toLowerCase() ||
      rawTarget === this.state.currentRoomId.toLowerCase()
    ) {
      if (!currentRoom) {
        return { success: false, message: 'Cannot find room details.' };
      }
      const visibleEntities = Array.from(this.state.entities.values()).filter(
        (e) => e.roomId === this.state.currentRoomId && e.id !== 'robot' && e.visible !== false
      );
      const exitList = Object.values(currentRoom.exits)
        .map((exit) => `${exit.name} (to ${exit.targetRoomId})`)
        .join(', ');
      const entityList =
        visibleEntities.length > 0
          ? ` Visible objects/entities: ${visibleEntities.map((e) => e.name).join(', ')}.`
          : '';
      const exitsStr = exitList ? ` Available exits: ${exitList}.` : '';

      return {
        success: true,
        message: `[${currentRoom.name}] ${currentRoom.description}${entityList}${exitsStr}`,
        data: { room: currentRoom, entities: visibleEntities },
      };
    }

    // Look at inventory item
    const inventoryItem = Array.from(this.state.inventory.values()).find(
      (i) => i.id.toLowerCase() === rawTarget || i.name.toLowerCase().includes(rawTarget)
    );
    if (inventoryItem) {
      return {
        success: true,
        message: `[Inventory: ${inventoryItem.name}] ${inventoryItem.description}${
          inventoryItem.details ? ' ' + inventoryItem.details : ''
        }`,
        data: { item: inventoryItem },
      };
    }

    // Look at room exit
    if (currentRoom) {
      for (const [exitId, exit] of Object.entries(currentRoom.exits)) {
        if (
          exitId.toLowerCase() === rawTarget ||
          exit.name.toLowerCase().includes(rawTarget) ||
          exit.targetRoomId.toLowerCase() === rawTarget
        ) {
          const lockStatus = exit.isLocked ? ' It appears to be locked.' : ' It is open.';
          return {
            success: true,
            message: `${exit.name} leading to ${exit.targetRoomId}.${
              exit.description ? ' ' + exit.description : ''
            }${lockStatus}`,
            data: { exit },
          };
        }
      }
    }

    // Look at entity in current room
    const entity = this.findEntityInCurrentRoom(rawTarget);
    if (entity) {
      return {
        success: true,
        message: `[${entity.name}] ${entity.description}`,
        data: { entity },
      };
    }

    return {
      success: false,
      message: `You do not see "${params.target}" here.`,
    };
  }

  private async handleWalkTo(params: Record<string, unknown>): Promise<ActionResult> {
    const rawTarget = String(params.target || '').trim().toLowerCase();
    const rawPos = params.position as Position2D | undefined;

    // Handle coordinate/position walking directly
    if (rawPos && typeof rawPos.x === 'number' && typeof rawPos.y === 'number') {
      const renderer = this.getRenderer();
      if (renderer) {
        await renderer.animatePlayerTo(rawPos);
      } else {
        const player = this.state.getEntity('robot');
        if (player) player.position = { ...rawPos };
      }
      return {
        success: true,
        message: `Walked to position (${Math.round(rawPos.x)}, ${Math.round(rawPos.y)}).`,
        data: { position: rawPos },
      };
    }

    if (!rawTarget) {
      return { success: false, message: 'Walk to where? Please specify a destination.' };
    }

    const currentRoom = this.state.rooms.get(this.state.currentRoomId);
    if (!currentRoom) {
      return { success: false, message: 'Invalid room state.' };
    }

    // Check if target matches an exit from current room
    for (const [exitKey, exit] of Object.entries(currentRoom.exits)) {
      if (
        exitKey.toLowerCase() === rawTarget ||
        exit.name.toLowerCase().includes(rawTarget) ||
        exit.targetRoomId.toLowerCase() === rawTarget
      ) {
        const renderer = this.getRenderer();

        if (exit.isLocked) {
          if (renderer) {
            await renderer.animatePlayerTo(exit.position);
          }
          return {
            success: false,
            message: `The door to ${exit.targetRoomId} is locked. You must unlock it first.`,
          };
        }

        const targetRoom = this.state.rooms.get(exit.targetRoomId);
        if (!targetRoom) {
          return {
            success: false,
            message: `Destination room "${exit.targetRoomId}" is not accessible.`,
          };
        }

        // 1. Animate walking to exit door in current room
        if (renderer) {
          await renderer.animatePlayerTo(exit.position);
        }

        // 2. Change room in world state
        const prevRoomId = this.state.currentRoomId;
        this.state.setCurrentRoom(exit.targetRoomId);

        // 3. Position player near entrance exit in target room, then animate inward
        if (renderer) {
          const returnExit = Object.values(targetRoom.exits).find(
            (e) => e.targetRoomId === prevRoomId
          );
          const entrancePos = returnExit ? returnExit.position : targetRoom.defaultPlayerPosition;

          renderer.setPlayerPosition(entrancePos);

          const inwardPos = {
            x: Math.round(entrancePos.x * 0.5 + targetRoom.defaultPlayerPosition.x * 0.5),
            y: Math.round(entrancePos.y * 0.5 + targetRoom.defaultPlayerPosition.y * 0.5),
          };

          await renderer.animatePlayerTo(inwardPos);
        }

        return {
          success: true,
          message: `Walked through ${exit.name} into ${targetRoom.name}.`,
          data: { roomId: targetRoom.id },
        };
      }
    }

    // Check if target is an entity in current room
    const entity = this.findEntityInCurrentRoom(rawTarget);
    if (entity) {
      const renderer = this.getRenderer();
      const playerPos = this.state.getEntity('robot')?.position ?? { x: 400, y: 260 };
      const dx = entity.position.x - playerPos.x;
      const targetPos = {
        x: Math.round(entity.position.x + (dx >= 0 ? -35 : 35)),
        y: entity.position.y,
      };

      if (renderer) {
        await renderer.animatePlayerTo(targetPos);
      } else {
        const player = this.state.getEntity('robot');
        if (player) {
          player.position = targetPos;
        }
      }

      return {
        success: true,
        message: `Walked over to ${entity.name}.`,
        data: { entity },
      };
    }

    return {
      success: false,
      message: `Cannot walk to "${params.target}". There is no such exit or object in this area.`,
    };
  }

  private async handlePickUp(params: Record<string, unknown>): Promise<ActionResult> {
    const rawTarget = String(params.target || '').trim().toLowerCase();
    if (!rawTarget) {
      return { success: false, message: 'Pick up what? Please specify an item.' };
    }

    const entity = this.findEntityInCurrentRoom(rawTarget);
    if (!entity) {
      return {
        success: false,
        message: `You do not see "${params.target}" here to pick up.`,
      };
    }

    if (entity.type !== 'item') {
      return {
        success: false,
        message: `You cannot pick up the ${entity.name}.`,
      };
    }

    // Animate walking over to the item first
    const renderer = this.getRenderer();
    const playerPos = this.state.getEntity('robot')?.position ?? { x: 400, y: 260 };
    const dx = entity.position.x - playerPos.x;
    const targetPos = {
      x: Math.round(entity.position.x + (dx >= 0 ? -25 : 25)),
      y: entity.position.y,
    };

    if (renderer) {
      await renderer.animatePlayerTo(targetPos);
    } else {
      const player = this.state.getEntity('robot');
      if (player) {
        player.position = targetPos;
      }
    }

    // Remove entity from room and place into inventory
    entity.visible = false;
    const inventoryItem: InventoryItem = {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      details: (entity.state.details as string) || undefined,
    };

    this.state.addToInventory(inventoryItem);
    this.engine.playSfx('pickup');

    return {
      success: true,
      message: `Picked up the ${entity.name} and added it to inventory.`,
      data: { item: inventoryItem },
    };
  }

  private handleOpen(params: Record<string, unknown>): ActionResult {
    const rawTarget = String(params.target || '').trim().toLowerCase();
    if (!rawTarget) {
      return { success: false, message: 'Open what?' };
    }

    const currentRoom = this.state.rooms.get(this.state.currentRoomId);
    if (currentRoom) {
      for (const [, exit] of Object.entries(currentRoom.exits)) {
        if (
          exit.name.toLowerCase().includes(rawTarget) ||
          exit.targetRoomId.toLowerCase() === rawTarget
        ) {
          if (exit.isLocked) {
            return {
              success: false,
              message: `${exit.name} is locked. You need a key or PIN code to open it.`,
            };
          }
          return {
            success: true,
            message: `${exit.name} is open.`,
          };
        }
      }
    }

    const entity = this.findEntityInCurrentRoom(rawTarget);
    if (entity) {
      if (entity.state.isOpen !== undefined) {
        if (entity.state.isOpen) {
          return { success: true, message: `The ${entity.name} is already open.` };
        }
        entity.state.isOpen = true;
        this.emitter.emit('entity:updated', entity);
        return { success: true, message: `Opened the ${entity.name}.` };
      }
      return { success: false, message: `The ${entity.name} cannot be opened.` };
    }

    return { success: false, message: `Cannot find "${params.target}" to open.` };
  }

  private handleClose(params: Record<string, unknown>): ActionResult {
    const rawTarget = String(params.target || '').trim().toLowerCase();
    if (!rawTarget) {
      return { success: false, message: 'Close what?' };
    }

    const entity = this.findEntityInCurrentRoom(rawTarget);
    if (entity) {
      if (entity.state.isOpen !== undefined) {
        if (!entity.state.isOpen) {
          return { success: true, message: `The ${entity.name} is already closed.` };
        }
        entity.state.isOpen = false;
        this.emitter.emit('entity:updated', entity);
        return { success: true, message: `Closed the ${entity.name}.` };
      }
      return { success: false, message: `The ${entity.name} cannot be closed.` };
    }

    return { success: false, message: `Cannot find "${params.target}" to close.` };
  }

  private handlePush(params: Record<string, unknown>): ActionResult {
    const rawTarget = String(params.target || '').trim().toLowerCase();
    if (!rawTarget) {
      return { success: false, message: 'Push what?' };
    }
    const entity = this.findEntityInCurrentRoom(rawTarget);
    if (!entity) {
      return { success: false, message: `You do not see "${params.target}" here to push.` };
    }
    return {
      success: true,
      message: `Pushed the ${entity.name}.`,
    };
  }

  private handlePull(params: Record<string, unknown>): ActionResult {
    const rawTarget = String(params.target || '').trim().toLowerCase();
    if (!rawTarget) {
      return { success: false, message: 'Pull what?' };
    }
    const entity = this.findEntityInCurrentRoom(rawTarget);
    if (!entity) {
      return { success: false, message: `You do not see "${params.target}" here to pull.` };
    }
    return {
      success: true,
      message: `Pulled the ${entity.name}.`,
    };
  }

  private async handleUse(params: Record<string, unknown>): Promise<ActionResult> {
    const rawTarget = String(params.target || '').trim().toLowerCase();
    const rawItem = params.item ? String(params.item).trim().toLowerCase() : undefined;

    if (!rawTarget) {
      return { success: false, message: 'Use what? Please specify a target.' };
    }

    if (rawItem && !this.state.hasItem(rawItem)) {
      const itemInInv = Array.from(this.state.inventory.values()).find(
        (i) => i.id.toLowerCase() === rawItem || i.name.toLowerCase().includes(rawItem)
      );
      if (!itemInInv) {
        return {
          success: false,
          message: `You do not have "${params.item}" in your inventory to use.`,
        };
      }
    }

    // Animate walking to target entity if in current room
    const entity = this.findEntityInCurrentRoom(rawTarget);
    if (entity) {
      const renderer = this.getRenderer();
      const playerPos = this.state.getEntity('robot')?.position ?? { x: 400, y: 260 };
      const dx = entity.position.x - playerPos.x;
      const targetPos = {
        x: Math.round(entity.position.x + (dx >= 0 ? -35 : 35)),
        y: entity.position.y,
      };

      if (renderer) {
        await renderer.animatePlayerTo(targetPos);
      } else {
        const player = this.state.getEntity('robot');
        if (player) {
          player.position = targetPos;
        }
      }
    }

    return {
      success: false,
      message: `Using ${rawItem ? rawItem + ' on ' : ''}${rawTarget} has no effect right now.`,
    };
  }

  private async handleGive(params: Record<string, unknown>): Promise<ActionResult> {
    const rawTarget = String(params.target || '').trim().toLowerCase();
    const rawItem = String(params.item || '').trim().toLowerCase();

    if (!rawItem || !rawTarget) {
      return { success: false, message: 'Give what to whom? Both item and target are required.' };
    }

    const item = Array.from(this.state.inventory.values()).find(
      (i) => i.id.toLowerCase() === rawItem || i.name.toLowerCase().includes(rawItem)
    );

    if (!item) {
      return {
        success: false,
        message: `You do not have "${params.item}" in your inventory.`,
      };
    }

    const npc = this.findEntityInCurrentRoom(rawTarget);
    if (!npc || npc.type !== 'npc') {
      return {
        success: false,
        message: `There is no NPC named "${params.target}" here to give the item to.`,
      };
    }

    // Animate walking over to NPC first
    const renderer = this.getRenderer();
    const playerPos = this.state.getEntity('robot')?.position ?? { x: 400, y: 260 };
    const dx = npc.position.x - playerPos.x;
    const targetPos = {
      x: Math.round(npc.position.x + (dx >= 0 ? -40 : 40)),
      y: npc.position.y,
    };

    if (renderer) {
      await renderer.animatePlayerTo(targetPos);
    } else {
      const player = this.state.getEntity('robot');
      if (player) {
        player.position = targetPos;
      }
    }

    return {
      success: false,
      message: `${npc.name} does not seem to want the ${item.name}.`,
    };
  }

  private async handleTalkTo(params: Record<string, unknown>): Promise<ActionResult> {
    const rawTarget = String(params.target || '').trim().toLowerCase();
    const message = String(params.message || '').trim();

    if (!rawTarget || !message) {
      return {
        success: false,
        message: 'Talk to whom and say what? Both target and message are required.',
      };
    }

    const npcEntity = this.findEntityInCurrentRoom(rawTarget);
    if (!npcEntity || npcEntity.type !== 'npc') {
      return {
        success: false,
        message: `There is no NPC named "${params.target}" in this room to talk to.`,
      };
    }

    // Animate walking over to NPC first
    const renderer = this.getRenderer();
    const playerPos = this.state.getEntity('robot')?.position ?? { x: 400, y: 260 };
    const dx = npcEntity.position.x - playerPos.x;
    const targetPos = {
      x: Math.round(npcEntity.position.x + (dx >= 0 ? -40 : 40)),
      y: npcEntity.position.y,
    };

    if (renderer) {
      await renderer.animatePlayerTo(targetPos);
    } else {
      const player = this.state.getEntity('robot');
      if (player) {
        player.position = targetPos;
      }
    }

    const npcConfig = this.definition.npcs[npcEntity.id];
    if (!npcConfig) {
      return {
        success: true,
        message: `${npcEntity.name} does not respond.`,
      };
    }

    const context = {
      speakerId: npcEntity.id,
      speakerName: npcEntity.name,
      currentRoomId: this.state.currentRoomId,
      worldState: Object.fromEntries(this.state.customState.entries()),
      inventory: Array.from(this.state.inventory.values()),
    };

    const reply = await npcConfig.handler(message, context);
    this.emitter.emit('dialogue:turn', {
      npcId: npcEntity.id,
      npcName: npcEntity.name,
      playerMessage: message,
      npcReply: reply,
    });

    return {
      success: true,
      message: `[${npcEntity.name}]: "${reply}"`,
      data: { reply, npcId: npcEntity.id },
    };
  }

  private findEntityInCurrentRoom(rawName: string) {
    const currentRoomId = this.state.currentRoomId;
    return Array.from(this.state.entities.values()).find(
      (e) =>
        e.roomId === currentRoomId &&
        (e.id.toLowerCase() === rawName ||
          e.name.toLowerCase() === rawName ||
          e.name.toLowerCase().includes(rawName)) &&
        e.visible !== false
    );
  }

  private getRenderer() {
    return (this.engine as unknown as { renderer?: { animatePlayerTo: (pos: Position2D, speed?: number) => Promise<void>; setPlayerPosition: (pos: Position2D) => void } }).renderer;
  }
}
