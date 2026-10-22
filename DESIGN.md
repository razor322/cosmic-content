# DESIGN.md

Direction for CosmicIntro. Transcribed from the project brief in `AGENTS.md`, not invented. The brief owns the palette, the type rules, the safe zones, and the anti-pattern list. This file records the reading of that brief and the one deliberate choice inside it.

## Design read

Reading this as: a 30 second cinematic reel for a general Instagram audience, in a luminous indigo and purple cinematic language, dial ENERGY 2 / RHYTHM 2 / MOTION 3.

ENERGY 2 because the piece has to feel expansive and calm, not loud. RHYTHM 2 because each of the five scenes has its own composition (empty field, drifting clouds, single planet, radial speed, converging light) while the palette and the camera stay continuous. MOTION 3 because this is a video: the motion carries the story, and every scene is a camera move rather than a set of decorative loops.

## Palette

Seven tokens, defined once in `src/data/theme.ts`.

| Token | Hex | Role |
| --- | --- | --- |
| cosmicIndigo | #443199 | Primary. Spatial depth, the Void field |
| nebulaPurple | #792CA2 | Secondary. Nebula and atmospheric forms |
| stellarMagenta | #C13383 | Accent A. Nebula highlights, planet reflection |
| solarCoral | #E05454 | Accent B. Sparse warm emphasis |
| deepViolet | #29204F | Shadow and separation. Never a full background |
| lavender | #B8B2FF | Illumination, planet rim light, highlights |
| starlight | #FFF2EC | Text, stars, focal points |

Target balance across the runtime: 35 percent indigo and purple fields, 25 percent supporting depth, 20 percent magenta, 10 percent coral, 10 percent lavender and warm white. Per scene the mix shifts, and no scene carries all seven colors at once.

Reason for the single accent rule: solarCoral is the only warm color in the palette, so one warm note in a cold frame reads as a highlight. Two warm notes read as a mistake. Coral is allowed in the Nebula (one small wisp), in the Warp (one or two streaks), and nowhere else.

## Typography

Display: `Segoe UI Light` at weight 200, with `Segoe UI` and `Helvetica Neue` as fallbacks. Body and subtitle: `Segoe UI` at weight 300 and 400.

Reason for a system stack: the brief forbids external assets, so no font file is downloaded. A light weight at wide tracking reads as cinematic and stays legible on a phone, and the system stack renders identically inside the Remotion browser.

Title: uppercase, 108 px, letter spacing 0.18em, three lines, line height 1.15.
Subtitle: 50 px, weight 300, line height 1.25, max width 840 px, max three lines.

## Layout

Safe zones, from the brief, expressed as ratios of the composition size so a different output size keeps the same layout.

| Edge | Reserved at 1080 by 1920 |
| --- | --- |
| Top | 220 px |
| Bottom | 380 px |
| Left | 60 px |
| Right | 120 px |

The subtitle sits with its lower edge at least 400 px above the bottom edge of the frame, horizontally centred. The main focal object stays inside the 35 to 55 percent band of the frame height.

## Signature

The lavender rim light on the planet, paired with the centre out mask reveal of the title.

Reason: the rim light is the only place in the palette where a cold edge light describes a solid body, so the planet reads as a body and not as a gradient disc. The title reveal uses the same language, the frame opens from the centre outward, so the last beat echoes the middle of the reel instead of arriving as a separate effect.

Everything else stays quiet. One focal point per scene, restrained secondary motion, no bloom stack, no lens flare, no HUD, no glass.

## Per scene direction

| Scene | Dominant | Supporting | Accents | Motion |
| --- | --- | --- | --- | --- |
| Void | cosmicIndigo | deepViolet | starlight, restrained lavender | First star visible on frame 0, gentle twinkle, vignette opens slowly |
| Nebula | nebulaPurple | cosmicIndigo | stellarMagenta, one small solarCoral, lavender | Vertical cloud drift, three parallax star layers, one shooting star near 8 s |
| Planet | cosmicIndigo | nebulaPurple | stellarMagenta, lavender, starlight | Planet rises from below, rim light, very slow rotation, optional ring and moon orbit |
| Warp | cosmicIndigo | nebulaPurple | sparse stellarMagenta, sparse solarCoral, starlight streaks | Radial streaks, speed ramps up then slows, slow zoom, roll within 2 degrees |
| Resolve | cosmicIndigo or nebulaPurple | deepViolet | starlight, lavender, selective magenta or coral | Converging light, one expanding thin ring, title reveals and fades out |

## Motion rules

Every value comes from `useCurrentFrame()` and the composition fps. Interpolation is clamped. Springs are high damping and used only where a physical entrance helps. Camera drift is slow, continuous across the reel, and rolls no further than 2 degrees. No CSS transitions, no keyframes, no timers, no wall clock.

## Measured result

The palette shares below come from the rendered frames, not from the intent above. Each frame was classified to its nearest token, so a blend is counted as the colour it leans towards.

| Scene | cosmicIndigo | nebulaPurple | deepViolet | accent | mean luminance |
| --- | --- | --- | --- | --- | --- |
| Void | 69% | 0% | 31% | lavender rim and stars | 0.21 |
| Nebula | 56% | 34% | 9% | magenta 1% | 0.25 |
| Planet | 85% | 8% | 6% | lavender rim, moon | 0.25 |
| Warp | 51% | 3% | 45% | starlight streaks 2.7% | 0.21 |
| Resolve | 64% | 12% | 23% | starlight title | 0.23 |

No frame drops below 0.19 mean luminance and no pixel in the sampled frames is near black. The focus band, 35 to 55 percent of the frame height, is the brightest region in every scene.

