# DESIGN.md

Direction for the `CosmicEpisode` series. The brief in `AGENTS.md` owns the palette, the type rules, the safe zones and the retention rules. This file records the reading of that brief and the decisions taken inside it.

## Design read

Reading this as: a thirty second cosmic explainer for a general phone audience, in a luminous indigo and purple cinematic language, dial ENERGY 2 / RHYTHM 2 / MOTION 3.

ENERGY 2 because the piece has to feel expansive and calm, not loud. RHYTHM 2 because the five scenes each have their own composition (empty field, opening cloud, one object, radial speed, converging light) while the palette and the camera stay continuous. MOTION 3 because this is a video: the motion carries the story, and every scene is a camera move rather than a set of decorative loops.

## Palette

Six tokens, defined once in `src/theme/palette.ts`.

| Token | Hex | Role |
| --- | --- | --- |
| space.base | #0A0618 | The space itself, the base of every frame |
| cosmic.indigo | #443199 | Spatial depth, the Void and the warp |
| nebula.purple | #792CA2 | The core cloud, the body of the object |
| stellar.magenta | #C13383 | Accent A, the nebula highlights and the hot edge of the warp |
| solar.coral | #E05454 | Accent B, the single focal element |
| star.white | #F6F1FF | Text, stars, the focal light |

Reason for the accent rule: solar coral is the only warm colour in the palette, so one warm note in a cold frame reads as a highlight. Two warm notes read as a mistake. The hook spends its one coral element on the highlighted word, the warp spends its one on the centre glow, and the closer spends its one on the light point and the shockwave.

## Typography

Display: `Trvocal Calm` (Regular), loaded from `public/fonts/trvocal-calm`. Body and subtitle: `Jost` (Light, Regular, Medium, SemiBold), loaded from `public/fonts/futura 100/Jost/static`. Jost fills the Futura 100 role the brief asks for.

Reason for a local font stack: the brief forbids external assets, so no font file is downloaded, and the fallback is a named system stack rather than a silent substitution.

Title and hook: uppercase, 108 to 140 px, wide tracking. Subtitle: 46 to 52 px, weight 300, max 840 px wide, max three lines.

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

The hook text in a light display face with one coral word, and the closing title that opens from the middle outwards.

Reason: the hook has three seconds to win the viewer, so it carries the only large type of the episode and the only warm colour. The closing title uses the same gesture as the hook, reversed, so the reel ends the way it began.

## Per scene direction

| Scene | Dominant | Supporting | Accents | Motion |
| --- | --- | --- | --- | --- |
| Hook | space.base | cosmic.indigo | star.white stars, one coral word | First star visible on frame zero, the starfield decelerates over sixty frames, the hook settles from scale 1.04 |
| Core | cosmic.indigo | nebula.purple | star.white dust | The cloud opens out of the centre, particles spiral inward, the context tag leaves after two seconds |
| Extra 1 | nebula.purple | cosmic.indigo | stellar.magenta band | The object fills the frame, its surface band rotates slowly, the companion body crosses on an ellipse |
| Extra 2 | stellar.magenta | cosmic.indigo | star.white streaks, one coral centre | Radial streaks, speed ramps up then slows, the edge carries a colour split, roll stays under two degrees |
| Closer | space.base | cosmic.indigo | one coral light point, star.white title | Everything collapses into the point, the ring expands, the title opens from the middle, the last five seconds return to the opening starfield |

## Motion rules

Every value comes from `useCurrentFrame()` and the composition fps. Interpolation is clamped. Springs are high damping and used only where a physical entrance helps. Camera drift is slow, continuous across the reel, and rolls no further than 2 degrees. No CSS transitions, no keyframes, no timers, no wall clock.

The loop is the reason the starfield drift is computed in `src/lib/loopMotion.ts`: the hook drift is a spring that starts fast, and the closing drift is the same spring played backwards, so the last frame sits on the state of the first frame at the same speed.

## Measured result

Measured with `tools/qa-frames.py` on the rendered frames of `ep01`. Each pixel is assigned to a token family by hue, value and saturation, so a blend of two tokens counts as a mixture and not as one of them.

| Scene | space.base | indigo and purple | magenta | coral |
| --- | --- | --- | --- | --- |
| Hook | 64% | 34% | 0.1% | 0.5% |
| Core | 66% | 33% | 0% | 0% |
| Extra 1 | 63% | 26% | 10% | 0% |
| Extra 2 | 66% | 22% | 8% | 0% |
| Closer | 63% | 34% | 3% | 0% |

The base and the indigo share cannot both sit inside their bands in the base led scenes. A hook that is base plus white stars plus one coral word has almost no magenta or purple area to absorb the rest of the frame, so the indigo share sits a few points above its target there. The measured coral share stays at or below half a percent everywhere, and the subtitle contrast measures 18 to 1 against the 4.5 to 1 the brief asks for.
