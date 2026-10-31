const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const files = {'/':'index.html','/index.html':'index.html','/styles.css':'styles.css','/app.js':'app.js'};
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8'};
http.createServer((req,res)=>{
  const file=files[new URL(req.url,'http://localhost').pathname];
  if(!file){res.writeHead(404);res.end('No encontrado');return;}
  fs.readFile(path.join(__dirname,file),(error,body)=>{if(error){res.writeHead(500);res.end('No se pudo leer el archivo');return;}res.writeHead(200,{'Content-Type':types[path.extname(file)],'Cache-Control':'no-store'});res.end(body);});
}).listen(4173,'127.0.0.1',()=>console.log('AulaSync: http://127.0.0.1:4173'));
