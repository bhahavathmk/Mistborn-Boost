import React, { useState, useEffect, useCallback } from 'react';
import { GameBoard } from './components/GameBoard';
import { GameOverModal } from './components/GameOverModal';
import { Card, Npc, GameState, Metal, ShardName } from './types';
import { SHARDS, INITIAL_NPCS, MAX_INFLUENCE, INITIAL_METAL_CHARGES, HAND_SIZE } from './constants';

interface SwappingCardInfo {
    card: Card;
    from: string; // 'player' or 'npc0', 'npc1', 'npc2'
    to: string;
    visible: boolean;
}

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(GameState.DEALING);
    const [round, setRound] = useState(1);
    const [metalCharges, setMetalCharges] = useState(INITIAL_METAL_CHARGES);
    const [log, setLog] = useState<string[]>(['The game begins.']);
    
    const [npcs, setNpcs] = useState<Npc[]>([]);
    const [playerHand, setPlayerHand] = useState<Card[]>([]);
    
    const [activeMetal, setActiveMetal] = useState<Metal | null>(null);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [swappingCards, setSwappingCards] = useState<SwappingCardInfo[]>([]);
    const [thinkingNpcId, setThinkingNpcId] = useState<number | null>(null);
    
    const [winner, setWinner] = useState<string | null>(null);

    const checkWinCondition = useCallback((currentNpcs: Npc[], currentPlayerHand: Card[]): string | null => {
        if (currentPlayerHand.length === HAND_SIZE && currentPlayerHand.every(c => c.shard === currentPlayerHand[0].shard)) {
            return 'PLAYER';
        }
        for (const npc of currentNpcs) {
            if (npc.hand.length === HAND_SIZE && npc.hand.every(c => c.shard === npc.hand[0].shard)) {
                return npc.name;
            }
        }
        return null;
    }, []);

    const resetGame = useCallback(() => {
        const gameShards: ShardName[] = [
            ShardName.PRESERVATION,
            ShardName.RUIN,
            ShardName.ENDOWMENT,
            ShardName.ODIUM,
        ];

        let deck: Card[] = [];
        gameShards.forEach(shardName => {
            for (let i = 0; i < HAND_SIZE; i++) {
                deck.push({ id: deck.length, shard: shardName });
            }
        });

        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        
        const newPlayerHand = deck.splice(0, HAND_SIZE);
        const newNpcs = INITIAL_NPCS.map((npcInfo, index) => ({
            ...npcInfo,
            id: index,
            hand: deck.splice(0, HAND_SIZE),
            influence: 0,
        }));

        setPlayerHand([]);
        setNpcs(INITIAL_NPCS.map((n, i) => ({...n, id: i, hand: [], influence: 0 })));
        setGameState(GameState.DEALING);
        setRound(1);
        setMetalCharges(INITIAL_METAL_CHARGES);
        setLog(['A new game begins.']);
        setWinner(null);
        setActiveMetal(null);
        setSelectedCard(null);
        setSwappingCards([]);
        setThinkingNpcId(null);

        setTimeout(() => {
            setPlayerHand(newPlayerHand);
            setNpcs(newNpcs);
            setGameState(GameState.PLAYER_CHOOSING_ACTION);
        }, 2500);
    }, []);

    useEffect(() => {
        resetGame();
    }, [resetGame]);

    const handleMetalSelect = (metal: Metal) => {
        setActiveMetal(prev => (prev === metal ? null : metal));
    };

    const handleNpcInfluence = (npcId: number) => {
        if (!activeMetal || metalCharges <= 0) return;

        const isPlayerTurnAction = gameState === GameState.PLAYER_CHOOSING_ACTION;
        const isTargetingThinkingNpc = gameState === GameState.NPC_THINKING && thinkingNpcId === npcId;

        if (!isPlayerTurnAction && !isTargetingThinkingNpc) return;

        setMetalCharges(prev => prev - 1);
        setNpcs(prevNpcs => prevNpcs.map(npc => {
            if (npc.id === npcId) {
                const change = activeMetal === Metal.ZINC ? 1 : -1;
                const newValue = Math.max(-MAX_INFLUENCE, Math.min(MAX_INFLUENCE, npc.influence + change));
                const message = `${activeMetal === Metal.ZINC ? 'Rioting' : 'Soothing'} ${npc.name}.`;
                setLog(prev => [...prev.slice(-5), message]);
                return { ...npc, influence: newValue };
            }
            return npc;
        }));
        setActiveMetal(null);
    };

    const handleCardSelect = (card: Card) => {
        if (gameState !== GameState.PLAYER_CHOOSING_ACTION) return;
        setSelectedCard(prev => (prev?.id === card.id ? null : card));
        setActiveMetal(null);
    };

    const findNormalMoveCard = (hand: Card[]): Card => {
        if (hand.length === 0) throw new Error("Hand is empty");
        const counts: { [key: string]: number } = {};
        hand.forEach(card => { counts[card.shard] = (counts[card.shard] || 0) + 1; });
        if (Object.keys(counts).length === 1) return hand[0]; // All cards are the same
        
        let minCount = hand.length + 1;
        let leastCommonShard: ShardName | null = null;
        for (const shard in counts) {
            if (counts[shard] < minCount) {
                minCount = counts[shard];
                leastCommonShard = shard as ShardName;
            }
        }
        return hand.find(c => c.shard === leastCommonShard)!;
    };
    
    const findBestMoveCard = (hand: Card[]): Card => {
        if (hand.length === 0) throw new Error("Hand is empty");
        const counts: { [key: string]: number } = {};
        hand.forEach(card => { counts[card.shard] = (counts[card.shard] || 0) + 1; });
        if (Object.keys(counts).length === 1) return hand[0]; // All cards are the same

        let maxCount = 0;
        let mostCommonShard: ShardName | null = null;
        for (const shard in counts) {
            if (counts[shard] > maxCount) {
                maxCount = counts[shard];
                mostCommonShard = shard as ShardName;
            }
        }
        return hand.find(c => c.shard !== mostCommonShard)!;
    };
    
    const findWorstMoveCard = (hand: Card[]): Card => {
        if (hand.length === 0) throw new Error("Hand is empty");
        const counts: { [key: string]: number } = {};
        hand.forEach(card => { counts[card.shard] = (counts[card.shard] || 0) + 1; });
        if (Object.keys(counts).length <= 1) return hand[0];

        let maxCount = 0;
        let mostCommonShard: ShardName | null = null;
        for (const shard in counts) {
            if (counts[shard] > maxCount) {
                maxCount = counts[shard];
                mostCommonShard = shard as ShardName;
            }
        }
        if (maxCount > 1) {
          return hand.find(c => c.shard === mostCommonShard)!;
        }
        return findNormalMoveCard(hand);
    };

    const findCardToPass = (npc: Npc): Card => {
        const { influence, hand } = npc;
        const random = Math.random();
        const threshold = Math.abs(influence) / MAX_INFLUENCE;

        if (influence > 0 && random < threshold) {
            setLog(prev => [...prev.slice(-5), `${npc.name} seems agitated...`]);
            return findWorstMoveCard(hand);
        }
        if (influence < 0 && random < threshold) {
            setLog(prev => [...prev.slice(-5), `${npc.name} seems calm...`]);
            return findBestMoveCard(hand);
        }
        return findNormalMoveCard(hand);
    };

    const handlePassCard = () => {
        if (!selectedCard || gameState !== GameState.PLAYER_CHOOSING_ACTION) return;

        const cardToPass = selectedCard;
        setGameState(GameState.ANIMATING_PASS);
        setSelectedCard(null);
        setPlayerHand(prev => prev.filter(c => c.id !== cardToPass.id));
        setSwappingCards([{ card: cardToPass, from: 'player', to: 'npc0', visible: true }]);
        
        setTimeout(() => {
            setSwappingCards([]);
            setNpcs(prev => prev.map(npc => npc.id === 0 ? { ...npc, hand: [...npc.hand, cardToPass] } : npc));
            setGameState(GameState.NPC_THINKING);
            setThinkingNpcId(0);
            setLog(prev => [...prev.slice(-5), `You passed to ${INITIAL_NPCS[0].name}.`]);
        }, 1500);
    };

    useEffect(() => {
        if (gameState !== GameState.NPC_THINKING || thinkingNpcId === null) return;

        const npc = npcs.find(n => n.id === thinkingNpcId);
        if (!npc || npc.hand.length <= HAND_SIZE) return;

        const thinkTime = 10000 + Math.random() * 10000;
        const timer = setTimeout(() => {
            const cardToPass = findCardToPass(npc);
            const currentNpcIndex = thinkingNpcId;
            const nextNpcIndex = currentNpcIndex + 1;
            const isPassingToPlayer = nextNpcIndex >= npcs.length;
            
            const fromId = `npc${currentNpcIndex}`;
            const toId = isPassingToPlayer ? 'player' : `npc${nextNpcIndex}`;

            setGameState(GameState.ANIMATING_PASS);
            setThinkingNpcId(null);
            setLog(prev => [...prev.slice(-5), `${npc.name} is passing a card...`]);
            setNpcs(prev => prev.map(n => n.id === currentNpcIndex ? { ...n, hand: n.hand.filter(c => c.id !== cardToPass.id) } : n));
            setSwappingCards([{ card: cardToPass, from: fromId, to: toId, visible: false }]);

            setTimeout(() => {
                setSwappingCards([]);
                if (isPassingToPlayer) {
                    const finalPlayerHand = [...playerHand, cardToPass];
                    setPlayerHand(finalPlayerHand);

                    const finalNpcs = npcs.map(n => ({
                        ...n,
                        hand: n.id === currentNpcIndex ? n.hand.filter(c => c.id !== cardToPass.id) : n.hand,
                        influence: Math.sign(n.influence) * (Math.abs(n.influence) - 1),
                    }));
                    
                    const win = checkWinCondition(finalNpcs, finalPlayerHand);
                    if (win) {
                        setNpcs(finalNpcs);
                        setWinner(win);
                        setGameState(GameState.GAME_OVER);
                        setLog(prev => [...prev.slice(-5), `${npc.name} passed to you.`]);
                    } else {
                        setNpcs(finalNpcs);
                        setRound(r => r + 1);
                        setMetalCharges(INITIAL_METAL_CHARGES);
                        setLog(prev => [...prev.slice(-5), `${npc.name} passed to you.`, `--- Round ${round + 1} ---`]);
                        setGameState(GameState.PLAYER_CHOOSING_ACTION);
                    }
                } else {
                    setNpcs(prev => prev.map(n => n.id === nextNpcIndex ? { ...n, hand: [...n.hand, cardToPass] } : n));
                    setGameState(GameState.NPC_THINKING);
                    setThinkingNpcId(nextNpcIndex);
                }
            }, 1500);
        }, thinkTime);

        return () => clearTimeout(timer);
    }, [gameState, thinkingNpcId, npcs, playerHand, round, checkWinCondition]);

    return (
        <>
            <GameBoard
                gameState={gameState}
                round={round}
                metalCharges={metalCharges}
                log={log}
                npcs={npcs}
                playerHand={playerHand}
                activeMetal={activeMetal}
                selectedCard={selectedCard}
                swappingCards={swappingCards}
                thinkingNpcId={thinkingNpcId}
                onMetalSelect={handleMetalSelect}
                onNpcInfluence={handleNpcInfluence}
                onCardSelect={handleCardSelect}
                onPassCard={handlePassCard}
            />
            <GameOverModal winner={winner} onReset={resetGame} />
        </>
    );
};

export default App;