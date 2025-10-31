
import React from 'react';
import { Card as CardType, GameState } from '../types';
import { Card } from './Card';

interface PlayerHandProps {
  hand: CardType[];
  selectedCard: CardType | null;
  onCardSelect: (card: CardType) => void;
  gameState: GameState;
}

export const PlayerHand: React.FC<PlayerHandProps> = ({ hand, selectedCard, onCardSelect, gameState }) => {
  return (
    <div className="flex justify-center items-end space-x-4 h-56">
      {hand.map((card) => (
        <Card
          key={card.id}
          card={card}
          isSelected={selectedCard?.id === card.id}
          onClick={() => gameState === GameState.PLAYER_CHOOSING_ACTION && onCardSelect(card)}
          className="hover:-translate-y-4"
        />
      ))}
    </div>
  );
};