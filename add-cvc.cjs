const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetEffect = `  // Match Setup & Controls`;

const cvcEffect = `  // CVC (CPU vs CPU) Auto-Play Loop
  useEffect(() => {
    if (isAIVsAI && currentScreen === 'game' && !isGameOverOpen && !isReplayMode) {
      if (gameMode.startsWith('chess')) {
        setIsAIThinking(true);
        const thinkDelay = difficulty === 'easy' ? 400 : difficulty === 'normal' ? 600 : 800;
        const t = setTimeout(() => {
          const aiMove = getChessAIMove(chessState, difficulty);
          if (aiMove) {
            const aiNextState = makeChessMove(chessState, aiMove);
            setChessState(aiNextState);
            soundEngine.playMove();
            if (aiMove.captured) soundEngine.playCapture();

            const aiEval = evaluateChessBoard(aiNextState.board) / 100;
            
            if (aiNextState.isCheckmate) {
              setGameOverWinner(chessState.turn);
              setGameOverReason('Checkmate by CPU Commander!');
              setIsGameOverOpen(true);
              soundEngine.playCheckmate(false);
            } else if (aiNextState.isDraw) {
              setGameOverWinner('draw');
              setGameOverReason('Equilibrium Reached (Draw).');
              setIsGameOverOpen(true);
            } else if (aiNextState.isCheck) {
              soundEngine.playCheck();
              triggerCharacterBanter(chessState.turn === 'w' ? playerCharacter : opponentCharacter, 'check');
            }
            
            runGreatSageAnalysis(aiEval, \`CPU moved to \${toSquareNotation(aiMove.to.row, aiMove.to.col)}\`, aiNextState.isCheck);
          }
          setIsAIThinking(false);
        }, thinkDelay);
        return () => clearTimeout(t);
      } else {
        setIsAIThinking(true);
        const t = setTimeout(() => {
          const aiMove = getAICheckersMove(checkersState, difficulty);
          if (aiMove) {
            const aiNextState = makeCheckersMove(checkersState, aiMove);
            setCheckersState(aiNextState);
            soundEngine.playMove();
            if (aiMove.jumped && aiMove.jumped.length > 0) soundEngine.playCapture();

            const aiEval = evaluateCheckersBoard(aiNextState.board) / 100;
            runGreatSageAnalysis(aiEval, 'CPU move', false);

            if (aiNextState.isGameOver) {
              setGameOverWinner(aiNextState.winner);
              setGameOverReason('Checkers match concluded.');
              setIsGameOverOpen(true);
            }
          }
          setIsAIThinking(false);
        }, 600);
        return () => clearTimeout(t);
      }
    }
  }, [isAIVsAI, currentScreen, isGameOverOpen, isReplayMode, gameMode, difficulty, chessState, checkersState]);

  // Match Setup & Controls`;

if (code.includes(targetEffect)) {
  code = code.replace(targetEffect, cvcEffect);
  console.log("Added CVC Loop");
}

fs.writeFileSync('src/App.tsx', code);
