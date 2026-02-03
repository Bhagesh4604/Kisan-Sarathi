
import React, { useState, useEffect } from 'react';
import { Screen, Language, VisionMode } from '../types';
import { GoogleGenAI } from '@google/genai';
import { 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Droplets, 
  Sprout, 
  Loader2, 
  Award, 
  ShieldCheck, 
  Fingerprint, 
  Leaf, 
  Zap, 
  ShieldAlert, 
  Ban, 
  UserCheck, 
  AlertTriangle, 
  Search, 
  Lock, 
  ShoppingCart, 
  Database,
  ChevronDown,
  Satellite
} from 'lucide-react';
import { COLORS } from '../constants';
import { languages } from '../translations';

interface VisionResultScreenProps {
  navigateTo: (screen: Screen) => void;
  image: string | null;
  mode: VisionMode;
  language: Language;
  t: any;
}

// Mock Verified Purchase History
const MOCK_PURCHASES = [
  { id: 'ORD-9921', item: 'Neem Oil 5L (Organic)', date: '2024-06-01', type: 'Organic' },
  { id: 'ORD-8840', item: 'Jeevamrutham Bio-Pack', date: '2024-05-15', type: 'Organic' },
  { id: 'ORD-4412', item: 'Urea Fertilizer 50kg', date: '2024-06-10', type: 'Chemical' },
];

const VisionResultScreen: React.FC<VisionResultScreenProps> = ({ navigateTo, image, mode, language, t }) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOrganicMode, setIsOrganicMode] = useState(false);
  const [isConsumed, setIsConsumed] = useState(false);
  const [reportFiled, setReportFiled] = useState(false);
  
  // Fraud Layer States
  const [selectedOrder, setSelectedOrder] = useState<string>('');
  const [satelliteAnomaly, setSatelliteAnomaly] = useState(false);

  const currentLangLabel = languages.find(l => l.code === language)?.label || 'English';

  useEffect(() => {
    if (image) {
      performAnalysis(image, isOrganicMode);
    }
    // Simulate Satellite Growth Analysis Anomaly detection (Layer 2)
    const hasAnomaly = Math.random() > 0.8; 
    setSatelliteAnomaly(hasAnomaly);
  }, [image, mode, isOrganicMode]);

  const performAnalysis = async (base64Image: string, organic: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = base64Image.split(',')[1];
      
      let prompt = '';
      if (mode === 'verify-qr') {
        prompt = `You are a Digital Fraud Auditor. Analyze this QR code/packaging image. Return a JSON response with fields: 'diagnosis' ('Authentic' or 'Duplicate'), 'id' (Fake hash like 0x8f2...a1), 'history' (array of scan events with 'time' and 'loc'), 'isConsumed' (boolean). If diagnosis is Duplicate, provide a warning.`;
      } else {
        prompt = mode === 'diagnosis' 
          ? `Analyze this agricultural crop image. Identify the plant and any visible diseases. Provide the final response EXCLUSIVELY IN ${currentLangLabel}. Return a JSON response with fields: 'diagnosis' (name of disease or 'Healthy'), 'confidence' (percentage), 'summary' (brief description), and 'remedies' (an array of objects with 'title' and 'description').`
          : `Act as a Professional Agricultural Quality Inspector. Analyze this produce (fruit/vegetable) for Grading. Evaluate size, color uniformity, and surface defects. Assign a Grade (A, B, or C). Provide the final response EXCLUSIVELY IN ${currentLangLabel}. Return a JSON response with fields: 'diagnosis' (Grade A, B, or C), 'confidence' (percentage), 'summary' (Why this grade was assigned), 'metrics' (object with 'color', 'size', 'defects' keys and descriptive values), 'marketValue' (Estimated % of premium price).`;

        if (organic && mode === 'diagnosis') {
          prompt += " IMPORTANT: The user has requested 'Organic Cure' mode. You MUST provide ONLY organic, biological, and natural remedies. STRICTLY FORBIDDEN to suggest any chemical, synthetic, or inorganic pesticides. Instead, suggest natural remedies like 'Spray Neem Oil', 'Sour Buttermilk spray', 'Dashparni Ark', or 'Bio-Fertilizers'.";
        }
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
            { text: prompt }
          ]
        },
        config: { responseMimeType: "application/json" }
      });

      const result = JSON.parse(response.text || '{}');
      setAnalysis(result);
      
      if (mode === 'verify-qr' && Math.random() > 0.5) {
        setIsConsumed(true);
      }
    } catch (err) {
      console.error("AI Analysis failed:", err);
      setError("Unable to analyze. Check lighting and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReport = () => {
    setReportFiled(true);
  };

  // Input-Lock Logic (Layer 1)
  const isSelectedOrderChemical = MOCK_PURCHASES.find(p => p.id === selectedOrder)?.type === 'Chemical';
  const showFraudWarning = isSelectedOrderChemical || satelliteAnomaly;

  return (
    <div className="h-full bg-[#f8fafc] overflow-y-auto pb-10">
      <div className="relative h-96 bg-black">
        {image && <img src={image} className="w-full h-full object-cover opacity-80" alt="Scanned" />}
        
        {/* Anti-Fraud Scanning UI */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className={`w-52 h-52 border-2 ${showFraudWarning ? 'border-red-600' : 'border-green-500/50'} rounded-[2.5rem] relative`}>
              <div className={`absolute top-0 left-0 w-full h-0.5 ${showFraudWarning ? 'bg-red-500' : 'bg-green-400'} animate-scan-line shadow-[0_0_15px_rgba(34,197,94,0.5)]`}></div>
           </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] via-transparent to-transparent"></div>
        <button 
          onClick={() => navigateTo('vision')}
          className="absolute top-6 left-6 p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white"
        >
          <ArrowLeft size={24} />
        </button>

        {/* Organic Cure Toggle Overlay */}
        {mode === 'diagnosis' && !loading && (
          <div className="absolute bottom-16 right-6 z-20">
             <button 
              onClick={() => setIsOrganicMode(!isOrganicMode)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl ${
                isOrganicMode ? 'bg-green-600 text-white ring-4 ring-green-100' : 'bg-white text-gray-400'
              }`}
             >
               <Leaf size={16} fill={isOrganicMode ? 'white' : 'none'} />
               {t.organic_cure || 'Show Organic Cure'}
             </button>
          </div>
        )}

        {!loading && !error && (
          <div className="absolute top-6 right-6 p-4 bg-white rounded-[1.5rem] shadow-2xl flex flex-col items-center gap-1 border border-green-100">
             <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white mb-1 ${showFraudWarning ? 'bg-red-600' : 'bg-green-700'}`}>
                {showFraudWarning ? <ShieldAlert size={20} /> : <ShieldCheck size={20} />}
             </div>
             <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Satya-Patra</p>
             <p className={`text-[7px] font-bold uppercase ${showFraudWarning ? 'text-red-600' : 'text-green-600'}`}>
               {showFraudWarning ? 'Integrity Risk' : 'Verified Trace'}
             </p>
          </div>
        )}
      </div>

      <div className="px-6 -mt-10 relative z-10">
        {loading ? (
          <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100 flex flex-col items-center text-center">
            <Loader2 className="animate-spin text-green-600 mb-4" size={40} />
            <h3 className="text-xl font-bold text-gray-900">Synchronizing Ledger...</h3>
            <p className="text-xs text-gray-400 mt-2 font-black uppercase tracking-widest">Cross-Checking Purchase History</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Layer 1: Input-Lock Defense UI */}
            <div className={`bg-white rounded-3xl p-6 border shadow-xl transition-all ${isSelectedOrderChemical ? 'ring-2 ring-red-500 border-red-100' : 'border-gray-100'}`}>
               <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 rounded-2xl ${isSelectedOrderChemical ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                     <Lock size={24} />
                  </div>
                  <div>
                     <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">{t.input_lock}</h3>
                     <p className="text-[10px] text-gray-400 font-bold">Cross-Verify with Purchase Data</p>
                  </div>
               </div>

               <div className="relative">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">{t.link_purchase}</label>
                  <select 
                    value={selectedOrder}
                    onChange={(e) => setSelectedOrder(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 text-sm font-bold text-gray-900 appearance-none focus:ring-2 focus:ring-green-500 outline-none"
                  >
                    <option value="">Select Verified Order...</option>
                    {MOCK_PURCHASES.map(p => (
                      <option key={p.id} value={p.id}>{p.id} - {p.item}</option>
                    ))}
                    <option value="outside">Bought from Outside / Local Market</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-[38px] text-gray-400 pointer-events-none" />
               </div>

               {selectedOrder === 'outside' && (
                 <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                    <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-900 font-bold leading-relaxed">
                      ⚠️ External inputs require 48-hour manual audit. This batch cannot be tagged "100% Organic" until receipt verification.
                    </p>
                 </div>
               )}

               {isSelectedOrderChemical && (
                 <div className="mt-4 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3 animate-pulse">
                    <Ban size={18} className="text-red-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-red-900 font-bold leading-relaxed uppercase">
                      FRAUD ALERT: You purchased Chemical Urea last week. Organic claim for this cycle is BLOCKED.
                    </p>
                 </div>
               )}
            </div>

            {/* Layer 2: Satellite Truth Sync UI */}
            <div className="bg-gray-900 rounded-[2.5rem] p-6 text-white shadow-2xl relative overflow-hidden group">
               <div className="flex justify-between items-center mb-6 relative z-10">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-green-400">
                        <Satellite size={22} />
                     </div>
                     <div>
                        <h4 className="text-sm font-black uppercase tracking-wider">{t.satellite_truth}</h4>
                        <p className="text-[9px] text-gray-400 font-bold">Spectral Growth Analysis</p>
                     </div>
                  </div>
                  {satelliteAnomaly && (
                    <span className="bg-red-500 text-white text-[8px] font-black px-2 py-1 rounded uppercase animate-bounce">
                      Anomaly Detected
                    </span>
                  )}
               </div>

               <div className="p-4 bg-white/5 rounded-2xl border border-white/10 relative z-10">
                  <div className="flex justify-between items-end mb-4">
                     <div>
                        <p className="text-[9px] font-bold text-gray-500 uppercase">NDVI Growth Curve</p>
                        <h5 className="text-lg font-black text-white">0.85 <span className="text-[10px] text-green-400">Stable</span></h5>
                     </div>
                     <div className="text-right">
                        <p className="text-[9px] font-bold text-gray-500 uppercase">N-Spike Detection</p>
                        <h5 className={`text-lg font-black ${satelliteAnomaly ? 'text-red-500' : 'text-green-400'}`}>
                           {satelliteAnomaly ? 'High' : 'Low/Natural'}
                        </h5>
                     </div>
                  </div>
                  
                  {/* Mini Growth Trend Visualization */}
                  <div className="h-12 w-full flex items-end gap-1 px-1">
                     {[20, 25, 22, 30, 45, 80, 75, 78, 85].map((h, i) => (
                       <div key={i} className={`flex-1 rounded-sm ${i === 5 && satelliteAnomaly ? 'bg-red-500 animate-pulse' : 'bg-green-500/40'}`} style={{ height: `${h}%` }}></div>
                     ))}
                  </div>
                  
                  {satelliteAnomaly && (
                    <p className="mt-4 text-[9px] text-red-400 font-black uppercase tracking-widest flex items-center gap-2">
                       <AlertTriangle size={12} /> {t.growth_spike_alert}: Artificial Nitrogen Flush detected on Day 45.
                    </p>
                  )}
               </div>

               <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${
                  showFraudWarning ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {showFraudWarning ? t.fraud_alert_title : (isOrganicMode ? t.bio_doctor : 'Standard Report')}
                </span>
                <span className="text-xs font-bold text-gray-400">{analysis?.confidence || 98}% Certainty</span>
              </div>
              <h2 className={`text-4xl font-black mb-2 ${showFraudWarning ? 'text-red-600' : 'text-gray-900'}`}>
                {showFraudWarning ? 'Flagged Batch' : analysis?.diagnosis}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                {showFraudWarning 
                  ? "Digital integrity mismatch found. Cross-verification with satellite growth data and purchase ledger failed." 
                  : (analysis?.summary || 'Provenance verified via Satya-Ledger.')}
              </p>
            </div>

            {/* AI Remedies Section */}
            {analysis?.remedies && analysis.remedies.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                   <h3 className="text-lg font-black text-gray-900">{isOrganicMode ? "Organic Cure Path" : "Expert Remedies"}</h3>
                   {isOrganicMode && (
                     <span className="text-[9px] font-black text-green-700 bg-green-50 px-2 py-1 rounded-lg uppercase border border-green-100">Chemicals Forbidden</span>
                   )}
                </div>
                {analysis.remedies.map((remedy: any, i: number) => (
                  <div key={i} className={`bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex gap-4 animate-in slide-in-from-bottom-2 duration-300 ${isOrganicMode ? 'ring-2 ring-green-50 border-green-100' : ''}`} style={{ animationDelay: `${i * 100}ms` }}>
                    <div className={`p-3 rounded-2xl h-fit ${isOrganicMode ? 'bg-green-700 text-white shadow-lg shadow-green-100' : 'bg-blue-50 text-blue-700'}`}>
                      {isOrganicMode ? <Leaf size={24} /> : <Zap size={24} />}
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 text-base">{remedy.title}</h4>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed font-medium">{remedy.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button 
              onClick={() => navigateTo('home')}
              disabled={showFraudWarning}
              className={`w-full py-5 rounded-[2rem] font-black text-sm text-white shadow-2xl transition-all ${
                showFraudWarning ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-700 shadow-green-100 active:scale-95'
              }`}
            >
              {showFraudWarning ? 'Integrity Verification Failed' : t.save_log}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scan-line {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-line {
          animation: scan-line 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default VisionResultScreen;
