const fs = require('fs');

let chars = fs.readFileSync('src/data/characters.ts', 'utf8');
chars = chars.replace(/\n\s*faction: 'Unknown',\n\s*description: '',\n\s*class: 'warrior'/g, "\n    ultimateDescription: 'A unique ultimate skill.',\n    avatarBg: 'bg-gradient-to-br from-slate-900 to-slate-800',\n    glowColor: 'rgba(255, 255, 255, 0.5)',\n    avatarIcon: 'https://tensura.fandom.com/wiki/Special:FilePath/Rimuru_Tempest_Anime.png'");
fs.writeFileSync('src/data/characters.ts', chars);

console.log("Fixed errors 5");
