import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const publicRoot = fileURLToPath(new URL('../dist/', import.meta.url));
const accents = ['lavender', 'peach', 'mint', 'yellow', 'pink', 'blue'];

export function validatePost(post, filename) {
  if (!post || typeof post !== 'object' || Array.isArray(post)) throw new Error(`${filename}: use um objeto JSON.`);
  for (const key of ['title', 'summary']) {
    if (typeof post[key] !== 'string' || !post[key].trim()) throw new Error(`${filename}: "${key}" é obrigatório.`);
  }
  for (const key of ['details', 'tags', 'nextSteps']) {
    if (post[key] !== undefined && (!Array.isArray(post[key]) || post[key].some(value => typeof value !== 'string'))) {
      throw new Error(`${filename}: "${key}" deve ser uma lista de textos.`);
    }
  }
  if (post.order !== undefined && !Number.isFinite(post.order)) throw new Error(`${filename}: "order" deve ser um número.`);
  if (post.accent && !accents.includes(post.accent)) throw new Error(`${filename}: cor desconhecida em "accent".`);
  if (post.links !== undefined && (!Array.isArray(post.links) || post.links.some(link => !link || typeof link.label !== 'string' || typeof link.url !== 'string' || !/^https?:\/\//.test(link.url)))) {
    throw new Error(`${filename}: links precisam de "label" e "url" iniciando com https:// ou http://.`);
  }
  return post;
}

async function walk(directory) {
  const found = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue;
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) found.push(...await walk(filename));
    else if (entry.isFile() && entry.name.endsWith('.json')) found.push(filename);
  }
  return found.sort();
}

export async function createManifest(root = publicRoot) {
  const manifest = { projects: [], skills: [] };
  for (const kind of Object.keys(manifest)) {
    const files = await walk(path.join(root, 'content', kind));
    for (const filename of files) {
      let post;
      try { post = JSON.parse(await readFile(filename, 'utf8')); }
      catch (error) { throw new Error(`${path.relative(root, filename)}: JSON inválido. ${error.message}`); }
      validatePost(post, path.relative(root, filename));
      if (post.draft === true) continue;
      manifest[kind].push(path.relative(root, filename).split(path.sep).map(encodeURIComponent).join('/'));
    }
  }
  return manifest;
}

export async function writeManifest(root = publicRoot) {
  const manifest = await createManifest(root);
  await writeFile(path.join(root, 'content', 'index.json'), JSON.stringify(manifest, null, 2) + '\n');
  return manifest;
}
