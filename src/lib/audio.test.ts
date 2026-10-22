import assert from 'node:assert/strict';
import {test} from 'node:test';
import {narration} from '../data/narration.ts';
import {checkAudioSlot} from './audioSlots.ts';
import {findMissingAudio} from './audioFiles.ts';

test('a short voiceover fits its slot', () => {
  const check = checkAudioSlot(narration[0], 3.2, 30);
  assert.equal(check.overlong, false);
  assert.equal(check.allowedSeconds, 4);
});

test('an overlong voiceover is reported with scene id and both durations', () => {
  const check = checkAudioSlot(narration[0], 5.4, 30);
  assert.equal(check.overlong, true);
  assert.match(check.message, /void/);
  assert.match(check.message, /5\.40/);
  assert.match(check.message, /4\.00/);
});

test('all files present reports nothing missing', () => {
  const missing = findMissingAudio(narration, () => true, (file) => `public/voiceover/${file}`);
  assert.deepEqual(missing, []);
});

test('a missing file is named with its scene id and path', () => {
  const missing = findMissingAudio(
    narration,
    (path) => !path.includes('scene-3.mp3'),
    (file) => `public/voiceover/${file}`,
  );
  assert.equal(missing.length, 1);
  assert.equal(missing[0].id, 'planet');
  assert.equal(missing[0].path, 'public/voiceover/scene-3.mp3');
});
