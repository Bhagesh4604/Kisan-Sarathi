
import React, { useState, useEffect } from 'react';
import { Screen, Language } from '../types';
import { GoogleGenAI } from '@google/genai';
import { ArrowLeft, AlertCircle, CheckCircle2, Droplets, FlaskConical, Sprout, Loader2, RefreshCw } from 'lucide-react';
import { COLORS } from '../constants';
import { languages } from '../translations';

interface VisionResultScreenProps {
  navigateTo: (screen: Screen) => void;
  image: string | null;
  language: Language;
  t: any;
}

const VisionResultScreen: React.FC<VisionResultScreenProps> = ({ navigateTo, image, language, t }) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentLangLabel = languages.find(l => l.code === language)?.label || 'English';

  useEffect(() => {
    if (image) {
      performAnalysis(image);
    }
  }, [image]);

  const performAnalysis = async (base64Image: string) => {
    setLoading(true);
    setError(null);
    try {
      // Use process.env.API_KEY directly as per guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = base64Image.split(',')[1];
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        // Structure contents with parts for image and text
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: 'image/jpeg'
              }
            },
            {
              text: `Analyze this agricultural crop image. Identify the plant and any visible diseases. Provide the final response EXCLUSIVELY IN ${currentLangLabel}. Return a JSON response with fields: 'diagnosis' (name of disease or 'Healthy'), 'confidence' (percentage), 'summary' (brief description), and 'remedies' (an array of objects with 'title' and 'description').`
            }
          ]
        },
        config: {
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text || '{}');
      setAnalysis(result);
    } catch (err) {
      console.error("AI Analysis failed:", err);
      setError("Unable to analyze. Check lighting and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-[#f8fafc] overflow-y-auto pb-10">
      <div className="relative h-80 bg-black">
        {image && <img src={image} className="w-full h-full object-cover opacity-80" alt="Scanned" />}
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] via-transparent to-transparent"></div>
        <button 
          onClick={() => navigateTo('vision')}
          className="absolute top-6 left-6 p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="px-6 -mt-10 relative z-10">
        {loading ? (
          <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100 flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 border-4 border-green-100 rounded-full"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
              <Sprout className="absolute inset-0 m-auto text-green-600 animate-pulse" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">AI Diagnosis...</h3>
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-red-100 text-center">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
            <h3 className="text-lg font-bold text-gray-900">Failed</h3>
            <p className="text-gray-500 text-sm mt-2 mb-6">{error}</p>
            <button onClick={() => image && performAnalysis(image)} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold">Retry</button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${analysis?.diagnosis === 'Healthy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {analysis?.diagnosis === 'Healthy' ? 'Report' : 'Alert'}
                </span>
                <span className="text-xs font-bold text-gray-400">{analysis?.confidence}% Match</span>
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">{analysis?.diagnosis}</h2>
              <p className="text-gray-500 text-sm leading-relaxed">{analysis?.summary}</p>
            </div>

            <h3 className="text-lg font-bold text-gray-900 px-2">{t.expert_remedies}</h3>
            
            <div className="space-y-4">
              {analysis?.remedies?.map((item: any, i: number) => (
                <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex gap-4">
                  <div className="p-3 bg-green-50 rounded-2xl h-fit text-green-700">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">{item.title}</h4>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => navigateTo('home')}
              className="w-full py-5 rounded-[2rem] font-bold text-white shadow-2xl shadow-green-200"
              style={{ backgroundColor: COLORS.primary }}
            >
              {t.save_log}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisionResultScreen;
