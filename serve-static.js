// Tiny static file server (no dependencies)
// Usage: node serve-static.js [port]
const http = require('http');
const fs = require('fs');
const path = require('path');
const port = parseInt(process.argv[2], 10) || 8000;
const root = process.cwd();

const mime = {
  '.html':'text/html', '.htm':'text/html', '.css':'text/css', '.js':'application/javascript',
  '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg',
  '.gif':'image/gif', '.svg':'image/svg+xml', '.ico':'image/x-icon', '.woff':'font/woff',
  '.woff2':'font/woff2', '.ttf':'font/ttf', '.eot':'application/vnd.ms-fontobject'
};

const server = http.createServer((req, res) => {
  try {
    const reqPath = decodeURIComponent(new URL(req.url, `http://localhost`).pathname);
    let filePath = path.join(root, reqPath);
    fs.stat(filePath, (err, stats) => {
      if (err) return send404();
      if (stats.isDirectory()) {
        // try index.html
        const indexFile = path.join(filePath, 'index.html');
        fs.stat(indexFile, (ie, is) => {
          if (!ie && is.isFile()) return sendFile(indexFile);
          // otherwise list directory
          fs.readdir(filePath, (re, files) => {
            if (re) return send500(re);
            res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
            res.write(`<h1>Index of ${reqPath}</h1><ul>`);
            if (reqPath !== '/') res.write(`<li><a href="${path.join(reqPath,'..')}">..</a></li>`);
            files.forEach(f=>{
              const href = path.posix.join(reqPath, f);
              res.write(`<li><a href="${href}">${f}</a></li>`);
            });
            res.end('</ul>');
          });
        });
      } else if (stats.isFile()) {
        sendFile(filePath);
      } else send404();
    });

    function sendFile(p){
      const ext = path.extname(p).toLowerCase();
      const type = mime[ext] || 'application/octet-stream';
      res.writeHead(200, {'Content-Type': type});
      const stream = fs.createReadStream(p);
      stream.pipe(res);
      stream.on('error', () => send500());
    }

    function send404(){ res.writeHead(404, {'Content-Type':'text/plain'}); res.end('Not found'); }
    function send500(e){ res.writeHead(500, {'Content-Type':'text/plain'}); res.end('Server error'); }
  } catch (e) {
    res.writeHead(500); res.end('Server error');
  }
});

server.listen(port, ()=>{
  console.log(`Serving ${root} at http://localhost:${port}/`);
  console.log('Press Ctrl+C to stop');
});
