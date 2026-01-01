import React, { useState, useEffect } from 'react';

interface GameProps {
  onEarnCoins: (amount: number) => void;
  isKidMode?: boolean;
}

// --- KID MODE DATA ---
const ITEMS_TO_SORT_KID = [
  { id: 1, name: 'Apple Core', icon: '🍎', bin: 'compost' },
  { id: 2, name: 'Soda Can', icon: '🥤', bin: 'recycle' },
  { id: 4, name: 'Banana Peel', icon: '🍌', bin: 'compost' },
  { id: 5, name: 'Plastic Bottle', icon: '🧴', bin: 'recycle' },
  { id: 7, name: 'Candy Wrapper', icon: '🍬', bin: 'trash' },
];

// --- PRO MODE DATA ---
const ADVANCED_WASTE = [
  { id: 1, name: 'Lithium-Ion Battery', icon: '🔋', bin: 'hazardous', info: 'Contains cobalt and lithium; requires specialized thermal processing.' },
  { id: 2, name: 'Corrugated Cardboard (Greasy)', icon: '📦', bin: 'landfill', info: 'Food contamination weakens fiber bonds, making it unrecyclable.' },
  { id: 3, name: 'PVC Pipe Fragment', icon: '🚰', bin: 'specialized', info: 'Polyvinyl Chloride releases toxins if melted with standard PET/HDPE.' },
  { id: 4, name: 'Spent LED Bulb', icon: '💡', bin: 'e-waste', info: 'Contains trace heavy metals and electronic circuitry.' },
  { id: 5, name: 'Grass Clippings', icon: '🌱', bin: 'compost', info: 'High-nitrogen organic matter perfect for industrial composting.' },
];

const NatureGames: React.FC<GameProps> = ({ onEarnCoins, isKidMode }) => {
  const [activeGame, setActiveGame] = useState<'hub' | 'sort' | 'grow' | 'grid'>('hub');
  const [gameFeedback, setGameFeedback] = useState<string | null>(null);

  // Sorting Logic (Shared but distinct sets)
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [score, setScore] = useState(0);

  // Kid Grow Logic
  const [growth, setGrowth] = useState(0);

  // Pro Grid Logic
  const [solar, setSolar] = useState(30);
  const [wind, setWind] = useState(20);
  const [gas, setGas] = useState(50);
  const [budget, setBudget] = useState(5000);
  const totalPower = solar + wind + gas;
  const carbonImpact = (gas * 5) + (solar * 0.1) + (wind * 0.2);

  const handleSort = (bin: string) => {
    const dataSet = isKidMode ? ITEMS_TO_SORT_KID : ADVANCED_WASTE;
    const item = dataSet[currentItemIndex];
    
    if (item.bin === bin) {
      setScore(s => s + 1);
      setGameFeedback(isKidMode ? "CORRECT! 🎉" : "CRITICAL ANALYSIS CORRECT. +15 Eco-Coins.");
      onEarnCoins(isKidMode ? 5 : 15);
    } else {
      setGameFeedback(isKidMode 
        ? `OOPS! That goes in the ${item.bin}! 🧐` 
        : `INCORRECT. Resource mismanaged. Item belongs in ${item.bin.toUpperCase()}.`
      );
    }

    setTimeout(() => {
      setGameFeedback(null);
      setCurrentItemIndex(Math.floor(Math.random() * dataSet.length));
    }, 2000);
  };

  const handleGridSimulation = () => {
    if (totalPower !== 100) {
      setGameFeedback("ERROR: Grid Demand not met. Supply must exactly equal 100MW.");
    } else if (carbonImpact > 250) {
      setGameFeedback("SIMULATION FAILED: Carbon threshold exceeded. City fined.");
      setBudget(prev => prev - 500);
    } else {
      setGameFeedback("SIMULATION SUCCESS: Grid Stabilized. Efficiency Bonus!");
      onEarnCoins(50);
      setBudget(prev => prev + 200);
    }
    setTimeout(() => setGameFeedback(null), 3000);
  };

  // --- RENDERING LOGIC ---

  if (activeGame === 'hub') {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className={`text-4xl md:text-5xl font-black ${isKidMode ? 'text-sky-900' : 'text-stone-800'}`}>
            {isKidMode ? 'Nature Games! 🎮' : 'Sustainability Simulators'}
          </h2>
          <p className={`${isKidMode ? 'text-sky-600 font-bold italic' : 'text-stone-500'}`}>
            {isKidMode 
              ? 'Play and learn! Earn sparkly Earth Stars for every win! 🌟' 
              : 'Test your strategic management skills with real-world environmental scenarios.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Game 1: Sorting */}
          <button 
            onClick={() => { setActiveGame('sort'); setScore(0); }}
            className={`group relative p-8 rounded-[3rem] border-4 transition-all text-left overflow-hidden bg-white ${
              isKidMode ? 'border-sky-100 hover:border-sky-400' : 'border-stone-100 hover:border-emerald-500'
            }`}
          >
            <div className="relative z-10">
              <span className="text-4xl mb-4 block">{isKidMode ? '🤖' : '🔬'}</span>
              <h3 className={`text-2xl font-black mb-2 ${isKidMode ? 'text-sky-900' : 'text-stone-800'}`}>
                {isKidMode ? "Leafy's Sort-o-Matic" : "Circular Economy Audit"}
              </h3>
              <p className={`text-sm mb-6 ${isKidMode ? 'text-sky-600' : 'text-stone-500'}`}>
                {isKidMode 
                  ? "Help Leafy put trash where it belongs! Beep-boop!" 
                  : "Categorize complex industrial waste based on chemical composition and local regulations."}
              </p>
              <div className={`inline-block px-6 py-3 rounded-2xl font-black text-sm text-white ${isKidMode ? 'bg-sky-500' : 'bg-emerald-600'}`}>
                LAUNCH SIM 🚀
              </div>
            </div>
            <span className="absolute -bottom-10 -right-10 text-[10rem] opacity-5 rotate-12">{isKidMode ? '♻️' : '⚖️'}</span>
          </button>

          {/* Game 2: Strategy/Grow */}
          <button 
            onClick={() => setActiveGame(isKidMode ? 'grow' : 'grid')}
            className={`group relative p-8 rounded-[3rem] border-4 transition-all text-left overflow-hidden bg-white ${
              isKidMode ? 'border-emerald-100 hover:border-emerald-400' : 'border-stone-100 hover:border-blue-500'
            }`}
          >
            <div className="relative z-10">
              <span className="text-4xl mb-4 block">{isKidMode ? '✨' : '🏙️'}</span>
              <h3 className={`text-2xl font-black mb-2 ${isKidMode ? 'text-emerald-900' : 'text-stone-800'}`}>
                {isKidMode ? "Magic Forest Grower" : "Grid Architect v1.0"}
              </h3>
              <p className={`text-sm mb-6 ${isKidMode ? 'text-emerald-600' : 'text-stone-500'}`}>
                {isKidMode 
                  ? "Plant a seed and water it to grow a giant tree! It's magic!" 
                  : "Balance energy supply vs demand while minimizing carbon footprint and managing city funds."}
              </p>
              <div className={`inline-block px-6 py-3 rounded-2xl font-black text-sm text-white ${isKidMode ? 'bg-emerald-500' : 'bg-blue-600'}`}>
                LAUNCH SIM ⚡
              </div>
            </div>
            <span className="absolute -bottom-10 -right-10 text-[10rem] opacity-5 rotate-12">{isKidMode ? '🌳' : '📈'}</span>
          </button>
        </div>
      </div>
    );
  }

  // --- PRO MODE: GRID ARCHITECT ---
  if (activeGame === 'grid' && !isKidMode) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-stone-200 relative overflow-hidden">
          <button onClick={() => setActiveGame('hub')} className="absolute top-8 left-8 text-stone-400 hover:text-stone-800">← Back to Hub</button>
          
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-stone-800">Grid Architect Simulation</h2>
            <p className="text-stone-500">Target: Stabilize power at 100MW | Carbon Limit: 250 Units</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100 text-center">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Status</p>
              <p className={`text-2xl font-black ${totalPower === 100 ? 'text-emerald-600' : 'text-amber-500'}`}>{totalPower} / 100 MW</p>
            </div>
            <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100 text-center">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Carbon Impact</p>
              <p className={`text-2xl font-black ${carbonImpact <= 250 ? 'text-emerald-600' : 'text-red-500'}`}>{carbonImpact.toFixed(1)} units</p>
            </div>
            <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100 text-center">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">City Funds</p>
              <p className="text-2xl font-black text-amber-600">${budget}</p>
            </div>
          </div>

          <div className="space-y-8 mb-12">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-bold flex items-center gap-2">☀️ Solar Power <span className="text-xs text-stone-400">(Low Carbon, High Cost)</span></span>
                <span className="font-black">{solar}MW</span>
              </div>
              <input type="range" value={solar} onChange={(e) => setSolar(Number(e.target.value))} className="w-full h-3 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-bold flex items-center gap-2">💨 Wind Energy <span className="text-xs text-stone-400">(Zero Carbon, Medium Cost)</span></span>
                <span className="font-black">{wind}MW</span>
              </div>
              <input type="range" value={wind} onChange={(e) => setWind(Number(e.target.value))} className="w-full h-3 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-sky-400" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-bold flex items-center gap-2">🔥 Natural Gas <span className="text-xs text-stone-400">(High Carbon, Low Cost)</span></span>
                <span className="font-black">{gas}MW</span>
              </div>
              <input type="range" value={gas} onChange={(e) => setGas(Number(e.target.value))} className="w-full h-3 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-stone-700" />
            </div>
          </div>

          {gameFeedback && (
            <div className={`p-4 rounded-2xl mb-8 text-center font-bold animate-in fade-in slide-in-from-top-2 ${gameFeedback.includes('SUCCESS') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {gameFeedback}
            </div>
          )}

          <button 
            onClick={handleGridSimulation}
            className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black transition-all shadow-lg active:scale-95"
          >
            RUN GRID STABILITY TEST
          </button>
        </div>
      </div>
    );
  }

  // --- SORTING GAMES (Kid & Pro variants) ---
  if (activeGame === 'sort') {
    const dataSet = isKidMode ? ITEMS_TO_SORT_KID : ADVANCED_WASTE;
    const currentItem = dataSet[currentItemIndex];

    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
        <div className={`bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border-4 relative ${isKidMode ? 'border-sky-100' : 'border-stone-100'}`}>
          <button onClick={() => setActiveGame('hub')} className="absolute top-8 left-8 text-stone-400">← Back</button>
          
          <div className="text-center mb-10">
            <h2 className={`text-3xl font-black ${isKidMode ? 'text-sky-900' : 'text-stone-800'}`}>
              {isKidMode ? "Leafy's Sort-o-Matic" : "Advanced Resource Audit"}
            </h2>
            <p className="font-bold opacity-60">Score: {score} {isKidMode ? 'Stars 🌟' : 'Points'}</p>
          </div>

          <div className={`h-64 flex flex-col items-center justify-center rounded-[2.5rem] mb-10 relative overflow-hidden shadow-inner ${isKidMode ? 'bg-sky-50' : 'bg-stone-50'}`}>
             {gameFeedback ? (
               <div className={`text-xl font-black text-center px-6 ${gameFeedback.includes('CORRECT') ? 'text-emerald-600' : 'text-amber-600'}`}>
                 {gameFeedback}
               </div>
             ) : (
               <>
                 <div className={`${isKidMode ? 'text-[8rem]' : 'text-7xl'} mb-4`}>{currentItem.icon}</div>
                 <h4 className="font-black text-xl">{currentItem.name}</h4>
                 {/* Fix: TypeScript error where 'info' property was not recognized on the union of kid/pro items.
                     We cast to any when we know we are in pro mode. */}
                 {!isKidMode && <p className="text-xs text-stone-400 mt-2 max-w-xs text-center">{(currentItem as any).info}</p>}
               </>
             )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {isKidMode ? (
              <>
                <button onClick={() => handleSort('recycle')} className="bg-blue-400 text-white p-6 rounded-3xl font-black transition-all hover:scale-105">RECYCLE ♻️</button>
                <button onClick={() => handleSort('compost')} className="bg-emerald-500 text-white p-6 rounded-3xl font-black transition-all hover:scale-105">COMPOST 🍏</button>
                <button onClick={() => handleSort('trash')} className="bg-stone-500 text-white p-6 rounded-3xl font-black transition-all hover:scale-105 col-span-2">TRASH 🗑️</button>
              </>
            ) : (
              <>
                <button onClick={() => handleSort('hazardous')} className="bg-red-600 text-white p-5 rounded-2xl font-bold text-sm transition-all hover:bg-red-700">HAZARDOUS</button>
                <button onClick={() => handleSort('e-waste')} className="bg-amber-600 text-white p-5 rounded-2xl font-bold text-sm transition-all hover:bg-amber-700">E-WASTE</button>
                <button onClick={() => handleSort('specialized')} className="bg-sky-600 text-white p-5 rounded-2xl font-bold text-sm transition-all hover:bg-sky-700">SPECIAL PLASTIC</button>
                <button onClick={() => handleSort('compost')} className="bg-emerald-600 text-white p-5 rounded-2xl font-bold text-sm transition-all hover:bg-emerald-700">ORGANICS</button>
                <button onClick={() => handleSort('landfill')} className="bg-stone-800 text-white p-5 rounded-2xl font-bold text-sm transition-all hover:bg-black col-span-2">LANDFILL / NON-RECYCLABLE</button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- KID MODE: GROWER ---
  if (activeGame === 'grow' && isKidMode) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in-95 duration-500 text-center">
        <div className="bg-white p-12 rounded-[3rem] shadow-xl border-4 border-sky-100 relative overflow-hidden">
          <button onClick={() => setActiveGame('hub')} className="absolute top-6 left-6 text-2xl">🔙</button>
          <h2 className="text-3xl font-black text-sky-900 mb-8">The Magic Forest Grower</h2>
          
          <div className="relative h-64 w-full flex items-center justify-center mb-12">
            <div className="absolute bottom-0 w-full h-8 bg-stone-300 rounded-full blur-sm"></div>
            <div 
              className="transition-all duration-500 ease-out"
              style={{ fontSize: `${2 + (growth / 10)}rem` }}
            >
              {growth === 0 ? '🌱' : growth < 40 ? '🌿' : growth < 70 ? '🎋' : '🌳'}
            </div>
            {gameFeedback && (
              <div className="absolute -top-10 bg-yellow-400 text-white p-4 rounded-2xl font-black shadow-xl animate-bounce">
                {gameFeedback}
              </div>
            )}
          </div>

          <div className="w-full bg-sky-50 h-6 rounded-full overflow-hidden border-2 border-sky-100 mb-12">
            <div className="h-full bg-sky-500 transition-all duration-300" style={{ width: `${growth}%` }}></div>
          </div>

          {growth >= 100 ? (
            <button onClick={() => setGrowth(0)} className="w-full py-6 bg-yellow-400 text-white rounded-[2rem] font-black text-2xl shadow-xl shadow-yellow-100">
              PLANT ANOTHER! 🚀
            </button>
          ) : (
            <button 
              onClick={() => {
                const next = growth + 5;
                setGrowth(next);
                if (next >= 100) { onEarnCoins(100); setGameFeedback("YOU GREW A MIGHTY TREE! 🌳 +100 Stars!"); }
              }}
              className="w-full py-8 bg-sky-500 hover:bg-sky-600 text-white rounded-[2rem] font-black text-2xl shadow-xl shadow-sky-100 transition-all active:scale-95"
            >
              💧 WATER THE TREE!
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default NatureGames;