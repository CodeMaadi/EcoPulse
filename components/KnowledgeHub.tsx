
import React from 'react';

const KnowledgeHub: React.FC = () => {
  const topics = [
    { title: 'Waste Management', count: '12 lessons', icon: '♻️', color: 'bg-orange-50', text: 'Learn the secrets of proper composting and recycling.' },
    { title: 'Renewable Energy', count: '8 lessons', icon: '☀️', color: 'bg-yellow-50', text: 'Harness the power of nature for your home.' },
    { title: 'Ocean Conservation', count: '15 lessons', icon: '🌊', color: 'bg-blue-50', text: 'Protect our most precious resource and its life.' },
    { title: 'Sustainable Food', count: '10 lessons', icon: '🥗', color: 'bg-green-50', text: 'Grow your own food and reduce food waste.' }
  ];

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-4xl font-black text-stone-800">Knowledge Hub</h2>
        <p className="text-stone-500 leading-relaxed text-lg">
          Master the art of sustainable living through curated courses, expert insights, and interactive guides.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topics.map((topic, i) => (
          <div key={i} className={`p-6 rounded-[2rem] border-2 border-transparent hover:border-emerald-500 transition-all cursor-pointer ${topic.color} group`}>
            <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform inline-block">
              {topic.icon}
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-2">{topic.title}</h3>
            <p className="text-sm text-stone-500 mb-6 leading-relaxed">
              {topic.text}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">{topic.count}</span>
              <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                →
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6">Popular Articles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[1, 2, 3].map(i => (
             <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-xl transition-all group">
               <img src={`https://picsum.photos/seed/${i+100}/600/400`} alt="Article cover" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
               <div className="p-6">
                 <p className="text-emerald-600 text-xs font-bold uppercase mb-2">5 min read</p>
                 <h4 className="text-xl font-bold mb-3 text-stone-800">
                   {i === 1 ? 'Zero-Waste Kitchen: A Comprehensive Guide' : i === 2 ? 'Why Fast Fashion is Destroying our Planet' : 'Top 10 Energy Saving Hacks for Winter'}
                 </h4>
                 <p className="text-sm text-stone-500 mb-6">
                   Practical tips and tricks to help you transition to a more mindful and planet-friendly lifestyle starting today.
                 </p>
                 <div className="flex items-center gap-3">
                   <img src={`https://picsum.photos/seed/${i+200}/100/100`} className="w-8 h-8 rounded-full" />
                   <p className="text-xs font-medium text-stone-600">By Elena Green</p>
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
