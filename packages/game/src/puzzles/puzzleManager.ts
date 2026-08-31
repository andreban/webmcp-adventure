import {
  ActionResult,
  ActionVerb,
  EngineInterface,
} from '@webmcp-adventure/engine';
import { GAME_ITEMS } from '../data/items.js';

export function createGameActionHooks(): Partial<
  Record<
    ActionVerb,
    (params: Record<string, unknown>, engine: EngineInterface) => Promise<ActionResult | undefined> | ActionResult | undefined
  >
> {
  return {
    talk_to: async (params, engine) => {
      const rawTarget = String(params.target || '').trim().toLowerCase();
      const message = String(params.message || '').trim().toLowerCase();

      // If talking to mechanical agent about tool, provide the tool into inventory
      if (rawTarget.includes('mech') || rawTarget === 'mechanical_agent') {
        if (
          message.includes('tool') ||
          message.includes('fuse') ||
          message.includes('hyperdrive') ||
          message.includes('replace')
        ) {
          const state = engine.getWorldState();
          if (!state.hasItem('fuse_tool')) {
            state.addToInventory(GAME_ITEMS.fuse_tool);
            engine.playSfx('pickup');
          }
        }
      }
      return undefined; // Proceed to standard talk_to execution
    },

    use: (params, engine) => {
      const rawTarget = String(params.target || '').trim().toLowerCase();
      const rawItem = params.item ? String(params.item).trim().toLowerCase() : '';
      const state = engine.getWorldState();

      // 1. STORAGE ROOM KEYPAD / DOOR PIN UNLOCK
      if (
        rawTarget.includes('keypad') ||
        rawTarget.includes('storage') ||
        rawTarget.includes('door') ||
        rawTarget.includes('lock')
      ) {
        if (rawItem === '4271' || rawTarget.includes('4271') || (params.pin && String(params.pin) === '4271')) {
          const corridor = state.rooms.get('corridor');
          if (corridor && corridor.exits.storage_room) {
            corridor.exits.storage_room.isLocked = false;
          }
          const keypad = state.getEntity('storage_keypad');
          if (keypad) {
            keypad.state.isUnlocked = true;
          }
          engine.playSfx('door');
          return {
            success: true,
            message: 'PIN 4271 accepted! The electronic lock clicks open. Storage Room is now unlocked.',
          };
        }

        if (rawItem && rawItem !== '4271') {
          engine.playSfx('error');
          return {
            success: false,
            message: `Incorrect PIN "${params.item}". The keypad beeps in denial. Check comms logs.`,
          };
        }
      }

      // 2. SUB-GOAL 1: INSTALL BATTERY ON NAVIGATOR
      if (rawTarget.includes('nav') || rawTarget === 'navigator') {
        if (rawItem.includes('battery') || rawItem === 'battery') {
          if (!state.hasItem('battery')) {
            return {
              success: false,
              message: 'You do not have a battery in your inventory.',
            };
          }

          state.removeFromInventory('battery');
          state.setState('navigatorPowered', true);
          state.setState('coursePlotted', true);

          const navEntity = state.getEntity('navigator');
          if (navEntity) {
            navEntity.state.hasPower = true;
            navEntity.state.coursePlotted = true;
            navEntity.description =
              'The autonomous ship navigation android. Optical sensors glowing bright blue. Course plotted!';
          }

          engine.playSfx('success');
          return {
            success: true,
            message:
              'Installed the Power Battery into the Navigator android! Its optical sensors flare to life with a chime: "Power restored! Calculating stellar trajectory... Course to Destination Alpha successfully plotted!"',
          };
        }
      }

      // 3. SUB-GOAL 2: 12 THRUSTERS CALIBRATION IN ENGINEERING ROOM
      if (
        rawTarget.includes('thruster') ||
        rawTarget.includes('console') ||
        rawTarget.includes('calibration')
      ) {
        if (state.currentRoomId !== 'engineering_room') {
          return {
            success: false,
            message: 'You must be in the Engineering Room to calibrate the maneuvering thrusters.',
          };
        }

        // Calibrate thrusters action
        const thrusterEntity = state.getEntity('thruster_console');
        const oddVal = 75;
        const evenVal = 50;
        const targetThrusters = [
          oddVal, evenVal, oddVal, evenVal, oddVal, evenVal,
          oddVal, evenVal, oddVal, evenVal, oddVal, evenVal,
        ];

        if (thrusterEntity) {
          thrusterEntity.state.thrusters = targetThrusters;
          thrusterEntity.state.isCalibrated = true;
        }

        state.setState('thrustersCalibrated', true);
        state.setState('shipOriented', true);
        engine.playSfx('success');

        return {
          success: true,
          message:
            'Calibrated all 12 maneuvering thrusters: Odd thrusters (1,3,5,7,9,11) set to 75%, Even thrusters (2,4,6,8,10,12) set to 50%. The maneuvering thrusters fire with a rhythmic pulse, locking the ship in the correct orientation!',
          data: { thrusters: targetThrusters, shipOriented: true },
        };
      }

      // 4. SUB-GOAL 3: HYPERDRIVE UNIT FUSE REPLACEMENT & ACTIVATION
      if (rawTarget.includes('hyperdrive') || rawTarget.includes('unit') || rawTarget.includes('core')) {
        if (state.currentRoomId !== 'hyperdrive_room') {
          return {
            success: false,
            message: 'You must be in the Hyperdrive Chamber to interact with the hyperdrive.',
          };
        }

        const hyperEntity = state.getEntity('hyperdrive_unit');
        const hasBroken = hyperEntity?.state.hasBrokenFuse ?? true;
        const hasNew = hyperEntity?.state.hasNewFuse ?? false;

        // Using Fuse Installer Tool
        if (rawItem.includes('tool') || rawItem === 'fuse_tool') {
          if (!state.hasItem('fuse_tool')) {
            return {
              success: false,
              message: 'You do not have the Fuse Installer Tool in your inventory.',
            };
          }

          if (hasBroken) {
            // Remove broken fuse
            if (hyperEntity) {
              hyperEntity.state.hasBrokenFuse = false;
            }
            state.addToInventory(GAME_ITEMS.broken_fuse);
            engine.playSfx('pickup');
            return {
              success: true,
              message:
                'Used the Fuse Installer Tool to safely extract the blackened, blown fuse from the hyperdrive housing. The socket is now empty and ready for a new fuse.',
            };
          }

          if (!hasBroken && !hasNew && state.hasItem('new_fuse')) {
            // Seat new fuse with tool
            state.removeFromInventory('new_fuse');
            if (hyperEntity) {
              hyperEntity.state.hasNewFuse = true;
            }
            engine.playSfx('pickup');
            return {
              success: true,
              message:
                'Used the Fuse Installer Tool to insert the New Hyperdrive Fuse into the socket. It seats securely with a satisfying mechanical latch!',
            };
          }

          if (hasNew) {
            return {
              success: true,
              message: 'The new fuse is already firmly installed in the hyperdrive unit.',
            };
          }
        }

        // Using New Fuse directly
        if (rawItem.includes('fuse') || rawItem === 'new_fuse') {
          if (!state.hasItem('fuse_tool')) {
            return {
              success: false,
              message:
                'Safety warning: You cannot handle high-voltage hyperdrive fuses with bare manipulators! You need the Fuse Installer Tool from the Mechanical Agent.',
            };
          }

          if (hasBroken) {
            return {
              success: false,
              message:
                'The blown fuse is still jammed in the socket. Use the Fuse Installer Tool to remove it first.',
            };
          }

          if (!hasNew) {
            state.removeFromInventory('new_fuse');
            if (hyperEntity) {
              hyperEntity.state.hasNewFuse = true;
            }
            engine.playSfx('pickup');
            return {
              success: true,
              message:
                'Using the Fuse Installer Tool, you seated the New Hyperdrive Fuse into the socket. Power conduits illuminate!',
            };
          }
        }

        // Activating Hyperdrive
        if (!rawItem || rawItem === 'switch' || rawItem === 'activate' || rawItem === 'button') {
          if (hasBroken) {
            engine.playSfx('error');
            return {
              success: false,
              message: 'Cannot activate hyperdrive: Blown fuse detected in plasma coupling.',
            };
          }

          if (!hasNew) {
            engine.playSfx('error');
            return {
              success: false,
              message: 'Cannot activate hyperdrive: Fuse socket is empty.',
            };
          }

          if (hyperEntity) {
            hyperEntity.state.isActivated = true;
            hyperEntity.description =
              'The hyperdrive core is humming with interstellar power. Hyperdrive is ACTIVE and ready!';
          }

          state.setState('hyperdriveActive', true);
          engine.playSfx('success');

          return {
            success: true,
            message:
              'Engaged the Hyperdrive Unit! A deep harmonic vibration resonates through the hull. Hyperdrive is now ACTIVE!',
            data: { hyperdriveActive: true },
          };
        }
      }

      return undefined; // Fall back to default engine use
    },

    push: (params, engine) => {
      const rawTarget = String(params.target || '').trim().toLowerCase();
      const state = engine.getWorldState();

      if (
        (rawTarget.includes('hyperdrive') || rawTarget.includes('button') || rawTarget.includes('switch')) &&
        state.currentRoomId === 'hyperdrive_room'
      ) {
        return engine.executeAction('use', { target: 'hyperdrive_unit' });
      }

      if (
        (rawTarget.includes('thruster') || rawTarget.includes('console') || rawTarget.includes('calibrate')) &&
        state.currentRoomId === 'engineering_room'
      ) {
        return engine.executeAction('use', { target: 'thruster_console' });
      }

      return undefined;
    },
  };
}

export function checkGameWinCondition(engine: EngineInterface): { won: boolean; message?: string } {
  const state = engine.getWorldState();
  const coursePlotted = !!state.getState<boolean>('coursePlotted');
  const shipOriented = !!state.getState<boolean>('shipOriented');
  const hyperdriveActive = !!state.getState<boolean>('hyperdriveActive');

  if (coursePlotted && shipOriented && hyperdriveActive) {
    return {
      won: true,
      message:
        'MISSION ACCOMPLISHED! The course is plotted, the 12 maneuvering thrusters have oriented the ship, and the hyperdrive is engaged. The spaceship is back on course and the hibernating population is safe!',
    };
  }

  return { won: false };
}
