import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { BioOptimizer } from './components/BioOptimizer';
import { UploadHub } from './components/UploadHub';
import { ProfileSettings } from './components/ProfileSettings';
import { BrandAssets } from './components/BrandAssets';
import { Auth } from './components/Auth';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appLogo, setAppLogo] = useState<string | null>(null);
  
  // Auth state
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        } else {
          setToken(null);
          localStorage.removeItem('auth_token');
        }
      })
      .catch(() => {
        setToken(null);
        localStorage.removeItem('auth_token');
      })
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleLogout = () => {
    if (token) {
      fetch('/api/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
  };
  
  // Shared state for the user's profile
  const [profile, setProfile] = useState({
    name: user?.name || 'Lorenzo Vlaeminck',
    bio: 'I am a passionate creator capturing the beauty of nature and urban landscapes. My work focuses on light, shadow, and the fleeting moments of everyday life.',
    profilePicture: 'https://picsum.photos/seed/lorenzo/200/200',
    leadMagnetUrl: 'https://example.com/free-presets',
    leadMagnetTitle: 'Free Lightroom Presets'
  });

  // Update profile name when user loads
  useEffect(() => {
    if (user?.name) {
      setProfile(p => ({ ...p, name: user.name }));
    }
  }, [user]);

  // Connected platforms
  const [platforms, setPlatforms] = useState([
    { id: 'shutterstock', name: 'Shutterstock', connected: true, icon: 'Camera' },
    { id: 'adobestock', name: 'Adobe Stock', connected: false, icon: 'Image' },
    { id: 'getty', name: 'Getty Images', connected: true, icon: 'Aperture' },
    { id: 'unsplash', name: 'Unsplash', connected: false, icon: 'ImagePlus' },
  ]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#09090B] text-white">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={(token, user) => {
      setToken(token);
      setUser(user);
      localStorage.setItem('auth_token', token);
    }} />;
  }

  return (
    <div className="flex h-screen bg-[#09090B] text-zinc-100 font-sans selection:bg-violet-500/30 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} profile={profile} appLogo={appLogo} onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto p-8 flex flex-col relative">
        {/* Background ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 relative z-10"
          >
            {activeTab === 'dashboard' && <Dashboard platforms={platforms} />}
            {activeTab === 'profile' && <ProfileSettings profile={profile} setProfile={setProfile} platforms={platforms} setPlatforms={setPlatforms} />}
            {activeTab === 'optimizer' && <BioOptimizer profile={profile} setProfile={setProfile} />}
            {activeTab === 'upload' && <UploadHub platforms={platforms} />}
            {activeTab === 'brand' && <BrandAssets appLogo={appLogo} setAppLogo={setAppLogo} />}
          </motion.div>
        </AnimatePresence>
        
        <footer className="mt-12 pt-6 border-t border-white/10 text-center text-sm text-zinc-500 relative z-10">
          Stock Creator Club By Lorenzo Vlaeminck
        </footer>
      </main>
    </div>
  );
}
