import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChessPiece, ChessMove, BoardTheme, PieceType, PieceColor } from '../types/game';
import { ChessGameState, toSquareNotation, getAllLegalMoves, isInside } from '../utils/chessEngine';
import { PIECE_CHARACTER_MAP } from '../data/characters';
import { soundEngine } from '../utils/audio';

interface ChessBoardProps {
  state: ChessGameState;
  onMakeMove: (move: ChessMove) => void;
  theme: BoardTheme;
  playerColor: PieceColor;
  isFlipped?: boolean;
  hintMove?: { from: string; to: string } | null;
  graphicsQuality: 'ultra' | 'high' | 'medium' | 'low';
}

const CHESS_SYMBOLS: Record<PieceType, { w: string; b: string }> = {
  k: { w: '♔', b: '♚' },
  q: { w: '♕', b: '♛' },
  r: { w: '♖', b: '♜' },
  b: { w: '♗', b: '♝' },
  n: { w: '♘', b: '♞' },
  p: { w: '♙', b: '♟' }
};

export const ChessBoard: React.FC<ChessBoardProps> = ({
  state,
  onMakeMove,
  theme,
  playerColor,
  isFlipped = false,
  hintMove,
  graphicsQuality
}) => {
  const [selectedSquare, setSelectedSquare] = useState<{ row: number; col: number } | null>(null);
  const [legalMovesForSelected, setLegalMovesForSelected] = useState<ChessMove[]>([]);
  const [pendingPromotionMove, setPendingPromotionMove] = useState<ChessMove | null>(null);

  const { board, turn, isCheck, moveHistory } = state;
  const lastMove = moveHistory[moveHistory.length - 1];

  // Theme configuration
  const themeStyles = {
    tempest: {
      lightSquare: 'bg-emerald-950/40 border-cyan-500/20 text-cyan-200',
      darkSquare: 'bg-cyan-950/80 border-cyan-600/30 text-cyan-400',
      boardBorder: 'border-cyan-500/50 shadow-cyan-950/80 ring-cyan-400/30',
      boardGlow: 'from-cyan-950/40 via-slate-950/90 to-emerald-950/40',
      name: 'Jura Tempest Great Forest'
    },
    walpurgis: {
      lightSquare: 'bg-stone-900/60 border-red-500/20 text-rose-200',
      darkSquare: 'bg-red-950/80 border-red-600/30 text-rose-400',
      boardBorder: 'border-rose-500/50 shadow-rose-950/80 ring-rose-400/30',
      boardGlow: 'from-red-950/40 via-slate-950/90 to-purple-950/40',
      name: 'Demon Lord Banquet Walpurgis'
    },
    lubelius: {
      lightSquare: 'bg-slate-800/60 border-amber-500/20 text-amber-100',
      darkSquare: 'bg-indigo-950/80 border-indigo-500/30 text-amber-300',
      boardBorder: 'border-amber-400/50 shadow-amber-950/80 ring-amber-300/30',
      boardGlow: 'from-indigo-950/40 via-slate-950/90 to-amber-950/40',
      name: 'Holy Empire Lubelius Sanctuary'
    },
    cave: {
      lightSquare: 'bg-slate-900/60 border-purple-500/20 text-purple-200',
      darkSquare: 'bg-purple-950/80 border-purple-600/30 text-purple-400',
      boardBorder: 'border-purple-500/50 shadow-purple-950/80 ring-purple-400/30',
      boardGlow: 'from-purple-950/40 via-slate-950/90 to-slate-950/40',
      name: 'Sealed Crystal Cave of Veldora'
    }
  }[theme];

  const allLegal = getAllLegalMoves(state);

  const handleSquareClick = (row: number, col: number) => {
    // If promotion popup is open, ignore board clicks
    if (pendingPromotionMove) return;

    const clickedPiece = board[row][col];

    // If currently selected a piece, check if click is a legal move
    if (selectedSquare) {
      const targetMove = legalMovesForSelected.find(
        m => m.to.row === row && m.to.col === col
      );

      if (targetMove) {
        // If it's a promotion, open promotion selector
        if (targetMove.piece.type === 'p' && (row === 0 || row === 7)) {
          setPendingPromotionMove(targetMove);
          soundEngine.playClick();
          return;
        }

        // Normal move execute
        soundEngine.playMove();
        if (targetMove.captured) {
          soundEngine.playCapture();
        }
        onMakeMove(targetMove);
        setSelectedSquare(null);
        setLegalMovesForSelected([]);
        return;
      }
    }

    // Select piece if it belongs to current player's turn
    if (clickedPiece && clickedPiece.color === turn) {
      soundEngine.playClick();
      setSelectedSquare({ row, col });
      const moves = allLegal.filter(m => m.from.row === row && m.from.col === col);
      setLegalMovesForSelected(moves);
    } else {
      setSelectedSquare(null);
      setLegalMovesForSelected([]);
    }
  };

  const handlePromoteChoice = (promoType: PieceType) => {
    if (!pendingPromotionMove) return;
    const finalMove: ChessMove = {
      ...pendingPromotionMove,
      promotion: promoType
    };
    soundEngine.playSkillActivation();
    if (finalMove.captured) {
      soundEngine.playCapture();
    }
    onMakeMove(finalMove);
    setPendingPromotionMove(null);
    setSelectedSquare(null);
    setLegalMovesForSelected([]);
  };

  // Convert row and col for display if flipped
  const rows = isFlipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
  const cols = isFlipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      
      {/* Outer 3D Mesh Rim & Dynamic Rune Border */}
      <div className={`relative p-3 md:p-4 rounded-3xl bg-gradient-to-br ${themeStyles.boardGlow} border-2 ${themeStyles.boardBorder} shadow-2xl backdrop-blur-xl ring-4 max-w-[95vw] sm:max-w-[560px] md:max-w-[620px] lg:max-w-[680px] w-full transition-all`}>
        
        {/* Ambient Top Lighting Glow on Ultra & High */}
        {(graphicsQuality === 'ultra' || graphicsQuality === 'high') && (
          <div className="absolute top-0 left-1/4 right-1/4 h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-[2px] opacity-75" />
        )}

        {/* Board Grid 8x8 */}
        <div className="grid grid-cols-8 grid-rows-8 aspect-square w-full rounded-2xl overflow-hidden border border-slate-700/60 shadow-inner bg-slate-950">
          {rows.map((r) =>
            cols.map((c) => {
              const isDark = (r + c) % 2 === 1;
              const piece = board[r][c];
              const isSelected = selectedSquare?.row === r && selectedSquare?.col === c;
              const isLegalTarget = legalMovesForSelected.some(m => m.to.row === r && m.to.col === c);
              const isKingCheck = isCheck && piece && piece.type === 'k' && piece.color === turn;
              const isLastMoveFrom = lastMove && lastMove.from.row === r && lastMove.from.col === c;
              const isLastMoveTo = lastMove && lastMove.to.row === r && lastMove.to.col === c;
              const squareNotation = toSquareNotation(r, c);
              const isHinted = hintMove && (hintMove.from === squareNotation || hintMove.to === squareNotation);

              const pieceKey = piece ? `${piece.color}-${piece.type}` : '';
              const characterInfo = pieceKey ? PIECE_CHARACTER_MAP[pieceKey] : null;

              return (
                <div
                  key={`sq-${r}-${c}`}
                  id={`square-${squareNotation}`}
                  onClick={() => handleSquareClick(r, c)}
                  className={`
                    relative flex items-center justify-center cursor-pointer transition-all duration-150
                    ${isDark ? themeStyles.darkSquare : themeStyles.lightSquare}
                    ${isSelected ? 'ring-4 ring-cyan-400 z-20 bg-cyan-900/60' : ''}
                    ${isLastMoveFrom || isLastMoveTo ? 'bg-amber-500/25 ring-2 ring-amber-400/40' : ''}
                    ${isKingCheck ? 'ring-4 ring-rose-500 animate-pulse bg-rose-950/80 z-20' : ''}
                    ${isHinted ? 'ring-4 ring-amber-400 animate-bounce bg-amber-900/50 z-20' : ''}
                    hover:brightness-125
                  `}
                >
                  {/* Subtle Square Coordinate Labels */}
                  {c === (isFlipped ? 7 : 0) && (
                    <span className="absolute top-0.5 left-1 text-[9px] font-mono font-bold opacity-40">
                      {8 - r}
                    </span>
                  )}
                  {r === (isFlipped ? 0 : 7) && (
                    <span className="absolute bottom-0.5 right-1 text-[9px] font-mono font-bold opacity-40">
                      {String.fromCharCode(97 + c)}
                    </span>
                  )}

                  {/* Valid Move Indicator Dots / Capture Rings */}
                  {isLegalTarget && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      {piece ? (
                        <div className="w-full h-full rounded-full border-4 border-rose-400/80 bg-rose-500/20 animate-pulse" />
                      ) : (
                        <div className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/60 ring-2 ring-cyan-200 animate-ping" style={{ animationDuration: '2s' }} />
                      )}
                    </div>
                  )}

                  {/* Chess Piece with Tensura Character Crest & Aura */}
                  {piece && (
                    <motion.div
                      layoutId={`piece-${piece.id}`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                      className={`
                        relative flex flex-col items-center justify-center w-full h-full p-1
                        ${piece.color === 'w' ? 'text-cyan-100 drop-shadow-[0_4px_8px_rgba(6,182,212,0.6)]' : 'text-rose-200 drop-shadow-[0_4px_8px_rgba(244,63,94,0.6)]'}
                      `}
                    >
                      {/* Character Mini Avatar Icon */}
                      {characterInfo && (
                        <span className="text-[10px] md:text-xs absolute -top-1 right-0.5 z-10 opacity-90 drop-shadow">
                          {characterInfo.avatar}
                        </span>
                      )}

                      {/* Primary Chess Glyph */}
                      <span className="text-3xl sm:text-4xl md:text-5xl font-serif font-black leading-none select-none">
                        {CHESS_SYMBOLS[piece.type][piece.color]}
                      </span>

                      {/* Character Name Tag on Hover */}
                      {characterInfo && (
                        <span className="text-[8px] sm:text-[9px] font-mono tracking-tighter opacity-70 truncate max-w-full leading-none mt-0.5 hidden sm:inline-block">
                          {characterInfo.name.split(' ')[0]}
                        </span>
                      )}
                    </motion.div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Pawn Promotion Modal */}
      <AnimatePresence>
        {pendingPromotionMove && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md rounded-3xl p-6"
          >
            <div className="bg-gradient-to-b from-slate-900 to-cyan-950 border-2 border-cyan-400 p-6 rounded-2xl shadow-2xl text-center max-w-md w-full">
              <span className="text-3xl">✨</span>
              <h3 className="text-xl font-bold font-['Orbitron'] text-cyan-200 mt-2">
                PAWN EVOLUTION / PROMOTION
              </h3>
              <p className="text-xs text-slate-300 mt-1 mb-4">
                Select your evolved Tensura combat form:
              </p>

              <div className="grid grid-cols-4 gap-3">
                {[
                  { type: 'q' as PieceType, label: 'Queen (Raphael)', icon: '♛', avatar: '✨' },
                  { type: 'r' as PieceType, label: 'Rook (Veldora)', icon: '♜', avatar: '⚡' },
                  { type: 'b' as PieceType, label: 'Bishop (Diablo)', icon: '♝', avatar: '🖤' },
                  { type: 'n' as PieceType, label: 'Knight (Benimaru)', icon: '♞', avatar: '🔥' }
                ].map((promo) => (
                  <button
                    key={promo.type}
                    onClick={() => handlePromoteChoice(promo.type)}
                    className="flex flex-col items-center p-3 rounded-xl bg-slate-800/80 hover:bg-cyan-600/80 border border-cyan-500/40 hover:border-cyan-300 transition group shadow-lg"
                  >
                    <span className="text-3xl text-cyan-300 group-hover:scale-110 transition-transform">
                      {promo.icon}
                    </span>
                    <span className="text-xs font-bold text-slate-200 mt-1">
                      {promo.label.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-cyan-400 opacity-80">
                      {promo.avatar}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
