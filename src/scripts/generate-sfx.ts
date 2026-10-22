import {mkdirSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createRandom} from '../lib/seeded.ts';

const SAMPLE_RATE = 44100;

const writeWav = (path: string, samples: Float32Array): void => {
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  for (let index = 0; index < samples.length; index++) {
    const value = Math.max(-1, Math.min(1, samples[index]));
    buffer.writeInt16LE(Math.round(value * 32767), 44 + index * 2);
  }
  writeFileSync(path, buffer);
};

const makeHit = (): Float32Array => {
  const length = Math.floor(SAMPLE_RATE * 0.42);
  const samples = new Float32Array(length);
  const noise = createRandom(9001);
  for (let index = 0; index < length; index++) {
    const t = index / SAMPLE_RATE;
    const decay = Math.exp(-t * 13);
    const body =
      Math.sin(2 * Math.PI * 68 * t) * 0.62 +
      Math.sin(2 * Math.PI * 137 * t) * 0.22 +
      Math.sin(2 * Math.PI * 900 * t) * 0.06 * Math.exp(-t * 40);
    const air = (noise() * 2 - 1) * 0.4 * Math.exp(-t * 55);
    samples[index] = (body * decay + air) * 0.85;
  }
  return samples;
};

const makeWhoosh = (): Float32Array => {
  const length = Math.floor(SAMPLE_RATE * 0.95);
  const samples = new Float32Array(length);
  const noise = createRandom(9002);
  let low = 0;
  for (let index = 0; index < length; index++) {
    const t = index / SAMPLE_RATE;
    const position = t / 0.95;
    const cutoff = 320 + 4200 * Math.sin(Math.PI * position) ** 2;
    const alpha = Math.min(0.9, cutoff / SAMPLE_RATE);
    const white = noise() * 2 - 1;
    low += alpha * (white - low);
    const envelope = Math.sin(Math.PI * position) ** 2;
    const tone = Math.sin(2 * Math.PI * (180 + 620 * position) * t) * 0.12 * envelope;
    samples[index] = (low * 1.6 * envelope + tone) * 0.7;
  }
  return samples;
};

const makeAmbient = (): Float32Array => {
  const seconds = 8;
  const length = SAMPLE_RATE * seconds;
  const samples = new Float32Array(length);
  const noise = createRandom(9003);
  let low = 0;
  const voices = [55, 110, 110.25, 110.5, 165];
  for (let index = 0; index < length; index++) {
    const t = index / SAMPLE_RATE;
    let value = 0;
    voices.forEach((frequency, voiceIndex) => {
      const level = voiceIndex === 0 ? 0.16 : 0.1;
      const lfo = 0.6 + 0.4 * Math.sin(2 * Math.PI * 0.25 * t + voiceIndex);
      value += Math.sin(2 * Math.PI * frequency * t) * level * lfo;
    });
    const white = noise() * 2 - 1;
    low += 0.02 * (white - low);
    const edge = Math.min(1, t / 0.4, (seconds - t) / 0.4);
    samples[index] = (value * 0.55 + low * 0.5) * edge * 0.5;
  }
  return samples;
};

const outDir = resolve('public/audio');
mkdirSync(outDir, {recursive: true});

const files = [
  {name: 'hit.wav', samples: makeHit()},
  {name: 'whoosh.wav', samples: makeWhoosh()},
  {name: 'ambient.wav', samples: makeAmbient()},
];

for (const file of files) {
  const path = resolve(outDir, file.name);
  writeWav(path, file.samples);
  console.log(`[sfx] wrote ${path} (${(file.samples.length / SAMPLE_RATE).toFixed(2)}s)`);
}

console.log('All sound effects are ready.');
