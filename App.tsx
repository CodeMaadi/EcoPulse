
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
import OnboardingForm from './components/OnboardingForm';
import AvatarCustomizer from './components/AvatarCustomizer';
import { EcoLevel, UserProfile } from './types';

const PRO_LEVELS: EcoLevel[] = [
  { rank: 1, name: 'Seedling', cost: 0, icon: '🌱' },
  { rank: 2, name: 'Sprout', cost: 150, icon: '🌿' },
  { rank: 3, name: 'Sapling', cost: 350, icon: '🌳' },
  { rank: 4, name: 'Young Oak', cost: 600, icon: '🪵' },
  { rank: 5, name: 'Forest Runner', cost: 900, icon: '🏃' },
  { rank: 6, name: 'Eco-Warrior', cost: 1300, icon: '🛡️' },
  { rank: 7, name: 'Solar Sage', cost: 1800, icon: '☀️' },
  { rank: 8, name: 'River Master', cost: 2400, icon: '🌊' },
  { rank: 9, name: 'Wind Rider', cost: 3100, icon: '🌬️' },
  { rank: 10, name: 'Green Titan', cost: 4000, icon: '🏔️' },
  { rank: 11, name: 'Forest Guardian', cost: 5000, icon: '🏰' },
  { rank: 12, name: 'Earth Champion', cost: 6500, icon: '🌍' },
];

const KID_LEVELS: EcoLevel[] = [
  { rank: 1, name: 'Nature Friend', cost: 0, icon: '🦋' },
  { rank: 2, name: 'Petal Pal', cost: 100, icon: '🌸' },
  { rank: 3, name: 'Sunbeam', cost: 250, icon: '🌤️' },
  { rank: 4, name: 'Star Helper', cost: 450, icon: '⭐' },
  { rank: 5, name: 'Cloud Hopper', cost: 700, icon: '☁️' },
  { rank: 6, name: 'Tree Hero', cost: 1000, icon: '🌳' },
  { rank: 7, name: 'Rainbow Rider', cost: 1400, icon: '🌈' },
  { rank: 8, name: 'Jungle Scout', cost: 1900, icon: '🐆' },
  { rank: 9, name: 'Ocean Explorer', cost: 2500, icon: '🐬' },
  { rank: 10, name: 'Planet Pal', cost: 3200, icon: '🌎' },
  { rank: 11, name: 'Moon Walker', cost: 4100, icon: '🌙' },
  { rank: 12, name: 'Earth Wizard', cost: 5200, icon: '🧙‍♂️' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProfileCustomizer, setShowProfileCustomizer] = useState(false);

  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('ecopulse_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [mode, setMode] = useState<'pro' | 'kid'>(() => {
    const saved = localStorage.getItem('ecopulse_mode');
    return (saved === 'kid' || saved === 'pro') ? saved : 'pro';
  });

  const [proCoins, setProCoins] = useState<number>(() => {
    const saved = localStorage.getItem('ecopulse_coins_pro');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [kidCoins, setKidCoins] = useState<number>(() => {
    const saved = localStorage.getItem('ecopulse_coins_kid');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [proRank, setProRank] = useState<number>(() => {
    const saved = localStorage.getItem('ecopulse_rank_pro');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [kidRank, setKidRank] = useState<number>(() => {
    const saved = localStorage.getItem('ecopulse_rank_kid');
    return saved ? parseInt(saved, 10) : 1;
  });

  useEffect(() => {
    localStorage.setItem('ecopulse_mode', mode);
  }, [mode]);

  useEffect(() => {
    if (profile) localStorage.setItem('ecopulse_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => localStorage.setItem('ecopulse_coins_pro', proCoins.toString()), [proCoins]);
  useEffect(() => localStorage.setItem('ecopulse_coins_kid', kidCoins.toString()), [kidCoins]);
  useEffect(() => localStorage.setItem('ecopulse_rank_pro', proRank.toString()), [proRank]);
  useEffect(() => localStorage.setItem('ecopulse_rank_kid', kidRank.toString()), [kidRank]);

  const isKid = mode === 'kid';
  const ecoCoins = isKid ? kidCoins : proCoins;
  const levelRank = isKid ? kidRank : proRank;
  const levels = isKid ? KID_LEVELS : PRO_LEVELS;

  const earnCoins = (amount: number) => {
    if (isKid) setKidCoins(prev => prev + amount);
    else setProCoins(prev => prev + amount);
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

  const handleOnboardingComplete = (userProfile: UserProfile) => {
    setProfile(userProfile);
  };

  const currentLevel = levels.find(l => l.rank === levelRank) || levels[levels.length - 1];
  const nextLevel = levels.find(l => l.rank === levelRank + 1);

  const renderContent = () => {
    if (!profile) return null;
    switch (activeTab) {
      case 'dashboard': return <Dashboard ecoCoins={ecoCoins} currentLevel={currentLevel} nextLevel={nextLevel} onLevelUp={levelUp} isKidMode={isKid} />;
      case 'advisor': return <Advisor isKidMode={isKid} userProfile={profile} />;
      case 'news': return <EcoNews isKidMode={isKid} />;
      case 'games': return <NatureGames onEarnCoins={earnCoins} isKidMode={isKid} currentRank={levelRank} />;
      case 'missions': return <Missions onEarnCoins={earnCoins} isKidMode={isKid} />;
      case 'quiz': return <Quiz onEarnCoins={earnCoins} isKidMode={isKid} />;
      case 'orgs': return <OrganizationFinder isKidMode={isKid} />;
      case 'learning': return <KnowledgeHub isKidMode={isKid} />;
      default: return <Dashboard ecoCoins={ecoCoins} currentLevel={currentLevel} nextLevel={nextLevel} onLevelUp={levelUp} isKidMode={isKid} />;
    }
  };

  return (
    <div className={isKid ? 'kid-theme' : 'pro-theme'}>
      {!profile && <OnboardingForm isKidMode={isKid} onComplete={handleOnboardingComplete} />}
      
      {profile && showProfileCustomizer && (
        <AvatarCustomizer 
          profile={profile} 
          isKidMode={isKid}
          onUpdate={setProfile} 
          onClose={() => setShowProfileCustomizer(false)} 
        />
      )}

      {profile && (
        <Layout 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          ecoCoins={ecoCoins} 
          currentLevel={currentLevel}
          mode={mode}
          setMode={setMode}
          userProfile={profile}
          onOpenProfile={() => setShowProfileCustomizer(true)}
        >
          <div className="max-w-6xl mx-auto h-full">
            {renderContent()}
          </div>
        </Layout>
      )}
    </div>
  );
};

export default App;
