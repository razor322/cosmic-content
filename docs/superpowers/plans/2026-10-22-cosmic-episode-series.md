# CosmicEpisode Series Implementation Plan

> Built and verified in one session. Steps use checkbox (`- [ ]`) syntax; checked boxes are done.

**Goal:** A reusable Remotion composition `CosmicEpisode` that renders any episode of the cosmic series from `src/data/episodes.ts`, with five scenes, a seamless loop, procedural visuals, voiceover and subtitles.

**Architecture:** Two layers. `src/lib/` holds every piece of logic that can be wrong: timeline math, safe zone ratios, seeded placement, subtitle timing, audio slot checks, gradient strings. It is plain TypeScript with no React, tested with the Node built in test runner, zero test dependencies. `src/components/` and `src/scenes/` hold the rendering and stay thin by calling into `src/lib/`. Every random looking value comes from one seeded generator, every colour comes from `src/theme/palette.ts`.

**Tech Stack:** Remotion 4.0.537, React 19, TypeScript 5 strict, `@remotion/fonts`, `@remotion/media-utils`, Node 22 test runner, edge-tts for the voiceover, Python for the sound synthesis.

## Global Constraints

- Composition ids `ep01` to `ep06`, all rendering `CosmicEpisode`, 1080 by 1920, 30 fps, 1080 frames.
- TypeScript strict mode. `npm run typecheck` must pass before any task is closed.
- Only runtime dependencies beyond Remotion and React: `@remotion/media-utils` and `@remotion/fonts`.
- No `Math.random()`, no `Date.now()`, no timers, no CSS keyframes, no CSS transitions.
- Every colour literal lives in `src/theme/palette.ts`. A test enforces this.
- All layout values derive from `useVideoConfig()` or from ratios in `src/lib/safeZone.ts`.
- All animation is frame driven through `useCurrentFrame()`, `interpolate()`, `interpolateColors()` and `spring()`, clamped.
- No external image, font, or audio asset is downloaded.
- Cross-fades are twelve frames. The composition ends at frame 1080.
- Narration slot boundaries stay at 0, 90, 360, 600, 840, 1080.
- Every new function in `src/lib/` has a test that was watched failing first.
- Port 3111 for every Remotion command: port 3000 is taken by another project on this machine.
- Render with the GPU: `--gl=angle`.

---

### Task 1: Toolchain, palette and guards

- [x] Remove the previous `CosmicIntro` composition, its data and its scenes.
- [x] Add `@remotion/fonts`, pin every Remotion package to 4.0.537.
- [x] `src/theme/palette.ts`: the six tokens, `withAlpha`, `mix`, `tint`, `shade`, `warmRamp`, `coreRamp`, `rampInputRange`.
- [x] `src/lib/palette.test.ts`: exactly six tokens, no pure black or white, the four stop ramp in order, indigo and coral never neighbours, a core ramp only mixes neighbouring tokens and never uses coral.
- [x] `src/lib/guards.test.ts`: no `Math.random` or `Date.now`, hex only in the palette file, no CSS colour keyword in a style value.

### Task 2: Episode data

- [x] `src/data/episodes.ts`: the `Episode` type and the six episodes, with the shared voice `en-US-AndrewNeural`.
- [x] The closer falls back to the sign off line.

### Task 3: The logic layer

- [x] `src/lib/timeline.ts`: the five scene slots, the crossfade spans, the voiceover slot four frames into every scene.
- [x] `src/lib/loopMotion.ts`: the hook drift, the closing drift and the loop frame, with the test that proves the starfield enters the loop at the speed it started with.
- [x] `src/lib/textFit.ts`: the hook font size that keeps every line inside the safe width.
- [x] `src/lib/subtitle.ts`: the subtitle window, six frames after the audio.
- [x] `src/lib/gradients.ts`: the wash and the vignette, with the test that an ellipse always carries two radii.
- [x] `src/lib/audioSlots.ts`, `src/lib/audioFiles.ts`, `src/lib/mp3Duration.ts`: the slot check, the missing file check and the Node side duration measurement.

### Task 4: Components

- [x] `Stars`, `Particles`, `ShootingStar`, `Vignette`, `SpaceWash`, `DitherOverlay`, `FilmGrain`, `SafeZoneGuide`.
- [x] `Nebula`, `Planet` with the five variants, `Warp` with the edge colour split, `ShockwaveRing`.
- [x] `HookText`, `Title`, `Subtitle`, `KeyPointChip`, `ContextTag`.
- [x] `FontLoader` loads the display and body faces before the first frame, and `AudioTrack` places the voiceover, the sound effects and the ambient bed.

### Task 5: Scenes and root

- [x] The five scenes, each with one focal point and its colour arc.
- [x] `src/Root.tsx` registers one composition per episode with `calculateMetadata` for the duration, the props, the codec and the output name.

### Task 6: Sound and voiceover

- [x] `src/scripts/generate-sfx.ts` synthesises the hit, the whoosh and the ambient pad as WAV files.
- [x] `src/scripts/generate-voiceover.ts` writes one MP3 per scene per episode, with the episode filter.
- [x] `src/scripts/validate-audio.ts` measures every file and stops the pipeline when a file is missing or too long.
- [x] `src/scripts/render-all.ts` renders every episode.

### Task 7: Verification

- [x] `tools/qa-frames.py` measures a rendered frame: palette share by hue, coral clusters, luminance, text bounding box.
- [x] The palette shares land inside the brief bands, except a few points of the indigo share in the base led scenes. The reason is written in `DESIGN.md`.
- [x] The subtitle measures 18 to 1 contrast, the title and the hook sit inside the safe zone, no scene boundary is blank.
- [x] The last frame and the first frame differ by 0.007 percent of the pixels in the starfield band, so the loop closes.

---

## Deviations from the brief

- **Voice.** Every episode uses `en-US-AndrewNeural`, as instructed. The brief listed a different voice per episode, and `en-AU-WilliamNeural` does not exist in edge-tts.
- **`<Audio>`** comes from `@remotion/media`, because the copy in `remotion` is deprecated. The package was already installed.
- **Chromatic aberration** uses magenta and indigo offset layers instead of red and blue, so the warp stays inside the palette.
- **Scripts** run on `node --experimental-strip-types` instead of `npx tsx`, which keeps the dependency list unchanged.
- **The context tag** sits at the top of the safe area rather than inside the reserved margin, because the brief also reserves the top 220 pixels for the interface.
- **The loop** matches the starfield exactly. The hook text appears on frame zero, which is what the brief asks for and which means the text itself cuts at the loop point.
