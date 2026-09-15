const fs = require('fs');

let chars = fs.readFileSync('src/data/characters.ts', 'utf8');
chars = chars.replace(/\n\s*avatarIcon: 'https:\/\/tensura.fandom.com\/wiki\/Special:FilePath\/Rimuru_Tempest_Anime.png'/g, "\n    avatarIcon: 'https://tensura.fandom.com/wiki/Special:FilePath/Rimuru_Tempest_Anime.png',\n    voiceLines: {\n      start: 'Let us begin!',\n      move: 'A calculated step.',\n      capture: 'Got you!',\n      check: 'Check!',\n      checkmate: 'Checkmate.',\n      win: 'I emerge victorious.',\n      lose: 'I miscalculated...'\n    }");
fs.writeFileSync('src/data/characters.ts', chars);

console.log("Fixed errors 6");
