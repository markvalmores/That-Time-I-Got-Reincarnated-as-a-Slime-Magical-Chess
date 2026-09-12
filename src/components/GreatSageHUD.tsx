import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Brain, Lightbulb, ShieldAlert, Cpu, Activity, RefreshCw } from 'lucide-react';
import { GreatSageAnalysis, TensuraCharacter } from '../types/game';
import { soundEngine } from '../utils/audio';

interface GreatSageHUDProps {
  analysis: GreatSageAnalysis;
  onTriggerAnalysis: () => void;
  onRequestHint: () => void;
  playerCharacter: TensuraCharacter;
  opponentCharacter: TensuraCharacter;
  isAIThinking: boolean;
}

export const GreatSageHUD: React.FC<GreatSageHUDProps> = ({
  analysis,
  onTriggerAnalysis,
  onRequestHint,
  playerCharacter,
  opponentCharacter,
  isAIThinking
}) => {
  const [autoExpand, setAutoExpand] = useState(true);

  const evalNormalized = Math.max(-10, Math.min(10, analysis.evalScore));
  const whiteBarPercent = Math.round(50 + (evalNormalized / 10) * 45);

  return (
    <div className="w-full max-w-4xl bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-3 md:p-4 backdrop-blur-xl shadow-xl shadow-cyan-950/40 relative overflow-hidden">
      
      {/* Background Magicule Grid */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Top Header: Voice of the World Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/20 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-inner">
            <Brain className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-mono font-bold tracking-widest text-cyan-300 uppercase">
                GREAT SAGE / RAPHAEL AI HUD
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                ACTIVE ANALYSIS
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Voice of the World • Parallel Processing & Tactical Calculation
            </p>
          </div>
        </div>

        {/* Action Buttons: Hint & Analyze */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundEngine.playGreatSageChime();
              onRequestHint();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 text-xs font-bold transition shadow"
            title="Ask Great Sage for the optimal move recommendation"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Ask Hint</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playGreatSageChime();
              onTriggerAnalysis();
            }}
            disabled={analysis.isAnalyzing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-bold transition shadow disabled:opacity-50"
            title="Run deep Gemini AI board evaluation"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${analysis.isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{analysis.isAnalyzing ? 'Calculating...' : 'Deep Analysis'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Advantage Evaluation Bar */}
      <div className="space-y-1 mb-3">
        <div className="flex items-center justify-between text-xs font-mono font-bold">
          <span className="text-cyan-400 flex items-center gap-1">
            <span>{playerCharacter.name} (Tempest)</span>
            <span className="text-white font-bold">{analysis.winRate}%</span>
          </span>
          <span className="text-slate-400">
            Eval Score: <span className={analysis.evalScore >= 0 ? 'text-cyan-300' : 'text-rose-400'}>
              {analysis.evalScore > 0 ? `+${analysis.evalScore.toFixed(1)}` : analysis.evalScore.toFixed(1)}
            </span>
          </span>
          <span className="text-rose-400 flex items-center gap-1">
            <span>{100 - analysis.winRate}%</span>
            <span>{opponentCharacter.name}</span>
          </span>
        </div>

        {/* Dual Color Evaluation Gauge */}
        <div className="w-full h-3 rounded-full bg-rose-950 border border-slate-700/80 overflow-hidden flex shadow-inner">
          <motion.div
            initial={{ width: '50%' }}
            animate={{ width: `${whiteBarPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 shadow-lg shadow-cyan-400/50"
          />
          <div className="h-full flex-1 bg-gradient-to-r from-rose-600 to-amber-700" />
        </div>
      </div>

      {/* Voice of the World Telepathy Speech Bubble */}
      <div className="p-3 rounded-xl bg-slate-950/90 border border-cyan-500/40 shadow-inner relative">
        <div className="flex items-start gap-2.5">
          <span className="text-xl">✨</span>
          <div className="flex-1">
            <div className="text-[11px] font-mono font-bold text-cyan-300 tracking-wider mb-0.5">
              &lt;&lt;VOICE OF THE WORLD / RAPHAEL&gt;&gt;
            </div>
            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
              {analysis.isAnalyzing ? (
                <span className="text-cyan-400 animate-pulse font-mono">
                  &lt;&lt;Notice&gt;&gt; Accessing Akashic records & calculating 120,000 branch simulations...
                </span>
              ) : (
                analysis.advice || '<<Report>> Battle initialized. Maintain spatial domination in the central quadrants.'
              )}
            </p>
            {analysis.skillTip && (
              <p className="text-xs text-amber-300 font-medium mt-1.5 flex items-center gap-1.5 bg-amber-950/40 p-1.5 rounded-lg border border-amber-500/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{analysis.skillTip}</span>
              </p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
