import { CheckersPiece, CheckersMove, AIDifficulty } from '../types/game';

export type CheckersBoard = (CheckersPiece | null)[][];

export interface CheckersGameState {
  board: CheckersBoard;
  turn: 'w' | 'b';
  moveHistory: CheckersMove[];
  isGameOver: boolean;
  winner: 'w' | 'b' | 'draw' | null;
  whiteCount: number;
  blackCount: number;
}

export function createInitialCheckersBoard(): CheckersBoard {
  const board: CheckersBoard = Array(8).fill(null).map(() => Array(8).fill(null));

  // Black pieces on rows 0, 1, 2 on dark squares (r + c is odd)
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 === 1) {
        board[r][c] = { id: `b-c-${r}-${c}`, color: 'b', isKing: false };
      }
    }
  }

  // White pieces on rows 5, 6, 7 on dark squares (r + c is odd)
  for (let r = 5; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 === 1) {
        board[r][c] = { id: `w-c-${r}-${c}`, color: 'w', isKing: false };
      }
    }
  }

  return board;
}

export function createInitialCheckersState(): CheckersGameState {
  return {
    board: createInitialCheckersBoard(),
    turn: 'w',
    moveHistory: [],
    isGameOver: false,
    winner: null,
    whiteCount: 12,
    blackCount: 12
  };
}

function isInside(r: number, c: number): boolean {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

// Get all legal jumps for a piece at (r, c)
export function getCheckersJumpsForPiece(board: CheckersBoard, r: number, c: number): CheckersMove[] {
  const piece = board[r][c];
  if (!piece) return [];

  const moves: CheckersMove[] = [];
  const enemyColor = piece.color === 'w' ? 'b' : 'w';
  const dirs: number[][] = [];

  if (piece.isKing) {
    dirs.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
  } else {
    const forward = piece.color === 'w' ? -1 : 1;
    dirs.push([forward, -1], [forward, 1]);
  }

  for (const [dr, dc] of dirs) {
    const midR = r + dr;
    const midC = c + dc;
    const landR = r + dr * 2;
    const landC = c + dc * 2;

    if (isInside(landR, landC)) {
      const midPiece = board[midR][midC];
      const landPiece = board[landR][landC];

      if (midPiece && midPiece.color === enemyColor && !landPiece) {
        const willPromote = !piece.isKing && ((piece.color === 'w' && landR === 0) || (piece.color === 'b' && landR === 7));
        moves.push({
          from: { row: r, col: c },
          to: { row: landR, col: landC },
          piece,
          jumped: [{ row: midR, col: midC, piece: midPiece }],
          promotedToKing: willPromote
        });
      }
    }
  }

  return moves;
}

// Get all regular non-jump single-step diagonal moves
export function getCheckersSimpleMovesForPiece(board: CheckersBoard, r: number, c: number): CheckersMove[] {
  const piece = board[r][c];
  if (!piece) return [];

  const moves: CheckersMove[] = [];
  const dirs: number[][] = [];

  if (piece.isKing) {
    dirs.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
  } else {
    const forward = piece.color === 'w' ? -1 : 1;
    dirs.push([forward, -1], [forward, 1]);
  }

  for (const [dr, dc] of dirs) {
    const nr = r + dr;
    const nc = c + dc;

    if (isInside(nr, nc) && !board[nr][nc]) {
      const willPromote = !piece.isKing && ((piece.color === 'w' && nr === 0) || (piece.color === 'b' && nr === 7));
      moves.push({
        from: { row: r, col: c },
        to: { row: nr, col: nc },
        piece,
        promotedToKing: willPromote
      });
    }
  }

  return moves;
}

// Generate all legal moves for current turn (captures are prioritized)
export function getAllCheckersLegalMoves(state: CheckersGameState): CheckersMove[] {
  const jumpMoves: CheckersMove[] = [];
  const simpleMoves: CheckersMove[] = [];
  const { board, turn } = state;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color === turn) {
        const jumps = getCheckersJumpsForPiece(board, r, c);
        if (jumps.length > 0) {
          jumpMoves.push(...jumps);
        } else {
          const simples = getCheckersSimpleMovesForPiece(board, r, c);
          simpleMoves.push(...simples);
        }
      }
    }
  }

  // If any jump is available, jumps are mandatory according to standard checkers rules
  return jumpMoves.length > 0 ? jumpMoves : simpleMoves;
}

export function makeCheckersMove(state: CheckersGameState, move: CheckersMove): CheckersGameState {
  const newBoard = state.board.map(r => [...r]);
  const { from, to, piece, jumped, promotedToKing } = move;

  newBoard[from.row][from.col] = null;

  const isNowKing = piece.isKing || !!promotedToKing;
  newBoard[to.row][to.col] = {
    ...piece,
    isKing: isNowKing
  };

  let whiteCount = state.whiteCount;
  let blackCount = state.blackCount;

  if (jumped && jumped.length > 0) {
    for (const j of jumped) {
      newBoard[j.row][j.col] = null;
      if (j.piece.color === 'w') whiteCount--;
      if (j.piece.color === 'b') blackCount--;
    }
  }

  const nextTurn: 'w' | 'b' = state.turn === 'w' ? 'b' : 'w';

  const nextState: CheckersGameState = {
    board: newBoard,
    turn: nextTurn,
    moveHistory: [...state.moveHistory, move],
    isGameOver: false,
    winner: null,
    whiteCount,
    blackCount
  };

  const nextMoves = getAllCheckersLegalMoves(nextState);
  if (nextMoves.length === 0 || whiteCount === 0 || blackCount === 0) {
    nextState.isGameOver = true;
    if (whiteCount === 0) nextState.winner = 'b';
    else if (blackCount === 0) nextState.winner = 'w';
    else nextState.winner = state.turn; // The player who just moved won by immobilization
  }

  return nextState;
}

// Checkers Board Evaluation
export function evaluateCheckersBoard(board: CheckersBoard): number {
  let score = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p) continue;
      const val = p.isKing ? 300 : 100 + (p.color === 'w' ? (7 - r) * 5 : r * 5);
      if (p.color === 'w') score += val;
      else score -= val;
    }
  }
  return score;
}

export function getAICheckersMove(state: CheckersGameState, difficulty: AIDifficulty): CheckersMove | null {
  const moves = getAllCheckersLegalMoves(state);
  if (moves.length === 0) return null;

  if (difficulty === 'easy') {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  let bestMove = moves[0];
  let bestScore = state.turn === 'w' ? -Infinity : Infinity;

  for (const move of moves) {
    const nextState = makeCheckersMove(state, move);
    const score = evaluateCheckersBoard(nextState.board);
    if (state.turn === 'w') {
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    } else {
      if (score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
  }

  return bestMove;
}
