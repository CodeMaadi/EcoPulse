
import React from 'react';
import { EcoLevel } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  ecoCoins: number;
  currentLevel: EcoLevel;
  mode: 'pro' | 'kid';
  setMode: (mode: 'pro' | 'kid') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, ecoCoins, currentLevel, mode, setMode }) => {
  const isKid = mode === 'kid';
  
  const tabs = [
    { id: 'dashboard', label: isKid ? 'Playground' : 'Dashboard', icon: isKid ? '🎈' : '📊' },
    { id: 'advisor', label: isKid ? 'Leafy Friend' : 'Eco-Advisor', icon: isKid ? '🤖' : '🤖' },
    { id: 'games', label: isKid ? 'Nature Games' : 'Eco-Games', icon: isKid ? '🎮' : '🎮' },
    { id: 'news', label: isKid ? 'Earth Stories' : 'Eco-News', icon: isKid ? '📖' : '📰' },
    { id: 'missions', label: isKid ? 'Fun Quests' : 'Daily Missions', icon: isKid ? '✨' : '🌿' },
    { id: 'quiz', label: isKid ? 'Earth Trivia' : 'Eco-Quiz', icon: isKid ? '🧩' : '📝' },
    { id: 'orgs', label: isKid ? 'Earth Teams' : 'Eco-Orgs', icon: isKid ? '🏘️' : '🏢' },
    { id: 'learning', label: isKid ? 'Smart Hub' : 'Knowledge Hub', icon: isKid ? '🎓' : '📚' }
  ];

  const bgColor = isKid ? 'bg-sky-400' : 'bg-emerald-900';
  const sidebarColor = isKid ? 'bg-white' : 'bg-emerald-900';
  const textColor = isKid ? 'text-sky-900' : 'text-white';

  return (
    <div className={`flex h-screen overflow-hidden ${isKid ? 'bg-sky-50 font-["Inter"]' : 'bg-stone-50'}`}>
      {/* Sidebar - Desktop */}
      <aside className={`hidden md:flex flex-col w-64 ${sidebarColor} ${textColor} p-6 shadow-xl border-r ${isKid ? 'border-sky-100' : 'border-transparent'}`}>
        <div className="flex items-center gap-3 mb-8">
          <div className={`p-2 rounded-2xl ${isKid ? 'bg-yellow-400' : 'bg-emerald-500'}`}>
            <span className="text-2xl">{isKid ? '🚀' : '🌱'}</span>
          </div>
          <h1 className={`text-2xl font-black tracking-tight ${isKid ? 'text-sky-600' : 'text-white'}`}>
            {isKid ? 'EcoPals' : 'EcoPulse'}
          </h1>
        </div>

        <div className="mb-6">
          <button 
            onClick={() => setMode(isKid ? 'pro' : 'kid')}
            className={`w-full py-2 px-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              isKid ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-sky-100 text-sky-700 hover:bg-sky-200'
            }`}
          >
            {isKid ? 'Switch to Pro Mode 💼' : 'Switch to Kid Mode 🌈'}
          </button>
        </div>
        
        <nav className="space-y-1 flex-1 overflow-y-auto pr-2 no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                activeTab === tab.id 
                  ? isKid 
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-100' 
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
                  : isKid 
                    ? 'text-sky-700 hover:bg-sky-50' 
                    : 'text-stone-300 hover:bg-white/10'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="font-bold">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-sky-100">
          <div className={`${isKid ? 'bg-yellow-50 text-yellow-700' : 'bg-emerald-800/40 text-white'} p-4 rounded-3xl space-y-3`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-black tracking-widest">{isKid ? 'Sparkly Stars' : 'Balance'}</span>
              <span className="flex items-center gap-1 font-black">
                {isKid ? '✨' : '🪙'} {ecoCoins}
              </span>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black uppercase">{currentLevel.name}</p>
                <span className="text-sm">{currentLevel.icon}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Mobile Nav */}
        <header className={`md:hidden ${isKid ? 'bg-sky-400' : 'bg-emerald-900'} text-white p-4 flex items-center justify-between sticky top-0 z-10 shadow-md`}>
          <h1 className="text-xl font-black flex items-center gap-2">
            <span>{isKid ? '🎈' : '🌱'}</span> {isKid ? 'EcoPals' : 'EcoPulse'}
          </h1>
          <button 
            onClick={() => setMode(isKid ? 'pro' : 'kid')}
            className="text-xs bg-white/20 px-3 py-1 rounded-full font-bold"
          >
            {isKid ? '💼 Pro' : '🌈 Kid'}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
