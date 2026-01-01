
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
        title: chunk.web?.title || "Read Story"
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
          {isKidMode ? 'Happy Earth Stories! 📖' : 'Eco-News'}
        </h2>
        <p className={`${isKidMode ? 'text-sky-600 font-bold' : 'text-stone-500'}`}>
          {isKidMode ? "Read about all the amazing things happening in nature!" : "What's happening right now to save our planet."}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="bg-white p-12 rounded-[3rem] border border-stone-100 animate-pulse h-80"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          <div className={`${isKidMode ? 'bg-sky-500 text-white' : 'bg-emerald-900 text-emerald-50'} p-8 md:p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group`}>
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-8 flex items-center gap-2">
                <span className={`p-2 rounded-2xl ${isKidMode ? 'bg-white/20' : 'bg-emerald-800'}`}>✨</span> 
                {isKidMode ? "Leafy's Big News!" : "Gemini News Digest"}
              </h3>
              <p className={`text-lg md:text-2xl leading-relaxed whitespace-pre-wrap ${isKidMode ? 'font-black' : 'font-medium'}`}>
                {news?.text}
              </p>
            </div>
            <span className="absolute -bottom-10 -right-10 text-[15rem] opacity-10 rotate-12">{isKidMode ? '🦋' : '🌍'}</span>
          </div>

          {!isKidMode && news?.links && news.links.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {news.links.map((link, idx) => (
                <a key={idx} href={link.uri} target="_blank" rel="noopener noreferrer" className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-emerald-500 transition-all">
                  <h4 className="font-bold text-stone-800 line-clamp-2">{link.title}</h4>
                  <p className="text-xs text-stone-400 mt-2">Read Source</p>
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
