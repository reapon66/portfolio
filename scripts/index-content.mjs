import { writeManifest } from './content.mjs';
try {
  const manifest = await writeManifest();
  console.log(`Índice atualizado: ${manifest.projects.length} projetos e ${manifest.skills.length} habilidades.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
