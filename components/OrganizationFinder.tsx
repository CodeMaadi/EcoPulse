
import React, { useState } from 'react';
import { searchOrganizations } from '../services/geminiService';

const CATEGORIES = [
  { id: 'global', label: 'Global Orgs', icon: '🌍' },
  { id: 'forest', label: 'Reforestation', icon: '🌳' },
  { id: 'ocean', label: 'Ocean Health', icon: '🌊' },
  { id: 'wildlife', label: 'Wildlife Fund', icon: '🦁' },
  { id: 'waste', label: 'Plastic Waste', icon: '🧴' },
  { id: 'local', label: 'Near Me', icon: '📍' }
];

const OrganizationFinder: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ text: string; links: any[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('global');

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

      const response = await searchOrganizations(searchQuery === 'local' ? "local environmental groups" : searchQuery, location);
      
      const links = response.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        uri: chunk.web?.uri || chunk.maps?.uri,
        title: chunk.web?.title || chunk.maps?.title || "Organization Website"
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
      const topic = CATEGORIES.find(c => c.id === catId)?.label || catId;
      handleSearch(topic);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-4xl font-black text-stone-800">Eco-Orgs Hub</h2>
        <p className="text-stone-500 text-lg">
          Connect with the organizations leading the fight for a healthier planet.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-2 p-2 bg-white rounded-2xl border border-stone-200 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
          <span className="pl-4 text-xl">🔍</span>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search for charities, projects, or locations..." 
            className="flex-1 py-3 px-2 bg-transparent outline-none text-stone-700 font-medium"
          />
          <button 
            onClick={() => handleSearch()}
            disabled={loading}
            className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Find Orgs'}
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-bold border transition-all flex items-center gap-2 ${
                activeCategory === cat.id 
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-100' 
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
            <div key={i} className="h-64 bg-white rounded-3xl border border-stone-100 animate-pulse"></div>
          ))}
        </div>
      )}

      {results && (
        <div className="space-y-8">
          <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100 text-emerald-900">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="p-1.5 bg-emerald-200 rounded-lg">✨</span> Gemini Insights
            </h3>
            <p className="whitespace-pre-wrap leading-relaxed text-emerald-800/90">{results.text}</p>
          </div>

          {results.links.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.links.map((link, idx) => (
                <div key={idx} className="group bg-white p-6 rounded-3xl border border-stone-200 hover:border-emerald-500 hover:shadow-xl transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 bg-stone-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                      🏛️
                    </div>
                    <h4 className="font-black text-stone-800 mb-2 line-clamp-2">{link.title}</h4>
                  </div>
                  <a 
                    href={link.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-6 w-full py-3 bg-stone-50 text-emerald-700 rounded-xl text-center text-sm font-bold hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    Visit Website <span>↗</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!results && !loading && (
        <div className="text-center py-20 opacity-40">
          <span className="text-6xl block mb-4">🌱</span>
          <p className="font-medium">Discover organizations fighting for our future.</p>
        </div>
      )}
    </div>
  );
};

export default OrganizationFinder;
