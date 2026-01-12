
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ImpactData, EcoLevel } from '../types';

const data: ImpactData[] = [
  { name: 'Water', savings: 450, target: 1000 },
  { name: 'Air', savings: 12, target: 50 },
  { name: 'Trash', savings: 800, target: 2000 },
  { name: 'Sun', savings: 35, target: 100 },
];

interface DashboardProps {
  ecoCoins: number;
  currentLevel: EcoLevel;
  nextLevel?: EcoLevel;
  onLevelUp: () => boolean;
  isKidMode?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ ecoCoins, currentLevel, nextLevel, onLevelUp, isKidMode }) => {
  const isPrestige = currentLevel.rank > 50;

  if (isKidMode) {
    // Generate garden based on milestone ranks
    const gardenIcons = ['🌱', '🌸', '🌻', '🌳', '🦋', '🍄', '🌈', '🏰', '🐉', '✨'];
    const activeGardenCount = Math.floor(currentLevel.rank / 10) + 1;
    const activeGarden = gardenIcons.slice(0, activeGardenCount);

    return (
      <div className={`space-y-8 animate-in zoom-in-95 duration-500 ${isPrestige ? 'prestige-glow' : ''}`}>
        <div className={`flex flex-col md:flex-row gap-8 items-center bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border-4 overflow-hidden relative ${isPrestige ? 'border-yellow-400' : 'border-sky-100'}`}>
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <span className="text-[15rem]">{isPrestige ? '✨' : '🌈'}</span>
          </div>
          
          <div className={`w-48 h-48 rounded-full flex items-center justify-center text-8xl shadow-inner relative z-10 animate-bounce-slow ${isPrestige ? 'bg-yellow-50' : 'bg-sky-100'}`}>
            {isPrestige ? '👑' : '🤖'}
            <div className={`absolute -top-2 -right-2 text-white text-xs font-black p-2 rounded-full shadow-lg ${isPrestige ? 'bg-yellow-500' : 'bg-yellow-400'}`}>
              {isPrestige ? 'MASTER!' : 'LEAFY!'}
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left relative z-10">
            <h2 className={`text-4xl md:text-5xl font-black mb-4 ${isKidMode ? 'text-sky-900' : 'text-stone-800'}`}>
              {isPrestige ? 'Amazing Master!' : 'Hi Planet Hero!'}
            </h2>
            <p className="text-sky-700 text-xl font-medium leading-relaxed max-w-lg">
              Rank {currentLevel.rank}! You are a {currentLevel.name}! 
              {isPrestige 
                ? " The Earth is singing because of your hard work! You are legendary!"
                : " Every piece of paper you recycle makes me so happy! beep-boop!"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className={`p-8 rounded-[3rem] shadow-xl text-white border-b-8 ${isPrestige ? 'bg-gradient-to-br from-yellow-400 to-amber-600 border-amber-700' : 'bg-yellow-400 text-yellow-900 border-yellow-500'}`}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black">Milestone Progress</h3>
                <p className="font-bold opacity-80">Next Goal: Rank {Math.ceil((currentLevel.rank + 1) / 10) * 10}</p>
              </div>
              <span className="text-5xl">{isPrestige ? '🏆' : '✨'}</span>
            </div>
            
            <div className="flex items-center gap-6 bg-white/20 p-4 rounded-[2rem] mb-8">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-4xl shadow-sm">
                {currentLevel.icon}
              </div>
              <div>
                <p className="text-xs font-black uppercase opacity-60">Currently</p>
                <p className="text-2xl font-black">{currentLevel.name}</p>
              </div>
            </div>

            {nextLevel ? (
              <div className="space-y-4">
                <button 
                  onClick={() => onLevelUp()}
                  disabled={ecoCoins < nextLevel.cost}
                  className={`w-full py-5 rounded-[2rem] text-xl font-black transition-all shadow-xl active:scale-95 ${
                    ecoCoins >= nextLevel.cost 
                      ? 'bg-sky-500 text-white hover:bg-sky-600' 
                      : 'bg-white/20 text-yellow-800 cursor-not-allowed shadow-none'
                  }`}
                >
                  {ecoCoins >= nextLevel.cost ? `Upgrade to Rank ${nextLevel.rank}! 🚀` : `Need ${nextLevel.cost - ecoCoins} more Stars! 🌟`}
                </button>
                <p className="text-center text-sm font-bold opacity-70">Progress: {currentLevel.rank}/100</p>
              </div>
            ) : (
              <div className="text-center font-black py-4 uppercase">You are an Earth Legend! 🌍👑✨</div>
            )}
          </div>

          <div className="bg-white p-8 rounded-[3rem] shadow-xl border-4 border-sky-50 flex flex-col justify-center items-center text-center min-h-[300px]">
             <h3 className="text-2xl font-black text-sky-900 mb-2">My Earth Garden</h3>
             <p className="text-sky-600 font-bold mb-6">
               Milestones reached: {Math.floor(currentLevel.rank / 10)} / 10
             </p>
             <div className="text-7xl flex flex-wrap justify-center gap-4">
               {activeGarden.map((icon, i) => (
                 <span key={i} className="hover:scale-125 transition-transform cursor-default animate-in zoom-in">{icon}</span>
               ))}
             </div>
             <div className="mt-8 w-full bg-sky-50 h-6 rounded-full overflow-hidden border-2 border-sky-100">
                <div 
                  className={`h-full transition-all duration-1000 ${isPrestige ? 'bg-yellow-400' : 'bg-sky-400'}`} 
                  style={{width: `${nextLevel ? Math.min(100, (ecoCoins / nextLevel.cost) * 100) : 100}%`}}
                ></div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 animate-in fade-in duration-500 ${isPrestige ? 'prestige-mode' : ''}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-stone-800">Rank {currentLevel.rank} Progression</h2>
          <p className="text-stone-500">Tier: {Math.floor((currentLevel.rank - 1) / 10) + 1} of 10 milestones.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 text-center min-w-[120px]">
            <p className="text-xs text-stone-400 font-bold uppercase">Balance</p>
            <p className="text-2xl font-bold text-amber-600 flex items-center justify-center gap-1">
              🪙 {ecoCoins}
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 text-center min-w-[120px]">
            <p className="text-xs text-stone-400 font-bold uppercase">Milestone</p>
            <p className="text-2xl font-bold text-emerald-600 flex items-center justify-center gap-2">
              {currentLevel.icon} {Math.floor(currentLevel.rank / 10) * 10}%
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`bg-white p-6 rounded-[2.5rem] shadow-sm border flex flex-col justify-between ${isPrestige ? 'border-yellow-200' : 'border-stone-200'}`}>
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <span className={`p-1.5 rounded-lg ${isPrestige ? 'bg-yellow-100 text-yellow-600' : 'bg-amber-100 text-amber-600'}`}>⭐</span> Rank Upgrade Station
            </h3>
            <p className="text-stone-500 text-sm mb-6">Complete 100 levels to unlock the "Earth Legend" final game.</p>
            
            <div className={`flex items-center gap-6 mb-8 p-4 rounded-3xl ${isPrestige ? 'bg-yellow-50' : 'bg-stone-50'}`}>
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl border border-stone-100">
                {currentLevel.icon}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Rank {currentLevel.rank}</p>
                <p className="text-xl font-black text-stone-800">{currentLevel.name}</p>
              </div>
              {nextLevel && (
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-500 uppercase">Cost</p>
                  <p className="text-lg font-bold text-stone-400">🪙 {nextLevel.cost}</p>
                </div>
              )}
            </div>
          </div>

          {nextLevel ? (
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-stone-500 uppercase">Progression</p>
                  <p className="text-2xl font-black text-amber-600">Level {currentLevel.rank} / 100</p>
                </div>
                <button 
                  onClick={() => onLevelUp()}
                  disabled={ecoCoins < nextLevel.cost}
                  className={`px-8 py-3 rounded-2xl font-bold transition-all shadow-lg ${
                    ecoCoins >= nextLevel.cost 
                      ? 'bg-emerald-600 text-white shadow-emerald-100 hover:bg-emerald-700 active:scale-95' 
                      : 'bg-stone-100 text-stone-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  Upgrade Rank
                </button>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${isPrestige ? 'bg-yellow-500' : 'bg-amber-500'}`} 
                  style={{ width: `${Math.min(100, (ecoCoins / nextLevel.cost) * 100)}%` }}
                ></div>
              </div>
            </div>
          ) : (
             <div className="p-8 text-center bg-emerald-50 rounded-3xl border border-emerald-100">
               <p className="text-4xl mb-2">🌍</p>
               <p className="font-black text-emerald-900">Earth Champion Reached!</p>
             </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">📈</span> Impact History
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#78716c', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#78716c', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none' }}
                />
                <Bar dataKey="savings" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <style>{`
        .prestige-glow {
          box-shadow: 0 0 40px rgba(234, 179, 8, 0.1);
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
