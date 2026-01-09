
import React from 'react';
import { EcoLevel, UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  ecoCoins: number;
  currentLevel: EcoLevel;
  mode: 'pro' | 'kid';
  setMode: (mode: 'pro' | 'kid') => void;
  userProfile?: UserProfile | null;
  onOpenProfile: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, activeTab, setActiveTab, ecoCoins, currentLevel, mode, setMode, userProfile, onOpenProfile 
}) => {
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
        {/* Header */}
        <header className={`px-4 py-4 md:px-8 flex items-center justify-between sticky top-0 z-10 transition-colors duration-300 ${isKid ? 'bg-sky-400 text-white shadow-md' : 'bg-emerald-900 text-white md:bg-stone-50 md:text-stone-900 md:border-b md:border-stone-200'}`}>
          <h1 className="md:hidden text-xl font-black flex items-center gap-2">
            <span>{isKid ? '🎈' : '🌱'}</span> {isKid ? 'EcoPals' : 'EcoPulse'}
          </h1>
          <div className="hidden md:block"></div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMode(isKid ? 'pro' : 'kid')}
              className="md:hidden text-xs bg-white/20 px-3 py-1 rounded-full font-bold backdrop-blur-sm"
            >
              {isKid ? '💼 Pro' : '🌈 Kid'}
            </button>
            
            {userProfile && (
              <button 
                onClick={onOpenProfile}
                title="Edit My Profile"
                className={`flex items-center gap-3 p-1.5 pr-4 rounded-full transition-all hover:ring-4 group active:scale-95 ${
                  isKid 
                    ? 'bg-white text-sky-900 shadow-lg ring-sky-200 hover:ring-sky-300' 
                    : 'bg-emerald-600 text-white md:bg-white md:text-stone-800 md:border md:border-stone-200 ring-emerald-500/20 hover:ring-emerald-500/40'
                }`}
              >
                <div className={`w-10 h-10 flex items-center justify-center text-2xl rounded-full shadow-inner ${isKid ? 'bg-sky-50' : 'bg-emerald-700 md:bg-stone-100'}`}>
                  {userProfile.avatarIcon || '👤'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className={`text-[9px] font-black uppercase leading-none mb-0.5 tracking-tighter ${isKid ? 'text-sky-400' : 'text-stone-400'}`}>
                    {userProfile.pronouns}
                  </p>
                  <p className="text-xs font-black leading-none group-hover:underline">
                    {userProfile.name}
                  </p>
                </div>
                <span className={`text-[10px] ml-1 opacity-40 group-hover:opacity-100 group-hover:translate-y-0.5 transition-all`}>✏️</span>
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
