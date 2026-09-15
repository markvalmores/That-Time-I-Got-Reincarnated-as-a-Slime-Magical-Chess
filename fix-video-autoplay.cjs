const fs = require('fs');

// Update App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(/isMuted: false, \/\/ Default: Background Video Music Auto ON/g, "isMuted: true, // Default muted for browser autoplay compatibility");
fs.writeFileSync('src/App.tsx', app);

// Update VideoBackground.tsx
let videoBg = fs.readFileSync('src/components/VideoBackground.tsx', 'utf8');
videoBg = videoBg.replace(/isMuted: false \/\/ Default Auto ON/g, "isMuted: true // Default muted for browser autoplay compatibility");
videoBg = videoBg.replace(/<div className="text-\[9px\] text-cyan-400\/80">Default: Auto ON<\/div>/g, '<div className="text-[9px] text-cyan-400/80">Default: Muted (Auto-Play Policy)</div>');
fs.writeFileSync('src/components/VideoBackground.tsx', videoBg);

console.log("Fixed video settings");
