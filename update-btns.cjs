const fs = require('fs');
let code = fs.readFileSync('src/components/GameOverModal.tsx', 'utf8');

const target = `          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                soundEngine.playSkillActivation();
                onRematch();
              }}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold font-mono text-xs shadow-lg shadow-cyan-500/40 hover:scale-105 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>REMATCH</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                onReturnTitle();
              }}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold font-mono text-xs border border-slate-700 transition"
            >
              <Home className="w-4 h-4" />
              <span>TITLE SCREEN</span>
            </button>
          </div>`;

const replacement = `          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  soundEngine.playSkillActivation();
                  onRematch();
                }}
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold font-mono text-xs shadow-lg shadow-cyan-500/40 hover:scale-105 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>REMATCH</span>
              </button>
  
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onReplay();
                }}
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 text-cyan-400 border border-cyan-500/30 font-bold font-mono text-xs shadow-lg hover:bg-slate-700 hover:text-white transition"
              >
                <RotateCcw className="w-4 h-4 rotate-180" />
                <span>WATCH REPLAY</span>
              </button>
            </div>
            
            <button
              onClick={() => {
                soundEngine.playClick();
                onReturnTitle();
              }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/50 text-slate-400 font-bold font-mono text-xs hover:bg-slate-800 hover:text-white transition"
            >
              <Home className="w-4 h-4" />
              <span>RETURN TO TITLE</span>
            </button>
          </div>`;

if (code.includes(target)) {
  fs.writeFileSync('src/components/GameOverModal.tsx', code.replace(target, replacement));
  console.log("Success updating buttons");
} else {
  console.log("Target not found");
}
