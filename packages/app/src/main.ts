import {
  ActionVerb,
  CommandLogEntry,
  Entity,
  Position2D,
} from '@webmcp-adventure/engine';
import { createSpaceshipGameEngine } from '@webmcp-adventure/game';

let engine = createSpaceshipGameEngine();

async function initApp() {
  const viewportContainer = document.getElementById('pixi-viewport');
  if (!viewportContainer) {
    console.error('Viewport container not found');
    return;
  }

  // 1. Initialize PixiJS 2D Renderer
  await engine.initRenderer({
    containerElement: viewportContainer,
    onEntityClick: (entity: Entity) => {
      if (entity.type === 'item') {
        engine.executeAction('pick_up', { target: entity.id });
      } else if (entity.type === 'npc') {
        engine.executeAction('look_at', { target: entity.id });
      } else {
        engine.executeAction('look_at', { target: entity.id });
      }
    },
    onExitClick: (targetRoomId: string) => {
      engine.executeAction('walk_to', { target: targetRoomId });
    },
    onPositionClick: (position: Position2D) => {
      engine.executeAction('walk_to', { position });
    },
  });

  // 2. Sync WebMCP with browser navigator.modelContext
  const registered = engine.webmcp.syncWithNavigator();
  const webmcpBadge = document.getElementById('webmcp-status');
  if (webmcpBadge) {
    if (registered) {
      webmcpBadge.innerHTML = '<span class="pulse"></span> WebMCP Native';
    } else {
      webmcpBadge.innerHTML = '<span class="pulse"></span> WebMCP Ready';
    }
  }

  // 3. Bind UI & Engine Event Listeners
  bindEngineEvents();
  bindUIControls();

  // Initial HUD Render
  updateHUD();
  updateMissionStatus();

  // Initial Room Look
  await engine.executeAction('look_at', { target: 'room' });
}

function bindEngineEvents() {
  // Command log streaming to bottom pane
  engine.emitter.on('command:logged', (data: unknown) => {
    const entry = data as CommandLogEntry;
    renderLogEntry(entry);
    updateHUD();
    updateMissionStatus();
  });

  engine.emitter.on('command:cleared', () => {
    const logStream = document.getElementById('log-stream');
    if (logStream) {
      logStream.innerHTML = '';
    }
    updateLogCount();
  });

  engine.emitter.on('game:won', (data: unknown) => {
    const winData = data as { message?: string };
    showWinModal(winData.message || 'Mission Accomplished!');
  });
}

function renderLogEntry(entry: CommandLogEntry) {
  const logStream = document.getElementById('log-stream');
  if (!logStream) return;

  const entryDiv = document.createElement('div');
  entryDiv.className = `log-entry ${entry.result.success ? 'success' : 'failure'}`;

  const timeStr = new Date(entry.timestamp).toLocaleTimeString();
  const paramsStr = JSON.stringify(entry.params);

  entryDiv.innerHTML = `
    <div class="log-entry-header">
      <span class="log-time">[${timeStr}]</span>
      <span class="log-tool">&gt; ${entry.toolName}</span>
      <span class="log-params">${paramsStr !== '{}' ? paramsStr : ''}</span>
    </div>
    <div class="log-msg">${entry.result.message}</div>
  `;

  logStream.appendChild(entryDiv);
  logStream.scrollTop = logStream.scrollHeight;

  updateLogCount();
}

function updateLogCount() {
  const countSpan = document.getElementById('log-count');
  if (countSpan) {
    const total = engine.getCommandLogs().length;
    countSpan.innerText = `${total} command${total === 1 ? '' : 's'} logged`;
  }
}

function updateHUD() {
  const state = engine.getWorldState();

  // Update room label
  const roomNameEl = document.getElementById('current-room-name');
  const currentRoom = state.rooms.get(state.currentRoomId);
  if (roomNameEl && currentRoom) {
    roomNameEl.innerText = currentRoom.name;
  }

  // Update inventory list
  const invContainer = document.getElementById('inventory-tags');
  if (invContainer) {
    const items = Array.from(state.inventory.values());
    if (items.length === 0) {
      invContainer.innerHTML = '<span class="empty-tag">(Empty)</span>';
    } else {
      invContainer.innerHTML = items
        .map((i) => `<span class="inv-tag" title="${i.description}">${i.name}</span>`)
        .join('');
    }
  }
}

function updateMissionStatus() {
  const state = engine.getWorldState();
  const coursePlotted = !!state.getState<boolean>('coursePlotted');
  const shipOriented = !!state.getState<boolean>('shipOriented');
  const hyperdriveActive = !!state.getState<boolean>('hyperdriveActive');

  const chip1 = document.getElementById('status-sg1');
  const chip2 = document.getElementById('status-sg2');
  const chip3 = document.getElementById('status-sg3');

  if (chip1) {
    chip1.className = `status-chip ${coursePlotted ? 'completed' : ''}`;
  }
  if (chip2) {
    chip2.className = `status-chip ${shipOriented ? 'completed' : ''}`;
  }
  if (chip3) {
    chip3.className = `status-chip ${hyperdriveActive ? 'completed' : ''}`;
  }
}

function showWinModal(message: string) {
  const modal = document.getElementById('win-modal');
  const msgEl = document.getElementById('win-message');
  if (modal && msgEl) {
    msgEl.innerText = message;
    modal.classList.remove('hidden');
  }
}

function bindUIControls() {
  // Clear log button
  const clearBtn = document.getElementById('clear-log-btn');
  clearBtn?.addEventListener('click', () => engine.clearCommandLogs());

  // Restart button
  const restartBtn = document.getElementById('restart-btn');
  restartBtn?.addEventListener('click', () => {
    window.location.reload();
  });

  // Quick tool buttons
  document.querySelectorAll('.tool-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const toolName = btn.getAttribute('data-tool') as ActionVerb;
      if (!toolName) return;

      const rawParams = btn.getAttribute('data-params');
      if (rawParams) {
        try {
          const parsed = JSON.parse(rawParams);
          await engine.webmcp.invokeTool(toolName, parsed);
          return;
        } catch {
          // ignore
        }
      }

      const promptMsg = btn.getAttribute('data-prompt');
      if (promptMsg) {
        const input = window.prompt(promptMsg);
        if (input !== null) {
          await engine.webmcp.invokeTool(toolName, { target: input.trim() });
        }
        return;
      }

      const promptTarget = btn.getAttribute('data-prompt-target');
      const promptSub = btn.getAttribute('data-prompt-msg') || btn.getAttribute('data-prompt-item');
      if (promptTarget && promptSub) {
        const targetVal = window.prompt(promptTarget);
        if (targetVal !== null) {
          const subVal = window.prompt(promptSub);
          if (subVal !== null) {
            const params: Record<string, string> = { target: targetVal.trim() };
            if (toolName === 'talk_to') {
              params.message = subVal.trim();
            } else if (toolName === 'use') {
              if (subVal.trim()) params.item = subVal.trim();
            }
            await engine.webmcp.invokeTool(toolName, params);
          }
        }
        return;
      }

      await engine.webmcp.invokeTool(toolName, {});
    });
  });

  // Custom tool execution form
  const execBtn = document.getElementById('tool-exec-btn');
  const toolSelect = document.getElementById('tool-select') as HTMLSelectElement;
  const paramInput = document.getElementById('tool-param-input') as HTMLInputElement;

  const executeCustomTool = async () => {
    const verb = toolSelect.value as ActionVerb;
    const rawInput = paramInput.value.trim();
    let params: Record<string, unknown> = {};

    if (rawInput) {
      if (rawInput.startsWith('{') && rawInput.endsWith('}')) {
        try {
          params = JSON.parse(rawInput);
        } catch {
          params = { target: rawInput };
        }
      } else {
        // Plain string treated as target
        params = { target: rawInput };
      }
    }

    await engine.webmcp.invokeTool(verb, params);
    paramInput.value = '';
  };

  execBtn?.addEventListener('click', executeCustomTool);
  paramInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeCustomTool();
    }
  });
}

// Start application
window.addEventListener('DOMContentLoaded', initApp);
