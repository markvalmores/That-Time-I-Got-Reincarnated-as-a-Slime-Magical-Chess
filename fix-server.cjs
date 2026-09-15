const fs = require('fs');

let server = fs.readFileSync('server.ts', 'utf8');
server = server.replace(/const __filename = fileURLToPath\(import\.meta\.url\);\nconst __dirname = path\.dirname\(__filename\);/g, "// CJS build handles __filename and __dirname naturally\n// const __filename = fileURLToPath(import.meta.url);\n// const __dirname = path.dirname(__filename);");

fs.writeFileSync('server.ts', server);

console.log("Fixed server.ts");
