const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `      {/* Game Over Modal */}`;

const replacement = `      {/* Replay Controls HUD */}
      {currentScreen === 'game' && isReplayMode && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 backdrop-blur-xl border-2 border-cyan-500/50 p-4 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-center gap-6 ring-2 ring-cyan-500/20">
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-cyan-400 font-mono text-xs font-bold tracking-[0.2em] uppercase">Great Sage</span>
            <span className="text-white font-bold tracking-widest uppercase">Match Replay</span>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-950/50 p-2 rounded-2xl border border-slate-800">
            <button 
              onClick={() => { setReplayIndex(0); soundEngine.playClick(); }}
              disabled={replayIndex === 0}
              className="w-12 h-12 flex items-center justify-center bg-slate-800 disabled:opacity-40 hover:bg-slate-700 rounded-xl text-white transition font-mono font-bold hover:scale-105 active:scale-95"
            >
              |&lt;
            </button>
            <button 
              onClick={() => { setReplayIndex(r => Math.max(0, r - 1)); soundEngine.playClick(); }}
              disabled={replayIndex === 0}
              className="w-12 h-12 flex items-center justify-center bg-slate-800 disabled:opacity-40 hover:bg-slate-700 rounded-xl text-white transition font-mono font-bold hover:scale-105 active:scale-95"
            >
              &lt;
            </button>
            
            <div className="w-20 text-center font-mono text-cyan-300 text-xl font-bold tracking-widest px-2">
              {replayIndex}
              <span className="text-slate-500 text-sm">/{gameMode.startsWith('chess') ? chessState.moveHistory.length : checkersState.moveHistory.length}</span>
            </div>

            <button 
              onClick={() => { setReplayIndex(r => Math.min(gameMode.startsWith('chess') ? chessState.moveHistory.length : checkersState.moveHistory.length, r + 1)); soundEngine.playClick(); }}
              disabled={replayIndex === (gameMode.startsWith('chess') ? chessState.moveHistory.length : checkersState.moveHistory.length)}
              className="w-12 h-12 flex items-center justify-center bg-slate-800 disabled:opacity-40 hover:bg-slate-700 rounded-xl text-white transition font-mono font-bold hover:scale-105 active:scale-95"
            >
              &gt;
            </button>
            <button 
              onClick={() => { setReplayIndex(gameMode.startsWith('chess') ? chessState.moveHistory.length : checkersState.moveHistory.length); soundEngine.playClick(); }}
              disabled={replayIndex === (gameMode.startsWith('chess') ? chessState.moveHistory.length : checkersState.moveHistory.length)}
              className="w-12 h-12 flex items-center justify-center bg-slate-800 disabled:opacity-40 hover:bg-slate-700 rounded-xl text-white transition font-mono font-bold hover:scale-105 active:scale-95"
            >
              &gt;|
            </button>
          </div>

          <button
            onClick={() => { setIsReplayMode(false); setIsGameOverOpen(true); soundEngine.playClick(); }}
            className="px-6 py-3.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/50 rounded-xl font-bold font-mono text-xs transition uppercase tracking-wider hover:text-white"
          >
            Exit Replay
          </button>
        </div>
      )}

      {/* Game Over Modal */}`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  console.log("Success replay HUD");
} else {
  console.log("Target not found");
}

fs.writeFileSync('src/App.tsx', code);
