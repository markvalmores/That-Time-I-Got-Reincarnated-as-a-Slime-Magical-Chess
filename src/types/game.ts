export type GameMode = 'chess' | 'checkers';

export type AIDifficulty = 'easy' | 'normal' | 'hard' | 'grandmaster' | 'king';

export type TimerMode = 'none' | '1m' | '3m' | '5m' | '10m' | '15m';

export type BoardTheme = 'tempest' | 'walpurgis' | 'lubelius' | 'cave';

export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k'; // Pawn, Knight, Bishop, Rook, Queen, King
export type PieceColor = 'w' | 'b'; // White (Tempest / Octagram Allies) vs Black (Demon Lords / Eastern Empire Rivals)

export type ControllerPromptStyle = 'xbox' | 'playstation' | 'generic' | 'nintendo';

export type VideoZoomLevel = '0.8' | '1.0' | '1.25' | '1.5' | '2.0' | '2.5';
export type VideoFitMode = 'cover' | 'fit' | 'fill' | 'pan';

export interface VideoSettings {
  showVideo: boolean;
  isMuted: boolean;
  zoom: number; // 0.8 to 2.5
  opacity: number; // 0.2 to 1.0
  fitMode: VideoFitMode;
  panX: number; // -50 to 50
  panY: number; // -50 to 50
}

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
  jpName: string;
  title: string;
  season: 'Season 1' | 'Season 2' | 'Season 3' | 'Season 4' | 'Movie / LN';
  race: string;
  element: 'water' | 'fire' | 'lightning' | 'dark' | 'holy' | 'space' | 'earth' | 'wind' | 'ice';
  ep: number; // Existence Points (Power Level)
  ultimateSkill: string;
  ultimateDescription: string;
  image: string; // High-res anime sprite image URL
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

export interface GamepadButtonStatus {
  connected: boolean;
  id: string;
  type: ControllerPromptStyle;
  buttons: {
    a_cross: boolean;
    b_circle: boolean;
    x_square: boolean;
    y_triangle: boolean;
    lb_l1: boolean;
    rb_r1: boolean;
    lt_l2: boolean;
    rt_r2: boolean;
    select_share: boolean;
    start_options: boolean;
    dpad_up: boolean;
    dpad_down: boolean;
    dpad_left: boolean;
    dpad_right: boolean;
  };
  axes: {
    leftX: number;
    leftY: number;
    rightX: number;
    rightY: number;
  };
}
