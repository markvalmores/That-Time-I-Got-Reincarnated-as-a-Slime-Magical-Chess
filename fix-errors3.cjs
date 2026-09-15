const fs = require('fs');

// Fix characters.ts
let chars = fs.readFileSync('src/data/characters.ts', 'utf8');
chars = chars.replace(/season: 1,/g, "season: 'Season 1',");
fs.writeFileSync('src/data/characters.ts', chars);

// Fix MatchSetupModal.tsx
let matchSetup = fs.readFileSync('src/components/MatchSetupModal.tsx', 'utf8');
matchSetup = matchSetup.replace(/!isVsAI/g, "matchType === 'pvp'");
fs.writeFileSync('src/components/MatchSetupModal.tsx', matchSetup);

console.log("Fixed errors 3");
