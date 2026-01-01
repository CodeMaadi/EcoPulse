
import React, { useState, useRef, useEffect } from 'react';
import { getEcoAdvice } from '../services/geminiService';
import { Message } from '../types';

interface AdvisorProps {
  isKidMode?: boolean;
}

const Advisor: React.FC<AdvisorProps> = ({ isKidMode }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'assistant', 
      content: isKidMode 
        ? "BEEP-BOOP! Hi there friend! I'm Leafy! Want to find out something cool about nature? Or show me a picture of something you found? Let's play!"
        : "Hello! I'm EcoPulse, your sustainability advisor. You can ask me anything about recycling, carbon footprints, or even upload a photo of an item to see if it's recyclable!" 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !imagePreview) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      image: imagePreview || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setImagePreview(null);
    setLoading(true);

    try {
      let location = undefined;
      try {
        const pos = await new Promise<GeolocationPosition>((res, rej) => 
          navigator.geolocation.getCurrentPosition(res, rej, { timeout: 3000 })
        );
        location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      } catch (e) {}

      const response = await getEcoAdvice(
        input || (imagePreview ? (isKidMode ? "Tell me about this!" : "What is this?") : ""), 
        userMessage.image,
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
                {msg.image && <img src={msg.image} alt="User upload" className="max-w-full rounded-2xl mb-3 shadow-md" />}
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
        {loading && (
          <div className="flex justify-start">
            <div className={`p-4 rounded-[2rem] rounded-tl-none flex items-center gap-2 ${isKidMode ? 'bg-sky-50' : 'bg-emerald-50'}`}>
              <span className="animate-bounce">🤖</span>
              <span className={`text-xs font-black uppercase tracking-widest ${isKidMode ? 'text-sky-500' : 'text-emerald-600'}`}>
                {isKidMode ? 'Leafy is thinking...' : 'EcoPulse is thinking...'}
              </span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className={`p-4 border-t ${isKidMode ? 'bg-sky-50' : 'bg-stone-50'}`}>
        <div className="flex items-center gap-3">
          <button onClick={() => fileInputRef.current?.click()} className="w-12 h-12 bg-white rounded-2xl text-xl shadow-sm hover:scale-105 active:scale-95 transition-all">📸</button>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isKidMode ? "Say hi to Leafy..." : "Ask anything about sustainable living..."}
            className={`flex-1 bg-white border-2 rounded-2xl px-6 py-4 focus:outline-none transition-all ${isKidMode ? 'border-sky-100 focus:border-sky-400 text-sky-900 font-bold' : 'border-stone-200 focus:ring-2 focus:ring-emerald-500'}`}
          />
          <button onClick={handleSend} disabled={loading || (!input.trim() && !imagePreview)} className={`w-14 h-14 rounded-2xl transition-all flex items-center justify-center text-xl ${loading || (!input.trim() && !imagePreview) ? 'bg-stone-200 text-stone-400' : isKidMode ? 'bg-sky-500 text-white shadow-lg shadow-sky-100' : 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'}`}>🚀</button>
        </div>
      </div>
    </div>
  );
};

export default Advisor;
