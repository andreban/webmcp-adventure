import { WebMCPToolSchema } from '../types/index.js';

export const STANDARD_WEBMCP_TOOLS: Record<string, WebMCPToolSchema> = {
  list_inventory: {
    name: 'list_inventory',
    description: "Lists all items currently held in the robot's inventory.",
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
  },
  look_at: {
    name: 'look_at',
    description: 'Inspects an object, NPC, item, or area to get visual and sensory information.',
    inputSchema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          description: 'The name or ID of the object, NPC, or item to inspect.',
        },
      },
      required: ['target'],
    },
  },
  walk_to: {
    name: 'walk_to',
    description: 'Moves the robot to a specified object, entity, or room location.',
    inputSchema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          description: 'The destination point, object, or door to walk to.',
        },
      },
      required: ['target'],
    },
  },
  pick_up: {
    name: 'pick_up',
    description: "Picks up an item from the environment and places it into the robot's inventory.",
    inputSchema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          description: 'The item to pick up.',
        },
      },
      required: ['target'],
    },
  },
  open: {
    name: 'open',
    description: 'Opens a door, container, or hatch.',
    inputSchema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          description: 'The door, hatch, or container to open.',
        },
      },
      required: ['target'],
    },
  },
  close: {
    name: 'close',
    description: 'Closes a door, container, or hatch.',
    inputSchema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          description: 'The door, hatch, or container to close.',
        },
      },
      required: ['target'],
    },
  },
  push: {
    name: 'push',
    description: 'Pushes an object or button.',
    inputSchema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          description: 'The object, switch, or button to push.',
        },
      },
      required: ['target'],
    },
  },
  pull: {
    name: 'pull',
    description: 'Pulls an object or lever.',
    inputSchema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          description: 'The object, lever, or handle to pull.',
        },
      },
      required: ['target'],
    },
  },
  use: {
    name: 'use',
    description: 'Uses an object in the room, or applies an inventory item on a target.',
    inputSchema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          description: 'The object or mechanism to use.',
        },
        item: {
          type: 'string',
          description: 'Optional inventory item to use with or on the target.',
        },
      },
      required: ['target'],
    },
  },
  give: {
    name: 'give',
    description: "Gives an item from the robot's inventory to an NPC.",
    inputSchema: {
      type: 'object',
      properties: {
        item: {
          type: 'string',
          description: 'The inventory item to give.',
        },
        target: {
          type: 'string',
          description: 'The NPC or entity receiving the item.',
        },
      },
      required: ['item', 'target'],
    },
  },
  talk_to: {
    name: 'talk_to',
    description: "Relays a message from the human player to an NPC, triggering the NPC's agent loop and returning their response.",
    inputSchema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          description: 'The NPC agent to speak with.',
        },
        message: {
          type: 'string',
          description: 'The message to relay to the NPC.',
        },
      },
      required: ['target', 'message'],
    },
  },
};
