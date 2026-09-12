import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TensuraCharacter } from '../types/game';
import { MessageSquare, Sparkles } from 'lucide-react';

interface CharacterBanterProps {
  speaker: TensuraCharacter;
  dialogue: string | null;
  onDismiss: () => void;
}

export const CharacterBanter: React.FC<CharacterBanterProps> = ({
  speaker,
  dialogue,
  onDismiss
}) => {
  useEffect(() => {
    if (!dialogue) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4500);
    return () => clearTimeout(timer);
  }, [dialogue, onDismiss]);

  return (
    <AnimatePresence>
      {dialogue && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4 pointer-events-none"
        >
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-2 border-cyan-400/80 rounded-2xl p-4 shadow-2xl shadow-cyan-950/80 backdrop-blur-xl flex items-center gap-4 ring-2 ring-cyan-500/30 pointer-events-auto">
            
            {/* Character Avatar Stamp */}
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${speaker.avatarBg} border-2 border-cyan-300 flex items-center justify-center text-3xl shadow-lg shrink-0 relative`}>
              <span>{speaker.avatarIcon}</span>
              <span className="absolute -bottom-1 -right-1 text-[10px] bg-slate-950 px-1.5 py-0.5 rounded-full border border-cyan-400 font-mono font-bold text-cyan-300">
                EP {Math.round(speaker.ep / 10000)}k
              </span>
            </div>

            {/* Character Speech Line */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                  {speaker.name}
                </span>
                <span className="text-[10px] text-slate-400 font-sans">
                  ({speaker.title})
                </span>
              </div>
              <p className="text-sm font-medium text-slate-100 italic leading-snug drop-shadow">
                "{dialogue}"
              </p>
            </div>

            <button
              onClick={onDismiss}
              className="text-xs text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
