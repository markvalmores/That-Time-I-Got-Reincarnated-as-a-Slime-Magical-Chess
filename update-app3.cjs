const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  // Clocks`;

const replacement = `  // Replay State Computation
  const activeChessState = React.useMemo(() => {
    if (!isReplayMode || gameMode === 'checkers') return chessState;
    let st = createInitialGameState(gameMode === 'chess960');
    for (let i = 0; i < replayIndex && i < chessState.moveHistory.length; i++) {
      st = makeChessMove(st, chessState.moveHistory[i]);
    }
    return st;
  }, [isReplayMode, gameMode, chessState, replayIndex]);

  const activeCheckersState = React.useMemo(() => {
    if (!isReplayMode || gameMode !== 'checkers') return checkersState;
    let st = createInitialCheckersState();
    for (let i = 0; i < replayIndex && i < checkersState.moveHistory.length; i++) {
      st = makeCheckersMove(st, checkersState.moveHistory[i]);
    }
    return st;
  }, [isReplayMode, gameMode, checkersState, replayIndex]);

  // Clocks`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  console.log("Success computed");
} else {
  console.log("Failed computed");
}

fs.writeFileSync('src/App.tsx', code);
