import {
  Entity,
  InventoryItem,
  Room,
  WorldStateInterface,
  GameDefinition,
} from '../types/index.js';
import { EventEmitter } from './EventEmitter.js';

export class WorldState implements WorldStateInterface {
  public currentRoomId: string;
  public inventory: Map<string, InventoryItem> = new Map();
  public entities: Map<string, Entity> = new Map();
  public rooms: Map<string, Room> = new Map();
  public customState: Map<string, unknown> = new Map();
  private emitter: EventEmitter;

  constructor(definition: GameDefinition, emitter: EventEmitter) {
    this.emitter = emitter;
    this.currentRoomId = definition.initialRoomId;

    // Deep clone rooms
    Object.entries(definition.rooms).forEach(([id, room]) => {
      this.rooms.set(id, JSON.parse(JSON.stringify(room)));
    });

    // Deep clone entities
    Object.entries(definition.entities).forEach(([id, entity]) => {
      this.entities.set(id, JSON.parse(JSON.stringify(entity)));
    });

    // Load initial custom state
    if (definition.initialState) {
      Object.entries(definition.initialState).forEach(([key, val]) => {
        this.customState.set(key, JSON.parse(JSON.stringify(val)));
      });
    }
  }

  public setCurrentRoom(roomId: string): void {
    if (!this.rooms.has(roomId)) {
      throw new Error(`Room with ID "${roomId}" does not exist.`);
    }
    const prevRoomId = this.currentRoomId;
    this.currentRoomId = roomId;

    // Move player entity to default position of the new room if available
    const player = this.getEntity('robot');
    const room = this.rooms.get(roomId);
    if (player && room) {
      player.roomId = roomId;
      player.position = { ...room.defaultPlayerPosition };
    }

    this.emitter.emit('room:changed', { previous: prevRoomId, current: roomId });
    this.emitter.emit('state:updated', this.snapshot());
  }

  public addToInventory(item: InventoryItem): void {
    this.inventory.set(item.id, { ...item });
    this.emitter.emit('inventory:added', item);
    this.emitter.emit('state:updated', this.snapshot());
  }

  public removeFromInventory(itemId: string): boolean {
    const item = this.inventory.get(itemId);
    if (item) {
      this.inventory.delete(itemId);
      this.emitter.emit('inventory:removed', item);
      this.emitter.emit('state:updated', this.snapshot());
      return true;
    }
    return false;
  }

  public hasItem(itemId: string): boolean {
    return this.inventory.has(itemId);
  }

  public getItem(itemId: string): InventoryItem | undefined {
    return this.inventory.get(itemId);
  }

  public getEntity(entityId: string): Entity | undefined {
    return this.entities.get(entityId);
  }

  public updateEntity(entityId: string, updater: (entity: Entity) => void): void {
    const entity = this.entities.get(entityId);
    if (entity) {
      updater(entity);
      this.emitter.emit('entity:updated', entity);
      this.emitter.emit('state:updated', this.snapshot());
    }
  }

  public getState<T>(key: string, defaultValue?: T): T {
    if (this.customState.has(key)) {
      return this.customState.get(key) as T;
    }
    return defaultValue as T;
  }

  public setState<T>(key: string, value: T): void {
    this.customState.set(key, value);
    this.emitter.emit('customState:updated', { key, value });
    this.emitter.emit('state:updated', this.snapshot());
  }

  public snapshot(): Record<string, unknown> {
    return {
      currentRoomId: this.currentRoomId,
      inventory: Array.from(this.inventory.values()),
      entities: Array.from(this.entities.values()),
      customState: Object.fromEntries(this.customState.entries()),
    };
  }
}
