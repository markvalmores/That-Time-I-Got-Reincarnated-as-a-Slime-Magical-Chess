const fs = require('fs');

let chars = fs.readFileSync('src/data/characters.ts', 'utf8');
chars = chars.replace(/name: 'Geld',\n    title: 'Orc Disaster \/ Orc King',\n    image: '',/g, "name: 'Geld',\n    title: 'Orc Disaster / Orc King',\n    image: 'https://tensura.fandom.com/wiki/Special:FilePath/Geld_Anime.png',");
fs.writeFileSync('src/data/characters.ts', chars);

console.log("Fixed Geld");
