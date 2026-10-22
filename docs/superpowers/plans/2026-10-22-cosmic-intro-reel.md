# CosmicIntro Reel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 30 second, 1080 by 1920, 30 fps Instagram Reel named `CosmicIntro` with five procedurally generated cosmic scenes, English voiceover, synchronized subtitles, and a cinematic palette, rendered to H.264 MP4.

**Architecture:** Two layers. `src/lib/` holds every piece of logic that can be wrong: timeline math, safe zone ratios, seeded placement, subtitle timing, audio slot checks. It is plain TypeScript with no React, tested with the Node built in test runner, zero test dependencies. `src/components/` and `src/scenes/` hold the rendering, and they stay thin by calling into `src/lib/`. Every random looking value comes from one seeded generator in `src/lib/seeded.ts`, and every colour comes from `src/data/theme.ts`.

**Tech Stack:** Remotion 4.0.537, React 19, TypeScript 5 strict, Node 22 built in test runner (`node --test`), edge-tts through the Python CLI for voiceover.

## Global Constraints

These apply to every task. Each line is a rule from `AGENTS.md` that a task could break by accident.

- Composition id `CosmicIntro`, 1080 by 1920, 30 fps, exactly 900 frames.
- TypeScript strict mode. `npm run typecheck` must pass before any task is closed.
- Only runtime dependency beyond Remotion and React: `@remotion/media-utils`. `@remotion/media` and `@remotion/cli` are official Remotion packages and count as toolchain. No other package may be added without approval.
- No `Math.random()`, no `Date.now()`, no `setTimeout`, no `setInterval`, no CSS keyframes, no CSS transitions.
- Every colour literal lives in `src/data/theme.ts`. A test enforces this.
- All layout values derive from `useVideoConfig()` or from ratios in `src/lib/safeZone.ts`. No hardcoded 1080 or 1920 inside a scene component.
- All animation is frame driven through `useCurrentFrame()`, `interpolate()`, and `spring()` with clamped extrapolation.
- No external image, font, or audio asset is downloaded. Fonts are a system stack.
- Cross-fades are 15 to 20 frames. The composition ends at frame 900.
- Narration slot boundaries stay at 0, 120, 300, 510, 720, 900.
- Every new function in `src/lib/` has a test that was watched failing first.
- Node loads `src/lib/` and `src/scripts/` directly, so every relative import inside those folders carries the explicit `.ts` extension. Webpack only loads `src/components/` and `src/scenes/`, and it resolves the same extension fine.
- Commit after every task. `AGENTS.md`, `.env`, `node_modules/`, and `out/` are never committed.

---

## File structure

```
remotion-konten/
├── AGENTS.md                     # the brief, verbatim (done)
├── DESIGN.md                     # direction, dials, per scene intent (done)
├── package.json                  # type: module, pinned remotion 4.0.537
├── tsconfig.json                 # strict
├── remotion.config.ts
├── .env.example
├── .gitignore
├── docs/superpowers/plans/2026-10-22-cosmic-intro-reel.md
├── public/
│   ├── voiceover/                # generated, gitignored
│   └── audio/                    # optional ambient.mp3, gitignored
├── out/                          # render output, gitignored
└── src/
    ├── index.ts                  # registerRoot
    ├── Root.tsx                  # the composition and its props
    ├── types.ts                  # Palette, CosmicIntroProps
    ├── data/
    │   ├── theme.ts              # the 7 tokens, the only hex in the repo
    │   └── narration.ts          # the 5 narration entries
    ├── lib/                      # pure logic, all unit tested
    │   ├── timeline.ts           # scene spans and crossfades
    │   ├── safeZone.ts           # safe zone and text metrics as ratios
    │   ├── seeded.ts             # the one deterministic generator
    │   ├── subtitle.ts           # subtitle visibility window
    │   ├── audioSlots.ts         # overlong detection
    │   ├── audioFiles.ts         # missing file detection
    │   └── *.test.ts             # one test file per module
    ├── components/               # visual primitives
    │   ├── Stars.tsx  Nebula.tsx  Planet.tsx  Warp.tsx
    │   ├── Title.tsx  Subtitle.tsx  Vignette.tsx  FilmGrain.tsx
    │   ├── Particles.tsx  ShootingStar.tsx  SafeZoneGuide.tsx
    │   └── AudioTrack.tsx
    ├── scenes/
    │   ├── Void.tsx  Nebula.tsx  Planet.tsx  Warp.tsx  Resolve.tsx
    └── scripts/
        ├── generate-voiceover.ts
        └── validate-audio.ts
```

---

### Task 1: Toolchain and empty composition

**Files:**
- Create: `package.json`, `tsconfig.json`, `remotion.config.ts`, `.gitignore`, `.env.example`
- Create: `src/index.ts`, `src/Root.tsx`, `src/types.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `src/types.ts` exporting `Palette` and `CosmicIntroProps`, used by every later task.

- [ ] **Step 1: init git and write the ignore file**

```bash
git init
```

`.gitignore`:

```
node_modules/
out/
.env
public/voiceover/
public/audio/
*.log
```

- [ ] **Step 2: `package.json`**

```json
{
  "name": "remotion-konten",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "remotion studio src/index.ts",
    "render": "npm run validate:audio && remotion render src/index.ts CosmicIntro out/cosmic-reels.mp4 --codec=h264 --crf=18",
    "typecheck": "tsc --noEmit",
    "test": "node --experimental-strip-types --test \"src/lib/*.test.ts\"",
    "voiceover": "node --experimental-strip-types src/scripts/generate-voiceover.ts",
    "validate:audio": "node --experimental-strip-types src/scripts/validate-audio.ts"
  },
  "dependencies": {
    "@remotion/cli": "4.0.537",
    "@remotion/media": "4.0.537",
    "@remotion/media-utils": "4.0.537",
    "react": "19.3.1",
    "react-dom": "19.3.1",
    "remotion": "4.0.537"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.9.0"
  }
}
```

`"type": "module"` is required so the Node scripts in `src/scripts/` run as ESM under `node --experimental-strip-types`. If the Remotion CLI refuses the ESM project, the fallback is to drop `"type"` and add `--experimental-default-type=module` to the three script commands, which changes nothing else.

- [ ] **Step 3: `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true
  },
  "include": ["src"]
}
```

- [ ] **Step 4: `remotion.config.ts` and `src/index.ts`**

```ts
// remotion.config.ts
import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
```

```ts
// src/index.ts
import {registerRoot} from 'remotion';
import {RemotionRoot} from './Root.tsx';

registerRoot(RemotionRoot);
```

- [ ] **Step 5: `src/types.ts`**

```ts
export type Palette = {
  cosmicIndigo: string;
  nebulaPurple: string;
  stellarMagenta: string;
  solarCoral: string;
  deepViolet: string;
  lavender: string;
  starlight: string;
};

export type NarrationEntry = {
  id: string;
  text: string;
  startFrame: number;
  endFrame: number;
  audioFile: string;
};

export type CosmicIntroProps = {
  title: string;
  narration?: NarrationEntry[];
  palette: Palette;
  seed: number;
  showSubtitle: boolean;
  showSafeZoneGuide: boolean;
  voice: string;
  voiceVolume: number;
  ambientVolume: number;
  showRing: boolean;
};
```

- [ ] **Step 6: `src/Root.tsx` with the real composition metadata**

```tsx
import React from 'react';
import {AbsoluteFill, Composition} from 'remotion';
import {cosmicTheme} from './data/theme';
import type {CosmicIntroProps} from './types';

const CosmicIntro: React.FC<CosmicIntroProps> = () => {
  return <AbsoluteFill style={{backgroundColor: cosmicTheme.cosmicIndigo}} />;
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="CosmicIntro"
      component={CosmicIntro}
      durationInFrames={900}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        title: 'BEYOND\nTHE\nSKY',
        narration: undefined,
        palette: cosmicTheme,
        seed: 20261022,
        showSubtitle: true,
        showSafeZoneGuide: false,
        voice: 'en-US-AndrewNeural',
        voiceVolume: 1,
        ambientVolume: 0.18,
        showRing: true,
      }}
    />
  );
};
```

- [ ] **Step 7: `.env.example`**

```
# TTS provider: edge or openai
TTS_PROVIDER=edge
TTS_VOICE=en-US-AndrewNeural
TTS_RATE=-10%
# only read when TTS_PROVIDER=openai
OPENAI_API_KEY=
OPENAI_TTS_MODEL=gpt-4o-mini-tts
OPENAI_TTS_VOICE=alloy
```

- [ ] **Step 8: install, typecheck, list compositions**

```bash
npm install
npm run typecheck
npx remotion compositions src/index.ts
```

Expected: install finishes with no error, typecheck reports no error, and the compositions list shows `CosmicIntro` with 1080x1920, 30 fps, 900 frames.

- [ ] **Step 9: commit**

```bash
git add package.json tsconfig.json remotion.config.ts .gitignore .env.example src/index.ts src/Root.tsx src/types.ts AGENTS.md DESIGN.md
git commit -m "chore: scaffold remotion project with CosmicIntro composition"
```

---

### Task 2: Design tokens and the source guards

**Files:**
- Create: `src/data/theme.ts`
- Create: `src/lib/theme.test.ts`
- Create: `src/lib/guards.test.ts`

**Interfaces:**
- Consumes: `Palette` from `src/types.ts`.
- Produces: `cosmicTheme: Palette`, `withAlpha(hex: string, alpha: number): string`, `PALETTE_KEYS: (keyof Palette)[]`.

- [ ] **Step 1: write the failing theme test**

`src/lib/theme.test.ts`:

```ts
import assert from 'node:assert/strict';
import {test} from 'node:test';
import {cosmicTheme, PALETTE_KEYS, withAlpha} from '../data/theme.ts';

test('palette holds exactly the seven brand tokens', () => {
  assert.deepEqual(PALETTE_KEYS, [
    'cosmicIndigo',
    'nebulaPurple',
    'stellarMagenta',
    'solarCoral',
    'deepViolet',
    'lavender',
    'starlight',
  ]);
});

test('palette values match the brand hexes', () => {
  assert.equal(cosmicTheme.cosmicIndigo, '#443199');
  assert.equal(cosmicTheme.nebulaPurple, '#792CA2');
  assert.equal(cosmicTheme.stellarMagenta, '#C13383');
  assert.equal(cosmicTheme.solarCoral, '#E05454');
  assert.equal(cosmicTheme.deepViolet, '#29204F');
  assert.equal(cosmicTheme.lavender, '#B8B2FF');
  assert.equal(cosmicTheme.starlight, '#FFF2EC');
});

test('withAlpha converts a hex to rgba', () => {
  assert.equal(withAlpha('#443199', 0.5), 'rgba(68, 49, 153, 0.5)');
});
```

- [ ] **Step 2: run the test and watch it fail**

```bash
npm test
```

Expected: FAIL with a module not found error for `../data/theme`.

- [ ] **Step 3: write `src/data/theme.ts`**

```ts
import type {Palette} from '../types.ts';

export const PALETTE_KEYS: (keyof Palette)[] = [
  'cosmicIndigo',
  'nebulaPurple',
  'stellarMagenta',
  'solarCoral',
  'deepViolet',
  'lavender',
  'starlight',
];

export const cosmicTheme: Palette = {
  cosmicIndigo: '#443199',
  nebulaPurple: '#792CA2',
  stellarMagenta: '#C13383',
  solarCoral: '#E05454',
  deepViolet: '#29204F',
  lavender: '#B8B2FF',
  starlight: '#FFF2EC',
};

export const withAlpha = (hex: string, alpha: number): string => {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
```

- [ ] **Step 4: run the test and watch it pass**

```bash
npm test
```

Expected: PASS, 3 tests.

- [ ] **Step 5: write the guard test**

`src/lib/guards.test.ts`:

```ts
import assert from 'node:assert/strict';
import {readFileSync, readdirSync, statSync} from 'node:fs';
import {join} from 'node:path';
import {test} from 'node:test';

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

const sources = (): {file: string; text: string}[] =>
  walk('src')
    .filter((file) => file.endsWith('.ts') || file.endsWith('.tsx'))
    .map((file) => ({file, text: readFileSync(file, 'utf8')}));

test('no source file uses Math.random or Date.now', () => {
  const offenders = sources()
    .filter(({text}) => /Math\.random|Date\.now/.test(text))
    .map(({file}) => file);
  assert.deepEqual(offenders, []);
});

test('hex colour literals exist only in src/data/theme.ts', () => {
  const offenders = sources()
    .filter(({file}) => !file.endsWith('data/theme.ts'))
    .filter(({text}) => /#[0-9a-fA-F]{3,8}\b/.test(text))
    .map(({file}) => file);
  assert.deepEqual(offenders, []);
});
```

- [ ] **Step 6: run the guard test and watch the hex rule bite**

Run `npm test`, then add a temporary `const oops = '#123456';` to `src/types.ts` and run `npm test` again.

Expected: the second run FAILS and names `src/types.ts`. Remove the temporary line and run `npm test` again.

Expected: PASS. A guard that has never failed is not a guard.

- [ ] **Step 7: commit**

```bash
git add src/data/theme.ts src/lib/theme.test.ts src/lib/guards.test.ts
git commit -m "feat: add brand palette tokens and source guards"
```

---

### Task 3: Timeline math

**Files:**
- Create: `src/lib/timeline.ts`, `src/lib/timeline.test.ts`

**Interfaces:**
- Produces: `SCENE_BOUNDARIES: readonly number[]`, `CROSSFADE_FRAMES: number`, `TOTAL_FRAMES: number`, `SceneId`, `SceneSpan`, `buildSceneSpans(): SceneSpan[]`, `overlapFrames(a: SceneSpan, b: SceneSpan): number`.

- [ ] **Step 1: write the failing test**

```ts
import assert from 'node:assert/strict';
import {test} from 'node:test';
import {
  buildSceneSpans,
  CROSSFADE_FRAMES,
  overlapFrames,
  SCENE_BOUNDARIES,
  TOTAL_FRAMES,
} from './timeline.ts';

test('the composition is 900 frames long', () => {
  assert.equal(TOTAL_FRAMES, 900);
});

test('narration boundaries match the brief', () => {
  assert.deepEqual([...SCENE_BOUNDARIES], [0, 120, 300, 510, 720, 900]);
});

test('scenes cover the whole composition without a gap', () => {
  const spans = buildSceneSpans();
  assert.equal(spans[0].from, 0);
  const last = spans[spans.length - 1];
  assert.equal(last.from + last.durationInFrames, TOTAL_FRAMES);
  for (let i = 1; i < spans.length; i++) {
    const previousEnd = spans[i - 1].from + spans[i - 1].durationInFrames;
    assert.ok(previousEnd >= spans[i].from, `gap before scene ${spans[i].id}`);
  }
});

test('consecutive scenes crossfade by 18 frames', () => {
  const spans = buildSceneSpans();
  for (let i = 1; i < spans.length; i++) {
    assert.equal(overlapFrames(spans[i - 1], spans[i]), CROSSFADE_FRAMES);
  }
});

test('the crossfade stays inside the 15 to 20 frame window', () => {
  assert.ok(CROSSFADE_FRAMES >= 15 && CROSSFADE_FRAMES <= 20);
});

test('every scene keeps more than 100 frames of screen time', () => {
  const spans = buildSceneSpans();
  assert.ok(spans.every((span) => span.durationInFrames > 100));
});
```

- [ ] **Step 2: run it and watch it fail**

```bash
npm test
```

Expected: FAIL, module `./timeline` not found.

- [ ] **Step 3: write `src/lib/timeline.ts`**

```ts
export const TOTAL_FRAMES = 900;
export const CROSSFADE_FRAMES = 18;

export type SceneId = 'void' | 'nebula' | 'planet' | 'warp' | 'resolve';

export type SceneSpan = {
  id: SceneId;
  from: number;
  durationInFrames: number;
};

export const SCENE_BOUNDARIES: readonly number[] = [0, 120, 300, 510, 720, 900];

const SCENE_IDS: SceneId[] = ['void', 'nebula', 'planet', 'warp', 'resolve'];

export const buildSceneSpans = (
  boundaries: readonly number[] = SCENE_BOUNDARIES,
  crossfade: number = CROSSFADE_FRAMES,
  total: number = TOTAL_FRAMES,
): SceneSpan[] => {
  const half = Math.floor(crossfade / 2);
  return boundaries.slice(0, -1).map((boundary, index) => {
    const from = Math.max(0, boundary - half);
    const isLast = index === boundaries.length - 2;
    const end = isLast ? total : boundaries[index + 1] + half;
    return {id: SCENE_IDS[index], from, durationInFrames: end - from};
  });
};

export const overlapFrames = (a: SceneSpan, b: SceneSpan): number => {
  const aEnd = a.from + a.durationInFrames;
  return Math.max(0, aEnd - b.from);
};
```

- [ ] **Step 4: run it and watch it pass**

```bash
npm test
```

Expected: PASS, all timeline tests green.

- [ ] **Step 5: commit**

```bash
git add src/lib/timeline.ts src/lib/timeline.test.ts
git commit -m "feat: add crossfade timeline math"
```

---

### Task 4: Safe zone and text metrics

**Files:**
- Create: `src/lib/safeZone.ts`, `src/lib/safeZone.test.ts`

**Interfaces:**
- Produces: `safeZone(width, height): SafeZone`, `subtitleBottomClearance(height): number`, `subtitleMaxWidth(width): number`, `subtitleFontSize(width): number`, `titleFontSize(width): number`, `focusBand(height): {top: number; bottom: number}`.

- [ ] **Step 1: write the failing test**

```ts
import assert from 'node:assert/strict';
import {test} from 'node:test';
import {
  focusBand,
  safeZone,
  subtitleBottomClearance,
  subtitleFontSize,
  subtitleMaxWidth,
  titleFontSize,
} from './safeZone.ts';

test('safe zone matches the reference canvas', () => {
  const zone = safeZone(1080, 1920);
  assert.equal(zone.top, 220);
  assert.equal(zone.bottom, 380);
  assert.equal(zone.left, 60);
  assert.equal(zone.right, 120);
});

test('safe zone scales with the output size', () => {
  const zone = safeZone(540, 960);
  assert.equal(zone.top, 110);
  assert.equal(zone.left, 30);
});

test('subtitle keeps 400 px of clearance at the reference size', () => {
  assert.equal(subtitleBottomClearance(1920), 400);
  assert.ok(subtitleBottomClearance(960) >= 200);
});

test('subtitle width and font size follow the reference ratio', () => {
  assert.equal(subtitleMaxWidth(1080), 840);
  assert.equal(subtitleFontSize(1080), 50);
  assert.equal(titleFontSize(1080), 108);
});

test('focus band sits between 35 and 55 percent of the height', () => {
  const band = focusBand(1920);
  assert.equal(band.top, 1920 * 0.35);
  assert.equal(band.bottom, 1920 * 0.55);
});
```

- [ ] **Step 2: run it and watch it fail**

```bash
npm test
```

Expected: FAIL, module `./safeZone` not found.

- [ ] **Step 3: write `src/lib/safeZone.ts`**

```ts
const REFERENCE_WIDTH = 1080;
const REFERENCE_HEIGHT = 1920;

export type SafeZone = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export const safeZone = (width: number, height: number): SafeZone => ({
  top: (220 / REFERENCE_HEIGHT) * height,
  bottom: (380 / REFERENCE_HEIGHT) * height,
  left: (60 / REFERENCE_WIDTH) * width,
  right: (120 / REFERENCE_WIDTH) * width,
});

export const subtitleBottomClearance = (height: number): number =>
  (400 / REFERENCE_HEIGHT) * height;

export const subtitleMaxWidth = (width: number): number =>
  (840 / REFERENCE_WIDTH) * width;

export const subtitleFontSize = (width: number): number => (50 / REFERENCE_WIDTH) * width;

export const titleFontSize = (width: number): number => (108 / REFERENCE_WIDTH) * width;

export const focusBand = (height: number): {top: number; bottom: number} => ({
  top: height * 0.35,
  bottom: height * 0.55,
});
```

- [ ] **Step 4: run it and watch it pass**

```bash
npm test
```

Expected: PASS.

- [ ] **Step 5: commit**

```bash
git add src/lib/safeZone.ts src/lib/safeZone.test.ts
git commit -m "feat: add safe zone and text metrics as ratios"
```

---

### Task 5: The one seeded generator

**Files:**
- Create: `src/lib/seeded.ts`, `src/lib/seeded.test.ts`

**Interfaces:**
- Produces: `createRandom(seed: number): () => number`, `starLayerPoints(seed, layer, count): StarPoint[]`, `nebulaBlobs(seed, count): Blob[]`, `warpStreaks(seed, count): Streak[]`, `planetBands(seed, count): Band[]`. All positions are normalised to 0..1 so components can scale to any canvas.

- [ ] **Step 1: write the failing test**

```ts
import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createRandom, nebulaBlobs, planetBands, starLayerPoints, warpStreaks} from './seeded.ts';

test('the same seed produces the same sequence', () => {
  const a = createRandom(42);
  const b = createRandom(42);
  for (let i = 0; i < 50; i++) {
    assert.equal(a(), b());
  }
});

test('different seeds produce different sequences', () => {
  const a = createRandom(1);
  const b = createRandom(2);
  assert.notEqual(a(), b());
});

test('generated values stay inside 0 to 1', () => {
  const next = createRandom(7);
  for (let i = 0; i < 500; i++) {
    const value = next();
    assert.ok(value >= 0 && value < 1, `value out of range: ${value}`);
  }
});

test('star layers are deterministic and normalised', () => {
  const first = starLayerPoints(99, 1, 30);
  const second = starLayerPoints(99, 1, 30);
  assert.deepEqual(first, second);
  assert.equal(first.length, 30);
  for (const star of first) {
    assert.ok(star.x >= 0 && star.x <= 1);
    assert.ok(star.y >= 0 && star.y <= 1);
    assert.ok(star.size > 0);
    assert.ok(star.alpha > 0 && star.alpha <= 1);
  }
});

test('each parallax layer has its own size range', () => {
  const far = starLayerPoints(5, 0, 40);
  const near = starLayerPoints(5, 2, 40);
  const farMax = Math.max(...far.map((s) => s.size));
  const nearMax = Math.max(...near.map((s) => s.size));
  assert.ok(nearMax > farMax);
});

test('nebula blobs, warp streaks and planet bands are deterministic', () => {
  assert.deepEqual(nebulaBlobs(3, 5), nebulaBlobs(3, 5));
  assert.deepEqual(warpStreaks(3, 5), warpStreaks(3, 5));
  assert.deepEqual(planetBands(3, 5), planetBands(3, 5));
});

test('warp streaks point away from the centre', () => {
  for (const streak of warpStreaks(11, 40)) {
    assert.ok(streak.angle >= 0 && streak.angle < Math.PI * 2);
    assert.ok(streak.outer > streak.inner);
  }
});
```

- [ ] **Step 2: run it and watch it fail**

```bash
npm test
```

Expected: FAIL, module `./seeded` not found.

- [ ] **Step 3: write `src/lib/seeded.ts`**

```ts
export const createRandom = (seed: number): (() => number) => {
  let state = Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b) >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export type StarPoint = {
  x: number;
  y: number;
  size: number;
  alpha: number;
  phase: number;
};

export type Blob = {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  tone: 'purple' | 'magenta' | 'coral';
};

export type Streak = {
  angle: number;
  inner: number;
  outer: number;
  width: number;
  alpha: number;
  tone: 'starlight' | 'magenta' | 'coral';
};

export type Band = {
  y: number;
  thickness: number;
  opacity: number;
  tone: 'purple' | 'lavender' | 'magenta';
};

const LAYER_SIZE: Record<number, [number, number]> = {
  0: [0.4, 1.1],
  1: [0.8, 2.0],
  2: [1.6, 3.4],
};

const LAYER_ALPHA: Record<number, [number, number]> = {
  0: [0.25, 0.55],
  1: [0.4, 0.75],
  2: [0.55, 0.95],
};

export const starLayerPoints = (seed: number, layer: number, count: number): StarPoint[] => {
  const next = createRandom(seed + layer * 7919);
  const [minSize, maxSize] = LAYER_SIZE[layer] ?? LAYER_SIZE[1];
  const [minAlpha, maxAlpha] = LAYER_ALPHA[layer] ?? LAYER_ALPHA[1];
  return Array.from({length: count}, () => ({
    x: next(),
    y: next(),
    size: minSize + next() * (maxSize - minSize),
    alpha: minAlpha + next() * (maxAlpha - minAlpha),
    phase: next() * Math.PI * 2,
  }));
};

export const nebulaBlobs = (seed: number, count: number): Blob[] => {
  const next = createRandom(seed + 104729);
  const tones: Blob['tone'][] = ['purple', 'purple', 'magenta', 'coral'];
  return Array.from({length: count}, (_, index) => ({
    x: 0.1 + next() * 0.8,
    y: 0.05 + next() * 0.9,
    radius: 0.18 + next() * 0.34,
    opacity: 0.35 + next() * 0.4,
    tone: index === count - 1 ? 'coral' : tones[Math.floor(next() * tones.length)],
  }));
};

export const warpStreaks = (seed: number, count: number): Streak[] => {
  const next = createRandom(seed + 15485863);
  const tones: Streak['tone'][] = ['starlight', 'starlight', 'starlight', 'magenta', 'coral'];
  return Array.from({length: count}, () => ({
    angle: next() * Math.PI * 2,
    inner: 0.08 + next() * 0.18,
    outer: 0.34 + next() * 0.66,
    width: 0.6 + next() * 2.2,
    alpha: 0.2 + next() * 0.7,
    tone: tones[Math.floor(next() * tones.length)],
  }));
};

export const planetBands = (seed: number, count: number): Band[] => {
  const next = createRandom(seed + 32452843);
  const tones: Band['tone'][] = ['purple', 'lavender', 'magenta'];
  return Array.from({length: count}, () => ({
    y: 0.18 + next() * 0.64,
    thickness: 0.02 + next() * 0.07,
    opacity: 0.12 + next() * 0.3,
    tone: tones[Math.floor(next() * tones.length)],
  }));
};
```

- [ ] **Step 4: run it and watch it pass**

```bash
npm test
```

Expected: PASS.

- [ ] **Step 5: commit**

```bash
git add src/lib/seeded.ts src/lib/seeded.test.ts
git commit -m "feat: add seeded procedural placement"
```

---

### Task 6: Narration data and subtitle timing

**Files:**
- Create: `src/data/narration.ts`, `src/lib/subtitle.ts`, `src/lib/subtitle.test.ts`

**Interfaces:**
- Produces: `narration: NarrationEntry[]`, `subtitleStateAt(frame, entries): SubtitleState | null`, `SUBTITLE_DELAY_FRAMES`, `SUBTITLE_FADE_IN_FRAMES`, `SUBTITLE_FADE_OUT_FRAMES`, `SUBTITLE_RISE_PX`. The `NarrationEntry` type lives in `src/types.ts` and is re-exported from the data file so both the component and the script import one definition.

- [ ] **Step 1: write the failing test**

```ts
import assert from 'node:assert/strict';
import {test} from 'node:test';
import {narration} from '../data/narration.ts';
import {
  SUBTITLE_DELAY_FRAMES,
  SUBTITLE_FADE_IN_FRAMES,
  SUBTITLE_FADE_OUT_FRAMES,
  SUBTITLE_RISE_PX,
  subtitleStateAt,
} from './subtitle.ts';

test('narration covers the five slots of the brief', () => {
  assert.equal(narration.length, 5);
  assert.deepEqual(
    narration.map((entry) => [entry.id, entry.startFrame, entry.endFrame]),
    [
      ['void', 0, 120],
      ['nebula', 120, 300],
      ['planet', 300, 510],
      ['warp', 510, 720],
      ['resolve', 720, 900],
    ],
  );
});

test('no subtitle is visible before the first slot opens', () => {
  assert.equal(subtitleStateAt(0, narration), null);
});

test('the subtitle appears six frames after the voiceover starts', () => {
  assert.equal(subtitleStateAt(SUBTITLE_DELAY_FRAMES - 1, narration), null);
  const state = subtitleStateAt(SUBTITLE_DELAY_FRAMES, narration);
  assert.ok(state);
  assert.equal(state?.id, 'void');
});

test('the subtitle fades in over ten frames and rises 12 px', () => {
  const start = SUBTITLE_DELAY_FRAMES;
  const mid = start + SUBTITLE_FADE_IN_FRAMES;
  const early = subtitleStateAt(start, narration);
  const settled = subtitleStateAt(mid, narration);
  assert.equal(early?.opacity, 0);
  assert.equal(settled?.opacity, 1);
  assert.equal(early?.offsetY, SUBTITLE_RISE_PX);
  assert.equal(settled?.offsetY, 0);
});

test('the subtitle fades out over the last ten frames of its slot', () => {
  const entry = narration[0];
  const fading = subtitleStateAt(entry.endFrame - SUBTITLE_FADE_OUT_FRAMES, narration);
  const gone = subtitleStateAt(entry.endFrame, narration);
  assert.ok((fading?.opacity ?? 0) < 1);
  assert.ok((fading?.opacity ?? 0) > 0);
  assert.equal(gone, null);
});

test('the subtitle text comes from the narration data', () => {
  const state = subtitleStateAt(20, narration);
  assert.equal(state?.text, narration[0].text);
});
```

- [ ] **Step 2: run it and watch it fail**

```bash
npm test
```

Expected: FAIL, module `../data/narration` not found.

- [ ] **Step 3: write `src/data/narration.ts`**

```ts
import type {NarrationEntry} from '../types.ts';

export type {NarrationEntry};

export const narration: NarrationEntry[] = [
  {
    id: 'void',
    text: 'In the beginning, there was only silence.',
    startFrame: 0,
    endFrame: 120,
    audioFile: 'scene-1.mp3',
  },
  {
    id: 'nebula',
    text: 'From drifting clouds of dust and light, stars begin to form.',
    startFrame: 120,
    endFrame: 300,
    audioFile: 'scene-2.mp3',
  },
  {
    id: 'planet',
    text: 'Around them, worlds take shape, each one quietly turning in the dark.',
    startFrame: 300,
    endFrame: 510,
    audioFile: 'scene-3.mp3',
  },
  {
    id: 'warp',
    text: 'And we reach further, crossing distances too vast to measure.',
    startFrame: 510,
    endFrame: 720,
    audioFile: 'scene-4.mp3',
  },
  {
    id: 'resolve',
    text: 'Beyond the sky, the story is only beginning.',
    startFrame: 720,
    endFrame: 900,
    audioFile: 'scene-5.mp3',
  },
];
```

- [ ] **Step 4: write `src/lib/subtitle.ts`**

```ts
import type {NarrationEntry} from '../data/narration.ts';

export const SUBTITLE_DELAY_FRAMES = 6;
export const SUBTITLE_FADE_IN_FRAMES = 10;
export const SUBTITLE_FADE_OUT_FRAMES = 10;
export const SUBTITLE_RISE_PX = 12;

export type SubtitleState = {
  id: string;
  text: string;
  opacity: number;
  offsetY: number;
};

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const ramp = (frame: number, from: number, to: number): number =>
  clamp01((frame - from) / (to - from));

export const subtitleStateAt = (
  frame: number,
  entries: NarrationEntry[],
): SubtitleState | null => {
  for (const entry of entries) {
    const start = entry.startFrame + SUBTITLE_DELAY_FRAMES;
    const fadeInEnd = start + SUBTITLE_FADE_IN_FRAMES;
    const fadeOutStart = entry.endFrame - SUBTITLE_FADE_OUT_FRAMES;
    if (frame < start || frame > entry.endFrame) {
      continue;
    }
    const fadeIn = ramp(frame, start, fadeInEnd);
    const fadeOut = 1 - ramp(frame, fadeOutStart, entry.endFrame);
    return {
      id: entry.id,
      text: entry.text,
      opacity: clamp01(fadeIn * fadeOut),
      offsetY: SUBTITLE_RISE_PX * (1 - fadeIn),
    };
  }
  return null;
};
```

- [ ] **Step 5: run it and watch it pass**

```bash
npm test
```

Expected: PASS.

- [ ] **Step 6: commit**

```bash
git add src/data/narration.ts src/lib/subtitle.ts src/lib/subtitle.test.ts
git commit -m "feat: add narration data and subtitle timing"
```

---

### Task 7: Audio slot and missing file checks

**Files:**
- Create: `src/lib/audioSlots.ts`, `src/lib/audioSlots.test.ts`, `src/lib/audioFiles.ts`, `src/lib/audioFiles.test.ts`

**Interfaces:**
- Produces: `checkAudioSlot(entry, measuredSeconds, fps): SlotCheck`, `findMissingAudio(entries, exists, resolve): MissingAudio[]`.

- [ ] **Step 1: write the failing slot test**

```ts
import assert from 'node:assert/strict';
import {test} from 'node:test';
import {narration} from '../data/narration.ts';
import {checkAudioSlot} from './audioSlots.ts';

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
```

- [ ] **Step 2: run it and watch it fail**

```bash
npm test
```

Expected: FAIL, module `./audioSlots` not found.

- [ ] **Step 3: write `src/lib/audioSlots.ts`**

```ts
import type {NarrationEntry} from '../data/narration.ts';

export type SlotCheck = {
  id: string;
  allowedSeconds: number;
  measuredSeconds: number;
  overlong: boolean;
  message: string;
};

export const checkAudioSlot = (
  entry: NarrationEntry,
  measuredSeconds: number,
  fps: number,
): SlotCheck => {
  const allowedSeconds = (entry.endFrame - entry.startFrame) / fps;
  const overlong = measuredSeconds > allowedSeconds;
  const message = overlong
    ? `Voiceover "${entry.id}" runs ${measuredSeconds.toFixed(2)}s but its slot allows ${allowedSeconds.toFixed(2)}s. Shorten the line or move the slot in src/data/narration.ts.`
    : `Voiceover "${entry.id}" fits its slot: ${measuredSeconds.toFixed(2)}s of ${allowedSeconds.toFixed(2)}s.`;
  return {id: entry.id, allowedSeconds, measuredSeconds, overlong, message};
};
```

- [ ] **Step 4: write the failing missing file test**

```ts
import assert from 'node:assert/strict';
import {test} from 'node:test';
import {narration} from '../data/narration.ts';
import {findMissingAudio} from './audioFiles.ts';

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
```

- [ ] **Step 5: run it and watch it fail**

```bash
npm test
```

Expected: FAIL, module `./audioFiles` not found.

- [ ] **Step 6: write `src/lib/audioFiles.ts`**

```ts
import type {NarrationEntry} from '../data/narration.ts';

export type MissingAudio = {
  id: string;
  file: string;
  path: string;
};

export const findMissingAudio = (
  entries: NarrationEntry[],
  exists: (path: string) => boolean,
  resolve: (file: string) => string,
): MissingAudio[] =>
  entries
    .filter((entry) => !exists(resolve(entry.audioFile)))
    .map((entry) => ({id: entry.id, file: entry.audioFile, path: resolve(entry.audioFile)}));
```

- [ ] **Step 7: run it and watch it pass**

```bash
npm test
```

Expected: PASS.

- [ ] **Step 8: commit**

```bash
git add src/lib/audioSlots.ts src/lib/audioSlots.test.ts src/lib/audioFiles.ts src/lib/audioFiles.test.ts
git commit -m "feat: add audio slot and missing file checks"
```

---

### Task 8: Shared atmosphere components

**Files:**
- Create: `src/components/Stars.tsx`, `src/components/Particles.tsx`, `src/components/ShootingStar.tsx`, `src/components/Vignette.tsx`, `src/components/FilmGrain.tsx`

**Interfaces:**
- `Stars`: `{seed: number; count: number; layer: 0 | 1 | 2; color: string; opacity: number; parallax: number}`
- `Particles`: `{seed: number; count: number; color: string; drift: number}`
- `ShootingStar`: `{startFrame: number; color: string; length: number}`
- `Vignette`: `{color: string; strength: number; openRatio: number}` where `openRatio` is the transparent radius in percent
- `FilmGrain`: `{opacity: number; seed: number}`

Rules for all five: positions come from `src/lib/seeded.ts`, sizes scale with `useVideoConfig().width`, motion comes from `useCurrentFrame()`, and `interpolate` is always clamped.

- [ ] **Step 1: write `src/components/Stars.tsx`**

```tsx
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {starLayerPoints} from '../lib/seeded';

export type StarsProps = {
  seed: number;
  count: number;
  layer: 0 | 1 | 2;
  color: string;
  opacity: number;
  parallax: number;
};

const LAYER_SPEED = [0.35, 0.7, 1.1];

export const Stars: React.FC<StarsProps> = ({seed, count, layer, color, opacity, parallax}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const points = React.useMemo(() => starLayerPoints(seed, layer, count), [seed, layer, count]);
  const speed = (LAYER_SPEED[layer] ?? 0.7) * parallax;
  const drift = frame * speed;
  const scale = width / 1080;

  return (
    <AbsoluteFill style={{opacity}}>
      {points.map((star, index) => {
        const twinkle = 0.78 + 0.22 * Math.sin(frame * 0.035 + star.phase);
        const x = ((star.x * width + drift) % (width + 40)) - 20;
        const y = (star.y * height + drift * 0.25) % height;
        const diameter = star.size * scale;
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: diameter,
              height: diameter,
              borderRadius: '50%',
              backgroundColor: color,
              opacity: star.alpha * twinkle,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: write `src/components/Particles.tsx`**

```tsx
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {createRandom} from '../lib/seeded';

export type ParticlesProps = {
  seed: number;
  count: number;
  color: string;
  drift: number;
};

export const Particles: React.FC<ParticlesProps> = ({seed, count, color, drift}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const scale = width / 1080;
  const motes = React.useMemo(() => {
    const next = createRandom(seed + 999);
    return Array.from({length: count}, () => ({
      x: next(),
      y: next(),
      size: 1.2 + next() * 2.8,
      speed: drift * (0.4 + next() * 0.6),
      alpha: 0.12 + next() * 0.34,
    }));
  }, [seed, count, drift]);

  return (
    <AbsoluteFill>
      {motes.map((mote, index) => {
        const travelled = mote.y * height - frame * mote.speed;
        const y = ((travelled % height) + height) % height;
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: mote.x * width,
              top: y,
              width: mote.size * scale,
              height: mote.size * scale,
              borderRadius: '50%',
              backgroundColor: color,
              opacity: mote.alpha,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
```

- [ ] **Step 3: write `src/components/ShootingStar.tsx`**

```tsx
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';

export type ShootingStarProps = {
  startFrame: number;
  color: string;
  length: number;
};

const TRAVEL_FRAMES = 22;

export const ShootingStar: React.FC<ShootingStarProps> = ({startFrame, color, length}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const local = frame - startFrame;
  if (local < 0 || local > TRAVEL_FRAMES) {
    return null;
  }
  const progress = local / TRAVEL_FRAMES;
  const fromX = width * 0.82;
  const fromY = height * 0.14;
  const toX = width * 0.26;
  const toY = height * 0.38;
  const headX = fromX + (toX - fromX) * progress;
  const headY = fromY + (toY - fromY) * progress;
  const angle = Math.atan2(toY - fromY, toX - fromX);
  const opacity =
    local < 4 ? local / 4 : Math.max(0, 1 - (local - (TRAVEL_FRAMES - 8)) / 8);

  return (
    <div
      style={{
        position: 'absolute',
        left: headX,
        top: headY,
        width: length,
        height: 2,
        background: `linear-gradient(to right, transparent, ${color})`,
        transform: `rotate(${angle}rad) translateX(-${length}px)`,
        transformOrigin: 'left center',
        opacity,
      }}
    />
  );
};
```

- [ ] **Step 4: write `src/components/Vignette.tsx`**

```tsx
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {withAlpha} from '../data/theme';

export type VignetteProps = {
  color: string;
  strength: number;
  openRatio: number;
};

export const Vignette: React.FC<VignetteProps> = ({color, strength, openRatio}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse ${openRatio}% at 50% 45%, ${withAlpha(color, 0)} 28%, ${withAlpha(color, strength)} 100%)`,
      pointerEvents: 'none',
    }}
  />
);
```

- [ ] **Step 5: write `src/components/FilmGrain.tsx`**

```tsx
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

export type FilmGrainProps = {
  opacity: number;
  seed: number;
};

const GRAIN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="260"><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="1" stitchTiles="stitch"/></filter><rect width="260" height="260" filter="url(#grain)"/></svg>`;

const GRAIN_URI = `data:image/svg+xml;utf8,${encodeURIComponent(GRAIN_SVG)}`;

export const FilmGrain: React.FC<FilmGrainProps> = ({opacity, seed}) => {
  const frame = useCurrentFrame();
  const shiftX = ((frame * 7 + seed) % 11) - 5;
  const shiftY = ((frame * 5 + seed) % 9) - 4;
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url("${GRAIN_URI}")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '260px 260px',
        opacity,
        mixBlendMode: 'soft-light',
        transform: `translate(${shiftX}px, ${shiftY}px) scale(1.04)`,
        pointerEvents: 'none',
      }}
    />
  );
};
```

- [ ] **Step 6: typecheck and render a still**

```bash
npm run typecheck
npx remotion still src/index.ts CosmicIntro out/check-stars.png --frame=30
```

Expected: no type errors, and a 1080 by 1920 PNG with visible stars.

- [ ] **Step 7: commit**

```bash
git add src/components/Stars.tsx src/components/Particles.tsx src/components/ShootingStar.tsx src/components/Vignette.tsx src/components/FilmGrain.tsx
git commit -m "feat: add stars, particles, shooting star, vignette and grain"
```

---

### Task 9: The three heavy visual primitives

**Files:**
- Create: `src/components/Nebula.tsx`, `src/components/Planet.tsx`, `src/components/Warp.tsx`

**Interfaces:**
- `Nebula`: `{seed: number; progress: number; palette: Palette}`
- `Planet`: `{seed: number; progress: number; palette: Palette; showRing: boolean; lightSweep: number}`
- `Warp`: `{seed: number; progress: number; palette: Palette; roll: number; zoom: number}`

- [ ] **Step 1: write `src/components/Nebula.tsx`**

```tsx
import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {nebulaBlobs} from '../lib/seeded';
import type {Palette} from '../types.ts';

export type NebulaProps = {
  seed: number;
  progress: number;
  palette: Palette;
};

export const Nebula: React.FC<NebulaProps> = ({seed, progress, palette}) => {
  const {width, height} = useVideoConfig();
  const blobs = React.useMemo(() => nebulaBlobs(seed, 6), [seed]);
  const toneColor = (tone: 'purple' | 'magenta' | 'coral'): string => {
    if (tone === 'magenta') {
      return palette.stellarMagenta;
    }
    if (tone === 'coral') {
      return palette.solarCoral;
    }
    return palette.nebulaPurple;
  };

  return (
    <AbsoluteFill>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          {blobs.map((blob, index) => (
            <radialGradient key={index} id={`blob-${index}`}>
              <stop offset="0%" stopColor={toneColor(blob.tone)} stopOpacity={blob.opacity} />
              <stop offset="55%" stopColor={toneColor(blob.tone)} stopOpacity={blob.opacity * 0.35} />
              <stop offset="100%" stopColor={toneColor(blob.tone)} stopOpacity={0} />
            </radialGradient>
          ))}
          <radialGradient id="wash">
            <stop offset="0%" stopColor={palette.lavender} stopOpacity={0.16} />
            <stop offset="100%" stopColor={palette.lavender} stopOpacity={0} />
          </radialGradient>
        </defs>
        {blobs.map((blob, index) => (
          <ellipse
            key={index}
            cx={blob.x * width}
            cy={blob.y * height + progress * height * 0.06}
            rx={blob.radius * width * 0.95}
            ry={blob.radius * height * 0.62}
            fill={`url(#blob-${index})`}
            transform={`translate(${width / 2} ${height / 2}) scale(${1 + progress * 0.08}) translate(${-width / 2} ${-height / 2})`}
          />
        ))}
        <ellipse cx={width * 0.34} cy={height * 0.38} rx={width * 0.5} ry={height * 0.34} fill="url(#wash)" />
      </svg>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: write `src/components/Planet.tsx`**

```tsx
import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {planetBands} from '../lib/seeded';
import type {Palette} from '../types.ts';

export type PlanetProps = {
  seed: number;
  progress: number;
  palette: Palette;
  showRing: boolean;
  lightSweep: number;
};

export const Planet: React.FC<PlanetProps> = ({seed, progress, palette, showRing, lightSweep}) => {
  const {width, height} = useVideoConfig();
  const radius = width * 0.4;
  const cx = width * 0.5;
  const cy = height * 0.46;
  const bands = React.useMemo(() => planetBands(seed, 9), [seed]);
  const bandColor = (tone: 'purple' | 'lavender' | 'magenta'): string => {
    if (tone === 'lavender') {
      return palette.lavender;
    }
    if (tone === 'magenta') {
      return palette.stellarMagenta;
    }
    return palette.nebulaPurple;
  };
  const ringRx = radius * 1.75;
  const ringRy = radius * 0.34;
  const moonAngle = progress * Math.PI * 2 * 0.6;

  return (
    <AbsoluteFill>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <radialGradient id="surface" cx="38%" cy="34%" r="78%">
            <stop offset="0%" stopColor={palette.nebulaPurple} stopOpacity={0.95} />
            <stop offset="58%" stopColor={palette.cosmicIndigo} stopOpacity={1} />
            <stop offset="100%" stopColor={palette.deepViolet} stopOpacity={1} />
          </radialGradient>
          <linearGradient id="limb" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={palette.deepViolet} stopOpacity={0} />
            <stop offset="62%" stopColor={palette.deepViolet} stopOpacity={0.12} />
            <stop offset="100%" stopColor={palette.deepViolet} stopOpacity={0.72} />
          </linearGradient>
          <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={palette.lavender} stopOpacity={0.92} />
            <stop offset="30%" stopColor={palette.lavender} stopOpacity={0.12} />
            <stop offset="72%" stopColor={palette.lavender} stopOpacity={0} />
            <stop offset="100%" stopColor={palette.stellarMagenta} stopOpacity={0.42} />
          </linearGradient>
          <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={palette.lavender} stopOpacity={0} />
            <stop offset="50%" stopColor={palette.lavender} stopOpacity={0.14} />
            <stop offset="100%" stopColor={palette.lavender} stopOpacity={0} />
          </linearGradient>
          <clipPath id="planetClip">
            <circle cx={cx} cy={cy} r={radius} />
          </clipPath>
        </defs>

        {showRing ? (
          <g transform={`rotate(-18 ${cx} ${cy})`}>
            <ellipse
              cx={cx}
              cy={cy}
              rx={ringRx}
              ry={ringRy}
              fill="none"
              stroke={palette.lavender}
              strokeOpacity={0.26}
              strokeWidth={width * 0.005}
            />
          </g>
        ) : null}

        <circle cx={cx} cy={cy} r={radius} fill="url(#surface)" />

        <g clipPath="url(#planetClip)" transform={`rotate(${progress * 6} ${cx} ${cy})`}>
          {bands.map((band, index) => (
            <ellipse
              key={index}
              cx={cx}
              cy={cy - radius + band.y * radius * 2}
              rx={radius * 1.05}
              ry={band.thickness * radius}
              fill={bandColor(band.tone)}
              opacity={band.opacity}
            />
          ))}
          <rect
            x={cx - radius * 1.2}
            y={cy - radius * 1.2}
            width={radius * 2.4}
            height={radius * 2.4}
            fill="url(#sweep)"
            transform={`translate(${lightSweep * radius * 1.6} 0) rotate(-24 ${cx} ${cy})`}
          />
        </g>

        <circle cx={cx} cy={cy} r={radius} fill="url(#limb)" />
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="url(#rim)"
          strokeWidth={width * 0.012}
        />

        {showRing ? (
          <g transform={`rotate(-18 ${cx} ${cy})`}>
            <path
              d={`M ${cx + ringRx} ${cy} A ${ringRx} ${ringRy} 0 0 0 ${cx - ringRx} ${cy}`}
              fill="none"
              stroke={palette.lavender}
              strokeOpacity={0.42}
              strokeWidth={width * 0.005}
            />
          </g>
        ) : null}

        <g transform={`rotate(-18 ${cx} ${cy})`}>
          <circle
            cx={cx + Math.cos(moonAngle) * radius * 1.5}
            cy={cy + Math.sin(moonAngle) * radius * 0.45}
            r={width * 0.014}
            fill={palette.starlight}
            opacity={0.9}
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 3: write `src/components/Warp.tsx`**

```tsx
import React from 'react';
import {AbsoluteFill, interpolate, useVideoConfig} from 'remotion';
import {warpStreaks} from '../lib/seeded';
import type {Palette} from '../types.ts';

export type WarpProps = {
  seed: number;
  progress: number;
  palette: Palette;
  roll: number;
  zoom: number;
};

export const Warp: React.FC<WarpProps> = ({seed, progress, palette, roll, zoom}) => {
  const {width, height} = useVideoConfig();
  const streaks = React.useMemo(() => warpStreaks(seed, 90), [seed]);
  const cx = width / 2;
  const cy = height * 0.46;
  const maxRadius = Math.hypot(width, height) * 0.62;
  const speed = interpolate(progress, [0, 0.33, 0.66, 1], [0.08, 1, 0.78, 0.18], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const toneColor = (tone: 'starlight' | 'magenta' | 'coral'): string => {
    if (tone === 'magenta') {
      return palette.stellarMagenta;
    }
    if (tone === 'coral') {
      return palette.solarCoral;
    }
    return palette.starlight;
  };

  return (
    <AbsoluteFill>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <radialGradient id="warpDepth" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={palette.cosmicIndigo} stopOpacity={0.95} />
            <stop offset="70%" stopColor={palette.cosmicIndigo} stopOpacity={0.55} />
            <stop offset="100%" stopColor={palette.deepViolet} stopOpacity={0.2} />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width={width} height={height} fill="url(#warpDepth)" />
        <g
          transform={`rotate(${roll} ${cx} ${cy}) translate(${cx} ${cy}) scale(${zoom}) translate(${-cx} ${-cy})`}
        >
          {streaks.map((streak, index) => {
            const inner = streak.inner * maxRadius;
            const outer = streak.inner * maxRadius + streak.outer * maxRadius * (0.3 + 0.7 * speed);
            const x1 = cx + Math.cos(streak.angle) * inner;
            const y1 = cy + Math.sin(streak.angle) * inner;
            const x2 = cx + Math.cos(streak.angle) * outer;
            const y2 = cy + Math.sin(streak.angle) * outer;
            return (
              <line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={toneColor(streak.tone)}
                strokeWidth={streak.width * (0.6 + 0.9 * speed)}
                strokeLinecap="round"
                opacity={streak.alpha * speed}
              />
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 4: typecheck and render three stills**

```bash
npm run typecheck
npx remotion still src/index.ts CosmicIntro out/check-nebula.png --frame=200
npx remotion still src/index.ts CosmicIntro out/check-planet.png --frame=380
npx remotion still src/index.ts CosmicIntro out/check-warp.png --frame=600
```

Expected: a nebula that reads clearly purple with magenta, a planet that reads as a lit sphere with a rim, and a warp frame with radial streaks that is not a neon tunnel.

- [ ] **Step 5: commit**

```bash
git add src/components/Nebula.tsx src/components/Planet.tsx src/components/Warp.tsx
git commit -m "feat: add nebula, planet and warp primitives"
```

---

### Task 10: Typography layer

**Files:**
- Create: `src/components/Title.tsx`, `src/components/Subtitle.tsx`, `src/components/SafeZoneGuide.tsx`

**Interfaces:**
- `Title`: `{title: string; fadeOut: number; palette: Palette}`, uses `useCurrentFrame()` for the reveal
- `Subtitle`: `{entries: NarrationEntry[]; palette: Palette}`
- `SafeZoneGuide`: `{palette: Palette}`

- [ ] **Step 1: write `src/components/Title.tsx`**

```tsx
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {withAlpha} from '../data/theme';
import {titleFontSize} from '../lib/safeZone';
import type {Palette} from '../types.ts';

export type TitleProps = {
  title: string;
  fadeOut: number;
  palette: Palette;
};

const DISPLAY_FONT = '"Segoe UI Light", "Segoe UI", "Helvetica Neue", Arial, sans-serif';

export const Title: React.FC<TitleProps> = ({title, fadeOut, palette}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const lines = title.split('\n');
  const size = titleFontSize(width);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: height * 0.34,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: size * 0.14,
        opacity: 1 - fadeOut,
      }}
    >
      {lines.map((line, index) => {
        const start = 20 + index * 10;
        const t = Math.min(1, Math.max(0, (frame - start) / 44));
        const inset = (1 - t) * 50;
        const spacing = (0.42 - 0.24 * t).toFixed(3);
        return (
          <div key={index} style={{width: '100%', overflow: 'hidden', textAlign: 'center'}}>
            <div
              style={{
                clipPath: `inset(0 ${inset}% 0 ${inset}%)`,
                opacity: Math.min(1, t * 1.6),
                fontSize: size,
                fontWeight: 200,
                letterSpacing: `${spacing}em`,
                color: palette.starlight,
                fontFamily: DISPLAY_FONT,
                textShadow: `0 0 40px ${withAlpha(palette.lavender, 0.35)}`,
                lineHeight: 1.15,
                textTransform: 'uppercase',
              }}
            >
              {line}
            </div>
          </div>
        );
      })}
    </div>
  );
};
```

- [ ] **Step 2: write `src/components/Subtitle.tsx`**

```tsx
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {withAlpha} from '../data/theme';
import {subtitleBottomClearance, subtitleFontSize, subtitleMaxWidth} from '../lib/safeZone';
import {subtitleStateAt} from '../lib/subtitle';
import type {NarrationEntry, Palette} from '../types.ts';

export type SubtitleProps = {
  entries: NarrationEntry[];
  palette: Palette;
};

const BODY_FONT = '"Segoe UI", "Helvetica Neue", Arial, sans-serif';

export const Subtitle: React.FC<SubtitleProps> = ({entries, palette}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const state = subtitleStateAt(frame, entries);
  if (!state) {
    return null;
  }
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: subtitleBottomClearance(height),
        display: 'flex',
        justifyContent: 'center',
        padding: '0 40px',
      }}
    >
      <div
        style={{
          position: 'relative',
          maxWidth: subtitleMaxWidth(width),
          opacity: state.opacity,
          transform: `translateY(${state.offsetY}px)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '-70px -90px',
            background: `linear-gradient(to top, ${withAlpha(palette.deepViolet, 0.55)}, transparent)`,
          }}
        />
        <div
          style={{
            position: 'relative',
            fontSize: subtitleFontSize(width),
            lineHeight: 1.25,
            fontWeight: 300,
            textAlign: 'center',
            color: palette.starlight,
            fontFamily: BODY_FONT,
            textShadow: `0 2px 24px ${withAlpha(palette.deepViolet, 0.9)}`,
          }}
        >
          {state.text}
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 3: write `src/components/SafeZoneGuide.tsx`**

```tsx
import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {withAlpha} from '../data/theme';
import {safeZone, subtitleBottomClearance} from '../lib/safeZone';
import type {Palette} from '../types.ts';

export type SafeZoneGuideProps = {
  palette: Palette;
};

export const SafeZoneGuide: React.FC<SafeZoneGuideProps> = ({palette}) => {
  const {width, height} = useVideoConfig();
  const zone = safeZone(width, height);
  const clearance = subtitleBottomClearance(height);
  const stroke = `1px dashed ${withAlpha(palette.solarCoral, 0.6)}`;
  const label = {
    fontSize: 22,
    color: withAlpha(palette.solarCoral, 0.85),
    fontFamily: '"Segoe UI", Arial, sans-serif',
  };
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: zone.left,
          top: zone.top,
          width: width - zone.left - zone.right,
          height: height - zone.top - zone.bottom,
          border: stroke,
        }}
      >
        <span style={{position: 'absolute', top: -30, left: 0, ...label}}>SAFE ZONE</span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: clearance, borderTop: stroke}}>
        <span style={{position: 'absolute', bottom: 8, left: 0, ...label}}>SUBTITLE CLEARANCE</span>
      </div>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 4: typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 5: commit**

```bash
git add src/components/Title.tsx src/components/Subtitle.tsx src/components/SafeZoneGuide.tsx
git commit -m "feat: add title, subtitle and safe zone guide"
```

---

### Task 11: Scenes and the root wiring

**Files:**
- Create: `src/scenes/Void.tsx`, `src/scenes/Nebula.tsx`, `src/scenes/Planet.tsx`, `src/scenes/Warp.tsx`, `src/scenes/Resolve.tsx`
- Modify: `src/Root.tsx`

**Interfaces:**
- Every scene exports `XScene: React.FC<SceneProps>` where `SceneProps = {palette: Palette; seed: number; progress: number; durationInFrames: number; showRing: boolean; title: string}` and `progress` is 0 to 1 across that scene span.
- `src/Root.tsx` maps `buildSceneSpans()` to the five scene components, wraps each in a `<Sequence>` with the span, and fades each scene in over 18 frames.

- [ ] **Step 1: write the scene prop type in `src/types.ts`**

```ts
export type SceneProps = {
  palette: Palette;
  seed: number;
  progress: number;
  durationInFrames: number;
  showRing: boolean;
  title: string;
};
```

- [ ] **Step 2: write `src/scenes/Void.tsx`**

```tsx
import React from 'react';
import {AbsoluteFill, interpolate, useVideoConfig} from 'remotion';
import {Stars} from '../components/Stars';
import {Vignette} from '../components/Vignette';
import {withAlpha} from '../data/theme';
import type {SceneProps} from '../types.ts';

export const VoidScene: React.FC<SceneProps> = ({palette, seed, progress}) => {
  const {height} = useVideoConfig();
  const openRatio = interpolate(progress, [0, 1], [44, 68], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 95% 62% at 50% 76%, ${withAlpha(palette.cosmicIndigo, 1)} 0%, ${withAlpha(palette.deepViolet, 1)} 72%)`,
      }}
    >
      <Stars seed={seed} count={70} layer={0} color={palette.starlight} opacity={0.5} parallax={0.6} />
      <Stars seed={seed + 1} count={46} layer={1} color={palette.starlight} opacity={0.7} parallax={1} />
      <Stars seed={seed + 2} count={22} layer={2} color={palette.lavender} opacity={0.85} parallax={1.5} />
      <Vignette color={palette.deepViolet} strength={0.85} openRatio={openRatio} />
    </AbsoluteFill>
  );
};
```

- [ ] **Step 3: write `src/scenes/Nebula.tsx`**

```tsx
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Nebula} from '../components/Nebula';
import {Particles} from '../components/Particles';
import {ShootingStar} from '../components/ShootingStar';
import {Stars} from '../components/Stars';
import {Vignette} from '../components/Vignette';
import {withAlpha} from '../data/theme';
import type {SceneProps} from '../types.ts';

export const NebulaScene: React.FC<SceneProps> = ({palette, seed, progress}) => (
  <AbsoluteFill style={{backgroundColor: palette.deepViolet}}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 85% 55% at 50% 38%, ${withAlpha(palette.cosmicIndigo, 0.95)}, transparent 72%)`,
      }}
    />
    <Nebula seed={seed + 11} progress={progress} palette={palette} />
    <Stars seed={seed + 12} count={52} layer={0} color={palette.starlight} opacity={0.45} parallax={0.5} />
    <Stars seed={seed + 13} count={34} layer={1} color={palette.starlight} opacity={0.65} parallax={0.9} />
    <Stars seed={seed + 14} count={16} layer={2} color={palette.lavender} opacity={0.8} parallax={1.4} />
    <Particles seed={seed + 31} count={26} color={palette.lavender} drift={0.35} />
    <ShootingStar startFrame={129} color={palette.starlight} length={260} />
    <Vignette color={palette.deepViolet} strength={0.72} openRatio={58} />
  </AbsoluteFill>
);
```

- [ ] **Step 4: write `src/scenes/Planet.tsx`**

```tsx
import React from 'react';
import {AbsoluteFill, interpolate, useVideoConfig} from 'remotion';
import {Planet} from '../components/Planet';
import {Stars} from '../components/Stars';
import {Vignette} from '../components/Vignette';
import {withAlpha} from '../data/theme';
import type {SceneProps} from '../types.ts';

export const PlanetScene: React.FC<SceneProps> = ({palette, seed, progress, showRing}) => {
  const {height} = useVideoConfig();
  const rise = interpolate(progress, [0, 0.65], [height * 0.18, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 80% 50% at 50% 46%, ${withAlpha(palette.cosmicIndigo, 1)}, ${withAlpha(palette.deepViolet, 1)} 78%)`,
      }}
    >
      <Stars seed={seed + 21} count={44} layer={0} color={palette.starlight} opacity={0.42} parallax={0.4} />
      <Stars seed={seed + 22} count={26} layer={1} color={palette.starlight} opacity={0.6} parallax={0.8} />
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${rise}px)`}}>
        <Planet
          seed={seed + 7}
          progress={progress}
          palette={palette}
          showRing={showRing}
          lightSweep={progress * 1.4}
        />
      </div>
      <Vignette color={palette.deepViolet} strength={0.75} openRatio={56} />
    </AbsoluteFill>
  );
};
```

- [ ] **Step 5: write `src/scenes/Warp.tsx`**

```tsx
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Vignette} from '../components/Vignette';
import {Warp} from '../components/Warp';
import type {SceneProps} from '../types.ts';

export const WarpScene: React.FC<SceneProps> = ({palette, seed, progress}) => {
  const zoom = interpolate(progress, [0, 1], [1, 1.22], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const roll = interpolate(progress, [0, 0.5, 1], [-1.6, 0.4, -1.2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{backgroundColor: palette.deepViolet}}>
      <Warp seed={seed + 17} progress={progress} palette={palette} roll={roll} zoom={zoom} />
      <Vignette color={palette.deepViolet} strength={0.7} openRatio={60} />
    </AbsoluteFill>
  );
};
```

- [ ] **Step 6: write `src/scenes/Resolve.tsx`**

```tsx
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Stars} from '../components/Stars';
import {Title} from '../components/Title';
import {Vignette} from '../components/Vignette';
import {withAlpha} from '../data/theme';
import type {SceneProps} from '../types.ts';

export const ResolveScene: React.FC<SceneProps> = ({
  palette,
  seed,
  progress,
  durationInFrames,
  title,
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const ringRadius = interpolate(progress, [0.06, 0.9], [width * 0.12, width * 1.15], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ringOpacity = interpolate(progress, [0.06, 0.2, 0.9], [0, 0.5, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleFade = interpolate(
    frame,
    [durationInFrames - 42, durationInFrames - 12],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolapolateRight: 'clamp'},
  );
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 78% 52% at 50% 44%, ${withAlpha(palette.nebulaPurple, 0.9)}, ${withAlpha(palette.deepViolet, 1)} 74%)`,
      }}
    >
      <Stars seed={seed + 23} count={40} layer={1} color={palette.starlight} opacity={0.45} parallax={0.7} />
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} style={{position: 'absolute'}}>
        <circle
          cx={width / 2}
          cy={height * 0.46}
          r={ringRadius}
          fill="none"
          stroke={palette.lavender}
          strokeWidth={2}
          opacity={ringOpacity}
        />
      </svg>
      <Title title={title} fadeOut={titleFade} palette={palette} />
      <Vignette color={palette.deepViolet} strength={0.8} openRatio={58} />
    </AbsoluteFill>
  );
};
```

- [ ] **Step 7: rewrite `src/Root.tsx` with the timeline wiring**

```tsx
import React from 'react';
import {AbsoluteFill, Composition, interpolate, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {AudioTrack} from './components/AudioTrack';
import {FilmGrain} from './components/FilmGrain';
import {SafeZoneGuide} from './components/SafeZoneGuide';
import {Subtitle} from './components/Subtitle';
import {cosmicTheme} from './data/theme';
import {narration} from './data/narration';
import {buildSceneSpans, CROSSFADE_FRAMES, TOTAL_FRAMES} from './lib/timeline';
import {NebulaScene} from './scenes/Nebula';
import {PlanetScene} from './scenes/Planet';
import {ResolveScene} from './scenes/Resolve';
import {VoidScene} from './scenes/Void';
import {WarpScene} from './scenes/Warp';
import type {CosmicIntroProps} from './types';

const SCENES = {
  void: VoidScene,
  nebula: NebulaScene,
  planet: PlanetScene,
  warp: WarpScene,
  resolve: ResolveScene,
} as const;

const SceneHost: React.FC<{children: React.ReactNode; fadeIn: boolean}> = ({children, fadeIn}) => {
  const frame = useCurrentFrame();
  const opacity = fadeIn
    ? interpolate(frame, [0, CROSSFADE_FRAMES], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;
  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};

const CosmicIntro: React.FC<CosmicIntroProps> = (props) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const entries = props.narration ?? narration;
  const spans = buildSceneSpans();
  const driftX = interpolate(frame, [0, TOTAL_FRAMES], [-8, 8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const driftY = interpolate(frame, [0, TOTAL_FRAMES], [6, -6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const roll = interpolate(frame, [0, 450, TOTAL_FRAMES], [-1.2, 0.6, -0.8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: props.palette.deepViolet}}>
      <AbsoluteFill
        style={{
          transform: `translate(${driftX}px, ${driftY}px) rotate(${roll}deg)`,
          transformOrigin: '50% 50%',
        }}
      >
        {spans.map((span) => {
          const Scene = SCENES[span.id];
          return (
            <Sequence
              key={span.id}
              name={span.id}
              from={span.from}
              durationInFrames={span.durationInFrames}
            >
              <SceneHost fadeIn={span.id !== 'void'}>
                <Scene
                  palette={props.palette}
                  seed={props.seed}
                  progress={0}
                  durationInFrames={span.durationInFrames}
                  showRing={props.showRing}
                  title={props.title}
                />
              </SceneHost>
            </Sequence>
          );
        })}
      </AbsoluteFill>
      {props.showSubtitle ? <Subtitle entries={entries} palette={props.palette} /> : null}
      <FilmGrain opacity={0.05} seed={props.seed} />
      {props.showSafeZoneGuide ? <SafeZoneGuide palette={props.palette} /> : null}
      <AudioTrack
        entries={entries}
        voiceVolume={props.voiceVolume}
        ambientVolume={props.ambientVolume}
      />
    </AbsoluteFill>
  );
};
```

Problem in the snippet above: `progress` is hardcoded to 0 and the `Scene` type does not match the union of scene components. Fix both in the same edit, by using a `SceneProgress` wrapper that reads the local frame and passes `progress`:

```tsx
const SceneProgress: React.FC<{
  durationInFrames: number;
  render: (progress: number) => React.ReactNode;
}> = ({durationInFrames, render}) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, Math.max(0, frame / (durationInFrames - 1)));
  return <>{render(progress)}</>;
};
```

Then in the map:

```tsx
<SceneHost fadeIn={span.id !== 'void'}>
  <SceneProgress
    durationInFrames={span.durationInFrames}
    render={(progress) => (
      <Scene
        palette={props.palette}
        seed={props.seed}
        progress={progress}
        durationInFrames={span.durationInFrames}
        showRing={props.showRing}
        title={props.title}
      />
    )}
  />
</SceneHost>
```

Every scene component takes the same props, so the union type works without a cast.

- [ ] **Step 8: typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 9: render one still per scene and look at them**

```bash
npx remotion still src/index.ts CosmicIntro out/scene-void.png --frame=60
npx remotion still src/index.ts CosmicIntro out/scene-nebula.png --frame=220
npx remotion still src/index.ts CosmicIntro out/scene-planet.png --frame=420
npx remotion still src/index.ts CosmicIntro out/scene-warp.png --frame=620
npx remotion still src/index.ts CosmicIntro out/scene-resolve.png --frame=820
```

Expected: five different compositions, no blank frame, the Void visibly indigo, the Nebula visibly purple with magenta, the Planet the clear focal point, the Warp radial and not neon, the Resolve calm with the title legible.

- [ ] **Step 10: commit**

```bash
git add src/scenes src/Root.tsx src/types.ts
git commit -m "feat: add the five scenes and wire the crossfade timeline"
```

---

### Task 12: Voiceover, placement, and duration validation

**Files:**
- Create: `src/components/AudioTrack.tsx`
- Create: `src/scripts/generate-voiceover.ts`, `src/scripts/validate-audio.ts`

**Interfaces:**
- `AudioTrack`: `{entries: NarrationEntry[]; voiceVolume: number; ambientVolume: number}`
- `src/scripts/generate-voiceover.ts` reads `src/data/narration.ts` and writes `public/voiceover/scene-1.mp3` through `scene-5.mp3`
- `src/scripts/validate-audio.ts` exits non zero when a voiceover file is missing

- [ ] **Step 1: install edge-tts and confirm its CLI**

```bash
python -m pip install edge-tts
python -m edge_tts --help
```

Expected: the module installs and the help text lists `--voice`, `--rate`, `--file`, and `--write-media`.

- [ ] **Step 2: write `src/components/AudioTrack.tsx`**

```tsx
import React, {useEffect, useState} from 'react';
import {Audio} from '@remotion/media';
import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {checkAudioSlot} from '../lib/audioSlots';
import {TOTAL_FRAMES} from '../lib/timeline';
import type {NarrationEntry} from '../types';

export type AudioTrackProps = {
  entries: NarrationEntry[];
  voiceVolume: number;
  ambientVolume: number;
};

export const AudioTrack: React.FC<AudioTrackProps> = ({entries, voiceVolume, ambientVolume}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const [ambientReady, setAmbientReady] = useState(false);

  useEffect(() => {
    entries.forEach((entry) => {
      getAudioDurationInSeconds(staticFile(`voiceover/${entry.audioFile}`))
        .then((seconds) => {
          const check = checkAudioSlot(entry, seconds, fps);
          if (check.overlong) {
            console.warn(check.message);
          } else {
            console.info(check.message);
          }
        })
        .catch((error: unknown) => {
          console.error(
            `[audio] Missing or unreadable voiceover for scene "${entry.id}" (${entry.audioFile}). Run "npm run voiceover" before rendering.`,
            error,
          );
        });
    });
  }, [entries, fps]);

  useEffect(() => {
    let cancelled = false;
    fetch(staticFile('audio/ambient.mp3'), {method: 'HEAD'})
      .then((response) => {
        if (!cancelled && response.ok) {
          setAmbientReady(true);
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const speaking = entries.some(
    (entry) => frame >= entry.startFrame && frame <= entry.endFrame,
  );
  const fade = interpolate(
    frame,
    [0, 45, TOTAL_FRAMES - 45, TOTAL_FRAMES],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const ambient = ambientReady ? ambientVolume * fade * (speaking ? 0.35 : 1) : 0;

  return (
    <>
      {entries.map((entry) => (
        <Sequence key={entry.id} name={`voice-${entry.id}`} from={entry.startFrame}>
          <Audio src={staticFile(`voiceover/${entry.audioFile}`)} volume={voiceVolume} />
        </Sequence>
      ))}
      {ambientReady ? (
        <Audio src={staticFile('audio/ambient.mp3')} volume={ambient} />
      ) : null}
    </>
  );
};
```

Two deliberate choices: the voiceover `<Sequence>` has no `durationInFrames`, so an overlong line plays to its natural end instead of being cut silently, and the ambient track is only mounted when the file answers, so an absent ambient file cannot break the render. The ambient level drops to 35 percent while a narration slot is open, which is real ducking driven by the same data the subtitles use.

If `getAudioDurationInSeconds` is missing from the installed `@remotion/media-utils`, fall back to a local `measureDuration` helper that creates an `Audio` element and reads `duration` from `loadedmetadata`. Report the fallback in the delivery notes.

- [ ] **Step 3: write `src/scripts/generate-voiceover.ts`**

```ts
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
```

- [ ] **Step 4: write `src/scripts/validate-audio.ts`**

```ts
import {existsSync, statSync} from 'node:fs';
import {resolve} from 'node:path';
import {narration} from '../data/narration.ts';
import {findMissingAudio} from '../lib/audioFiles.ts';

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

for (const entry of narration) {
  const path = resolve('public/voiceover', entry.audioFile);
  const seconds = (entry.endFrame - entry.startFrame) / 30;
  console.log(`${entry.id}: ${entry.audioFile} ${statSync(path).size} bytes, slot ${seconds}s`);
}

console.log('All voiceover files are present.');
```

- [ ] **Step 5: generate the voiceover**

```bash
npm run voiceover
```

Expected: five files in `public/voiceover/`, each larger than 1000 bytes, and no error.

- [ ] **Step 6: run the validator**

```bash
npm run validate:audio
```

Expected: one line per scene and a final "All voiceover files are present."

- [ ] **Step 7: render a still and read the duration warnings in the log**

```bash
npx remotion still src/index.ts CosmicIntro out/check-audio.png --frame=40
```

Expected: the log carries one duration line per scene, and a warning naming the scene, the measured duration, and the allowed slot whenever a line runs long.

- [ ] **Step 8: commit**

```bash
git add src/components/AudioTrack.tsx src/scripts
git commit -m "feat: add voiceover generation, placement and duration validation"
```

---

### Task 13: Full render and the acceptance report

**Files:**
- Create: `out/cosmic-reels.mp4` (gitignored)

- [ ] **Step 1: confirm the render flags against the installed CLI**

```bash
npx remotion render --help
```

Expected: `--codec` and `--crf` are listed. If `--crf` was replaced, use the replacement and record it in the delivery notes.

- [ ] **Step 2: run the tests, the typecheck, and the validator**

```bash
npm test
npm run typecheck
npm run validate:audio
```

Expected: all green.

- [ ] **Step 3: render the reel**

```bash
npm run render
```

Expected: `out/cosmic-reels.mp4` exists, 900 frames, 30 fps, 1080 by 1920, with an audio track.

- [ ] **Step 4: inspect the output**

```bash
npx remotion still src/index.ts CosmicIntro out/final-void.png --frame=40
npx remotion still src/index.ts CosmicIntro out/final-nebula.png --frame=230
npx remotion still src/index.ts CosmicIntro out/final-planet.png --frame=430
npx remotion still src/index.ts CosmicIntro out/final-warp.png --frame=630
npx remotion still src/index.ts CosmicIntro out/final-resolve.png --frame=840
npx remotion still src/index.ts CosmicIntro out/final-boundary.png --frame=120
```

Look at every still. The boundary frame must not be blank, the title must be inside the safe zone, and the subtitle must be readable over the nebula and the planet.

- [ ] **Step 5: run the acceptance checklist from `AGENTS.md`**

Write down the result of all twenty points, with the evidence for each. A point that was not verified says so.

- [ ] **Step 6: run the antislop delivery gate**

Report R-25 (contrast of the subtitle and the title over the real frames), R-19 (motion has one focal point per scene, no bounce), R-29 (seven tokens, no extra hue), R-31 (one reason per major decision, recorded in `DESIGN.md`), and R-35 (the reel was rendered and looked at). Any FAIL is fixed before delivery.

- [ ] **Step 7: commit the plan and the notes**

```bash
git add docs AGENTS.md DESIGN.md
git commit -m "docs: add the implementation plan"
```

---

## Self review

**Spec coverage.** Every section of `AGENTS.md` maps to a task: the technical constraints to Task 1 and the global constraints, the palette to Task 2, the timeline to Task 3, the safe zones to Task 4, the seeded visuals to Task 5, the narration data to Task 6, the audio rules to Tasks 7 and 12, the components to Tasks 8 to 10, the scenes to Task 11, and the acceptance list to Task 13.

**Placeholder scan.** No task says "implement later" or "similar to Task N". The four tasks that carry visual code (8, 9, 10, 11) give the full source. The two scripts (Task 12) give the full source.

**Type consistency.** `Palette`, `NarrationEntry`, `SceneProps`, and `CosmicIntroProps` are declared in `src/types.ts` and imported everywhere else. `SceneProps` is the contract for all five scenes. `buildSceneSpans` returns `SceneSpan[]` with `id` matching the `SCENES` map keys. `subtitleStateAt` returns `SubtitleState | null`, and `Subtitle` renders nothing when it is null. `checkAudioSlot` returns `SlotCheck`, and `AudioTrack` reads `check.overlong` and `check.message`.

**Known deviations, all deliberate.** `<Audio>` comes from `@remotion/media` because the copy in `remotion` is deprecated. `getAudioDurationInSeconds` is deprecated and browser only, so the duration check runs inside the composition and the Node side only checks that the files exist. Fonts are a system stack because the brief forbids external assets. The `Audio` sequence has no duration cap so that an overlong line is never cut silently.

