
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Advisor from './components/Advisor';
import Missions from './components/Missions';
import KnowledgeHub from './components/KnowledgeHub';
import Quiz from './components/Quiz';
import OrganizationFinder from './components/OrganizationFinder';
import EcoNews from './components/EcoNews';
import NatureGames from './components/NatureGames';
import { EcoLevel } from './types';

const PRO_LEVELS: EcoLevel[] = [
  { rank: 1, name: 'Seedling', cost: 0, icon: '🌱' },
  { rank: 2, name: 'Sprout', cost: 200, icon: '🌿' },
  { rank: 3, name: 'Sapling', cost: 500, icon: '🌳' },
  { rank: 4, name: 'Eco-Warrior', cost: 1200, icon: '🛡️' },
  { rank: 5, name: 'Forest Guardian', cost: 2500, icon: '🏰' },
  { rank: 6, name: 'Earth Champion', cost: 5000, icon: '🌍' },
];

const KID_LEVELS: EcoLevel[] = [
  { rank: 1, name: 'Nature Friend', cost: 0, icon: '🦋' },
  { rank: 2, name: 'Star Helper', cost: 100, icon: '⭐' },
  { rank: 3, name: 'Tree Hero', cost: 300, icon: '🌳' },
  { rank: 4, name: 'Planet Pal', cost: 600, icon: '🌎' },
  { rank: 5, name: 'Earth Wizard', cost: 1000, icon: '🧙‍♂️' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mode state
  const [mode, setMode] = useState<'pro' | 'kid'>(() => {
    const saved = localStorage.getItem('ecopulse_mode');
    return (saved === 'kid' || saved === 'pro') ? saved : 'pro';
  });

  // Separate Coin States
  const [proCoins, setProCoins] = useState<number>(() => {
    const saved = localStorage.getItem('ecopulse_coins_pro');
    return saved ? parseInt(saved, 10) : 150;
  });
  
  const [kidCoins, setKidCoins] = useState<number>(() => {
    const saved = localStorage.getItem('ecopulse_coins_kid');
    return saved ? parseInt(saved, 10) : 150;
  });
  
  // Separate Rank States
  const [proRank, setProRank] = useState<number>(() => {
    const saved = localStorage.getItem('ecopulse_rank_pro');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [kidRank, setKidRank] = useState<number>(() => {
    const saved = localStorage.getItem('ecopulse_rank_kid');
    return saved ? parseInt(saved, 10) : 1;
  });

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('ecopulse_mode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('ecopulse_coins_pro', proCoins.toString());
  }, [proCoins]);

  useEffect(() => {
    localStorage.setItem('ecopulse_coins_kid', kidCoins.toString());
  }, [kidCoins]);

  useEffect(() => {
    localStorage.setItem('ecopulse_rank_pro', proRank.toString());
  }, [proRank]);

  useEffect(() => {
    localStorage.setItem('ecopulse_rank_kid', kidRank.toString());
  }, [kidRank]);

  // Dynamic values based on current mode
  const isKid = mode === 'kid';
  const ecoCoins = isKid ? kidCoins : proCoins;
  const levelRank = isKid ? kidRank : proRank;
  const levels = isKid ? KID_LEVELS : PRO_LEVELS;

  const earnCoins = (amount: number) => {
    if (isKid) {
      setKidCoins(prev => prev + amount);
    } else {
      setProCoins(prev => prev + amount);
    }
  };

  const levelUp = () => {
    const nextLevel = levels.find(l => l.rank === levelRank + 1);
    if (nextLevel && ecoCoins >= nextLevel.cost) {
      if (isKid) {
        setKidCoins(prev => prev - nextLevel.cost);
        setKidRank(nextLevel.rank);
      } else {
        setProCoins(prev => prev - nextLevel.cost);
        setProRank(nextLevel.rank);
      }
      return true;
    }
    return false;
  };

  const currentLevel = levels.find(l => l.rank === levelRank) || levels[levels.length - 1];
  const nextLevel = levels.find(l => l.rank === levelRank + 1);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard ecoCoins={ecoCoins} currentLevel={currentLevel} nextLevel={nextLevel} onLevelUp={levelUp} isKidMode={isKid} />;
      case 'advisor':
        return <Advisor isKidMode={isKid} />;
      case 'news':
        return <EcoNews isKidMode={isKid} />;
      case 'games':
        return <NatureGames onEarnCoins={earnCoins} isKidMode={isKid} />;
      case 'missions':
        return <Missions onEarnCoins={earnCoins} isKidMode={isKid} />;
      case 'quiz':
        return <Quiz onEarnCoins={earnCoins} isKidMode={isKid} />;
      case 'orgs':
        return <OrganizationFinder isKidMode={isKid} />;
      case 'learning':
        return <KnowledgeHub isKidMode={isKid} />;
      default:
        return <Dashboard ecoCoins={ecoCoins} currentLevel={currentLevel} nextLevel={nextLevel} onLevelUp={levelUp} isKidMode={isKid} />;
    }
  };

  return (
    <div className={isKid ? 'kid-theme' : 'pro-theme'}>
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        ecoCoins={ecoCoins} 
        currentLevel={currentLevel}
        mode={mode}
        setMode={setMode}
      >
        <div className="max-w-6xl mx-auto h-full">
          {renderContent()}
        </div>
      </Layout>
    </div>
  );
};

export default App;
