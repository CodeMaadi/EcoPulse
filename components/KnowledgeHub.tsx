
import React from 'react';

interface KnowledgeHubProps {
  isKidMode?: boolean;
}

const KnowledgeHub: React.FC<KnowledgeHubProps> = ({ isKidMode }) => {
  const proTopics = [
    { title: 'Waste Management', count: '12 lessons', icon: '♻️', color: 'bg-orange-50', text: 'Learn the secrets of proper composting and recycling.' },
    { title: 'Renewable Energy', count: '8 lessons', icon: '☀️', color: 'bg-yellow-50', text: 'Harness the power of nature for your home.' },
    { title: 'Ocean Conservation', count: '15 lessons', icon: '🌊', color: 'bg-blue-50', text: 'Protect our most precious resource and its life.' },
    { title: 'Sustainable Food', count: '10 lessons', icon: '🥗', color: 'bg-green-50', text: 'Grow your own food and reduce food waste.' }
  ];

  const kidTopics = [
    { title: 'Recycling Fun!', count: '5 Games', icon: '♻️', color: 'bg-sky-100', text: 'Be a sorting hero and feed the blue bin! YUM!' },
    { title: 'Magic Sun Power', count: '3 Quests', icon: '☀️', color: 'bg-yellow-100', text: 'Learn how the sun helps us turn on the lights!' },
    { title: 'Dolphin Friends', count: '6 Stories', icon: '🐬', color: 'bg-blue-100', text: 'Dive deep and help our ocean buddies stay safe!' },
    { title: 'My Mini Garden', count: '4 Tasks', icon: '🍎', color: 'bg-emerald-100', text: 'How to grow your very own snacks at home!' }
  ];

  const topics = isKidMode ? kidTopics : proTopics;

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500 pb-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className={`text-4xl font-black ${isKidMode ? 'text-sky-900' : 'text-stone-800'}`}>
          {isKidMode ? 'Learning Adventures! 🎓' : 'Knowledge Hub'}
        </h2>
        <p className={`${isKidMode ? 'text-sky-600 font-bold' : 'text-stone-500'} leading-relaxed text-lg`}>
          {isKidMode 
            ? "Become a Planet Expert! Read cool stories and learn how to help our Earth friends." 
            : "Master the art of sustainable living through curated courses, expert insights, and interactive guides."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topics.map((topic, i) => (
          <div 
            key={i} 
            className={`p-8 rounded-[2.5rem] border-4 transition-all cursor-pointer group ${
              isKidMode 
                ? `${topic.color} border-transparent hover:border-sky-400 hover:scale-105 shadow-lg shadow-sky-100/20` 
                : `${topic.color} border-transparent hover:border-emerald-500`
            }`}
          >
            <div className={`text-5xl mb-6 transform group-hover:scale-110 transition-transform inline-block`}>
              {topic.icon}
            </div>
            <h3 className={`text-xl font-black mb-2 ${isKidMode ? 'text-sky-900' : 'text-stone-800'}`}>{topic.title}</h3>
            <p className={`text-sm mb-6 leading-relaxed ${isKidMode ? 'text-sky-700 font-medium' : 'text-stone-500'}`}>
              {topic.text}
            </p>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-black uppercase tracking-widest ${isKidMode ? 'text-sky-400' : 'text-stone-400'}`}>
                {topic.count}
              </span>
              <span className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm transition-colors ${
                isKidMode 
                  ? 'bg-white text-sky-500 group-hover:bg-sky-500 group-hover:text-white' 
                  : 'bg-white text-stone-600 group-hover:bg-emerald-500 group-hover:text-white'
              }`}>
                {isKidMode ? '📖' : '→'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <h3 className={`text-2xl font-black mb-6 ${isKidMode ? 'text-sky-900' : 'text-stone-800'}`}>
          {isKidMode ? 'Nature Stories 🌲' : 'Popular Articles'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[1, 2, 3].map(i => (
             <div key={i} className={`bg-white rounded-[2.5rem] overflow-hidden shadow-xl transition-all group border-4 ${isKidMode ? 'border-sky-50 hover:border-sky-200' : 'border-stone-100 hover:border-emerald-500'}`}>
               <div className="relative overflow-hidden h-48">
                <img 
                  src={`https://picsum.photos/seed/${i+300}/600/400`} 
                  alt="Article cover" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                {isKidMode && (
                  <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                    STORY TIME ✨
                  </div>
                )}
               </div>
               <div className="p-8">
                 <p className={`${isKidMode ? 'text-sky-500' : 'text-emerald-600'} text-xs font-black uppercase mb-3 tracking-widest`}>
                  {isKidMode ? '2 MIN READ ⏱️' : '5 min read'}
                 </p>
                 <h4 className={`text-xl font-black mb-4 leading-tight ${isKidMode ? 'text-sky-900' : 'text-stone-800'}`}>
                   {isKidMode ? (
                      i === 1 ? 'The Little Seed That Could' : i === 2 ? 'Why Whales Sing' : 'Where Does Water Go?'
                   ) : (
                      i === 1 ? 'Zero-Waste Kitchen: A Comprehensive Guide' : i === 2 ? 'Why Fast Fashion is Destroying our Planet' : 'Top 10 Energy Saving Hacks for Winter'
                   )}
                 </h4>
                 <p className={`text-sm mb-8 leading-relaxed ${isKidMode ? 'text-sky-700 font-medium' : 'text-stone-500'}`}>
                   {isKidMode 
                    ? "Come along and find out how every small thing you do makes a BIG change!" 
                    : "Practical tips and tricks to help you transition to a more mindful and planet-friendly lifestyle starting today."}
                 </p>
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full border-2 p-0.5 ${isKidMode ? 'border-sky-100' : 'border-stone-100'}`}>
                      <img src={`https://picsum.photos/seed/${i+200}/100/100`} className="w-full h-full rounded-full" />
                    </div>
                    <p className={`text-xs font-bold ${isKidMode ? 'text-sky-600' : 'text-stone-600'}`}>
                      {isKidMode ? 'By Leafy & Friends' : 'By Elena Green'}
                    </p>
                   </div>
                   {isKidMode && <span className="text-xl">🌟</span>}
                 </div>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeHub;
