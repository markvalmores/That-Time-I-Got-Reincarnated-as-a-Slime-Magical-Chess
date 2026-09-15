const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `      <GameOverModal
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
      />`;

const replacement = `      <GameOverModal
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
        onReplay={() => {
          setIsGameOverOpen(false);
          setIsReplayMode(true);
          setReplayIndex(0);
        }}
      />`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  console.log("Success game over modal");
} else {
  console.log("Target not found");
}

fs.writeFileSync('src/App.tsx', code);
