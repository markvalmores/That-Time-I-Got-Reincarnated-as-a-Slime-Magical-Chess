import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Crown, 
  Clock, 
  Palette, 
  Swords, 
  Users, 
  Bot, 
  ShieldCheck, 
  Zap, 
  X,
  Play
} from 'lucide-react';
import { GameMode, AIDifficulty, TimerMode, BoardTheme, TensuraCharacter } from '../types/game';
import { TENSURA_CHARACTERS } from '../data/characters';
import { soundEngine } from '../utils/audio';

interface MatchSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode: GameMode;
  onStartMatch: (config: {
    mode: GameMode;
    difficulty: AIDifficulty;
    timerMode: TimerMode;
    theme: BoardTheme;
    playerCharacter: TensuraCharacter;
    opponentCharacter: TensuraCharacter;
    isVsAI: boolean;
  }) => void;
}

export const MatchSetupModal: React.FC<MatchSetupModalProps> = ({
  isOpen,
  onClose,
  defaultMode,
  onStartMatch
}) => {
  const [mode, setMode] = useState<GameMode>(defaultMode);
  const [difficulty, setDifficulty] = useState<AIDifficulty>('grandmaster');
  const [timerMode, setTimerMode] = useState<TimerMode>('none');
  const [theme, setTheme] = useState<BoardTheme>('tempest');
  const [isVsAI, setIsVsAI] = useState<boolean>(true);
  const [playerChar, setPlayerChar] = useState<TensuraCharacter>(TENSURA_CHARACTERS[0]); // Rimuru
  const [opponentChar, setOpponentChar] = useState<TensuraCharacter>(TENSURA_CHARACTERS[1]); // Veldora

  if (!isOpen) return null;

  const handleStart = () => {
    soundEngine.playSkillActivation();
    onStartMatch({
      mode,
      difficulty,
      timerMode,
      theme,
      playerCharacter: playerChar,
      opponentCharacter: opponentChar,
      isVsAI
    });
    onClose();
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
                <Swords className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-['Orbitron'] text-white">
                  CUSTOM MATCH INITIALIZATION
                </h2>
                <p className="text-xs text-cyan-300 font-mono">
                  Configure Rule Set, AI Level, Timers & Tensura Board
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

          {/* Mode Selector */}
          <div className="mb-5">
            <label className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider block mb-2">
              GAME MODE
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setMode('chess');
                }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  mode === 'chess'
                    ? 'bg-cyan-950/90 border-cyan-400 ring-2 ring-cyan-400/40 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">👑</span>
                  <span className="font-bold text-base font-['Orbitron']">NORMAL CHESS</span>
                </div>
                <p className="text-xs text-slate-300">
                  Full 64-square grandmaster tactical combat with Raphael AI assistance.
                </p>
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  setMode('checkers');
                }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  mode === 'checkers'
                    ? 'bg-amber-950/90 border-amber-400 ring-2 ring-amber-400/40 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-amber-500/40'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">🔴</span>
                  <span className="font-bold text-base font-['Orbitron']">CHECKERS CHESS</span>
                </div>
                <p className="text-xs text-slate-300">
                  High-speed diagonal jumping warfare with Demon Lord promotions.
                </p>
              </button>
            </div>
          </div>

          {/* Opponent Type: AI vs Pass & Play */}
          <div className="mb-5">
            <label className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider block mb-2">
              OPPONENT TYPE
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setIsVsAI(true);
                }}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-mono text-xs font-bold transition-all ${
                  isVsAI
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>VS TENSURA RAPHAEL AI</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  setIsVsAI(false);
                }}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-mono text-xs font-bold transition-all ${
                  !isVsAI
                    ? 'bg-purple-950 border-purple-400 text-purple-300 ring-1 ring-purple-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <Users className="w-4 h-4 text-purple-400" />
                <span>LOCAL 2-PLAYER (PASS & PLAY)</span>
              </button>
            </div>
          </div>

          {/* AI Difficulty Selector (if vs AI) */}
          {isVsAI && (
            <div className="mb-5">
              <label className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider block mb-2">
                A.I. DIFFICULTY LEVEL
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { id: 'easy', label: 'EASY', desc: 'Gobta Level' },
                  { id: 'normal', label: 'NORMAL', desc: 'Benimaru Level' },
                  { id: 'hard', label: 'HARD', desc: 'Diablo Level' },
                  { id: 'grandmaster', label: 'GRANDMASTER', desc: 'Guy Crimson' },
                  { id: 'king', label: 'KING / DEMON LORD', desc: 'Raphael & Veldora' }
                ].map((diff) => (
                  <button
                    key={diff.id}
                    onClick={() => {
                      soundEngine.playClick();
                      setDifficulty(diff.id as any);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      difficulty === diff.id
                        ? 'bg-amber-950 border-amber-400 text-amber-300 ring-1 ring-amber-400 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-[11px] font-mono block truncate">{diff.label}</span>
                    <span className="text-[9px] text-slate-400 block truncate mt-0.5">{diff.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Timer Mode Selector */}
          <div className="mb-5">
            <label className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider block mb-2">
              CHESS CLOCK / TIMER MODE
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { id: 'none', label: 'No Timer', desc: 'Casual' },
                { id: '1m', label: '1 Min', desc: 'Bullet' },
                { id: '3m', label: '3 Min', desc: 'Blitz' },
                { id: '5m', label: '5 Min', desc: 'Rapid' },
                { id: '10m', label: '10 Min', desc: 'Classical' },
                { id: '15m', label: '15 Min', desc: 'Tournament' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setTimerMode(t.id as any);
                  }}
                  className={`p-2.5 rounded-xl border text-center font-mono transition-all ${
                    timerMode === t.id
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs block">{t.label}</span>
                  <span className="text-[9px] text-slate-500 block">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Board Theme Selector */}
          <div className="mb-6">
            <label className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider block mb-2">
              TENSURA ENVIRONMENT & BOARD THEME
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'tempest', label: 'Jura Forest', colors: 'bg-cyan-600' },
                { id: 'walpurgis', label: 'Walpurgis Banquet', colors: 'bg-rose-700' },
                { id: 'lubelius', label: 'Lubelius Sanctuary', colors: 'bg-amber-600' },
                { id: 'cave', label: 'Veldora Crystal Cave', colors: 'bg-purple-600' }
              ].map((th) => (
                <button
                  key={th.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setTheme(th.id as any);
                  }}
                  className={`p-3 rounded-xl border flex items-center gap-2 transition-all ${
                    theme === th.id
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full ${th.colors}`} />
                  <span className="text-xs font-mono font-bold truncate">{th.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Combatant Selection Preview */}
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${playerChar.avatarBg} flex items-center justify-center text-2xl shadow`}>
                {playerChar.avatarIcon}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-cyan-400 font-mono uppercase block">PLAYER (TEMPEST)</span>
                <h4 className="text-sm font-bold text-white truncate">{playerChar.name}</h4>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-end text-right">
              <div className="min-w-0">
                <span className="text-[10px] text-rose-400 font-mono uppercase block">OPPONENT</span>
                <h4 className="text-sm font-bold text-white truncate">{opponentChar.name}</h4>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${opponentChar.avatarBg} flex items-center justify-center text-2xl shadow`}>
                {opponentChar.avatarIcon}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
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
              onClick={handleStart}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 text-slate-950 text-xs font-black font-mono tracking-wider shadow-lg shadow-cyan-500/40 hover:scale-105 transition"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>COMMENCE BATTLE</span>
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
