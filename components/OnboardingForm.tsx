
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface OnboardingFormProps {
  onComplete: (profile: UserProfile) => void;
  isKidMode: boolean;
}

const AVATARS = ["🧑‍🚀", "🧑‍🔬", "🧑‍🎨", "🧑‍🌾", "🦸", "🥷", "🧚", "🧙", "🤖", "🦁", "🐢", "🐶", "🦊", "🐼", "🐨", "🐙", "🦋", "🦄"];

const OnboardingForm: React.FC<OnboardingFormProps> = ({ onComplete, isKidMode }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: '',
    favColor: '',
    favFood: '',
    favAnimal: '',
    pronouns: '',
    avatarIcon: AVATARS[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && !profile.pronouns.trim()) return;
    
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    
    if (profile.name.trim() && profile.age.trim() && profile.pronouns.trim()) {
      onComplete(profile);
    }
  };

  const labelClass = `block text-xs font-black uppercase tracking-widest mb-3 ${isKidMode ? 'text-sky-500' : 'text-stone-400'}`;
  const inputClass = `w-full p-4 rounded-2xl border-4 outline-none transition-all ${isKidMode ? 'border-sky-100 focus:border-sky-400 bg-white text-sky-900 font-bold' : 'border-stone-100 focus:border-emerald-500 bg-stone-50 text-stone-800'}`;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto ${isKidMode ? 'bg-sky-400' : 'bg-emerald-900'}`}>
      <div className={`w-full max-w-xl bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden border-8 ${isKidMode ? 'border-white/50' : 'border-emerald-800/50'}`}>
        <div className="relative z-10">
          <div className="text-center mb-10">
            <h1 className={`text-3xl md:text-4xl font-black ${isKidMode ? 'text-sky-900' : 'text-stone-800'}`}>
              {step === 1 ? 'Identify Yourself' : step === 2 ? 'Pick Your Hero!' : 'Personal Details'}
            </h1>
            <p className={`mt-2 font-bold ${isKidMode ? 'text-sky-600' : 'text-stone-500'}`}>
              Step {step} of 3
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <div>
                  <label className={labelClass}>Type your pronouns</label>
                  <input 
                    required 
                    type="text" 
                    className={inputClass} 
                    value={profile.pronouns} 
                    onChange={e => setProfile({...profile, pronouns: e.target.value})} 
                    placeholder={isKidMode ? "e.g. she/her, they/them..." : "Enter your pronouns..."} 
                  />
                  <p className={`mt-3 text-[10px] font-bold ${isKidMode ? 'text-sky-400' : 'text-stone-400'}`}>
                    Tell Leafy how you like to be called! 🌈
                  </p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <label className={labelClass}>Select an icon</label>
                <div className="grid grid-cols-6 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {AVATARS.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setProfile({...profile, avatarIcon: icon})}
                      className={`aspect-square text-3xl flex items-center justify-center rounded-2xl transition-all border-4 ${
                        profile.avatarIcon === icon 
                          ? isKidMode ? 'border-sky-400 bg-sky-50 scale-105 shadow-sm' : 'border-emerald-600 bg-emerald-50 scale-105 shadow-sm'
                          : 'border-transparent bg-stone-50 hover:bg-stone-100'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Name</label>
                    <input required type="text" className={inputClass} value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} placeholder="Eco Hero" />
                  </div>
                  <div>
                    <label className={labelClass}>Age</label>
                    <input required type="number" className={inputClass} value={profile.age} onChange={e => setProfile({...profile, age: e.target.value})} placeholder="25" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Fav Color</label>
                    <input required type="text" className={inputClass} value={profile.favColor} onChange={e => setProfile({...profile, favColor: e.target.value})} placeholder="Emerald" />
                  </div>
                  <div>
                    <label className={labelClass}>Fav Food</label>
                    <input required type="text" className={inputClass} value={profile.favFood} onChange={e => setProfile({...profile, favFood: e.target.value})} placeholder="Pasta" />
                  </div>
                  <div>
                    <label className={labelClass}>Fav Animal</label>
                    <input required type="text" className={inputClass} value={profile.favAnimal} onChange={e => setProfile({...profile, favAnimal: e.target.value})} placeholder="Whale" />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 flex gap-4">
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)} className="flex-1 py-4 font-black text-stone-400 hover:text-stone-800 transition-colors uppercase tracking-widest text-xs">
                  ← Back
                </button>
              )}
              <button 
                type="submit" 
                className={`flex-[2] py-5 rounded-[2rem] font-black text-xl text-white shadow-xl transition-all active:scale-95 ${isKidMode ? 'bg-sky-500 hover:bg-sky-600 shadow-sky-200/50' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20'}`}
              >
                {step === 3 ? (isKidMode ? "Let's Go! 🚀" : "Start Journey") : "Continue →"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;
