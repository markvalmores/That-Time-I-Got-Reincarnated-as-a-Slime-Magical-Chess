const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  }, [currentScreen, timerMode, isGameOverOpen, gameMode, chessState.turn, checkersState.turn]);`;
const replacement = `  }, [currentScreen, timerMode, isGameOverOpen, isReplayMode, gameMode, chessState.turn, checkersState.turn]);`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  console.log("Success deps");
} else {
  console.log("Failed deps");
}

fs.writeFileSync('src/App.tsx', code);
