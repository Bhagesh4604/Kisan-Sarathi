
import React, { useState } from 'react';
import { Screen } from '../types';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  BadgeCheck, 
  Gavel, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Plus, 
  X, 
  Camera, 
  Package, 
  Tag,
  ShieldCheck
} from 'lucide-react';
import { COLORS } from '../constants';

interface MarketScreenProps {
  navigateTo: (screen: Screen, data?: any) => void;
  t: any;
}

const INITIAL_MOCK_LISTINGS = [
  { id: 1, crop: 'Organic Mushrooms', quantity: '500kg', price: '₹120/kg', loc: 'Pune', trend: '+5%', verified: true, isSellerVerified: true, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400&h=300&auto=format&fit=crop', category: 'Crop', seller: 'Ramesh K.', description: 'Freshly harvested organic button mushrooms from our controlled environment farm in Pune. High protein and quality.', trackingId: 'KS-TRK9921' },
  { id: 2, crop: 'Premium Lemons', quantity: '2000kg', price: '₹45/kg', loc: 'Nagpur', trend: '-2%', verified: true, isSellerVerified: false, image: 'https://images.unsplash.com/photo-1590502593747-42a9961345e2?q=80&w=400&h=300&auto=format&fit=crop', category: 'Crop', seller: 'Sita D.', description: 'Juicy, seedless lemons grown with organic fertilizers. Perfect for long-distance transport and high juice yield.', trackingId: 'KS-TRK4410' },
  { id: 3, crop: 'Basmati Rice', quantity: '10 Ton', price: '₹85/kg', loc: 'Karnal', trend: '+12%', verified: false, isSellerVerified: true, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400&h=300&auto=format&fit=crop', category: 'Crop', seller: 'Amit S.', description: 'Long grain aromatic Basmati rice, aged for 12 months. Direct from the heart of Haryana fields.', trackingId: 'KS-TRK8832' },
];

const MarketScreen: React.FC<MarketScreenProps> = ({ navigateTo, t }) => {
  const [listings, setListings] = useState(INITIAL_MOCK_LISTINGS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newListing, setNewListing] = useState({
    crop: '',
    price: '',
    quantity: '',
    loc: '',
    category: 'Crop',
    description: ''
  });

  const generateTrackingId = () => {
    return 'KS-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  };

  const handleAddListing = () => {
    if (!newListing.crop || !newListing.price || !newListing.quantity) return;

    const entry = {
      id: Date.now(),
      crop: newListing.crop,
      quantity: newListing.quantity,
      price: `₹${newListing.price}/${newListing.category === 'Crop' ? 'kg' : 'unit'}`,
      loc: newListing.loc || 'My Farm',
      trend: 'New',
      verified: false,
      isSellerVerified: Math.random() > 0.5, // 50% chance of seller verification
      isUserListing: true,
      category: newListing.category,
      image: `https://picsum.photos/seed/${newListing.crop}/400/300`,
      seller: 'Me',
      description: newListing.description || 'No description provided.',
      trackingId: generateTrackingId()
    };

    setListings([entry, ...listings]);
    setShowAddForm(false);
    setNewListing({ crop: '', price: '', quantity: '', loc: '', category: 'Crop', description: '' });
  };

  return (
    <div className="bg-[#f8fafc] min-h-full pb-24 relative">
      {/* Sticky Header */}
      <div className="bg-white p-6 pb-4 sticky top-0 z-20 shadow-sm border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-black text-gray-900">{t.market_direct}</h2>
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-2xl text-xs font-black shadow-lg shadow-green-100 active:scale-95 transition-all"
          >
            <Plus size={16} strokeWidth={3} />
            Sell My Crop
          </button>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3 flex items-center border border-gray-100">
            <Search size={18} className="text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search crops, tools or regions..." 
              className="bg-transparent outline-none text-sm text-gray-900 w-full font-medium" 
            />
          </div>
          <button className="p-3 bg-white border border-gray-100 text-gray-600 rounded-2xl shadow-sm active:bg-gray-50">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">{t.active_listings}</h3>
          <div className="flex items-center text-[10px] font-black text-green-700 gap-1 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
            <TrendingUp size={12} />
            MARKET TREND: BULLISH
          </div>
        </div>

        <div className="grid gap-6">
          {listings.map((item: any) => (
            <div 
              key={item.id} 
              onClick={() => navigateTo('market-detail', { listing: item })}
              className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/40 transition-transform active:scale-[0.98]"
            >
              <div className="relative h-52">
                <img src={item.image} className="w-full h-full object-cover" alt={item.crop} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                   <Clock size={12} className="text-orange-500" />
                   <span className="text-[10px] font-black text-gray-900">Ends in 4h</span>
                </div>

                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {item.verified && (
                    <div className="bg-green-600 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-green-500">
                      <BadgeCheck size={14} />
                      <span className="text-[10px] font-black uppercase tracking-wider">Satellite Verified</span>
                    </div>
                  )}
                  {item.isSellerVerified && (
                    <div className="bg-blue-600 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-blue-500">
                      <ShieldCheck size={14} />
                      <span className="text-[10px] font-black uppercase tracking-wider">Verified Seller</span>
                    </div>
                  )}
                </div>

                {item.isUserListing && (
                  <div className="absolute bottom-4 right-4 bg-gray-900 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-gray-700">
                    <Tag size={12} />
                    <span className="text-[10px] font-black uppercase tracking-wider">My Listing</span>
                  </div>
                )}

                <div className="absolute bottom-4 left-5">
                   <p className="text-white text-[10px] font-black uppercase tracking-widest bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded-lg w-fit mb-1">
                     {item.category || 'Crop'}
                   </p>
                   <h4 className="text-xl font-black text-white leading-tight">{item.crop}</h4>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <div className="flex items-center text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">
                       <MapPin size={12} className="mr-1 text-green-600" /> {item.loc}
                    </div>
                    <p className="text-gray-500 text-sm font-bold">{item.quantity} available</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-green-700 leading-none">{item.price}</p>
                    <p className={`text-[10px] font-black mt-1 uppercase ${item.trend.startsWith('+') ? 'text-green-500' : 'text-gray-400'}`}>
                      {item.trend} Today
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button className="flex-1 py-4 bg-gray-900 text-white rounded-[1.5rem] text-xs font-black flex items-center justify-center gap-2 shadow-xl shadow-gray-200 active:scale-95 transition-all">
                    <Gavel size={16} /> {t.place_bid}
                  </button>
                  <button className="w-14 h-14 bg-green-50 text-green-700 rounded-[1.5rem] border border-green-100 flex items-center justify-center active:scale-95">
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Listing Modal Overlay */}
      {showAddForm && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center px-4 pb-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddForm(false)}></div>
          
          <div className="bg-white w-full max-w-md rounded-[3rem] p-8 shadow-2xl relative z-10 animate-in slide-in-from-bottom-10 duration-300">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-2xl font-black text-gray-900">Sell My Item</h3>
               <button onClick={() => setShowAddForm(false)} className="p-2 bg-gray-50 rounded-full text-gray-400"><X size={20} /></button>
            </div>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              <div className="flex gap-2">
                {['Crop', 'Tool', 'Seeds'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setNewListing({...newListing, category: cat})}
                    className={`flex-1 py-2.5 rounded-2xl text-[10px] font-black uppercase border transition-all ${
                      newListing.category === cat ? 'bg-green-700 border-green-700 text-white shadow-lg' : 'bg-gray-50 border-gray-100 text-gray-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Item Name</label>
                <div className="bg-gray-50 rounded-2xl p-4 flex items-center border border-gray-100 focus-within:border-green-500 transition-all">
                   <Package size={18} className="text-gray-300 mr-3" />
                   <input 
                    type="text" 
                    placeholder="e.g. Fresh Mushrooms" 
                    className="bg-transparent outline-none w-full text-sm font-black text-gray-900"
                    value={newListing.crop}
                    onChange={(e) => setNewListing({...newListing, crop: e.target.value})}
                   />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Description</label>
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                   <textarea 
                    placeholder="Provide details about quality, harvest date..." 
                    className="bg-transparent outline-none w-full text-sm font-medium text-gray-900 h-24 resize-none"
                    value={newListing.description}
                    onChange={(e) => setNewListing({...newListing, description: e.target.value})}
                   />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Price (₹)</label>
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center">
                    <span className="text-gray-400 font-black mr-2">₹</span>
                    <input 
                      type="number" 
                      placeholder="120" 
                      className="bg-transparent outline-none w-full text-sm font-black text-gray-900"
                      value={newListing.price}
                      onChange={(e) => setNewListing({...newListing, price: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Quantity</label>
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <input 
                      type="text" 
                      placeholder="e.g. 50 kg" 
                      className="bg-transparent outline-none w-full text-sm font-black text-gray-900"
                      value={newListing.quantity}
                      onChange={(e) => setNewListing({...newListing, quantity: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <button className="w-full py-4 bg-gray-100 rounded-2xl flex items-center justify-center gap-3 text-gray-500 font-black text-sm active:scale-95 transition-all">
                <Camera size={20} /> Add Photo
              </button>

              <button 
                onClick={handleAddListing}
                className="w-full py-5 bg-green-700 text-white rounded-[2rem] font-black shadow-2xl shadow-green-100 active:scale-95 transition-all mt-4"
              >
                Post Listing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketScreen;
