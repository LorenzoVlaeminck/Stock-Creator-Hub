import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { BioOptimizer } from './components/BioOptimizer';
import { UploadHub } from './components/UploadHub';
import { ProfileSettings } from './components/ProfileSettings';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Shared state for the user's profile
  const [profile, setProfile] = useState({
    name: 'Lorenzo Vlaeminck',
    bio: 'I am a passionate creator capturing the beauty of nature and urban landscapes. My work focuses on light, shadow, and the fleeting moments of everyday life.',
    profilePicture: 'https://picsum.photos/seed/lorenzo/200/200',
    leadMagnetUrl: 'https://example.com/free-presets',
    leadMagnetTitle: 'Free Lightroom Presets'
  });

  // Connected platforms
  const [platforms, setPlatforms] = useState([
    { id: 'shutterstock', name: 'Shutterstock', connected: true, icon: 'Camera' },
    { id: 'adobestock', name: 'Adobe Stock', connected: false, icon: 'Image' },
    { id: 'getty', name: 'Getty Images', connected: true, icon: 'Aperture' },
    { id: 'unsplash', name: 'Unsplash', connected: false, icon: 'ImagePlus' },
  ]);

  return (
    <div className="flex h-screen bg-[#09090B] text-zinc-100 font-sans selection:bg-violet-500/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} profile={profile} />
      <main className="flex-1 overflow-y-auto p-8 flex flex-col relative">
        {/* Background ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="flex-1 relative z-10">
          {activeTab === 'dashboard' && <Dashboard platforms={platforms} />}
          {activeTab === 'profile' && <ProfileSettings profile={profile} setProfile={setProfile} platforms={platforms} setPlatforms={setPlatforms} />}
          {activeTab === 'optimizer' && <BioOptimizer profile={profile} setProfile={setProfile} />}
          {activeTab === 'upload' && <UploadHub platforms={platforms} />}
        </div>
        
        <footer className="mt-12 pt-6 border-t border-white/10 text-center text-sm text-zinc-500 relative z-10">
          Stock Creator Club By Lorenzo Vlaeminck
        </footer>
      </main>
    </div>
  );
}
