const fs = require('fs');
let modal = fs.readFileSync('src/components/MatchSetupModal.tsx', 'utf8');

// Fix unmatched closing tags
modal = modal.replace(/<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*\)}\n\n\s*{\/\* Board Theme Selector/g, "</div>\n          </div>\n\n          {/* Board Theme Selector");

fs.writeFileSync('src/components/MatchSetupModal.tsx', modal);
console.log("Fixed match setup modal");
