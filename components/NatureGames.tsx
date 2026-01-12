
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
  const [activeGame, setActiveGame] = useState<string>('hub');
  const [score, setScore] = useState(0);
  const [gameFeedback, setGameFeedback] = useState<string | null>(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [growth, setGrowth] = useState(0);
  const [gameItems, setGameItems] = useState<{id: number, x: number, y: number, icon?: string, type?: string}[]>([]);
  const [gameTime, setGameTime] = useState(30);
  const [isGameRunning, setIsGameRunning] = useState(false);

  // Unified Game Start/Loop logic
  useEffect(() => {
    if (!isGameRunning || gameTime <= 0) return;

    const timer = setInterval(() => setGameTime(prev => prev - 1), 1000);
    const generator = setInterval(() => {
      const id = Math.random();
      let newItem: any;

      if (activeGame === 'leaf') {
        newItem = { id, x: Math.random() * 90, y: -10, icon: '🍂' };
      } else if (activeGame === 'tap_stop') {
        newItem = { id, x: Math.random() * 80 + 10, y: Math.random() * 80 + 10, icon: '💧' };
      } else if (activeGame === 'river') {
        const type = Math.random() > 0.4 ? 'trash' : 'fish';
        newItem = { id, x: 110, y: Math.random() * 80 + 10, type, icon: type === 'trash' ? '🧴' : '🐟' };
      } else if (activeGame === 'tap') {
        const type = Math.random() > 0.3 ? 'good' : 'bad';
        const icons = type === 'good' ? ['🌱', '☀️', '♻️', '💧'] : ['💨', '🛢️', '🏭', '🚗'];
        newItem = { id, icon: icons[Math.floor(Math.random() * icons.length)], x: Math.random() * 80 + 10, y: Math.random() * 80 + 10, type };
      }

      if (newItem) {
        setGameItems(prev => [...prev, newItem]);
        if (activeGame === 'tap_stop' || activeGame === 'tap') {
           setTimeout(() => setGameItems(prev => prev.filter(item => item.id !== id)), 1500);
        }
      }
    }, activeGame === 'tap' ? 600 : 1000);

    const physics = setInterval(() => {
      setGameItems(prev => prev.map(item => {
        if (activeGame === 'leaf') return { ...item, y: item.y + 1.5 };
        if (activeGame === 'river') return { ...item, x: item.x - 1.5 };
        return item;
      }).filter(item => item.y < 110 && item.x > -10));
    }, 50);

    return () => {
      clearInterval(timer);
      clearInterval(generator);
      clearInterval(physics);
    };
  }, [isGameRunning, gameTime, activeGame]);

  useEffect(() => {
    if (gameTime === 0 && isGameRunning) {
      setIsGameRunning(false);
      onEarnCoins(score * 2);
      setGameFeedback(`Time's up! You earned ${score * 2} Coins!`);
    }
  }, [gameTime, isGameRunning]);

  const startGame = (gameId: string) => {
    setScore(0);
    setGameTime(30);
    setGameItems([]);
    setGameFeedback(null);
    setIsGameRunning(true);
    setActiveGame(gameId);
  };

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
      { id: 'sort', rank: 1, icon: '🤖', title: "Sort-o-Matic", desc: "Basic waste sorting skills." },
      { id: 'leaf', rank: 5, icon: '🍂', title: "Leaf Catcher", desc: "Save falling autumn leaves!" },
      { id: 'tap_stop', rank: 10, icon: '💧', title: "Tap Stopper", desc: "Stop the water leaks fast!" },
      { id: 'river', rank: 15, icon: '🌊', title: "River Cleaner", desc: "Save fish from plastic pollution." },
      { id: 'bee', rank: 20, icon: '🐝', title: "Bee Guider", desc: "Help the bees find flowers." },
      { id: 'grow', rank: 25, icon: '🌱', title: "Compost Hero", desc: "Turn waste into garden gold." },
      { id: 'wind', rank: 30, icon: '🌬️', title: "Wind Weaver", desc: "Harness the power of the air." },
      { id: 'forest', rank: 35, icon: '🌳', title: "Forest Grower", desc: "Cultivate a massive tree farm." },
      { id: 'ocean', rank: 40, icon: '🦈', title: "Ocean Patrol", desc: "Protect marine life from spills." },
      { id: 'trash', rank: 45, icon: '🧹', title: "Beach Sweeper", desc: "Clean up the local shoreline." },
      { id: 'solar', rank: 50, icon: '☀️', title: "Solar Aligner", desc: "Align panels for max energy." },
      { id: 'carbon', rank: 55, icon: '💨', title: "Carbon Dodge", desc: "Avoid the smog clouds!" },
      { id: 'match', rank: 60, icon: '🦒', title: "Species Match", desc: "Match the endangered friends." },
      { id: 'ice', rank: 65, icon: '🧊', title: "Glacier Guard", desc: "Keep the arctic cool and icy." },
      { id: 'city', rank: 70, icon: '🏘️', title: "Green Planner", desc: "Build a sustainable neighborhood." },
      { id: 'tap_blitz', rank: 75, icon: '⚡', title: "Eco-Tap Blitz", desc: "High-speed reflex challenge." },
      { id: 'policy', rank: 80, icon: '📜', title: "Policy Pro", desc: "Sign laws to save the earth." },
      { id: 'shield', rank: 85, icon: '🛡️', title: "Forest Shield", desc: "Defend trees from loggers." },
      { id: 'builder', rank: 90, icon: '🏗️', title: "Eco Architect", desc: "Design a zero-carbon tower." },
      { id: 'ozone', rank: 95, icon: '✨', title: "Ozone Healer", desc: "Repair the upper atmosphere." },
      { id: 'planet', rank: 100, icon: '🌍', title: "Planet Guardian", desc: "The final mastery challenge." }
    ];

    return (
      <div className="space-y-8 p-4">
        <div className="text-center">
          <h2 className="text-4xl font-black text-sky-900 mb-2">Nature Games Hub</h2>
          <p className="text-sky-600 font-bold">New game unlocked every 5 ranks! You are Rank {currentRank}.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[600px] overflow-y-auto pr-2 custom-scrollbar p-2">
          {gamesList.map(game => {
            const unlocked = currentRank >= game.rank;
            return (
              <button 
                key={game.id}
                onClick={() => {
                  if (!unlocked) return;
                  if (['leaf', 'tap_stop', 'river', 'tap_blitz'].includes(game.id)) startGame(game.id === 'tap_blitz' ? 'tap' : game.id);
                  else setActiveGame(game.id);
                }}
                className={`p-6 rounded-[2.5rem] border-4 bg-white transition-all text-left relative overflow-hidden flex flex-col items-center text-center ${unlocked ? 'border-sky-100 hover:border-sky-400 hover:scale-105 hover:shadow-xl' : 'opacity-40 grayscale'}`}
              >
                {!unlocked && (
                  <div className="absolute inset-0 bg-stone-900/10 backdrop-blur-[1px] flex items-center justify-center z-10">
                    <span className="bg-white/90 px-3 py-1 rounded-full font-black text-[10px] uppercase shadow-lg">Rank {game.rank}</span>
                  </div>
                )}
                <span className="text-5xl mb-3">{game.icon}</span>
                <h3 className="text-lg font-black text-sky-900 leading-tight mb-1">{game.title}</h3>
                <p className="text-sky-600 text-[10px] font-medium leading-tight">{game.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // --- Game Templates ---

  // 1. Generic Catch Game (Leaf Catcher / River Cleaner)
  if (['leaf', 'river'].includes(activeGame)) {
    return (
      <div className="h-full min-h-[500px] flex flex-col bg-white rounded-[3rem] border-4 border-sky-100 p-8 overflow-hidden relative">
        <div className="flex justify-between font-black text-xl mb-4 text-sky-900">
          <button onClick={() => setActiveGame('hub')} className="text-stone-400">← Back</button>
          <div>Time: {gameTime}s</div>
          <div className="text-emerald-600">Score: {score}</div>
        </div>
        <div className={`flex-1 ${activeGame === 'leaf' ? 'bg-orange-50' : 'bg-blue-50'} rounded-[2rem] relative shadow-inner overflow-hidden cursor-crosshair`}>
          {gameItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => {
                if (item.type === 'fish') {
                   setScore(s => Math.max(0, s - 20));
                   setGameFeedback("Watch the fish!");
                } else {
                   setScore(s => s + 10);
                   setGameItems(prev => prev.filter(i => i.id !== item.id));
                }
              }}
              className="absolute text-5xl transition-transform active:scale-150"
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            >
              {item.icon}
            </button>
          ))}
          {gameFeedback && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 px-6 py-3 rounded-full font-black shadow-xl text-sky-600 animate-bounce">{gameFeedback}</div>}
          {gameTime === 0 && (
            <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95">
              <h3 className="text-4xl font-black text-sky-900 mb-4">{activeGame === 'leaf' ? 'Great Catching!' : 'River Cleaned!'}</h3>
              <p className="text-2xl mb-8 font-bold">Total Stars: {score * 2} ✨</p>
              <button onClick={() => startGame(activeGame)} className="bg-sky-500 text-white px-8 py-4 rounded-2xl font-black shadow-lg">Try Again</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. Reaction Tap Game (Tap Stopper / Blitz)
  if (['tap_stop', 'tap'].includes(activeGame)) {
    return (
      <div className="h-full min-h-[500px] flex flex-col bg-white rounded-[3rem] border-4 border-sky-100 p-8 overflow-hidden relative">
        <div className="flex justify-between font-black text-xl mb-4 text-sky-900">
          <button onClick={() => setActiveGame('hub')} className="text-stone-400">← Back</button>
          <div>Time: {gameTime}s</div>
          <div className="text-emerald-600">Score: {score}</div>
        </div>
        <div className="flex-1 bg-stone-50 rounded-[2rem] relative shadow-inner overflow-hidden">
          {gameItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => {
                const points = item.type === 'bad' ? -20 : 15;
                setScore(s => Math.max(0, s + points));
                setGameItems(prev => prev.filter(i => i.id !== item.id));
              }}
              className="absolute text-6xl hover:scale-125 transition-transform"
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            >
              {item.icon}
            </button>
          ))}
          {gameTime === 0 && (
            <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95">
              <h3 className="text-4xl font-black text-sky-900 mb-4">Blitz Over!</h3>
              <p className="text-2xl mb-8 font-bold">Total Stars: {score * 2} ✨</p>
              <button onClick={() => startGame(activeGame)} className="bg-sky-500 text-white px-8 py-4 rounded-2xl font-black shadow-lg">Play Again</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. Puzzle Alignment (Solar Aligner / Solar Move)
  if (activeGame === 'solar') {
    const [panels, setPanels] = useState(Array(9).fill(false));
    const isAllAligned = panels.every(p => p);

    return (
      <div className="max-w-xl mx-auto p-12 bg-white rounded-[3rem] shadow-xl border-4 border-yellow-100 text-center space-y-8">
        <button onClick={() => setActiveGame('hub')} className="float-left text-stone-400">← Hub</button>
        <h2 className="text-3xl font-black text-yellow-900">Solar Aligner</h2>
        <p className="text-yellow-700 font-bold">Tap panels to face the sun! ☀️</p>
        <div className="grid grid-cols-3 gap-4">
          {panels.map((p, i) => (
            <button
              key={i}
              onClick={() => {
                const next = [...panels];
                next[i] = !next[i];
                if (i % 3 > 0) next[i-1] = !next[i-1];
                if (i % 3 < 2) next[i+1] = !next[i+1];
                if (i > 2) next[i-3] = !next[i-3];
                if (i < 6) next[i+3] = !next[i+3];
                setPanels(next);
              }}
              className={`aspect-square rounded-2xl text-4xl flex items-center justify-center transition-all ${p ? 'bg-yellow-400 rotate-0 shadow-lg' : 'bg-slate-200 rotate-45 shadow-inner'}`}
            >
              {p ? '✨' : '⬜'}
            </button>
          ))}
        </div>
        {isAllAligned && (
          <div className="animate-in fade-in duration-500">
            <p className="text-2xl font-black text-emerald-600 mb-4">Grid Online! +100 Coins!</p>
            <button onClick={() => {onEarnCoins(100); setPanels(Array(9).fill(false));}} className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black">Claim Energy</button>
          </div>
        )}
      </div>
    );
  }

  // 4. Existing Sort Game
  if (activeGame === 'sort') {
    const item = ITEMS_TO_SORT_KID[currentItemIndex];
    return (
      <div className="max-w-xl mx-auto p-8 bg-white rounded-[3rem] shadow-xl border-4 border-sky-100 text-center space-y-8">
        <button onClick={() => setActiveGame('hub')} className="float-left text-stone-400">← Hub</button>
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

  // 5. Existing Forest Grower
  if (activeGame === 'forest' || activeGame === 'grow') {
    return (
      <div className="max-w-xl mx-auto p-12 bg-white rounded-[3rem] shadow-xl border-4 border-emerald-100 text-center space-y-8">
        <button onClick={() => setActiveGame('hub')} className="float-left text-stone-400">← Hub</button>
        <h2 className="text-3xl font-black text-emerald-900">{activeGame === 'forest' ? 'Forest Guardian' : 'Compost King'}</h2>
        <div className="text-9xl transition-all duration-500" style={{ transform: `scale(${1 + growth/100})` }}>
          {growth < 30 ? (activeGame === 'forest' ? '🌱' : '🍌') : growth < 70 ? (activeGame === 'forest' ? '🌿' : '🍂') : (activeGame === 'forest' ? '🌳' : '✨')}
        </div>
        <button 
          onClick={() => { setGrowth(g => Math.min(100, g + 10)); if (growth + 10 >= 100) { onEarnCoins(50); setGameFeedback("Mastered!"); } }}
          className="w-full py-6 bg-emerald-500 text-white rounded-[2rem] font-black text-2xl shadow-lg active:scale-95"
        >
          {activeGame === 'forest' ? '💧 Water Forest' : '🥄 Stir Compost'}
        </button>
        {growth >= 100 && <p className="font-black text-emerald-600 text-xl animate-bounce">{gameFeedback}</p>}
      </div>
    );
  }

  // 6. Milestone Master Game
  if (activeGame === 'planet') {
    return (
      <div className="max-w-2xl mx-auto p-12 bg-emerald-900 rounded-[3rem] shadow-2xl border-4 border-emerald-400 text-center space-y-8 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full blur-[100px]"></div>
        </div>
        <button onClick={() => setActiveGame('hub')} className="float-left text-emerald-400 relative z-10">← Hub</button>
        <h2 className="text-4xl font-black relative z-10">Earth Protector Legend</h2>
        <div className="py-20 flex justify-center relative z-10">
           <div className="relative">
              <span className="text-[12rem] block animate-spin-slow">🌍</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-7xl animate-pulse">👑</span>
              </div>
           </div>
        </div>
        <p className="text-xl font-medium opacity-80 relative z-10">You are the ultimate Planet Guardian. Perform a Global Blessing to heal the world.</p>
        <button 
          onClick={() => {onEarnCoins(500); setGameFeedback("Earth Blessed! +500 Coins!");}}
          className="w-full py-6 bg-white text-emerald-900 rounded-[2rem] font-black text-2xl shadow-xl hover:scale-105 active:scale-95 transition-all relative z-10"
        >
          ✨ Save the World
        </button>
        {gameFeedback && <p className="text-yellow-400 font-black text-2xl animate-bounce relative z-10">{gameFeedback}</p>}
      </div>
    );
  }

  // Placeholder for missing game implementations
  return (
    <div className="max-w-xl mx-auto p-12 bg-white rounded-[3rem] shadow-xl border-4 border-sky-50 text-center">
       <button onClick={() => setActiveGame('hub')} className="float-left text-stone-400">← Hub</button>
       <h2 className="text-3xl font-black text-sky-900 mb-6">Coming Soon!</h2>
       <p className="text-sky-600 font-bold mb-8">This Rank {currentRank} challenge is still being prepared by Leafy! Try another quest.</p>
       <div className="text-8xl animate-pulse">🚧</div>
    </div>
  );
};

export default NatureGames;
