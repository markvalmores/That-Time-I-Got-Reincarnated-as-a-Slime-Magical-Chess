import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GameMode, 
  AIDifficulty, 
  TimerMode, 
  BoardTheme, 
  TensuraCharacter, 
  DeviceInfo, 
  GreatSageAnalysis, 
  ChessMove, 
  CheckersMove,
  VideoSettings,
  ControllerPromptStyle
} from './types/game';
import { TENSURA_CHARACTERS } from './data/characters';
import { 
  createInitialGameState, 
  makeMove as makeChessMove, 
  getAIMove as getChessAIMove, 
  evaluateBoard as evaluateChessBoard,
  toSquareNotation,
  getAllLegalMoves 
} from './utils/chessEngine';
import { 
  createInitialCheckersState, 
  makeCheckersMove, 
  getAICheckersMove, 
  evaluateCheckersBoard,
  getAllCheckersLegalMoves 
} from './utils/checkersEngine';
import { detectCompleteDeviceInfo, FPSTracker } from './utils/hardware';
import { soundEngine } from './utils/audio';
import { globalGamepad } from './utils/gamepad';

// Components
import { TitleScreen } from './components/TitleScreen';
import { CharacterSelectScreen } from './components/CharacterSelectScreen';
import { ChessBoard } from './components/ChessBoard';
import { CheckersBoard } from './components/CheckersBoard';
import { GreatSageHUD } from './components/GreatSageHUD';
import { CharacterBanter } from './components/CharacterBanter';
import { GameHUD } from './components/GameHUD';
import { MatchSetupModal } from './components/MatchSetupModal';
import { HardwareMonitorModal } from './components/HardwareMonitorModal';
import { CharacterEncyclopedia } from './components/CharacterEncyclopedia';
import { GameOverModal } from './components/GameOverModal';
import { VideoBackground } from './components/VideoBackground';
import { ControllerHUD } from './components/ControllerHUD';

export default function App() {
  // Screen views: 'title' | 'character-select' | 'game'
  const [currentScreen, setCurrentScreen] = useState<'title' | 'character-select' | 'game'>('title');

  // Video Background Global Settings (Default: Background Video Music Auto ON)
  const [videoSettings, setVideoSettings] = useState<VideoSettings>({
    showVideo: true,
    isMuted: false, // Default: Background Video Music Auto ON
    zoom: 1.5,
    opacity: 0.85,
    fitMode: 'cover',
    panX: 0,
    panY: 0
  });

  // Controller Prompt Display Style: 'playstation' | 'xbox' | 'generic' | 'nintendo'
  const [promptStyle, setPromptStyle] = useState<ControllerPromptStyle>('playstation');

  // Gamepad / Keyboard Board Cursor Focus
  const [gamepadCursor, setGamepadCursor] = useState<{ row: number; col: number }>({ row: 6, col: 4 });

  // Match Config
  const [gameMode, setGameMode] = useState<GameMode>('chess');
  const [difficulty, setDifficulty] = useState<AIDifficulty>('grandmaster');
  const [timerMode, setTimerMode] = useState<TimerMode>('none');
  const [theme, setTheme] = useState<BoardTheme>('tempest');
  const [isVsAI, setIsVsAI] = useState<boolean>(true);
  const [playerCharacter, setPlayerCharacter] = useState<TensuraCharacter>(TENSURA_CHARACTERS[0]);
  const [opponentCharacter, setOpponentCharacter] = useState<TensuraCharacter>(TENSURA_CHARACTERS[1]);
  const [isBoardFlipped, setIsBoardFlipped] = useState<boolean>(false);

  // Active Game States
  const [chessState, setChessState] = useState(createInitialGameState());
  const [checkersState, setCheckersState] = useState(createInitialCheckersState());
  const [isAIThinking, setIsAIThinking] = useState<boolean>(false);

  // Clocks
  const [whiteTime, setWhiteTime] = useState<number>(300);
  const [blackTime, setBlackTime] = useState<number>(300);

  // Great Sage Analysis HUD State
  const [greatSage, setGreatSage] = useState<GreatSageAnalysis>({
    advice: '<<Report>> Battle initialized. Control the central squares with pawn and knight coordination.',
    skillTip: 'Rimuru’s Predator skill triggers when capturing high-value enemy pieces.',
    winRate: 50,
    evalScore: 0,
    threatLevel: 'low',
    isAnalyzing: false
  });
  const [hintMove, setHintMove] = useState<{ from: string; to: string } | null>(null);

  // Opponent / Player Dialogue Banter
  const [banterDialogue, setBanterDialogue] = useState<string | null>(null);
  const [banterSpeaker, setBanterSpeaker] = useState<TensuraCharacter>(opponentCharacter);

  // Modals
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isHardwareOpen, setIsHardwareOpen] = useState(false);
  const [isEncyclopediaOpen, setIsEncyclopediaOpen] = useState(false);
  const [isGameOverOpen, setIsGameOverOpen] = useState(false);
  const [gameOverWinner, setGameOverWinner] = useState<'w' | 'b' | 'draw' | null>(null);
  const [gameOverReason, setGameOverReason] = useState<string>('');

  // Hardware Diagnostics & Device Information
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // FPS Tracker Ref
  const fpsTrackerRef = useRef<FPSTracker | null>(null);

  // Initialize Hardware specs and FPS monitor
  useEffect(() => {
    detectCompleteDeviceInfo().then((info) => {
      setDeviceInfo(info);
    });

    const tracker = new FPSTracker();
    fpsTrackerRef.current = tracker;
    tracker.start((fps, frameTime) => {
      setDeviceInfo(prev => prev ? { ...prev, currentFPS: fps, frameTimeMs: frameTime } : null);
    });

    return () => {
      tracker.stop();
    };
  }, []);

  // Update prompt style in GamepadManager
  const handleUpdatePromptStyle = (style: ControllerPromptStyle) => {
    setPromptStyle(style);
    globalGamepad.setPromptStyle(style);
  };

  const handleUpdateVideoSettings = (newSettings: Partial<VideoSettings>) => {
    setVideoSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Timer Countdown loop
  useEffect(() => {
    if (currentScreen !== 'game' || timerMode === 'none' || isGameOverOpen) return;

    const interval = setInterval(() => {
      const currentTurn = gameMode === 'chess' ? chessState.turn : checkersState.turn;

      if (currentTurn === 'w') {
        setWhiteTime(prev => {
          if (prev <= 1) {
            handleTimeOut('w');
            return 0;
          }
          if (prev <= 10) soundEngine.playTick(true);
          return prev - 1;
        });
      } else {
        setBlackTime(prev => {
          if (prev <= 1) {
            handleTimeOut('b');
            return 0;
          }
          if (prev <= 10) soundEngine.playTick(true);
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentScreen, timerMode, isGameOverOpen, gameMode, chessState.turn, checkersState.turn]);

  const handleTimeOut = (lostColor: 'w' | 'b') => {
    const winner = lostColor === 'w' ? 'b' : 'w';
    setGameOverWinner(winner);
    setGameOverReason(`Victory on Time! (${lostColor === 'w' ? playerCharacter.name : opponentCharacter.name} ran out of time)`);
    setIsGameOverOpen(true);
  };

  // Trigger Gemini / Great Sage AI evaluation
  const runGreatSageAnalysis = useCallback(async (currentScore: number, lastMoveText?: string, inCheck: boolean = false) => {
    setGreatSage(prev => ({ ...prev, isAnalyzing: true }));
    try {
      const res = await fetch('/api/gemini/great-sage-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameMode,
          turn: gameMode === 'chess' ? chessState.turn : checkersState.turn,
          difficulty,
          lastMove: lastMoveText,
          inCheck,
          evalScore: currentScore,
          playerCharacter: playerCharacter.name,
          opponentCharacter: opponentCharacter.name
        })
      });

      if (res.ok) {
        const data = await res.json();
        setGreatSage({
          advice: data.advice || '<<Report>> Calculation complete.',
          skillTip: data.skillTip || 'Maintain piece synergy.',
          winRate: data.winRate || 50,
          evalScore: currentScore,
          threatLevel: inCheck ? 'critical' : currentScore < -2 ? 'high' : 'low',
          isAnalyzing: false
        });
      } else {
        setGreatSage(prev => ({
          ...prev,
          evalScore: currentScore,
          winRate: Math.max(5, Math.min(95, Math.round(50 + currentScore * 8))),
          isAnalyzing: false
        }));
      }
    } catch {
      setGreatSage(prev => ({
        ...prev,
        evalScore: currentScore,
        winRate: Math.max(5, Math.min(95, Math.round(50 + currentScore * 8))),
        isAnalyzing: false
      }));
    }
  }, [gameMode, chessState.turn, checkersState.turn, difficulty, playerCharacter.name, opponentCharacter.name]);

  // Request Character Dialogue Banter
  const triggerCharacterBanter = useCallback(async (speaker: TensuraCharacter, event: 'move' | 'capture' | 'check' | 'win' | 'loss', moveText?: string) => {
    setBanterSpeaker(speaker);
    try {
      const res = await fetch('/api/gemini/character-dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character: speaker.name,
          event,
          playerMove: moveText
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.dialogue) {
          setBanterDialogue(data.dialogue);
        }
      } else {
        const defaultLines = speaker.voiceLines;
        setBanterDialogue(defaultLines[event] || defaultLines.start);
      }
    } catch {
      const defaultLines = speaker.voiceLines;
      setBanterDialogue(defaultLines[event] || defaultLines.start);
    }
  }, []);

  // Handle Chess Player Move
  const handleChessPlayerMove = (move: ChessMove) => {
    setHintMove(null);
    const nextState = makeChessMove(chessState, move);
    setChessState(nextState);

    const evalScore = (evaluateChessBoard(nextState.board) / 100);

    // Dialogue triggers
    if (move.captured) {
      triggerCharacterBanter(playerCharacter, 'capture', `Captured piece on ${toSquareNotation(move.to.row, move.to.col)}`);
    } else if (nextState.isCheck) {
      soundEngine.playCheck();
      triggerCharacterBanter(playerCharacter, 'check');
    }

    runGreatSageAnalysis(evalScore, `Move to ${toSquareNotation(move.to.row, move.to.col)}`, nextState.isCheck);

    // Check for game over
    if (nextState.isCheckmate) {
      setGameOverWinner(nextState.turn === 'w' ? 'b' : 'w');
      setGameOverReason('Checkmate! Ultimate victory achieved.');
      setIsGameOverOpen(true);
      return;
    }
    if (nextState.isStalemate) {
      setGameOverWinner('draw');
      setGameOverReason('Stalemate! No legal moves remaining.');
      setIsGameOverOpen(true);
      return;
    }

    // AI Turn trigger if vs AI
    if (isVsAI && nextState.turn === 'b') {
      setIsAIThinking(true);
      const thinkDelay = difficulty === 'easy' ? 400 : difficulty === 'normal' ? 600 : 800;
      setTimeout(() => {
        const aiMove = getChessAIMove(nextState, difficulty);
        if (aiMove) {
          const aiNextState = makeChessMove(nextState, aiMove);
          setChessState(aiNextState);
          soundEngine.playMove();
          if (aiMove.captured) soundEngine.playCapture();

          const aiEval = (evaluateChessBoard(aiNextState.board) / 100);

          if (aiMove.captured) {
            triggerCharacterBanter(opponentCharacter, 'capture', `AI captured on ${toSquareNotation(aiMove.to.row, aiMove.to.col)}`);
          } else if (aiNextState.isCheck) {
            soundEngine.playCheck();
            triggerCharacterBanter(opponentCharacter, 'check');
          }

          runGreatSageAnalysis(aiEval, `Opponent moved to ${toSquareNotation(aiMove.to.row, aiMove.to.col)}`, aiNextState.isCheck);

          if (aiNextState.isCheckmate) {
            setGameOverWinner('b');
            setGameOverReason('Checkmate by Opponent Commander!');
            setIsGameOverOpen(true);
          } else if (aiNextState.isStalemate) {
            setGameOverWinner('draw');
            setGameOverReason('Stalemate!');
            setIsGameOverOpen(true);
          }
        }
        setIsAIThinking(false);
      }, thinkDelay);
    }
  };

  // Handle Checkers Player Move
  const handleCheckersPlayerMove = (move: CheckersMove) => {
    const nextState = makeCheckersMove(checkersState, move);
    setCheckersState(nextState);

    const evalScore = evaluateCheckersBoard(nextState.board) / 100;
    runGreatSageAnalysis(evalScore, `Jump to [${move.to.row}, ${move.to.col}]`, false);

    if (move.jumped && move.jumped.length > 0) {
      triggerCharacterBanter(playerCharacter, 'capture', 'Jump Capture');
    }

    if (nextState.isGameOver) {
      setGameOverWinner(nextState.winner);
      setGameOverReason(nextState.winner === 'w' ? 'All Opponent Pieces Annihilated!' : 'Tempest Pieces Depleted');
      setIsGameOverOpen(true);
      return;
    }

    // AI Turn for Checkers
    if (isVsAI && nextState.turn === 'b') {
      setIsAIThinking(true);
      setTimeout(() => {
        const aiMove = getAICheckersMove(nextState, difficulty);
        if (aiMove) {
          const aiNextState = makeCheckersMove(nextState, aiMove);
          setCheckersState(aiNextState);
          soundEngine.playMove();
          if (aiMove.jumped && aiMove.jumped.length > 0) soundEngine.playCapture();

          const aiEval = evaluateCheckersBoard(aiNextState.board) / 100;
          runGreatSageAnalysis(aiEval, 'AI move', false);

          if (aiNextState.isGameOver) {
            setGameOverWinner(aiNextState.winner);
            setGameOverReason('Checkers match concluded.');
            setIsGameOverOpen(true);
          }
        }
        setIsAIThinking(false);
      }, 600);
    }
  };

  // Start new match
  const startNewMatch = (config: {
    mode: GameMode;
    difficulty: AIDifficulty;
    timerMode: TimerMode;
    theme: BoardTheme;
    playerCharacter: TensuraCharacter;
    opponentCharacter: TensuraCharacter;
    isVsAI: boolean;
  }) => {
    setGameMode(config.mode);
    setDifficulty(config.difficulty);
    setTimerMode(config.timerMode);
    setTheme(config.theme);
    setPlayerCharacter(config.playerCharacter);
    setOpponentCharacter(config.opponentCharacter);
    setIsVsAI(config.isVsAI);

    // Reset board states
    setChessState(createInitialGameState());
    setCheckersState(createInitialCheckersState());
    setIsGameOverOpen(false);
    setGameOverWinner(null);
    setHintMove(null);

    // Initialize timer durations
    const timerMap: Record<TimerMode, number> = {
      none: 0,
      '1m': 60,
      '3m': 180,
      '5m': 300,
      '10m': 600,
      '15m': 900
    };
    const timeVal = timerMap[config.timerMode] || 300;
    setWhiteTime(timeVal);
    setBlackTime(timeVal);

    setCurrentScreen('game');
    triggerCharacterBanter(config.playerCharacter, 'move', 'Battle initiated');
  };

  // Ask Great Sage for optimal hint
  const handleRequestHint = () => {
    if (gameMode === 'chess') {
      const best = getChessAIMove(chessState, 'king');
      if (best) {
        const fromNot = toSquareNotation(best.from.row, best.from.col);
        const toNot = toSquareNotation(best.to.row, best.to.col);
        setHintMove({ from: fromNot, to: toNot });
        setGreatSage(prev => ({
          ...prev,
          advice: `<<Notice>> Optimal calculation: Move piece from ${fromNot.toUpperCase()} to ${toNot.toUpperCase()} to seize maximum positional tempo.`
        }));
      }
    }
  };

  // Undo Move
  const handleUndoMove = () => {
    if (gameMode === 'chess') {
      if (chessState.moveHistory.length >= (isVsAI ? 2 : 1)) {
        const newHistory = isVsAI ? chessState.moveHistory.slice(0, -2) : chessState.moveHistory.slice(0, -1);
        let rebuilt = createInitialGameState();
        for (const m of newHistory) {
          rebuilt = makeChessMove(rebuilt, m);
        }
        setChessState(rebuilt);
        setHintMove(null);
        soundEngine.playMove();
      }
    }
  };

  // Gamepad cursor navigation handler
  const handleDpadMove = (dir: 'up' | 'down' | 'left' | 'right') => {
    setGamepadCursor((prev) => {
      let r = prev.row;
      let c = prev.col;
      if (dir === 'up') r = Math.max(0, r - 1);
      if (dir === 'down') r = Math.min(7, r + 1);
      if (dir === 'left') c = Math.max(0, c - 1);
      if (dir === 'right') c = Math.min(7, c + 1);
      soundEngine.playClick();
      return { row: r, col: c };
    });
  };

  // Gamepad / Keyboard Action Trigger on current board square
  const handleGamepadSelect = () => {
    const squareElement = document.getElementById(`square-${toSquareNotation(gamepadCursor.row, gamepadCursor.col)}`);
    if (squareElement) {
      squareElement.click();
    }
  };

  // Gamepad manager listeners & Keyboard shortcuts setup
  useEffect(() => {
    globalGamepad.setCallbacks({
      onNavigate: handleDpadMove,
      onSelect: handleGamepadSelect,
      onCancel: () => {
        soundEngine.playClick();
        if (currentScreen === 'game') {
          handleUndoMove();
        } else if (currentScreen === 'character-select') {
          setCurrentScreen('title');
        }
      },
      onHint: handleRequestHint,
      onAnalyze: () => {
        const score = gameMode === 'chess' 
          ? evaluateChessBoard(chessState.board) / 100 
          : evaluateCheckersBoard(checkersState.board) / 100;
        runGreatSageAnalysis(score, 'Gamepad Deep Analysis', chessState.isCheck);
      },
      onUndo: handleUndoMove,
      onFlip: () => setIsBoardFlipped(prev => !prev),
      onZoomToggle: () => {
        setVideoSettings(prev => ({
          ...prev,
          zoom: prev.zoom >= 2.0 ? 1.0 : prev.zoom + 0.5
        }));
      },
      onMuteToggle: () => {
        setIsAudioMuted(prev => {
          const next = !prev;
          soundEngine.setMuted(next);
          return next;
        });
      }
    });

    globalGamepad.start();

    // Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') handleDpadMove('up');
      else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') handleDpadMove('down');
      else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') handleDpadMove('left');
      else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') handleDpadMove('right');
      else if (e.key === 'Enter' || e.key === ' ') handleGamepadSelect();
      else if (e.key === 'h' || e.key === 'H') handleRequestHint();
      else if (e.key === 'u' || e.key === 'U') handleUndoMove();
      else if (e.key === 'f' || e.key === 'F') setIsBoardFlipped(prev => !prev);
      else if (e.key === 'Escape') {
        if (currentScreen === 'character-select') setCurrentScreen('title');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      globalGamepad.stop();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentScreen, gameMode, chessState, checkersState, gamepadCursor]);

  // Auto-tune graphics
  const handleAutoTuneGraphics = () => {
    if (!deviceInfo) return;
    const cpu = deviceInfo.cpuCores;
    let target = 144;
    let quality: 'ultra' | 'high' | 'medium' | 'low' = 'high';

    if (cpu >= 8) {
      target = 240;
      quality = 'ultra';
    } else if (cpu >= 4) {
      target = 144;
      quality = 'high';
    } else {
      target = 60;
      quality = 'medium';
    }

    setDeviceInfo(prev => prev ? { ...prev, graphicsQuality: quality, targetFPS: target } : null);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center justify-between relative overflow-x-hidden font-sans">
      
      {/* 1. View Switch: Title Screen vs Character Selection vs Game Board Arena */}
      {currentScreen === 'title' ? (
        <TitleScreen
          onStartGame={(mode, diff) => {
            startNewMatch({
              mode,
              difficulty: diff,
              timerMode: 'none',
              theme: 'tempest',
              playerCharacter: playerCharacter || TENSURA_CHARACTERS[0],
              opponentCharacter: opponentCharacter || TENSURA_CHARACTERS[1],
              isVsAI: true
            });
          }}
          onOpenSetup={(m) => {
            setGameMode(m);
            setIsSetupOpen(true);
          }}
          onOpenCharacterSelect={() => {
            soundEngine.playClick();
            setCurrentScreen('character-select');
          }}
          onOpenEncyclopedia={() => setIsEncyclopediaOpen(true)}
          onOpenHardware={() => setIsHardwareOpen(true)}
          deviceInfo={deviceInfo}
          videoSettings={videoSettings}
          onUpdateVideoSettings={handleUpdateVideoSettings}
          promptStyle={promptStyle}
          onChangePromptStyle={handleUpdatePromptStyle}
        />
      ) : currentScreen === 'character-select' ? (
        <CharacterSelectScreen
          playerCharacter={playerCharacter}
          opponentCharacter={opponentCharacter}
          onConfirmSelection={(p, o) => {
            setPlayerCharacter(p);
            setOpponentCharacter(o);
            startNewMatch({
              mode: gameMode,
              difficulty,
              timerMode,
              theme,
              playerCharacter: p,
              opponentCharacter: o,
              isVsAI
            });
          }}
          onBack={() => setCurrentScreen('title')}
          promptStyle={promptStyle}
        />
      ) : (
        <div className="relative w-full min-h-screen flex flex-col items-center justify-between p-2 sm:p-4 md:p-6 bg-slate-950">
          
          {/* Zoomable Background Video */}
          <VideoBackground 
            settings={videoSettings} 
            onUpdateSettings={handleUpdateVideoSettings} 
            isHomeMenu={false}
          />
          
          {/* Top In-Game Navigation & Turn HUD */}
          <div className="relative z-10 w-full flex justify-center mb-2">
            <GameHUD
              gameMode={gameMode}
              turn={gameMode === 'chess' ? chessState.turn : checkersState.turn}
              playerCharacter={playerCharacter}
              opponentCharacter={opponentCharacter}
              isVsAI={isVsAI}
              whiteTime={whiteTime}
              blackTime={blackTime}
              timerMode={timerMode}
              capturedByWhite={gameMode === 'chess' ? chessState.capturedByWhite : []}
              capturedByBlack={gameMode === 'chess' ? chessState.capturedByBlack : []}
              onUndo={handleUndoMove}
              onResign={() => {
                setGameOverWinner('b');
                setGameOverReason('Resigned Match by Tempest Command.');
                setIsGameOverOpen(true);
              }}
              onDraw={() => {
                setGameOverWinner('draw');
                setGameOverReason('Mutual Diplomatic Draw Agreed.');
                setIsGameOverOpen(true);
              }}
              onFlipBoard={() => setIsBoardFlipped(!isBoardFlipped)}
              onReturnTitle={() => setCurrentScreen('title')}
              onOpenHardware={() => setIsHardwareOpen(true)}
              isVideoMusicOn={!videoSettings.isMuted}
              onToggleVideoMusic={() => {
                soundEngine.playClick();
                handleUpdateVideoSettings({ isMuted: !videoSettings.isMuted });
              }}
              isAudioMuted={isAudioMuted}
              onToggleAudio={() => {
                const nextMute = !isAudioMuted;
                setIsAudioMuted(nextMute);
                soundEngine.setMuted(nextMute);
              }}
              isAIThinking={isAIThinking}
            />
          </div>

          {/* Central Game Board Stage */}
          <main className="relative z-10 w-full flex flex-col items-center justify-center my-auto py-2">
            {gameMode === 'chess' ? (
              <ChessBoard
                state={chessState}
                onMakeMove={handleChessPlayerMove}
                theme={theme}
                playerColor="w"
                isFlipped={isBoardFlipped}
                hintMove={hintMove}
                graphicsQuality={deviceInfo?.graphicsQuality || 'high'}
                gamepadCursor={gamepadCursor}
                onSquareHover={(r, c) => setGamepadCursor({ row: r, col: c })}
              />
            ) : (
              <CheckersBoard
                state={checkersState}
                onMakeMove={handleCheckersPlayerMove}
                theme={theme}
                playerColor="w"
                graphicsQuality={deviceInfo?.graphicsQuality || 'high'}
                gamepadCursor={gamepadCursor}
                onSquareHover={(r, c) => setGamepadCursor({ row: r, col: c })}
              />
            )}
          </main>

          {/* Bottom Great Sage / Raphael Tactical AI HUD & Gamepad Controls Bar */}
          <div className="relative z-10 w-full flex flex-col items-center gap-2 mt-3 max-w-5xl">
            <GreatSageHUD
              analysis={greatSage}
              onTriggerAnalysis={() => {
                const score = gameMode === 'chess' 
                  ? evaluateChessBoard(chessState.board) / 100 
                  : evaluateCheckersBoard(checkersState.board) / 100;
                runGreatSageAnalysis(score, 'Manual Deep Analysis', chessState.isCheck);
              }}
              onRequestHint={handleRequestHint}
              playerCharacter={playerCharacter}
              opponentCharacter={opponentCharacter}
              isAIThinking={isAIThinking}
            />

            {/* Controller HUD Bar (Xbox / PlayStation / Generic / Touch Buttons) */}
            <div className="w-full">
              <ControllerHUD
                promptStyle={promptStyle}
                onChangePromptStyle={handleUpdatePromptStyle}
                onDpadAction={handleDpadMove}
                onSelectAction={handleGamepadSelect}
                onCancelAction={handleUndoMove}
                onHintAction={handleRequestHint}
                onAnalyzeAction={() => {
                  const score = gameMode === 'chess' 
                    ? evaluateChessBoard(chessState.board) / 100 
                    : evaluateCheckersBoard(checkersState.board) / 100;
                  runGreatSageAnalysis(score, 'Touch Deep Analysis', chessState.isCheck);
                }}
                onUndoAction={handleUndoMove}
                onFlipAction={() => setIsBoardFlipped(!isBoardFlipped)}
                showVirtualTouch={true}
              />
            </div>
          </div>

        </div>
      )}

      {/* Floating Animated Character Battle Banter Subtitle Banner */}
      <CharacterBanter
        speaker={banterSpeaker}
        dialogue={banterDialogue}
        onDismiss={() => setBanterDialogue(null)}
      />

      {/* Match Setup Modal */}
      <MatchSetupModal
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        defaultMode={gameMode}
        onStartMatch={startNewMatch}
      />

      {/* Hardware Diagnostics & FPS Monitor Modal */}
      <HardwareMonitorModal
        isOpen={isHardwareOpen}
        onClose={() => setIsHardwareOpen(false)}
        deviceInfo={deviceInfo}
        onUpdateSettings={(q, fps) => {
          setDeviceInfo(prev => prev ? { ...prev, graphicsQuality: q, targetFPS: fps } : null);
        }}
        onRunAutoOptimize={handleAutoTuneGraphics}
      />

      {/* Character Vault & Encyclopedia Modal */}
      <CharacterEncyclopedia
        isOpen={isEncyclopediaOpen}
        onClose={() => setIsEncyclopediaOpen(false)}
        onSelectCharacter={(c) => {
          setPlayerCharacter(c);
        }}
      />

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={isGameOverOpen}
        winner={gameOverWinner}
        reason={gameOverReason}
        playerCharacter={playerCharacter}
        opponentCharacter={opponentCharacter}
        onRematch={() => {
          startNewMatch({
            mode: gameMode,
            difficulty,
            timerMode,
            theme,
            playerCharacter,
            opponentCharacter,
            isVsAI
          });
        }}
        onReturnTitle={() => {
          setIsGameOverOpen(false);
          setCurrentScreen('title');
        }}
      />

    </div>
  );
}
