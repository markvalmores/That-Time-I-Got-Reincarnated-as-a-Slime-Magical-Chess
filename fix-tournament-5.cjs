const fs = require('fs');
let matchSetup = fs.readFileSync('src/components/MatchSetupModal.tsx', 'utf8');

matchSetup = matchSetup.replace(/import {\n  Crown,/g, "import {\n  Sparkles,\n  Crown,");

fs.writeFileSync('src/components/MatchSetupModal.tsx', matchSetup);

console.log("Fixed Sparkles import");
