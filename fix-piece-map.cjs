const fs = require('fs');

let charsBackup = fs.readFileSync('chars_backup.ts', 'utf8');
const mapIndex = charsBackup.indexOf('export const PIECE_CHARACTER_MAP');
const mapStr = charsBackup.substring(mapIndex);

let currentChars = fs.readFileSync('src/data/characters.ts', 'utf8');
fs.writeFileSync('src/data/characters.ts', currentChars + '\n\n' + mapStr);

console.log("Restored PIECE_CHARACTER_MAP");
