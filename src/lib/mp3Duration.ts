const SAMPLE_RATES: Record<number, readonly number[]> = {
  3: [44100, 48000, 32000],
  2: [22050, 24000, 16000],
  0: [11025, 12000, 8000],
};

const BITRATES: Record<number, readonly number[]> = {
  3: [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0],
  2: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0],
  0: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0],
};

const LAYER_III = 1;

type FrameHeader = {
  versionId: number;
  bitrateKbps: number;
  sampleRate: number;
  padding: number;
  samplesPerFrame: number;
  frameLength: number;
};

const readHeader = (bytes: Uint8Array, offset: number): FrameHeader | null => {
  if (offset + 4 > bytes.length) {
    return null;
  }
  const first = bytes[offset];
  const second = bytes[offset + 1];
  if (first !== 0xff || (second & 0xe0) !== 0xe0) {
    return null;
  }
  const versionId = (second >> 3) & 0x03;
  const layer = (second >> 1) & 0x03;
  if (layer !== LAYER_III) {
    return null;
  }
  const third = bytes[offset + 2];
  const fourth = bytes[offset + 3];
  const bitrateIndex = (third >> 4) & 0x0f;
  const sampleRateIndex = (third >> 2) & 0x03;
  if (bitrateIndex === 0 || bitrateIndex === 15 || sampleRateIndex === 3) {
    return null;
  }
  const bitrateKbps = BITRATES[versionId][bitrateIndex];
  const sampleRate = SAMPLE_RATES[versionId][sampleRateIndex];
  if (bitrateKbps === 0 || sampleRate === 0) {
    return null;
  }
  const padding = (third >> 1) & 0x01;
  const isMono = ((fourth >> 6) & 0x03) === 3;
  const samplesPerFrame = versionId === 3 ? (isMono ? 384 : 1152) : isMono ? 576 : 1152;
  const frameLength =
    Math.floor((samplesPerFrame / 8) * (bitrateKbps * 1000) / sampleRate) + padding;
  return {versionId, bitrateKbps, sampleRate, padding, samplesPerFrame, frameLength};
};

const id3Length = (bytes: Uint8Array): number => {
  if (bytes.length < 10 || bytes[0] !== 0x49 || bytes[1] !== 0x44 || bytes[2] !== 0x33) {
    return 0;
  }
  return (
    10 +
    ((bytes[6] & 0x7f) << 21) +
    ((bytes[7] & 0x7f) << 14) +
    ((bytes[8] & 0x7f) << 7) +
    (bytes[9] & 0x7f)
  );
};

/**
 * Reads the duration of a constant bitrate MPEG audio stream by walking its
 * frame headers. Returns null when the bytes are not a readable MPEG stream.
 */
export const parseMp3Duration = (bytes: Uint8Array): number | null => {
  let offset = id3Length(bytes);
  let samples = 0;
  let sampleRate = 0;
  let frames = 0;

  while (offset + 4 <= bytes.length) {
    const header = readHeader(bytes, offset);
    if (!header) {
      const next = findSync(bytes, offset + 1);
      if (next === -1) {
        break;
      }
      offset = next;
      continue;
    }
    if (offset + header.frameLength > bytes.length) {
      break;
    }
    samples += header.samplesPerFrame;
    sampleRate = header.sampleRate;
    frames += 1;
    offset += header.frameLength;
  }
  if (frames === 0 || sampleRate === 0) {
    return null;
  }
  return samples / sampleRate;
};

const findSync = (bytes: Uint8Array, from: number): number => {
  for (let i = from; i + 1 < bytes.length; i++) {
    if (bytes[i] === 0xff && (bytes[i + 1] & 0xe0) === 0xe0) {
      return i;
    }
  }
  return -1;
};
