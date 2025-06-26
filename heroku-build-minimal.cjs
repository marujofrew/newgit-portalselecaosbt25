const { execSync } = require('child_process');
const fs = require('fs');

console.log('Minimal Heroku build for troubleshooting...');

// Clean directories
if (fs.existsSync('dist')) fs.rmSync('dist', { recursive: true });
fs.mkdirSync('dist', { recursive: true });
fs.mkdirSync('dist/public', { recursive: true });

// Create ultra-minimal backend
const minimalServer = `
const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 5000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Basic route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('Server running on port', PORT);
});
`;

fs.writeFileSync('dist/index.cjs', minimalServer);

// Create test page
const testHTML = `<!DOCTYPE html>
<html>
<head>
    <title>SBT Portal - Test Deploy</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .status { color: green; font-size: 24px; }
        .info { margin: 20px 0; }
    </style>
</head>
<body>
    <h1>SBT Portal de Seleção</h1>
    <div class="status">✓ Deploy Successful</div>
    <div class="info">Servidor funcionando corretamente</div>
    <div class="info">Timestamp: ${new Date().toISOString()}</div>
    <div class="info">
        <a href="/health">Health Check</a>
    </div>
</body>
</html>`;

fs.writeFileSync('dist/public/index.html', testHTML);

console.log('Minimal build complete - ready for Heroku');
console.log('Files created:');
console.log('- dist/index.cjs (minimal Express server)');
console.log('- dist/public/index.html (test page)');