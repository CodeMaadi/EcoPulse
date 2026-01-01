
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
  if (isKidMode) {
    return (
      <div className="space-y-8 animate-in zoom-in-95 duration-500">
        <div className="flex flex-col md:flex-row gap-8 items-center bg-white p-8 md:p-12 rounded-[3rem] shadow-xl shadow-sky-100 border-4 border-sky-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <span className="text-[15rem]">🌈</span>
          </div>
          
          <div className="w-48 h-48 bg-sky-100 rounded-full flex items-center justify-center text-8xl shadow-inner relative z-10 animate-bounce-slow">
            🤖
            <div className="absolute -top-2 -right-2 bg-yellow-400 text-white text-xs font-black p-2 rounded-full shadow-lg">LEAFY!</div>
          </div>
          
          <div className="flex-1 text-center md:text-left relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-sky-900 mb-4">Hi Planet Hero!</h2>
            <p className="text-sky-700 text-xl font-medium leading-relaxed max-w-lg">
              I'm Leafy! You're doing a super-duper job helping our Earth. Every piece of paper you recycle makes me so happy! beep-boop! 
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-yellow-400 p-8 rounded-[3rem] shadow-xl text-yellow-900 border-b-8 border-yellow-500">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black">Level Up Zone!</h3>
                <p className="font-bold opacity-80">Make your Earth Rank bigger!</p>
              </div>
              <span className="text-5xl">✨</span>
            </div>
            
            <div className="flex items-center gap-6 bg-white/40 p-4 rounded-[2rem] mb-8">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-4xl shadow-sm">
                {currentLevel.icon}
              </div>
              <div>
                <p className="text-xs font-black uppercase opacity-60">You are a</p>
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
                  {ecoCoins >= nextLevel.cost ? `Upgrade to ${nextLevel.name}! 🚀` : `Need ${nextLevel.cost - ecoCoins} more Stars! 🌟`}
                </button>
                <p className="text-center text-sm font-bold opacity-70">Stars make the world go round!</p>
              </div>
            ) : (
              <div className="text-center font-black py-4">YOU ARE AN EARTH WIZARD! 🧙‍♂️✨</div>
            )}
          </div>

          <div className="bg-white p-8 rounded-[3rem] shadow-xl border-4 border-sky-50 flex flex-col justify-center items-center text-center">
             <h3 className="text-2xl font-black text-sky-900 mb-2">My Earth Garden</h3>
             <p className="text-sky-600 font-bold mb-6">The more you help, the more flowers grow!</p>
             <div className="text-7xl flex gap-2 animate-pulse">
               🌻 🌳 🌸 🦋 🍄
             </div>
             <div className="mt-8 w-full bg-sky-50 h-6 rounded-full overflow-hidden border-2 border-sky-100">
                <div className="h-full bg-sky-400 w-[70%]" style={{width: `${Math.min(100, (ecoCoins / 1000) * 100)}%`}}></div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-stone-800">Your Green Impact</h2>
          <p className="text-stone-500">Tracking your sustainability journey this month.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 text-center min-w-[120px]">
            <p className="text-xs text-stone-400 font-bold uppercase">Balance</p>
            <p className="text-2xl font-bold text-amber-600 flex items-center justify-center gap-1">
              🪙 {ecoCoins}
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 text-center min-w-[120px]">
            <p className="text-xs text-stone-400 font-bold uppercase">Rank</p>
            <p className="text-2xl font-bold text-emerald-600 flex items-center justify-center gap-2">
              {currentLevel.icon} {currentLevel.rank}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-stone-200 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <span className="p-1.5 bg-amber-100 text-amber-600 rounded-lg">⭐</span> Progression Station
            </h3>
            <p className="text-stone-500 text-sm mb-6">Earn coins from missions and quizzes to upgrade your status.</p>
            
            <div className="flex items-center gap-6 mb-8 p-4 bg-stone-50 rounded-3xl">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl border border-stone-100">
                {currentLevel.icon}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Current Rank</p>
                <p className="text-xl font-black text-stone-800">{currentLevel.name}</p>
              </div>
              {nextLevel && (
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-500 uppercase">Next Rank</p>
                  <p className="text-lg font-bold text-stone-400">{nextLevel.name}</p>
                </div>
              )}
            </div>
          </div>

          {nextLevel ? (
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-stone-500 uppercase">Upgrade Cost</p>
                  <p className="text-2xl font-black text-amber-600">🪙 {nextLevel.cost}</p>
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
                  Upgrade Status
                </button>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 transition-all duration-500" 
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
            <span className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">📈</span> Monthly Progress
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
    </div>
  );
};

export default Dashboard;
