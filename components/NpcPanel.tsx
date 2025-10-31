import React from 'react';
import { Npc } from '../types';
import { MAX_INFLUENCE } from '../constants';

interface NpcPanelProps {
  npc: Npc;
  onNpcInfluence: (npcId: number) => void;
  isTargetable: boolean;
  isThinking: boolean;
}

const InfluenceMeter: React.FC<{ influence: number }> = ({ influence }) => {
    return (
      <div className="flex items-center justify-center space-x-4 p-2 bg-black/30 rounded-full">
        <div className="flex space-x-1">
            {Array(MAX_INFLUENCE).fill(0).map((_, i) => (
                <div key={`soothe-${i}`} className={`w-4 h-4 rounded-full border border-amber-400/50 transition-colors duration-300 ${-influence > i ? 'bg-amber-400' : 'bg-transparent'}`}></div>
            ))}
        </div>
        <div className="flex space-x-1">
            {Array(MAX_INFLUENCE).fill(0).map((_, i) => (
                <div key={`riot-${i}`} className={`w-4 h-4 rounded-full border border-cyan-400/50 transition-colors duration-300 ${influence > i ? 'bg-cyan-400' : 'bg-transparent'}`}></div>
            ))}
        </div>
      </div>
    );
};

export const NpcPanel: React.FC<NpcPanelProps> = ({ npc, onNpcInfluence, isTargetable, isThinking }) => {
  return (
    <div 
        className={`absolute ${npc.position} flex flex-col items-center space-y-3 transition-all duration-300 ${isTargetable ? 'cursor-pointer scale-105 bg-yellow-400/10 rounded-xl p-2' : ''}`} 
        onClick={() => isTargetable && onNpcInfluence(npc.id)}
    >
      <div className={`w-24 h-24 rounded-full bg-neutral-800 border-4 border-neutral-600 shadow-lg flex items-center justify-center transition-all duration-500 ${isThinking ? 'border-yellow-400 animate-pulse' : 'border-neutral-600'}`}>
        <img src={`https://picsum.photos/seed/${npc.id}/100/100`} alt={npc.name} className="rounded-full" />
      </div>
      <h3 className="text-neutral-200 font-bold text-lg tracking-wider h-7">
        {npc.name} {isThinking && <span className="text-yellow-400/90 text-sm block">is thinking...</span>}
      </h3>
      <InfluenceMeter influence={npc.influence} />
      <div className="flex space-x-1 h-12 items-center">
        {npc.hand.map((_, i) => (
            <div key={i} className="w-8 h-12 bg-neutral-700 border border-neutral-500 rounded-sm"></div>
        ))}
      </div>
    </div>
  );
};