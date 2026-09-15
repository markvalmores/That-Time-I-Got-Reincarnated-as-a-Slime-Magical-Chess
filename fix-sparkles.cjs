const fs = require('fs');

let matchSetup = fs.readFileSync('src/components/MatchSetupModal.tsx', 'utf8');
matchSetup = matchSetup.replace(/import {\s+Crown,/g, "import {\n  Sparkles,\n  Crown,");
fs.writeFileSync('src/components/MatchSetupModal.tsx', matchSetup);

let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(/matchType={isVsAI}/g, "isVsAI={isVsAI}");

// Also add tournament stage to HUD
const hudReplacement = `
              isVsAI={isVsAI}
            />
          </div>
          
          {isTournament && (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10">
              <div className="bg-yellow-950/80 border border-yellow-400 text-yellow-300 px-4 py-1 rounded-full font-mono text-xs font-bold shadow-lg shadow-yellow-500/20 backdrop-blur-sm flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                <span>TOURNAMENT STAGE {tournamentStage} / 5</span>
              </div>
            </div>
          )}
`;
app = app.replace(/isVsAI={isVsAI}\n\s*\/>\n\s*<\/div>/g, hudReplacement);
fs.writeFileSync('src/App.tsx', app);

console.log("Fixed Sparkles");
