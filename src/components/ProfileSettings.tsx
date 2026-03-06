import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

export function ProfileSettings({ profile, setProfile, platforms, setPlatforms }: { profile: any, setProfile: any, platforms: any[], setPlatforms: any }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev: any) => ({ ...prev, [name]: value }));
  };

  const togglePlatform = (id: string) => {
    setPlatforms((prev: any[]) => prev.map(p => p.id === id ? { ...p, connected: !p.connected } : p));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setProfile((prev: any) => ({ ...prev, profilePicture: url }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Profile & Platforms</h2>
        <p className="text-zinc-400 mt-1">Manage your centralized bio and connect your stock accounts.</p>
      </div>

      <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-white/10">
          <h3 className="text-lg font-medium text-white">Global Profile</h3>
          <p className="text-sm text-zinc-400">This information will be synced across all connected platforms.</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <img src={profile.profilePicture} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-white/10 group-hover:border-violet-500/50 transition-colors" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-6 h-6 text-white" />
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-colors">
              Change Picture
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Display Name</label>
              <input 
                type="text" 
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all text-white placeholder-zinc-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Current Bio</label>
              <textarea 
                name="bio"
                value={profile.bio}
                onChange={handleProfileChange}
                rows={4}
                className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all resize-none text-white placeholder-zinc-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Lead Magnet Title</label>
                <input 
                  type="text" 
                  name="leadMagnetTitle"
                  value={profile.leadMagnetTitle}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all text-white placeholder-zinc-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Lead Magnet URL</label>
                <input 
                  type="url" 
                  name="leadMagnetUrl"
                  value={profile.leadMagnetUrl}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all text-white placeholder-zinc-600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-white/10">
          <h3 className="text-lg font-medium text-white">Platform Integrations</h3>
          <p className="text-sm text-zinc-400">Connect your accounts to enable direct uploads and bio syncing.</p>
        </div>
        <div className="divide-y divide-white/5">
          {platforms.map(platform => (
            <div key={platform.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
              <div>
                <p className="font-medium text-zinc-100">{platform.name}</p>
                <p className="text-sm text-zinc-500">
                  {platform.connected ? 'Connected via OAuth' : 'Requires authentication'}
                </p>
              </div>
              <button 
                onClick={() => togglePlatform(platform.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  platform.connected 
                    ? 'bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10' 
                    : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500 shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                }`}
              >
                {platform.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
