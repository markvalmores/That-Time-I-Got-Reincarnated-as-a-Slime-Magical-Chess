const fs = require('fs');
const https = require('https');

const chars = [
  { name: 'Shizue Izawa', search: 'Shizu', title: 'The Conqueror of Flames', color: '#ef4444', ultimateSkill: 'Degenerate', element: 'Fire' },
  { name: 'Ramiris', search: 'Ramiris', title: 'Fairy of the Labyrinth', color: '#a3e635', ultimateSkill: 'Labyrinth Creation', element: 'Light' },
  { name: 'Geld', search: 'Geld', title: 'Orc Disaster / Orc King', color: '#ea580c', ultimateSkill: 'Gourmet / Beelzebub (sub)', element: 'Earth' },
  { name: 'Gabiru', search: 'Gabiru', title: 'Dragonewt Leader', color: '#6366f1', ultimateSkill: 'Vortex Spear', element: 'Water' },
  { name: 'Clayman', search: 'Clayman', title: 'Marionette Master', color: '#8b5cf6', ultimateSkill: 'Demon Lord Haki', element: 'Dark' },
  { name: 'Treyni', search: 'Treyni', title: 'Dryad of the Great Forest', color: '#22c55e', ultimateSkill: 'Aero Hand', element: 'Nature' },
  { name: 'Gazel Dwargo', search: 'Gazel Dwargo', title: 'King of Dwargon', color: '#f59e0b', ultimateSkill: 'King of Swords', element: 'Earth' }
];

async function fetchWikiImage(charName) {
  return new Promise((resolve) => {
    const query = encodeURIComponent(charName);
    const url = `https://tensura.fandom.com/api.php?action=query&prop=pageimages&titles=${query}&format=json&pithumbsize=600`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const pages = parsed.query.pages;
          const page = pages[Object.keys(pages)[0]];
          if (page.thumbnail && page.thumbnail.source) {
            resolve(page.thumbnail.source);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  let newChars = [];
  for (const c of chars) {
    const url = await fetchWikiImage(c.search);
    newChars.push(`  {
    id: '${c.name.replace(/\s+/g, '-').toLowerCase()}',
    name: '${c.name}',
    title: '${c.title}',
    image: '${url || ''}',
    accentColor: '${c.color}',
    element: '${c.element}',
    ultimateSkill: '${c.ultimateSkill}'
  }`);
  }

  const file = fs.readFileSync('src/data/characters.ts', 'utf8');
  const arrEndIndex = file.indexOf('];');
  if (arrEndIndex > -1) {
    let newFile = file.slice(0, arrEndIndex) + ',\n' + newChars.join(',\n') + '\n' + file.slice(arrEndIndex);
    fs.writeFileSync('src/data/characters.ts', newFile);
    console.log('Added characters successfully.');
  }
}
run();
