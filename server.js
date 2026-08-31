/** DocFlow's dependency-free static application server. */
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = Number(process.env.PORT) || 8080;
const mimeTypes = {
  '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon', '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp'
};

function validateApplication() {
  const requiredFiles = ['index.html', 'dashboard.html', 'css/style.css', 'js/auth.js', 'js/app.js'];
  const missing = requiredFiles.filter(file => !fs.existsSync(path.join(root, file)));
  if (missing.length) throw new Error(`Missing application files: ${missing.join(', ')}`);
  console.log(`DocFlow build check passed (${requiredFiles.length} application files verified).`);
}

if (process.argv.includes('--check')) {
  try { validateApplication(); } catch (error) {
    console.error(`Build check failed: ${error.message}`);
    process.exitCode = 1;
  }
  return;
}

http.createServer((request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Allow': 'GET, HEAD'
    });
    response.end('Method not allowed');
    return;
  }

  const requestPath = decodeURIComponent((request.url || '/').split('?')[0]);
  const safePath = path.normalize(requestPath === '/' ? '/index.html' : requestPath).replace(/^([/\\])+/, '');
  const filePath = path.resolve(root, safePath);
  if (!filePath.startsWith(root + path.sep)) {
    response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Forbidden');
    return;
  }
  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }

    fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Server error');
      return;
    }
    response.writeHead(200, {
      'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Content-Length': data.length
    });
    response.end(request.method === 'HEAD' ? undefined : data);
    });
  });
}).listen(port, () => console.log(`DocFlow is running at http://localhost:${port}`));
