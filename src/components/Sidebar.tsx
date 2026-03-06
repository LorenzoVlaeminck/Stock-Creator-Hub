import React from 'react';
import { LayoutDashboard, UserCircle, Sparkles, UploadCloud } from 'lucide-react';

export function Sidebar({ activeTab, setActiveTab, profile }: { activeTab: string, setActiveTab: (tab: string) => void, profile: any }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile & Platforms', icon: UserCircle },
    { id: 'optimizer', label: 'Bio Optimizer', icon: Sparkles },
    { id: 'upload', label: 'Upload Hub', icon: UploadCloud },
  ];

  return (
    <div className="w-64 bg-[#09090B] border-r border-white/10 flex flex-col h-full relative z-20">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-400" />
          Creator Hub
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-violet-500/15 text-violet-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' 
                  : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-violet-400' : 'text-zinc-500'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2">
          <img src={profile.profilePicture} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-white/20" referrerPolicy="no-referrer" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-100 truncate">{profile.name}</p>
            <p className="text-xs text-violet-400 truncate">Pro Creator</p>
          </div>
        </div>
      </div>
    </div>
  );
}
