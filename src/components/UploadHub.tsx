import React, { useState, useRef } from 'react';
import { UploadCloud, X, CheckCircle2, Image as ImageIcon } from 'lucide-react';

export function UploadHub({ platforms }: { platforms: any[] }) {
  const [files, setFiles] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const connectedPlatforms = platforms.filter(p => p.connected);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
    setFiles(prev => [...prev, ...imageFiles.map(f => ({
      file: f,
      id: Math.random().toString(36).substring(7),
      preview: URL.createObjectURL(f)
    }))]);
    setUploadComplete(false);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleUpload = () => {
    if (files.length === 0 || connectedPlatforms.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    // Simulate upload process
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploadComplete(true);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const resetUpload = () => {
    setFiles([]);
    setUploadComplete(false);
    setUploadProgress(0);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Upload Hub</h2>
        <p className="text-zinc-400 mt-1">Upload your stock assets to all connected platforms simultaneously.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Dropzone */}
          <div 
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer relative overflow-hidden ${
              isDragging 
                ? 'border-violet-500 bg-violet-500/10' 
                : 'border-white/20 bg-zinc-900/50 hover:border-violet-500/50 hover:bg-white/5'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {isDragging && <div className="absolute inset-0 bg-violet-500/5 blur-xl"></div>}
            
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileInput}
            />
            <div className="w-16 h-16 bg-white/5 border border-white/10 text-violet-400 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1 relative z-10">Click or drag files to upload</h3>
            <p className="text-zinc-500 text-sm relative z-10">Supports JPG, PNG, RAW up to 50MB</p>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-medium text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-zinc-400" />
                  Selected Files ({files.length})
                </h3>
                <button onClick={resetUpload} className="text-sm text-zinc-400 font-medium hover:text-white transition-colors">
                  Clear All
                </button>
              </div>
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                {files.map(fileObj => (
                  <div key={fileObj.id} className="relative group rounded-xl overflow-hidden border border-white/10 aspect-square bg-black/50">
                    <img src={fileObj.preview} alt="preview" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                    {!uploading && !uploadComplete && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeFile(fileObj.id); }}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/80"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    {uploadComplete && (
                      <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="bg-emerald-500 text-white rounded-full p-1 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6">
            <h3 className="font-medium text-white mb-4">Target Platforms</h3>
            
            {connectedPlatforms.length === 0 ? (
              <div className="text-sm text-amber-400 bg-amber-500/10 p-4 rounded-xl border border-amber-500/20">
                No platforms connected. Please connect platforms in your Profile settings first.
              </div>
            ) : (
              <div className="space-y-3">
                {connectedPlatforms.map(platform => (
                  <div key={platform.id} className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02]">
                    <CheckCircle2 className="w-5 h-5 text-violet-400" />
                    <span className="font-medium text-zinc-300">{platform.name}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-white/10">
              {uploading ? (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-zinc-300">Uploading...</span>
                    <span className="text-violet-400">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/10">
                    <div 
                      className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(139,92,246,0.5)]" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              ) : uploadComplete ? (
                <div className="bg-emerald-500/10 text-emerald-400 p-5 rounded-xl border border-emerald-500/20 text-center">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <p className="font-medium text-emerald-300">Upload Complete!</p>
                  <p className="text-sm mt-1 opacity-80 text-emerald-400/80">Successfully sent to {connectedPlatforms.length} platforms.</p>
                </div>
              ) : (
                <button 
                  onClick={handleUpload}
                  disabled={files.length === 0 || connectedPlatforms.length === 0}
                  className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-medium hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  Upload to {connectedPlatforms.length} Platforms
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
