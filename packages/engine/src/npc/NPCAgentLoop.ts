import {
  NPCConfig,
  NPCDialogueContext,
  WebMCPToolSchema,
} from '../types/index.js';

export class NPCAgentLoop {
  public readonly id: string;
  public readonly name: string;
  public readonly systemPrompt?: string;
  public readonly personality?: string;
  public readonly tools: WebMCPToolSchema[];
  private handler: (
    message: string,
    context: NPCDialogueContext
  ) => Promise<string> | string;
  private messageHistory: Array<{ role: 'user' | 'assistant'; text: string }> = [];

  constructor(config: NPCConfig) {
    this.id = config.id;
    this.name = config.name;
    this.systemPrompt = config.systemPrompt;
    this.personality = config.personality;
    this.tools = config.tools || [];
    this.handler = config.handler;
  }

  public async processMessage(
    message: string,
    context: NPCDialogueContext
  ): Promise<string> {
    this.messageHistory.push({ role: 'user', text: message });
    const response = await this.handler(message, context);
    this.messageHistory.push({ role: 'assistant', text: response });
    return response;
  }

  public getHistory(): ReadonlyArray<{ role: 'user' | 'assistant'; text: string }> {
    return this.messageHistory;
  }

  public clearHistory(): void {
    this.messageHistory = [];
  }
}
