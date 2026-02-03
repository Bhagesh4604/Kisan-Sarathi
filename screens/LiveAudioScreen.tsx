
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Screen, Language } from '../types';
import { ArrowLeft, Mic, MicOff, Volume2, VolumeX, X, BrainCircuit, Sparkles, Loader2, MessageSquareText } from 'lucide-react';
import { COLORS } from '../constants';
import { languages } from '../translations';

interface LiveAudioScreenProps {
  navigateTo: (screen: Screen) => void;
  language: Language;
  t: any;
}

const LiveAudioScreen: React.FC<LiveAudioScreenProps> = ({ navigateTo, language, t }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcriptions, setTranscriptions] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentOutput, setCurrentOutput] = useState('');
  
  const sessionRef = useRef<any>(null);
  const isActiveRef = useRef(false);
  const audioContextInRef = useRef<AudioContext | null>(null);
  const audioContextOutRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const currentLangLabel = languages.find(l => l.code === language)?.label || 'English';

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const createBlob = (data: Float32Array) => {
    const int16 = new Int16Array(data.length);
    for (let i = 0; i < data.length; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const startSession = async () => {
    setIsConnecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      audioContextInRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextOutRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            isActiveRef.current = true;
            setIsConnecting(false);
            const source = audioContextInRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextInRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              if (!isActiveRef.current) return;
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                if (isActiveRef.current) session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextInRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              setCurrentInput(prev => prev + message.serverContent!.inputTranscription!.text);
            }
            if (message.serverContent?.outputTranscription) {
              setCurrentOutput(prev => prev + message.serverContent!.outputTranscription!.text);
            }
            if (message.serverContent?.turnComplete) {
              setTranscriptions(prev => [
                ...prev, 
                { role: 'user', text: currentInput },
                { role: 'model', text: currentOutput }
              ]);
              setCurrentInput('');
              setCurrentOutput('');
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && audioContextOutRef.current) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioContextOutRef.current.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), audioContextOutRef.current, 24000, 1);
              const source = audioContextOutRef.current.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(audioContextOutRef.current.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              for (const src of sourcesRef.current) {
                try { src.stop(); } catch(e) {}
              }
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => stopSession(),
          onerror: () => stopSession(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: `You are a world-class Agricultural Consultant specialized in Indian farming. The user is a farmer from ${currentLangLabel} speaking background. Provide clear, empathetic, and scientifically sound farming advice in ${currentLangLabel}. Focus on practical solutions for pests, weather, and market prices.`
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      stopSession();
    }
  };

  const stopSession = () => {
    setIsActive(false);
    isActiveRef.current = false;
    setIsConnecting(false);
    
    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch (e) {}
      sessionRef.current = null;
    }

    if (audioContextInRef.current && audioContextInRef.current.state !== 'closed') {
      audioContextInRef.current.close().catch(() => {});
    }
    audioContextInRef.current = null;

    if (audioContextOutRef.current && audioContextOutRef.current.state !== 'closed') {
      audioContextOutRef.current.close().catch(() => {});
    }
    audioContextOutRef.current = null;

    sourcesRef.current.forEach(src => {
      try { src.stop(); } catch (e) {}
    });
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
  };

  useEffect(() => {
    return () => stopSession();
  }, []);

  return (
    <div className="h-full flex flex-col bg-white relative">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-gray-50">
        <button onClick={() => navigateTo('home')} className="p-2 -ml-2 text-gray-400">
          <ArrowLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-black text-gray-900 leading-none">Agri-Live Voice</h2>
          <span className="text-[10px] font-black text-green-600 uppercase tracking-widest mt-1">Real-time Expert Consult</span>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col p-8 items-center justify-center text-center">
        {!isActive && !isConnecting ? (
          <div className="animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 rounded-[2.5rem] bg-green-50 flex items-center justify-center text-green-700 mb-8 mx-auto shadow-xl shadow-green-100">
              <Mic size={40} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">Speak to Agri-Expert</h3>
            <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-xs mx-auto mb-10">
              Have a natural conversation in <span className="text-green-700 font-black">{currentLangLabel}</span>. Ask about seeds, diseases, or market rates.
            </p>
            <button 
              onClick={startSession}
              className="px-10 py-5 bg-green-700 text-white rounded-[2rem] font-black text-sm shadow-2xl shadow-green-200 active:scale-95 transition-all flex items-center gap-3"
            >
              Start Voice Consult <Sparkles size={18} />
            </button>
          </div>
        ) : (
          <div className="w-full flex-1 flex flex-col justify-between py-10">
            <div className="space-y-4 w-full text-left overflow-y-auto max-h-[300px] mb-8 no-scrollbar">
              {transcriptions.map((t, i) => (
                <div key={i} className={`flex ${t.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-xs font-bold ${
                    t.role === 'user' ? 'bg-gray-100 text-gray-700 rounded-tr-none' : 'bg-green-50 text-green-800 rounded-tl-none'
                  }`}>
                    {t.text}
                  </div>
                </div>
              ))}
              {(currentInput || currentOutput) && (
                 <div className={`flex ${currentInput ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-xs font-bold opacity-60 italic ${
                      currentInput ? 'bg-gray-100 rounded-tr-none' : 'bg-green-50 rounded-tl-none'
                    }`}>
                      {currentInput || currentOutput}...
                    </div>
                 </div>
              )}
            </div>

            <div className="relative flex items-center justify-center">
               <div className="absolute inset-0 bg-green-100 blur-3xl opacity-30 rounded-full animate-pulse scale-150"></div>
               <div className="relative w-48 h-48 rounded-full border-2 border-green-100 flex items-center justify-center">
                  {/* Waveform Visualization Mockup */}
                  <div className="flex items-end gap-1.5 h-16">
                    {[0.3, 0.7, 1.0, 0.5, 0.8, 1.2, 0.6, 0.9, 0.4].map((h, i) => (
                      <div 
                        key={i} 
                        className="w-1.5 bg-green-600 rounded-full animate-bounce"
                        style={{ height: `${h * 40}px`, animationDelay: `${i * 0.1}s` }}
                      ></div>
                    ))}
                  </div>
               </div>
            </div>

            <div className="mt-12 flex flex-col items-center gap-6">
              <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-100">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-ping"></div>
                <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">
                  {isConnecting ? 'Establishing Connection...' : 'AI is Listening...'}
                </span>
              </div>
              
              <button 
                onClick={stopSession}
                className="w-20 h-20 rounded-full bg-red-500 text-white flex items-center justify-center shadow-2xl shadow-red-200 active:scale-90 transition-all"
              >
                <X size={32} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 border-t border-gray-50 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
          <BrainCircuit size={20} />
        </div>
        <p className="text-[10px] font-bold text-gray-400 leading-tight">
          Your conversation is private. Advice is generated by Krishi-Drishti AI v2.5.
        </p>
      </div>
    </div>
  );
};

export default LiveAudioScreen;
