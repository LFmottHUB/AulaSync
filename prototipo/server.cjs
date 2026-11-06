const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const HOST = '127.0.0.1';
const PORT = 4173;
// Lista explícita: el servidor no publica documentos ni archivos arbitrarios del proyecto.
const PUBLIC_FILES = new Map([
  ['/', 'index.html'],
  ['/index.html', 'index.html'],
  ['/styles.css', 'styles.css'],
  ['/data.js', 'data.js'],
  ['/calendar.js', 'calendar.js'],
  ['/views.js', 'views.js'],
  ['/app.js', 'app.js'],
]);
const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
};

function sendError(response, status, message) {
  response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end(message);
}

function serveFile(request, response) {
  let pathname;

  try {
    pathname = new URL(request.url, `http://${HOST}`).pathname;
  } catch {
    sendError(response, 400, 'Solicitud inválida');
    return;
  }

  const file = PUBLIC_FILES.get(pathname);

  if (!file) {
    sendError(response, 404, 'No encontrado');
    return;
  }

  fs.readFile(path.join(__dirname, file), (error, body) => {
    if (error) {
      sendError(response, 500, 'No se pudo leer el archivo');
      return;
    }

    response.writeHead(200, {
      'Content-Type': CONTENT_TYPES[path.extname(file)],
      'Cache-Control': 'no-store',
    });
    response.end(body);
  });
}

http.createServer(serveFile).listen(PORT, HOST, () => {
  console.log(`AulaSync: http://${HOST}:${PORT}`);
});
