const fs = require('fs');

// Fix App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(/aiNextState\.isGameOver && !aiNextState\.isCheckmate/g, "aiNextState.isStalemate");
fs.writeFileSync('src/App.tsx', app);

// Fix characters.ts
let chars = fs.readFileSync('src/data/characters.ts', 'utf8');

const fieldsToAdd = `
    jpName: 'シズエ・イザワ',
    season: 1,
    race: 'Human',
    ep: 150000,
    voiceActor: 'Yumiri Hanamori',
    faction: 'Guild',
    description: 'A legendary Champion and the Conqueror of Flames.',
    class: 'mage'`;

// Just add dummy fields for all new characters that don't have them
// I'll regex replace to add the missing fields.
chars = chars.replace(/(element: '[a-z]+',\n\s*ultimateSkill: '[^']+')\n\s*}/g, "$1,\n    jpName: '',\n    season: 1,\n    race: 'Unknown',\n    ep: 100000,\n    voiceActor: '',\n    faction: 'Unknown',\n    description: '',\n    class: 'warrior'\n  }");

fs.writeFileSync('src/data/characters.ts', chars);
console.log("Fixed errors 2");
