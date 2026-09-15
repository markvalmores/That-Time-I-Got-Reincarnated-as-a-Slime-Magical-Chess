const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `      {/* Controller Guide HUD overlay */}`;

const replacement = `      {/* Replay Controls HUD */}
      {currentScreen === 'game' && isReplayMode && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 backdrop-blur-xl border-2 border-cyan-500/50 p-3 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-4">
          <span className="text-cyan-400 font-mono text-sm font-bold tracking-widest uppercase text-center">Replay Mode</span>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => { setReplayIndex(0); soundEngine.playClick(); }}
              disabled={replayIndex === 0}
              className="w-10 h-10 flex items-center justify-center bg-slate-800 disabled:opacity-50 hover:bg-slate-700 rounded-xl text-white transition font-mono font-bold"
            >
              |&lt;
            </button>
            <button 
              onClick={() => { setReplayIndex(r => Math.max(0, r - 1)); soundEngine.playClick(); }}
              disabled={replayIndex === 0}
              className="w-10 h-10 flex items-center justify-center bg-slate-800 disabled:opacity-50 hover:bg-slate-700 rounded-xl text-white transition font-mono font-bold"
            >
              &lt;
            </button>
            
            <div className="w-16 text-center font-mono text-white text-lg font-bold">
              {replayIndex} / {gameMode.startsWith('chess') ? chessState.moveHistory.length : checkersState.moveHistory.length}
            </div>

            <button 
              onClick={() => { setReplayIndex(r => Math.min(gameMode.startsWith('chess') ? chessState.moveHistory.length : checkersState.moveHistory.length, r + 1)); soundEngine.playClick(); }}
              disabled={replayIndex === (gameMode.startsWith('chess') ? chessState.moveHistory.length : checkersState.moveHistory.length)}
              className="w-10 h-10 flex items-center justify-center bg-slate-800 disabled:opacity-50 hover:bg-slate-700 rounded-xl text-white transition font-mono font-bold"
            >
              &gt;
            </button>
            <button 
              onClick={() => { setReplayIndex(gameMode.startsWith('chess') ? chessState.moveHistory.length : checkersState.moveHistory.length); soundEngine.playClick(); }}
              disabled={replayIndex === (gameMode.startsWith('chess') ? chessState.moveHistory.length : checkersState.moveHistory.length)}
              className="w-10 h-10 flex items-center justify-center bg-slate-800 disabled:opacity-50 hover:bg-slate-700 rounded-xl text-white transition font-mono font-bold"
            >
              &gt;|
            </button>
          </div>

          <button
            onClick={() => { setIsReplayMode(false); setIsGameOverOpen(true); soundEngine.playClick(); }}
            className="px-4 py-2 bg-rose-900/80 hover:bg-rose-800 text-rose-200 border border-rose-500/50 rounded-xl font-bold font-mono text-xs transition uppercase"
          >
            Exit Replay
          </button>
        </div>
      )}

      {/* Controller Guide HUD overlay */}`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  console.log("Success replay HUD");
} else {
  console.log("Target not found");
}

fs.writeFileSync('src/App.tsx', code);
