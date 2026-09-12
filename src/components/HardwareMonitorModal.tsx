import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Monitor, 
  Zap, 
  Wifi, 
  HardDrive, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  Sliders, 
  X,
  RefreshCw,
  Gauge
} from 'lucide-react';
import { DeviceInfo } from '../types/game';
import { soundEngine } from '../utils/audio';

interface HardwareMonitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  deviceInfo: DeviceInfo | null;
  onUpdateSettings: (quality: 'ultra' | 'high' | 'medium' | 'low', targetFPS: number) => void;
  onRunAutoOptimize: () => void;
}

export const HardwareMonitorModal: React.FC<HardwareMonitorModalProps> = ({
  isOpen,
  onClose,
  deviceInfo,
  onUpdateSettings,
  onRunAutoOptimize
}) => {
  const [selectedQuality, setSelectedQuality] = useState<'ultra' | 'high' | 'medium' | 'low'>(
    deviceInfo?.graphicsQuality || 'high'
  );
  const [selectedFPS, setSelectedFPS] = useState<number>(deviceInfo?.targetFPS || 144);
  const [isOptimizing, setIsOptimizing] = useState(false);

  if (!isOpen || !deviceInfo) return null;

  const handleApply = () => {
    soundEngine.playSkillActivation();
    onUpdateSettings(selectedQuality, selectedFPS);
    onClose();
  };

  const handleAutoTune = () => {
    soundEngine.playGreatSageChime();
    setIsOptimizing(true);
    setTimeout(() => {
      onRunAutoOptimize();
      setIsOptimizing(false);
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl select-none">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border-2 border-cyan-500/50 rounded-3xl p-6 shadow-2xl shadow-cyan-950/80 text-slate-100 ring-2 ring-cyan-400/20"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-cyan-500/30 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
                <Cpu className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-['Orbitron'] text-white">
                  DEVICE DETECTION & HARDWARE MONITOR
                </h2>
                <p className="text-xs text-cyan-300 font-mono">
                  Universal Cross-Device Engine • 60 FPS to 320 FPS Support
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Live Performance HUD Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 font-mono text-center">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-cyan-500/30">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block">CURRENT FPS</span>
              <span className="text-2xl font-bold text-emerald-400">{deviceInfo.currentFPS}</span>
              <span className="text-[10px] text-slate-500 block">Smooth Frame Lock</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-cyan-500/30">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block">FRAME TIME</span>
              <span className="text-2xl font-bold text-cyan-300">{deviceInfo.frameTimeMs} ms</span>
              <span className="text-[10px] text-slate-500 block">Ultra Low Latency</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-cyan-500/30">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block">CPU CORES</span>
              <span className="text-2xl font-bold text-amber-300">{deviceInfo.cpuCores} Cores</span>
              <span className="text-[10px] text-slate-500 block">Multithreaded</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-cyan-500/30">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block">EST. RAM</span>
              <span className="text-2xl font-bold text-purple-300">{deviceInfo.deviceMemory} GB+</span>
              <span className="text-[10px] text-slate-500 block">VRAM Accelerated</span>
            </div>
          </div>

          {/* Full Device Specs Detailed List */}
          <div className="space-y-3 mb-6 bg-slate-950/90 rounded-2xl p-4 border border-slate-800 text-xs font-mono">
            <div className="text-xs font-bold text-cyan-300 border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>DETECTED SYSTEM HARDWARE ARCHITECTURE</span>
              <span className="text-emerald-400 font-normal">● UNREAL TENSURA ENGINE V2.5 READY</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 pt-1 text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-500">GPU Renderer:</span>
                <span className="text-white font-semibold truncate max-w-[200px]" title={deviceInfo.gpuRenderer}>
                  {deviceInfo.gpuRenderer}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-500">GPU Vendor:</span>
                <span className="text-white font-semibold">{deviceInfo.gpuVendor}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-500">Client / Network IP:</span>
                <span className="text-cyan-400 font-semibold">{deviceInfo.ip}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-500">Device Platform OS:</span>
                <span className="text-white font-semibold">{deviceInfo.platform}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-500">Display Resolution:</span>
                <span className="text-white font-semibold">{deviceInfo.screenResolution} (@{deviceInfo.pixelRatio}x)</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-500">WebGL 2.0 / Max Texture:</span>
                <span className="text-emerald-400 font-semibold">
                  {deviceInfo.webgl2Supported ? 'Supported' : 'WebGL 1.0'} ({deviceInfo.maxTextureSize}px)
                </span>
              </div>
            </div>
          </div>

          {/* Target FPS Support Engine Selector */}
          <div className="mb-6">
            <label className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider block mb-2">
              TARGET REFRESH RATE & FPS ENGINE LIMITER (UP TO 320 FPS)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[60, 120, 144, 240, 320].map((fps) => (
                <button
                  key={fps}
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedFPS(fps);
                  }}
                  className={`p-3 rounded-xl border text-center font-mono transition-all ${
                    selectedFPS === fps
                      ? 'bg-gradient-to-tr from-amber-600 to-yellow-500 text-slate-950 font-black border-amber-300 shadow-lg shadow-amber-500/40 scale-105'
                      : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-amber-500/40'
                  }`}
                >
                  <span className="text-sm sm:text-base font-bold block">{fps}</span>
                  <span className="text-[9px] uppercase opacity-75">FPS</span>
                </button>
              ))}
            </div>
          </div>

          {/* Graphics Quality Preset Selector */}
          <div className="mb-6">
            <label className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider block mb-2">
              UNREAL MESH & SHADOWS GRAPHICS QUALITY PRESET
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'ultra', label: 'ULTRA', desc: 'Dynamic Mesh Shadows & Magic VFX' },
                { id: 'high', label: 'HIGH', desc: 'Specular Highlights & Soft Glow' },
                { id: 'medium', label: 'MEDIUM', desc: 'Balanced 120+ FPS Output' },
                { id: 'low', label: 'LOW / POTATO', desc: 'Maximum Battery / Low-End' }
              ].map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedQuality(preset.id as any);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedQuality === preset.id
                      ? 'bg-gradient-to-b from-cyan-950 to-blue-950 text-cyan-200 border-cyan-400 ring-2 ring-cyan-400/30'
                      : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:border-cyan-500/40'
                  }`}
                >
                  <span className="text-xs font-bold font-mono text-white block">{preset.label}</span>
                  <span className="text-[10px] text-slate-400 block mt-1 leading-tight">{preset.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={handleAutoTune}
              disabled={isOptimizing}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 text-xs font-bold font-mono transition shadow disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-amber-400 ${isOptimizing ? 'animate-spin' : ''}`} />
              <span>{isOptimizing ? 'Auto-Detecting Optimal Specs...' : 'Auto-Optimize for My Device'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onClose();
                }}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold font-mono transition"
              >
                Cancel
              </button>

              <button
                onClick={handleApply}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-black font-mono transition shadow-lg shadow-cyan-500/40 hover:scale-105"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>APPLY GRAPHICS & FPS</span>
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
