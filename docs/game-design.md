# Game Design Document (GDD)

**Project Name:** WebMCP Adventure  
**Game Designer:** User  
**Status:** In Progress  

---

## 1. Overview & Vision
- **High-Level Concept:** The story happens on a spaceship flying through space. The ship is in disarray and off course, putting the lives of the entire hibernating population at risk.
- **Platform:** Web game, running in the browser.
- **Player's Role:** A human whose only interface to solve the problem is an AI agent.
- **Agent Flexibility:** The player will be able to play the game via their agent of choice.
- **Goal:** Fix all the issues with the ship so it returns to course.
- **Core Mechanism:** The player's agent of choice operates a robot on the ship via WebMCP. The robot starts the game in the **Janitor's Closet** and can perform actions or talk to other entities, who are themselves their own agents.

---

## 2. Setting, Narrative & World
- **Setting:** Spaceship flying through space.
- **Situation:** Ship is in disarray, off course, and the hibernating population's lives are at risk.
- **Rooms & Locations:** Detailed in [`docs/world/rooms.md`](file:///C:/Users/andre/Projects/webmcp-adventure/docs/world/rooms.md).
- **Entities & Agents:** Detailed in [`docs/world/agents.md`](file:///C:/Users/andre/Projects/webmcp-adventure/docs/world/agents.md).

---

## 3. Core Gameplay & Mechanics
- **Player Interaction:** Plays the game via their agent of choice.
- **Agent Actions:** Operates the robot on the ship via WebMCP; can also list items in the inventory.
- **Robot Actions:**
  - `open`
  - `close`
  - `push`
  - `pull`
  - `pick up`
  - `look at`
  - `talk to`
  - `use`
  - `give`
  - `walk to`
  - List items in the inventory
- **NPC Agent System & Dialogue:**
  - Each NPC has their own agent loop, with their own system prompt, personality, tool set, etc.
  - When talking to an NPC, the robot relays the user's messages to them, and relays their responses back to the user.
- **Win Condition:** Fix all issues with the ship so it returns to course and the hibernating population is safe.
- **Puzzle Structure:** Documented in [`docs/puzzles/puzzle-flow.md`](file:///C:/Users/andre/Projects/webmcp-adventure/docs/puzzles/puzzle-flow.md) with individual puzzle specifications in [`docs/puzzles/`](file:///C:/Users/andre/Projects/webmcp-adventure/docs/puzzles).

---

## 4. WebMCP Integration (Game Perspective)
- **Role of WebMCP:** The game exposes robot operations and inventory listing as WebMCP tools for the player's agent of choice to interact with and control the robot.
- **Command Logging:** Commands issued to the robot via WebMCP are logged and displayed in the bottom pane of the UI.
- **Exposed Tools:**
  - `list_inventory`
  - `look_at`
  - `walk_to`
  - `pick_up`
  - `open`
  - `close`
  - `push`
  - `pull`
  - `use`
  - `give`
  - `talk_to`

---

## 5. User Interface & Art Direction
- **UI Layout:**
  - **Top / Main Viewport:** Displays the 2D scene, the spaceship environment, the robot, and any NPCs/entities present.
  - **Bottom Pane:** Displays the stream and history of commands issued to the robot via WebMCP.
- **Visual Style:** Pixel art style, inspired by a mix of *Space Quest* games and *The Secret of Monkey Island*.
- **Audio:** Handled via Howler.js (TBD specific audio assets).
