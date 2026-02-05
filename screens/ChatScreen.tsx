
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { COLORS } from '../constants';
import { Screen, ChatMessage, Language } from '../types';
import { 
  Send, 
  Mic, 
  ArrowLeft, 
  Bot, 
  Loader2, 
  Globe, 
  Search, 
  Landmark, 
  X, 
  ExternalLink, 
  BrainCircuit, 
  Sparkles,
  Zap,
  HeartHandshake,
  Phone,
  ShieldAlert,
  FileHeart
} from 'lucide-react';
import { languages } from '../translations';

interface ChatScreenProps {
  navigateTo: (screen: Screen) => void;
  language: Language;
  t: any;
}

const LANG_MAP: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  pa: 'pa-IN',
  kn: 'kn-IN',
};

// Distress Keywords (Regex for broad matching)
const DISTRESS_REGEX = /(suicide|kill myself|die|hopeless|ruined|debt|loan|repay|failed|end my life|mar jaunga|khatam|barbad|karz|udhaar|phas gaya|atmahatya|pareshan|tension|depression)/i;

const ChatScreen: React.FC<ChatScreenProps> = ({ navigateTo, language, t }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `${t.namaste} I am your Agri-Tutor AI. I can help with crop lifecycle techniques, latest market prices, and Govt. Schemes. How can I assist you?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isThinkingMode, setIsThinkingMode] = useState(false);
  const [isDistressed, setIsDistressed] = useState(false);
  const [groundingUrls, setGroundingUrls] = useState<{title: string, uri: string}[]>([]);
  const [mode, setMode] = useState<'tutor' | 'schemes'>('tutor');
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const currentLangLabel = languages.find(l => l.code === language)?.label || 'English';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = LANG_MAP[language] || 'en-IN';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (!recognitionRef.current) {
        alert("Speech recognition is not supported in your browser.");
        return;
      }
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);
    setGroundingUrls([]);

    // Check for distress
    const distressDetected = DISTRESS_REGEX.test(userMsg);
    if (distressDetected) {
      setIsDistressed(true);
      // Immediate local intervention response
      setMessages(prev => [...prev, { 
        role: 'system', 
        text: t.support_message, 
        isIntervention: true, 
        interventionType: 'helpline' 
      }]);
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const modelName = isThinkingMode ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
      
      let systemInstruction = "";
      
      if (distressDetected || isDistressed) {
        systemInstruction = `URGENT: The user is expressing distress, debt worry, or hopelessness. 
        Act as 'Kisan-Manas', a compassionate mental health and crisis support companion. 
        Tone: Extremely gentle, reassuring, and calm.
        Actions:
        1. Validate their feelings.
        2. DO NOT offer generic farming advice.
        3. Mention the 'Samadhan Debt Relief Scheme' and 'Kisan Credit Card restructuring'.
        4. Urge them to call the helpline 1800-180-1551.
        Respond in ${currentLangLabel}.`;
      } else {
        systemInstruction = mode === 'schemes' 
          ? `You are Sahayak Scheme-Bot. Respond exclusively in ${currentLangLabel}. ALWAYS USE Google Search to find CURRENT Indian Government agricultural subsidies, PM-Kisan status, and state-level financial aid. Provide application links and dates. Be very specific.`
          : `You are Agri-Tutor, an agricultural expert. Respond exclusively in ${currentLangLabel}. USE Google Search to provide real-time mandi prices and weather-based crop advice.`;

        if (isThinkingMode) {
          systemInstruction += " You are currently in DEEP THINKING mode. Use advanced agricultural reasoning, consider multi-year crop cycles, soil degradation, and economic fluctuations. Provide comprehensive, deeply reasoned solutions to complex farming problems.";
        }
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents: userMsg,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction,
          // Thinking configuration for complex queries
          ...(isThinkingMode && !distressDetected && { thinkingConfig: { thinkingBudget: 32768 } })
        }
      });

      const aiText = response.text || "I'm having difficulty finding that information. Please try rephrasing.";
      
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        const urls = chunks
          .filter((c: any) => c.web)
          .map((c: any) => ({ title: c.web.title, uri: c.web.uri }));
        setGroundingUrls(urls);
      }

      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "An error occurred during deep analysis. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-full transition-colors duration-1000 ${
      isDistressed ? 'bg-blue-50/50' : (isThinkingMode ? 'bg-[#f0f4f0]' : 'bg-[#f8fafc]')
    }`}>
      {/* Dynamic Header */}
      <div className={`px-4 py-4 border-b flex items-center justify-between sticky top-0 z-10 shadow-sm transition-all ${
        isDistressed 
          ? 'bg-blue-50 border-blue-100' 
          : 'bg-white border-gray-100'
      }`}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigateTo('home')} className="text-gray-400 p-1">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all ${
              isDistressed ? 'bg-blue-500 scale-110' : (isThinkingMode ? 'bg-indigo-600 scale-110' : (mode === 'tutor' ? 'bg-green-600' : 'bg-blue-600'))
            }`}>
              {isDistressed ? <HeartHandshake size={22} /> : (isThinkingMode ? <BrainCircuit size={22} /> : (mode === 'tutor' ? <Bot size={22} /> : <Landmark size={22} />))}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-sm font-black leading-none ${isDistressed ? 'text-blue-700' : 'text-gray-900'}`}>
                  {isDistressed ? t.crisis_shield : (isThinkingMode ? 'Deep Thinking' : (mode === 'tutor' ? 'Agri-Tutor AI' : 'Sahayak Bot'))}
                </h2>
                {isDistressed && <ShieldAlert size={12} className="text-blue-500 animate-pulse" />}
                {!isDistressed && isThinkingMode && <Sparkles size={12} className="text-indigo-600 animate-pulse" />}
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-widest ${isDistressed ? 'text-blue-400' : 'text-gray-400'}`}>
                {isDistressed ? t.calm_down : `${currentLangLabel} Mode`}
              </span>
            </div>
          </div>
        </div>
        
        {!isDistressed && (
          <div className="flex gap-2">
            <button 
              onClick={() => setIsThinkingMode(!isThinkingMode)}
              className={`p-2.5 rounded-2xl transition-all flex items-center gap-1.5 border ${
                isThinkingMode 
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' 
                : 'bg-white border-gray-200 text-gray-400 hover:border-indigo-200'
              }`}
            >
              <BrainCircuit size={18} />
              <span className="text-[8px] font-black uppercase tracking-widest hidden sm:block">Deep Think</span>
            </button>
            <button 
              onClick={() => setMode(mode === 'tutor' ? 'schemes' : 'tutor')}
              className={`px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase transition-all flex items-center gap-1.5 border ${
                mode === 'schemes' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-green-50 text-green-700 border-green-100'
              }`}
            >
              {mode === 'schemes' ? <Search size={12} /> : <Landmark size={12} />}
              {mode === 'schemes' ? 'Agri Tutor' : 'Schemes'}
            </button>
          </div>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'system' ? (
              // Intervention Card
              <div className="w-full max-w-[85%] bg-blue-600 rounded-[2rem] p-6 text-white shadow-xl shadow-blue-100 animate-in slide-in-from-left duration-500">
                 <div className="flex items-center gap-3 mb-3">
                    <ShieldAlert size={24} className="text-blue-200" />
                    <h4 className="text-lg font-black">{t.distress_detected}</h4>
                 </div>
                 <p className="text-sm font-medium leading-relaxed opacity-90 mb-6">
                    {msg.text}
                 </p>
                 <div className="grid grid-cols-1 gap-3">
                    <button className="flex items-center justify-center gap-2 bg-white text-blue-700 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                       <Phone size={16} /> {t.helpline_btn}
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-blue-700 border border-blue-500 text-white py-3 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
                       <FileHeart size={16} /> {t.debt_relief_btn}
                    </button>
                 </div>
              </div>
            ) : (
              // Standard Message
              <div className={`max-w-[88%] px-4 py-3 rounded-[1.5rem] text-sm leading-relaxed shadow-sm transition-all ${
                msg.role === 'user' 
                ? `${isDistressed ? 'bg-blue-600' : 'bg-green-700'} text-white rounded-tr-none` 
                : `bg-white text-gray-900 border ${isDistressed ? 'border-blue-100' : 'border-gray-100'} rounded-tl-none font-medium ${isThinkingMode ? 'ring-1 ring-indigo-50 shadow-indigo-100/20' : ''}`
              }`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
                
                {msg.role === 'model' && groundingUrls.length > 0 && idx === messages.length - 1 && (
                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1.5 tracking-widest">
                      <Globe size={12} className={isDistressed ? "text-blue-600" : "text-green-600"} /> Search Grounded Sources
                    </p>
                    <div className="flex flex-col gap-2">
                      {groundingUrls.map((link, i) => (
                        <a 
                          key={i} 
                          href={link.uri} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-xl border border-gray-100 hover:border-green-200 transition-colors group"
                        >
                          <span className="text-[11px] text-gray-700 font-bold truncate max-w-[85%]">{link.title}</span>
                          <ExternalLink size={12} className="text-gray-400 group-hover:text-green-600" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className={`bg-white px-4 py-3 rounded-[1.5rem] rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-3 ${isThinkingMode && !isDistressed ? 'ring-2 ring-indigo-500/10' : ''}`}>
              {isDistressed ? (
                 <div className="flex items-center gap-2">
                    <HeartHandshake size={18} className="text-blue-600 animate-pulse" />
                    <span className="text-xs text-blue-700 font-black uppercase tracking-widest">Generating supportive response...</span>
                 </div>
              ) : isThinkingMode ? (
                <div className="flex items-center gap-2">
                   <div className="relative">
                      <BrainCircuit size={18} className="text-indigo-600 animate-pulse" />
                      <div className="absolute inset-0 bg-indigo-400 blur-sm opacity-50 animate-ping rounded-full scale-50"></div>
                   </div>
                   <span className="text-xs text-indigo-700 font-black uppercase tracking-widest">Simulating agricultural outcomes...</span>
                </div>
              ) : (
                <>
                  <Loader2 className="animate-spin text-green-600" size={18} />
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Searching Mandi & Govt data...</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className={`p-4 border-t flex flex-col gap-3 relative transition-colors ${isDistressed ? 'bg-blue-50 border-blue-100' : 'bg-white border-gray-100'}`}>
        {isListening && (
          <div className="absolute -top-16 left-0 right-0 flex justify-center animate-in slide-in-from-bottom-2">
            <div className="bg-gray-900 text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-black uppercase tracking-widest">Listening {currentLangLabel}...</span>
              <button onClick={toggleListening} className="ml-2 p-1 bg-white/10 rounded-full">
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className={`flex-1 bg-white/50 rounded-2xl px-4 py-3 flex items-center border transition-all ${
            isDistressed
            ? 'border-blue-200 focus-within:ring-blue-500'
            : (isThinkingMode ? 'border-indigo-200 focus-within:ring-indigo-500 ring-offset-2' : 'border-gray-200 focus-within:border-green-500 focus-within:ring-green-500')
          } focus-within:ring-1`}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isDistressed ? "We are here to help..." : (isThinkingMode ? "Ask for long-term farm planning..." : (mode === 'schemes' ? 'Ask about PM-Kisan, KCC, etc...' : t.placeholder_chat))}
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 font-bold placeholder:text-gray-400"
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={toggleListening}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-90 ${
                isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-100'
              }`}
            >
              <Mic size={20} />
            </button>
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all active:scale-90 disabled:opacity-50 disabled:active:scale-100`}
              style={{ backgroundColor: isDistressed ? '#2563eb' : (isThinkingMode ? '#4f46e5' : (mode === 'tutor' ? COLORS.primary : '#2563eb')) }}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
