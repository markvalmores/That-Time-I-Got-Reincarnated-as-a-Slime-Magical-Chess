import React, { useEffect, useState } from 'react';
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
  onReplay: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  winner,
  reason,
  playerCharacter,
  opponentCharacter,
  onRematch,
  onReturnTitle,
  onReplay
}) => {
  const [phase, setPhase] = useState<'hidden' | 'flash' | 'text' | 'reveal'>('hidden');

  const isPlayerWinner = winner === 'w';
  const isDraw = winner === 'draw';
  const winningCharacter = isPlayerWinner ? playerCharacter : (!isDraw ? opponentCharacter : null);
  const winningColor = winningCharacter ? winningCharacter.accentColor : '#06b6d4';
  const winningSkill = winningCharacter ? winningCharacter.ultimateSkill : 'Notice';

  useEffect(() => {
    if (isOpen && winner) {
      setPhase('flash');
      
      const t1 = setTimeout(() => {
        setPhase('text');
        soundEngine.playSkillActivation();
      }, 400);

      const t2 = setTimeout(() => {
        setPhase('reveal');
        if (winner === 'w') {
          soundEngine.playCheckmate(true);
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 },
            colors: [winningColor, '#ffffff', '#eab308']
          });
        } else if (winner === 'b') {
          soundEngine.playCheckmate(false);
        }
      }, 3500); // Extended delay for epic character reveal

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      setPhase('hidden');
    }
  }, [isOpen, winner, winningColor]);

  if (!isOpen || !winner) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden select-none">
        
        {/* Phase 1 & 2: Skill Activation Cinematic Overlay */}
        {(phase === 'flash' || phase === 'text') && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center z-50 overflow-hidden"
          >
            {/* Geometric Great Sage overlay grid */}
            <div 
              className="absolute inset-0 bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] opacity-30" 
              style={{ backgroundImage: `linear-gradient(to right, ${winningColor}20 1px, transparent 1px), linear-gradient(to bottom, ${winningColor}20 1px, transparent 1px)` }}
            />
                
            <AnimatePresence>
              {phase === 'text' && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
                  animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ scale: 1.1, opacity: 0, filter: 'blur(10px)' }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="relative z-10 flex flex-col items-center justify-center w-full h-full"
                >
                  <div className="absolute -inset-24 rounded-full blur-[100px] animate-pulse" style={{ backgroundColor: `${winningColor}40` }} />
                  
                  {/* Character Bust */}
                  {winningCharacter && (
                    <motion.div 
                      initial={{ scale: 1.5, opacity: 0, y: 50 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                      className="absolute bottom-0 w-full flex justify-center opacity-70 pointer-events-none"
                    >
                      <img 
                        src={winningCharacter.image} 
                        alt={winningCharacter.name}
                        className="h-[80vh] w-auto object-contain mix-blend-screen"
                        style={{ maskImage: 'linear-gradient(to top, transparent 0%, black 100%)', WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 100%)' }}
                      />
                    </motion.div>
                  )}
                      
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="h-px mb-4 overflow-hidden relative z-20 w-[80%] max-w-4xl"
                    style={{ backgroundColor: winningColor }}
                  />
                 
                  <h1 
                    className="text-4xl md:text-6xl lg:text-7xl font-black font-mono tracking-widest text-transparent bg-clip-text text-center uppercase relative z-20 px-4"
                    style={{ 
                      backgroundImage: `linear-gradient(to right, ${winningColor}, #fff, ${winningColor})`,
                      filter: `drop-shadow(0 0 15px ${winningColor}80)`
                    }}
                  >
                    &lt;&lt; {winningSkill} &gt;&gt;
                  </h1>
                 
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="mt-6 text-xl md:text-2xl font-bold tracking-[0.2em] uppercase text-center relative z-20 px-4"
                    style={{ color: winningColor }}
                  >
                    {isPlayerWinner ? 'Checkmate Condition Met' : isDraw ? 'Equilibrium Detected' : 'Tactical Defeat Logged'}
                  </motion.div>

                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="h-px mt-6 relative z-20 w-[80%] max-w-4xl"
                    style={{ backgroundColor: winningColor }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Phase 3: Reveal standard modal overlay */}
        {phase === 'reveal' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 z-40"
          >
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
          <div className="flex flex-col gap-3">
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
                  onReplay();
                }}
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 text-cyan-400 border border-cyan-500/30 font-bold font-mono text-xs shadow-lg hover:bg-slate-700 hover:text-white transition"
              >
                <RotateCcw className="w-4 h-4 rotate-180" />
                <span>WATCH REPLAY</span>
              </button>
            </div>
            
            <button
              onClick={() => {
                soundEngine.playClick();
                onReturnTitle();
              }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/50 text-slate-400 font-bold font-mono text-xs hover:bg-slate-800 hover:text-white transition"
            >
              <Home className="w-4 h-4" />
              <span>RETURN TO TITLE</span>
            </button>
          </div>

        </motion.div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};
