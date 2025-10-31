import { ShardName, Shard, Npc } from './types';

export const SHARDS: Record<ShardName, Shard> = {
  [ShardName.PRESERVATION]: { name: ShardName.PRESERVATION, symbol: '⊕', color: 'bg-sky-300', glowColor: 'shadow-sky-300' },
  [ShardName.RUIN]: { name: ShardName.RUIN, symbol: '⊗', color: 'bg-red-800', glowColor: 'shadow-red-800' },
  [ShardName.ODIUM]: { name: ShardName.ODIUM, symbol: '🔥', color: 'bg-orange-600', glowColor: 'shadow-orange-600' },
  [ShardName.ENDOWMENT]: { name: ShardName.ENDOWMENT, symbol: '💎', color: 'bg-teal-500', glowColor: 'shadow-teal-500' },
};

export const INITIAL_NPCS: Omit<Npc, 'hand' | 'id'>[] = [
  {
    name: 'Lord Venture',
    position: 'top-1/2 left-4 -translate-y-1/2',
    influence: 0,
  },
  {
    name: 'Lady Elariel',
    position: 'top-4 left-1/2 -translate-x-1/2',
    influence: 0,
  },
  {
    name: 'High Prelan',
    position: 'top-1/2 right-4 -translate-y-1/2',
    influence: 0,
  },
];

export const MAX_INFLUENCE = 3;
export const INITIAL_METAL_CHARGES = 3;
export const HAND_SIZE = 4;