import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Home, Sparkles, Swords, Award } from 'lucide-react';
import { TensuraCharacter } from '../types/game';
import { soundEngine } from '../utils/audio';

interface GameOverModalProps {
  isOpen: boolean;
  winner: 'w' | 'b' | 'draw' | null;
  reason: string;
  playerCharacter: TensuraCharacter;
  opponentCharacter: TensuraCharacter;
  onRematch: () => void;
  onReturnTitle: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  winner,
  reason,
  playerCharacter,
  opponentCharacter,
  onRematch,
  onReturnTitle
}) => {
  useEffect(() => {
    if (isOpen && winner === 'w') {
      soundEngine.playCheckmate(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#3b82f6', '#eab308', '#ec4899', '#ffffff']
      });
    } else if (isOpen && winner === 'b') {
      soundEngine.playCheckmate(false);
    }
  }, [isOpen, winner]);

  if (!isOpen || !winner) return null;

  const isPlayerWinner = winner === 'w';
  const isDraw = winner === 'draw';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl select-none">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="relative w-full max-w-md bg-slate-900 border-2 border-cyan-500/60 rounded-3xl p-6 text-center shadow-2xl shadow-cyan-950/80 text-slate-100 ring-2 ring-cyan-400/30 overflow-hidden"
        >
          {/* Header Glow */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Trophy / Result Icon */}
          <div className="flex justify-center mb-3">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-xl border-2 ${
              isPlayerWinner
                ? 'bg-gradient-to-tr from-cyan-500 to-amber-400 border-amber-300 text-slate-950 ring-4 ring-amber-400/30 animate-bounce'
                : isDraw
                ? 'bg-slate-800 border-slate-600 text-slate-200'
                : 'bg-gradient-to-tr from-rose-700 to-red-900 border-rose-400 text-rose-200'
            }`}>
              {isPlayerWinner ? '🏆' : isDraw ? '🤝' : '💀'}
            </div>
          </div>

          {/* Result Title */}
          <h2 className={`text-2xl sm:text-3xl font-black font-['Cinzel'] tracking-tight ${
            isPlayerWinner ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-amber-300 to-white' : isDraw ? 'text-slate-300' : 'text-rose-400'
          }`}>
            {isPlayerWinner ? 'TEMPEST TRIUMPH!' : isDraw ? 'PEACEFUL STALEMATE' : 'TACTICAL DEFEAT'}
          </h2>

          <p className="text-xs font-mono text-cyan-300 uppercase tracking-widest mt-1">
            {reason}
          </p>

          {/* Voice of the World Notice */}
          <div className="my-5 p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/40 text-left">
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-cyan-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>&lt;&lt;VOICE OF THE WORLD REPORT&gt;&gt;</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {isPlayerWinner ? (
                <>
                  &lt;&lt;Notice&gt;&gt; Lord Rimuru has executed checkmate against {opponentCharacter.name}. Tactical simulation confirms absolute domain dominance. Magicule reward: <strong className="text-amber-300">+250,000 EP</strong>.
                </>
              ) : isDraw ? (
                <>
                  &lt;&lt;Report&gt;&gt; Both combatants have reached an unbreakable equilibrium. The match is recognized as a diplomatic draw.
                </>
              ) : (
                <>
                  &lt;&lt;Report&gt;&gt; Commander {opponentCharacter.name} breached our king defense lines. Great Sage has logged this combat log for deeper neural adaptation.
                </>
              )}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                soundEngine.playSkillActivation();
                onRematch();
              }}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold font-mono text-xs shadow-lg shadow-cyan-500/40 hover:scale-105 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>REMATCH</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                onReturnTitle();
              }}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold font-mono text-xs border border-slate-700 transition"
            >
              <Home className="w-4 h-4" />
              <span>TITLE SCREEN</span>
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
