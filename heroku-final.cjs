const { execSync } = require('child_process');
const fs = require('fs');

console.log('Heroku Final Deploy Fix');

// Clean build
if (fs.existsSync('dist')) fs.rmSync('dist', { recursive: true });
fs.mkdirSync('dist', { recursive: true });
fs.mkdirSync('dist/public', { recursive: true });

// Create production server
const server = `const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('*', (req, res) => {
  const indexPath = path.join(publicPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Application not found');
  }
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('SBT Portal running on port', PORT);
  console.log('Serving files from:', publicPath);
  console.log('Environment:', process.env.NODE_ENV || 'development');
});`;

fs.writeFileSync('dist/index.cjs', server);

// Create frontend
const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portal de Seleção SBT</title>
    <style>
        body { 
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
        }
        .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 600px;
        }
        h1 { color: #333; margin-bottom: 20px; }
        .status {
            background: #4CAF50;
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            margin: 20px 0;
            display: inline-block;
        }
        .btn {
            background: #007bff;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 50px;
            text-decoration: none;
            display: inline-block;
            margin: 10px;
            transition: all 0.3s ease;
        }
        .btn:hover {
            background: #0056b3;
            transform: translateY(-2px);
        }
        .info { color: #666; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Portal de Seleção SBT</h1>
        <div class="status">Sistema Online</div>
        <div class="info">Plataforma de casting e seleção de talentos</div>
        <div class="info">Deploy: ${new Date().toISOString()}</div>
        <div>
            <a href="/" class="btn">Página Inicial</a>
            <a href="/agendamento" class="btn">Agendamento</a>
            <a href="/cartao-preview" class="btn">Cartões</a>
            <a href="/api/health" class="btn">API Status</a>
        </div>
    </div>
    <script>
        console.log('SBT Portal carregado:', '${new Date().toISOString()}');
        fetch('/api/health')
            .then(response => response.json())
            .then(data => console.log('API Health:', data))
            .catch(error => console.log('API Error:', error));
    </script>
</body>
</html>`;

fs.writeFileSync('dist/public/index.html', html);

// Copy assets
const assets = ['sbt_logo.png', 'azul-logo.png'];
assets.forEach(asset => {
    if (fs.existsSync(asset)) {
        fs.copyFileSync(asset, `dist/public/${asset}`);
        console.log(`Copied ${asset}`);
    }
});

// Verify
const backendSize = fs.existsSync('dist/index.cjs') ? Math.round(fs.statSync('dist/index.cjs').size / 1024) : 0;
const frontendSize = fs.existsSync('dist/public/index.html') ? Math.round(fs.statSync('dist/public/index.html').size) : 0;

console.log(`Build complete: Backend (${backendSize}KB), Frontend (${frontendSize}B)`);
console.log('Ready for Heroku deployment!');