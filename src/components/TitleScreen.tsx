import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Crown, 
  Sparkles, 
  Cpu, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Tv, 
  Flame, 
  ShieldCheck, 
  Zap,
  Swords,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { GameMode, AIDifficulty, DeviceInfo } from '../types/game';
import { soundEngine } from '../utils/audio';

interface TitleScreenProps {
  onStartGame: (mode: GameMode, difficulty: AIDifficulty) => void;
  onOpenSetup: (mode: GameMode) => void;
  onOpenEncyclopedia: () => void;
  onOpenHardware: () => void;
  deviceInfo: DeviceInfo | null;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onOpenSetup,
  onOpenEncyclopedia,
  onOpenHardware,
  deviceInfo
}) => {
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [showVideo, setShowVideo] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Video ID from user prompt: https://youtu.be/zvIS6EIkXx8?si=0Ai4iC8mfOUFLJin
  const videoId = 'zvIS6EIkXx8';

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between p-4 md:p-8 overflow-hidden bg-slate-950 text-slate-100 select-none">
      
      {/* Background Video Layer & Fallback Ambient Canvas */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {showVideo ? (
          <div className="relative w-full h-full">
            <iframe
              className="absolute top-1/2 left-1/2 w-[160vw] h-[160vh] -translate-x-1/2 -translate-y-1/2 opacity-35 object-cover pointer-events-auto filter contrast-125 brightness-75"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=${isVideoMuted ? 1 : 0}&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1`}
              title="Tensura Background Theme Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              onLoad={() => setVideoLoaded(true)}
            />
            {/* Unreal Engine Gradient Shading & Vignette Layer */}
            <div className="absolute inset-0 bg-radial from-transparent via-slate-950/80 to-slate-950" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-cyan-950/40" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/30 via-slate-950 to-slate-950">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d40a_1px,transparent_1px),linear-gradient(to_bottom,#06b6d40a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
          </div>
        )}

        {/* Floating Magicule Particle Motifs */}
        <div className="absolute top-1/4 left-1/5 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/6 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Top Header Bar: Hardware HUD & Brand Tribute */}
      <header className="relative z-10 w-full max-w-7xl flex flex-wrap items-center justify-between gap-4 py-2 border-b border-cyan-500/20 backdrop-blur-md bg-slate-900/40 px-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 ring-1 ring-cyan-400/50">
            <span className="text-xl">💧</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                UNREAL TENSURA ENGINE
              </span>
              <span className="text-xs font-mono text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30">
                BANDAI NAMCO CHARACTERS
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium tracking-wide">
              Created by Fan <strong className="text-cyan-300">Eleventh Gyuuun / Seven Eleventh / Usagyuun VTuber</strong> & <strong className="text-amber-300">Mark David V. Valmores</strong>
            </p>
          </div>
        </div>

        {/* Device Performance Ribbon */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenHardware();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 transition shadow-inner group"
            title="Inspect Full Device Specifications & Hardware Monitor"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-45 transition-transform" />
            <span>GPU: {deviceInfo?.gpuRenderer?.slice(0, 18) || 'Detecting...'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-400 font-bold">{deviceInfo?.targetFPS || 144} FPS</span>
          </button>

          {/* Video Toggle & Audio Toggle */}
          <button
            onClick={() => {
              setIsVideoMuted(!isVideoMuted);
              soundEngine.playClick();
            }}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title={isVideoMuted ? 'Unmute Background Video' : 'Mute Background Video'}
          >
            {isVideoMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          <button
            onClick={() => {
              setShowVideo(!showVideo);
              soundEngine.playClick();
            }}
            className={`p-2 rounded-lg border transition ${showVideo ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
            title="Toggle Background Video Stream"
          >
            <Tv className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Center Stage: Epic Tensura Title & Game Modes */}
      <main className="relative z-10 w-full max-w-6xl flex flex-col items-center justify-center my-auto py-8 text-center">
        
        {/* Animated Title Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-950/80 via-blue-950/90 to-purple-950/80 border border-cyan-400/40 shadow-xl shadow-cyan-950/50 mb-4"
        >
          <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-200 uppercase">
            転生したらスライムだった件 • TENSURA MAGICAL CHESS
          </span>
          <Sparkles className="w-4 h-4 text-amber-300" />
        </motion.div>

        {/* Main Huge Display Title */}
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-['Cinzel'] tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-400 drop-shadow-[0_10px_25px_rgba(6,182,212,0.4)]"
        >
          THAT TIME I GOT REINCARNATED AS A SLIME
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-2xl sm:text-4xl md:text-5xl font-black font-['Orbitron'] tracking-widest text-amber-400 drop-shadow-[0_4px_15px_rgba(234,179,8,0.5)] mt-2 mb-8 flex items-center justify-center gap-3"
        >
          <span className="w-12 h-0.5 bg-gradient-to-r from-transparent to-amber-400 hidden sm:inline-block" />
          MAGICAL CHESS & CHECKERS
          <span className="w-12 h-0.5 bg-gradient-to-l from-transparent to-amber-400 hidden sm:inline-block" />
        </motion.div>

        {/* Mode Selector Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl px-4">
          
          {/* 1. Normal Chess Mode Card */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="group relative rounded-2xl p-6 bg-gradient-to-b from-slate-900/90 to-cyan-950/70 border border-cyan-500/40 hover:border-cyan-400 shadow-2xl shadow-cyan-950/60 backdrop-blur-xl flex flex-col justify-between text-left cursor-pointer transition-all overflow-hidden"
            onClick={() => {
              soundEngine.playClick();
              onOpenSetup('chess');
            }}
          >
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-500/20 rounded-full blur-2xl group-hover:bg-cyan-400/30 transition-all" />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-3xl shadow-inner">
                  👑
                </div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/40">
                  STANDARD RULES + SKILLS
                </span>
              </div>
              <h2 className="text-2xl font-bold font-['Orbitron'] text-white group-hover:text-cyan-200 transition-colors">
                NORMAL CHESS MODE
              </h2>
              <p className="text-sm text-slate-300 mt-2 line-clamp-2">
                Classic 64-square grand strategy powered by Raphael / Great Sage tactical AI, character ultimate skills, and live voice telepathy.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-cyan-500/20">
              <div className="flex items-center gap-2 text-xs text-cyan-300 font-mono">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Easy to Demon Lord AI</span>
              </div>
              <button className="flex items-center gap-1 text-sm font-bold text-cyan-300 group-hover:translate-x-1 transition-transform">
                <span>Play Chess</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* 2. Checkers Chess Mode Card */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="group relative rounded-2xl p-6 bg-gradient-to-b from-slate-900/90 to-amber-950/70 border border-amber-500/40 hover:border-amber-400 shadow-2xl shadow-amber-950/60 backdrop-blur-xl flex flex-col justify-between text-left cursor-pointer transition-all overflow-hidden"
            onClick={() => {
              soundEngine.playClick();
              onOpenSetup('checkers');
            }}
          >
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/20 rounded-full blur-2xl group-hover:bg-amber-400/30 transition-all" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-3xl shadow-inner">
                  🔴
                </div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/40">
                  DRAUGHTS + MAGIC JUMPS
                </span>
              </div>
              <h2 className="text-2xl font-bold font-['Orbitron'] text-white group-hover:text-amber-200 transition-colors">
                CHECKERS CHESS MODE
              </h2>
              <p className="text-sm text-slate-300 mt-2 line-clamp-2">
                Fast-paced diagonal jumping war with Demon Lord promotions, multi-capture chains, and elemental blast VFX.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-amber-500/20">
              <div className="flex items-center gap-2 text-xs text-amber-300 font-mono">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Multi-Jump Combos</span>
              </div>
              <button className="flex items-center gap-1 text-sm font-bold text-amber-300 group-hover:translate-x-1 transition-transform">
                <span>Play Checkers</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              soundEngine.playSkillActivation();
              onStartGame('chess', 'grandmaster');
            }}
            className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 text-slate-950 font-black font-['Orbitron'] tracking-wider text-base shadow-xl shadow-cyan-500/40 hover:shadow-cyan-400/60 transition-all border border-cyan-300"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>QUICK BATTLE (VS RAPHAEL AI)</span>
          </motion.button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenEncyclopedia();
            }}
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 transition shadow-lg font-semibold"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Character Vault & Skills</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenHardware();
            }}
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-amber-300 border border-amber-500/30 hover:border-amber-400 transition shadow-lg font-semibold"
          >
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>Hardware & 320 FPS Monitor</span>
          </button>
        </div>

      </main>

      {/* Footer Banner: Full Fan Credits & Unreal Engine Notice */}
      <footer className="relative z-10 w-full max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-800/80 pt-3 px-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Tensura Magical Chess & Checkers v2.5 Ultra • Fan Work Tribute</span>
        </div>
        <div className="text-center sm:text-right text-slate-400">
          Created with passion by <span className="text-cyan-300 font-semibold">Eleventh Gyuuun / Seven Eleventh / Usagyuun VTuber</span> & <span className="text-amber-300 font-semibold">Mark David V. Valmores</span>
        </div>
      </footer>

    </div>
  );
};
