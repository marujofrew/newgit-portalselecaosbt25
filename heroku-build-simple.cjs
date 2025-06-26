// Build simples para Heroku - Garante que dist/index.cjs seja criado
const fs = require('fs');

console.log('Heroku Build Simple - Criando arquivos obrigatórios');

// Garantir que diretório existe
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}
if (!fs.existsSync('dist/public')) {
  fs.mkdirSync('dist/public', { recursive: true });
}

// Servidor HTTP básico
const server = `const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 5000;

console.log('SBT Portal iniciando na porta', PORT);

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end('{"status":"ok"}');
    return;
  }
  
  const filePath = req.url === '/' ? 'index.html' : req.url.slice(1);
  const fullPath = path.join(__dirname, 'public', filePath);
  
  fs.readFile(fullPath, (err, data) => {
    if (err) {
      fs.readFile(path.join(__dirname, 'public', 'index.html'), (err2, data2) => {
        if (err2) {
          res.writeHead(404);
          res.end('Not Found');
        } else {
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end(data2);
        }
      });
    } else {
      const contentType = filePath.endsWith('.html') ? 'text/html' : 
                         filePath.endsWith('.css') ? 'text/css' : 
                         filePath.endsWith('.js') ? 'text/javascript' : 'text/plain';
      res.writeHead(200, {'Content-Type': contentType});
      res.end(data);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('SBT Portal ativo na porta', PORT);
});`;

fs.writeFileSync('dist/index.cjs', server);

// HTML básico
const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portal SBT</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #0066cc, #004499);
            min-height: 100vh;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .container {
            text-align: center;
            background: rgba(255,255,255,0.1);
            padding: 40px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        h1 { font-size: 3rem; margin-bottom: 20px; }
        .status { 
            background: #28a745; 
            padding: 10px 20px; 
            border-radius: 50px; 
            display: inline-block;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Portal SBT</h1>
        <div class="status">Sistema Online</div>
        <p>Portal oficial de casting e seleção</p>
    </div>
</body>
</html>`;

fs.writeFileSync('dist/public/index.html', html);

console.log('Build concluído - arquivos criados:');
console.log('- dist/index.cjs');
console.log('- dist/public/index.html');
console.log('Heroku pode iniciar o servidor agora!');