const fs = require('fs');

let enc = fs.readFileSync('src/components/CharacterEncyclopedia.tsx', 'utf8');

const filterCode = `
  // Deduplicate characters by name
  const uniqueCharacters = TENSURA_CHARACTERS.filter((char, index, self) => 
    self.findIndex(c => c.name === char.name) === index
  );
`;

enc = enc.replace(/const \[selectedChar, setSelectedChar\] = useState<TensuraCharacter>\(TENSURA_CHARACTERS\[0\]\);/g, `const [selectedChar, setSelectedChar] = useState<TensuraCharacter>(TENSURA_CHARACTERS[0]);\n${filterCode}`);
enc = enc.replace(/{TENSURA_CHARACTERS\.map\(\(char\) => \(/g, "{uniqueCharacters.map((char) => (");

fs.writeFileSync('src/components/CharacterEncyclopedia.tsx', enc);

console.log("Fixed deduplication in CharacterEncyclopedia");
