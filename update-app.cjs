const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace isVsAI with matchType: 'pvp' | 'pve' | 'cvc'
let target = `  const [isVsAI, setIsVsAI] = useState<boolean>(true);`;
let replacement = `  const [matchType, setMatchType] = useState<'pvp' | 'pve' | 'cvc'>('pve');
  const isVsAI = matchType === 'pve';
  const isAIVsAI = matchType === 'cvc';`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  console.log("Replaced isVsAI state");
} else {
  console.log("Could not find isVsAI state");
}

target = `    isVsAI: boolean;
  }) => {`;
replacement = `    matchType: 'pvp' | 'pve' | 'cvc';
  }) => {`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  console.log("Replaced config param");
}

target = `    setIsVsAI(config.isVsAI);`;
replacement = `    setMatchType(config.matchType);`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  console.log("Replaced setIsVsAI in setup");
}

target = `              isVsAI: true`;
replacement = `              matchType: 'pve'`;

while (code.includes(target)) {
  code = code.replace(target, replacement);
  console.log("Replaced isVsAI: true with matchType: 'pve'");
}

target = `              isVsAI`;
replacement = `              matchType`;

while (code.includes(target)) {
  code = code.replace(target, replacement);
  console.log("Replaced isVsAI with matchType");
}

fs.writeFileSync('src/App.tsx', code);
