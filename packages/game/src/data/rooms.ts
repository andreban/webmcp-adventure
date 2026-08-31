import { Room } from '@webmcp-adventure/engine';

export const GAME_ROOMS: Record<string, Room> = {
  janitor_closet: {
    id: 'janitor_closet',
    name: "Janitor's Closet",
    description:
      'A small, cramped maintenance closet where your robot avatar booted up. Shelves and utility conduits line the walls.',
    backgroundImage: './assets/janitors_closet.jpg',
    defaultPlayerPosition: { x: 306, y: 368 },
    colorTheme: {
      floor: 0x1e2230,
      wall: 0x111625,
      accent: 0x38bdf8,
    },
    exits: {
      corridor: {
        name: 'Door to Corridor',
        targetRoomId: 'corridor',
        position: { x: 710, y: 368 },
        isLocked: false,
      },
    },
  },

  corridor: {
    id: 'corridor',
    name: 'Main Corridor',
    description:
      'A long central passageway with metal grating running the length of the ship. Doors branch off to ship sections.',
    backgroundImage: './assets/corridor.jpg',
    defaultPlayerPosition: { x: 400, y: 360 },
    colorTheme: {
      floor: 0x181e2b,
      wall: 0x0f131d,
      accent: 0x06b6d4,
    },
    exits: {
      bridge: {
        name: 'Bridge (Front of Ship)',
        targetRoomId: 'bridge',
        position: { x: 400, y: 420 },
        isLocked: false,
      },
      janitor_closet: {
        name: "Door to Janitor's Closet",
        targetRoomId: 'janitor_closet',
        position: { x: 155, y: 390 },
        isLocked: false,
      },
      comms_room: {
        name: 'Door to Comms Room',
        targetRoomId: 'comms_room',
        position: { x: 235, y: 325 },
        isLocked: false,
      },
      storage_room: {
        name: 'Door to Storage Room (Keypad Locked)',
        targetRoomId: 'storage_room',
        position: { x: 525, y: 290 },
        isLocked: true,
        requiredPin: '4271',
      },
      mechanical_room: {
        name: 'Door to Mechanical Room',
        targetRoomId: 'mechanical_room',
        position: { x: 275, y: 290 },
        isLocked: false,
      },
      engineering_room: {
        name: 'Engineering Room (Aft)',
        targetRoomId: 'engineering_room',
        position: { x: 400, y: 280 },
        isLocked: false,
      },
    },
  },

  bridge: {
    id: 'bridge',
    name: 'Ship Bridge',
    description:
      'The forward command center. Wide viewports show starfields in disarray. The navigation station is positioned here.',
    backgroundImage: './assets/bridge.jpg',
    defaultPlayerPosition: { x: 190, y: 370 },
    colorTheme: {
      floor: 0x192231,
      wall: 0x0e1726,
      accent: 0x60a5fa,
    },
    exits: {
      corridor: {
        name: 'Aft Exit to Corridor',
        targetRoomId: 'corridor',
        position: { x: 75, y: 368 },
        isLocked: false,
      },
    },
  },

  comms_room: {
    id: 'comms_room',
    name: 'Communications Room',
    description:
      'Filled with transceiver banks, signal analyzers, and mission log archives.',
    backgroundImage: './assets/comms_room.jpg',
    defaultPlayerPosition: { x: 340, y: 370 },
    colorTheme: {
      floor: 0x1f2421,
      wall: 0x121715,
      accent: 0x34d399,
    },
    exits: {
      corridor: {
        name: 'Exit to Corridor',
        targetRoomId: 'corridor',
        position: { x: 190, y: 368 },
        isLocked: false,
      },
    },
  },

  storage_room: {
    id: 'storage_room',
    name: 'Secure Storage Room',
    description:
      'A secure locker containing vital components and replacement parts for ship maintenance.',
    backgroundImage: './assets/storage_room.jpg',
    defaultPlayerPosition: { x: 210, y: 370 },
    colorTheme: {
      floor: 0x272118,
      wall: 0x19140c,
      accent: 0xfbbf24,
    },
    exits: {
      corridor: {
        name: 'Exit to Corridor',
        targetRoomId: 'corridor',
        position: { x: 105, y: 368 },
        isLocked: false,
      },
    },
  },

  mechanical_room: {
    id: 'mechanical_room',
    name: 'Mechanical Room',
    description:
      'Filled with pneumatic valves, calibration racks, and specialized mechanical repair gear.',
    backgroundImage: './assets/mechanical_room.jpg',
    defaultPlayerPosition: { x: 300, y: 370 },
    colorTheme: {
      floor: 0x261d28,
      wall: 0x18101a,
      accent: 0xc084fc,
    },
    exits: {
      corridor: {
        name: 'Exit to Corridor',
        targetRoomId: 'corridor',
        position: { x: 120, y: 368 },
        isLocked: false,
      },
    },
  },

  engineering_room: {
    id: 'engineering_room',
    name: 'Engineering Room',
    description:
      'The primary propulsion engineering bay housing the 12 maneuvering thrusters calibration panel.',
    backgroundImage: './assets/engineering_room.jpg',
    defaultPlayerPosition: { x: 260, y: 370 },
    colorTheme: {
      floor: 0x2a1b1b,
      wall: 0x190d0d,
      accent: 0xf87171,
    },
    exits: {
      corridor: {
        name: 'Forward to Corridor',
        targetRoomId: 'corridor',
        position: { x: 95, y: 368 },
        isLocked: false,
      },
      hyperdrive_room: {
        name: 'Door to Hyperdrive Room',
        targetRoomId: 'hyperdrive_room',
        position: { x: 730, y: 368 },
        isLocked: false,
      },
    },
  },

  hyperdrive_room: {
    id: 'hyperdrive_room',
    name: 'Hyperdrive Chamber',
    description:
      'The core chamber housing the main interstellar hyperdrive unit. Warning lights flash on the casing.',
    backgroundImage: './assets/hyperdrive_room.jpg',
    defaultPlayerPosition: { x: 230, y: 370 },
    colorTheme: {
      floor: 0x22132e,
      wall: 0x130a1c,
      accent: 0xe879f9,
    },
    exits: {
      engineering_room: {
        name: 'Forward to Engineering Room',
        targetRoomId: 'engineering_room',
        position: { x: 105, y: 368 },
        isLocked: false,
      },
    },
  },
};
