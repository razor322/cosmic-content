import assert from 'node:assert/strict';
import {test} from 'node:test';
import {checkAudioSlot} from './audioSlots.ts';
import {findMissingAudio} from './audioFiles.ts';

test('a short voiceover fits its slot', () => {
  const check = checkAudioSlot('core', 7.2, 266, 30);
  assert.equal(check.overlong, false);
  assert.ok(Math.abs(check.allowedSeconds - 266 / 30) < 1e-9);
});

test('an overlong voiceover is reported with the scene and both durations', () => {
  const check = checkAudioSlot('core', 9.4, 266, 30);
  assert.equal(check.overlong, true);
  assert.match(check.message, /core/);
  assert.match(check.message, /9\.40/);
  assert.match(check.message, /8\.87/);
});

test('all files present reports nothing missing', () => {
  const entries = [
    {sceneId: 'core', file: 'core.mp3'},
    {sceneId: 'add1', file: 'add1.mp3'},
  ];
  const missing = findMissingAudio(entries, () => true, (file) => `voiceover/${file}`);
  assert.deepEqual(missing, []);
});

test('a missing file is named with its scene and path', () => {
  const entries = [
    {sceneId: 'core', file: 'core.mp3'},
    {sceneId: 'add1', file: 'add1.mp3'},
  ];
  const missing = findMissingAudio(
    entries,
    (path) => !path.includes('add1.mp3'),
    (file) => `voiceover/${file}`,
  );
  assert.equal(missing.length, 1);
  assert.equal(missing[0].sceneId, 'add1');
  assert.equal(missing[0].path, 'voiceover/add1.mp3');
});
