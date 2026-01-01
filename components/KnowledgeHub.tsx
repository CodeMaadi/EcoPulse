
import React from 'react';

interface KnowledgeHubProps {
  isKidMode?: boolean;
}

const KnowledgeHub: React.FC<KnowledgeHubProps> = ({ isKidMode }) => {
  const topics = isKidMode ? [
    { title: 'Fun Cleaning!', count: '5 stories', icon: '🧹', color: 'bg-orange-50', text: 'Learn how to make our earth clean like a magic spell!' },
    { title: 'Sun Power!', count: '3 games', icon: '☀️', color: 'bg-yellow-50', text: 'The sun makes power from the sky! Beep-boop!' },
    { title: 'Fishy Friends', count: '6 videos', icon: '🐠', color: 'bg-blue-50', text: 'Meet the cool friends living under the blue sea!' },
    { title: 'Yummy Garden', count: '4 lessons', icon: '🍅', color: 'bg-green-50', text: 'Grow your own snacks in the dirt! It is so fun!' }
  ] : [
    { title: 'Waste Management', count: '12 lessons', icon: '♻️', color: 'bg-orange-50', text: 'Learn the secrets of proper composting and recycling.' },
    { title: 'Renewable Energy', count: '8 lessons', icon: '☀️', color: 'bg-yellow-50', text: 'Harness the power of nature for your home.' },
    { title: 'Ocean Conservation', count: '15 lessons', icon: '🌊', color: 'bg-blue-50', text: 'Protect our most precious resource and its life.' },
    { title: 'Sustainable Food', count: '10 lessons', icon: '🥗', color: 'bg-green-50', text: 'Grow your own food and reduce food waste.' }
  ];

  const articles = isKidMode ? [
    { id: 1, title: 'How to Recycle like a Ninja!', time: '2 min', author: 'Leafy', text: 'Recycling is like a superpower! Learn how to do it fast and fun.' },
    { id: 2, title: 'Meeting Mr. Tree', time: '3 min', author: 'Daisy', text: 'Trees breathe for us! Say hi to your tall leafy friends.' },
    { id: 3, title: 'Save Every Drop!', time: '2 min', author: 'Bubbles', text: 'Water is magic juice for plants and you. Don\'t let it run!' }
  ] : [
    { id: 1, title: 'Zero-Waste Kitchen: A Comprehensive Guide', time: '5 min', author: 'Elena Green', text: 'Practical tips and tricks to help you transition to a more mindful and planet-friendly lifestyle starting today.' },
    { id: 2, title: 'Why Fast Fashion is Destroying our Planet', time: '8 min', author: 'Marco Earth', text: 'Exploring the environmental cost of the global clothing industry and what you can do about it.' },
    { id: 3, title: 'Top 10 Energy Saving Hacks for Winter', time: '6 min', author: 'Sol Power', text: 'Innovative ways to keep your home warm while keeping your energy bills and carbon footprint low.' }
  ];

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className={`text-4xl font-black ${isKidMode ? 'text-sky-900' : 'text-stone-800'}`}>
          {isKidMode ? 'Smart Hub! 🎓' : 'Knowledge Hub'}
        </h2>
        <p className={`${isKidMode ? 'text-sky-600 font-bold text-lg' : 'text-stone-500 leading-relaxed text-lg'}`}>
          {isKidMode ? 'Learn cool nature secrets with Leafy! 🦋🤖' : 'Master the art of sustainable living through curated courses, expert insights, and interactive guides.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topics.map((topic, i) => (
          <div key={i} className={`p-6 rounded-[2rem] border-2 border-transparent transition-all cursor-pointer ${topic.color} group ${isKidMode ? 'hover:border-sky-400' : 'hover:border-emerald-500'}`}>
            <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform inline-block">
              {topic.icon}
            </div>
            <h3 className={`text-xl font-black mb-2 ${isKidMode ? 'text-sky-900' : 'text-stone-800'}`}>{topic.title}</h3>
            <p className={`text-sm mb-6 leading-relaxed ${isKidMode ? 'text-sky-700 font-medium' : 'text-stone-50'}`}>
              {topic.text}
            </p>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-black uppercase tracking-widest ${isKidMode ? 'text-sky-400' : 'text-stone-400'}`}>{topic.count}</span>
              <span className={`w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm transition-colors ${isKidMode ? 'group-hover:bg-sky-500 group-hover:text-white' : 'group-hover:bg-emerald-500 group-hover:text-white'}`}>
                →
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <h3 className={`text-2xl font-black mb-6 ${isKidMode ? 'text-sky-900' : 'text-stone-800'}`}>
          {isKidMode ? 'Fun Nature Stories' : 'Popular Articles'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {articles.map((art, i) => (
             <div key={art.id} className={`bg-white rounded-3xl overflow-hidden shadow-sm border transition-all group ${isKidMode ? 'border-sky-50 hover:shadow-sky-100 hover:border-sky-200' : 'border-stone-100 hover:shadow-xl'}`}>
               <div className="relative overflow-hidden h-48">
                <img src={`https://picsum.photos/seed/${art.id + (isKidMode ? 500 : 100)}/600/400`} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {isKidMode && <div className="absolute top-2 left-2 bg-yellow-400 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase">Super Read!</div>}
               </div>
               <div className="p-6">
                 <p className={`${isKidMode ? 'text-sky-500' : 'text-emerald-600'} text-xs font-black uppercase mb-2`}>{art.time} {isKidMode ? 'to read!' : 'read'}</p>
                 <h4 className={`text-xl font-black mb-3 ${isKidMode ? 'text-sky-900' : 'text-stone-800'}`}>
                   {art.title}
                 </h4>
                 <p className={`text-sm mb-6 ${isKidMode ? 'text-sky-700 font-medium' : 'text-stone-500'}`}>
                   {art.text}
                 </p>
                 <div className="flex items-center gap-3">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${isKidMode ? 'bg-sky-100' : 'bg-stone-100'}`}>
                     {isKidMode ? '🤖' : '✍️'}
                   </div>
                   <p className="text-xs font-black text-stone-600">By {art.author}</p>
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
