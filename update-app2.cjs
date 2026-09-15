const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `    setGameOverWinner(null);
    setHintMove(null);`;

const replacement = `    setGameOverWinner(null);
    setHintMove(null);
    setIsReplayMode(false);
    setReplayIndex(0);`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  console.log("Success reset");
} else {
  console.log("Failed reset");
}

fs.writeFileSync('src/App.tsx', code);
