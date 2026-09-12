import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckersPiece, CheckersMove, BoardTheme } from '../types/game';
import { CheckersGameState, getAllCheckersLegalMoves } from '../utils/checkersEngine';
import { soundEngine } from '../utils/audio';
import { TensuraAvatar } from './TensuraAvatar';

interface CheckersBoardProps {
  state: CheckersGameState;
  onMakeMove: (move: CheckersMove) => void;
  theme: BoardTheme;
  playerColor: 'w' | 'b';
  graphicsQuality: 'ultra' | 'high' | 'medium' | 'low';
  gamepadCursor?: { row: number; col: number } | null;
  onSquareHover?: (row: number, col: number) => void;
}

export const CheckersBoard: React.FC<CheckersBoardProps> = ({
  state,
  onMakeMove,
  theme,
  playerColor,
  graphicsQuality,
  gamepadCursor,
  onSquareHover
}) => {
  const [selectedSquare, setSelectedSquare] = useState<{ row: number; col: number } | null>(null);
  const [legalMovesForSelected, setLegalMovesForSelected] = useState<CheckersMove[]>([]);

  const { board, turn, moveHistory } = state;
  const lastMove = moveHistory[moveHistory.length - 1];

  const allLegalMoves = getAllCheckersLegalMoves(state);

  const themeStyles = {
    tempest: {
      lightSquare: 'bg-emerald-950/30 border-cyan-500/10 text-cyan-200',
      darkSquare: 'bg-cyan-950/80 border-cyan-500/30 text-cyan-400',
      boardBorder: 'border-cyan-500/50 shadow-cyan-950/80 ring-cyan-400/30',
      boardGlow: 'from-cyan-950/40 via-slate-950/90 to-emerald-950/40',
    },
    walpurgis: {
      lightSquare: 'bg-stone-900/50 border-red-500/10 text-rose-200',
      darkSquare: 'bg-red-950/80 border-red-500/30 text-rose-400',
      boardBorder: 'border-rose-500/50 shadow-rose-950/80 ring-rose-400/30',
      boardGlow: 'from-red-950/40 via-slate-950/90 to-purple-950/40',
    },
    lubelius: {
      lightSquare: 'bg-slate-800/50 border-amber-500/10 text-amber-100',
      darkSquare: 'bg-indigo-950/80 border-indigo-500/30 text-amber-300',
      boardBorder: 'border-amber-400/50 shadow-amber-950/80 ring-amber-300/30',
      boardGlow: 'from-indigo-950/40 via-slate-950/90 to-amber-950/40',
    },
    cave: {
      lightSquare: 'bg-slate-900/50 border-purple-500/10 text-purple-200',
      darkSquare: 'bg-purple-950/80 border-purple-500/30 text-purple-400',
      boardBorder: 'border-purple-500/50 shadow-purple-950/80 ring-purple-400/30',
      boardGlow: 'from-purple-950/40 via-slate-950/90 to-slate-950/40',
    }
  }[theme];

  const handleSquareClick = (r: number, c: number) => {
    const piece = board[r][c];

    if (selectedSquare) {
      const targetMove = legalMovesForSelected.find(
        m => m.to.row === r && m.to.col === c
      );

      if (targetMove) {
        soundEngine.playMove();
        if (targetMove.jumped && targetMove.jumped.length > 0) {
          soundEngine.playCapture();
        }
        if (targetMove.promotedToKing) {
          soundEngine.playSkillActivation();
        }
        onMakeMove(targetMove);
        setSelectedSquare(null);
        setLegalMovesForSelected([]);
        return;
      }
    }

    if (piece && piece.color === turn) {
      const moves = allLegalMoves.filter(m => m.from.row === r && m.from.col === c);
      if (moves.length > 0) {
        soundEngine.playClick();
        setSelectedSquare({ row: r, col: c });
        setLegalMovesForSelected(moves);
      } else {
        soundEngine.playClick();
        setSelectedSquare(null);
        setLegalMovesForSelected([]);
      }
    } else {
      setSelectedSquare(null);
      setLegalMovesForSelected([]);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none w-full">
      
      {/* Outer 3D Board Wrapper */}
      <div className={`relative p-2 sm:p-3 md:p-4 rounded-3xl bg-gradient-to-br ${themeStyles.boardGlow} border-2 ${themeStyles.boardBorder} shadow-2xl backdrop-blur-xl ring-4 max-w-[95vw] sm:max-w-[560px] md:max-w-[620px] lg:max-w-[680px] w-full transition-all`}>
        
        {/* Board Grid */}
        <div className="grid grid-cols-8 grid-rows-8 aspect-square w-full rounded-2xl overflow-hidden border border-slate-700/60 shadow-inner bg-slate-950">
          {Array.from({ length: 8 }).map((_, r) =>
            Array.from({ length: 8 }).map((_, c) => {
              const isDark = (r + c) % 2 === 1;
              const piece = board[r][c];
              const isSelected = selectedSquare?.row === r && selectedSquare?.col === c;
              const isGamepadFocused = gamepadCursor?.row === r && gamepadCursor?.col === c;
              const isLegalTarget = legalMovesForSelected.some(m => m.to.row === r && m.to.col === c);
              const isLastFrom = lastMove && lastMove.from.row === r && lastMove.from.col === c;
              const isLastTo = lastMove && lastMove.to.row === r && lastMove.to.col === c;

              return (
                <div
                  key={`checkers-sq-${r}-${c}`}
                  onClick={() => isDark && handleSquareClick(r, c)}
                  onMouseEnter={() => onSquareHover?.(r, c)}
                  className={`
                    relative flex items-center justify-center transition-all duration-150 p-1
                    ${isDark ? themeStyles.darkSquare : themeStyles.lightSquare}
                    ${isDark ? 'cursor-pointer hover:brightness-125' : 'cursor-not-allowed opacity-30'}
                    ${isSelected ? 'ring-4 ring-cyan-400 z-20 bg-cyan-900/70' : ''}
                    ${isGamepadFocused ? 'ring-4 ring-amber-300 ring-offset-1 ring-offset-slate-950 z-20 bg-amber-900/40 animate-pulse' : ''}
                    ${isLastFrom || isLastTo ? 'bg-amber-500/25 ring-2 ring-amber-400/40' : ''}
                  `}
                >
                  {/* Legal Jump / Move Ring */}
                  {isLegalTarget && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cyan-400/50 border-2 border-cyan-300 ring-2 ring-cyan-200 animate-ping" />
                    </div>
                  )}

                  {/* Checkers Piece Token with Anime Picture */}
                  {piece && (
                    <motion.div
                      layoutId={`checkers-piece-${piece.id}`}
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      className={`
                        w-4/5 h-4/5 rounded-full flex flex-col items-center justify-center shadow-2xl relative overflow-hidden border-2
                        ${piece.color === 'w' 
                          ? 'border-cyan-300 ring-2 ring-cyan-400/60 shadow-cyan-500/50 bg-gradient-to-tr from-cyan-600 via-blue-500 to-cyan-300' 
                          : 'border-rose-400 ring-2 ring-rose-500/60 shadow-rose-500/50 bg-gradient-to-tr from-rose-700 via-red-600 to-amber-600'}
                        ${piece.isKing ? 'ring-4 ring-amber-300' : ''}
                      `}
                    >
                      {/* Character Artwork Thumbnail */}
                      <TensuraAvatar 
                        src={piece.color === 'w' 
                          ? 'https://cdn.myanimelist.net/images/characters/8/364239.jpg'
                          : 'https://cdn.myanimelist.net/images/characters/13/447230.jpg'
                        }
                        name={piece.color === 'w' ? 'Rimuru Slime' : 'Guy Crimson'}
                        avatarIcon={piece.color === 'w' ? '💧' : '👑'}
                        avatarBg={piece.color === 'w' ? 'from-cyan-600 to-blue-700' : 'from-rose-700 to-red-900'}
                        className="w-full h-full object-cover opacity-90"
                      />

                      {/* King Crown Overlay */}
                      {piece.isKing && (
                        <span className="absolute inset-0 flex items-center justify-center text-xl sm:text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] animate-pulse bg-slate-950/40">
                          👑
                        </span>
                      )}

                      {/* Token Rim Badge */}
                      <span className="absolute bottom-0.5 text-[7px] font-mono font-bold tracking-tighter opacity-90 uppercase leading-none bg-slate-950/80 px-1 rounded text-cyan-200">
                        {piece.isKing ? 'KING' : (piece.color === 'w' ? 'SLIME' : 'DEMON')}
                      </span>
                    </motion.div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
};
