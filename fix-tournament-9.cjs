const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

const tStartMatchReplace = `
    if (config.matchType === 'tournament') {
      setTournamentStage(1);
      setDifficulty('easy');
      setTimerMode('3m');
      setOpponentCharacter(TENSURA_CHARACTERS.find(c => c.name === 'Gobta & Ranga') || TENSURA_CHARACTERS[1]);
      config.timerMode = '3m';
    }
`;

app = app.replace(/if \(config.matchType === 'tournament'\) {\n\s*setTournamentStage\(1\);\n\s*setDifficulty\('easy'\);\n\s*setTimerMode\('3m'\);\n\s*setOpponentCharacter\(TENSURA_CHARACTERS\.find\(c => c.name === 'Gobta & Ranga'\) \|\| TENSURA_CHARACTERS\[1\]\);\n\s*}/g, tStartMatchReplace);

fs.writeFileSync('src/App.tsx', app);

console.log("Fixed config timer mode modification");
