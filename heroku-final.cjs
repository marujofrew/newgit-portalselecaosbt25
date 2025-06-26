const fs = require('fs');

console.log('Heroku Final Deploy - Solução Simples');

// Limpar e criar diretório
if (fs.existsSync('dist')) fs.rmSync('dist', { recursive: true });
fs.mkdirSync('dist', { recursive: true });
fs.mkdirSync('dist/public', { recursive: true });

// Servidor mínimo sem dependências
const server = `const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  console.log(req.method, req.url);
  
  if (req.url === '/health') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end('{"status":"ok","time":"' + new Date().toISOString() + '"}');
    return;
  }
  
  const filePath = req.url === '/' ? '/index.html' : req.url;
  const fullPath = path.join(__dirname, 'public', filePath);
  
  fs.readFile(fullPath, (err, data) => {
    if (err) {
      const indexPath = path.join(__dirname, 'public', 'index.html');
      fs.readFile(indexPath, (err2, indexData) => {
        if (err2) {
          res.writeHead(404);
          res.end('Not Found');
        } else {
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end(indexData);
        }
      });
    } else {
      const ext = path.extname(fullPath);
      const contentType = ext === '.html' ? 'text/html' : 
                         ext === '.css' ? 'text/css' : 
                         ext === '.js' ? 'text/javascript' :
                         ext === '.png' ? 'image/png' : 'text/plain';
      res.writeHead(200, {'Content-Type': contentType});
      res.end(data);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('SBT Portal running on port', PORT);
});`;

fs.writeFileSync('dist/index.cjs', server);

// Frontend simples
const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portal SBT - Sistema de Seleção</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            background: linear-gradient(135deg, #0066cc, #004499);
            min-height: 100vh;
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
        h1 { 
            font-size: 3rem; 
            margin-bottom: 20px;
        }
        .status { 
            background: #28a745; 
            padding: 10px 20px; 
            border-radius: 50px; 
            display: inline-block;
            margin: 20px 0;
        }
        .btn {
            background: white;
            color: #0066cc;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 25px;
            margin: 10px;
            display: inline-block;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Portal SBT</h1>
        <p>Sistema Brasileiro de Televisão</p>
        <div class="status">✓ Sistema Online</div>
        <p>Portal de seleção e casting oficial</p>
        <a href="/agendamento" class="btn">Fazer Agendamento</a>
        <a href="/cartao-preview" class="btn">Cartões de Embarque</a>
    </div>
</body>
</html>`;

fs.writeFileSync('dist/public/index.html', html);

console.log('Build concluído:');
console.log('- Servidor:', Math.round(fs.statSync('dist/index.cjs').size/1024), 'KB');
console.log('- Frontend:', Math.round(fs.statSync('dist/public/index.html').size/1024), 'KB');
console.log('Pronto para deploy!');