
import React, { useState, useEffect } from 'react';
import { Screen } from '../types';
import { 
  ArrowLeft, 
  MapPin, 
  BadgeCheck, 
  Gavel, 
  Clock, 
  User, 
  Star, 
  MessageCircle, 
  Share2, 
  ShieldCheck,
  TrendingUp,
  Tag,
  Truck,
  Package,
  CheckCircle,
  Copy,
  Info,
  History,
  ChevronRight,
  TrendingDown,
  Sparkles,
  Zap,
  Fingerprint,
  Leaf
} from 'lucide-react';
import { COLORS } from '../constants';

interface MarketDetailScreenProps {
  navigateTo: (screen: Screen) => void;
  listing: any;
  t: any;
}

const MarketDetailScreen: React.FC<MarketDetailScreenProps> = ({ navigateTo, listing, t }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [bidPlaced, setBidPlaced] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15720); // 4h 22m in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!listing) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10 text-center bg-white">
        <LoaderIcon />
        <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Mandi Details...</p>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const handlePlaceBid = () => {
    if (!bidAmount) return;
    setBidPlaced(true);
    setTimeout(() => {
        setBidPlaced(false);
        setBidAmount('');
    }, 3000);
  };

  return (
    <div className="bg-[#f8fafc] min-h-full pb-32">
      {/* Visual Header */}
      <div className="relative h-[420px]">
        <img src={listing.image} className="w-full h-full object-cover" alt={listing.crop} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] via-transparent to-black/40"></div>
        
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
          <button 
            onClick={() => navigateTo('market')}
            className="p-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-white active:scale-90 transition-all shadow-xl"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex gap-2">
             <button className="p-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-white active:scale-90 transition-all shadow-xl">
                <Share2 size={24} />
             </button>
          </div>
        </div>

        <div className="absolute bottom-12 left-6 right-6">
           <div className="flex gap-2 mb-4">
             <span className="px-3 py-1.5 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
               <Tag size={12} /> {listing.category || 'Crop'}
             </span>
             {listing.isOrganic && (
               <span className="px-3 py-1.5 bg-green-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg border border-green-500">
                 <Leaf size={14} fill="white" /> Organic Verified
               </span>
             )}
             {listing.isSellerVerified && (
               <span className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                 <ShieldCheck size={14} /> Seller Verified
               </span>
             )}
           </div>
           <h1 className="text-4xl font-black text-white leading-tight drop-shadow-lg">{listing.crop}</h1>
           <div className="flex items-center text-white/80 text-xs font-bold mt-2">
              <MapPin size={14} className="mr-1 text-green-400" /> {listing.loc} • Harvested 2 days ago
           </div>
        </div>
      </div>

      <div className="px-6 -mt-8 relative z-10">
        {/* Mandi-Prophet Price Graph Card */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-gray-200/50 border border-gray-100 mb-6 relative overflow-hidden">
           <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <TrendingUp size={18} />
                 </div>
                 <h4 className="text-sm font-black text-gray-900">Mandi-Prophet AI</h4>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full border border-green-100">
                 <Sparkles size={12} className="text-green-600" />
                 <span className="text-[10px] font-black text-green-700">Rise Expected</span>
              </div>
           </div>

           {/* Simulated Graph (SVG) */}
           <div className="h-24 w-full mb-6 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40">
                {/* Past (Solid) */}
                <path d="M 0 35 L 20 30 L 40 32 L 60 25" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
                {/* Future (Dashed) */}
                <path d="M 60 25 L 75 18 L 100 10" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="3 2" strokeLinecap="round" />
                {/* Points */}
                <circle cx="0" cy="35" r="1.5" fill="#cbd5e1" />
                <circle cx="20" cy="30" r="1.5" fill="#cbd5e1" />
                <circle cx="40" cy="32" r="1.5" fill="#cbd5e1" />
                <circle cx="60" cy="25" r="2.5" fill="#1e293b" />
                <circle cx="100" cy="10" r="2.5" fill="#22c55e" />
              </svg>
              <div className="absolute top-0 right-0 p-1.5 bg-green-600 text-white text-[8px] font-black rounded-lg animate-bounce">
                ₹2,450/qtl
              </div>
           </div>

           <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <Zap size={18} className="text-amber-500 mt-0.5" />
              <div>
                <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest leading-none mb-1">Actionable Advice</p>
                <p className="text-xs font-bold text-gray-500">Sell in 3 days for max profit. Local mandi arrivals are slowing down.</p>
              </div>
           </div>
        </div>

        {/* Organic Passport - Traceability Timeline */}
        {listing.isOrganic && (
          <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-green-100 mb-6 relative overflow-hidden">
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-green-50 text-green-700 flex items-center justify-center">
                      <Fingerprint size={18} />
                   </div>
                   <h4 className="text-sm font-black text-gray-900">{t.traceability_passport}</h4>
                </div>
                <div className="px-2 py-1 bg-green-700 text-white rounded text-[8px] font-black uppercase">Satya-Ledger Verified</div>
             </div>
             <div className="space-y-4">
                <PassportStep title="Bio-Harvest" date="July 2, 2024" hash="0x8f2...a1" active />
                <PassportStep title="Neem-Oil Shield Spray" date="June 14, 2024" hash="0x4d1...c9" />
                <PassportStep title="Jeevamrutham Added" date="May 28, 2024" hash="0x9a3...e2" />
                <PassportStep title="Organic Seed Certification" date="April 10, 2024" hash="0x2b4...f5" />
             </div>
             <div className="absolute top-0 right-0 w-32 h-full bg-green-50/20 -skew-x-12 translate-x-16 pointer-events-none"></div>
          </div>
        )}

        {/* Price & Bid Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
           <div className="bg-green-700 rounded-[2rem] p-5 text-white shadow-lg shadow-green-100">
              <p className="text-[9px] font-black uppercase tracking-widest opacity-70 mb-1">Current Bid</p>
              <h3 className="text-2xl font-black">{listing.price}</h3>
              <div className="flex items-center gap-1 mt-2 text-green-300">
                 <TrendingUp size={12} />
                 <span className="text-[10px] font-black">{listing.trend} Demand</span>
              </div>
           </div>
           <div className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Quantity</p>
              <h3 className="text-2xl font-black text-gray-900">{listing.quantity}</h3>
              <p className="text-[10px] text-gray-400 font-bold mt-2">Available for Pickup</p>
           </div>
        </div>

        {/* Auction Time Remaining */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex justify-between items-center mb-4">
             <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                 <Clock size={18} />
               </div>
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Time Remaining</span>
             </div>
             <span className="text-sm font-black text-orange-600 tabular-nums">{formatTime(timeLeft)}</span>
          </div>
          <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-100 p-0.5">
             <div 
               className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-1000"
               style={{ width: `${(timeLeft / 21600) * 100}%` }}
             ></div>
          </div>
        </div>

        {/* Logistics & Tracking */}
        <div className="bg-gray-900 rounded-[2.5rem] p-5 flex justify-between items-center mb-8 shadow-2xl relative overflow-hidden group">
           <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-green-400">
                <Truck size={24} />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Tracking</p>
                  <span className="text-[9px] font-black text-green-500 bg-green-500/10 px-1.5 rounded-md">{listing.trackingId || 'PENDING'}</span>
                </div>
                <p className="text-xs font-bold text-white mt-0.5">Automated Logistics Enabled</p>
              </div>
           </div>
           <button 
            onClick={() => setShowTracking(!showTracking)}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-colors"
           >
             <ChevronRight size={20} className={showTracking ? 'rotate-90' : ''} />
           </button>
           <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        </div>

        {showTracking && (
          <div className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-xl mb-8 animate-in slide-in-from-top-4 duration-300">
            <div className="flex justify-between items-center mb-8">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Shipment Roadmap</h4>
              <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 rounded-xl text-[9px] font-black text-gray-900 border border-gray-100">
                 ID: {listing.trackingId} <Copy size={10} className="text-gray-300 ml-1" />
              </button>
            </div>
            <div className="space-y-6">
               <TimelineItem status="Delivery Complete" date="Target: July 12" icon={<CheckCircle size={16} />} />
               <TimelineItem status="In Transit" date="Mandi Hub #2" icon={<Truck size={16} />} active />
               <TimelineItem status="Quality Check" date="Passed" icon={<ShieldCheck size={16} />} completed />
               <TimelineItem status="Farmer Handover" date="Confirmed" icon={<Package size={16} />} completed />
            </div>
          </div>
        )}

        {/* Seller Profile Breakdown */}
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 px-2">Trust Metrics</h3>
        <div className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm mb-8">
           <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                 <div className="w-16 h-16 rounded-[1.5rem] bg-gray-50 flex items-center justify-center relative overflow-hidden ring-4 ring-green-50">
                    <img src={`https://picsum.photos/seed/${listing.seller}/150/150`} className="w-full h-full object-cover" alt="Seller" />
                    {listing.isSellerVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1.5 rounded-full border-2 border-white shadow-lg">
                        <ShieldCheck size={12} />
                      </div>
                    )}
                 </div>
                 <div>
                    <h4 className="font-black text-gray-900 text-lg">{listing.seller}</h4>
                    <div className="flex items-center gap-1.5 mt-1">
                       <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < 4 ? "currentColor" : "none"} />)}
                       </div>
                       <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">4.8 • Top Seller</span>
                    </div>
                 </div>
              </div>
              <button className="w-12 h-12 bg-green-50 text-green-700 rounded-2xl flex items-center justify-center active:scale-90 transition-all">
                 <MessageCircle size={22} strokeWidth={2.5} />
              </button>
           </div>
           <div className="grid grid-cols-2 gap-3 pt-6 border-t border-gray-50">
              <div className="flex items-center gap-2 text-gray-500">
                 <History size={14} className="text-blue-500" />
                 <span className="text-[10px] font-black uppercase">24 Sales</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                 <BadgeCheck size={14} className={listing.isSellerVerified ? 'text-green-500' : 'text-gray-300'} />
                 <span className={`text-[10px] font-black uppercase ${listing.isSellerVerified ? 'text-gray-700' : 'text-gray-400'}`}>
                   {listing.isSellerVerified ? 'KYC Verified' : 'KYC Pending'}
                 </span>
              </div>
           </div>
        </div>

        {/* Description Section */}
        <div className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm mb-12">
           <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Item Intelligence</h3>
           <p className="text-sm text-gray-600 font-medium leading-relaxed mb-4">
             {listing.description}
           </p>
           <div className="p-4 bg-blue-50 rounded-2xl flex items-start gap-3 border border-blue-100">
              <Info size={18} className="text-blue-500 mt-0.5" />
              <p className="text-[10px] text-blue-700 font-bold leading-relaxed italic">
                Verified via Satellite NDVI imaging: This crop shows high chlorophyll levels, indicating peak nutritional value and shelf life.
              </p>
           </div>
        </div>

        {/* Bidding Control Panel */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-xl border-t border-gray-100 p-6 z-50 shadow-[0_-15px_40px_rgba(0,0,0,0.08)] rounded-t-[3rem]">
           <div className="flex gap-4 mb-4">
              {[500, 1000, 2000].map(amt => (
                <button 
                  key={amt}
                  onClick={() => setBidAmount((parseInt(listing.price.replace(/\D/g, '')) + amt).toString())}
                  className="flex-1 py-2 rounded-xl bg-gray-50 border border-gray-100 text-[10px] font-black text-gray-500 uppercase tracking-widest active:bg-green-50 active:text-green-700 active:border-green-200 transition-all"
                >
                  +{amt}
                </button>
              ))}
           </div>
           <div className="flex gap-4 items-center">
              <div className="flex-[1.2] bg-gray-50 rounded-[1.5rem] p-4 border border-gray-100 flex items-center focus-within:ring-2 focus-within:ring-green-500 transition-all">
                 <span className="text-gray-400 font-black mr-2">₹</span>
                 <input 
                  type="number" 
                  placeholder="Custom Bid" 
                  className="bg-transparent outline-none w-full text-sm font-black text-gray-900"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                 />
              </div>
              <button 
                onClick={handlePlaceBid}
                disabled={!bidAmount || bidPlaced}
                className={`flex-[1.8] py-5 rounded-[1.5rem] text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl ${
                  bidPlaced ? 'bg-green-600 text-white' : 'bg-gray-900 text-white shadow-gray-200'
                }`}
              >
                {bidPlaced ? 'Bid Success!' : t.place_bid} 
                {!bidPlaced && <Gavel size={18} />}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const PassportStep: React.FC<{ title: string; date: string; hash: string; active?: boolean }> = ({ title, date, hash, active }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className={`w-3 h-3 rounded-full ${active ? 'bg-green-600 ring-4 ring-green-100' : 'bg-gray-200'}`}></div>
      <div className="flex-1 w-0.5 bg-gray-50 mt-1 min-h-[16px]"></div>
    </div>
    <div className="pb-4 flex-1">
      <div className="flex justify-between items-start">
         <h5 className={`text-[11px] font-black uppercase tracking-wider ${active ? 'text-gray-900' : 'text-gray-400'}`}>{title}</h5>
         <span className="text-[8px] font-mono text-gray-300 bg-gray-50 px-1 rounded">{hash}</span>
      </div>
      <p className="text-[9px] font-bold text-green-600 mt-0.5">{date}</p>
    </div>
  </div>
);

const TimelineItem: React.FC<{ status: string, date: string, icon: React.ReactNode, active?: boolean, completed?: boolean }> = ({ status, date, icon, active, completed }) => (
  <div className="flex gap-5">
    <div className="flex flex-col items-center">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-colors ${active ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-100' : completed ? 'bg-green-50 border-green-200 text-green-600' : 'bg-gray-50 border-gray-100 text-gray-300'}`}>
        {icon}
      </div>
      <div className="flex-1 w-0.5 bg-gray-100 mt-2 min-h-[24px]"></div>
    </div>
    <div className="pb-6">
      <p className={`text-sm font-black transition-colors ${active ? 'text-gray-900' : 'text-gray-400'}`}>{status}</p>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] mt-1">{date}</p>
    </div>
  </div>
);

const LoaderIcon = () => (
  <div className="relative">
    <div className="w-16 h-16 border-4 border-green-100 rounded-full"></div>
    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
    <Package className="absolute inset-0 m-auto text-green-600" size={24} />
  </div>
);

export default MarketDetailScreen;
