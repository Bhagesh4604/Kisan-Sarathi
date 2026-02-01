
import React, { useState } from 'react';
import { COLORS } from '../constants';
import { UserProfile } from '../types';
import { ChevronRight, MapPin, Wheat } from 'lucide-react';

interface ProfileScreenProps {
  onComplete: (profile: UserProfile) => void;
  t: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onComplete, t }) => {
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('');
  const [crops, setCrops] = useState<string[]>([]);
  const [cropInput, setCropInput] = useState('');

  const addCrop = () => {
    if (cropInput.trim() && !crops.includes(cropInput.trim())) {
      setCrops([...crops, cropInput.trim()]);
      setCropInput('');
    }
  };

  const removeCrop = (cropToRemove: string) => {
    setCrops(crops.filter(c => c !== cropToRemove));
  };

  return (
    <div className="h-full flex flex-col px-6 pt-12 bg-white">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.create_profile}</h2>
      <p className="text-gray-500 mb-8 text-sm">{t.farm_details}</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{t.full_name}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Ramesh Kumar"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none text-gray-900 font-medium placeholder:text-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{t.district}</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="e.g., Nagpur, Maharashtra"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none text-gray-900 font-medium placeholder:text-gray-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{t.crops_grow}</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={cropInput}
              onChange={(e) => setCropInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCrop()}
              placeholder="e.g., Mushrooms, Wheat"
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-gray-900 font-medium placeholder:text-gray-400"
            />
            <button
              onClick={addCrop}
              className="px-4 bg-green-100 text-green-700 rounded-xl font-bold hover:bg-green-200 transition-colors"
            >
              {t.add}
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {crops.map((crop) => (
              <span key={crop} className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-semibold">
                <Wheat size={12} />
                {crop}
                <button onClick={() => removeCrop(crop)} className="ml-1 text-green-400 hover:text-green-600 font-bold">×</button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto pb-10">
        <button
          onClick={() => onComplete({ name, district, crops })}
          disabled={!name || !district || crops.length === 0}
          className="w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ backgroundColor: COLORS.primary }}
        >
          {t.complete_profile}
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ProfileScreen;
