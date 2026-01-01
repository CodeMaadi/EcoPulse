
import React, { useState, useEffect } from 'react';
import { generateMissions } from '../services/geminiService';
import { EcoMission } from '../types';

interface MissionsProps {
  onEarnCoins: (amount: number) => void;
  isKidMode?: boolean;
}

const Missions: React.FC<MissionsProps> = ({ onEarnCoins, isKidMode }) => {
  const [missions, setMissions] = useState<EcoMission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMissions = async () => {
      try {
        const data = await generateMissions(isKidMode);
        const formatted = data.map((m, i) => ({
          ...m,
          id: i.toString(),
          completed: false,
          coinReward: isKidMode ? 20 : 50
        }));
        setMissions(formatted);
      } catch (e) {
        console.error("Failed to load missions", e);
      } finally {
        setLoading(false);
      }
    };
    loadMissions();
  }, [isKidMode]);

  const toggleMission = (id: string) => {
    const mission = missions.find(m => m.id === id);
    if (mission && !mission.completed) {
      onEarnCoins(mission.coinReward);
    }
    setMissions(prev => prev.map(m => m.id === id ? { ...m, completed: !m.completed } : m));
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center md:text-left mb-8">
        <h2 className={`text-4xl font-black ${isKidMode ? 'text-sky-900' : 'text-stone-800'}`}>
          {isKidMode ? 'Fun Quests!' : 'Daily Missions'}
        </h2>
        <p className={`${isKidMode ? 'text-sky-600 font-bold' : 'text-stone-500'}`}>
          {isKidMode ? 'Finish a quest to earn sparkly Earth Stars! 🌟' : 'Small actions, big impact. Complete tasks to earn Eco-Coins.'}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-stone-100 animate-pulse h-48"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {missions.map(mission => (
            <div 
              key={mission.id}
              onClick={() => !mission.completed && toggleMission(mission.id)}
              className={`group cursor-pointer p-8 rounded-[3rem] border-4 transition-all relative overflow-hidden ${
                mission.completed 
                  ? isKidMode ? 'bg-sky-50 border-sky-400 shadow-sky-100' : 'bg-emerald-50 border-emerald-500'
                  : isKidMode ? 'bg-white border-sky-50 hover:border-sky-300 hover:shadow-2xl' : 'bg-white border-stone-100 hover:shadow-lg'
              }`}
            >
              {mission.completed && <div className="absolute top-4 right-4 text-3xl">🎉</div>}
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isKidMode ? 'bg-yellow-400 text-yellow-900' : 'bg-emerald-100 text-emerald-700'}`}>
                    {mission.category}
                  </span>
                  <span className={`font-black ${isKidMode ? 'text-sky-600' : 'text-amber-600'}`}>
                    +{mission.coinReward} {isKidMode ? '🌟' : '🪙'}
                  </span>
                </div>
                <h3 className={`text-2xl font-black mb-2 ${mission.completed ? 'opacity-40 line-through' : isKidMode ? 'text-sky-900' : 'text-stone-800'}`}>
                  {mission.title}
                </h3>
                <p className={`text-sm font-medium leading-relaxed ${mission.completed ? 'opacity-30' : isKidMode ? 'text-sky-700' : 'text-stone-500'}`}>
                  {mission.description}
                </p>
                <div className="mt-8">
                   <button className={`w-full py-4 rounded-2xl font-black text-sm transition-all ${mission.completed ? 'bg-sky-200 text-sky-600' : isKidMode ? 'bg-sky-500 text-white group-hover:bg-sky-600' : 'bg-emerald-600 text-white'}`}>
                     {mission.completed ? 'Hooray! Finished' : isKidMode ? "Let's Do It! 🚀" : 'Complete Action'}
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Missions;
