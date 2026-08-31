import { InventoryItem } from '@webmcp-adventure/engine';

export const GAME_ITEMS: Record<string, InventoryItem> = {
  battery: {
    id: 'battery',
    name: 'Power Battery',
    description: 'A heavy high-density power cell.',
    details: 'Compatible with ship automated agent recharging ports like the Navigator.',
    category: 'power',
  },
  new_fuse: {
    id: 'new_fuse',
    name: 'New Hyperdrive Fuse',
    description: 'A brand-new, unblown Class-A interstellar plasma fuse.',
    details: 'Required to replace the blown fuse inside the hyperdrive unit.',
    category: 'component',
  },
  broken_fuse: {
    id: 'broken_fuse',
    name: 'Broken Fuse',
    description: 'A melted, blackened hyperdrive fuse.',
    details: 'Burned out when the ship drifted off course.',
    category: 'junk',
  },
  fuse_tool: {
    id: 'fuse_tool',
    name: 'Fuse Installer Tool',
    description: 'A specialized insulated extractor and insertion tool.',
    details: 'Specifically designed to safely extract and seat hyperdrive high-voltage fuses.',
    category: 'tool',
  },
};
