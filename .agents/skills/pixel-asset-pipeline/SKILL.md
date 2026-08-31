---
name: pixel-asset-pipeline
description: Repeatable step-by-step workflow for generating retro pixel art game assets, verifying against hallucinated UI elements, calibrating floor-level walk coordinates, and integrating backgrounds into the WebMCP adventure engine.
---

# Pixel Asset Generation & Integration Workflow

Follow this procedure whenever creating and integrating new environments, character sprites, or interactive fixtures into the game.

## Step 1: Clarify & Scribe Design
- In accordance with `AGENTS.md`, present design attribute choices to the Game Designer.
- Scribe the approved details directly into `docs/world/rooms.md` or `docs/world/agents.md` before generating assets.

## Step 2: Generate Environment / Character Image
- Call `generate_image` with an authentic 16-bit retro pixel art prompt (Space Quest / Monkey Island aesthetic).
- **CRITICAL - Pure Scenery Anti-UI Directive:** Always include explicit constraints:
  > *"Full-frame pure environment scenery ONLY. The floor extends cleanly to the very bottom edge of the image. Absolutely NO UI elements, NO bottom verb bars, NO text menus, NO inventory bars, NO HUD, NO buttons."*

## Step 3: Visual & Spatial Verification
- Verify the generated image:
  1. Confirm the image is purely scenic with no hallucinated command bars or menus.
  2. Identify key spatial features: floor plane level, doorway thresholds, stations (e.g. charging pads), and wall fixtures (e.g. keypads).

## Step 4: Asset Deployment
- Copy the generated image from the brain directory into `packages/app/public/assets/<asset_name>.jpg`.
- Update `packages/game/src/data/rooms.ts` (add `backgroundImage: './assets/<asset_name>.jpg'`) or `entities.ts`.

## Step 5: Coordinate & Hotspot Calibration
- **Anchor Walk Targets to Floor Level:** Always set `exit.position.y` and default player positions to the floor level (e.g. `y: 368` or walkway grating) so actor movement is horizontal and never floats upward toward the middle of the door.
- **Transparent Click Hotspots:** In `PixiSceneManager.ts`, ensure image-backed rooms use transparent hitboxes (`doorGfx.rect(-50, -180, 100, 190)` with `alpha: 0.001`) that extend vertically upward from the floor position. Never render visible vector door boxes or labels over painted art.
- **Painted Fixtures:** Map interactive objects (e.g. keypads) to transparent hotspots over their painted positions on the wall.

## Step 6: Build Verification
- Execute `npm run build` to verify TypeScript compilation and bundle integrity.
