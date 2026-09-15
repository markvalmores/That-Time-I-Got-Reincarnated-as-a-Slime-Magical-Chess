const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

let target = `onMakeMove={isReplayMode ? () => {} : handleChessPlayerMove}`;
let replacement = `onMakeMove={(isReplayMode || isAIVsAI) ? () => {} : handleChessPlayerMove}`;

code = code.replace(target, replacement);

target = `onMakeMove={isReplayMode ? () => {} : handleCheckersPlayerMove}`;
replacement = `onMakeMove={(isReplayMode || isAIVsAI) ? () => {} : handleCheckersPlayerMove}`;

code = code.replace(target, replacement);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed board interaction for CVC");
