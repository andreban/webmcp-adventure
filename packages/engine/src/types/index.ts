/**
 * WebMCP Adventure Engine - Core Types
 */

export type ActionVerb =
  | 'list_inventory'
  | 'look_at'
  | 'walk_to'
  | 'pick_up'
  | 'open'
  | 'close'
  | 'push'
  | 'pull'
  | 'use'
  | 'give'
  | 'talk_to';

export interface ActionResult {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

export interface ToolParameter {
  type: string;
  description?: string;
  enum?: string[];
}

export interface WebMCPToolSchema {
  name: ActionVerb | string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, ToolParameter>;
    required?: string[];
    additionalProperties?: boolean;
  };
}

export interface CommandLogEntry {
  id: string;
  timestamp: number;
  toolName: string;
  params: Record<string, unknown>;
  result: ActionResult;
  isAgent?: boolean;
}

export interface Position2D {
  x: number;
  y: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  details?: string;
  icon?: string;
  category?: string;
}

export interface Entity {
  id: string;
  name: string;
  type: 'player' | 'npc' | 'item' | 'door' | 'interactive' | 'console' | 'prop';
  description: string;
  roomId: string;
  position: Position2D;
  visible?: boolean;
  state: Record<string, unknown>;
  color?: number;
  interactable?: boolean;
}

export interface RoomExit {
  targetRoomId: string;
  name: string;
  description?: string;
  isLocked?: boolean;
  requiredPin?: string;
  position: Position2D;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  backgroundImage?: string;
  exits: Record<string, RoomExit>;
  defaultPlayerPosition: Position2D;
  colorTheme?: {
    floor: number;
    wall: number;
    accent: number;
  };
}

export interface NPCDialogueContext {
  speakerId: string;
  speakerName: string;
  currentRoomId: string;
  worldState: Readonly<Record<string, unknown>>;
  inventory: ReadonlyArray<InventoryItem>;
}

export type NPCDialogueHandler = (
  message: string,
  context: NPCDialogueContext
) => Promise<string> | string;

export interface NPCConfig {
  id: string;
  name: string;
  systemPrompt?: string;
  personality?: string;
  tools?: WebMCPToolSchema[];
  handler: NPCDialogueHandler;
}

export interface GameDefinition {
  id: string;
  title: string;
  initialRoomId: string;
  rooms: Record<string, Room>;
  entities: Record<string, Entity>;
  items: Record<string, InventoryItem>;
  npcs: Record<string, NPCConfig>;
  initialState?: Record<string, unknown>;
  actionHooks?: Partial<
    Record<
      ActionVerb,
      (
        params: Record<string, unknown>,
        engine: EngineInterface
      ) => Promise<ActionResult | undefined> | ActionResult | undefined
    >
  >;
  onTick?: (engine: EngineInterface, delta: number) => void;
  checkWinCondition?: (engine: EngineInterface) => { won: boolean; message?: string };
}

export interface EngineInterface {
  getWorldState(): WorldStateInterface;
  executeAction(verb: ActionVerb, params: Record<string, unknown>): Promise<ActionResult>;
  logCommand(entry: Omit<CommandLogEntry, 'id' | 'timestamp'>): CommandLogEntry;
  emitEvent(eventName: string, data: unknown): void;
  playSfx(soundName: string): void;
}

export interface WorldStateInterface {
  currentRoomId: string;
  inventory: Map<string, InventoryItem>;
  entities: Map<string, Entity>;
  rooms: Map<string, Room>;
  customState: Map<string, unknown>;
  setCurrentRoom(roomId: string): void;
  addToInventory(item: InventoryItem): void;
  removeFromInventory(itemId: string): boolean;
  hasItem(itemId: string): boolean;
  getItem(itemId: string): InventoryItem | undefined;
  getEntity(entityId: string): Entity | undefined;
  updateEntity(entityId: string, updater: (entity: Entity) => void): void;
  getState<T>(key: string, defaultValue?: T): T;
  setState<T>(key: string, value: T): void;
  snapshot(): Record<string, unknown>;
}
