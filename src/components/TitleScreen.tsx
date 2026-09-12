import React from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  Users, 
  Sparkles, 
  Cpu, 
  BookOpen, 
  ShieldCheck, 
  Zap,
  ChevronRight,
  Gamepad2,
  Music,
  Volume2,
  VolumeX
} from 'lucide-react';
import { GameMode, AIDifficulty, DeviceInfo, VideoSettings, ControllerPromptStyle } from '../types/game';
import { VideoBackground } from './VideoBackground';
import { soundEngine } from '../utils/audio';

interface TitleScreenProps {
  onStartGame: (mode: GameMode, difficulty: AIDifficulty) => void;
  onOpenSetup: (mode: GameMode) => void;
  onOpenCharacterSelect: () => void;
  onOpenEncyclopedia: () => void;
  onOpenHardware: () => void;
  deviceInfo: DeviceInfo | null;
  videoSettings: VideoSettings;
  onUpdateVideoSettings: (newSettings: Partial<VideoSettings>) => void;
  promptStyle: ControllerPromptStyle;
  onChangePromptStyle: (style: ControllerPromptStyle) => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onOpenSetup,
  onOpenCharacterSelect,
  onOpenEncyclopedia,
  onOpenHardware,
  deviceInfo,
  videoSettings,
  onUpdateVideoSettings,
  promptStyle,
  onChangePromptStyle
}) => {
  const isMusicOn = !videoSettings.isMuted;

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between p-4 md:p-8 overflow-hidden bg-slate-950 text-slate-100 select-none">
      
      {/* 1. Fullscreen Zoomable Responsive Video Background */}
      <VideoBackground 
        settings={videoSettings} 
        onUpdateSettings={onUpdateVideoSettings} 
        isHomeMenu={true}
      />

      {/* 2. Top Header Bar: Hardware HUD, Controller Switcher & Brand Tribute */}
      <header className="relative z-10 w-full max-w-7xl flex flex-wrap items-center justify-between gap-4 py-2.5 border-b border-cyan-500/30 backdrop-blur-xl bg-slate-950/70 px-4 rounded-2xl shadow-xl ring-1 ring-cyan-500/20">
        
        {/* Tensura & Fan Creator Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/40 ring-1 ring-cyan-300">
            <span className="text-xl">💧</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold tracking-widest text-cyan-300 uppercase bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                UNREAL TENSURA ENGINE
              </span>
              <span className="text-[11px] font-mono text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                BANDAI NAMCO CHARACTERS
              </span>
            </div>
            <p className="text-[11px] text-slate-200 font-medium tracking-wide mt-0.5">
              Created by Fan <strong className="text-cyan-300">Eleventh Gyuuun / Seven Eleventh / Usagyuun VTuber</strong> & <strong className="text-amber-300">Mark David V. Valmores</strong>
            </p>
          </div>
        </div>

        {/* Controller Style Toggle, Background Video Music Switch & Device Specs Ribbon */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          
          {/* Background Video Music ON/OFF Toggle (Default Auto ON) */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onUpdateVideoSettings({ isMuted: !videoSettings.isMuted });
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition shadow-inner font-bold ${
              isMusicOn 
                ? 'bg-gradient-to-r from-cyan-950 to-blue-900/90 text-cyan-300 border-cyan-400 ring-1 ring-cyan-400/30' 
                : 'bg-slate-900/90 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title={`Background Video Music is ${isMusicOn ? 'ON (Auto default)' : 'OFF'}. Click to toggle.`}
          >
            {isMusicOn ? (
              <>
                <Music className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                <span>BG MUSIC: <span className="text-emerald-400">AUTO ON</span></span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span>BG MUSIC: <span className="text-rose-400">OFF</span></span>
              </>
            )}
          </button>

          {/* Quick Controller Prompt Style Selector */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-cyan-500/40 shadow-inner">
            <Gamepad2 className="w-4 h-4 text-cyan-400 ml-1.5" />
            <select
              value={promptStyle}
              onChange={(e) => {
                soundEngine.playClick();
                onChangePromptStyle(e.target.value as ControllerPromptStyle);
              }}
              className="bg-transparent text-cyan-300 text-xs font-bold font-mono focus:outline-none cursor-pointer pr-1 py-1"
              title="Toggle Controller Button Prompts (PlayStation vs Xbox vs Generic vs Nintendo)"
            >
              <option value="playstation" className="bg-slate-900 text-slate-100">PlayStation (✕ ○ □ △)</option>
              <option value="xbox" className="bg-slate-900 text-slate-100">Xbox (A B X Y)</option>
              <option value="generic" className="bg-slate-900 text-slate-100">Generic (1 2 3 4)</option>
              <option value="nintendo" className="bg-slate-900 text-slate-100">Nintendo (B A Y X)</option>
            </select>
          </div>

          {/* Hardware Diagnostic Trigger */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenHardware();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 transition shadow-inner group"
            title="Inspect Full Device Specifications & Hardware Monitor"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-45 transition-transform" />
            <span className="hidden sm:inline">GPU: {deviceInfo?.gpuRenderer?.slice(0, 14) || 'Detecting...'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-400 font-bold">{deviceInfo?.targetFPS || 144} FPS</span>
          </button>

        </div>
      </header>

      {/* 3. Main Center Stage: Epic Tensura Title & Game Modes */}
      <main className="relative z-10 w-full max-w-6xl flex flex-col items-center justify-center my-auto py-6 text-center">
        
        {/* Authentic Japanese Kanji Subtitle Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-slate-950/90 border border-cyan-400/60 shadow-xl shadow-cyan-950/80 mb-3 backdrop-blur-xl"
        >
          <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-xs sm:text-sm font-jp-calligraphy tracking-widest text-cyan-200">
            転生したらスライムだった件 • TENSURA MAGICAL CHESS & CHECKERS
          </span>
          <Sparkles className="w-4 h-4 text-amber-300" />
        </motion.div>

        {/* Main Display Title with Slime Fonts */}
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-tensura tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-400 drop-shadow-[0_10px_30px_rgba(6,182,212,0.6)]"
        >
          THAT TIME I GOT REINCARNATED AS A SLIME
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xl sm:text-3xl md:text-4xl font-black font-slime tracking-widest text-amber-400 drop-shadow-[0_4px_20px_rgba(234,179,8,0.7)] mt-2 mb-6 flex items-center justify-center gap-3"
        >
          <span className="w-12 h-0.5 bg-gradient-to-r from-transparent to-amber-400 hidden sm:inline-block" />
          MAGICAL CHESS & CHECKERS
          <span className="w-12 h-0.5 bg-gradient-to-l from-transparent to-amber-400 hidden sm:inline-block" />
        </motion.div>

        {/* Mode Selector Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-6xl px-4">
          
          {/* 1. Normal Chess Mode Card */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="group relative rounded-3xl p-6 bg-gradient-to-b from-slate-900/95 via-slate-950/90 to-cyan-950/80 border-2 border-cyan-500/40 hover:border-cyan-400 shadow-2xl shadow-cyan-950/80 backdrop-blur-2xl flex flex-col justify-between text-left cursor-pointer transition-all overflow-hidden ring-1 ring-cyan-500/20"
            onClick={() => {
              soundEngine.playClick();
              onOpenSetup('chess');
            }}
          >
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl group-hover:bg-cyan-400/30 transition-all" />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400/50 flex items-center justify-center text-3xl shadow-inner">
                  👑
                </div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/90 px-3 py-1 rounded-full border border-cyan-500/40">
                  STANDARD CHESS + SKILLS
                </span>
              </div>
              <h2 className="text-2xl font-bold font-slime text-white group-hover:text-cyan-200 transition-colors">
                NORMAL CHESS MODE
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-2 font-sans">
                Authentic 64-square chess featuring Raphael / Great Sage tactical AI evaluation, Season 1-4 character picture avatars, and voice quotes.
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between pt-4 border-t border-cyan-500/20">
              <div className="flex items-center gap-2 text-xs text-cyan-300 font-mono">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>5 Difficulty Tiers</span>
              </div>
              <button className="flex items-center gap-1 text-sm font-bold text-cyan-300 group-hover:translate-x-1 transition-transform">
                <span>Configure & Play</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* 2. Chess960 Mode Card */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="group relative rounded-3xl p-6 bg-gradient-to-b from-slate-900/95 via-slate-950/90 to-purple-950/80 border-2 border-purple-500/40 hover:border-purple-400 shadow-2xl shadow-purple-950/80 backdrop-blur-2xl flex flex-col justify-between text-left cursor-pointer transition-all overflow-hidden ring-1 ring-purple-500/20"
            onClick={() => {
              soundEngine.playClick();
              onOpenSetup('chess960');
            }}
          >
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-400/30 transition-all" />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border-2 border-purple-400/50 flex items-center justify-center text-3xl shadow-inner">
                  🎲
                </div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300 bg-purple-950/90 px-3 py-1 rounded-full border border-purple-500/40">
                  FISCHER RANDOM
                </span>
              </div>
              <h2 className="text-2xl font-bold font-slime text-white group-hover:text-purple-200 transition-colors">
                CHESS960 MODE
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-2 font-sans">
                Starting positions are randomized based on Fischer Random rules. Throw off Great Sage's opening book and test your raw adaptability.
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between pt-4 border-t border-purple-500/20">
              <div className="flex items-center gap-2 text-xs text-purple-300 font-mono">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>960 Starting States</span>
              </div>
              <button className="flex items-center gap-1 text-sm font-bold text-purple-300 group-hover:translate-x-1 transition-transform">
                <span>Configure & Play</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* 3. Checkers Chess Mode Card */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="group relative rounded-3xl p-6 bg-gradient-to-b from-slate-900/95 via-slate-950/90 to-amber-950/80 border-2 border-amber-500/40 hover:border-amber-400 shadow-2xl shadow-amber-950/80 backdrop-blur-2xl flex flex-col justify-between text-left cursor-pointer transition-all overflow-hidden ring-1 ring-amber-500/20"
            onClick={() => {
              soundEngine.playClick();
              onOpenSetup('checkers');
            }}
          >
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl group-hover:bg-amber-400/30 transition-all" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-400/50 flex items-center justify-center text-3xl shadow-inner">
                  🔴
                </div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 bg-amber-950/90 px-3 py-1 rounded-full border border-amber-500/40">
                  DRAUGHTS + DEMON CROWNS
                </span>
              </div>
              <h2 className="text-2xl font-bold font-slime text-white group-hover:text-amber-200 transition-colors">
                CHECKERS CHESS MODE
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-2 font-sans">
                Fast-paced diagonal jumping war with Demon Lord King promotions, multi-capture chains, and anime sprite discs.
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between pt-4 border-t border-amber-500/20">
              <div className="flex items-center gap-2 text-xs text-amber-300 font-mono">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Multi-Jump Combos</span>
              </div>
              <button className="flex items-center gap-1 text-sm font-bold text-amber-300 group-hover:translate-x-1 transition-transform">
                <span>Configure & Play</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

        </div>

        {/* Main Navigation Row: Quick Battle, Character Select Roster, Character Vault, Hardware */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mt-6">
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              soundEngine.playSkillActivation();
              onStartGame('chess', 'grandmaster');
            }}
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 text-slate-950 font-black font-slime tracking-wider text-sm shadow-xl shadow-cyan-500/40 hover:shadow-cyan-400/60 transition-all border-2 border-cyan-300"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>QUICK BATTLE (VS RAPHAEL AI)</span>
          </motion.button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenCharacterSelect();
            }}
            className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-purple-950 to-indigo-950 hover:bg-purple-900 text-purple-200 border-2 border-purple-400/60 shadow-xl font-bold text-xs font-mono transition"
          >
            <Users className="w-4 h-4 text-purple-400" />
            <span>CHARACTER SELECT (S1-S4 ROSTER)</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenEncyclopedia();
            }}
            className="flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-slate-950/90 hover:bg-slate-900 text-cyan-300 border border-cyan-500/40 transition shadow-lg font-semibold text-xs font-mono"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Lore & Skills Vault</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenHardware();
            }}
            className="flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-slate-950/90 hover:bg-slate-900 text-amber-300 border border-amber-500/40 transition shadow-lg font-semibold text-xs font-mono"
          >
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>320 FPS Monitor</span>
          </button>
        </div>

      </main>

      {/* 4. Footer Banner: Full Fan Credits & Unreal Engine Notice */}
      <footer className="relative z-10 w-full max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-400 border-t border-slate-800/80 pt-3 px-4 backdrop-blur-md bg-slate-950/40 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono">Tensura Magical Chess & Checkers v3.0 Ultra • Unreal Bandai Namco Fan Engine</span>
        </div>
        <div className="text-center sm:text-right text-slate-300 font-sans">
          Created with passion by <span className="text-cyan-300 font-bold">Eleventh Gyuuun / Seven Eleventh / Usagyuun VTuber</span> & <span className="text-amber-300 font-bold">Mark David V. Valmores</span>
        </div>
      </footer>

    </div>
  );
};
