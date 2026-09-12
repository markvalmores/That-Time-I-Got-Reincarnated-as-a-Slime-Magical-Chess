import { ChessPiece, ChessMove, PieceColor, PieceType, AIDifficulty } from '../types/game';

export type BoardState = (ChessPiece | null)[][];

export interface ChessGameState {
  board: BoardState;
  turn: PieceColor;
  castling: {
    w: { k: boolean; q: boolean };
    b: { k: boolean; q: boolean };
  };
  enPassantTarget: { row: number; col: number } | null;
  halfMoveClock: number;
  fullMoveNumber: number;
  moveHistory: ChessMove[];
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  capturedByWhite: ChessPiece[];
  capturedByBlack: ChessPiece[];
}

export const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const PIECE_VALUES: Record<PieceType, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

// Piece square tables for positional bonus
const PAWN_TABLE = [
  [0,  0,  0,  0,  0,  0,  0,  0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5,  5, 10, 25, 25, 10,  5,  5],
  [0,  0,  0, 20, 20,  0,  0,  0],
  [5, -5,-10,  0,  0,-10, -5,  5],
  [5, 10, 10,-20,-20, 10, 10,  5],
  [0,  0,  0,  0,  0,  0,  0,  0]
];

const KNIGHT_TABLE = [
  [-50,-40,-30,-30,-30,-30,-40,-50],
  [-40,-20,  0,  0,  0,  0,-20,-40],
  [-30,  0, 10, 15, 15, 10,  0,-30],
  [-30,  5, 15, 20, 20, 15,  5,-30],
  [-30,  0, 15, 20, 20, 15,  0,-30],
  [-30,  5, 10, 15, 15, 10,  5,-30],
  [-40,-20,  0,  5,  5,  0,-20,-40],
  [-50,-40,-30,-30,-30,-30,-40,-50]
];

export function createInitialBoard(): BoardState {
  const board: BoardState = Array(8).fill(null).map(() => Array(8).fill(null));

  const backRank: PieceType[] = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];

  // Black pieces (top: rows 0 and 1)
  for (let c = 0; c < 8; c++) {
    board[0][c] = { id: `b-${backRank[c]}-${c}`, type: backRank[c], color: 'b' };
    board[1][c] = { id: `b-p-${c}`, type: 'p', color: 'b' };
  }

  // White pieces (bottom: rows 7 and 6)
  for (let c = 0; c < 8; c++) {
    board[6][c] = { id: `w-p-${c}`, type: 'p', color: 'w' };
    board[7][c] = { id: `w-${backRank[c]}-${c}`, type: backRank[c], color: 'w' };
  }

  return board;
}

export function createInitialGameState(): ChessGameState {
  return {
    board: createInitialBoard(),
    turn: 'w',
    castling: {
      w: { k: true, q: true },
      b: { k: true, q: true }
    },
    enPassantTarget: null,
    halfMoveClock: 0,
    fullMoveNumber: 1,
    moveHistory: [],
    isCheck: false,
    isCheckmate: false,
    isStalemate: false,
    capturedByWhite: [],
    capturedByBlack: []
  };
}

export function isInside(r: number, c: number): boolean {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

// Check if square is attacked by opponent
export function isSquareAttacked(board: BoardState, row: number, col: number, attackerColor: PieceColor): boolean {
  // Pawn attacks
  const pawnDir = attackerColor === 'w' ? 1 : -1; // White attacks upward (row + 1 to row)
  const pawnRow = row + pawnDir;
  if (isInside(pawnRow, col - 1)) {
    const p = board[pawnRow][col - 1];
    if (p && p.color === attackerColor && p.type === 'p') return true;
  }
  if (isInside(pawnRow, col + 1)) {
    const p = board[pawnRow][col + 1];
    if (p && p.color === attackerColor && p.type === 'p') return true;
  }

  // Knight attacks
  const knightOffsets = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ];
  for (const [dr, dc] of knightOffsets) {
    const nr = row + dr;
    const nc = col + dc;
    if (isInside(nr, nc)) {
      const p = board[nr][nc];
      if (p && p.color === attackerColor && p.type === 'n') return true;
    }
  }

  // King attacks
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (isInside(nr, nc)) {
        const p = board[nr][nc];
        if (p && p.color === attackerColor && p.type === 'k') return true;
      }
    }
  }

  // Straight lines: Rook & Queen
  const straightDirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  for (const [dr, dc] of straightDirs) {
    let nr = row + dr;
    let nc = col + dc;
    while (isInside(nr, nc)) {
      const p = board[nr][nc];
      if (p) {
        if (p.color === attackerColor && (p.type === 'r' || p.type === 'q')) return true;
        break;
      }
      nr += dr;
      nc += dc;
    }
  }

  // Diagonal lines: Bishop & Queen
  const diagDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  for (const [dr, dc] of diagDirs) {
    let nr = row + dr;
    let nc = col + dc;
    while (isInside(nr, nc)) {
      const p = board[nr][nc];
      if (p) {
        if (p.color === attackerColor && (p.type === 'b' || p.type === 'q')) return true;
        break;
      }
      nr += dr;
      nc += dc;
    }
  }

  return false;
}

export function findKing(board: BoardState, color: PieceColor): { row: number; col: number } | null {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.color === color && p.type === 'k') {
        return { row: r, col: c };
      }
    }
  }
  return null;
}

export function isKingInCheck(board: BoardState, color: PieceColor): boolean {
  const king = findKing(board, color);
  if (!king) return false;
  const opponentColor = color === 'w' ? 'b' : 'w';
  return isSquareAttacked(board, king.row, king.col, opponentColor);
}

// Generate pseudo-legal moves for a piece
export function getPseudoLegalMoves(
  state: ChessGameState,
  row: number,
  col: number
): ChessMove[] {
  const { board, castling, enPassantTarget } = state;
  const piece = board[row][col];
  if (!piece) return [];

  const moves: ChessMove[] = [];
  const color = piece.color;
  const enemyColor = color === 'w' ? 'b' : 'w';
  const forward = color === 'w' ? -1 : 1;
  const startRow = color === 'w' ? 6 : 1;
  const promotionRow = color === 'w' ? 0 : 7;

  switch (piece.type) {
    case 'p': {
      // 1 square forward
      const nextRow = row + forward;
      if (isInside(nextRow, col) && !board[nextRow][col]) {
        if (nextRow === promotionRow) {
          (['q', 'r', 'b', 'n'] as PieceType[]).forEach((promo) => {
            moves.push({ from: { row, col }, to: { row: nextRow, col }, piece, promotion: promo });
          });
        } else {
          moves.push({ from: { row, col }, to: { row: nextRow, col }, piece });
        }

        // 2 squares forward from start
        const doubleRow = row + forward * 2;
        if (row === startRow && !board[doubleRow][col]) {
          moves.push({ from: { row, col }, to: { row: doubleRow, col }, piece });
        }
      }

      // Diagonal captures
      for (const dc of [-1, 1]) {
        const targetCol = col + dc;
        if (isInside(nextRow, targetCol)) {
          const targetPiece = board[nextRow][targetCol];
          if (targetPiece && targetPiece.color === enemyColor) {
            if (nextRow === promotionRow) {
              (['q', 'r', 'b', 'n'] as PieceType[]).forEach((promo) => {
                moves.push({ from: { row, col }, to: { row: nextRow, col: targetCol }, piece, captured: targetPiece, promotion: promo });
              });
            } else {
              moves.push({ from: { row, col }, to: { row: nextRow, col: targetCol }, piece, captured: targetPiece });
            }
          } else if (enPassantTarget && enPassantTarget.row === nextRow && enPassantTarget.col === targetCol) {
            const capturedPawn = board[row][targetCol];
            if (capturedPawn && capturedPawn.color === enemyColor && capturedPawn.type === 'p') {
              moves.push({
                from: { row, col },
                to: { row: nextRow, col: targetCol },
                piece,
                captured: capturedPawn,
                isEnPassant: true
              });
            }
          }
        }
      }
      break;
    }

    case 'n': {
      const knightOffsets = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      for (const [dr, dc] of knightOffsets) {
        const nr = row + dr;
        const nc = col + dc;
        if (isInside(nr, nc)) {
          const destPiece = board[nr][nc];
          if (!destPiece) {
            moves.push({ from: { row, col }, to: { row: nr, col: nc }, piece });
          } else if (destPiece.color === enemyColor) {
            moves.push({ from: { row, col }, to: { row: nr, col: nc }, piece, captured: destPiece });
          }
        }
      }
      break;
    }

    case 'b':
    case 'r':
    case 'q': {
      const dirs: number[][] = [];
      if (piece.type === 'b' || piece.type === 'q') {
        dirs.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
      }
      if (piece.type === 'r' || piece.type === 'q') {
        dirs.push([-1, 0], [1, 0], [0, -1], [0, 1]);
      }

      for (const [dr, dc] of dirs) {
        let nr = row + dr;
        let nc = col + dc;
        while (isInside(nr, nc)) {
          const destPiece = board[nr][nc];
          if (!destPiece) {
            moves.push({ from: { row, col }, to: { row: nr, col: nc }, piece });
          } else {
            if (destPiece.color === enemyColor) {
              moves.push({ from: { row, col }, to: { row: nr, col: nc }, piece, captured: destPiece });
            }
            break;
          }
          nr += dr;
          nc += dc;
        }
      }
      break;
    }

    case 'k': {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = row + dr;
          const nc = col + dc;
          if (isInside(nr, nc)) {
            const destPiece = board[nr][nc];
            if (!destPiece) {
              moves.push({ from: { row, col }, to: { row: nr, col: nc }, piece });
            } else if (destPiece.color === enemyColor) {
              moves.push({ from: { row, col }, to: { row: nr, col: nc }, piece, captured: destPiece });
            }
          }
        }
      }

      // Castling
      const side = color;
      const rank = color === 'w' ? 7 : 0;
      if (row === rank && col === 4 && !isKingInCheck(board, color)) {
        // Kingside castling
        if (castling[side].k && !board[rank][5] && !board[rank][6]) {
          if (!isSquareAttacked(board, rank, 5, enemyColor) && !isSquareAttacked(board, rank, 6, enemyColor)) {
            moves.push({ from: { row, col }, to: { row: rank, col: 6 }, piece, isCastle: 'kingside' });
          }
        }
        // Queenside castling
        if (castling[side].q && !board[rank][1] && !board[rank][2] && !board[rank][3]) {
          if (!isSquareAttacked(board, rank, 2, enemyColor) && !isSquareAttacked(board, rank, 3, enemyColor)) {
            moves.push({ from: { row, col }, to: { row: rank, col: 2 }, piece, isCastle: 'queenside' });
          }
        }
      }
      break;
    }
  }

  return moves;
}

// Apply move to a clone of board to check validity
export function applyMoveOnBoard(board: BoardState, move: ChessMove): BoardState {
  const newBoard = board.map(r => [...r]);
  const { from, to, piece, promotion, isEnPassant, isCastle } = move;

  newBoard[from.row][from.col] = null;
  const placedPiece: ChessPiece = {
    ...piece,
    type: promotion || piece.type,
    hasMoved: true
  };
  newBoard[to.row][to.col] = placedPiece;

  if (isEnPassant) {
    // Remove the captured pawn on original row
    newBoard[from.row][to.col] = null;
  }

  if (isCastle === 'kingside') {
    const rook = newBoard[to.row][7];
    newBoard[to.row][7] = null;
    newBoard[to.row][5] = rook ? { ...rook, hasMoved: true } : null;
  } else if (isCastle === 'queenside') {
    const rook = newBoard[to.row][0];
    newBoard[to.row][0] = null;
    newBoard[to.row][3] = rook ? { ...rook, hasMoved: true } : null;
  }

  return newBoard;
}

// Generate all strictly LEGAL moves for current side
export function getAllLegalMoves(state: ChessGameState): ChessMove[] {
  const legalMoves: ChessMove[] = [];
  const { board, turn } = state;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color === turn) {
        const pseudo = getPseudoLegalMoves(state, r, c);
        for (const move of pseudo) {
          const simulatedBoard = applyMoveOnBoard(board, move);
          if (!isKingInCheck(simulatedBoard, turn)) {
            legalMoves.push(move);
          }
        }
      }
    }
  }

  return legalMoves;
}

// Execute move in game state and update all status flags
export function makeMove(state: ChessGameState, move: ChessMove): ChessGameState {
  const newBoard = applyMoveOnBoard(state.board, move);
  const nextTurn: PieceColor = state.turn === 'w' ? 'b' : 'w';

  // Castling rights update
  const newCastling = {
    w: { ...state.castling.w },
    b: { ...state.castling.b }
  };

  if (move.piece.type === 'k') {
    newCastling[move.piece.color].k = false;
    newCastling[move.piece.color].q = false;
  }
  if (move.piece.type === 'r') {
    if (move.from.row === 7 && move.from.col === 7) newCastling.w.k = false;
    if (move.from.row === 7 && move.from.col === 0) newCastling.w.q = false;
    if (move.from.row === 0 && move.from.col === 7) newCastling.b.k = false;
    if (move.from.row === 0 && move.from.col === 0) newCastling.b.q = false;
  }

  // En passant target calculation
  let newEnPassantTarget: { row: number; col: number } | null = null;
  if (move.piece.type === 'p' && Math.abs(move.to.row - move.from.row) === 2) {
    newEnPassantTarget = {
      row: (move.from.row + move.to.row) / 2,
      col: move.from.col
    };
  }

  // Captured pieces lists
  const capturedByWhite = [...state.capturedByWhite];
  const capturedByBlack = [...state.capturedByBlack];
  if (move.captured) {
    if (state.turn === 'w') {
      capturedByWhite.push(move.captured);
    } else {
      capturedByBlack.push(move.captured);
    }
  }

  const nextState: ChessGameState = {
    board: newBoard,
    turn: nextTurn,
    castling: newCastling,
    enPassantTarget: newEnPassantTarget,
    halfMoveClock: move.captured || move.piece.type === 'p' ? 0 : state.halfMoveClock + 1,
    fullMoveNumber: state.turn === 'b' ? state.fullMoveNumber + 1 : state.fullMoveNumber,
    moveHistory: [...state.moveHistory, move],
    isCheck: isKingInCheck(newBoard, nextTurn),
    isCheckmate: false,
    isStalemate: false,
    capturedByWhite,
    capturedByBlack
  };

  // Check end conditions
  const nextLegal = getAllLegalMoves(nextState);
  if (nextLegal.length === 0) {
    if (nextState.isCheck) {
      nextState.isCheckmate = true;
    } else {
      nextState.isStalemate = true;
    }
  }

  return nextState;
}

// Convert coordinates to standard chess square notation (e.g., e4, g1)
export function toSquareNotation(row: number, col: number): string {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
  return `${files[col]}${ranks[row]}`;
}

// Static board evaluation score for white (positive = white advantage, negative = black advantage)
export function evaluateBoard(board: BoardState): number {
  let score = 0;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p) continue;

      const baseVal = PIECE_VALUES[p.type];
      let posVal = 0;

      if (p.type === 'p') {
        posVal = p.color === 'w' ? PAWN_TABLE[r][c] : PAWN_TABLE[7 - r][c];
      } else if (p.type === 'n') {
        posVal = p.color === 'w' ? KNIGHT_TABLE[r][c] : KNIGHT_TABLE[7 - r][c];
      } else if (p.type === 'k') {
        // slight incentive for castled king safety
        if (p.color === 'w' && r === 7 && (c === 6 || c === 2)) posVal += 20;
        if (p.color === 'b' && r === 0 && (c === 6 || c === 2)) posVal += 20;
      }

      const totalVal = baseVal + posVal;
      if (p.color === 'w') {
        score += totalVal;
      } else {
        score -= totalVal;
      }
    }
  }

  return score;
}

// Minimax with Alpha-Beta Pruning
function minimax(
  state: ChessGameState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): { score: number; bestMove?: ChessMove } {
  if (depth === 0 || state.isCheckmate || state.isStalemate) {
    if (state.isCheckmate) {
      return { score: isMaximizing ? -99999 : 99999 };
    }
    if (state.isStalemate) {
      return { score: 0 };
    }
    return { score: evaluateBoard(state.board) };
  }

  const legalMoves = getAllLegalMoves(state);
  if (legalMoves.length === 0) {
    return { score: state.isCheck ? (isMaximizing ? -99999 : 99999) : 0 };
  }

  // Tactical move ordering: captures and checks first
  legalMoves.sort((a, b) => {
    const aScore = (a.captured ? 10 : 0) + (a.promotion ? 8 : 0);
    const bScore = (b.captured ? 10 : 0) + (b.promotion ? 8 : 0);
    return bScore - aScore;
  });

  let bestMove: ChessMove | undefined = legalMoves[0];

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of legalMoves) {
      const nextState = makeMove(state, move);
      const evalResult = minimax(nextState, depth - 1, alpha, beta, false);
      if (evalResult.score > maxEval) {
        maxEval = evalResult.score;
        bestMove = move;
      }
      alpha = Math.max(alpha, evalResult.score);
      if (beta <= alpha) break;
    }
    return { score: maxEval, bestMove };
  } else {
    let minEval = Infinity;
    for (const move of legalMoves) {
      const nextState = makeMove(state, move);
      const evalResult = minimax(nextState, depth - 1, alpha, beta, true);
      if (evalResult.score < minEval) {
        minEval = evalResult.score;
        bestMove = move;
      }
      beta = Math.min(beta, evalResult.score);
      if (beta <= alpha) break;
    }
    return { score: minEval, bestMove };
  }
}

// Compute AI Move based on difficulty
export function getAIMove(state: ChessGameState, difficulty: AIDifficulty): ChessMove | null {
  const legalMoves = getAllLegalMoves(state);
  if (legalMoves.length === 0) return null;

  const isWhite = state.turn === 'w';

  switch (difficulty) {
    case 'easy': {
      // 70% random move, 30% shallow evaluation
      if (Math.random() < 0.6) {
        const randomIndex = Math.floor(Math.random() * legalMoves.length);
        return legalMoves[randomIndex];
      }
      const result = minimax(state, 1, -Infinity, Infinity, isWhite);
      return result.bestMove || legalMoves[0];
    }

    case 'normal': {
      // Depth 2 search
      const result = minimax(state, 2, -Infinity, Infinity, isWhite);
      return result.bestMove || legalMoves[0];
    }

    case 'hard': {
      // Depth 3 search with positional tables
      const result = minimax(state, 3, -Infinity, Infinity, isWhite);
      return result.bestMove || legalMoves[0];
    }

    case 'grandmaster': {
      // Depth 3-4 search
      const result = minimax(state, 3, -Infinity, Infinity, isWhite);
      return result.bestMove || legalMoves[0];
    }

    case 'king':
    default: {
      // Depth 4 search (Demon Lord / Raphael Level)
      const result = minimax(state, 4, -Infinity, Infinity, isWhite);
      return result.bestMove || legalMoves[0];
    }
  }
}
