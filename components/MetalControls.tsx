
import React from 'react';
import { Metal, GameState } from '../types';

interface MetalControlsProps {
  activeMetal: Metal | null;
  onMetalSelect: (metal: Metal) => void;
  gameState: GameState;
}

const MetalButton: React.FC<{
  metal: Metal;
  label: string;
  icon: string;
  color: string;
  glowColor: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ metal, label, icon, color, glowColor, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center space-y-2 p-3 rounded-full border-2 transition-all duration-300 transform hover:scale-110 ${
      isActive ? `bg-yellow-400/20 border-yellow-400 ${glowColor}` : 'border-neutral-500 bg-black/30'
    }`}
  >
    <span className="text-4xl">{icon}</span>
    <span className={`font-bold uppercase tracking-wider ${color}`}>{label}</span>
  </button>
);

export const MetalControls: React.FC<MetalControlsProps> = ({ activeMetal, onMetalSelect, gameState }) => {
  const isVisible = gameState === GameState.PLAYER_CHOOSING_ACTION || gameState === GameState.NPC_THINKING;
  if (!isVisible) return null;

  return (
    <>
      <div className="absolute bottom-16 left-16">
        <MetalButton
          metal={Metal.BRASS}
          label="Soothe"
          icon="🔷"
          color="text-amber-400"
          glowColor="shadow-[0_0_15px_rgba(251,191,36,0.8)]"
          isActive={activeMetal === Metal.BRASS}
          onClick={() => onMetalSelect(Metal.BRASS)}
        />
      </div>
      <div className="absolute bottom-16 right-16">
        <MetalButton
          metal={Metal.ZINC}
          label="Riot"
          icon="🔶"
          color="text-cyan-400"
          glowColor="shadow-[0_0_15px_rgba(56,189,248,0.8)]"
          isActive={activeMetal === Metal.ZINC}
          onClick={() => onMetalSelect(Metal.ZINC)}
        />
      </div>
    </>
  );
};