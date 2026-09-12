import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  Settings, 
  Smartphone, 
  ChevronUp, 
  ChevronDown, 
  RotateCcw, 
  Lightbulb, 
  Brain, 
  Repeat, 
  ZoomIn,
  Check
} from 'lucide-react';
import { ControllerPromptStyle } from '../types/game';
import { globalGamepad } from '../utils/gamepad';
import { soundEngine } from '../utils/audio';

interface ControllerHUDProps {
  promptStyle: ControllerPromptStyle;
  onChangePromptStyle: (style: ControllerPromptStyle) => void;
  onDpadAction?: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onSelectAction?: () => void;
  onCancelAction?: () => void;
  onHintAction?: () => void;
  onAnalyzeAction?: () => void;
  onUndoAction?: () => void;
  onFlipAction?: () => void;
  showVirtualTouch?: boolean;
}

export const ControllerHUD: React.FC<ControllerHUDProps> = ({
  promptStyle,
  onChangePromptStyle,
  onDpadAction,
  onSelectAction,
  onCancelAction,
  onHintAction,
  onAnalyzeAction,
  onUndoAction,
  onFlipAction,
  showVirtualTouch = false
}) => {
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState(false);
  const [connectedName, setConnectedName] = useState<string | null>(null);
  const [touchDpadOpen, setTouchDpadOpen] = useState(false);

  useEffect(() => {
    const checkGp = () => {
      setConnectedName(globalGamepad.connectedGamepadName);
    };
    const interval = setInterval(checkGp, 1000);
    return () => clearInterval(interval);
  }, []);

  const buttonPrompts = {
    playstation: {
      select: '✕ Cross',
      cancel: '○ Circle',
      hint: '□ Square',
      analyze: '△ Triangle',
      undo: 'L1',
      flip: 'R1',
      styleName: 'PlayStation DualSense / DS4'
    },
    xbox: {
      select: 'A Button',
      cancel: 'B Button',
      hint: 'X Button',
      analyze: 'Y Button',
      undo: 'LB',
      flip: 'RB',
      styleName: 'Xbox / XInput'
    },
    generic: {
      select: '1 (A)',
      cancel: '2 (B)',
      hint: '3 (X)',
      analyze: '4 (Y)',
      undo: 'L1',
      flip: 'R1',
      styleName: 'Generic / DirectInput'
    },
    nintendo: {
      select: 'B Button',
      cancel: 'A Button',
      hint: 'Y Button',
      analyze: 'X Button',
      undo: 'L',
      flip: 'R',
      styleName: 'Nintendo Pro / Joy-Con'
    }
  }[promptStyle];

  return (
    <div className="relative z-30 select-none pointer-events-auto">
      
      {/* Bottom Bar Floating Controller Guide & Style Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-slate-950/85 border border-cyan-500/30 backdrop-blur-md shadow-lg text-xs font-mono">
        
        {/* Connection Status & Style Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-cyan-400">
            <Gamepad2 className="w-4 h-4 animate-pulse" />
            <span className="font-bold hidden sm:inline">
              {connectedName ? connectedName.slice(0, 22) : 'Gamepad Support Active'}
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => {
                soundEngine.playClick();
                setIsStyleMenuOpen(!isStyleMenuOpen);
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold transition"
            >
              <span>{buttonPrompts.styleName}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {/* Style Selector Dropdown */}
            <AnimatePresence>
              {isStyleMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute bottom-full left-0 mb-2 w-56 p-2 rounded-xl bg-slate-900 border-2 border-cyan-400 shadow-2xl shadow-cyan-950/90 text-slate-100 space-y-1 z-50"
                >
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-2 py-1 border-b border-slate-800">
                    CONTROLLER BUTTON DISPLAY
                  </div>
                  {[
                    { id: 'playstation', label: 'PlayStation (✕ ○ □ △)', icon: '🎮' },
                    { id: 'xbox', label: 'Xbox / XInput (A B X Y)', icon: '🎮' },
                    { id: 'generic', label: 'Generic Controller (1 2 3 4)', icon: '🕹️' },
                    { id: 'nintendo', label: 'Nintendo Switch (B A Y X)', icon: '🎮' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        soundEngine.playClick();
                        onChangePromptStyle(item.id as ControllerPromptStyle);
                        setIsStyleMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition ${
                        promptStyle === item.id
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span>{item.label}</span>
                      {promptStyle === item.id && <Check className="w-3.5 h-3.5 text-slate-950" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Real-time Shortcut Badges */}
        <div className="flex items-center gap-3 text-[11px] text-slate-300">
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/50 font-bold">
              {buttonPrompts.select}
            </span>
            <span>Select/Move</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/50 font-bold">
              {buttonPrompts.cancel}
            </span>
            <span>Cancel</span>
          </div>

          <div className="flex items-center gap-1 hidden md:flex">
            <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/50 font-bold">
              {buttonPrompts.hint}
            </span>
            <span>Hint</span>
          </div>

          <div className="flex items-center gap-1 hidden md:flex">
            <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/50 font-bold">
              {buttonPrompts.analyze}
            </span>
            <span>Analyze</span>
          </div>

          {/* Virtual Touch Dpad Trigger for Mobile */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setTouchDpadOpen(!touchDpadOpen);
            }}
            className={`p-1.5 rounded-lg border transition sm:hidden ${
              touchDpadOpen ? 'bg-cyan-500 text-slate-950 border-cyan-300' : 'bg-slate-900 text-cyan-300 border-cyan-500/40'
            }`}
            title="Toggle Virtual Touch Controls"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Virtual On-Screen Touch Controls (For Mobile Players) */}
      <AnimatePresence>
        {touchDpadOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 left-4 right-4 z-50 flex items-center justify-between p-4 bg-slate-950/90 border-2 border-cyan-400 rounded-3xl backdrop-blur-2xl shadow-2xl"
          >
            {/* Touch D-Pad */}
            <div className="grid grid-cols-3 gap-1.5 w-32 h-32">
              <div />
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onDpadAction?.('up');
                }}
                className="bg-slate-800 active:bg-cyan-500 active:text-slate-950 border border-cyan-500/40 rounded-xl flex items-center justify-center font-bold text-lg text-cyan-300 shadow"
              >
                ▲
              </button>
              <div />

              <button
                onClick={() => {
                  soundEngine.playClick();
                  onDpadAction?.('left');
                }}
                className="bg-slate-800 active:bg-cyan-500 active:text-slate-950 border border-cyan-500/40 rounded-xl flex items-center justify-center font-bold text-lg text-cyan-300 shadow"
              >
                ◀
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onSelectAction?.();
                }}
                className="bg-cyan-950 active:bg-cyan-400 active:text-slate-950 border border-cyan-400 rounded-xl flex items-center justify-center font-bold text-xs text-cyan-200 shadow"
              >
                OK
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onDpadAction?.('right');
                }}
                className="bg-slate-800 active:bg-cyan-500 active:text-slate-950 border border-cyan-500/40 rounded-xl flex items-center justify-center font-bold text-lg text-cyan-300 shadow"
              >
                ▶
              </button>

              <div />
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onDpadAction?.('down');
                }}
                className="bg-slate-800 active:bg-cyan-500 active:text-slate-950 border border-cyan-500/40 rounded-xl flex items-center justify-center font-bold text-lg text-cyan-300 shadow"
              >
                ▼
              </button>
              <div />
            </div>

            {/* Touch Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onSelectAction?.();
                }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/40 flex items-center justify-center active:scale-95 transition"
              >
                {promptStyle === 'playstation' ? '✕' : promptStyle === 'generic' ? '1' : 'A'}
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  onCancelAction?.();
                }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-700 text-white font-black text-sm shadow-lg shadow-rose-600/40 flex items-center justify-center active:scale-95 transition"
              >
                {promptStyle === 'playstation' ? '○' : promptStyle === 'generic' ? '2' : 'B'}
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  onHintAction?.();
                }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-600 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/40 flex items-center justify-center active:scale-95 transition"
              >
                {promptStyle === 'playstation' ? '□' : promptStyle === 'generic' ? '3' : 'X'}
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  onAnalyzeAction?.();
                }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-700 text-white font-black text-sm shadow-lg shadow-purple-600/40 flex items-center justify-center active:scale-95 transition"
              >
                {promptStyle === 'playstation' ? '△' : promptStyle === 'generic' ? '4' : 'Y'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
