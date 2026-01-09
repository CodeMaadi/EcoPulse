
import React, { useState, useEffect } from 'react';
import { getEcoNews } from '../services/geminiService';

interface EcoNewsProps {
  isKidMode?: boolean;
}

const EcoNews: React.FC<EcoNewsProps> = ({ isKidMode }) => {
  const [news, setNews] = useState<{ text: string; links: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await getEcoNews(isKidMode);
      const links = response.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        uri: chunk.web?.uri,
        title: chunk.web?.title || (isKidMode ? "Read Story" : "Read More")
      })).filter((l: any) => l.uri) || [];
      
      setNews({ text: response.text, links });
    } catch (e) {
      console.error("Failed to fetch news", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [isKidMode]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="text-center space-y-2">
        <h2 className={`text-4xl font-black ${isKidMode ? 'text-sky-900' : 'text-stone-800'}`}>
          {isKidMode ? 'Earth Stories! 📖' : 'Eco-News'}
        </h2>
        <p className={`${isKidMode ? 'text-sky-600 font-bold' : 'text-stone-500'}`}>
          {isKidMode ? "Find out about amazing things happening in nature! 🌍" : "What's happening right now to save our planet."}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className={`bg-white p-12 rounded-[3rem] border-4 animate-pulse h-80 ${isKidMode ? 'border-sky-50' : 'border-stone-100'}`}></div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          <div className={`p-8 md:p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group border-4 ${
            isKidMode 
              ? 'bg-gradient-to-br from-sky-400 to-blue-500 text-white border-white/20' 
              : 'bg-emerald-900 text-emerald-50 border-emerald-800'
          }`}>
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-8 flex items-center gap-2">
                <span className={`p-2 rounded-2xl ${isKidMode ? 'bg-white text-sky-500 shadow-lg' : 'bg-emerald-800'}`}>
                  {isKidMode ? '🤖' : '✨'}
                </span> 
                {isKidMode ? "Leafy's Happy News!" : "Gemini News Digest"}
              </h3>
              <p className={`text-lg md:text-2xl leading-relaxed whitespace-pre-wrap ${isKidMode ? 'font-black' : 'font-medium'}`}>
                {news?.text}
              </p>
            </div>
            <span className="absolute -bottom-10 -right-10 text-[15rem] opacity-20 rotate-12 transition-transform group-hover:rotate-0 duration-1000">
              {isKidMode ? '🦋' : '🌍'}
            </span>
          </div>

          {news?.links && news.links.length > 0 && (
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${isKidMode ? 'px-4' : ''}`}>
              {news.links.map((link, idx) => (
                <a 
                  key={idx} 
                  href={link.uri} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`p-5 rounded-[2rem] border-4 transition-all flex flex-col justify-between ${
                    isKidMode 
                      ? 'bg-white border-sky-50 hover:border-sky-400 hover:scale-105 shadow-lg shadow-sky-100/20' 
                      : 'bg-white border-stone-200 hover:border-emerald-500'
                  }`}
                >
                  <h4 className={`font-black line-clamp-2 ${isKidMode ? 'text-sky-900' : 'text-stone-800'}`}>{link.title}</h4>
                  <p className={`text-xs mt-4 font-black uppercase tracking-widest ${isKidMode ? 'text-sky-400' : 'text-stone-400'}`}>
                    {isKidMode ? 'Read Story ↗' : 'Source'}
                  </p>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EcoNews;
