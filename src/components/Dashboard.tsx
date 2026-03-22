import React from 'react';
import { Camera, Image, Aperture, ImagePlus, CheckCircle2, XCircle, TrendingUp, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const iconMap: Record<string, React.ElementType> = {
  Camera, Image, Aperture, ImagePlus
};

const data = [
  { name: 'Mon', uploads: 40, clicks: 24 },
  { name: 'Tue', uploads: 30, clicks: 13 },
  { name: 'Wed', uploads: 20, clicks: 98 },
  { name: 'Thu', uploads: 27, clicks: 39 },
  { name: 'Fri', uploads: 18, clicks: 48 },
  { name: 'Sat', uploads: 23, clicks: 38 },
  { name: 'Sun', uploads: 34, clicks: 43 },
];

export function Dashboard({ platforms }: { platforms: any[] }) {
  const connectedCount = platforms.filter(p => p.connected).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
        <p className="text-zinc-400 mt-1">Overview of your stock platform integrations and performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/50 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Aperture className="w-24 h-24" />
          </div>
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider relative z-10">Connected Platforms</h3>
          <div className="mt-2 flex items-baseline gap-2 relative z-10">
            <p className="text-4xl font-light text-white">{connectedCount}</p>
            <p className="text-lg text-zinc-600">/ {platforms.length}</p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-sm text-emerald-400 font-medium relative z-10">
            <CheckCircle2 className="w-4 h-4" /> All systems operational
          </div>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ImagePlus className="w-24 h-24" />
          </div>
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider relative z-10">Total Uploads</h3>
          <div className="mt-2 flex items-baseline gap-2 relative z-10">
            <p className="text-4xl font-light text-white">1,284</p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-sm text-emerald-400 font-medium relative z-10">
            <TrendingUp className="w-4 h-4" /> +12% this week
          </div>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ArrowUpRight className="w-24 h-24" />
          </div>
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider relative z-10">Lead Magnet Clicks</h3>
          <div className="mt-2 flex items-baseline gap-2 relative z-10">
            <p className="text-4xl font-light text-white">342</p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-sm text-emerald-400 font-medium relative z-10">
            <TrendingUp className="w-4 h-4" /> +24% this week
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-white">Performance Overview</h3>
              <p className="text-sm text-zinc-400">Uploads vs. Lead Magnet Clicks (Last 7 Days)</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-violet-500"></div>
                <span className="text-zinc-300">Uploads</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-fuchsia-500"></div>
                <span className="text-zinc-300">Clicks</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUploads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="uploads" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorUploads)" />
                <Area type="monotone" dataKey="clicks" stroke="#d946ef" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-white/10">
            <h3 className="text-lg font-medium text-white">Platform Status</h3>
          </div>
          <div className="divide-y divide-white/5 flex-1 overflow-y-auto">
            {platforms.map(platform => {
              const Icon = iconMap[platform.icon];
              return (
                <div key={platform.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl border ${platform.connected ? 'bg-violet-500/20 border-violet-500/30 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.2)]' : 'bg-zinc-800/50 border-white/5 text-zinc-500'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-100 text-sm">{platform.name}</p>
                      <p className="text-xs text-zinc-500">{platform.connected ? 'Connected & Syncing' : 'Not Connected'}</p>
                    </div>
                  </div>
                  <div>
                    {platform.connected ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium bg-zinc-800 text-zinc-400 border border-white/5 uppercase tracking-wider">
                        <XCircle className="w-3 h-3" /> Offline
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
