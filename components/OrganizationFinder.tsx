
import React, { useState } from 'react';
import { searchOrganizations } from '../services/geminiService';

interface OrganizationFinderProps {
  isKidMode?: boolean;
}

const PRO_CATEGORIES = [
  { id: 'global', label: 'Global Orgs', icon: '🌍' },
  { id: 'forest', label: 'Reforestation', icon: '🌳' },
  { id: 'ocean', label: 'Ocean Health', icon: '🌊' },
  { id: 'wildlife', label: 'Wildlife Fund', icon: '🦁' },
  { id: 'waste', label: 'Plastic Waste', icon: '🧴' },
  { id: 'local', label: 'Near Me', icon: '📍' }
];

const KID_CATEGORIES = [
  { id: 'animals', label: 'Animal Rescuers', icon: '🐶' },
  { id: 'trees', label: 'Tree Planters', icon: '🌱' },
  { id: 'water', label: 'Ocean Helpers', icon: '🐳' },
  { id: 'cleanup', label: 'Clean Teams', icon: '🧹' },
  { id: 'bees', label: 'Bee Savers', icon: '🐝' },
  { id: 'local', label: 'Earth Hubs', icon: '🏘️' }
];

const OrganizationFinder: React.FC<OrganizationFinderProps> = ({ isKidMode }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ text: string; links: any[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('global');

  const categories = isKidMode ? KID_CATEGORIES : PRO_CATEGORIES;

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery && searchQuery !== 'local') return;
    setLoading(true);
    setResults(null);

    try {
      let location = undefined;
      if (searchQuery === 'local') {
        try {
          const pos = await new Promise<GeolocationPosition>((res, rej) => 
            navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 })
          );
          location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        } catch (e) {
          console.warn("Location access denied or timed out.");
        }
      }

      const response = await searchOrganizations(
        searchQuery === 'local' ? (isKidMode ? "local earth help teams" : "local environmental groups") : searchQuery, 
        location,
        isKidMode
      );
      
      const links = response.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        uri: chunk.web?.uri || chunk.maps?.uri,
        title: chunk.web?.title || chunk.maps?.title || (isKidMode ? "Visit the Team!" : "Organization Website")
      })).filter((c: any) => c.uri) || [];

      setResults({ text: response.text, links });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
    if (catId === 'local') {
      handleSearch('local');
    } else {
      const topic = categories.find(c => c.id === catId)?.label || catId;
      handleSearch(topic);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className={`text-4xl font-black ${isKidMode ? 'text-sky-900' : 'text-stone-800'}`}>
          {isKidMode ? 'Earth Teams! 🏘️' : 'Eco-Orgs Hub'}
        </h2>
        <p className={`${isKidMode ? 'text-sky-600 font-bold' : 'text-stone-500'} text-lg`}>
          {isKidMode ? 'Find amazing people who help the animals and the planet!' : 'Connect with the organizations leading the fight for a healthier planet.'}
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className={`flex items-center gap-2 p-2 bg-white rounded-2xl border-4 shadow-sm focus-within:ring-4 transition-all ${isKidMode ? 'border-sky-100 focus-within:ring-sky-200' : 'border-stone-200 focus-within:ring-emerald-100'}`}>
          <span className="pl-4 text-xl">{isKidMode ? '🔎' : '🔍'}</span>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={isKidMode ? "Find teams that help..." : "Search for charities, projects, or locations..."} 
            className={`flex-1 py-3 px-2 bg-transparent outline-none ${isKidMode ? 'text-sky-900 font-black' : 'text-stone-700 font-medium'}`}
          />
          <button 
            onClick={() => handleSearch()}
            disabled={loading}
            className={`px-6 py-3 rounded-xl font-black transition-all active:scale-95 disabled:opacity-50 ${
              isKidMode ? 'bg-sky-500 text-white hover:bg-sky-600' : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {loading ? (isKidMode ? 'Seeking...' : 'Searching...') : (isKidMode ? 'Find Teams!' : 'Find Orgs')}
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-black border-2 transition-all flex items-center gap-2 ${
                activeCategory === cat.id 
                ? isKidMode 
                  ? 'bg-sky-500 text-white border-sky-500 shadow-lg shadow-sky-100' 
                  : 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-100' 
                : isKidMode
                  ? 'bg-white text-sky-600 border-sky-100 hover:border-sky-400'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-500'
              }`}
            >
              <span>{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-64 bg-white rounded-[3rem] border-4 animate-pulse ${isKidMode ? 'border-sky-50' : 'border-stone-100'}`}></div>
          ))}
        </div>
      )}

      {results && (
        <div className="space-y-8">
          <div className={`p-8 rounded-[3rem] border-4 animate-in zoom-in-95 ${isKidMode ? 'bg-sky-50 border-sky-100 text-sky-900' : 'bg-emerald-50 border-emerald-100 text-emerald-900'}`}>
            <h3 className="text-xl font-black mb-4 flex items-center gap-2">
              <span className={`p-1.5 rounded-lg ${isKidMode ? 'bg-white shadow-sm' : 'bg-emerald-200'}`}>{isKidMode ? '🤖' : '✨'}</span> 
              {isKidMode ? "Leafy's Earth Discoveries" : "Gemini Insights"}
            </h3>
            <p className={`whitespace-pre-wrap leading-relaxed ${isKidMode ? 'font-bold' : 'text-emerald-800/90'}`}>{results.text}</p>
          </div>

          {results.links.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.links.map((link, idx) => (
                <div key={idx} className={`group bg-white p-6 rounded-[2.5rem] border-4 transition-all flex flex-col justify-between ${isKidMode ? 'border-sky-50 hover:border-sky-400' : 'border-stone-200 hover:border-emerald-500 hover:shadow-xl'}`}>
                  <div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform ${isKidMode ? 'bg-sky-50' : 'bg-stone-50'}`}>
                      {isKidMode ? '🎖️' : '🏛️'}
                    </div>
                    <h4 className={`font-black mb-2 line-clamp-2 ${isKidMode ? 'text-sky-900' : 'text-stone-800'}`}>{link.title}</h4>
                  </div>
                  <a 
                    href={link.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`mt-6 w-full py-4 rounded-2xl text-center text-sm font-black transition-all flex items-center justify-center gap-2 ${
                      isKidMode ? 'bg-sky-500 text-white hover:bg-sky-600' : 'bg-stone-50 text-emerald-700 hover:bg-emerald-600 hover:text-white'
                    }`}
                  >
                    {isKidMode ? 'Go to Team! 🚀' : 'Visit Website'} <span>↗</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!results && !loading && (
        <div className="text-center py-20 opacity-40">
          <span className="text-6xl block mb-4">{isKidMode ? '🚀' : '🌱'}</span>
          <p className="font-black">{isKidMode ? "Let's find some Earth Teams together!" : "Discover organizations fighting for our future."}</p>
        </div>
      )}
    </div>
  );
};

export default OrganizationFinder;
