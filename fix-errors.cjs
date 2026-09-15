const fs = require('fs');

// Fix MatchSetupModal.tsx
let matchSetup = fs.readFileSync('src/components/MatchSetupModal.tsx', 'utf8');
matchSetup = matchSetup.replace(/setIsVsAI\(true\)/g, "setMatchType('pve')");
matchSetup = matchSetup.replace(/setIsVsAI\(false\)/g, "setMatchType('pvp')");
matchSetup = matchSetup.replace(/isVsAI/g, "matchType === 'pve'");
fs.writeFileSync('src/components/MatchSetupModal.tsx', matchSetup);

// Fix App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(/isVsAI: true/g, "matchType: 'pve'");
app = app.replace(/isVsAI\n/g, "matchType\n");
app = app.replace(/aiNextState\.isDraw/g, "aiNextState.isGameOver && !aiNextState.isCheckmate");
fs.writeFileSync('src/App.tsx', app);

// Fix characters.ts
let chars = fs.readFileSync('src/data/characters.ts', 'utf8');
chars = chars.replace(/'Fire'/g, "'fire'");
chars = chars.replace(/'Light'/g, "'holy'");
chars = chars.replace(/'Earth'/g, "'earth'");
chars = chars.replace(/'Water'/g, "'water'");
chars = chars.replace(/'Dark'/g, "'dark'");
chars = chars.replace(/'Nature'/g, "'wind'");
fs.writeFileSync('src/data/characters.ts', chars);

console.log("Fixed errors");
