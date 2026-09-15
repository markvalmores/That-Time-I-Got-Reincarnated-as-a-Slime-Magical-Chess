const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `    if (isGameOverOpen || !isVsAI || currentScreen !== 'game') return;`;
const replacement = `    if (isGameOverOpen || !isVsAI || currentScreen !== 'game' || isReplayMode) return;`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  console.log("Success ai");
} else {
  console.log("Failed ai");
}

fs.writeFileSync('src/App.tsx', code);
