export enum ShardName {
  PRESERVATION = 'PRESERVATION',
  RUIN = 'RUIN',
  ENDOWMENT = 'ENDOWMENT',
  ODIUM = 'ODIUM',
}

export interface Shard {
  name: ShardName;
  symbol: string;
  color: string;
  glowColor: string;
}

export interface Card {
  id: number;
  shard: ShardName;
}

export interface Npc {
  id: number;
  name: string;
  position: string;
  influence: number; // -3 (Soothed) to +3 (Rioted)
  hand: Card[];
}

export enum Metal {
  BRASS = 'BRASS',
  ZINC = 'ZINC',
}

export enum GameState {
  PLAYER_CHOOSING_ACTION = 'PLAYER_CHOOSING_ACTION',
  NPC_THINKING = 'NPC_THINKING',
  ANIMATING_PASS = 'ANIMATING_PASS',
  GAME_OVER = 'GAME_OVER',
  DEALING = 'DEALING',
}

export enum TradeAction {
  PASS = 'PASS',
}