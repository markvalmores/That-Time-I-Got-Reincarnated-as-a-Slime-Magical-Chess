const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(/import {\n  Play,/g, "import {\n  Sparkles,\n  Play,");
fs.writeFileSync('src/App.tsx', app);

console.log("Fixed App Sparkles import");
