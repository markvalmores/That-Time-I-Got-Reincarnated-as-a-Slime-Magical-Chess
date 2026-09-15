const fs = require('fs');
let code = fs.readFileSync('src/components/GameOverModal.tsx', 'utf8');

const replacement = `  }, [isOpen, winner, winningColor]);

  if (!isOpen || !winner) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden select-none">
        
        {/* Phase 1 & 2: Skill Activation Cinematic Overlay */}
        {(phase === 'flash' || phase === 'text') && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center z-50 overflow-hidden"
          >
            {/* Geometric Great Sage overlay grid */}
            <div 
              className="absolute inset-0 bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] opacity-30" 
              style={{ backgroundImage: \`linear-gradient(to right, \${winningColor}20 1px, transparent 1px), linear-gradient(to bottom, \${winningColor}20 1px, transparent 1px)\` }}
            />
                
            <AnimatePresence>
              {phase === 'text' && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
                  animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ scale: 1.1, opacity: 0, filter: 'blur(10px)' }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="relative z-10 flex flex-col items-center justify-center w-full h-full"
                >
                  <div className="absolute -inset-24 rounded-full blur-[100px] animate-pulse" style={{ backgroundColor: \`\${winningColor}40\` }} />
                  
                  {/* Character Bust */}
                  {winningCharacter && (
                    <motion.div 
                      initial={{ scale: 1.5, opacity: 0, y: 50 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                      className="absolute bottom-0 w-full flex justify-center opacity-70 pointer-events-none"
                    >
                      <img 
                        src={winningCharacter.image} 
                        alt={winningCharacter.name}
                        className="h-[80vh] w-auto object-contain mix-blend-screen"
                        style={{ maskImage: 'linear-gradient(to top, transparent 0%, black 100%)', WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 100%)' }}
                      />
                    </motion.div>
                  )}
                      
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="h-px mb-4 overflow-hidden relative z-20 w-[80%] max-w-4xl"
                    style={{ backgroundColor: winningColor }}
                  />
                 
                  <h1 
                    className="text-4xl md:text-6xl lg:text-7xl font-black font-mono tracking-widest text-transparent bg-clip-text text-center uppercase relative z-20 px-4"
                    style={{ 
                      backgroundImage: \`linear-gradient(to right, \${winningColor}, #fff, \${winningColor})\`,
                      filter: \`drop-shadow(0 0 15px \${winningColor}80)\`
                    }}
                  >
                    &lt;&lt; {winningSkill} &gt;&gt;
                  </h1>
                 
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="mt-6 text-xl md:text-2xl font-bold tracking-[0.2em] uppercase text-center relative z-20 px-4"
                    style={{ color: winningColor }}
                  >
                    {isPlayerWinner ? 'Checkmate Condition Met' : isDraw ? 'Equilibrium Detected' : 'Tactical Defeat Logged'}
                  </motion.div>

                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="h-px mt-6 relative z-20 w-[80%] max-w-4xl"
                    style={{ backgroundColor: winningColor }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}`;

let idxStart = code.indexOf("  }, [isOpen, winner, winningColor]);");
let idxEnd = code.indexOf("        {/* Phase 3: Reveal standard modal overlay */}");

if (idxStart !== -1 && idxEnd !== -1) {
  let newCode = code.substring(0, idxStart) + replacement + "\n\n" + code.substring(idxEnd);
  fs.writeFileSync('src/components/GameOverModal.tsx', newCode);
  console.log("Success");
} else {
  console.log("Not found indexes");
}
