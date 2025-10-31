import React from 'react';
import { Card as CardType } from '../types';
import { SHARDS } from '../constants';

interface CardProps {
  card: CardType;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  faceUp?: boolean;
}

export const Card: React.FC<CardProps> = ({ card, isSelected = false, onClick, className = '', faceUp = true }) => {
  if (!faceUp) {
    return (
      <div className={`w-32 h-48 rounded-lg border-2 border-neutral-600 bg-neutral-800 flex items-center justify-center shadow-lg ${className}`}>
        <div className="w-24 h-24 border-4 border-yellow-800/50 rounded-full flex items-center justify-center">
            <span className="text-4xl text-yellow-600/50 font-cinzel">S&R</span>
        </div>
      </div>
    );
  }
  
  const shardInfo = SHARDS[card.shard];

  return (
    <div
      onClick={onClick}
      className={`relative w-32 h-48 rounded-lg border-2 border-neutral-400/50 flex flex-col items-center justify-center p-2 text-white shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${shardInfo.color} ${onClick ? 'cursor-pointer' : ''} ${className} ${isSelected ? `ring-4 ring-yellow-400 shadow-lg ${shardInfo.glowColor}` : ''}`}
    >
      <div className="absolute inset-0 bg-black/30 rounded-md"></div>
      <div className="relative z-10 flex flex-col items-center justify-between h-full w-full">
        <span className="text-5xl drop-shadow-lg">{shardInfo.symbol}</span>
        <span className="text-center font-bold text-sm tracking-wider uppercase drop-shadow-md">
          {shardInfo.name}
        </span>
      </div>
    </div>
  );
};