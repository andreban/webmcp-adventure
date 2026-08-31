# Technical Design Document (TDD)

**Project Name:** WebMCP Adventure  
**Status:** Draft / In Progress  

---

## 1. System Architecture
- **Platform:** Web game, running in the browser.
- **Client Architecture:**
  - **Top / Main Viewport:** PixiJS canvas rendering the 2D pixel art scene, room environment, robot, and entities.
  - **Bottom Pane:** Command log panel displaying the history of commands issued to the robot via WebMCP.
- **Agent Integration:**
  - **Player's Agent:** The player can use their agent of choice to operate the robot via WebMCP (including listing inventory items).
  - **NPC Agents:** Each NPC runs their own independent agent loop with their own system prompt, personality, tool set, etc.
- **State Management:** TBD

---

## 2. WebMCP Integration (`navigator.modelContext`)
- **Role:** WebMCP exposes the robot's actions, ship interaction tools, and inventory listing directly in the browser so that any agent chosen by the player can operate the robot.
- **Command Logging Pipeline:** Invocations of WebMCP tools are captured and streamed to the UI's bottom log pane.

### 2.1 Registered Tool Schemas

```typescript
// 1. list_inventory
{
  name: "list_inventory",
  description: "Lists all items currently held in the robot's inventory.",
  inputSchema: {
    type: "object",
    properties: {},
    additionalProperties: false
  }
}

// 2. look_at
{
  name: "look_at",
  description: "Inspects an object, NPC, item, or area to get visual and sensory information.",
  inputSchema: {
    type: "object",
    properties: {
      target: {
        type: "string",
        description: "The name or ID of the object, NPC, or item to inspect."
      }
    },
    required: ["target"]
  }
}

// 3. walk_to
{
  name: "walk_to",
  description: "Moves the robot to a specified object, entity, or room location.",
  inputSchema: {
    type: "object",
    properties: {
      target: {
        type: "string",
        description: "The destination point, object, or door to walk to."
      }
    },
    required: ["target"]
  }
}

// 4. pick_up
{
  name: "pick_up",
  description: "Picks up an item from the environment and places it into the robot's inventory.",
  inputSchema: {
    type: "object",
    properties: {
      target: {
        type: "string",
        description: "The item to pick up."
      }
    },
    required: ["target"]
  }
}

// 5. open
{
  name: "open",
  description: "Opens a door, container, or hatch.",
  inputSchema: {
    type: "object",
    properties: {
      target: {
        type: "string",
        description: "The door, hatch, or container to open."
      }
    },
    required: ["target"]
  }
}

// 6. close
{
  name: "close",
  description: "Closes a door, container, or hatch.",
  inputSchema: {
    type: "object",
    properties: {
      target: {
        type: "string",
        description: "The door, hatch, or container to close."
      }
    },
    required: ["target"]
  }
}

// 7. push
{
  name: "push",
  description: "Pushes an object or button.",
  inputSchema: {
    type: "object",
    properties: {
      target: {
        type: "string",
        description: "The object, switch, or button to push."
      }
    },
    required: ["target"]
  }
}

// 8. pull
{
  name: "pull",
  description: "Pulls an object or lever.",
  inputSchema: {
    type: "object",
    properties: {
      target: {
        type: "string",
        description: "The object, lever, or handle to pull."
      }
    },
    required: ["target"]
  }
}

// 9. use
{
  name: "use",
  description: "Uses an object in the room, or applies an inventory item on a target.",
  inputSchema: {
    type: "object",
    properties: {
      target: {
        type: "string",
        description: "The object or mechanism to use."
      },
      item: {
        type: "string",
        description: "Optional inventory item to use with or on the target."
      }
    },
    required: ["target"]
  }
}

// 10. give
{
  name: "give",
  description: "Gives an item from the robot's inventory to an NPC.",
  inputSchema: {
    type: "object",
    properties: {
      item: {
        type: "string",
        description: "The inventory item to give."
      },
      target: {
        type: "string",
        description: "The NPC or entity receiving the item."
      }
    },
    required: ["item", "target"]
  }
}

// 11. talk_to
{
  name: "talk_to",
  description: "Relays a message from the human player to an NPC, triggering the NPC's agent loop and returning their response.",
  inputSchema: {
    type: "object",
    properties: {
      target: {
        type: "string",
        description: "The NPC agent to speak with."
      },
      message: {
        type: "string",
        description: "The message to relay to the NPC."
      }
    },
    required: ["target", "message"]
  }
}
```

---

## 3. Tech Stack & Tooling
- **Language:** TypeScript
- **Build Tool / Bundler:** Vite
- **Rendering / Graphics:** PixiJS (Pixel art rendering)
- **Audio / Sound:** Howler.js
- **Agent Protocol:** WebMCP (`navigator.modelContext`)

---

## 4. Data Models & Game State
- **Game State Schema:** TBD
- **Inventory System:** State tracking for items held by the robot, queryable by the agent.
- **Save / Load / Persistence:** TBD
- **NPC State & Configuration:** System prompt, personality definition, tool set per NPC.

---

## 5. Deployment & Target Environments
- **Target Platform:** Modern Web Browsers
- **Hosting / Distribution:** TBD
