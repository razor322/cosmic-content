# cosmic-content

Remotion project for a series of short, educational cosmic videos in the Instagram Reels format. One composition, `CosmicEpisode`, rendered per episode from `src/data/episodes.ts`.

## Format

1080 by 1920, 30 fps, 1080 frames (36 seconds) per episode. Six episodes, `ep01` to `ep06`, each with its own voice, seed, planet variant and lead colour.

## Stack

Remotion 4, React 19, TypeScript strict, Node built in test runner. No animation library, no external image, font or audio asset: the visuals are procedural, the fonts are loaded from `public/fonts` and the sound is synthesised by code.

## Commands

```bash
npm install
npm test                 # unit tests for the logic layer
npm run typecheck
npm run dev              # Remotion Studio on port 3111
python -m pip install edge-tts
npm run sfx              # writes public/audio/{hit,whoosh,ambient}.wav
npm run voiceover        # all episodes, or: npm run voiceover -- --episode=ep03
npm run validate:audio   # fails when a voiceover file is missing or too long
npm run render           # renders ep01 to out/ep01.mp4
npm run render:all       # renders every episode
```

## Layout

- `AGENTS.md` is the project brief, the source of truth.
- `DESIGN.md` holds the direction, the dials and the reason behind each major decision.
- `src/theme/palette.ts` holds the only colour literals in the project.
- `src/lib/` is the tested logic: timeline, safe zone, seeded placement, subtitle timing, audio checks, gradients.
- `src/components/` and `src/scenes/` only render.
- `src/scripts/` generates the voiceover and the sound effects.
- `tools/qa-frames.py` measures a rendered frame against the palette rules.
