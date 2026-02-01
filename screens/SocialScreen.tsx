
import React, { useState } from 'react';
import { MOCK_POSTS, COLORS } from '../constants';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, UserPlus, ArrowLeft, Plus, Mic, Radio } from 'lucide-react';
import { Screen, Post } from '../types';

interface SocialScreenProps {
  navigateTo: (screen: Screen) => void;
}

const SocialScreen: React.FC<SocialScreenProps> = ({ navigateTo }) => {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [showProfile, setShowProfile] = useState<string | null>(null);

  const toggleLike = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, likes: p.likes + (p.liked ? -1 : 1), liked: !p.liked };
      }
      return p;
    }));
  };

  if (showProfile) {
    return <FarmerProfileView onBack={() => setShowProfile(null)} name={showProfile} />;
  }

  return (
    <div className="bg-white min-h-full">
      <div className="sticky top-0 bg-white/90 backdrop-blur-xl z-30 px-6 py-4 border-b border-gray-100 flex justify-between items-center shadow-sm">
        <h2 className="text-xl font-black text-gray-900 tracking-tight">Krishi Social</h2>
        <div className="flex gap-4">
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors"><Plus size={24} className="text-gray-900" /></button>
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors"><Send size={24} className="text-gray-900" /></button>
        </div>
      </div>

      <div className="bg-[#f8fafc] pb-24">
        {/* Module B: Live Audio Rooms */}
        <div className="bg-white border-b border-gray-100 py-4 mb-4">
          <div className="flex justify-between items-center px-6 mb-4">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <Radio size={16} className="text-red-500" /> Live Audio Rooms
            </h3>
            <button className="text-[10px] font-black text-green-700 uppercase">Host Room</button>
          </div>
          <div className="flex gap-4 overflow-x-auto px-6 no-scrollbar">
            <LiveRoomCard name="Wheat Experts" host="Rajesh V." listeners={42} />
            <LiveRoomCard name="Organic Tips" host="Meera S." listeners={15} />
            <LiveRoomCard name="Mandi Update" host="Sunil K." listeners={108} />
            <LiveRoomCard name="New Schemes" host="Govt Sahayak" listeners={310} />
          </div>
        </div>

        {posts.map((post) => (
          <div key={post.id} className="mb-4 bg-white border-y border-gray-100 shadow-sm">
            <div className="px-4 py-3 flex justify-between items-center">
              <button 
                onClick={() => setShowProfile(post.author)}
                className="flex items-center gap-3"
              >
                <div className="relative">
                   <img src={post.avatar} className="w-10 h-10 rounded-full object-cover ring-2 ring-green-50 p-0.5" alt={post.author} />
                   <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-bold text-gray-900">{post.author}</h4>
                  <p className="text-[10px] text-gray-400 font-medium">Verified Farmer • 2h ago</p>
                </div>
              </button>
              <MoreHorizontal size={20} className="text-gray-300" />
            </div>

            <div className="relative aspect-[4/5] overflow-hidden">
              <img src={post.image} className="w-full h-full object-cover transition-transform hover:scale-105 duration-700" alt="Crop" />
            </div>

            <div className="px-4 py-4 flex justify-between">
              <div className="flex gap-6">
                <button 
                  onClick={() => toggleLike(post.id)}
                  className="flex items-center gap-1.5 group"
                >
                  <Heart size={26} className={`${(post as any).liked ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-900 group-hover:text-red-500'} transition-all`} />
                  <span className="text-sm font-bold text-gray-900">{post.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 group">
                  <MessageCircle size={26} className="text-gray-900 group-hover:text-blue-500 transition-colors" />
                  <span className="text-sm font-bold text-gray-900">{post.comments}</span>
                </button>
                <button className="group">
                   <Send size={26} className="text-gray-900 group-hover:text-green-600 transition-colors" />
                </button>
              </div>
              <Bookmark size={26} className="text-gray-900" />
            </div>

            <div className="px-4 pb-4">
              <p className="text-sm text-gray-800 leading-relaxed">
                <span className="font-bold mr-2">{post.author}</span>
                {post.caption}
              </p>
              <button className="text-xs text-gray-400 font-bold mt-3 tracking-wide uppercase">Add a comment...</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LiveRoomCard: React.FC<{ name: string; host: string; listeners: number }> = ({ name, host, listeners }) => (
  <div className="flex flex-col items-center gap-2 min-w-[100px] group active:scale-95 transition-all">
    <div className="relative">
      <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-tr from-green-700 to-green-500 p-0.5 shadow-md">
        <div className="w-full h-full rounded-[1.8rem] bg-white p-1 overflow-hidden">
           <img src={`https://picsum.photos/seed/${host}/200/200`} className="w-full h-full object-cover rounded-[1.5rem]" alt={host} />
        </div>
      </div>
      <div className="absolute -bottom-1 -right-1 bg-red-600 text-white p-1.5 rounded-2xl border-2 border-white shadow-lg">
        <Mic size={12} strokeWidth={3} />
      </div>
    </div>
    <div className="text-center">
       <p className="text-[10px] font-black text-gray-900 leading-tight truncate w-24">{name}</p>
       <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">{listeners} Listening</p>
    </div>
  </div>
);

const FarmerProfileView: React.FC<{ onBack: () => void; name: string }> = ({ onBack, name }) => (
  <div className="bg-white min-h-full animate-in slide-in-from-right duration-300">
    <div className="p-4 flex items-center gap-4 sticky top-0 bg-white/80 backdrop-blur-md z-10">
      <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={24} /></button>
      <h2 className="text-lg font-black">{name}</h2>
    </div>

    <div className="p-6 flex flex-col items-center">
      <div className="relative mb-6">
        <img src={`https://picsum.photos/seed/${name}/200/200`} className="w-28 h-28 rounded-[2.5rem] border-4 border-green-50 shadow-xl object-cover" alt={name} />
        <div className="absolute -bottom-2 -right-2 bg-green-600 p-2 rounded-2xl shadow-lg border-2 border-white text-white">
          <UserPlus size={20} />
        </div>
      </div>
      <h3 className="text-2xl font-black text-gray-900">{name}</h3>
      <p className="text-green-600 text-xs font-black uppercase tracking-widest mt-1 mb-4">Organic Farming Specialist</p>
      <p className="text-gray-500 text-sm mb-8 text-center leading-relaxed px-6">Expert in sustainable wheat cultivation and organic pesticides. 15 years of field experience.</p>
      
      <div className="grid grid-cols-3 w-full gap-4 mb-8">
        <div className="bg-gray-50 p-4 rounded-3xl text-center">
          <p className="font-black text-xl text-gray-900">128</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Posts</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-3xl text-center">
          <p className="font-black text-xl text-gray-900">1.2k</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Fans</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-3xl text-center">
          <p className="font-black text-xl text-gray-900">4.8</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Rating</p>
        </div>
      </div>

      <div className="flex w-full gap-3">
        <button className="flex-1 py-4 bg-green-700 text-white rounded-[1.5rem] font-bold shadow-xl shadow-green-100">Message</button>
        <button className="px-6 py-4 bg-gray-100 text-gray-900 rounded-[1.5rem] font-bold">Consult</button>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-0.5 mt-4">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="aspect-square bg-gray-100 overflow-hidden relative group">
          <img src={`https://picsum.photos/seed/${name}-${i}/400/400`} className="w-full h-full object-cover transition-opacity group-hover:opacity-80" alt="Gallery" />
        </div>
      ))}
    </div>
  </div>
);

export default SocialScreen;
