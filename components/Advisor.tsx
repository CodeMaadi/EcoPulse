
import React, { useState, useRef, useEffect } from 'react';
import { getEcoAdvice } from '../services/geminiService';
import { Message, UserProfile } from '../types';

interface AdvisorProps {
  isKidMode?: boolean;
  userProfile: UserProfile;
}

const Advisor: React.FC<AdvisorProps> = ({ isKidMode, userProfile }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'assistant', 
      content: isKidMode 
        ? `BEEP-BOOP! Hi ${userProfile.name}! I'm Leafy! I love that you love the color ${userProfile.favColor}. Want to find out something cool about ${userProfile.favAnimal}s today?`
        : `Hello ${userProfile.name}! I'm EcoPulse. Ready to work on some sustainability goals for your favorite ${userProfile.favAnimal}?` 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchingImages, setSearchingImages] = useState(false);
  const [foundImages, setFoundImages] = useState<{url: string, title: string}[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, foundImages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImagePreviewUrl(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWebSearch = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setSearchingImages(true);
    setFoundImages([]);
    
    try {
      const prompt = `Find 5 direct image URLs and website sources for: "${input}". Focus on environmental topics.`;
      const response = await getEcoAdvice(prompt, userProfile, undefined, undefined, isKidMode);
      
      const links = response.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        url: chunk.web?.uri,
        title: chunk.web?.title || "Web Image"
      })).filter((l: any) => l.url) || [];

      // Filter for links that look like images or are likely to contain images
      setFoundImages(links);
      
      if (links.length === 0) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: isKidMode ? "I couldn't find any pictures of that! Maybe try something else?" : "I couldn't find any direct image results for that search query."
        }]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const selectWebImage = async (url: string) => {
    setImagePreviewUrl(url);
    setImagePreview(null);
    setSearchingImages(false);
    setFoundImages([]);
  };

  const handleSend = async () => {
    if (!input.trim() && !imagePreview && !imagePreviewUrl) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      image: imagePreview || imagePreviewUrl || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setImagePreview(null);
    setImagePreviewUrl(null);
    setLoading(true);

    try {
      let location = undefined;
      try {
        const pos = await new Promise<GeolocationPosition>((res, rej) => 
          navigator.geolocation.getCurrentPosition(res, rej, { timeout: 3000 })
        );
        location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      } catch (e) {}

      // If it's a URL, we pass it in the prompt text as Gemini can use Search tool to look at it,
      // or we could try to fetch and convert to base64. For simplicity and robustness against CORS,
      // we append the URL to the prompt if imagePreviewUrl is set.
      const finalPrompt = imagePreviewUrl 
        ? `${input}\n\n[Please analyze the image at this URL: ${imagePreviewUrl}]`
        : input || (imagePreview ? (isKidMode ? "Tell me about this!" : "What is this?") : "");

      const response = await getEcoAdvice(
        finalPrompt, 
        userProfile,
        imagePreview || undefined, // Only pass base64 here
        location,
        isKidMode
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text,
        groundingUrls: response.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
          uri: chunk.web?.uri || chunk.maps?.uri,
          title: chunk.web?.title || chunk.maps?.title || "Local Resource"
        })).filter((c: any) => c.uri)
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: isKidMode ? "Oh no! My robot brain is tired. Can you try again?" : "I'm having trouble connecting right now."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`h-full flex flex-col bg-white rounded-[3rem] shadow-xl border-4 ${isKidMode ? 'border-sky-100' : 'border-stone-100'} overflow-hidden`}>
      <div className={`p-4 border-b ${isKidMode ? 'bg-sky-400 text-white' : 'bg-emerald-50 text-emerald-900'} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${isKidMode ? 'bg-white shadow-lg' : 'bg-emerald-600'}`}>
            🤖
          </div>
          <div>
            <h3 className="font-black">{isKidMode ? 'Leafy Friend' : 'Eco-Advisor'}</h3>
            <p className="text-xs opacity-80 flex items-center gap-1 font-bold">
              <span className={`w-2 h-2 rounded-full animate-pulse ${isKidMode ? 'bg-yellow-300' : 'bg-emerald-500'}`}></span> Online
            </p>
          </div>
        </div>
        {searchingImages && (
          <button 
            onClick={() => { setSearchingImages(false); setFoundImages([]); }}
            className={`text-xs font-black uppercase px-4 py-2 rounded-xl transition-colors ${isKidMode ? 'bg-white text-sky-600' : 'bg-emerald-700 text-white'}`}
          >
            Cancel Search
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[70%] space-y-2`}>
              <div className={`p-5 rounded-[2rem] ${
                msg.role === 'user' 
                  ? isKidMode ? 'bg-yellow-400 text-yellow-900 font-bold rounded-tr-none' : 'bg-emerald-600 text-white rounded-tr-none' 
                  : isKidMode ? 'bg-sky-50 text-sky-900 border-2 border-sky-100 rounded-tl-none font-medium' : 'bg-stone-100 text-stone-800 rounded-tl-none'
              }`}>
                {msg.image && (
                  <div className="relative mb-3">
                    <img src={msg.image} alt="User upload" className="max-w-full rounded-2xl shadow-md border-2 border-white/20" />
                    {msg.image.startsWith('http') && (
                      <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-[8px] text-white px-2 py-1 rounded-full uppercase font-black">Web Source</div>
                    )}
                  </div>
                )}
                <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{msg.content}</p>
                
                {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-sky-100 space-y-2">
                    <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest">Cool Links</p>
                    <div className="flex flex-wrap gap-2">
                      {msg.groundingUrls.map((link, idx) => (
                        <a key={idx} href={link.uri} target="_blank" rel="noopener noreferrer" className="text-xs bg-white text-sky-600 px-3 py-1.5 rounded-full border border-sky-200 hover:border-sky-500 transition-colors">
                          🔗 {link.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {foundImages.length > 0 && (
          <div className="flex flex-col gap-4 animate-in slide-in-from-left-4">
             <div className={`text-xs font-black uppercase tracking-widest ${isKidMode ? 'text-sky-500' : 'text-stone-400'}`}>
               Pick a picture to talk about:
             </div>
             <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
               {foundImages.map((img, i) => (
                 <button 
                   key={i} 
                   onClick={() => selectWebImage(img.url)}
                   className="flex-shrink-0 w-32 group relative"
                 >
                    <div className="aspect-square bg-stone-100 rounded-2xl overflow-hidden border-2 border-transparent group-hover:border-sky-400 transition-all">
                      <img src={img.url} alt={img.title} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    </div>
                    <p className="text-[10px] mt-1 font-bold truncate text-stone-500">{img.title}</p>
                 </button>
               ))}
             </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-start">
            <div className={`p-4 rounded-[2rem] rounded-tl-none flex items-center gap-2 ${isKidMode ? 'bg-sky-50' : 'bg-emerald-50'}`}>
              <span className="animate-bounce">🤖</span>
              <span className={`text-xs font-black uppercase tracking-widest ${isKidMode ? 'text-sky-500' : 'text-emerald-600'}`}>
                {searchingImages ? (isKidMode ? 'Finding pictures...' : 'Searching the web...') : (isKidMode ? 'Leafy is thinking...' : 'EcoPulse is thinking...')}
              </span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {(imagePreview || imagePreviewUrl) && (
        <div className={`p-4 border-t flex items-center gap-4 animate-in slide-in-from-bottom-2 ${isKidMode ? 'bg-sky-50' : 'bg-stone-50'}`}>
          <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-white shadow-lg">
            <img src={imagePreview || imagePreviewUrl || ''} className="w-full h-full object-cover" />
            <button 
              onClick={() => { setImagePreview(null); setImagePreviewUrl(null); }}
              className="absolute top-0 right-0 bg-red-500 text-white w-6 h-6 flex items-center justify-center text-xs rounded-bl-xl font-bold"
            >
              ✕
            </button>
          </div>
          <div className="flex-1">
            <p className="text-xs font-black uppercase text-stone-400 tracking-widest">Attached Image</p>
            <p className="text-sm font-bold text-stone-600">
              {imagePreviewUrl ? "Picture from the web" : "Uploaded from device"}
            </p>
          </div>
        </div>
      )}

      <div className={`p-4 border-t ${isKidMode ? 'bg-sky-50' : 'bg-stone-50'}`}>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <button 
              onClick={() => fileInputRef.current?.click()} 
              title="Upload Image"
              className="w-12 h-12 bg-white rounded-2xl text-xl shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
            >
              📸
            </button>
            <button 
              onClick={() => setSearchingImages(true)}
              title="Search Web for Image"
              className={`w-12 h-12 rounded-2xl text-xl shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center ${searchingImages ? 'bg-sky-500 text-white' : 'bg-white'}`}
            >
              🌐
            </button>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (searchingImages ? handleWebSearch() : handleSend())}
            placeholder={
              searchingImages 
                ? (isKidMode ? "Search for pictures like 'blue whale'..." : "Search web for image topics...")
                : (isKidMode ? `Say hi to Leafy, ${userProfile.name}...` : "Ask anything about sustainable living...")
            }
            className={`flex-1 bg-white border-2 rounded-2xl px-6 py-4 focus:outline-none transition-all ${isKidMode ? 'border-sky-100 focus:border-sky-400 text-sky-900 font-bold' : 'border-stone-200 focus:ring-2 focus:ring-emerald-500'}`}
          />
          <button 
            onClick={searchingImages ? handleWebSearch : handleSend} 
            disabled={loading || (!input.trim() && !imagePreview && !imagePreviewUrl)} 
            className={`w-14 h-14 rounded-2xl transition-all flex items-center justify-center text-xl ${loading || (!input.trim() && !imagePreview && !imagePreviewUrl) ? 'bg-stone-200 text-stone-400' : isKidMode ? 'bg-sky-500 text-white shadow-lg shadow-sky-100' : 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'}`}
          >
            {searchingImages ? '🔍' : '🚀'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Advisor;
