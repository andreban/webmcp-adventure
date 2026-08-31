import { AdventureEngine, GameDefinition } from '@webmcp-adventure/engine';
import { GAME_ROOMS } from './data/rooms.js';
import { GAME_ENTITIES } from './data/entities.js';
import { GAME_ITEMS } from './data/items.js';
import { GAME_NPCS } from './npcs/handlers.js';
import { createGameActionHooks, checkGameWinCondition } from './puzzles/puzzleManager.js';

export function createSpaceshipGameDefinition(): GameDefinition {
  return {
    id: 'webmcp-spaceship-adventure',
    title: 'WebMCP Spaceship Adventure',
    initialRoomId: 'janitor_closet',
    rooms: GAME_ROOMS,
    entities: GAME_ENTITIES,
    items: GAME_ITEMS,
    npcs: GAME_NPCS,
    initialState: {
      navigatorPowered: false,
      coursePlotted: false,
      thrustersCalibrated: false,
      shipOriented: false,
      hyperdriveActive: false,
    },
    actionHooks: createGameActionHooks(),
    checkWinCondition: checkGameWinCondition,
  };
}

export function createSpaceshipGameEngine(): AdventureEngine {
  const definition = createSpaceshipGameDefinition();
  return new AdventureEngine(definition);
}
