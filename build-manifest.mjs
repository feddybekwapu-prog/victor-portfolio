// Lists the project and post files so the site knows what to load.
// Runs automatically on every publish. You never need to run this yourself.
import { readdir, writeFile } from 'node:fs/promises';

const list = async dir =>
  (await readdir(dir).catch(() => []))
    .filter(f => f.endsWith('.json'))
    .map(f => f.slice(0, -5))
    .sort();

const manifest = { projects: await list('content/projects'), posts: await list('content/posts') };
await writeFile('content/manifest.json', JSON.stringify(manifest, null, 2) + '\n');
console.log('Manifest written:', manifest);
