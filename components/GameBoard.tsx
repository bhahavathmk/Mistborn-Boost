import React, { useState, useEffect } from 'react';
import { Npc as NpcType, Card as CardType, Metal, GameState } from '../types';
import { NpcPanel } from './NpcPanel';
import { PlayerHand } from './PlayerHand';
import { Hud } from './Hud';
import { MetalControls } from './MetalControls';
import { TradeControls } from './TradeControls';
import { Card as CardComponent } from './Card';

interface GameBoardProps {
  gameState: GameState;
  round: number;
  metalCharges: number;
  log: string[];
  npcs: NpcType[];
  playerHand: CardType[];
  activeMetal: Metal | null;
  selectedCard: CardType | null;
  swappingCards: { card: CardType, from: string, to: string, visible: boolean }[];
  thinkingNpcId: number | null;
  onMetalSelect: (metal: Metal) => void;
  onNpcInfluence: (npcId: number) => void;
  onCardSelect: (card: CardType) => void;
  onPassCard: () => void;
}

const playerPositions: Record<string, React.CSSProperties> = {
    deck: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 },
    player: { bottom: '8rem', left: '50%', transform: 'translateX(-50%)', zIndex: 20 },
    npc0: { top: '50%', left: '4rem', transform: 'translateY(-50%)', zIndex: 10 },
    npc1: { top: '4rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10 },
    npc2: { top: '50%', right: '4rem', transform: 'translateY(-50%)', zIndex: 10 },
};

const DealingAnimation: React.FC = () => {
    const [dealt, setDealt] = useState(false);
    const cards = Array(16).fill(0);
    const playerTargets = ['player', 'npc0', 'npc1', 'npc2'];

    useEffect(() => {
        const timer = setTimeout(() => setDealt(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return <>
        {cards.map((_, i) => {
            const target = playerTargets[i % 4];
            const position = dealt ? playerPositions[target] : playerPositions.deck;
            return (
                <div key={i}
                     className="absolute w-32 h-48 bg-neutral-700 border-2 border-neutral-500 rounded-lg transition-all duration-700 ease-in-out"
                     style={{
                         ...position,
                         transitionDelay: `${i * 100}ms`,
                         transform: `${position.transform || ''} rotate(${Math.random() * 10 - 5}deg)`
                     }}>
                </div>
            )
        })}
    </>;
};

export const GameBoard: React.FC<GameBoardProps> = (props) => {
    const [isAnimatingSwap, setIsAnimatingSwap] = useState(false);

    useEffect(() => {
        if (props.swappingCards.length > 0) {
            const timer = setTimeout(() => setIsAnimatingSwap(true), 50);
            return () => clearTimeout(timer);
        } else {
            setIsAnimatingSwap(false);
        }
    }, [props.swappingCards.length]);

  return (
    <main className="relative w-screen h-screen bg-gray-900 overflow-hidden font-cinzel">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20"></div>

      <Hud round={props.round} metalCharges={props.metalCharges} log={props.log} />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-neutral-800/80 rounded-full border-8 border-yellow-900/50 shadow-2xl">
        <div className="absolute inset-0 rounded-full border-[16px] border-black/20"></div>
        <div className="absolute inset-8 rounded-full border-2 border-yellow-800/30"></div>
      </div>
      
      {props.gameState === GameState.DEALING && <DealingAnimation />}

      {props.swappingCards.map(({ card, from, to, visible }) => {
          const position = isAnimatingSwap ? playerPositions[to] : playerPositions[from];
          return (
              <div key={card.id} className="absolute transition-all duration-1000 ease-in-out" style={{...position, zIndex: 50}}>
                  <CardComponent card={card} faceUp={visible} />
              </div>
          )
      })}
      
      {props.npcs.map(npc => {
        const isTargetable = (props.gameState === GameState.PLAYER_CHOOSING_ACTION && props.activeMetal !== null) || 
                             (props.gameState === GameState.NPC_THINKING && props.thinkingNpcId === npc.id && props.activeMetal !== null);
        const isThinking = props.gameState === GameState.NPC_THINKING && props.thinkingNpcId === npc.id;
        
        return (
          <NpcPanel
            key={npc.id}
            npc={npc}
            onNpcInfluence={props.onNpcInfluence}
            isTargetable={isTargetable}
            isThinking={isThinking}
          />
        );
      })}
      
      <div className="absolute bottom-0 left-0 right-0 h-1/3">
        <div className="absolute bottom-24 w-full">
            <PlayerHand
                hand={props.playerHand}
                selectedCard={props.selectedCard}
                onCardSelect={props.onCardSelect}
                gameState={props.gameState}
            />
        </div>
        <MetalControls 
            activeMetal={props.activeMetal}
            onMetalSelect={props.onMetalSelect}
            gameState={props.gameState}
        />
        <TradeControls 
            selectedCard={props.selectedCard}
            onPassCard={props.onPassCard}
            gameState={props.gameState}
        />
      </div>
    </main>
  );
};