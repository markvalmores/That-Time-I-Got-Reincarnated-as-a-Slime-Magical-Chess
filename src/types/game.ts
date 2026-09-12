export type GameMode = 'chess' | 'checkers';

export type AIDifficulty = 'easy' | 'normal' | 'hard' | 'grandmaster' | 'king';

export type TimerMode = 'none' | '1m' | '3m' | '5m' | '10m' | '15m';

export type BoardTheme = 'tempest' | 'walpurgis' | 'lubelius' | 'cave';

export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k'; // Pawn, Knight, Bishop, Rook, Queen, King
export type PieceColor = 'w' | 'b'; // White / Black (or Rimuru Alliance vs Demon Lord Coalition)

export interface ChessPiece {
  id: string;
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean;
  characterId?: string;
}

export interface ChessMove {
  from: { row: number; col: number };
  to: { row: number; col: number };
  piece: ChessPiece;
  captured?: ChessPiece;
  promotion?: PieceType;
  isEnPassant?: boolean;
  isCastle?: 'kingside' | 'queenside';
  isCheck?: boolean;
  isCheckmate?: boolean;
  san?: string; // Standard Algebraic Notation
}

export interface CheckersPiece {
  id: string;
  color: 'w' | 'b'; // Light (Tempest) vs Dark (Opponent)
  isKing: boolean;
  characterId?: string;
}

export interface CheckersMove {
  from: { row: number; col: number };
  to: { row: number; col: number };
  piece: CheckersPiece;
  jumped?: { row: number; col: number; piece: CheckersPiece }[];
  promotedToKing?: boolean;
}

export interface TensuraCharacter {
  id: string;
  name: string;
  title: string;
  race: string;
  element: 'water' | 'fire' | 'lightning' | 'dark' | 'holy' | 'space' | 'earth' | 'wind';
  ep: number; // Existence Points (Power Level)
  ultimateSkill: string;
  ultimateDescription: string;
  avatarBg: string;
  accentColor: string;
  glowColor: string;
  avatarIcon: string;
  voiceLines: {
    start: string;
    capture: string;
    check: string;
    advantage: string;
    loss: string;
    win: string;
  };
}

export interface DeviceInfo {
  ip: string;
  networkIp?: string;
  deviceIp?: string;
  userAgent: string;
  platform: string;
  cpuCores: number;
  deviceMemory: number; // in GB
  gpuRenderer: string;
  gpuVendor: string;
  maxTextureSize: number;
  webgl2Supported: boolean;
  screenResolution: string;
  pixelRatio: number;
  screenRefreshRateEstimate: number;
  targetFPS: number;
  currentFPS: number;
  frameTimeMs: number;
  batteryStatus?: {
    level: number;
    charging: boolean;
  };
  downlinkMbps?: number;
  rttMs?: number;
  graphicsQuality: 'ultra' | 'high' | 'medium' | 'low';
}

export interface GreatSageAnalysis {
  advice: string;
  skillTip: string;
  winRate: number; // 0 to 100
  evalScore: number;
  bestMove?: { from: string; to: string };
  threatLevel: 'low' | 'moderate' | 'high' | 'critical';
  isAnalyzing: boolean;
}
