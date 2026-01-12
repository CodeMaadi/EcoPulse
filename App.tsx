
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

// Helper to generate 100 levels
const generateRanks = (isKid: boolean): EcoLevel[] => {
  const levels: EcoLevel[] = [];
  const proPrefixes = ["Seedling", "Sprout", "Sapling", "Oak", "Grove", "Forest", "Warrior", "Sage", "Master", "Titan", "Guardian", "Champion"];
  const kidPrefixes = ["Nature Friend", "Petal Pal", "Sunbeam", "Star Helper", "Cloud Hopper", "Tree Hero", "Rainbow Rider", "Jungle Scout", "Ocean Explorer", "Planet Pal", "Moon Walker", "Earth Wizard"];
  const icons = isKid ? ["🌱", "🌸", "☀️", "🦋", "🌈", "🦒", "🐬", "🌍", "🌙", "✨"] : ["🌿", "🌳", "🪵", "🛡️", "☀️", "🌊", "🌬️", "🏔️", "🏰", "🌍"];

  for (let i = 1; i <= 100; i++) {
    const tierIndex = Math.floor((i - 1) / 10);
    const subTier = (i - 1) % 10 + 1;
    const prefix = isKid ? kidPrefixes[tierIndex % kidPrefixes.length] : proPrefixes[tierIndex % proPrefixes.length];
    
    // Cost formula: exponential scaling
    const cost = i === 1 ? 0 : Math.floor(100 * Math.pow(1.06, i - 1) + (i * 25));
    
    levels.push({
      rank: i,
      name: subTier === 10 ? `Supreme ${prefix}` : `${prefix} ${subTier}`,
      cost: cost,
      icon: icons[tierIndex % icons.length]
    });
  }
  return levels;
};

const PRO_LEVELS = generateRanks(false);
const KID_LEVELS = generateRanks(true);

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
