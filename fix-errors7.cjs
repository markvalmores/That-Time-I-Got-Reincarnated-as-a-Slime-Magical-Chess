const fs = require('fs');
let chars = fs.readFileSync('src/data/characters.ts', 'utf8');

chars = chars.replace(/move: 'A calculated step.',\n      capture: 'Got you!',\n      check: 'Check!',\n      checkmate: 'Checkmate.',\n      win: 'I emerge victorious.',\n      lose: 'I miscalculated...'/g, "capture: 'Got you!',\n      check: 'Check!',\n      advantage: 'Checkmate.',\n      win: 'I emerge victorious.',\n      loss: 'I miscalculated...'");
fs.writeFileSync('src/data/characters.ts', chars);

console.log("Fixed errors 7");
