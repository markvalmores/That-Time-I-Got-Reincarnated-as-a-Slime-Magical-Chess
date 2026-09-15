const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(/setTournamentStage\(1\);\n\s*setDifficulty\('easy'\);/g, "setTournamentStage(1);\n      setDifficulty('easy');\n      setTimerMode('3m');");

fs.writeFileSync('src/App.tsx', app);

console.log("Fixed tournament timer");
