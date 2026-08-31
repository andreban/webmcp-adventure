# Project Roadmap

**Project Name:** WebMCP Adventure  
**Status:** In Development  

---

## Milestones

### Phase 1: Inception & Design
- [x] Select tech stack: TypeScript, Vite, PixiJS, Howler.js, WebMCP
- [x] Complete initial Game Design Document ([`docs/game-design.md`](file:///C:/Users/andre/Projects/webmcp-adventure/docs/game-design.md))
- [x] Complete initial Technical Design Document ([`docs/technical-design.md`](file:///C:/Users/andre/Projects/webmcp-adventure/docs/technical-design.md))

### Phase 2: Engine & WebMCP Foundation
- [x] Initialize monorepo structure with npm workspaces separating engine (`packages/engine`), game content (`packages/game`), and web client (`packages/app`)
- [x] Implement generic 2D pixel-art adventure engine with PixiJS viewport rendering and Howler audio manager
- [x] Implement WebMCP tool registration and bridge for robot actions (`navigator.modelContext`)
- [x] Implement command logging pipeline to the bottom UI pane
- [ ] TBD

### Phase 3: Core Gameplay & Puzzles
- [x] Implement master ship rooms & corridor navigation (`docs/world/rooms.md`)
- [x] Implement entity & NPC agent roster (`docs/world/agents.md`)
- [x] Implement Sub-Goal 1: Plot Course & Navigator power battery puzzle (`docs/puzzles/plot-course.md`)
- [x] Implement Sub-Goal 2: 12 Thrusters calibration & ship orientation puzzle (`docs/puzzles/ship-orientation.md`)
- [x] Implement Sub-Goal 3: Hyperdrive fuse replacement & activation puzzle (`docs/puzzles/activate-hyperdrive.md`)
- [ ] TBD

### Phase 4: UI, Polish & Delivery
- [ ] TBD
