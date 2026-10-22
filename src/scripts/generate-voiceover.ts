import {spawn} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {narration} from '../data/narration.ts';

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
const provider = env.TTS_PROVIDER ?? 'edge';
const voice = env.TTS_VOICE ?? 'en-US-AndrewNeural';
const rate = env.TTS_RATE ?? '-10%';
const outDir = resolve('public/voiceover');
mkdirSync(outDir, {recursive: true});

const edgeTts = async (text: string, outFile: string): Promise<void> => {
  const textFile = resolve('public/voiceover/.line.txt');
  writeFileSync(textFile, text, 'utf8');
  const code = await run('python', [
    '-m',
    'edge_tts',
    `--voice=${voice}`,
    `--rate=${rate}`,
    `--file=${textFile}`,
    `--write-media=${outFile}`,
  ]);
  if (code !== 0) {
    throw new Error(`edge-tts exited with code ${code}`);
  }
};

const openAiTts = async (text: string, outFile: string): Promise<void> => {
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('TTS_PROVIDER=openai needs OPENAI_API_KEY in .env');
  }
  const model = env.OPENAI_TTS_MODEL ?? 'gpt-4o-mini-tts';
  const openAiVoice = env.OPENAI_TTS_VOICE ?? 'alloy';
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({model, voice: openAiVoice, input: text, response_format: 'mp3'}),
  });
  if (!response.ok) {
    throw new Error(`OpenAI TTS failed with ${response.status}: ${await response.text()}`);
  }
  writeFileSync(outFile, Buffer.from(await response.arrayBuffer()));
};

const generate = provider === 'openai' ? openAiTts : edgeTts;

for (const entry of narration) {
  const outFile = resolve(outDir, entry.audioFile);
  console.log(`[voiceover] ${entry.id} -> ${entry.audioFile} (${provider}, voice ${voice})`);
  await generate(entry.text, outFile);
  if (!existsSync(outFile) || statSync(outFile).size < 1000) {
    throw new Error(`Voiceover for scene "${entry.id}" was not written to ${outFile}`);
  }
  console.log(`[voiceover] wrote ${outFile} (${statSync(outFile).size} bytes)`);
}

console.log('All voiceover files are ready.');
