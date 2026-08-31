# WebMCP Adventure

Interactive web game project built around the [WebMCP](https://github.com/webmachinelearning/webmcp) standard.

---

## 🏗️ Architecture

The codebase is organized as an npm monorepo with complete separation between the reusable engine, the game content, and the web client:

- **[`@webmcp-adventure/engine`](file:///C:/Users/andre/Projects/webmcp-adventure/packages/engine)** (`packages/engine`): Generic 2D pixel-art point-and-click adventure engine featuring PixiJS viewport rendering, Howler.js audio manager, world state model, action verb execution pipeline, autonomous NPC agent loop runner, and `navigator.modelContext` WebMCP tool registration.
- **[`@webmcp-adventure/game`](file:///C:/Users/andre/Projects/webmcp-adventure/packages/game)** (`packages/game`): Spaceship game content including rooms, entities, items, NPC dialogue handlers, and puzzle state machines (Plot Course, 12 Thrusters Orientation, Hyperdrive Fuse Replacement).
- **[`@webmcp-adventure/app`](file:///C:/Users/andre/Projects/webmcp-adventure/packages/app)** (`packages/app`): Vite web client integrating the top PixiJS canvas viewport, bottom WebMCP command log stream, agent test console, and HUD overlay.

---

## 📁 Documentation

### Game & Technical Design
- 🎮 **[Game Design Document](file:///C:/Users/andre/Projects/webmcp-adventure/docs/game-design.md)** (`docs/game-design.md`): Concept, narrative, gameplay mechanics, and WebMCP interactions.
- ⚙️ **[Technical Design Document](file:///C:/Users/andre/Projects/webmcp-adventure/docs/technical-design.md)** (`docs/technical-design.md`): System architecture, WebMCP tool schemas, tech stack, and state management.
- 🗺️ **[Project Roadmap](file:///C:/Users/andre/Projects/webmcp-adventure/docs/roadmap.md)** (`docs/roadmap.md`): Milestone tracking and phased deliverables.

### World & Agents
- 🚪 **[Ship Rooms & Locations](file:///C:/Users/andre/Projects/webmcp-adventure/docs/world/rooms.md)** (`docs/world/rooms.md`): Master roster of rooms, key systems, locks, and room-specific items.
- 🤖 **[Agent & Entity Roster](file:///C:/Users/andre/Projects/webmcp-adventure/docs/world/agents.md)** (`docs/world/agents.md`): Master list of player robot and autonomous NPC agents (prompts, personalities, tool sets).

### Puzzles
- 🧩 **[Puzzle Flow & Dependencies](file:///C:/Users/andre/Projects/webmcp-adventure/docs/puzzles/puzzle-flow.md)** (`docs/puzzles/puzzle-flow.md`): Dependency graph and explanation of how sub-goals connect to put the ship back on course.
- 📂 **[Individual Puzzle Docs](file:///C:/Users/andre/Projects/webmcp-adventure/docs/puzzles)** (`docs/puzzles/`): Detailed breakdown for each puzzle:
  - 🗺️ [`docs/puzzles/plot-course.md`](file:///C:/Users/andre/Projects/webmcp-adventure/docs/puzzles/plot-course.md) (Plot Course & Navigator)
  - 🧭 [`docs/puzzles/ship-orientation.md`](file:///C:/Users/andre/Projects/webmcp-adventure/docs/puzzles/ship-orientation.md) (Orientation & 12 Thrusters)
  - ⚡ [`docs/puzzles/activate-hyperdrive.md`](file:///C:/Users/andre/Projects/webmcp-adventure/docs/puzzles/activate-hyperdrive.md) (Hyperdrive Fuse Replacement)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Development

```bash
# Install dependencies across all workspaces
npm install

# Typecheck all packages
npm run typecheck

# Start local Vite development server
npm run dev

# Build production bundle
npm run build
```
