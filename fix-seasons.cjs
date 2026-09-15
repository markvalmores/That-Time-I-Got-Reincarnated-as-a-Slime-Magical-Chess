const fs = require('fs');

let chars = fs.readFileSync('src/data/characters.ts', 'utf8');

// I will parse the file using regex or just replace the array with repeated ones.
// It's a TS file, so evaluating it is tricky.
// Better way: let's run a TS script to do it.
