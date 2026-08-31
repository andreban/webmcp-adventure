import {
  ActionResult,
  ActionVerb,
  CommandLogEntry,
  EngineInterface,
  GameDefinition,
  WorldStateInterface,
} from '../types/index.js';
import { EventEmitter } from './EventEmitter.js';
import { WorldState } from './WorldState.js';
import { ActionPipeline } from './ActionPipeline.js';
import { WebMCPAdapter } from '../webmcp/WebMCPAdapter.js';
import { AudioManager } from '../audio/AudioManager.js';
import { PixiSceneManager, PixiSceneOptions } from '../render/PixiSceneManager.js';

export class AdventureEngine implements EngineInterface {
  public readonly definition: GameDefinition;
  public readonly emitter: EventEmitter;
  public readonly worldState: WorldState;
  public readonly pipeline: ActionPipeline;
  public readonly webmcp: WebMCPAdapter;
  public readonly audio: AudioManager;
  public renderer: PixiSceneManager | null = null;

  private commandLogs: CommandLogEntry[] = [];
  private logIdCounter = 0;

  constructor(definition: GameDefinition) {
    this.definition = definition;
    this.emitter = new EventEmitter();
    this.worldState = new WorldState(definition, this.emitter);
    this.pipeline = new ActionPipeline(definition, this.worldState, this.emitter, this);
    this.webmcp = new WebMCPAdapter(this);
    this.audio = new AudioManager();

    // Auto check win condition on state change
    this.emitter.on('state:updated', () => {
      if (this.definition.checkWinCondition) {
        const winResult = this.definition.checkWinCondition(this);
        if (winResult.won) {
          this.emitter.emit('game:won', winResult);
        }
      }
    });
  }

  public async initRenderer(options: PixiSceneOptions): Promise<PixiSceneManager> {
    this.renderer = new PixiSceneManager(options, this.emitter);
    await this.renderer.init(this.worldState);
    return this.renderer;
  }

  public async executeAction(
    verb: ActionVerb,
    params: Record<string, unknown> = {}
  ): Promise<ActionResult> {
    const result = await this.pipeline.execute(verb, params);
    return result;
  }

  public logCommand(entry: Omit<CommandLogEntry, 'id' | 'timestamp'>): CommandLogEntry {
    const fullEntry: CommandLogEntry = {
      ...entry,
      id: `log_${++this.logIdCounter}_${Date.now()}`,
      timestamp: Date.now(),
    };
    this.commandLogs.push(fullEntry);
    this.emitter.emit('command:logged', fullEntry);
    return fullEntry;
  }

  public getCommandLogs(): ReadonlyArray<CommandLogEntry> {
    return this.commandLogs;
  }

  public clearCommandLogs(): void {
    this.commandLogs = [];
    this.emitter.emit('command:cleared', {});
  }

  public getWorldState(): WorldStateInterface {
    return this.worldState;
  }

  public emitEvent(eventName: string, data: unknown): void {
    this.emitter.emit(eventName, data);
  }

  public playSfx(soundName: string): void {
    this.audio.play(soundName);
  }
}
