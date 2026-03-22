import React, { useState } from 'react';
import { Sparkles, Loader2, Image as ImageIcon, Check, Palette } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

export function BrandAssets({ appLogo, setAppLogo }: { appLogo: string | null, setAppLogo: (logo: string) => void }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLogo, setGeneratedLogo] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('A professional, modern, minimalist logo for a platform called "Stock Creator Hub". The logo should reflect photography, videography, and stock content creation. Clean lines, dark background, neon violet and fuchsia accents.');
  const [applied, setApplied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setApplied(false);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }]
        }
      });

      let imageUrl = null;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageUrl) {
        setGeneratedLogo(imageUrl);
      }
    } catch (error) {
      console.error("Error generating logo:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (generatedLogo) {
      setAppLogo(generatedLogo);
      setApplied(true);
      setTimeout(() => setApplied(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          Brand Assets <Palette className="w-6 h-6 text-fuchsia-400" />
        </h2>
        <p className="text-zinc-400 mt-1">Generate and manage your custom AI logo for the Stock Creator Hub.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-zinc-900/50 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">Logo Generator</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Image Prompt</label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all resize-none text-zinc-200 placeholder-zinc-600 text-sm leading-relaxed"
                />
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-medium hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] disabled:opacity-50 disabled:shadow-none"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {isGenerating ? 'Generating Logo...' : 'Generate Logo'}
            </button>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 text-white shadow-2xl border border-white/10 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4 relative z-10">Generated Logo</h3>
          
          <div className="flex-1 relative z-10 flex flex-col">
            {generatedLogo ? (
              <div className="space-y-6 flex-1 flex flex-col items-center justify-center">
                <div className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/50 p-2">
                  <img src={generatedLogo} alt="Generated Logo" className="w-64 h-64 object-cover rounded-xl" />
                </div>
                
                <div className="w-full flex items-center gap-3 pt-2">
                  <button 
                    onClick={handleApply}
                    className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      applied 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-white text-black hover:bg-zinc-200'
                    }`}
                  >
                    {applied ? <><Check className="w-4 h-4" /> Applied to App</> : 'Apply as App Logo'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4 py-12">
                <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-2 shadow-inner">
                  <ImageIcon className="w-10 h-10 text-zinc-600" />
                </div>
                <p className="text-center max-w-xs text-sm">Click generate to create a custom AI logo for your Stock Creator Hub.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
