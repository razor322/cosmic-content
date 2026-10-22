import assert from 'node:assert/strict';
import {test} from 'node:test';
import {parseMp3Duration} from './mp3Duration.ts';

const FRAME_LENGTH = 144;

const buildFrame = (): Uint8Array => {
  const frame = new Uint8Array(FRAME_LENGTH);
  frame[0] = 0xff;
  frame[1] = 0xf3;
  frame[2] = 0x64;
  frame[3] = 0xc4;
  return frame;
};

const buildStream = (frames: number): Uint8Array => {
  const bytes = new Uint8Array(FRAME_LENGTH * frames);
  for (let i = 0; i < frames; i++) {
    bytes.set(buildFrame(), i * FRAME_LENGTH);
  }
  return bytes;
};

test('a constant bitrate stream measures its frame count', () => {
  const duration = parseMp3Duration(buildStream(10));
  assert.ok(duration);
  assert.equal(Math.round(duration * 1000), Math.round((10 * 576 * 1000) / 24000));
});

test('the measured duration grows with the stream', () => {
  const short = parseMp3Duration(buildStream(10)) ?? 0;
  const long = parseMp3Duration(buildStream(100)) ?? 0;
  assert.ok(long > short * 9);
});

test('an id3 tag before the first frame is skipped', () => {
  const tag = new Uint8Array(10 + 4);
  tag[0] = 0x49;
  tag[1] = 0x44;
  tag[2] = 0x33;
  tag[6] = 0;
  tag[7] = 0;
  tag[8] = 0;
  tag[9] = 4;
  const bytes = new Uint8Array(tag.length + FRAME_LENGTH * 3);
  bytes.set(tag, 0);
  bytes.set(buildStream(3), tag.length);
  const duration = parseMp3Duration(bytes);
  assert.ok(duration);
  assert.equal(Math.round(duration * 1000), Math.round((3 * 576 * 1000) / 24000));
});

test('bytes that are not an mp3 return null', () => {
  assert.equal(parseMp3Duration(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])), null);
  assert.equal(parseMp3Duration(new Uint8Array(0)), null);
});

test('a truncated stream still reports the frames it can read', () => {
  const bytes = buildStream(4);
  const duration = parseMp3Duration(bytes.subarray(0, FRAME_LENGTH * 2 + 10));
  assert.ok(duration);
  assert.equal(Math.round(duration * 1000), Math.round((2 * 576 * 1000) / 24000));
});
