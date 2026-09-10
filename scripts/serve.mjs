import http from 'node:http';
import path from 'node:path';
import { readFile, realpath, stat } from 'node:fs/promises';
import { publicRoot, createManifest, writeManifest } from './content.mjs';

const port = Number(process.env.PORT || 4173);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg' };
const root = await realpath(publicRoot);
await writeManifest();

const server = http.createServer(async (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return; }
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname === '/content/index.json') {
      const manifest = await createManifest();
      res.writeHead(200, { 'Content-Type': mime['.json'] });
      res.end(req.method === 'HEAD' ? undefined : JSON.stringify(manifest));
      return;
    }
    const candidate = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    const filename = await realpath(candidate);
    const relative = path.relative(root, filename);
    if (relative.startsWith('..') || path.isAbsolute(relative)) { res.writeHead(403); res.end('Acesso negado.'); return; }
    if (!(await stat(filename)).isFile()) { res.writeHead(404); res.end('Não encontrado.'); return; }
    const body = await readFile(filename);
    res.writeHead(200, { 'Content-Type': mime[path.extname(filename)] || 'application/octet-stream' });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch (error) {
    const code = error.code === 'ENOENT' ? 404 : error instanceof URIError ? 400 : 500;
    res.writeHead(code, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(code === 500 ? `Erro ao ler conteúdo: ${error.message}` : 'Não encontrado.');
  }
});
server.listen(port, '127.0.0.1', () => console.log(`Portfólio disponível em http://127.0.0.1:${port}`));
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
