
import React from 'react';
import { GameLog } from './GameLog';

interface HudProps {
  round: number;
  metalCharges: number;
  log: string[];
}

export const Hud: React.FC<HudProps> = ({ round, metalCharges, log }) => {
  return (
    <>
      <div className="absolute top-4 left-4 text-white p-3 bg-black/40 rounded-lg shadow-lg">
        <h2 className="font-bold text-xl">Round: {round}</h2>
      </div>
      <div className="absolute top-4 right-4 text-white p-3 bg-black/40 rounded-lg shadow-lg">
        <h2 className="font-bold text-xl">Metal Charges</h2>
        <div className="flex space-x-2 mt-2">
          {Array(metalCharges).fill(0).map((_, i) => (
            <div key={i} className="w-5 h-5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)]"></div>
          ))}
           {Array(3 - metalCharges).fill(0).map((_, i) => (
            <div key={i} className="w-5 h-5 bg-neutral-600 rounded-full"></div>
          ))}
        </div>
      </div>
      <GameLog log={log} />
    </>
  );
};
