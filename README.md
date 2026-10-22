# cosmic-content

Remotion project for the `CosmicIntro` reel: a 30 second, 1080 x 1920, 30 fps Instagram Reel built from procedural visuals, English voiceover, and synchronized subtitles.

## Stack

Remotion 4, React 19, TypeScript strict, Node built in test runner. No animation library, no external image, font, or audio asset.

## Commands

```bash
npm install
npm test                 # unit tests for the logic layer
npm run typecheck
npm run dev              # Remotion Studio on port 3111
python -m pip install edge-tts
npm run voiceover        # writes public/voiceover/scene-1..5.mp3
npm run validate:audio   # fails when a voiceover file is missing
npm run render           # validates the audio, then renders out/cosmic-reels.mp4
```

## Layout

- `AGENTS.md` is the project brief, the source of truth.
- `DESIGN.md` holds the direction, the dials, and the reason behind each major decision.
- `src/lib/` is the tested logic: timeline, safe zone, seeded placement, subtitle timing, audio checks.
- `src/components/` and `src/scenes/` only render.
- `docs/superpowers/plans/` holds the implementation plan.
