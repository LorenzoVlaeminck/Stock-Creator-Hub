import React from 'react';
import { Camera, Image, Aperture, ImagePlus, CheckCircle2, XCircle } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Camera, Image, Aperture, ImagePlus
};

export function Dashboard({ platforms }: { platforms: any[] }) {
  const connectedCount = platforms.filter(p => p.connected).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
        <p className="text-zinc-400 mt-1">Overview of your stock platform integrations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/50 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl">
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Connected Platforms</h3>
          <p className="text-4xl font-light mt-2 text-white">{connectedCount} <span className="text-lg text-zinc-600">/ {platforms.length}</span></p>
        </div>
        <div className="bg-zinc-900/50 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl">
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Total Uploads</h3>
          <p className="text-4xl font-light mt-2 text-white">1,284</p>
        </div>
        <div className="bg-zinc-900/50 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl">
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Lead Magnet Clicks</h3>
          <p className="text-4xl font-light mt-2 text-white">342</p>
        </div>
      </div>

      <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-white/10">
          <h3 className="text-lg font-medium text-white">Platform Status</h3>
        </div>
        <div className="divide-y divide-white/5">
          {platforms.map(platform => {
            const Icon = iconMap[platform.icon];
            return (
              <div key={platform.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl border ${platform.connected ? 'bg-violet-500/20 border-violet-500/30 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.2)]' : 'bg-zinc-800/50 border-white/5 text-zinc-500'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium text-zinc-100">{platform.name}</p>
                    <p className="text-sm text-zinc-500">{platform.connected ? 'Connected & Syncing' : 'Not Connected'}</p>
                  </div>
                </div>
                <div>
                  {platform.connected ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400 border border-white/5">
                      <XCircle className="w-3.5 h-3.5" /> Disconnected
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
