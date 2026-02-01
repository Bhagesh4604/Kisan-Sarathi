
import React, { useState } from 'react';
import { COLORS } from '../constants';
import { Screen, UserProfile, Language } from '../types';
import { CloudSun, Camera, MessageCircle, Users, Map as MapIcon, ChevronRight, Bell, Globe, Search, ShieldCheck, Landmark, Sparkles } from 'lucide-react';
import { languages } from '../translations';

interface DashboardScreenProps {
  navigateTo: (screen: Screen) => void;
  user: UserProfile | null;
  t: any;
  onLangChange: (lang: Language) => void;
  currentLang: Language;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigateTo, user, t, onLangChange, currentLang }) => {
  const [showLangMenu, setShowLangMenu] = useState(false);

  return (
    <div className="p-6 bg-[#F8FAF8] min-h-full relative pb-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-green-700 flex items-center justify-center text-white shadow-lg shadow-green-100">
            <Landmark size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest leading-none mb-1">{t.namaste}</p>
            <h2 className="text-xl font-black text-gray-900 leading-none">{user?.name || 'Farmer'}</h2>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-green-700 flex items-center gap-1 transition-all active:scale-95"
          >
            <Globe size={18} />
            <span className="text-[10px] font-black uppercase">{currentLang}</span>
          </button>
          <button className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-400 active:scale-95 relative">
            <Bell size={22} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      {showLangMenu && (
        <div className="absolute top-20 right-6 z-50 bg-white rounded-3xl shadow-2xl border border-gray-100 p-2 w-48 animate-in fade-in slide-in-from-top-2 duration-200">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onLangChange(lang.code as Language);
                setShowLangMenu(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm transition-colors ${
                currentLang === lang.code 
                ? 'bg-green-50 text-green-700 font-black' 
                : 'text-gray-600 hover:bg-gray-50 font-bold'
              }`}
            >
              {lang.native}
            </button>
          ))}
        </div>
      )}

      {/* Weather Widget */}
      <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-[2.5rem] p-7 text-white shadow-2xl shadow-green-200/50 mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-green-200 text-xs font-bold uppercase tracking-widest mb-1">{user?.district || 'Nagpur'}</p>
              <h3 className="text-4xl font-black">28°C</h3>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-3xl">
              <CloudSun size={32} className="text-yellow-300" />
            </div>
          </div>
          <p className="text-green-50 font-bold text-sm">Clear Sky • 12% Humidity</p>
          <div className="mt-6 pt-5 border-t border-white/10 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
            <span>Forecast: Rain expected on Friday</span>
            <ChevronRight size={14} className="text-green-400" />
          </div>
        </div>
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-green-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Scheme Alerts (Module A: Scheme-Bot Enhancement) */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
            <Sparkles size={16} className="text-amber-500" /> {t.scheme_bot} Alerts
          </h3>
          <button className="text-[10px] font-black text-green-700 uppercase tracking-widest">View All</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 no-scrollbar">
          <div className="min-w-[260px] bg-blue-600 rounded-3xl p-5 text-white shadow-lg shadow-blue-100 flex flex-col justify-between h-36">
             <h4 className="font-black text-sm leading-tight">PM-Kisan 17th Installment Out</h4>
             <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold uppercase opacity-80">Released: Today</span>
                <button className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-wider">{t.apply_now}</button>
             </div>
          </div>
          <div className="min-w-[260px] bg-amber-600 rounded-3xl p-5 text-white shadow-lg shadow-amber-100 flex flex-col justify-between h-36">
             <h4 className="font-black text-sm leading-tight">80% Subsidy on Solar Pumps</h4>
             <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold uppercase opacity-80">Maharashtra State</span>
                <button className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-wider">{t.apply_now}</button>
             </div>
          </div>
        </div>
      </div>

      {/* Main Action Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <GridAction
          title={t.scan_disease}
          subtitle="Crop Doctor Vision"
          icon={<Camera size={24} className="text-blue-600" />}
          onClick={() => navigateTo('vision')}
          bgColor="bg-blue-50"
        />
        <GridAction
          title={t.ask_tutor}
          subtitle="AI Expert Advice"
          icon={<MessageCircle size={24} className="text-orange-600" />}
          onClick={() => navigateTo('chat')}
          bgColor="bg-orange-50"
        />
        <GridAction
          title={t.scheme_bot}
          subtitle="Govt. Subsidies"
          icon={<Search size={24} className="text-purple-600" />}
          onClick={() => navigateTo('chat')}
          bgColor="bg-purple-50"
        />
        <GridAction
          title={t.farm_map}
          subtitle="NDVI Health View"
          icon={<MapIcon size={24} className="text-emerald-600" />}
          onClick={() => navigateTo('map')}
          bgColor="bg-emerald-50"
        />
      </div>

      {/* Fin-Trust Banner */}
      <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-2">{t.fin_trust}</h3>
      <button 
        onClick={() => navigateTo('finance')}
        className="w-full bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/30 flex items-center justify-between mb-10 active:scale-[0.98] transition-all group"
      >
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-[1.5rem] bg-gray-900 flex flex-col items-center justify-center text-white group-hover:bg-green-700 transition-colors">
            <ShieldCheck size={28} />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.credit_score}</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-black text-gray-900">742</h4>
              <span className="text-[10px] text-green-600 font-black uppercase tracking-wider bg-green-50 px-2 py-0.5 rounded-full">Excellent</span>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-2 rounded-full">
          <ChevronRight size={20} className="text-gray-300" />
        </div>
      </button>

      <div className="flex justify-between items-center mb-5 px-2">
        <h3 className="text-lg font-black text-gray-900">{t.smart_tips}</h3>
        <button className="text-[10px] font-black text-green-700 uppercase tracking-widest">View All</button>
      </div>
      
      <div className="space-y-4">
        <TipCard
          title="Pest Warning"
          description="High probability of aphids in citrus crops this week in your district."
          type="warning"
        />
        <TipCard
          title="Market Opportunity"
          description="Mushroom prices are up by 12% in Pune Mandi. Best time to sell!"
          type="info"
        />
      </div>
    </div>
  );
};

const GridAction: React.FC<{ title: string; subtitle: string; icon: React.ReactNode; onClick: () => void; bgColor: string }> = ({ title, subtitle, icon, onClick, bgColor }) => (
  <button
    onClick={onClick}
    className={`${bgColor} p-6 rounded-[2.5rem] flex flex-col items-start text-left border border-black/5 shadow-sm active:scale-95 transition-all h-44 group overflow-hidden relative`}
  >
    <div className="p-3 bg-white rounded-2xl mb-4 shadow-md group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <span className="font-black text-gray-900 text-sm leading-tight mb-1 relative z-10">{title}</span>
    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider relative z-10">{subtitle}</span>
    <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
      {icon}
    </div>
  </button>
);

const TipCard: React.FC<{ title: string; description: string; type: 'warning' | 'info' }> = ({ title, description, type }) => (
  <div className="bg-white p-5 rounded-[2rem] border border-gray-100 flex gap-4 items-center shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-1.5 h-12 rounded-full ${type === 'warning' ? 'bg-amber-400' : 'bg-blue-400'}`}></div>
    <div className="flex-1">
      <h4 className="font-black text-gray-900 text-sm">{title}</h4>
      <p className="text-gray-500 text-[11px] font-medium mt-1 leading-relaxed">{description}</p>
    </div>
    <ChevronRight size={16} className="text-gray-200" />
  </div>
);

export default DashboardScreen;
