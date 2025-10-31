
import React, { useEffect, useRef } from 'react';

interface GameLogProps {
  log: string[];
}

export const GameLog: React.FC<GameLogProps> = ({ log }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  return (
    <div className="absolute bottom-4 left-4 w-64 h-24 bg-black/60 text-white/80 p-2 rounded-lg shadow-lg text-xs font-mono overflow-y-auto">
      {log.map((entry, index) => (
        <p key={index} className="animate-fade-in">&gt; {entry}</p>
      ))}
      <div ref={logEndRef} />
    </div>
  );
};
