const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(/'Shion \(War Lord\)'/g, "'Shion'");

fs.writeFileSync('src/App.tsx', app);

console.log("Fixed Shion name");
