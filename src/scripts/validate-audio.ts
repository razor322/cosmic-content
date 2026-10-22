import {existsSync, readFileSync, statSync} from 'node:fs';
import {resolve} from 'node:path';
import {narration} from '../data/narration.ts';
import {findMissingAudio} from '../lib/audioFiles.ts';
import {checkAudioSlot} from '../lib/audioSlots.ts';

const FPS = 30;

const missing = findMissingAudio(
  narration,
  (path) => existsSync(path),
  (file) => resolve('public/voiceover', file),
);

if (missing.length > 0) {
  console.error('Missing voiceover files:');
  for (const item of missing) {
    console.error(`  scene "${item.id}": ${item.path}`);
  }
  console.error('Run "npm run voiceover" to generate them.');
  process.exit(1);
}

const {parseMp3Duration} = await import('../lib/mp3Duration.ts');
let overlong = 0;
let unreadable = 0;

for (const entry of narration) {
  const path = resolve('public/voiceover', entry.audioFile);
  const bytes = readFileSync(path);
  const seconds = parseMp3Duration(bytes);

  if (seconds === null) {
    unreadable += 1;
    console.warn(`${entry.id}: ${entry.audioFile} could not be measured (${statSync(path).size} bytes)`);
    continue;
  }

  const check = checkAudioSlot(entry, seconds, FPS);
  const size = statSync(path).size;
  if (check.overlong) {
    overlong += 1;
    console.warn(`${check.message} (${size} bytes)`);
    console.warn(`  The voiceover is not cut short: it plays past its slot and into the next scene.`);
  } else {
    console.log(`${check.message} (${size} bytes)`);
  }
}

if (unreadable > 0) {
  console.error(
    `${unreadable} voiceover file(s) could not be measured. Rendering is stopped because the slot fit is unknown.`,
  );
  process.exit(1);
}

if (overlong > 0) {
  console.error(
    `${overlong} voiceover file(s) exceed their slot. Shorten the line in src/data/narration.ts or extend the slot.`,
  );
  process.exit(1);
}

console.log('All voiceover files are present and fit their slots.');
