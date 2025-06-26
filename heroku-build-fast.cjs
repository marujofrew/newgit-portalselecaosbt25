const { execSync } = require('child_process');
const fs = require('fs');

console.log('Fast Heroku build starting...');

// Clean and create directories
if (fs.existsSync('dist')) fs.rmSync('dist', { recursive: true });
fs.mkdirSync('dist', { recursive: true });
fs.mkdirSync('dist/public', { recursive: true });

// Build backend only (fast)
console.log('Building backend...');
execSync('npx esbuild server/index-production.ts --bundle --platform=node --target=node18 --outfile=dist/index.cjs --format=cjs --external:pg-native --minify', { stdio: 'inherit' });

// Create minimal frontend for testing
console.log('Creating minimal frontend...');
const minimalHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SBT Portal - Deploy Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; text-align: center; }
        .container { max-width: 600px; margin: 0 auto; }
        .logo { width: 200px; margin-bottom: 20px; }
        .status { color: #28a745; font-size: 24px; margin: 20px 0; }
        .info { color: #666; margin: 10px 0; }
        .btn { background: #007bff; color: white; padding: 12px 24px; border: none; border-radius: 5px; text-decoration: none; display: inline-block; margin: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <img src="/sbt_logo.png" alt="SBT Logo" class="logo" />
        <div class="status">✅ Deploy Funcionando!</div>
        <div class="info">Portal de Seleção SBT está online</div>
        <div class="info">Build: ${new Date().toISOString()}</div>
        <a href="/" class="btn">Página Inicial</a>
        <a href="/agendamento" class="btn">Agendamento</a>
        <a href="/cartao-preview" class="btn">Cartões</a>
    </div>
    <script>
        console.log('SBT Portal carregado com sucesso!');
        console.log('Build timestamp:', '${new Date().toISOString()}');
    </script>
</body>
</html>`;

fs.writeFileSync('dist/public/index.html', minimalHTML);

// Copy essential static files
const staticFiles = ['sbt_logo.png', 'azul-logo.png'];
staticFiles.forEach(file => {
    if (fs.existsSync(file)) {
        fs.copyFileSync(file, `dist/public/${file}`);
        console.log(`Copied ${file}`);
    }
});

// Verify build
const backendExists = fs.existsSync('dist/index.cjs');
const frontendExists = fs.existsSync('dist/public/index.html');

if (backendExists && frontendExists) {
  const backendSize = Math.round(fs.statSync('dist/index.cjs').size / 1024);
  console.log(`Build complete: Backend (${backendSize}KB), Frontend ready`);
  console.log('Ready for Heroku deployment!');
} else {
  console.error('Build failed - missing files');
  process.exit(1);
}