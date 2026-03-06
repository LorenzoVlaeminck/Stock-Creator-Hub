import React, { useState } from 'react';
import { Sparkles, Loader2, Copy, Check, Wand2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

export function BioOptimizer({ profile, setProfile }: { profile: any, setProfile: any }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBio, setGeneratedBio] = useState('');
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setApplied(false);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `
        You are an expert copywriter and marketer. 
        I am a stock creator (photographer/videographer/artist).
        
        Here is my current basic bio: "${profile.bio}"
        Here is my lead magnet title: "${profile.leadMagnetTitle}"
        Here is my lead magnet URL: "${profile.leadMagnetUrl}"
        
        Please rewrite my bio to be highly engaging, professional, and optimized to drive clicks to my lead magnet. 
        It should be concise (under 300 characters if possible, suitable for stock platforms like Shutterstock or Adobe Stock).
        Include a clear call-to-action (CTA) pointing to the lead magnet URL.
        
        Return ONLY the rewritten bio text, no extra commentary.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
      });

      setGeneratedBio(response.text?.trim() || '');
    } catch (error) {
      console.error("Error generating bio:", error);
      setGeneratedBio("Failed to generate bio. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (generatedBio) {
      setProfile((prev: any) => ({ ...prev, bio: generatedBio }));
      setApplied(true);
      setTimeout(() => setApplied(false), 3000);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedBio);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          AI Bio Optimizer <Wand2 className="w-6 h-6 text-fuchsia-400" />
        </h2>
        <p className="text-zinc-400 mt-1">Transform your basic bio into a high-converting lead generation tool.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-zinc-900/50 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">Current Input</h3>
            
            <div className="space-y-4">
              <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                <p className="text-xs font-medium text-zinc-500 uppercase mb-2">Bio</p>
                <p className="text-zinc-200 text-sm leading-relaxed">{profile.bio || "No bio set."}</p>
              </div>
              <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                <p className="text-xs font-medium text-zinc-500 uppercase mb-2">Lead Magnet</p>
                <p className="text-zinc-200 font-medium">{profile.leadMagnetTitle}</p>
                <p className="text-violet-400 text-sm mt-1">{profile.leadMagnetUrl}</p>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-medium hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] disabled:opacity-50 disabled:shadow-none"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {isGenerating ? 'Optimizing with AI...' : 'Generate Optimized Bio'}
            </button>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 text-white shadow-2xl border border-white/10 flex flex-col relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4 relative z-10">Optimized Result</h3>
          
          <div className="flex-1 relative z-10 flex flex-col">
            {generatedBio ? (
              <div className="space-y-6 flex-1 flex flex-col">
                <div className="flex-1 bg-white/5 p-5 rounded-xl border border-white/10 relative">
                  <Sparkles className="absolute top-3 right-3 w-4 h-4 text-fuchsia-400 opacity-50" />
                  <p className="text-lg leading-relaxed text-zinc-100 font-serif italic">
                    "{generatedBio}"
                  </p>
                </div>
                
                <div className="flex items-center gap-3 pt-2">
                  <button 
                    onClick={handleApply}
                    className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      applied 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-white text-black hover:bg-zinc-200'
                    }`}
                  >
                    {applied ? <><Check className="w-4 h-4" /> Applied to Profile</> : 'Apply to Profile'}
                  </button>
                  <button 
                    onClick={handleCopy}
                    className="px-4 py-3 bg-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/20 transition-colors flex items-center justify-center border border-white/10"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                  <Sparkles className="w-8 h-8 text-zinc-600" />
                </div>
                <p className="text-center max-w-xs text-sm">Click generate to create an AI-optimized bio designed to drive clicks to your lead magnet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
