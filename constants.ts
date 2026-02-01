
import { Post } from './types';

export const COLORS = {
  primary: '#2E7D32',
  primaryDark: '#1B5E20',
  accent: '#A5D6A7',
  background: '#F1F8E9',
  white: '#FFFFFF',
  error: '#D32F2F',
};

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: 'Ramesh Kumar',
    avatar: 'https://picsum.photos/seed/farmer1/100/100',
    type: 'image',
    image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=800&auto=format&fit=crop',
    caption: 'My wheat crop is looking healthy this season! High nitrogen levels detected. #Farming #GreenField',
    likes: 24,
    comments: 5,
    timestamp: '2h ago',
    tags: ['Wheat', 'Organic']
  },
  {
    id: '2',
    author: 'Sita Devi',
    avatar: 'https://picsum.photos/seed/farmer2/100/100',
    type: 'video',
    image: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-farmer-walking-through-a-green-field-4251-large.mp4',
    caption: 'Quick tutorial: How to check soil moisture without expensive tools. #AgriTech #FarmersHelp',
    likes: 156,
    comments: 24,
    timestamp: '4h ago',
    tags: ['Tutorial', 'Soil']
  },
  {
    id: '3',
    author: 'Amit Singh',
    avatar: 'https://picsum.photos/seed/farmer3/100/100',
    type: 'image',
    image: 'https://images.unsplash.com/photo-1533460004989-cef01064af7c?q=80&w=800&auto=format&fit=crop',
    caption: 'New tractor delivered today! Ready for the massive harvest in Nagpur. #Harvest2024',
    likes: 89,
    comments: 21,
    timestamp: '6h ago',
    tags: ['Machinery', 'Tractor']
  },
  {
    id: '4',
    author: 'Priya Verma',
    avatar: 'https://picsum.photos/seed/farmer4/100/100',
    type: 'video',
    image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-person-holding-a-green-plant-4228-large.mp4',
    caption: 'Started mushroom farming in my backyard. The first sprout is here! #MushroomFarming',
    likes: 42,
    comments: 12,
    timestamp: '1d ago',
    tags: ['Mushrooms', 'BackyardFarming']
  }
];
