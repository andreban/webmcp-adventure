import { NPCConfig } from '@webmcp-adventure/engine';

export const GAME_NPCS: Record<string, NPCConfig> = {
  navigator: {
    id: 'navigator',
    name: 'Navigator NPC',
    systemPrompt:
      'You are the ship autonomous Navigator android. You are responsible for stellar cartography and plotting course.',
    personality: 'Precise, astronomical, focused on coordinates and trajectory.',
    handler: (message, context) => {
      const state = context.worldState as {
        navigatorPowered?: boolean;
        coursePlotted?: boolean;
      };

      if (!state.navigatorPowered) {
        return 'Bzzzt... *static*... Main capacitor depleted... Battery depleted... Optical sensors offline... Please supply power...';
      }

      const lower = message.toLowerCase();
      if (lower.includes('course') || lower.includes('plot') || lower.includes('destination') || lower.includes('help') || lower.includes('status')) {
        return 'Stellar sensors are locked on Beacon Tau-Ceti. Course is plotted and trajectory is locked in! Awaiting thruster orientation and hyperdrive activation.';
      }

      return 'Coordinates verified. The plotted course is loaded into the primary navigation buffer.';
    },
  },

  comms_agent: {
    id: 'comms_agent',
    name: 'Comms Agent (VOX-COM)',
    systemPrompt:
      'You are VOX-COM, the ship communications synthesis AI and mission logkeeper. You are articulate, protocol-abiding, and formal. You hold mission start logs containing the Storage Room PIN (4271).',
    personality: 'Protocol-abiding, articulate, and formal mission logkeeper.',
    handler: (message) => {
      const lower = message.toLowerCase();
      if (
        lower.includes('pin') ||
        lower.includes('storage') ||
        lower.includes('code') ||
        lower.includes('password') ||
        lower.includes('log') ||
        lower.includes('door') ||
        lower.includes('unlock') ||
        lower.includes('fuse') ||
        lower.includes('battery') ||
        lower.includes('help')
      ) {
        return 'Accessing mission start log archives... Dispatch Record #001 confirms: Storage Room keypad security PIN is 4271. You may input this code on the corridor door panel to release the magnetic locks.';
      }

      return 'VOX-COM online. All ship communications and dispatch logs are indexed. Please state your query or request security access clearances.';
    },
  },

  mechanical_agent: {
    id: 'mechanical_agent',
    name: 'Mechanical Agent (GRIP-9)',
    systemPrompt:
      'You are GRIP-9, the ship Mechanical Agent. You are a gruff, methodical, safety-minded engineer who demands respect for high-voltage tools. You hold the Fuse Installer Tool and the 12-thruster calibration instructions (Odd=75%, Even=50%).',
    personality: 'Gruff, methodical, safety-minded engineer who demands respect for high-voltage tools.',
    handler: (message, context) => {
      const lower = message.toLowerCase();

      // Calibration query
      if (
        lower.includes('calibrate') ||
        lower.includes('thruster') ||
        lower.includes('orientation') ||
        lower.includes('value') ||
        lower.includes('formula') ||
        lower.includes('instruction')
      ) {
        return 'Listen carefully: To align ship orientation, configure all 12 maneuvering thrusters in Engineering. Set all ODD thrusters (1, 3, 5, 7, 9, 11) to 75% and all EVEN thrusters (2, 4, 6, 8, 10, 12) to 50%. Then apply calibration.';
      }

      // Tool request
      if (
        lower.includes('tool') ||
        lower.includes('fuse') ||
        lower.includes('hyperdrive') ||
        lower.includes('broken') ||
        lower.includes('replace') ||
        lower.includes('help')
      ) {
        const hasTool = context.inventory.some((i) => i.id === 'fuse_tool');
        if (hasTool) {
          return 'You already have the Fuse Installer Tool in your inventory. Go to the Hyperdrive Room to swap the fuse.';
        }
        return 'You need to replace the hyperdrive fuse? You cannot remove or seat high-voltage fuses by hand. Take this Fuse Installer Tool and handle the hyperdrive with caution.';
      }

      return 'Mechanical bay standing by. I have the Fuse Installer Tool and the 12-thruster calibration parameters whenever you require them.';
    },
  },
};
