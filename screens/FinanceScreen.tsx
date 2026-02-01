
import React, { useState, useEffect } from 'react';
import { Screen } from '../types';
import { 
  ShieldCheck, 
  ArrowUpRight, 
  Wallet, 
  Leaf, 
  ChevronRight, 
  Landmark, 
  CreditCard, 
  TrendingUp, 
  History, 
  Users, 
  Satellite,
  Award,
  Zap,
  CloudRain,
  ShieldAlert,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { COLORS } from '../constants';

interface FinanceScreenProps {
  navigateTo: (screen: Screen) => void;
  t: any;
}

const FinanceScreen: React.FC<FinanceScreenProps> = ({ navigateTo, t }) => {
  const [payoutTriggered, setPayoutTriggered] = useState(false);
  const [rainfall, setRainfall] = useState(115); // Simulated live oracle data

  // Simulate real-time weather data oracle
  useEffect(() => {
    const timer = setInterval(() => {
      setRainfall(prev => {
        const next = prev - (Math.random() * 2);
        if (next < 100 && !payoutTriggered) {
          setPayoutTriggered(true);
        }
        return next;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, [payoutTriggered]);

  return (
    <div className="p-6 bg-[#F8FAF8] min-h-full pb-32">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900">{t.fin_trust}</h2>
          <div className="flex items-center gap-1 mt-1">
            <ShieldCheck size={12} className="text-green-600" />
            <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Bank-Verified Profile</p>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 active:bg-gray-50">
           <History size={24} />
        </div>
      </div>

      {/* Module D: Credit Score Passport */}
      <div className="bg-gray-900 rounded-[2.5rem] p-8 shadow-2xl shadow-green-900/20 mb-8 relative overflow-hidden transition-all hover:shadow-green-900/30">
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative w-48 h-48 flex items-center justify-center mb-6">
             <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="url(#scoreGradient)" 
                  strokeWidth="8" 
                  strokeDasharray="283" 
                  strokeDashoffset="70" 
                  strokeLinecap="round" 
                  className="transition-all duration-1000 ease-out" 
                />
                <defs>
                   <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="50%" stopColor="#eab308" />
                      <stop offset="100%" stopColor="#22c55e" />
                   </linearGradient>
                </defs>
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Score</p>
                <h3 className="text-5xl font-black text-white">742</h3>
                <div className="mt-2 flex items-center gap-1 text-green-400">
                   <TrendingUp size={12} />
                   <span className="text-[10px] font-black">+12</span>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full">
             <ScoreFactor icon={<Satellite size={14} />} label="Satellite" value="88%" />
             <ScoreFactor icon={<Users size={14} />} label="Social" value="Gold" />
             <ScoreFactor icon={<Award size={14} />} label="Yield" value="High" />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
      </div>

      {/* KILLER FEATURE: Parametric Shield (Instant Auto-Insurance) */}
      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-2">{t.parametric_shield}</h3>
      <div className={`rounded-[2.5rem] p-7 shadow-xl transition-all duration-500 border relative overflow-hidden mb-8 ${
        payoutTriggered ? 'bg-amber-600 border-amber-500 shadow-amber-200' : 'bg-white border-gray-100 shadow-gray-200/40'
      }`}>
        <div className="flex justify-between items-start mb-6">
           <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${payoutTriggered ? 'bg-white text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                {payoutTriggered ? <ShieldAlert size={24} /> : <ShieldCheck size={24} />}
              </div>
              <div>
                <h4 className={`text-lg font-black leading-tight ${payoutTriggered ? 'text-white' : 'text-gray-900'}`}>
                  {t.drought_shield}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                   <div className={`w-2 h-2 rounded-full ${payoutTriggered ? 'bg-red-300 animate-pulse' : 'bg-green-500'}`}></div>
                   <p className={`text-[9px] font-black uppercase tracking-widest ${payoutTriggered ? 'text-white/80' : 'text-gray-400'}`}>
                     {payoutTriggered ? t.payout_triggered : t.smart_contract}
                   </p>
                </div>
              </div>
           </div>
           <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 ${
             payoutTriggered ? 'bg-white/10 border-white/20 text-white' : 'bg-gray-50 border-gray-100 text-gray-400'
           }`}>
              <Activity size={12} className={!payoutTriggered ? 'animate-pulse' : ''} />
              <span className="text-[8px] font-black uppercase tracking-tighter">{t.oracle_sync}</span>
           </div>
        </div>

        <div className={`p-5 rounded-3xl mb-6 flex justify-between items-center ${
          payoutTriggered ? 'bg-white/10' : 'bg-gray-50'
        }`}>
           <div>
             <p className={`text-[9px] font-bold uppercase ${payoutTriggered ? 'text-white/60' : 'text-gray-400'}`}>Live Rainfall</p>
             <h5 className={`text-2xl font-black ${payoutTriggered ? 'text-white' : 'text-gray-900'}`}>
                {rainfall.toFixed(1)}<span className="text-sm font-medium ml-1">mm</span>
             </h5>
           </div>
           <div className="text-right">
             <p className={`text-[9px] font-bold uppercase ${payoutTriggered ? 'text-white/60' : 'text-gray-400'}`}>Trigger Threshold</p>
             <h5 className={`text-xl font-black ${payoutTriggered ? 'text-white/40' : 'text-gray-300'}`}>
                &lt; 100.0mm
             </h5>
           </div>
        </div>

        {payoutTriggered ? (
          <div className="animate-in zoom-in duration-300">
             <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center text-white shadow-lg shadow-green-600/20">
                   <CheckCircle2 size={24} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-white/70 uppercase">Smart Contract Payout</p>
                   <p className="text-xl font-black text-white">₹20,000.00 Sent</p>
                </div>
             </div>
             <p className="text-[10px] text-white/60 text-center font-bold italic">Verification bypassed: Parametric data confirmed drought conditions in Nagpur Sector 4.</p>
          </div>
        ) : (
          <div className="flex gap-3">
             <div className="flex-1 bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-center gap-3">
                <CloudRain size={20} className="text-blue-500" />
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase">Payout Coverage</p>
                  <p className="text-sm font-black text-gray-900">₹20,000</p>
                </div>
             </div>
             <button className="flex-1 bg-green-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-green-100 active:scale-95 transition-all">
                {t.buy_shield}
             </button>
          </div>
        )}
      </div>

      {/* Carbon Credit Wallet */}
      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-2">{t.carbon_wallet}</h3>
      <div className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-xl shadow-gray-200/40 mb-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 rounded-3xl bg-green-50 text-green-700 flex items-center justify-center">
               <Leaf size={28} />
             </div>
             <div>
               <h4 className="text-2xl font-black text-gray-900 leading-tight">12.4 MT</h4>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.carbon_credits}</p>
             </div>
          </div>
          <div className="text-right">
             <p className="text-xl font-black text-green-600">₹24,800</p>
             <p className="text-[9px] font-bold text-gray-400 uppercase">Current Value</p>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
           <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-400">Sustainable Farming</span>
              <span className="text-green-600">+8.2 MT</span>
           </div>
           <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-[65%]"></div>
           </div>
        </div>

        <button className="w-full py-4 bg-gray-100 rounded-2xl text-[10px] font-black uppercase text-gray-500 flex items-center justify-center gap-2 active:bg-gray-200 transition-all">
          Withdraw to Kisan Wallet <ArrowUpRight size={14} />
        </button>
      </div>

      {/* Financial Marketplace Services */}
      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-2">Fin-Tools</h3>
      <div className="grid grid-cols-2 gap-4">
        <FinanceTool 
          icon={<Wallet size={24} />} 
          label="Micro Loans" 
          desc="Starting 4.2%"
          color="bg-blue-50 text-blue-700"
        />
        <FinanceTool 
          icon={<CreditCard size={24} />} 
          label="Crop Insurance" 
          desc="Standard Policy"
          color="bg-purple-50 text-purple-700"
        />
      </div>

      <button className="w-full mt-6 py-5 bg-white border border-gray-100 rounded-[2rem] flex items-center justify-between px-8 shadow-sm active:scale-[0.98] transition-all">
        <div className="flex items-center gap-5">
           <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <Landmark size={24} />
           </div>
           <div className="text-left">
             <span className="font-black text-gray-900 text-sm">Govt. KCC Connect</span>
             <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Direct institutional aid</p>
           </div>
        </div>
        <ChevronRight size={20} className="text-gray-300" />
      </button>
    </div>
  );
};

const ScoreFactor: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center gap-1">
    <div className="text-green-400">{icon}</div>
    <p className="text-[8px] font-bold text-gray-500 uppercase tracking-tighter">{label}</p>
    <p className="text-xs font-black text-white">{value}</p>
  </div>
);

const FinanceTool: React.FC<{ icon: React.ReactNode; label: string; desc: string; color: string }> = ({ icon, label, desc, color }) => (
  <button className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-start gap-4 active:scale-95 transition-all text-left group overflow-hidden relative">
    <div className={`p-3 rounded-2xl transition-transform group-hover:scale-110 relative z-10 ${color}`}>
      {icon}
    </div>
    <div className="relative z-10">
      <span className="text-xs font-black text-gray-900 uppercase tracking-wider block mb-1">{label}</span>
      <p className="text-[9px] font-bold text-gray-400 uppercase">{desc}</p>
    </div>
    <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
       {icon}
    </div>
  </button>
);

export default FinanceScreen;
