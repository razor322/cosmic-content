Cosmic Cinematic Reels — Remotion Rules & Project Brief
Paste this file into AGENTS.md, CLAUDE.md, or your AI coding tool as the project-wide brief. It adapts the structure and level of detail of the supplied gybgabyte.dev Reels: Remotion Rules Prompt reference to a procedural cosmic Instagram Reel. The original reference's risograph/editorial aesthetic is not copied; this project has its own cinematic cosmic visual identity.

0. ROLE AND GOAL
You are a senior creative technologist building a reusable Remotion v4 project with TypeScript strict mode.

Goal: create a 30-second, 9:16 Instagram Reel titled CosmicIntro, using procedural visuals, English narration, synchronized subtitles, and calm cinematic motion. The theme is general cosmic wonder—not a specific science topic, franchise, or story.

The composition must be data-driven and reusable. Narration, palette, title, seed, audio levels, subtitle visibility, safe-zone guide, and optional planet ring must be configurable without rewriting scene components.

Visual identity: luminous cosmic cinema: indigo space, purple nebula, magenta stellar clouds, coral accents, lavender light, and warm-white stars. It should feel expansive, elegant, atmospheric, and bright enough to read on a phone. It must not look like a generic dark-mode dashboard, a neon cyberpunk template, or a random particle-background preset.

Working rules
- Do not ask questions when the brief already provides enough information. State any necessary assumption in one short line and proceed.
- Inspect the installed Remotion version and its types/docs before relying on an API. Do not invent APIs.
- Prefer the simplest implementation that satisfies the visual and technical requirements.
- If a feature is uncertain, choose a deterministic, documented fallback and state the limitation.
- Keep the code maintainable: reusable components, explicit props, typed data, and centralized design tokens.
- Do not claim a feature is complete unless it is implemented and tested in the codebase.

1. HARD TECHNICAL CONSTRAINTS
- Main composition ID: CosmicIntro.
- Canvas: 1080 × 1920, 30 fps, 900 frames / 30 seconds.
- Use TypeScript strict mode and React.
- Use <Sequence> for scene and audio timing.
- Use Remotion useCurrentFrame(), useVideoConfig(), interpolate(), and spring() for frame-based motion.
- No external animation libraries. The only additional runtime dependency permitted beyond the Remotion/React toolchain is @remotion/media-utils.
- Do not use Math.random(), Date.now(), setTimeout, setInterval, CSS keyframe animations, CSS transitions, or browser-time-dependent animation. Any random-looking placement must use a deterministic seeded function or Remotion's documented seeded random utility.
- The same input props and frame must always produce the same image.
- Build all visual assets procedurally with React, SVG, Canvas, or CSS. Do not download or embed external images.
- All canvas/SVG dimensions and positions should derive from useVideoConfig() or normalized ratios. Do not scatter hardcoded 1080 and 1920 layout coordinates through scene components. The composition's output dimensions may be declared once in Root.tsx.
- Use H.264 MP4, CRF around 18, with audio included. Confirm actual render options against the installed Remotion CLI.
- Do not add dependencies without an explicit reason and approval.
- Use staticFile() for files stored under public/.
- Avoid expensive per-pixel work at full output resolution. Precompute reusable matrices/data at module scope or with useMemo; render low-resolution procedural textures and scale them up when suitable.
- Make final renders deterministic and test at least one complete render with voiceover and subtitles.

1.1 Timeline
Scene	Time	Frames	Duration
Void	0–4 s	0–120	120
Nebula	4–10 s	120–300	180
Planet	10–17 s	300–510	210
Warp	17–24 s	510–720	210
Resolve	24–30 s	720–900	180

Use 15–20 frame cross-fades. Plan overlaps deliberately so the visible scene durations and narration slots remain coherent. The final composition must still end at frame 900.

2. BRAND DESIGN SYSTEM
2.1 Palette tokens (src/data/theme.ts)
Use a named palette system, not a single gradient treated as the palette. The four brand colors below are the identity colors. Supporting colors are included for shadows, light, and readable typography.

Token	Hex	Role
cosmicIndigo	#443199	Primary brand color; spatial depth and the main Void color
nebulaPurple	#792CA2	Secondary brand color; nebula and atmospheric forms
stellarMagenta	#C13383	Accent A; nebula highlights and selected reflections
solarCoral	#E05454	Accent B; warm stellar accents and selected emphasis
deepViolet	#29204F	Supporting shadow and separation color; avoid using it as the entire video's background
lavender	#B8B2FF	Soft illumination, rim light, and planet highlights
starlight	#FFF2EC	Main text, stars, bright focal points, and title highlights

All palette values must live in src/data/theme.ts. Scene components should consume tokens through typed props or imported theme constants instead of repeatedly writing hex literals.

2.1a Color hierarchy
The four brand colors are not equal in visual weight:
- Primary: cosmicIndigo, nebulaPurple.
- Spot accents: stellarMagenta, solarCoral.
- Lighting and neutral support: lavender, starlight.
- Shadow support: deepViolet.
Default visual balance across the whole video (an art-direction guide, not a pixel-perfect requirement):
- 35% primary indigo and purple fields.
- 25% supporting purple/indigo depth and secondary forms.
- 20% magenta accents and reflections.
- 10% coral accents.
- 10% lavender and warm-white highlights.
The proportions can change per scene. Do not force all colors into every frame. A scene should usually have one dominant color, one supporting color, and no more than two accent colors.

2.1b Scene color assignments
Scene	Dominant	Supporting	Accent / highlight	Intent
Void	cosmicIndigo	deepViolet	starlight, restrained lavender	Calm, immediate hook; not pure black
Nebula	nebulaPurple	cosmicIndigo	stellarMagenta, a little solarCoral, lavender	Color-rich, drifting cosmic clouds
Planet	cosmicIndigo	nebulaPurple	stellarMagenta, lavender, starlight	Planet remains the main focal point
Warp	cosmicIndigo	nebulaPurple	Sparse stellarMagenta and solarCoral; starlight streaks	Speed without a noisy neon tunnel
Resolve	cosmicIndigo or nebulaPurple	deepViolet	starlight, lavender, selective stellarMagenta / solarCoral	Quiet luminous conclusion and title readability

Scene assignments define the hierarchy, not a requirement to render a flat fill. Gradients, layered translucent shapes, and soft lighting may be used when they support depth. They must not erase the palette hierarchy.

2.1c Color modes
Do not rotate between unrelated paper/ink/flood themes. This is a continuous cinematic video, not an editorial zine. Keep one coherent palette across all scenes.

Instead, vary each scene's color emphasis:
1. indigo: cool, spacious, restrained.
2. nebula: purple and magenta become more visible.
3. planet: indigo surface with controlled lavender/magenta light.
4. warp: indigo depth with sparse bright streaks.
5. resolve: warm-white focal light against a rich purple environment.

2.1d Contrast and readability
- Important text must remain legible over the actual rendered frame.
- Use starlight for titles and subtitles when it provides sufficient contrast.
- If a subtitle overlaps a bright nebula or planet, place a subtle transparent darkening layer behind the subtitle region or adjust the local background. Never add a large opaque UI-style box unless a scene explicitly needs it.
- Do not put thin text over high-frequency starfields or detailed planet texture.
- Check contrast on a rendered 1080 × 1920 frame; do not rely only on code inspection.
- solarCoral is an accent, not the default text color.
- Avoid large areas where stellarMagenta and solarCoral are both at maximum saturation and brightness.
- Supporting colors are not permission to introduce additional arbitrary hues. Any new token requires an explicit design-system update.

2.2 Anti-pattern blacklist
Never:
- Use pure black as the dominant color for most of the runtime.
- Make all scenes equally dark or equally saturated.
- Turn the palette into a generic cyan/magenta cyberpunk look.
- Add unrelated rainbow colors.
- Use coral as a full-screen background by default.
- Add excessive neon, glow, bloom, lens flare, chromatic aberration, or particle density.
- Make every object glow; lighting needs a clear focal hierarchy.
- Use generic stock starfield images or external imagery.
- Add glassmorphism, dashboard/HUD overlays, fake technical labels, or unnecessary UI panels.
- Use fast flicker, elastic bounce, or aggressive camera shake.
- Let effects overpower the narration, title, or subtitles.
Soft glow and gradients are permitted because this is a cosmic cinematic style, but they must be restrained, intentional, and consistent with the token palette.

2.3 Typography
- Display/title: a light, elegant sans-serif with generous tracking. Prefer a locally supplied font; a system sans-serif fallback is allowed.
- Subtitle/body: readable sans-serif, regular or light weight. Avoid ultra-thin weights that disappear on mobile.
- Maximum three font families: display, body, and optional monospace only if genuinely required.
- Keep fonts under public/fonts/ when using local font files.
- If a requested font is missing, log a clear warning and use a documented system fallback.
- At 1080 px output width:
  - Main title: approximately 90–130 px, adjusted to fit.
  - Subtitle: approximately 46–52 px.
  - Small supporting text: at least 36 px when it conveys important information.
- Use line-height around 1.1–1.3 for subtitle/body text.
- Title text uses uppercase and moderate-to-wide letter spacing.
- Subtitle is limited to three lines and a maximum width of 840 px.
- Text must remain readable on a phone. Do not reduce font size simply to force an overlong sentence into one line.

2.4 Layout and Instagram Reels safe zones
Reference canvas: 1080 × 1920.

Keep important text within these margins:
- Top: 220 px reserved.
- Bottom: 380 px reserved.
- Left: 60 px reserved.
- Right: 120 px reserved.
Implement safe-zone measurements as ratios of useVideoConfig().width and .height, based on the reference dimensions above. Do not hardcode separate layout systems for alternate output sizes.
- Keep the main visual focal point around 35–55% of frame height where practical.
- Subtitles are horizontally centered and sit above the bottom reserved region, with at least 400 px between their lower edge and the bottom of the frame.
- Title and subtitle must never cross the safe-zone boundaries.
- showSafeZoneGuide: boolean toggles a visible preview overlay. It must default to false for final render.
- Avoid placing essential information under the Instagram account, caption, or action overlays.
- Camera drift must not push text outside the safe region.

3. VISUAL SYSTEM AND REUSABLE COMPONENTS
Build procedural visuals. No external image assets.

3.1 Stars (components/Stars.tsx)
- Generate positions from a deterministic seed.
- Support seed, count, layer, and color/opacity configuration.
- Use several parallax layers with distinct speed and size ranges.
- Twinkle should be subtle and slow; avoid rapid flashing.
- A star should be visible and moving within the first 1.5 seconds.

3.2 Nebula (components/Nebula.tsx or scene-local component)
- Use layered SVG/CSS shapes and palette tokens.
- Purple is dominant; magenta and coral are controlled accents.
- Soft blur is allowed but should not flatten the entire frame.
- Motion is slow, continuous, and frame-driven.
- Do not use a static imported image or stock nebula.

3.3 Planet (components/Planet.tsx)
- Procedurally construct the planet using SVG/CSS layers.
- Use indigo/purple surface colors, lavender rim light, and restrained magenta reflections.
- Planet diameter is approximately 80% of canvas width, scaled using useVideoConfig().
- Add slow rotation or moving surface details without depending on wall-clock time.
- Optional thin ring is controlled by showRing.
- Optional moon orbit must be an ellipse and deterministic.
- Light sweep is subtle and must not obscure the planet's shape.

3.4 Warp (components/Warp.tsx)
- Generate radial streaks from a central vanishing point using seeded values.
- Speed ramps up, peaks, and slows near the end of the scene.
- Use indigo depth and starlight highlights, with sparse magenta/coral streaks.
- Camera roll must remain within ±2 degrees.
- Chromatic aberration is optional and must be limited to the outer edges and peak-speed moment.
- Avoid a generic neon tunnel; retain a spacious cosmic feeling.

3.5 Resolve and title (components/Title.tsx)
- Bring visual elements toward one luminous focal point.
- Use a thin shockwave ring that expands smoothly.
- Title default: BEYOND\nTHE\nSKY.
- Reveal the title using a center-out mask or another deterministic mask reveal.
- Animate opacity and letter spacing slowly; avoid bounce.
- The title must fit within the safe zone and not collide with subtitles.
- Fade to the final frame without a hard cut.

3.6 Particles, vignette, and grain
- Particles are small supporting details, not the focal point.
- Vignette is subtle and must not turn the entire frame nearly black.
- Film grain uses deterministic SVG turbulence or a deterministic procedural texture with low opacity.
- If the grain seed changes per frame, derive it from the current frame and the fixed project seed.
- Do not add per-frame uncontrolled random values.
- Effects must remain inexpensive enough for reliable rendering.

4. DATA MODEL AND CONFIGURATION
4.1 Narration data (src/data/narration.ts)
All narration strings must be stored in one file.

export type NarrationEntry = {
  id: string;
  text: string;
  startFrame: number;
  endFrame: number;
  audioFile: string;
};

export const narration: NarrationEntry[] = [
  {
    id: "void",
    text: "In the beginning, there was only silence.",
    startFrame: 0,
    endFrame: 120,
    audioFile: "scene-1.mp3",
  },
  {
    id: "nebula",
    text: "From drifting clouds of dust and light, stars begin to form.",
    startFrame: 120,
    endFrame: 300,
    audioFile: "scene-2.mp3",
  },
  {
    id: "planet",
    text: "Around them, worlds take shape, each one quietly turning in the dark.",
    startFrame: 300,
    endFrame: 510,
    audioFile: "scene-3.mp3",
  },
  {
    id: "warp",
    text: "And we reach further, crossing distances too vast to measure.",
    startFrame: 510,
    endFrame: 720,
    audioFile: "scene-4.mp3",
  },
  {
    id: "resolve",
    text: "Beyond the sky, the story is only beginning.",
    startFrame: 720,
    endFrame: 900,
    audioFile: "scene-5.mp3",
  },
];
Narration timing is authoritative for the initial version. If a generated voiceover does not fit its assigned slot, report the mismatch and adjust the script/timing deliberately. Do not silently truncate speech.

4.2 Composition props
Expose these props in CosmicIntro:
- title: string
- narration: optionally allow a typed override while keeping the default data in narration.ts
- palette: typed palette override, defaulting to cosmicTheme
- seed: number
- showSubtitle: boolean
- showSafeZoneGuide: boolean
- voice: string (the selected provider voice/config label)
- voiceVolume: number
- ambientVolume: number
- showRing: boolean
Use sensible defaults. Validate volume values within the range 0–1. The selected voice name must match the configured TTS provider; do not imply every provider supports every voice ID.

5. MOTION SYSTEM
5.1 Frame-driven motion
- Every animation derives from useCurrentFrame() and the composition's fps.
- Use interpolate() for controlled value mapping and spring() only when a physical-feeling entrance genuinely helps.
- Use high damping for calm motion. No bouncy or elastic motion.
- Clamp interpolation outside its active range.
- Use a fixed seed for procedural placement. Never use Math.random().
- No CSS transitions, keyframe animations, timers, or wall-clock-dependent motion.

5.2 Easing and camera movement
- Favor smooth ease-in-out motion and carefully controlled springs.
- Camera drift is subtle and applies consistently across the composition.
- Keep camera roll below ±2 degrees.
- Do not animate every element independently at once. Each scene has one primary focal point and a few supporting motions.

5.3 Scene timeline and motion
Scene	Frames	Required motion
Void	0–120	First star visible immediately; small star movements and gentle twinkle; vignette gradually opens
Nebula	120–300	Vertical nebula clouds drift slowly; three starfield parallax layers; small bokeh-like dust; one diagonal shooting star around 8 seconds
Planet	300–510	Large planet rises from below; soft rim light; very slow rotation; optional ring and small elliptical moon orbit; restrained light sweep
Warp	510–720	Radial star streaks; speed ramps up and then slows; slow zoom; small roll; optional edge-only chromatic aberration
Resolve	720–900	Elements converge visually; luminous center; expanding thin shockwave ring; three-line title reveals and fades out

5.4 Cross-fades
- Cross-fades should be approximately 15–20 frames.
- Prevent blank frames at scene boundaries.
- Ensure overlapping scenes do not unintentionally double the brightness or obscure the primary focal point.
- The final composition duration must remain exactly 900 frames.
- Narration slot boundaries must stay aligned to the declared timeline unless the data is intentionally revised.

6. AUDIO: TTS, AMBIENT, AND SUBTITLES
6.1 TTS generation
- Create src/scripts/generate-voiceover.ts.
- Default provider: edge-tts.
- Default voice: en-US-AndrewNeural.
- Default speaking rate: -10%.
- Generate public/voiceover/scene-1.mp3 through scene-5.mp3.
- Support switching providers through one configuration in .env, with API keys stored only in environment variables.
- If OpenAI TTS is implemented, check current model/voice/API support and handle API errors explicitly.
- Do not commit .env or API keys.
- Do not add new runtime dependencies for convenience; script-only dependencies must be clearly separated from the render runtime and approved if they exceed the permitted stack.

6.2 Audio placement and validation
- Place each voiceover using <Sequence from={startFrame}> and <Audio src={staticFile(...)} />.
- Keep audio file paths centralized in narration data.
- Use getAudioDurationInSeconds() from the installed, compatible @remotion/media-utils version to validate each file where supported.
- If an audio file exceeds its scene slot, log a clear warning that includes the scene ID, measured duration, and allowed slot duration.
- Do not pretend duration validation is implemented if the check is not actually connected to the render or preview workflow.
- Missing voiceover files must produce a clear, actionable error.
- Voice volume is configurable and defaults to 1.0.

6.3 Optional ambient track
- Optional file: public/audio/ambient.mp3.
- Ambient volume is configurable and low by default.
- Fade in at the start and fade out at the end using frame-driven volume values.
- If speech ducking is implemented, lower ambient volume during narration and restore it between speech segments.
- Do not claim automatic ducking exists until speech timing and volume automation are actually connected.
- If the ambient file is absent, the composition should still render correctly.

6.4 Subtitle rules
- Subtitle component: src/components/Subtitle.tsx.
- Read from narration.ts; do not duplicate narration strings in the component.
- Subtitle appears approximately 6 frames after the corresponding voiceover starts.
- Fade in and move upward 12 px over 10 frames.
- Fade out during the final 10 frames of its narration slot.
- Maximum width: 840 px; maximum three lines.
- Font size: approximately 46–52 px at 1080 px composition width.
- Soft warm-white text with subtle text shadow; no solid opaque subtitle box.
- A subtle transparent dark backing/gradient is allowed only when needed for readability.
- Keep the subtitle's bottom edge at least 400 px above the bottom of the frame.
- showSubtitle: boolean disables all subtitles.
- Check the actual rendered text wrapping; do not assume a CSS width automatically guarantees three lines.

7. PROJECT STRUCTURE
src/
  Root.tsx
  index.ts
  data/
    narration.ts
    theme.ts
  scenes/
    Void.tsx
    Nebula.tsx
    Planet.tsx
    Warp.tsx
    Resolve.tsx
  components/
    Stars.tsx
    Nebula.tsx
    Planet.tsx
    Warp.tsx
    Title.tsx
    Subtitle.tsx
    Vignette.tsx
    FilmGrain.tsx
    Particles.tsx
    ShootingStar.tsx
    SafeZoneGuide.tsx
    AudioTrack.tsx
  scripts/
    generate-voiceover.ts
public/
  voiceover/
  audio/
  fonts/                 # optional locally supplied font files
out/
AGENTS.md
package.json
tsconfig.json
remotion.config.ts
.env.example
Scene-local components may be used instead of duplicated generic components where that is simpler. Keep the architecture understandable and avoid building abstractions that are not used.

8. ACCEPTANCE CHECKLIST
Do not declare the project production-ready until these checks pass:
1. Composition renders at 1080 × 1920, 30 fps, exactly 900 frames.
2. The project type-checks with TypeScript strict mode.
3. All five scenes render in the correct order with intentional 15–20 frame cross-fades and no blank frames.
4. The first star appears immediately and visibly moves within the first 1.5 seconds.
5. All procedural randomness is seeded; there is no Math.random().
6. The same inputs render deterministically across repeated renders.
7. Only declared palette tokens are used for visual colors; no unapproved color literals are scattered across scene components.
8. The brand palette is visible across the video, but no single accent overwhelms all scenes.
9. The visual is not excessively dark; the Void has visible indigo detail and the Nebula has clear purple/magenta color.
10. Main focal objects stay around the central 35–55% height region where practical.
11. Title and subtitles remain inside the Instagram safe zone.
12. showSafeZoneGuide works in preview and defaults to false for final render.
13. showSubtitle disables subtitles without changing narration audio.
14. TTS generation creates all five expected MP3 files or reports a clear failure.
15. Audio duration validation is actually wired and reports overlong files.
16. Voiceover timing matches scene boundaries; no speech is silently cut off.
17. Optional ambient audio can be absent without breaking the render.
18. showRing, title, seed, palette, voice volume, and subtitle props work.
19. Rendered MP4 includes the expected audio track and plays through the final frame.
20. Run a complete render and review the output visually before declaring delivery complete.

9. DELIVERY ORDER
1. Inspect the project, installed Remotion version, package scripts, and current types/docs.
2. Set up Root.tsx, composition metadata, strict TypeScript, theme.ts, and narration.ts.
3. Implement the seeded procedural visual primitives and safe-zone guide.
4. Implement each scene separately and preview its color hierarchy.
5. Connect the timeline and verify cross-fades and camera drift.
6. Implement TTS generation and confirm the MP3 files exist.
7. Connect audio duration validation, voiceover placement, and optional ambient audio.
8. Implement subtitle timing and safe-zone placement.
9. Render the complete MP4 and inspect scene boundaries, title, text readability, audio sync, and final fade.
10. Run the acceptance checklist. Report what passed, what failed, and what remains incomplete.

10. REQUIRED COMMANDS
Document and verify these commands against the actual project scripts:
npm install
python -m pip install edge-tts
npm run voiceover
npm run dev
npx remotion render src/index.ts CosmicIntro out/cosmic-reels.mp4 --codec=h264 --crf=18
npm run typecheck
On Windows PowerShell, copy the environment template with:
Copy-Item .env.example .env
The exact Remotion render syntax must match the installed CLI. Never report a successful render unless the command actually completed successfully.

11. FINAL DESIGN PRINCIPLE
The goal is not to put every cosmic effect on screen at once. The goal is to make the viewer feel scale, silence, light, motion, and wonder.

Use the four core colors as a consistent brand palette. Use supporting colors only to improve depth, lighting, and readability. Each scene must have one clear focal point, restrained secondary motion, readable typography, and a visual transition that feels intentional.
