# Cosmic Reels — Series Brief

Project-wide brief for the `CosmicEpisode` compositions. This file is the source of truth for the series. The episode data lives in `src/data/episodes.ts`, the palette in `src/theme/palette.ts`, the direction in `DESIGN.md`.

## 0. ROLE AND GOAL

A senior creative technologist building a reusable Remotion v4 project with TypeScript strict mode. The output is a series of short, educational cosmic videos for a general audience: every point has to land for a viewer with no science background.

The composition is data driven. Narration, palette, title, seed, audio levels, subtitle visibility, safe zone guide, lead colour, planet variant and the closing call to action are all props or data, never hardcoded inside a scene.

Working rules:

- Do not ask questions when the brief already answers them. State a necessary assumption in one short line and move on.
- Inspect the installed Remotion version and its types before relying on an API. Do not invent APIs.
- Prefer the simplest implementation that satisfies the visual and technical requirements.
- If a feature is uncertain, choose a deterministic, documented fallback and state the limitation.
- Do not claim a feature is complete unless it is implemented and verified in the codebase.

## 1. HARD TECHNICAL CONSTRAINTS

- Composition ids: `ep01` to `ep06`, one per episode, all rendering the same `CosmicEpisode` component.
- Canvas 1080 by 1920, 30 fps, 1080 frames per episode, 36 seconds.
- TypeScript strict mode, React, `<Sequence>` for timing, `interpolate()`, `interpolateColors()` and `spring()` for motion.
- No external animation library. Runtime dependencies beyond the Remotion and React toolchain: `@remotion/media-utils` and `@remotion/fonts`.
- No `Math.random()`, no `Date.now()`, no timers, no CSS keyframes, no CSS transitions. Every placement comes from a seeded generator.
- The same props and frame always produce the same image.
- All visuals are procedural: React, SVG, CSS. No downloaded image, font or audio asset.
- Every size derives from `useVideoConfig()` or from a ratio. No hardcoded 1080 or 1920 inside a scene.
- H.264 MP4, CRF 18, audio included. Render with the GPU: `--gl=angle`.
- Use `staticFile()` for everything under `public/`.
- Precompute reusable data at module scope or with `useMemo`. Keep the render cheap.

## 2. RETENTION

Real data: 79 percent of viewers are still there at second one, 44 percent at second three, 21 percent at second seven.

- The core message is finished before second twelve. Second twelve to thirty six is for the viewers who stayed.
- Frame zero already carries a full visual and the full hook text. No fade in from black.
- Something changes visually every three to four seconds.
- The third and fourth scene open with a hook line: "But it gets bigger.", "But it gets stranger.", "But it gets wilder.", "But it gets older."
- The reel loops: the last frame joins the first frame without a cut.

## 3. SCENE STRUCTURE

Crossfade of twelve frames between scenes, using `<Sequence>`.

| Scene | Frames | Content | Colour arc |
| --- | --- | --- | --- |
| Hook | 0-90 | Starfield shoots fast and slows down, spring with high damping. Hook text of three or four lines, 108 to 140 px, readable on frame zero, settles from scale 1.04 to 1 over eight frames. The highlighted word is the single coral element. Hit and whoosh sound on frame zero, voiceover from frame four, no subtitle. | base, white stars, one coral accent |
| Core | 90-360 | Nebula opens out of a single point, particles flow into one focus. Small context tag for the first two seconds. Key point chip about one second after the voiceover starts. | indigo to purple |
| Extra 1 | 360-600 | Pull back to the object, planet variant, companion body on an elliptical orbit, soft light sweep. Key point chip. | purple to magenta |
| Extra 2 | 600-840 | Warp: stars stretch into radial streaks, speed ramps up then slows, light colour split at the edges, roll at most two degrees. Key point chip. | magenta to coral |
| Closer | 840-1080 | Everything collapses into one coral light point with a thin shockwave ring. BEYOND / THE / SKY reveals from the middle outwards, letter spacing widens slowly, small call to action underneath. The last five seconds open the point back into the starfield of frame zero, same seed and same speed, and the ambient level returns to its starting value. | coral, then back to base and white |

The loop is built, not faked: the closing starfield uses `frame - 1080` as its own frame, so at the end of the episode it sits exactly on the state of frame zero.

## 4. COLOUR RULES

One source of colour: `src/theme/palette.ts`. No hex anywhere else.

| Token | Hex | Role |
| --- | --- | --- |
| space.base | #0A0618 | base and background |
| cosmic.indigo | #443199 | Cosmic Indigo |
| nebula.purple | #792CA2 | Nebula Purple |
| stellar.magenta | #C13383 | Stellar Magenta |
| solar.coral | #E05454 | Solar Coral, the only warm accent |
| star.white | #F6F1FF | text and stars |

1. Temperature ramp: indigo, purple, magenta, coral. Gradients only between neighbouring tokens or with the base. Indigo may never jump straight to coral. Use `interpolateColors` with four stops.
2. Share per frame: base 55 to 65 percent, indigo and purple 25 to 30 percent, magenta at most 10 percent, coral at most 5 percent. The warp peak may reach 12 percent through the edge glow.
3. Coral is a single focus: only one coral element per frame, such as the highlighted hook word, the light point, the shockwave or the planet rim. Never a large background, never body text.
4. Text is `star.white`. Subtitles and long text are never coral. Over a bright coral or magenta area, put a thin dark gradient under the text so the contrast stays at 4.5:1 or better.
5. No `#000`, no `#FFF`, no other hue. Stars are white with at most a fifteen percent tint of magenta, coral or indigo.
6. Derived colours come from mixing with the base or with `star.white`, never from a new hue.
7. Colour arc per scene is listed in the scene table above.
8. Anti banding: a static ordered dither over every gradient at two to three percent, plus fine film grain from `feTurbulence` seeded per frame.
9. The palette prop may change the hex values. It may not change the role of a token.
10. An episode may pick a lead colour, indigo, purple or magenta, as the dominant colour of the core scene. Coral stays an accent.

## 5. TYPOGRAPHY

Heading and hook: `Trvocal Calm`. Body and subtitle: `Jost`, which fills the Futura 100 role. Both are loaded through `@remotion/fonts` from `public/fonts`. Hook and title are uppercase with wide tracking.

Title 108 to 140 px, subtitle 46 to 52 px, small supporting text at least 36 px. Line height 1.1 to 1.3 for body text. The hook shrinks to fit the safe width instead of overflowing.

## 6. SAFE ZONE

Reference canvas 1080 by 1920. Top 220 px, bottom 380 px, right 120 px, left 60 px are reserved and hold no important text. The subtitle is centred, at most 840 px wide, at most three lines, with its lower edge at least 400 px above the bottom of the frame. The main focal point stays between 35 and 55 percent of the frame height. The `showSafeZoneGuide` prop draws the guide in the preview and defaults to false.

## 7. VOICEOVER AND SOUND

Free tools only, English, one voice per episode. `src/scripts/generate-voiceover.ts` uses edge-tts and writes one MP3 per scene per episode to `public/voiceover/{episodeId}/{scene}.mp3`, at rate zero percent. Each file is placed with `<Sequence from={startFrame + 4}>` and `<Audio src={staticFile(...)} />`.

`getAudioDurationInSeconds()` validates every file against its scene slot. A file that runs long stops the render with a message naming the scene, the measured duration and the allowed duration. `src/scripts/generate-sfx.ts` synthesises the hit, the whoosh and the ambient pad as WAV files from filtered noise, sine sweeps and detuned pads. The ambient level ducks while the voiceover speaks and returns to its starting level for the loop.

## 8. SUBTITLE

`src/components/Subtitle.tsx` reads the narration from `src/data/episodes.ts`. It starts six frames after the audio, fades in and rises twelve pixels over ten frames, and fades out over the last ten frames of the slot. `showSubtitle` turns it off without touching the audio.

## 9. DATA

`src/data/episodes.ts` holds the type `Episode` and the episode data: id, number, voice, seed, planet variant, lead colour, context, and the scenes hook, core, add1, add2 and closer. Each scene holds narration, an optional key point, optional on screen text and an optional highlight. The closer falls back to the sign off: "Beyond the sky, the story is only beginning."

## 10. COMMANDS

```bash
npm install
npm run sfx                # synthesise the sound effects
npm run voiceover          # all episodes, or: npm run voiceover -- --episode=ep03
npm run validate:audio     # fails when a voiceover file is missing or too long
npm run dev                # studio on port 3111, turn on showSafeZoneGuide
npm run render             # renders ep01 to out/ep01.mp4
npm run render:all         # renders every episode
npm test
npm run typecheck
```

On Windows, copy the environment template with `Copy-Item .env.example .env`. Port 3111 is used because port 3000 is taken on this machine.

## 11. FINAL PRINCIPLE

Reveal one cosmic idea at a time, with patience, clarity and wonder. The viewer should feel small in scale, not small in importance.
