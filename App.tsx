
import React, { useState, useEffect } from 'react';
import { Screen, UserProfile, Language } from './types';
import AuthScreen from './screens/AuthScreen';
import ProfileScreen from './screens/ProfileScreen';
import DashboardScreen from './screens/DashboardScreen';
import SocialScreen from './screens/SocialScreen';
import ChatScreen from './screens/ChatScreen';
import VisionScreen from './screens/VisionScreen';
import VisionResultScreen from './screens/VisionResultScreen';
import FarmMapScreen from './screens/FarmMapScreen';
import MarketScreen from './screens/MarketScreen';
import MarketDetailScreen from './screens/MarketDetailScreen';
import FinanceScreen from './screens/FinanceScreen';
import BottomNav from './components/BottomNav';
import { translations } from './translations';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('auth');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedProfile = localStorage.getItem('ks_profile');
    const savedLang = localStorage.getItem('ks_lang') as Language;
    
    if (savedLang) {
      setLanguage(savedLang);
    }

    if (savedProfile) {
      setUser(JSON.parse(savedProfile));
      setCurrentScreen('home');
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('ks_lang', lang);
  };

  const navigateTo = (screen: Screen, data?: any) => {
    if (screen === 'vision-result' && data?.image) {
      setCapturedImage(data.image);
    }
    if (screen === 'market-detail' && data?.listing) {
      setSelectedListing(data.listing);
    }
    setCurrentScreen(screen);
  };

  const handleLogin = () => {
    if (user) navigateTo('home');
    else navigateTo('profile');
  };

  const handleProfileComplete = (profile: UserProfile) => {
    const completeProfile = { ...profile, language };
    setUser(completeProfile);
    localStorage.setItem('ks_profile', JSON.stringify(completeProfile));
    navigateTo('home');
  };

  const t = translations[language];

  const renderScreen = () => {
    switch (currentScreen) {
      case 'auth':
        return <AuthScreen onLogin={handleLogin} currentLang={language} onLangChange={changeLanguage} />;
      case 'profile':
        return <ProfileScreen onComplete={handleProfileComplete} t={t} />;
      case 'home':
        return <DashboardScreen navigateTo={navigateTo} user={user} t={t} onLangChange={changeLanguage} currentLang={language} />;
      case 'social':
        return <SocialScreen navigateTo={navigateTo} />;
      case 'chat':
        return <ChatScreen navigateTo={navigateTo} language={language} t={t} />;
      case 'vision':
        return <VisionScreen navigateTo={navigateTo} t={t} />;
      case 'vision-result':
        return <VisionResultScreen navigateTo={navigateTo} image={capturedImage} language={language} t={t} />;
      case 'map':
        return <FarmMapScreen navigateTo={navigateTo} />;
      case 'market':
        return <MarketScreen navigateTo={navigateTo} t={t} />;
      case 'market-detail':
        return <MarketDetailScreen navigateTo={navigateTo} listing={selectedListing} t={t} />;
      case 'finance':
        return <FinanceScreen navigateTo={navigateTo} t={t} />;
      default:
        return <AuthScreen onLogin={handleLogin} currentLang={language} onLangChange={changeLanguage} />;
    }
  };

  const showNav = !['auth', 'profile', 'market-detail'].includes(currentScreen);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-xl relative overflow-hidden">
      <main className="flex-1 overflow-y-auto pb-20">
        {renderScreen()}
      </main>
      {showNav && (
        <BottomNav currentScreen={currentScreen} onNavigate={navigateTo} />
      )}
    </div>
  );
};

export default App;
