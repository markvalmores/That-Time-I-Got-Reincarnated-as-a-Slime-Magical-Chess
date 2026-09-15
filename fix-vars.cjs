const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Remove from old spot
code = code.replace(`
  // Replay Mode
  const [isReplayMode, setIsReplayMode] = useState(false);
  const [replayIndex, setReplayIndex] = useState(0);`, '');

// Add to new spot above Replay State Computation
code = code.replace(`  // Replay State Computation`, `  // Replay Mode\n  const [isReplayMode, setIsReplayMode] = useState(false);\n  const [replayIndex, setReplayIndex] = useState(0);\n\n  // Replay State Computation`);

fs.writeFileSync('src/App.tsx', code);
console.log("Success fix vars");
