
import React from 'react';

interface GameOverModalProps {
  winner: string | null;
  onReset: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ winner, onReset }) => {
  if (!winner) return null;

  const isPlayerWinner = winner === 'PLAYER';

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 font-cinzel">
      <div className={`p-10 rounded-lg shadow-2xl text-center text-white border-4 ${isPlayerWinner ? 'border-yellow-400' : 'border-red-800'}`}>
        <h2 className="text-4xl font-bold mb-4">
          {isPlayerWinner ? 'Victory!' : 'Defeat'}
        </h2>
        <p className="text-xl mb-8">
          {isPlayerWinner
            ? 'You have masterfully gathered the Shards and won the game!'
            : `${winner} has collected four Shards. The game is lost.`}
        </p>
        <button
          onClick={onReset}
          className="px-8 py-3 bg-neutral-700 text-yellow-200 border-2 border-yellow-700/50 rounded-md shadow-lg font-bold uppercase tracking-wider transition-all duration-300 hover:bg-neutral-600 hover:border-yellow-600"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};
