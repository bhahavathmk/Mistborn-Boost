import React from 'react';
import { Card, GameState } from '../types';

interface TradeControlsProps {
  selectedCard: Card | null;
  onPassCard: () => void;
  gameState: GameState;
}

const ActionButton: React.FC<{
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
}> = ({ onClick, disabled, children}) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="px-6 py-2 bg-neutral-700 text-yellow-200 border-2 border-yellow-700/50 rounded-md shadow-lg font-bold uppercase tracking-wider transition-all duration-300 hover:bg-neutral-600 hover:border-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
        {children}
    </button>
);

export const TradeControls: React.FC<TradeControlsProps> = ({ selectedCard, onPassCard, gameState }) => {
  if (gameState !== GameState.PLAYER_CHOOSING_ACTION) return null;

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-4 bg-black/40 p-3 rounded-lg">
        <ActionButton
            onClick={onPassCard}
            disabled={!selectedCard}
        >
            Pass Card Clockwise
        </ActionButton>
    </div>
  );
};