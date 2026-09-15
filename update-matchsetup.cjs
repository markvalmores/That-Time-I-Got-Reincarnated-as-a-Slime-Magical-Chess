const fs = require('fs');
let code = fs.readFileSync('src/components/MatchSetupModal.tsx', 'utf8');

let target = `    isVsAI: boolean;
  }) => void;`;
let replacement = `    matchType: 'pvp' | 'pve' | 'cvc';
  }) => void;`;
code = code.replace(target, replacement);

target = `  const [isVsAI, setIsVsAI] = useState<boolean>(true);`;
replacement = `  const [matchType, setMatchType] = useState<'pvp' | 'pve' | 'cvc'>('pve');`;
code = code.replace(target, replacement);

target = `      isVsAI
    });`;
replacement = `      matchType
    });`;
code = code.replace(target, replacement);

target = `<div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setIsVsAI(true);
                  soundEngine.playClick();
                }}
                className={\`flex items-center gap-3 w-full p-4 rounded-2xl transition \${
                  isVsAI
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }\`}
              >
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>VS TENSURA RAPHAEL AI</span>
              </button>

              <button
                onClick={() => {
                  setIsVsAI(false);
                  soundEngine.playClick();
                }}
                className={\`flex items-center gap-3 w-full p-4 rounded-2xl transition \${
                  !isVsAI
                    ? 'bg-purple-950 border-purple-400 text-purple-300 ring-1 ring-purple-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }\`}
              >
                <Users className="w-4 h-4 text-purple-400" />
                <span>LOCAL 2-PLAYER (PASS & PLAY)</span>
              </button>
            </div>`;
replacement = `<div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setMatchType('pve');
                  soundEngine.playClick();
                }}
                className={\`flex items-center gap-3 w-full p-4 rounded-2xl transition \${
                  matchType === 'pve'
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }\`}
              >
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>VS TENSURA RAPHAEL AI (PvE)</span>
              </button>

              <button
                onClick={() => {
                  setMatchType('cvc');
                  soundEngine.playClick();
                }}
                className={\`flex items-center gap-3 w-full p-4 rounded-2xl transition \${
                  matchType === 'cvc'
                    ? 'bg-amber-950 border-amber-400 text-amber-300 ring-1 ring-amber-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }\`}
              >
                <Crown className="w-4 h-4 text-amber-400" />
                <span>CPU VS CPU (WATCH AI BATTLE)</span>
              </button>

              <button
                onClick={() => {
                  setMatchType('pvp');
                  soundEngine.playClick();
                }}
                className={\`flex items-center gap-3 w-full p-4 rounded-2xl transition \${
                  matchType === 'pvp'
                    ? 'bg-purple-950 border-purple-400 text-purple-300 ring-1 ring-purple-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }\`}
              >
                <Users className="w-4 h-4 text-purple-400" />
                <span>LOCAL 2-PLAYER (PvP)</span>
              </button>
            </div>`;
code = code.replace(target, replacement);

target = `{isVsAI && (`;
replacement = `{(matchType === 'pve' || matchType === 'cvc') && (`;
code = code.replace(target, replacement);

fs.writeFileSync('src/components/MatchSetupModal.tsx', code);
console.log("Updated MatchSetupModal");
