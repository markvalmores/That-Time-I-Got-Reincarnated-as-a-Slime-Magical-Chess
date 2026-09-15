const fs = require('fs');

let matchSetup = fs.readFileSync('src/components/MatchSetupModal.tsx', 'utf8');
matchSetup = matchSetup.replace(/!matchType === 'pve'/g, "matchType === 'pvp'");
fs.writeFileSync('src/components/MatchSetupModal.tsx', matchSetup);

let chars = fs.readFileSync('src/data/characters.ts', 'utf8');
chars = chars.replace(/\n\s*voiceActor: '[^']*',/g, "");
fs.writeFileSync('src/data/characters.ts', chars);

console.log("Fixed errors 4");
