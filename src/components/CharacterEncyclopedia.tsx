import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Sparkles, Shield, Flame, Zap, Droplets, Swords, X, Volume2 } from 'lucide-react';
import { TENSURA_CHARACTERS } from '../data/characters';
import { TensuraCharacter } from '../types/game';
import { soundEngine } from '../utils/audio';

interface CharacterEncyclopediaProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCharacter?: (char: TensuraCharacter) => void;
}

export const CharacterEncyclopedia: React.FC<CharacterEncyclopediaProps> = ({
  isOpen,
  onClose,
  onSelectCharacter
}) => {
  const [selectedChar, setSelectedChar] = useState<TensuraCharacter>(TENSURA_CHARACTERS[0]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-slate-900 border-2 border-cyan-500/50 rounded-3xl shadow-2xl shadow-cyan-950/80 text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-cyan-500/30 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-['Orbitron'] text-white">
                  TENSURA CHARACTER VAULT & SKILL ARCHIVES
                </h2>
                <p className="text-xs text-cyan-300 font-mono">
                  Official Bandai Namco Tensura Database & Fan Tribute
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

          {/* Main Content: Character Grid + Selected Character Detail View */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 overflow-y-auto flex-1">
            
            {/* Left list of Characters */}
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {TENSURA_CHARACTERS.map((char) => (
                <button
                  key={char.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedChar(char);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    selectedChar.id === char.id
                      ? 'bg-cyan-950/90 border-cyan-400 ring-2 ring-cyan-400/40'
                      : 'bg-slate-950/60 border-slate-800 hover:border-cyan-500/40'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-tr ${char.avatarBg} flex items-center justify-center text-xl shrink-0 shadow`}>
                    {char.avatarIcon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white truncate">{char.name}</h4>
                    <span className="text-[10px] text-cyan-400 font-mono block truncate">{char.title}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Right Character Details Card */}
            <div className="md:col-span-2 bg-slate-950/90 rounded-2xl border border-cyan-500/30 p-5 flex flex-col justify-between">
              <div>
                {/* Character Banner */}
                <div className="flex items-start gap-4 pb-4 border-b border-slate-800">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${selectedChar.avatarBg} border-2 border-cyan-300 flex items-center justify-center text-3xl shadow-xl shrink-0`}>
                    {selectedChar.avatarIcon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold font-['Cinzel'] text-white">{selectedChar.name}</h3>
                    <p className="text-xs font-mono text-cyan-300">{selectedChar.title}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-mono font-bold bg-cyan-950 px-2.5 py-0.5 rounded-full border border-cyan-500/40 text-cyan-300">
                        RACE: {selectedChar.race}
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-500/40 text-amber-300">
                        EP: {selectedChar.ep.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ultimate Skill */}
                <div className="mt-4 p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/30">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 mb-1">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>ULTIMATE SKILL: {selectedChar.ultimateSkill}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedChar.ultimateDescription}
                  </p>
                </div>

                {/* Iconic Battle Quotes */}
                <div className="mt-4 space-y-2">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                    BATTLE DIALOGUE AUDIO SCRIPT:
                  </span>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200 italic space-y-1.5">
                    <p><strong className="text-cyan-400 not-italic">On Start:</strong> "{selectedChar.voiceLines.start}"</p>
                    <p><strong className="text-rose-400 not-italic">On Capture:</strong> "{selectedChar.voiceLines.capture}"</p>
                    <p><strong className="text-amber-400 not-italic">On Check:</strong> "{selectedChar.voiceLines.check}"</p>
                    <p><strong className="text-emerald-400 not-italic">On Victory:</strong> "{selectedChar.voiceLines.win}"</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {onSelectCharacter && (
                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => {
                      soundEngine.playSkillActivation();
                      onSelectCharacter(selectedChar);
                      onClose();
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold font-mono text-xs shadow-lg shadow-cyan-500/40 hover:scale-105 transition"
                  >
                    SELECT AS COMBATANT
                  </button>
                </div>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
