const fs = require('fs');

// Fix MatchSetupModal.tsx
let matchSetup = fs.readFileSync('src/components/MatchSetupModal.tsx', 'utf8');
matchSetup = matchSetup.replace(/matchType: 'pvp' \| 'pve' \| 'cvc';/g, "matchType: 'pvp' | 'pve' | 'cvc' | 'tournament';");
matchSetup = matchSetup.replace(/const \[matchType, setMatchType\] = useState<'pvp' \| 'pve' \| 'cvc'>\('pve'\);/g, "const [matchType, setMatchType] = useState<'pvp' | 'pve' | 'cvc' | 'tournament'>('pve');");

const tournamentButtonStr = `
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setMatchType('tournament');
                }}
                className={\`p-3 rounded-xl border flex items-center justify-center gap-2 font-mono text-xs font-bold transition-all \${
                  matchType === 'tournament'
                    ? 'bg-yellow-950 border-yellow-400 text-yellow-300 ring-1 ring-yellow-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }\`}
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>TOURNAMENT</span>
              </button>
            </div>
`;
matchSetup = matchSetup.replace(/<\/button>\n\s*<\/div>\n\s*<\/div>\n\n\s*{\/\* AI Difficulty Selector/g, "</button>\n" + tournamentButtonStr + "\n          </div>\n\n          {/* AI Difficulty Selector");

// Hide character selection if tournament is selected
matchSetup = matchSetup.replace(/{\/\* Opponent Selection/g, "{matchType !== 'tournament' && (\n            <div>\n          {/* Opponent Selection");
matchSetup = matchSetup.replace(/<\/div>\n\s*<\/div>\n\s*\n\s*{\/\* Board Theme Selector/g, "</div>\n          </div>\n          </div>\n          )}\n\n          {/* Board Theme Selector");


fs.writeFileSync('src/components/MatchSetupModal.tsx', matchSetup);

// Fix App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(/matchType: 'pvp' \| 'pve' \| 'cvc';/g, "matchType: 'pvp' | 'pve' | 'cvc' | 'tournament';");
app = app.replace(/const \[matchType, setMatchType\] = useState<'pvp' \| 'pve' \| 'cvc'>\('pve'\);/g, "const [matchType, setMatchType] = useState<'pvp' | 'pve' | 'cvc' | 'tournament'>('pve');");
app = app.replace(/const isAIVsAI = matchType === 'cvc';/g, "const isAIVsAI = matchType === 'cvc';\n  const isTournament = matchType === 'tournament';\n  const [tournamentStage, setTournamentStage] = useState<number>(0);");
// also update startNewMatch to setup tournament stage
app = app.replace(/setMatchType\(config\.matchType\);/g, "setMatchType(config.matchType);\n    if (config.matchType === 'tournament') {\n      setTournamentStage(1);\n      setDifficulty('easy');\n      setOpponentCharacter(TENSURA_CHARACTERS.find(c => c.name === 'Gobta & Ranga') || TENSURA_CHARACTERS[1]);\n    }");
fs.writeFileSync('src/App.tsx', app);

console.log("Updated files");
