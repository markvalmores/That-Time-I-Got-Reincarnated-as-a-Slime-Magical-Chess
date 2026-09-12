import React from 'react';
import { motion } from 'motion/react';
import { 
  RotateCcw, 
  Flag, 
  Volume2, 
  VolumeX, 
  Music,
  Home, 
  Cpu, 
  Sparkles, 
  Clock, 
  Repeat, 
  Handshake 
} from 'lucide-react';
import { TensuraCharacter, GameMode, TimerMode, PieceColor } from '../types/game';
import { soundEngine } from '../utils/audio';
import { TensuraAvatar } from './TensuraAvatar';

interface GameHUDProps {
  gameMode: GameMode;
  turn: 'w' | 'b';
  playerCharacter: TensuraCharacter;
  opponentCharacter: TensuraCharacter;
  isVsAI: boolean;
  whiteTime: number; // in seconds
  blackTime: number; // in seconds
  timerMode: TimerMode;
  capturedByWhite: any[];
  capturedByBlack: any[];
  onUndo: () => void;
  onResign: () => void;
  onDraw: () => void;
  onFlipBoard: () => void;
  onReturnTitle: () => void;
  onOpenHardware: () => void;
  isVideoMusicOn: boolean;
  onToggleVideoMusic: () => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
  isAIThinking: boolean;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  gameMode,
  turn,
  playerCharacter,
  opponentCharacter,
  isVsAI,
  whiteTime,
  blackTime,
  timerMode,
  capturedByWhite,
  capturedByBlack,
  onUndo,
  onResign,
  onDraw,
  onFlipBoard,
  onReturnTitle,
  onOpenHardware,
  isVideoMusicOn,
  onToggleVideoMusic,
  isAudioMuted,
  onToggleAudio,
  isAIThinking
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isPlayerTurn = turn === 'w';

  return (
    <div className="w-full max-w-5xl flex flex-col gap-3 px-2 select-none">
      
      {/* Top Bar: Action Buttons & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-900/80 border border-cyan-500/20 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundEngine.playClick();
              onReturnTitle();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition"
            title="Return to Main Title Screen"
          >
            <Home className="w-3.5 h-3.5 text-cyan-400" />
            <span>Title Screen</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onFlipBoard();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition"
            title="Flip Board View"
          >
            <Repeat className="w-3.5 h-3.5 text-amber-400" />
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onUndo();
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition"
            title="Undo Last Move"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Undo</span>
          </button>
        </div>

        {/* Turn Status Pill */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950 border border-cyan-500/40 font-mono text-xs font-bold shadow-inner">
          <span className={`w-2 h-2 rounded-full ${isPlayerTurn ? 'bg-cyan-400' : 'bg-rose-500'} animate-ping`} />
          <span className={isPlayerTurn ? 'text-cyan-300' : 'text-rose-400'}>
            {isPlayerTurn ? `${playerCharacter.name}'s Turn` : `${opponentCharacter.name} Thinking...`}
          </span>
        </div>

        {/* Right Tools: Video Music, Draw, Resign, Sound, Hardware */}
        <div className="flex items-center gap-1.5">
          {/* Background Video Music Toggle (Default Auto ON) */}
          <button
            onClick={onToggleVideoMusic}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition border ${
              isVideoMusicOn 
                ? 'bg-cyan-950 text-cyan-300 border-cyan-400/80 shadow-md shadow-cyan-500/20' 
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title={`Background Video Music: ${isVideoMusicOn ? 'ON (Auto default)' : 'OFF'}`}
          >
            <Music className={`w-3.5 h-3.5 ${isVideoMusicOn ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">{isVideoMusicOn ? 'Music ON' : 'Music OFF'}</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onDraw();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition"
            title="Offer Peaceful Draw"
          >
            <Handshake className="w-3.5 h-3.5 text-emerald-400" />
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onResign();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-rose-400 border border-transparent hover:border-rose-500/40 text-xs font-mono transition"
            title="Surrender / Resign Match"
          >
            <Flag className="w-3.5 h-3.5 text-rose-400" />
          </button>

          <button
            onClick={onToggleAudio}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title={isAudioMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
          >
            {isAudioMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenHardware();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 transition"
            title="Open Hardware & FPS Diagnostics"
          >
            <Cpu className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Opponent & Player Cards Bar */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* Player Card (White / Tempest) */}
        <div className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
          isPlayerTurn
            ? 'bg-gradient-to-r from-slate-900 via-cyan-950/60 to-slate-900 border-cyan-400 ring-2 ring-cyan-400/30 shadow-lg shadow-cyan-950/50'
            : 'bg-slate-900/60 border-slate-800 opacity-80'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl overflow-hidden border border-cyan-300 shadow shrink-0">
              <TensuraAvatar
                src={playerCharacter.image}
                name={playerCharacter.name}
                avatarIcon={playerCharacter.avatarIcon}
                avatarBg={playerCharacter.avatarBg}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-white truncate">{playerCharacter.name}</h4>
                <span className="text-[9px] font-mono bg-cyan-950 text-cyan-400 px-1.5 py-0.2 rounded border border-cyan-500/30">
                  TEMPEST
                </span>
              </div>
              <span className="text-[10px] text-cyan-300 font-mono block truncate">
                {playerCharacter.ultimateSkill.split('&')[0]}
              </span>
            </div>
          </div>

          {/* Clock if enabled */}
          {timerMode !== 'none' && (
            <div className={`flex items-center gap-1 font-mono text-sm font-bold px-2.5 py-1 rounded-lg border ${
              whiteTime <= 30 ? 'bg-rose-950 text-rose-300 border-rose-500 animate-pulse' : 'bg-slate-950 text-cyan-300 border-cyan-500/30'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(whiteTime)}</span>
            </div>
          )}
        </div>

        {/* Opponent Card (Black / Rival) */}
        <div className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
          !isPlayerTurn
            ? 'bg-gradient-to-r from-slate-900 via-rose-950/60 to-slate-900 border-rose-400 ring-2 ring-rose-400/30 shadow-lg shadow-rose-950/50'
            : 'bg-slate-900/60 border-slate-800 opacity-80'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl overflow-hidden border border-rose-300 shadow shrink-0">
              <TensuraAvatar
                src={opponentCharacter.image}
                name={opponentCharacter.name}
                avatarIcon={opponentCharacter.avatarIcon}
                avatarBg={opponentCharacter.avatarBg}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-white truncate">{opponentCharacter.name}</h4>
                <span className="text-[9px] font-mono bg-rose-950 text-rose-400 px-1.5 py-0.2 rounded border border-rose-500/30">
                  {isVsAI ? 'A.I.' : 'P2'}
                </span>
              </div>
              <span className="text-[10px] text-rose-300 font-mono block truncate">
                {opponentCharacter.ultimateSkill.split('&')[0]}
              </span>
            </div>
          </div>

          {/* Clock if enabled */}
          {timerMode !== 'none' && (
            <div className={`flex items-center gap-1 font-mono text-sm font-bold px-2.5 py-1 rounded-lg border ${
              blackTime <= 30 ? 'bg-rose-950 text-rose-300 border-rose-500 animate-pulse' : 'bg-slate-950 text-rose-300 border-rose-500/30'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(blackTime)}</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
