import {spawn} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {episodes, SIGN_OFF, type Episode, type SceneId} from '../data/episodes.ts';

const loadEnv = (path: string): Record<string, string> => {
  if (!existsSync(path)) {
    return {};
  }
  const values: Record<string, string> = {};
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    const separator = trimmed.indexOf('=');
    if (separator === -1) {
      continue;
    }
    values[trimmed.slice(0, separator).trim()] = trimmed.slice(separator + 1).trim();
  }
  return values;
};

const run = (command: string, args: string[]): Promise<number> =>
  new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {stdio: 'inherit'});
    child.on('error', reject);
    child.on('close', (code) => resolvePromise(code ?? 1));
  });

const env = {...loadEnv('.env'), ...process.env};
const rawRate = env.TTS_RATE ?? '0%';
const rate = /^[+-]/.test(rawRate) ? rawRate : `+${rawRate}`;
const requested = process.argv
  .filter((argument) => argument.startsWith('--episode='))
  .map((argument) => argument.split('=')[1]);
const selected: Episode[] = requested.length
  ? episodes.filter((episode) => requested.includes(episode.id))
  : episodes;

if (selected.length === 0) {
  console.error(`No episode matched ${requested.join(', ')}.`);
  process.exit(1);
}

const SCENES: SceneId[] = ['hook', 'core', 'add1', 'add2', 'closer'];

for (const episode of selected) {
  const outDir = resolve('public/voiceover', episode.id);
  mkdirSync(outDir, {recursive: true});
  console.log(`[voiceover] ${episode.id} with ${episode.voice} at ${rate}`);

  for (const scene of SCENES) {
    const text = episode.scenes[scene]?.narration ?? SIGN_OFF;
    const outFile = resolve(outDir, `${scene}.mp3`);
    const textFile = resolve(outDir, `.${scene}.txt`);
    writeFileSync(textFile, text, 'utf8');
    const code = await run('python', [
      '-m',
      'edge_tts',
      `--voice=${episode.voice}`,
      `--rate=${rate}`,
      `--file=${textFile}`,
      `--write-media=${outFile}`,
    ]);
    if (code !== 0) {
      throw new Error(`edge-tts failed for ${episode.id}/${scene} with code ${code}`);
    }
    if (!existsSync(outFile) || statSync(outFile).size < 1000) {
      throw new Error(`No voiceover was written to ${outFile}`);
    }
    console.log(`[voiceover] ${episode.id}/${scene}.mp3 (${statSync(outFile).size} bytes)`);
  }
}

console.log('All voiceover files are ready.');
