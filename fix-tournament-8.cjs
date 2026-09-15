const fs = require('fs');
let matchSetup = fs.readFileSync('src/components/MatchSetupModal.tsx', 'utf8');

matchSetup = matchSetup.replace(/{matchType !== 'tournament' && \(\n          <div>\n          {\/\* Timer Mode Selector \*\/}}/g, "{matchType !== 'tournament' && (\n          <div>\n          {/* Timer Mode Selector */}");
matchSetup = matchSetup.replace(/<\/div>\n          \)}\n\n          {\/\* Board Theme Selector \*\/}}/g, "</div>\n          )}\n\n          {/* Board Theme Selector */}");
matchSetup = matchSetup.replace(/{matchType !== 'tournament' && \(\n          <div>\n          {\/\* Combatant Selection Preview \*\/}}/g, "{matchType !== 'tournament' && (\n          <div>\n          {/* Combatant Selection Preview */}");
matchSetup = matchSetup.replace(/<\/div>\n          \)}\n\n          {\/\* Action Footer \*\/}}/g, "</div>\n          )}\n\n          {/* Action Footer */}");

fs.writeFileSync('src/components/MatchSetupModal.tsx', matchSetup);

console.log("Fixed syntax");
