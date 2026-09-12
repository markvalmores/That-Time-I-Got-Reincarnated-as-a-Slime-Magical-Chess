import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChessPiece, ChessMove, BoardTheme, PieceType, PieceColor } from '../types/game';
import { ChessGameState, toSquareNotation, getAllLegalMoves, isInside } from '../utils/chessEngine';
import { PIECE_CHARACTER_MAP } from '../data/characters';
import { soundEngine } from '../utils/audio';
import { TensuraAvatar } from './TensuraAvatar';
import { SkillParticleOverlay } from './SkillParticleOverlay';

interface ChessBoardProps {
  state: ChessGameState;
  onMakeMove: (move: ChessMove) => void;
  theme: BoardTheme;
  playerColor: PieceColor;
  isFlipped?: boolean;
  hintMove?: { from: string; to: string } | null;
  graphicsQuality: 'ultra' | 'high' | 'medium' | 'low';
  gamepadCursor?: { row: number; col: number } | null;
  onSquareHover?: (row: number, col: number) => void;
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
  graphicsQuality,
  gamepadCursor,
  onSquareHover
}) => {
  const [selectedSquare, setSelectedSquare] = useState<{ row: number; col: number } | null>(null);
  const [legalMovesForSelected, setLegalMovesForSelected] = useState<ChessMove[]>([]);
  const [pendingPromotionMove, setPendingPromotionMove] = useState<ChessMove | null>(null);
  
  const [captureEffects, setCaptureEffects] = useState<Array<{ id: string, r: number, c: number, element: string, color: string }>>([]);

  const { board, turn, isCheck, moveHistory } = state;
  const lastMove = moveHistory[moveHistory.length - 1];

  useEffect(() => {
    if (lastMove && lastMove.captured) {
      const pieceKey = `${lastMove.piece.color}-${lastMove.piece.type}`;
      const charInfo = PIECE_CHARACTER_MAP[pieceKey];
      if (charInfo) {
        const id = Date.now().toString() + Math.random();
        setCaptureEffects(prev => [...prev, { id, r: lastMove.to.row, c: lastMove.to.col, element: charInfo.element, color: charInfo.accentColor }]);
        setTimeout(() => {
          setCaptureEffects(prev => prev.filter(e => e.id !== id));
        }, 1500);
      }
    }
  }, [lastMove]);

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
    if (pendingPromotionMove) return;

    const clickedPiece = board[row][col];

    if (selectedSquare) {
      const targetMove = legalMovesForSelected.find(
        m => m.to.row === row && m.to.col === col
      );

      if (targetMove) {
        if (targetMove.piece.type === 'p' && (row === 0 || row === 7)) {
          setPendingPromotionMove(targetMove);
          soundEngine.playClick();
          return;
        }

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

  const rows = isFlipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
  const cols = isFlipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="relative flex flex-col items-center justify-center select-none w-full">
      
      {/* Outer Layered Mesh & Dynamic Rune Border */}
      <div className={`relative p-2 sm:p-3 md:p-4 rounded-3xl bg-gradient-to-br ${themeStyles.boardGlow} border-2 ${themeStyles.boardBorder} shadow-2xl backdrop-blur-xl ring-4 max-w-[95vw] sm:max-w-[560px] md:max-w-[620px] lg:max-w-[680px] w-full transition-all`}>
        
        {/* Ambient Top Light */}
        {(graphicsQuality === 'ultra' || graphicsQuality === 'high') && (
          <div className="absolute top-0 left-1/4 right-1/4 h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-[2px] opacity-75" />
        )}

        {/* 8x8 Chess Grid */}
        <div className="grid grid-cols-8 grid-rows-8 aspect-square w-full rounded-2xl overflow-hidden border border-slate-700/60 shadow-inner bg-slate-950">
          {rows.map((r) =>
            cols.map((c) => {
              const isDark = (r + c) % 2 === 1;
              const piece = board[r][c];
              const isSelected = selectedSquare?.row === r && selectedSquare?.col === c;
              const isGamepadFocused = gamepadCursor?.row === r && gamepadCursor?.col === c;
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
                  onMouseEnter={() => onSquareHover?.(r, c)}
                  className={`
                    relative flex items-center justify-center cursor-pointer transition-all duration-150 p-0.5
                    ${isDark ? themeStyles.darkSquare : themeStyles.lightSquare}
                    ${isSelected ? 'ring-4 ring-cyan-400 z-20 bg-cyan-900/60' : ''}
                    ${isGamepadFocused ? 'ring-4 ring-amber-300 ring-offset-1 ring-offset-slate-950 z-20 bg-amber-900/40 animate-pulse' : ''}
                    ${isLastMoveFrom || isLastMoveTo ? 'bg-amber-500/25 ring-2 ring-amber-400/40' : ''}
                    ${isKingCheck ? 'ring-4 ring-rose-500 animate-pulse bg-rose-950/80 z-20' : ''}
                    ${isHinted ? 'ring-4 ring-amber-400 animate-bounce bg-amber-900/50 z-20' : ''}
                    hover:brightness-125
                  `}
                >
                  {/* Skill / Capture Particle Overlay */}
                  {captureEffects.map(effect => 
                    effect.r === r && effect.c === c ? (
                      <SkillParticleOverlay key={effect.id} element={effect.element} color={effect.color} />
                    ) : null
                  )}

                  {/* Subtle Coordinate Notation */}
                  {c === (isFlipped ? 7 : 0) && (
                    <span className="absolute top-0.5 left-1 text-[8px] sm:text-[9px] font-mono font-bold opacity-40">
                      {8 - r}
                    </span>
                  )}
                  {r === (isFlipped ? 0 : 7) && (
                    <span className="absolute bottom-0.5 right-1 text-[8px] sm:text-[9px] font-mono font-bold opacity-40">
                      {String.fromCharCode(97 + c)}
                    </span>
                  )}

                  {/* Valid Move Indicator Dots / Capture Rings */}
                  {isLegalTarget && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                      {piece ? (
                        <div className="w-full h-full rounded-full border-4 border-rose-400/90 bg-rose-500/25 animate-pulse" />
                      ) : (
                        <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/80 ring-2 ring-cyan-200 animate-ping" style={{ animationDuration: '1.8s' }} />
                      )}
                    </div>
                  )}

                  {/* Chess Piece with Character Image & Avatar Aura */}
                  {piece && (
                    <motion.div
                      layoutId={`piece-${piece.id}`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      className={`
                        relative flex flex-col items-center justify-center w-full h-full p-0.5
                        ${piece.color === 'w' ? 'text-cyan-100' : 'text-rose-200'}
                      `}
                    >
                      {/* Character Anime Picture Token */}
                      <div className={`
                        relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 shadow-lg flex items-center justify-center
                        ${piece.color === 'w' 
                          ? 'border-cyan-300 ring-2 ring-cyan-400/50 shadow-cyan-500/50 bg-gradient-to-tr from-cyan-900 to-slate-900' 
                          : 'border-rose-400 ring-2 ring-rose-500/50 shadow-rose-500/50 bg-gradient-to-tr from-rose-950 to-slate-900'}
                      `}>
                        <TensuraAvatar
                          src={characterInfo?.image}
                          name={characterInfo?.name || 'Tensura Piece'}
                          avatarIcon={characterInfo?.avatar || (piece.color === 'w' ? '💧' : '👑')}
                          avatarBg={piece.color === 'w' ? 'from-cyan-700 to-blue-900' : 'from-rose-800 to-purple-950'}
                          className="w-full h-full object-cover filter contrast-110"
                        />

                        {/* Top Right Mini Chess Symbol Badge */}
                        <div className={`
                          absolute bottom-0 right-0 px-1 py-0.2 rounded-full text-[9px] sm:text-[10px] font-serif font-black leading-none border shadow
                          ${piece.color === 'w' ? 'bg-cyan-950 text-cyan-300 border-cyan-400' : 'bg-rose-950 text-rose-300 border-rose-400'}
                        `}>
                          {CHESS_SYMBOLS[piece.type][piece.color]}
                        </div>
                      </div>

                      {/* Character Name Tag */}
                      {characterInfo && (
                        <span className="text-[7px] sm:text-[8px] md:text-[9px] font-mono tracking-tighter opacity-80 truncate max-w-full leading-none mt-0.5 hidden sm:inline-block">
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
            className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md rounded-3xl p-6"
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
                  { type: 'q' as PieceType, label: 'Queen (Ciel)', icon: '♛', image: 'https://cdn.myanimelist.net/images/characters/16/435165.jpg', avatarIcon: '✨', avatarBg: 'from-blue-500 to-cyan-700' },
                  { type: 'r' as PieceType, label: 'Rook (Veldora)', icon: '♜', image: 'https://cdn.myanimelist.net/images/characters/14/368819.jpg', avatarIcon: '⚡', avatarBg: 'from-amber-500 to-yellow-700' },
                  { type: 'b' as PieceType, label: 'Bishop (Diablo)', icon: '♝', image: 'https://cdn.myanimelist.net/images/characters/9/408990.jpg', avatarIcon: '🖤', avatarBg: 'from-purple-900 to-slate-950' },
                  { type: 'n' as PieceType, label: 'Knight (Benimaru)', icon: '♞', image: 'https://cdn.myanimelist.net/images/characters/11/368821.jpg', avatarIcon: '🔥', avatarBg: 'from-orange-500 to-red-700' }
                ].map((promo) => (
                  <button
                    key={promo.type}
                    onClick={() => handlePromoteChoice(promo.type)}
                    className="flex flex-col items-center p-2 rounded-xl bg-slate-800/90 hover:bg-cyan-600/80 border border-cyan-500/40 hover:border-cyan-300 transition group shadow-lg"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-cyan-300 mb-1">
                      <TensuraAvatar
                        src={promo.image}
                        name={promo.label}
                        avatarIcon={promo.avatarIcon}
                        avatarBg={promo.avatarBg}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-200 truncate w-full">
                      {promo.label.split(' ')[0]}
                    </span>
                    <span className="text-xs text-cyan-300">
                      {promo.icon}
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
