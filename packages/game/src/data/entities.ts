import { Entity } from '@webmcp-adventure/engine';

export const GAME_ENTITIES: Record<string, Entity> = {
  robot: {
    id: 'robot',
    name: 'Ship Robot (Unit-7)',
    type: 'player',
    description:
      'A dust-covered yellow industrial maintenance robot with a green-phosphor CRT screen and multi-tool arms, operated by your agent.',
    roomId: 'janitor_closet',
    position: { x: 306, y: 368 },
    state: {},
    color: 0xeab308,
    visible: true,
  },

  navigator: {
    id: 'navigator',
    name: 'Navigator Android (ASTRA-NAV)',
    type: 'npc',
    description:
      'An autonomous astrogation android with white ceramic plating and a multi-spectrum star-tracking visor. Offline until powered.',
    roomId: 'bridge',
    position: { x: 275, y: 260 },
    state: {
      hasPower: false,
      coursePlotted: false,
    },
    color: 0x00e5ff,
    visible: true,
  },

  nav_console: {
    id: 'nav_console',
    name: 'Navigation Console',
    type: 'console',
    description:
      'Displays stellar cartography coordinates and trajectory calculations.',
    roomId: 'bridge',
    position: { x: 240, y: 280 },
    state: {},
    color: 0x60a5fa,
    visible: true,
  },

  comms_agent: {
    id: 'comms_agent',
    name: 'Comms Agent (VOX-COM)',
    type: 'npc',
    description:
      'A spherical floating communications probe with a pulsing holographic waveform face, managing mission logs and interstellar telemetry.',
    roomId: 'comms_room',
    position: { x: 490, y: 240 },
    state: {
      sharedPin: false,
    },
    color: 0x06b6d4,
    visible: true,
  },

  comms_terminal: {
    id: 'comms_terminal',
    name: 'Mission Log Terminal',
    type: 'console',
    description:
      'Stores encrypted logs from mission start. Comms Agent has the clearance to decipher and relay them.',
    roomId: 'comms_room',
    position: { x: 490, y: 310 },
    state: {},
    color: 0x34d399,
    visible: true,
  },

  storage_keypad: {
    id: 'storage_keypad',
    name: 'Storage Room Keypad',
    type: 'interactive',
    description:
      'An electronic lock requiring a 4-digit security PIN to grant access to the Storage Room.',
    roomId: 'corridor',
    position: { x: 545, y: 250 },
    state: {
      isUnlocked: false,
    },
    color: 0xf59e0b,
    visible: true,
  },

  battery: {
    id: 'battery',
    name: 'Power Battery',
    type: 'item',
    description: 'A heavy high-density power cell stored in the parts rack.',
    roomId: 'storage_room',
    position: { x: 260, y: 240 },
    state: {},
    color: 0x38bdf8,
    visible: true,
  },

  new_fuse: {
    id: 'new_fuse',
    name: 'New Hyperdrive Fuse',
    type: 'item',
    description: 'A spare Class-A hyperdrive fuse in protective foam.',
    roomId: 'storage_room',
    position: { x: 710, y: 310 },
    state: {},
    color: 0xfacc15,
    visible: true,
  },

  mechanical_agent: {
    id: 'mechanical_agent',
    name: 'Mechanical Agent (GRIP-9)',
    type: 'npc',
    description:
      'A heavy treaded repair droid with weathered steel and bronze plating, a welding mask visor, and pneumatic tool arms.',
    roomId: 'mechanical_room',
    position: { x: 640, y: 310 },
    state: {
      gaveTool: false,
      gaveCalibration: false,
    },
    color: 0xa855f7,
    visible: true,
  },

  thruster_console: {
    id: 'thruster_console',
    name: '12 Thrusters Calibration Panel',
    type: 'console',
    description:
      'Interface to calibrate the ship 12 maneuvering thrusters (T1 through T12). Each thruster can be set from 0 to 100%.',
    roomId: 'engineering_room',
    position: { x: 400, y: 240 },
    state: {
      thrusters: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      isCalibrated: false,
      thrustersActivated: true,
    },
    color: 0xef4444,
    visible: true,
  },

  hyperdrive_unit: {
    id: 'hyperdrive_unit',
    name: 'Hyperdrive Core Unit',
    type: 'console',
    description:
      'The ship massive hyperdrive core. A fuse socket on the maintenance panel contains a blown fuse.',
    roomId: 'hyperdrive_room',
    position: { x: 400, y: 310 },
    state: {
      hasBrokenFuse: true,
      hasNewFuse: false,
      isActivated: false,
    },
    color: 0xec4899,
    visible: true,
  },
};
