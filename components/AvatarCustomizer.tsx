
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface AvatarCustomizerProps {
  profile: UserProfile;
  onUpdate: (updatedProfile: UserProfile) => void;
  onClose: () => void;
  isKidMode: boolean;
}

const AVATARS = ["🧑‍🚀", "🧑‍🔬", "🧑‍🎨", "🧑‍🌾", "🦸", "🥷", "🧚", "🧙", "🤖", "🦁", "🐢", "🐶", "🦊", "🐼", "🐨", "🐙", "🦋", "🦄"];

const AvatarCustomizer: React.FC<AvatarCustomizerProps> = ({ profile, onUpdate, onClose, isKidMode }) => {
  const [localProfile, setLocalProfile] = useState<UserProfile>(profile);

  const handleSave = () => {
    if (localProfile.pronouns.trim()) {
      onUpdate(localProfile);
      onClose();
    }
  };

  const labelClass = `block text-[10px] font-black uppercase tracking-widest mb-3 ${isKidMode ? 'text-sky-500' : 'text-stone-400'}`;
  const inputClass = `w-full p-4 rounded-2xl border-4 outline-none transition-all ${isKidMode ? 'border-sky-100 focus:border-sky-400 bg-white text-sky-900 font-bold' : 'border-stone-100 focus:border-emerald-500 bg-stone-50 text-stone-800'}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
      <div className={`w-full max-w-lg bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl animate-in zoom-in-95 border-4 ${isKidMode ? 'border-sky-400' : 'border-emerald-700'}`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className={`text-3xl font-black ${isKidMode ? 'text-sky-900' : 'text-stone-800'}`}>
            {isKidMode ? 'Style Your Hero! ✨' : 'Edit Profile'}
          </h2>
          <button onClick={onClose} className="text-2xl hover:scale-110 transition-transform">✕</button>
        </div>

        <div className="space-y-8">
          <div>
            <label className={labelClass}>Pronouns</label>
            <input 
              type="text" 
              className={inputClass} 
              value={localProfile.pronouns} 
              onChange={e => setLocalProfile({...localProfile, pronouns: e.target.value})} 
              placeholder="Enter your pronouns..." 
            />
          </div>

          <div>
            <label className={labelClass}>Avatar Icon</label>
            <div className="grid grid-cols-6 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {AVATARS.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setLocalProfile({...localProfile, avatarIcon: icon})}
                  className={`aspect-square text-3xl flex items-center justify-center rounded-2xl transition-all border-4 ${
                    localProfile.avatarIcon === icon 
                      ? isKidMode ? 'border-sky-400 bg-sky-50 scale-105 shadow-sm' : 'border-emerald-600 bg-emerald-50 scale-105 shadow-sm'
                      : 'border-transparent bg-stone-50 hover:bg-stone-100'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!localProfile.pronouns.trim()}
          className={`w-full mt-10 py-6 rounded-[2.5rem] font-black text-2xl text-white shadow-xl transition-all active:scale-95 disabled:opacity-50 ${isKidMode ? 'bg-sky-500 hover:bg-sky-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}
        >
          {isKidMode ? 'Looking Great! 🚀' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default AvatarCustomizer;
