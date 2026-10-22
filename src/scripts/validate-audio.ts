import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {episodes, type SceneId} from '../data/episodes.ts';
import {findMissingAudio} from '../lib/audioFiles.ts';
import {checkAudioSlot} from '../lib/audioSlots.ts';
import {parseMp3Duration} from '../lib/mp3Duration.ts';
import {audioSlot} from '../lib/timeline.ts';

const FPS = 30;
const SCENES: SceneId[] = ['hook', 'core', 'add1', 'add2', 'closer'];

const requested = process.argv
  .filter((argument) => argument.startsWith('--episode='))
  .map((argument) => argument.split('=')[1]);
const selected = requested.length
  ? episodes.filter((episode) => requested.includes(episode.id))
  : episodes;

let problems = 0;

for (const episode of selected) {
  const entries = SCENES.map((scene) => ({
    sceneId: scene,
    file: `${scene}.mp3`,
  }));
  const resolvePath = (file: string) =>
    resolve('public/voiceover', episode.id, file);

  const missing = findMissingAudio(entries, (path) => existsSync(path), resolvePath);
  if (missing.length > 0) {
    problems += missing.length;
    console.error(`${episode.id}: missing voiceover files`);
    for (const item of missing) {
      console.error(`  scene "${item.sceneId}": ${item.path}`);
    }
    continue;
  }

  for (const entry of entries) {
    const seconds = parseMp3Duration(readFileSync(resolvePath(entry.file)));
    if (seconds === null) {
      problems += 1;
      console.error(`${episode.id}/${entry.sceneId}: could not be measured`);
      continue;
    }
    const slot = audioSlot(entry.sceneId as SceneId);
    const check = checkAudioSlot(entry.sceneId, seconds, slot.durationInFrames, FPS);
    if (check.overlong) {
      problems += 1;
      console.warn(check.message);
    } else {
      console.log(`${episode.id}: ${check.message}`);
    }
  }
}

if (problems > 0) {
  console.error(
    `${problems} voiceover problem(s) found. Shorten the line in src/data/episodes.ts or give the scene more frames.`,
  );
  process.exit(1);
}

console.log('All voiceover files are present and fit their slots.');
