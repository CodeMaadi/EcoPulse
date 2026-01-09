
import React, { useState, useEffect, useRef } from 'react';

interface GameProps {
  onEarnCoins: (amount: number) => void;
  isKidMode?: boolean;
  currentRank: number;
}

const ITEMS_TO_SORT_KID = [
  { id: 1, name: 'Apple Core', icon: '🍎', bin: 'compost' },
  { id: 2, name: 'Soda Can', icon: '🥤', bin: 'recycle' },
  { id: 3, name: 'Paper Box', icon: '📦', bin: 'recycle' },
  { id: 4, name: 'Banana Peel', icon: '🍌', bin: 'compost' },
  { id: 5, name: 'Plastic Bottle', icon: '🧴', bin: 'recycle' },
  { id: 6, name: 'Used Napkin', icon: '🧻', bin: 'trash' },
];

const NatureGames: React.FC<GameProps> = ({ onEarnCoins, isKidMode, currentRank }) => {
  const [activeGame, setActiveGame] = useState<'hub' | 'sort' | 'grow' | 'grid' | 'tap'>('hub');
  const [score, setScore] = useState(0);
  const [gameFeedback, setGameFeedback] = useState<string | null>(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [growth, setGrowth] = useState(0);

  const [tapItems, setTapItems] = useState<{ id: number; icon: string; x: number; y: number; type: 'good' | 'bad' }[]>([]);
  const [gameTime, setGameTime] = useState(30);
  const [isGameRunning, setIsGameRunning] = useState(false);

  const startTapGame = () => {
    setScore(0);
    setGameTime(30);
    setTapItems([]);
    setIsGameRunning(true);
    setActiveGame('tap');
  };

  useEffect(() => {
    if (isGameRunning && gameTime > 0) {
      const timer = setInterval(() => setGameTime(prev => prev - 1), 1000);
      const generator = setInterval(() => {
        const id = Math.random();
        const type = Math.random() > 0.3 ? 'good' : 'bad';
        const icons = type === 'good' ? ['🌱', '☀️', '♻️', '💧'] : ['💨', '🛢️', '🏭', '🚗'];
        const newItem = { id, icon: icons[Math.floor(Math.random() * icons.length)], x: Math.random() * 80 + 10, y: Math.random() * 80 + 10, type };
        setTapItems(prev => [...prev, newItem]);
        setTimeout(() => setTapItems(prev => prev.filter(item => item.id !== id)), 1500);
      }, 800);
      return () => { clearInterval(timer); clearInterval(generator); };
    } else if (gameTime === 0 && isGameRunning) {
      setIsGameRunning(false);
      onEarnCoins(score * 2);
      setGameFeedback(`Game Over! You earned ${score * 2} points!`);
    }
  }, [isGameRunning, gameTime]);

  const handleSort = (bin: string) => {
    const item = ITEMS_TO_SORT_KID[currentItemIndex];
    if (item.bin === bin) {
      setScore(s => s + 1);
      onEarnCoins(5);
      setGameFeedback("Correct! 🎉");
    } else {
      setGameFeedback("Oops! Try again! 🧐");
    }
    setTimeout(() => {
      setGameFeedback(null);
      setCurrentItemIndex(prev => (prev + 1) % ITEMS_TO_SORT_KID.length);
    }, 1000);
  };

  if (activeGame === 'hub') {
    const gamesList = [
      { id: 'sort', rank: 1, icon: '🤖', title: "Sort-o-Matic", desc: "Sort the trash correctly!" },
      { id: 'grow', rank: 6, icon: '🌳', title: "Nature Grower", desc: "Grow a massive forest!" },
      { id: 'tap', rank: 11, icon: '⚡', title: "Eco-Tap Blitz", desc: "Fast-paced reaction challenge!" }
    ];

    return (
      <div className="space-y-8 p-4">
        <div className="text-center">
          <h2 className="text-4xl font-black text-sky-900 mb-2">Nature Games</h2>
          <p className="text-sky-600 font-bold">You are Rank {currentRank}! Keep climbing to unlock more!</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gamesList.map(game => {
            const unlocked = currentRank >= game.rank;
            return (
              <button 
                key={game.id}
                onClick={() => unlocked && (game.id === 'tap' ? startTapGame() : setActiveGame(game.id as any))}
                className={`p-8 rounded-[3rem] border-4 bg-white transition-all text-left relative overflow-hidden ${unlocked ? 'border-sky-200 hover:border-sky-500 hover:scale-105' : 'opacity-60 grayscale'}`}
              >
                {!unlocked && (
                  <div className="absolute inset-0 bg-stone-900/5 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="bg-white px-4 py-2 rounded-full font-black text-xs uppercase shadow-xl">Unlocks at Rank {game.rank}</span>
                  </div>
                )}
                <span className="text-5xl block mb-4">{game.icon}</span>
                <h3 className="text-2xl font-black text-sky-900">{game.title}</h3>
                <p className="text-sky-600 text-sm">{game.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (activeGame === 'sort') {
    const item = ITEMS_TO_SORT_KID[currentItemIndex];
    return (
      <div className="max-w-xl mx-auto p-8 bg-white rounded-[3rem] shadow-xl border-4 border-sky-100 text-center space-y-8">
        <button onClick={() => setActiveGame('hub')} className="float-left text-sky-400">← Hub</button>
        <h2 className="text-3xl font-black text-sky-900">Sort-o-Matic</h2>
        <div className="text-8xl py-12 bg-sky-50 rounded-[2.5rem] relative">
          {gameFeedback ? <span className="text-2xl font-black text-sky-600">{gameFeedback}</span> : item.icon}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <button onClick={() => handleSort('recycle')} className="bg-blue-500 text-white p-4 rounded-2xl font-black">Recycle</button>
          <button onClick={() => handleSort('compost')} className="bg-emerald-500 text-white p-4 rounded-2xl font-black">Compost</button>
          <button onClick={() => handleSort('trash')} className="bg-stone-500 text-white p-4 rounded-2xl font-black">Trash</button>
        </div>
      </div>
    );
  }

  if (activeGame === 'grow') {
    return (
      <div className="max-w-xl mx-auto p-12 bg-white rounded-[3rem] shadow-xl border-4 border-emerald-100 text-center space-y-8">
        <button onClick={() => setActiveGame('hub')} className="float-left text-emerald-400">← Hub</button>
        <h2 className="text-3xl font-black text-emerald-900">Forest Grower</h2>
        <div className="text-9xl transition-all duration-500" style={{ transform: `scale(${1 + growth/100})` }}>
          {growth < 30 ? '🌱' : growth < 70 ? '🌿' : '🌳'}
        </div>
        <button 
          onClick={() => { setGrowth(g => Math.min(100, g + 10)); if (growth + 10 >= 100) onEarnCoins(50); }}
          className="w-full py-6 bg-emerald-500 text-white rounded-[2rem] font-black text-2xl"
        >
          💧 Water Tree
        </button>
        {growth >= 100 && <p className="font-black text-emerald-600">Mighty Forest Grew! +50 Coins!</p>}
      </div>
    );
  }

  if (activeGame === 'tap') {
    return (
      <div className="h-full min-h-[500px] flex flex-col bg-white rounded-[3rem] border-4 border-yellow-100 p-8 overflow-hidden relative">
        <div className="flex justify-between font-black text-xl mb-4">
          <button onClick={() => setActiveGame('hub')}>← Quit</button>
          <div>Time: {gameTime}s</div>
          <div className="text-emerald-600">Score: {score}</div>
        </div>
        <div className="flex-1 bg-stone-50 rounded-[2rem] relative shadow-inner overflow-hidden cursor-crosshair">
          {tapItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => {
                setScore(s => item.type === 'good' ? s + 10 : Math.max(0, s - 20));
                setTapItems(prev => prev.filter(i => i.id !== item.id));
              }}
              className="absolute text-5xl transition-transform active:scale-150"
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            >
              {item.icon}
            </button>
          ))}
          {gameTime === 0 && (
            <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center p-8 text-center">
              <h3 className="text-4xl font-black mb-4">Blitz Over!</h3>
              <p className="text-2xl mb-8">You earned {score * 2} Coins!</p>
              <button onClick={startTapGame} className="bg-sky-500 text-white px-8 py-4 rounded-2xl font-black">Play Again</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default NatureGames;
