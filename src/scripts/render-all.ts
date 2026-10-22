import {spawn} from 'node:child_process';
import {episodes} from '../data/episodes.ts';

const run = (command: string, args: string[]): Promise<number> =>
  new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {stdio: 'inherit'});
    child.on('error', reject);
    child.on('close', (code) => resolvePromise(code ?? 1));
  });

const only = process.argv
  .filter((argument) => argument.startsWith('--episode='))
  .map((argument) => argument.split('=')[1]);

const selected = only.length
  ? episodes.filter((episode) => only.includes(episode.id))
  : episodes;

for (const episode of selected) {
  console.log(`[render] ${episode.id}`);
  const code = await run('npx', [
    'remotion',
    'render',
    'src/index.ts',
    episode.id,
    `out/${episode.id}.mp4`,
    '--codec=h264',
    '--crf=18',
    '--port=3111',
    '--gl=angle',
  ]);
  if (code !== 0) {
    console.error(`[render] ${episode.id} failed with code ${code}`);
    process.exit(code);
  }
}

console.log('All episodes are rendered.');
