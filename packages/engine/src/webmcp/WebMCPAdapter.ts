import {
  ActionResult,
  ActionVerb,
  EngineInterface,
  WebMCPToolSchema,
} from '../types/index.js';
import { STANDARD_WEBMCP_TOOLS } from './schemas.js';

interface ModelContextNavigator extends Navigator {
  modelContext?: {
    registerTool: (tool: {
      name: string;
      description: string;
      inputSchema: Record<string, unknown>;
      execute: (params: Record<string, unknown>) => Promise<unknown>;
    }) => void;
    unregisterTool?: (name: string) => void;
    provideContext?: (context: unknown) => void;
  };
}

export class WebMCPAdapter {
  private engine: EngineInterface;
  private tools: Map<string, WebMCPToolSchema> = new Map();
  private isRegisteredWithBrowser = false;

  constructor(engine: EngineInterface) {
    this.engine = engine;
    Object.values(STANDARD_WEBMCP_TOOLS).forEach((schema) => {
      this.tools.set(schema.name, schema);
    });
  }

  public registerTool(schema: WebMCPToolSchema): void {
    this.tools.set(schema.name, schema);
    this.syncWithNavigator();
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

  public syncWithNavigator(): boolean {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return false;
    }

    const nav = navigator as ModelContextNavigator;
    if (!nav.modelContext || typeof nav.modelContext.registerTool !== 'function') {
      return false;
    }

    try {
      for (const tool of this.tools.values()) {
        nav.modelContext.registerTool({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema as Record<string, unknown>,
          execute: async (params: Record<string, unknown>) => {
            const result = await this.invokeTool(tool.name, params, true);
            return result;
          },
        });
      }
      this.isRegisteredWithBrowser = true;
      return true;
    } catch (err) {
      console.warn('WebMCP navigator.modelContext registration failed:', err);
      return false;
    }
  }

  public isWebMCPSupported(): boolean {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return false;
    }
    const nav = navigator as ModelContextNavigator;
    return !!(nav.modelContext && typeof nav.modelContext.registerTool === 'function');
  }

  public isRegistered(): boolean {
    return this.isRegisteredWithBrowser;
  }
}
