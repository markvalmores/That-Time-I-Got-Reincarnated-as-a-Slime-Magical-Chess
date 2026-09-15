const fs = require('fs');

let screen = fs.readFileSync('src/components/CharacterSelectScreen.tsx', 'utf8');

const replacement = `
  const filteredCharacters = TENSURA_CHARACTERS.filter((char, index, self) => {
    const matchSeason = filterSeason === 'all' || char.season === filterSeason;
    const matchSearch = char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        char.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        char.ultimateSkill.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterSeason === 'all') {
      // Deduplicate by name if showing all seasons
      const isFirst = self.findIndex(c => c.name === char.name) === index;
      return matchSearch && isFirst;
    }
    
    return matchSeason && matchSearch;
  });
`;

screen = screen.replace(/const filteredCharacters = TENSURA_CHARACTERS\.filter\(\(char\) => {[\s\S]*?return matchSeason && matchSearch;\n\s*}\);/g, replacement.trim());

fs.writeFileSync('src/components/CharacterSelectScreen.tsx', screen);

console.log("Fixed deduplication in CharacterSelectScreen");
