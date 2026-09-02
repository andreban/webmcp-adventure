import {
  ActionResult,
  ActionVerb,
  EngineInterface,
  WebMCPToolSchema,
} from '../types/index.js';
import { STANDARD_WEBMCP_TOOLS } from './schemas.js';

interface ModelContextToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute?: (params: Record<string, unknown>) => Promise<unknown>;
  handler?: (params: Record<string, unknown>) => Promise<unknown>;
  annotations?: Record<string, unknown>;
}

interface ModelContextAPI {
  registerTool: (tool: ModelContextToolDefinition) => Promise<void> | void;
  unregisterTool?: (name: string) => Promise<void> | void;
  provideContext?: (context: unknown) => Promise<void> | void;
}

export class WebMCPAdapter {
  private engine: EngineInterface;
  private tools: Map<string, WebMCPToolSchema> = new Map();
  private registeredWithBrowserTools: Set<string> = new Set();
  private isRegisteredWithBrowser = false;

  constructor(engine: EngineInterface) {
    this.engine = engine;
    Object.values(STANDARD_WEBMCP_TOOLS).forEach((schema) => {
      this.tools.set(schema.name, schema);
    });
  }

  private getModelContext(): ModelContextAPI | null {
    if (typeof document !== 'undefined') {
      const docContext = (document as unknown as { modelContext?: ModelContextAPI }).modelContext;
      if (docContext && typeof docContext.registerTool === 'function') {
        return docContext;
      }
    }

    if (typeof navigator !== 'undefined') {
      const navContext = (navigator as unknown as { modelContext?: ModelContextAPI }).modelContext;
      if (navContext && typeof navContext.registerTool === 'function') {
        return navContext;
      }
    }

    if (typeof window !== 'undefined') {
      const winContext = (window as unknown as { modelContext?: ModelContextAPI }).modelContext;
      if (winContext && typeof winContext.registerTool === 'function') {
        return winContext;
      }
    }

    return null;
  }

  public async registerTool(schema: WebMCPToolSchema): Promise<boolean> {
    this.tools.set(schema.name, schema);
    const modelContext = this.getModelContext();
    if (!modelContext) {
      return false;
    }

    try {
      if (typeof modelContext.unregisterTool === 'function') {
        try {
          await modelContext.unregisterTool(schema.name);
        } catch {
          // Ignore if tool was not previously registered
        }
      }

      const executeFn = async (params: Record<string, unknown> = {}) => {
        const result = await this.invokeTool(schema.name, params, true);
        return result;
      };

      const toolDef: ModelContextToolDefinition = {
        name: schema.name,
        description: schema.description,
        inputSchema: schema.inputSchema as Record<string, unknown>,
        execute: executeFn,
        handler: executeFn,
      };

      await modelContext.registerTool(toolDef);
      this.registeredWithBrowserTools.add(schema.name);
      return true;
    } catch (err) {
      console.warn(`WebMCP registration failed for tool ${schema.name}:`, err);
      return false;
    }
  }

  public getRegisteredTools(): WebMCPToolSchema[] {
    return Array.from(this.tools.values());
  }

  public async invokeTool(
    verb: string,
    params: Record<string, unknown> = {},
    isAgent = false
  ): Promise<ActionResult> {
    try {
      const result = await this.engine.executeAction(verb as ActionVerb, params);
      this.engine.logCommand({
        toolName: verb,
        params,
        result,
        isAgent,
      });
      return result;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      const result: ActionResult = {
        success: false,
        message: `Error executing ${verb}: ${errorMessage}`,
      };
      this.engine.logCommand({
        toolName: verb,
        params,
        result,
        isAgent,
      });
      return result;
    }
  }

  public async syncWithModelContext(): Promise<boolean> {
    const modelContext = this.getModelContext();
    if (!modelContext) {
      return false;
    }

    try {
      for (const tool of this.tools.values()) {
        if (typeof modelContext.unregisterTool === 'function') {
          try {
            await modelContext.unregisterTool(tool.name);
          } catch {
            // Ignore error if tool was not registered
          }
        }

        const executeFn = async (params: Record<string, unknown> = {}) => {
          const result = await this.invokeTool(tool.name, params, true);
          return result;
        };

        const toolDef: ModelContextToolDefinition = {
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema as Record<string, unknown>,
          execute: executeFn,
          handler: executeFn,
        };

        await modelContext.registerTool(toolDef);
        this.registeredWithBrowserTools.add(tool.name);
      }

      this.isRegisteredWithBrowser = true;
      return true;
    } catch (err) {
      console.warn('WebMCP modelContext registration failed:', err);
      return false;
    }
  }

  public async syncWithNavigator(): Promise<boolean> {
    return this.syncWithModelContext();
  }

  public isWebMCPSupported(): boolean {
    return this.getModelContext() !== null;
  }

  public isRegistered(): boolean {
    return this.isRegisteredWithBrowser && this.registeredWithBrowserTools.size > 0;
  }
}
