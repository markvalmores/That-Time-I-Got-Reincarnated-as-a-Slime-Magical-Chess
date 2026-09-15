import fs from 'fs';
import { TENSURA_CHARACTERS } from './src/data/characters';

const newArray = [];
const seasons = ['Season 1', 'Season 2', 'Season 3', 'Season 4'];

for (const season of seasons) {
  for (const char of TENSURA_CHARACTERS) {
    // Generate a new ID based on season
    const sId = season.replace('Season ', 's');
    
    // Some chars might already have this season, but if we just duplicate all, we get 100 characters.
    // That's fine! 
    newArray.push({
      ...char,
      id: `${char.id}_${sId}`,
      season: season
    });
  }
}

let charsFile = fs.readFileSync('src/data/characters.ts', 'utf8');

// We need to replace the TENSURA_CHARACTERS array definition.
// Wait, generating the TS code for the array might be hard because of functions? There are no functions, just voiceLines objects.
// Wait, let's see if we can serialize it.
const jsonStr = JSON.stringify(newArray, null, 2);

// Re-write the file entirely since it only contains the array export
const newContent = `import { TensuraCharacter } from '../types/game';

export const TENSURA_CHARACTERS: TensuraCharacter[] = ${jsonStr};
`;

fs.writeFileSync('src/data/characters.ts', newContent);
console.log('Fixed seasons');
