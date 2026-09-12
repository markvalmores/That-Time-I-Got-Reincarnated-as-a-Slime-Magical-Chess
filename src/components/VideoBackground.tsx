import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Music,
  Move, 
  Sliders, 
  Sun,
  Tv,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { VideoSettings, VideoFitMode } from '../types/game';
import { soundEngine } from '../utils/audio';

interface VideoBackgroundProps {
  settings: VideoSettings;
  onUpdateSettings: (newSettings: Partial<VideoSettings>) => void;
  isHomeMenu?: boolean;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  settings,
  onUpdateSettings,
  isHomeMenu = false
}) => {
  const [showControls, setShowControls] = useState(false);
  const [isEyeOpen, setIsEyeOpen] = useState(false);
  const videoId = 'zvIS6EIkXx8';

  const zoomLevels = [0.8, 1.0, 1.25, 1.5, 2.0, 2.5];
  const opacityLevels = [0.25, 0.5, 0.75, 0.95];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (settings.showVideo) {
      // Fallback: Open the eye after 1 second even if events don't fire
      // (sometimes browsers block unmuted autoplay, preventing onPlay)
      timer = setTimeout(() => {
        setIsEyeOpen(true);
      }, 1000);
    } else {
      setIsEyeOpen(false);
    }
    return () => clearTimeout(timer);
  }, [settings.showVideo]);

  const handleZoomChange = (newZoom: number) => {
    soundEngine.playClick();
    onUpdateSettings({ zoom: newZoom });
  };

  const handleOpacityChange = (newOpacity: number) => {
    soundEngine.playClick();
    onUpdateSettings({ opacity: newOpacity });
  };

  const handleFitModeChange = (mode: VideoFitMode) => {
    soundEngine.playClick();
    onUpdateSettings({ fitMode: mode });
  };

  const handleToggleMusic = () => {
    soundEngine.playClick();
    onUpdateSettings({ isMuted: !settings.isMuted });
  };

  const handleReset = () => {
    soundEngine.playClick();
    onUpdateSettings({
      zoom: isHomeMenu ? 1.5 : 1.2,
      opacity: isHomeMenu ? 0.85 : 0.45,
      fitMode: 'cover',
      panX: 0,
      panY: 0,
      isMuted: false // Default Auto ON
    });
  };

  const isMusicOn = !settings.isMuted;

  // We no longer strictly require playing/ready to show, 
  // as isEyeOpen is also driven by a timeout fallback
  const isVideoVisible = isEyeOpen;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none bg-slate-950">
      
      {/* 1. Main YouTube Video Player Container */}
      <AnimatePresence>
        {settings.showVideo && (
          <motion.div 
            className="absolute inset-0 z-0 flex items-center justify-center bg-slate-950"
            initial={{ clipPath: 'ellipse(0% 0% at 50% 50%)', opacity: 0 }}
            animate={{ 
              clipPath: isVideoVisible ? 'ellipse(150% 150% at 50% 50%)' : 'ellipse(0% 0% at 50% 50%)',
              opacity: isVideoVisible ? 1 : 0
            }}
            transition={{ 
              duration: 2.0, 
              ease: [0.7, 0, 0.3, 1], // cinematic ease in out
              opacity: { duration: 1.0 }
            }}
          >
            <div 
              className="relative w-full h-full overflow-hidden transition-transform duration-300 ease-out"
              style={{
                transform: `scale(${settings.zoom}) translate(${settings.panX}px, ${settings.panY}px)`
              }}
            >
              <iframe
                className={`
                  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none filter contrast-115 brightness-90
                  ${settings.fitMode === 'cover' ? 'w-[180vw] h-[180vh] min-w-[100vw] min-h-[100vh] object-cover' : ''}
                  ${settings.fitMode === 'fit' ? 'w-[100vw] h-[100vh] object-contain' : ''}
                  ${settings.fitMode === 'fill' ? 'w-full h-full object-fill' : ''}
                  ${settings.fitMode === 'pan' ? 'w-[220vw] h-[220vh] object-cover' : ''}
                `}
                style={{
                  opacity: settings.opacity,
                  transition: 'opacity 0.4s ease-in-out'
                }}
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=${settings.isMuted ? 1 : 0}&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1&playsinline=1`}
                title="Tensura Background Theme Anime Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />

              {/* Gradient Shading - Softens when opacity is high so video shines through brightly */}
              <div 
                className="absolute inset-0 bg-radial from-transparent via-slate-950/40 to-slate-950 transition-opacity"
                style={{ opacity: Math.max(0.15, 1 - settings.opacity) }}
              />
              <div 
                className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-cyan-950/30 transition-opacity"
                style={{ opacity: Math.max(0.2, 1 - settings.opacity * 0.7) }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fallback Ambient Canvas Grid while loading or hidden */}
      <AnimatePresence>
        {(!settings.showVideo || !isVideoVisible) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0 }}
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/40 via-slate-950 to-slate-950 -z-10"
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d40a_1px,transparent_1px),linear-gradient(to_bottom,#06b6d40a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Floating On-Screen Video Zoom & Clarity Floating Toolbar (Interactive) */}
      <div className="absolute bottom-16 right-4 sm:bottom-4 sm:right-4 z-40 pointer-events-auto flex flex-col items-end gap-2">
        
        {/* Expanded Zoom & Clarity Panel */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="p-3.5 rounded-2xl bg-slate-900/95 border-2 border-cyan-400/80 shadow-2xl shadow-cyan-950/90 backdrop-blur-2xl text-slate-100 font-mono text-xs w-72 space-y-3 ring-2 ring-cyan-500/30"
            >
              <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
                <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                  <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>VIDEO & MUSIC SETTINGS</span>
                </div>
                <button
                  onClick={handleReset}
                  className="text-[10px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition"
                  title="Reset to default settings (Auto ON)"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset (Auto ON)</span>
                </button>
              </div>

              {/* Background Video Music Toggle Card */}
              <div className="p-2 rounded-xl bg-slate-950/80 border border-cyan-500/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isMusicOn ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-200">Video Music</div>
                    <div className="text-[9px] text-cyan-400/80">Default: Auto ON</div>
                  </div>
                </div>

                <button
                  onClick={handleToggleMusic}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    isMusicOn
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {isMusicOn ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>ON</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>OFF</span>
                    </>
                  )}
                </button>
              </div>

              {/* Zoom Presets */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                  Zoom Level ({settings.zoom}x)
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {zoomLevels.map((z) => (
                    <button
                      key={z}
                      onClick={() => handleZoomChange(z)}
                      className={`px-2 py-1 rounded-lg border text-center transition ${
                        settings.zoom === z
                          ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-300 shadow'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-cyan-500/50'
                      }`}
                    >
                      {z}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Video Brightness / Clarity / Opacity */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                  Video Clarity / Opacity ({Math.round(settings.opacity * 100)}%)
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {opacityLevels.map((op) => (
                    <button
                      key={op}
                      onClick={() => handleOpacityChange(op)}
                      className={`px-1.5 py-1 rounded-lg border text-center transition ${
                        settings.opacity === op
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-300 shadow'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-amber-500/50'
                      }`}
                    >
                      {Math.round(op * 100)}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Portrait vs Landscape Fit Modes */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                  Screen Aspect Fit (Phone Vertical / Horizontal)
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(['cover', 'fit', 'pan'] as VideoFitMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => handleFitModeChange(mode)}
                      className={`px-1.5 py-1 rounded-lg border text-center uppercase text-[10px] transition ${
                        settings.fitMode === mode
                          ? 'bg-purple-600 text-white font-bold border-purple-400 shadow'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-purple-500/50'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Quick Action Trigger Pill */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/90 border border-cyan-500/50 shadow-2xl backdrop-blur-xl ring-2 ring-cyan-400/20">
          
          {/* Background Video Music Quick Toggle Button */}
          <button
            onClick={handleToggleMusic}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs font-bold transition ${
              isMusicOn 
                ? 'bg-gradient-to-r from-cyan-950 to-blue-950 text-cyan-300 border-cyan-400 shadow-md shadow-cyan-500/30' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title={`Background Video Music is currently ${isMusicOn ? 'ON (Auto)' : 'OFF'}. Click to toggle.`}
          >
            {isMusicOn ? (
              <>
                <Music className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
                <span>MUSIC ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span>MUSIC OFF</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onUpdateSettings({ showVideo: !settings.showVideo });
            }}
            className={`p-2 rounded-xl border transition ${settings.showVideo ? 'bg-cyan-950/90 text-cyan-300 border-cyan-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'}`}
            title="Toggle Video Visibility"
          >
            <Tv className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              setShowControls(!showControls);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition border ${
              showControls
                ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-lg shadow-cyan-500/40'
                : 'bg-slate-900 text-cyan-300 border-cyan-500/30 hover:bg-slate-800'
            }`}
            title="Open Video Zoom, Aspect & Music Options"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Zoom Video</span>
          </button>
        </div>

      </div>

    </div>
  );
};
