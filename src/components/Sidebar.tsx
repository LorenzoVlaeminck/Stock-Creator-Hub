import React from 'react';
import { LayoutDashboard, UserCircle, Sparkles, UploadCloud, Palette, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

export function Sidebar({ activeTab, setActiveTab, profile, appLogo, onLogout }: { activeTab: string, setActiveTab: (tab: string) => void, profile: any, appLogo: string | null, onLogout: () => void }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile & Platforms', icon: UserCircle },
    { id: 'optimizer', label: 'Bio Optimizer', icon: Sparkles },
    { id: 'upload', label: 'Upload Hub', icon: UploadCloud },
    { id: 'brand', label: 'Brand Assets', icon: Palette },
  ];

  return (
    <div className="w-64 bg-[#09090B] border-r border-white/10 flex flex-col h-full relative z-20">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          {appLogo ? (
            <img src={appLogo} alt="Logo" className="w-6 h-6 rounded-md object-cover" />
          ) : (
            <Sparkles className="w-5 h-5 text-violet-400" />
          )}
          Creator Hub
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative ${
                isActive ? 'text-violet-300' : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-violet-500/15 rounded-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] border border-violet-500/20"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-violet-400' : 'text-zinc-500'}`} />
                {item.label}
              </span>
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
          <button onClick={onLogout} className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Log out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
