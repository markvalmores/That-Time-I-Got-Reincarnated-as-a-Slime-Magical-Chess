const fs = require('fs');
let modal = fs.readFileSync('src/components/GameOverModal.tsx', 'utf8');

modal = modal.replace(/onRematch: \(\) => void;/g, "onRematch: () => void;\n  isTournament?: boolean;\n  tournamentStage?: number;");
modal = modal.replace(/const isPlayerWinner = winner === 'w';/g, "const isPlayerWinner = winner === 'w';\n  const showTournamentVictory = isTournament && tournamentStage === 5 && isPlayerWinner;");
modal = modal.replace(/<span>REMATCH<\/span>/g, "<span>{showTournamentVictory ? 'CLAIM TITLE' : (isTournament && isPlayerWinner ? 'NEXT BATTLE' : (isTournament && !isPlayerWinner ? 'RETRY STAGE' : 'REMATCH'))}</span>");
modal = modal.replace(/onReplay,/g, "onReplay,\n  isTournament,\n  tournamentStage");

// If they won the tournament
const victoryText = `
          {showTournamentVictory && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-full text-center">
              <span className="text-yellow-400 font-bold font-mono text-xl animate-pulse drop-shadow-md">👑 TEMPEST CHAMPION 👑</span>
            </div>
          )}
`;
modal = modal.replace(/<div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto/g, victoryText + "\n          <div className=\"w-24 h-24 sm:w-32 sm:h-32 mx-auto");

fs.writeFileSync('src/components/GameOverModal.tsx', modal);

let app = fs.readFileSync('src/App.tsx', 'utf8');

const tLogic = `
        isTournament={isTournament}
        tournamentStage={tournamentStage}
        onRematch={() => {
          if (isTournament) {
            if (gameOverWinner === 'w') {
              if (tournamentStage >= 5) {
                // Won tournament, return to title
                setIsGameOverOpen(false);
                setCurrentScreen('title');
                return;
              }
              // Next stage
              const nextStage = tournamentStage + 1;
              setTournamentStage(nextStage);
              const tDiffs = ['easy', 'normal', 'hard', 'grandmaster', 'king'];
              const tChars = ['Gobta & Ranga', 'Shion (War Lord)', 'Hinata Sakaguchi', 'Milim Nava', 'Guy Crimson (Rouge)'];
              startNewMatch({
                mode: gameMode,
                difficulty: tDiffs[nextStage - 1] as any,
                timerMode: '3m',
                theme,
                playerCharacter,
                opponentCharacter: TENSURA_CHARACTERS.find(c => c.name === tChars[nextStage - 1]) || TENSURA_CHARACTERS[1],
                matchType: 'tournament'
              });
            } else {
              // Retry stage
              startNewMatch({
                mode: gameMode,
                difficulty,
                timerMode: '3m',
                theme,
                playerCharacter,
                opponentCharacter,
                matchType: 'tournament'
              });
            }
          } else {
            startNewMatch({
              mode: gameMode,
              difficulty,
              timerMode,
              theme,
              playerCharacter,
              opponentCharacter,
              matchType
            });
          }
        }}
`;

app = app.replace(/onRematch={\(\) => {[\s\S]*?matchType\n\s*}\);\n\s*}}/g, tLogic);
fs.writeFileSync('src/App.tsx', app);

console.log("Fixed Tournament logic");
