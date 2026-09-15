const fs = require('fs');

// Fix GameOverModal
let modal = fs.readFileSync('src/components/GameOverModal.tsx', 'utf8');
modal = modal.replace(/onReplay\n}\) => {/g, "onReplay,\n  isTournament,\n  tournamentStage\n}) => {");
fs.writeFileSync('src/components/GameOverModal.tsx', modal);

// Fix MatchSetupModal
let matchSetup = fs.readFileSync('src/components/MatchSetupModal.tsx', 'utf8');
matchSetup = matchSetup.replace(/import { X, Play, Settings, Bot, Users } from 'lucide-react';/g, "import { X, Play, Settings, Bot, Users, Sparkles } from 'lucide-react';");
fs.writeFileSync('src/components/MatchSetupModal.tsx', matchSetup);

console.log("Fixed missing imports/destructuring");
