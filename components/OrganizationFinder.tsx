
import React, { useState } from 'react';
import { searchOrganizations } from '../services/geminiService';

interface OrganizationFinderProps {
  isKidMode?: boolean;
}

const CATEGORIES = [
  { id: 'global', label: 'Nature Heroes', icon: '🌍' },
  { id: 'forest', label: 'Tree Planters', icon: '🌳' },
  { id: 'ocean', label: 'Sea Friends', icon: '🌊' },
  { id: 'wildlife', label: 'Animal Rescue', icon: '🦁' },
  { id: 'waste', label: 'Tidiers', icon: '🧴' },
  { id: 'local', label: 'Near Me', icon: '📍' }
];

const PRO_CATEGORIES = [
  { id: 'global', label: 'Global Orgs', icon: '🌍' },
  { id: 'forest', label: 'Reforestation', icon: '🌳' },
  { id: 'ocean', label: 'Ocean Health', icon: '🌊' },
  { id: 'wildlife', label: 'Wildlife Fund', icon: '🦁' },
  { id: 'waste', label: 'Plastic Waste', icon: '🧴' },
  { id: 'local', label: 'Near Me', icon: '📍' }
];

const OrganizationFinder: React.FC<OrganizationFinderProps> = ({ isKidMode }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ text: string; links: any[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('global');

  const currentCategories = isKidMode ? CATEGORIES : PRO_CATEGORIES;

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
        searchQuery === 'local' ? (isKidMode ? "nature groups near me" : "local environmental groups") : searchQuery, 
        location,
        isKidMode
      );
      
      const links = response.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        uri: chunk.web?.uri || chunk.maps?.uri,
        title: chunk.web?.title || chunk.maps?.title || (isKidMode ? "Go to Team Home!" : "Organization Website")
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
      const topic = currentCategories.find(c => c.id === catId)?.label || catId;
      handleSearch(topic);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className={`text-4xl font-black ${isKidMode ? 'text-sky-900' : 'text-stone-800'}`}>
          {isKidMode ? 'Earth Teams! 🏘️' : 'Eco-Orgs Hub'}
        </h2>
        <p className={`${isKidMode ? 'text-sky-600 font-bold' : 'text-stone-500 text-lg'}`}>
          {isKidMode ? 'Find the nature squads helping our planet! 🌍✨' : 'Connect with the organizations leading the fight for a healthier planet.'}
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className={`flex items-center gap-2 p-2 bg-white rounded-2xl border transition-all ${isKidMode ? 'border-sky-100 focus-within:ring-sky-400' : 'border-stone-200 focus-within:ring-emerald-500'} shadow-sm`}>
          <span className="pl-4 text-xl">{isKidMode ? '🕵️' : '🔍'}</span>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={isKidMode ? "Search for animal friends or tree heroes..." : "Search for charities, projects, or locations..."}
            className={`flex-1 py-3 px-2 bg-transparent outline-none font-medium ${isKidMode ? 'text-sky-900 placeholder:text-sky-200' : 'text-stone-700'}`}
          />
          <button 
            onClick={() => handleSearch()}
            disabled={loading}
            className={`${isKidMode ? 'bg-sky-500 hover:bg-sky-600 shadow-sky-100' : 'bg-emerald-600 hover:bg-emerald-700'} text-white px-6 py-3 rounded-xl font-bold active:scale-95 transition-all disabled:opacity-50`}
          >
            {loading ? (isKidMode ? 'Looking...' : 'Searching...') : (isKidMode ? 'Find Teams!' : 'Find Orgs')}
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {currentCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-bold border transition-all flex items-center gap-2 ${
                activeCategory === cat.id 
                ? isKidMode ? 'bg-sky-500 text-white border-sky-500 shadow-lg' : 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-100' 
                : isKidMode ? 'bg-white text-sky-600 border-sky-100 hover:border-sky-400' : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-500'
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
            <div key={i} className={`h-64 bg-white rounded-3xl border animate-pulse ${isKidMode ? 'border-sky-50' : 'border-stone-100'}`}></div>
          ))}
        </div>
      )}

      {results && (
        <div className="space-y-8">
          <div className={`${isKidMode ? 'bg-yellow-50 border-yellow-200 text-yellow-900' : 'bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100 text-emerald-900'} p-8 rounded-[2.5rem] border`}>
            <h3 className="text-xl font-black mb-4 flex items-center gap-2">
              <span className={`p-1.5 rounded-lg ${isKidMode ? 'bg-yellow-200' : 'bg-emerald-200'}`}>{isKidMode ? '💡' : '✨'}</span> 
              {isKidMode ? "Leafy's Nature Squad Report" : "Gemini Insights"}
            </h3>
            <p className={`whitespace-pre-wrap leading-relaxed ${isKidMode ? 'font-bold' : 'text-emerald-800/90'}`}>{results.text}</p>
          </div>

          {results.links.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.links.map((link, idx) => (
                <div key={idx} className={`group bg-white p-6 rounded-3xl border transition-all flex flex-col justify-between ${isKidMode ? 'border-sky-50 hover:border-sky-400 hover:shadow-sky-100' : 'border-stone-200 hover:border-emerald-500 hover:shadow-xl'}`}>
                  <div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform ${isKidMode ? 'bg-sky-50' : 'bg-stone-50'}`}>
                      {isKidMode ? '🦸‍♂️' : '🏛️'}
                    </div>
                    <h4 className={`font-black mb-2 line-clamp-2 ${isKidMode ? 'text-sky-900' : 'text-stone-800'}`}>{link.title}</h4>
                  </div>
                  <a 
                    href={link.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`mt-6 w-full py-3 rounded-xl text-center text-sm font-black transition-all flex items-center justify-center gap-2 ${isKidMode ? 'bg-sky-50 text-sky-600 hover:bg-sky-500 hover:text-white' : 'bg-stone-50 text-emerald-700 hover:bg-emerald-600 hover:text-white'}`}
                  >
                    {isKidMode ? 'Check them out!' : 'Visit Website'} <span>↗</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!results && !loading && (
        <div className="text-center py-20 opacity-40">
          <span className="text-6xl block mb-4">{isKidMode ? '🦋' : '🌱'}</span>
          <p className="font-black">{isKidMode ? 'Tap a button above to find nature heroes!' : 'Discover organizations fighting for our future.'}</p>
        </div>
      )}
    </div>
  );
};

export default OrganizationFinder;
