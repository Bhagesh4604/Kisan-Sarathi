
export type Screen = 'auth' | 'profile' | 'home' | 'social' | 'chat' | 'vision' | 'vision-result' | 'map' | 'market' | 'market-detail' | 'finance';

export type Language = 'en' | 'hi' | 'mr' | 'bn' | 'te' | 'ta' | 'pa' | 'kn';

export interface UserProfile {
  name: string;
  district: string;
  crops: string[];
  language?: Language;
}

export interface Post {
  id: string;
  author: string;
  avatar: string;
  type: 'image' | 'video';
  image: string; // Used as thumbnail if video
  videoUrl?: string;
  caption: string;
  likes: number;
  comments: number;
  liked?: boolean;
  saved?: boolean;
  isListing?: boolean;
  price?: string;
  timestamp: string;
  tags?: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
