const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const chessTarget = `<ChessBoard
                state={chessState}
                onMakeMove={handleChessPlayerMove}`;
const chessReplace = `<ChessBoard
                state={activeChessState}
                onMakeMove={isReplayMode ? () => {} : handleChessPlayerMove}`;

const checkersTarget = `<CheckersBoard
                state={checkersState}
                onMakeMove={handleCheckersPlayerMove}`;
const checkersReplace = `<CheckersBoard
                state={activeCheckersState}
                onMakeMove={isReplayMode ? () => {} : handleCheckersPlayerMove}`;

if (code.includes(chessTarget)) {
  code = code.replace(chessTarget, chessReplace);
  console.log("Success chess");
}
if (code.includes(checkersTarget)) {
  code = code.replace(checkersTarget, checkersReplace);
  console.log("Success checkers");
}

fs.writeFileSync('src/App.tsx', code);
