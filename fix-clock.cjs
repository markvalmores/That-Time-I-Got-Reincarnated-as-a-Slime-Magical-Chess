const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `    if (currentScreen !== 'game' || timerMode === 'none' || isGameOverOpen) return;`;
const replacement = `    if (currentScreen !== 'game' || timerMode === 'none' || isGameOverOpen || isReplayMode) return;`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  console.log("Success clock");
} else {
  console.log("Failed clock");
}

fs.writeFileSync('src/App.tsx', code);
