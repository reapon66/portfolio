import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, copyFile, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createManifest, writeManifest, publicRoot } from '../scripts/content.mjs';

const sample = { title: 'Projeto de teste', summary: 'Uma ideia independente.', tags: ['Vue'], details: ['Descrição.'] };
async function fixture(t) {
  const prefix = path.join(os.tmpdir(), 'reapon-content-');
  const root = await mkdtemp(prefix);
  await mkdir(path.join(root, 'content', 'projects'), { recursive: true });
  await mkdir(path.join(root, 'content', 'skills'), { recursive: true });
  t.after(async () => {
    const absolute = path.resolve(root);
    assert.ok(absolute.startsWith(path.resolve(prefix)) && path.dirname(absolute) === path.resolve(os.tmpdir()));
    await rm(absolute, { recursive: true, force: true });
  });
  return root;
}

test('copiar um post o indexa sem cadastro manual, mesmo com título igual', async t => {
  const root = await fixture(t);
  const original = path.join(root, 'content/projects/original.json');
  await writeFile(original, JSON.stringify(sample));
  assert.equal((await createManifest(root)).projects.length, 1);
  await copyFile(original, path.join(root, 'content/projects/copia.json'));
  const manifest = await createManifest(root);
  assert.deepEqual(manifest.projects, ['content/projects/copia.json', 'content/projects/original.json']);
});

test('subpastas e nomes com espaços/acentos geram URLs que apontam para os arquivos', async t => {
  const root = await fixture(t);
  await mkdir(path.join(root, 'content/skills/front end'));
  await writeFile(path.join(root, 'content/skills/front end/Animação.json'), JSON.stringify(sample));
  const manifest = await createManifest(root);
  assert.equal(manifest.skills.length, 1);
  const filename = path.join(root, ...manifest.skills[0].split('/').map(decodeURIComponent));
  assert.equal(JSON.parse(await readFile(filename, 'utf8')).title, sample.title);
});

test('rascunhos e arquivos ou pastas com prefixo _ ficam fora do portfólio', async t => {
  const root = await fixture(t);
  await writeFile(path.join(root, 'content/projects/draft.json'), JSON.stringify({ ...sample, draft: true }));
  await writeFile(path.join(root, 'content/projects/_modelo.json'), 'arquivo ignorado');
  await mkdir(path.join(root, 'content/projects/_privado'));
  await writeFile(path.join(root, 'content/projects/_privado/rascunho.json'), 'ignorado');
  assert.deepEqual((await createManifest(root)).projects, []);
});

test('JSON inválido identifica o arquivo e preserva o índice anterior', async t => {
  const root = await fixture(t);
  await writeManifest(root);
  const before = await readFile(path.join(root, 'content/index.json'), 'utf8');
  await writeFile(path.join(root, 'content/projects/quebrado.json'), '{');
  await assert.rejects(writeManifest(root), /quebrado.json: JSON inválido/);
  assert.equal(await readFile(path.join(root, 'content/index.json'), 'utf8'), before);
});

test('conteúdo incompleto e links executáveis são rejeitados com diagnóstico', async t => {
  const root = await fixture(t);
  const file = path.join(root, 'content/projects/post.json');
  await writeFile(file, JSON.stringify({ title: 'Sem resumo' }));
  await assert.rejects(createManifest(root), /summary.*obrigatório/);
  await writeFile(file, JSON.stringify({ ...sample, links: [{ label: 'Abrir', url: 'javascript:alert(1)' }] }));
  await assert.rejects(createManifest(root), /links precisam/);
});

test('o índice publicado corresponde aos arquivos atuais e todos são legíveis', async () => {
  const manifest = await createManifest();
  const saved = JSON.parse(await readFile(path.join(publicRoot, 'content/index.json'), 'utf8'));
  assert.deepEqual(saved, manifest);
  for (const filename of [...manifest.projects, ...manifest.skills]) {
    const post = JSON.parse(await readFile(path.join(publicRoot, decodeURIComponent(filename)), 'utf8'));
    assert.ok(post.title && post.summary);
  }
});
