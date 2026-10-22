# COSMIC REELS — SEASON 1
## 10-Episode Creative Pack for Remotion

**Format:** Vertical 9:16 · 1080 × 1920 · 30 fps  
**Duration:** Every episode is 45–60 seconds; target runtime: 54 seconds (1,620 frames).  
**Narration:** English · **Visuals:** Procedural SVG/Canvas/CSS · **Motion:** frame-driven Remotion  
**Primary palette:** `#443199`, `#792CA2`, `#C13383`, `#E05454`  
**Supporting palette:** `#29204F`, `#B8B2FF`, `#FFF2EC`

The four primary colors are separate palette tokens, not a mandatory gradient. Use them selectively across nebulae, light, dust, and rim lighting. Keep the look cinematic, calm, grand, and readable—not neon-heavy or game-like.

## Shared production rules

- Use `<Sequence>` for timed scenes and `interpolate()` / `spring()` for frame-driven animation.
- Keep procedural particles deterministic; never use unseeded `Math.random()`.
- Derive canvas dimensions from `useVideoConfig()`.
- Respect safe zones: left 60 px, right 120 px, top 220 px, bottom 380 px.
- Use `#FFF2EC` for readable text and `#B8B2FF` for secondary light.
- Use subtle parallax, restrained vignette, and fine grain. Avoid rapid blinking, excessive flares, and busy HUDs.
- Keep scientific claims accurate; distinguish evidence from speculation.
- Keep title, subtitle, narration, and scene timing in one episode data source.
- At 30 fps: 45 s = 1,350 frames; 54 s = 1,620 frames; 60 s = 1,800 frames.

## Recommended 54-second timing template

| Segment | Time | Purpose |
|---|---:|---|
| Cold open | 0–5 s | Visual hook / question |
| Establish | 5–13 s | Introduce the subject |
| Reveal | 13–25 s | Show the central phenomenon |
| Deepen | 25–38 s | Add context or scale |
| Emotional turn | 38–47 s | Connect idea to perspective |
| Resolve | 47–54 s | Closing line and title |

Adjust timings to the narration. Do not stretch scenes with empty time to hit a duration.

---

# Episode 01 — The First Light
**Theme:** The early universe and the cosmic microwave background  
**Visual motif:** A dark violet void gradually filling with an ancient, softly mottled glow.  
**Palette focus:** `#443199`, `#792CA2`, `#B8B2FF`, `#FFF2EC`

### Narration
> Before there were stars, the universe was hot, dense, and changing rapidly.  
> As space expanded and cooled, the first atoms could finally form.  
> Light that had been scattered by charged particles began traveling freely.  
> That ancient glow still reaches us today, stretched by the expansion of the universe into microwaves.  
> We call it the cosmic microwave background. It is not the first light from every star, but a faint afterglow from the early universe itself.  
> When we study it, we look back toward a time before galaxies, before planets, before the night sky as we know it.  
> The universe left us a beginning we can still measure.

### Scene plan
| Time | Visual | Motion |
|---|---|---|
| 0–5 s | Almost-black violet; a tiny point appears | Gentle light growth, no explosive flash |
| 5–13 s | Luminous haze fills the vertical frame | Soft radial expansion |
| 13–25 s | Haze clears into a fine, mottled pattern | Particles slowly separate |
| 25–38 s | All-sky texture with small label “COSMIC MICROWAVE BACKGROUND” | Gentle parallax |
| 38–47 s | Ancient glow recedes toward a starless horizon | Slow pullback |
| 47–54 s | One thin arc remains | Title: **THE FIRST LIGHT** |

**Sound:** Warm drone, soft shimmer, restrained low swell.  
**Closing line:** “The universe left us a beginning we can still measure.”  
**Transition:** The final point becomes a star-forming cloud.

---

# Episode 02 — Where Stars Are Born
**Theme:** Nebulae and star formation  
**Visual motif:** A layered purple-magenta gas cloud with a brightening protostar.  
**Palette focus:** `#792CA2`, `#C13383`, `#443199`, `#E05454`

### Narration
> Space may look empty, but between the stars are enormous clouds of gas and dust.  
> Inside some of these clouds, gravity gathers material into denser regions. As a region collapses, its center grows hotter and more compact.  
> A young star begins to take shape, surrounded by leftover material from its birth.  
> This is not a spark appearing all at once. It unfolds over immense spans of time through pressure, heat, motion, and gravity.  
> Some young stars launch powerful outflows that carve cavities through their surroundings. Nearby dust catches their light, turning invisible structure into glowing clouds.  
> A nebula is not just a beautiful backdrop. It can be a stellar nursery, where the ingredients of future worlds begin to gather.

### Scene plan
| Time | Visual | Motion |
|---|---|---|
| 0–5 s | A star drifts behind a translucent cloud | Cloud crosses frame; hook: “WHERE DO STARS BEGIN?” |
| 5–13 s | Three nebula layers at different depths | Slow parallax |
| 13–25 s | Dense core forms | Dust converges gradually |
| 25–38 s | Protostar glows; narrow outflows carve the cloud | Controlled bloom, particles move outward |
| 38–47 s | Wide view reveals several bright knots | Slow pullback |
| 47–54 s | One bright knot holds | Title: **WHERE STARS ARE BORN** |

**Sound:** Airy texture, granular shimmer, soft pulse as the core brightens.  
**Closing line:** “A nebula can be a stellar nursery.”  
**Transition:** One young star becomes the light source for Episode 03.

---

# Episode 03 — Worlds in the Making
**Theme:** Planet formation around young stars  
**Visual motif:** A rotating disk of gas and dust around a young star.  
**Palette focus:** `#443199`, `#C13383`, `#E05454`, `#FFF2EC`

### Narration
> A young star rarely forms alone. Around it, a disk of gas and dust can begin to rotate.  
> Tiny grains collide and sometimes stick together. Over time, some grow into larger rocky and icy bodies.  
> Their paths are not perfectly orderly. Collisions can break objects apart, while gravity can pull them together.  
> In the disk, gaps may open as growing planets gather material or reshape nearby orbits.  
> Close to the star, heat changes which materials can remain solid. Farther out, colder regions can preserve different ingredients.  
> The result can be a system of worlds unlike our own, with different sizes, compositions, and orbital patterns.  
> Planet formation takes millions of years, but telescopes can observe young systems at different stages and help us understand how worlds begin.

### Scene plan
| Time | Visual | Motion |
|---|---|---|
| 0–5 s | Star behind a thin angled disk | Coral rim light |
| 5–13 s | Rotating dust rings | Particle bands move at different speeds |
| 13–25 s | Dust clumps emerge | Clustering, no sudden planet pop-in |
| 25–38 s | Larger bodies shape subtle gaps | Slow orbital movement |
| 38–47 s | Pull back to reveal orbital paths | Thin lines appear, then fade |
| 47–54 s | A planet crosses the foreground | Title: **WORLDS IN THE MAKING** |

**Sound:** Rotating texture, very quiet particle ticks, warm swell.  
**Closing line:** “Telescopes let us witness worlds in the making.”  
**Transition:** The foreground planet grows to fill the frame.

---

# Episode 04 — A World of Its Own
**Theme:** Planetary atmospheres, surfaces, and diversity  
**Visual motif:** A large planet rising into frame, thin atmospheric rim, and a moon crossing its silhouette.  
**Palette focus:** `#443199`, `#792CA2`, `#E05454`, `#B8B2FF`

### Narration
> A planet is more than a sphere moving through space. It is a world shaped by its history.  
> Some planets are rocky, with landscapes carved by impacts, volcanoes, wind, or flowing water. Others are giant worlds wrapped in deep atmospheres, with storms that can last for generations.  
> Their colors can reveal clues about clouds, minerals, atmospheric chemistry, or reflected light.  
> A thin atmosphere can scatter a star’s light around a planet’s edge, creating a delicate rim. Moons and rings add another layer to the story, shaped by gravity and collisions.  
> We have explored only a small number of worlds up close, yet every new observation expands the range of environments we know can exist.  
> A planet is not simply a point of light. It is a place with a story.

### Scene plan
| Time | Visual | Motion |
|---|---|---|
| 0–5 s | Planet edge emerges from below | Slow rise, gentle camera roll |
| 5–13 s | Planet fills about 80% of frame width | Procedural surface bands and clouds |
| 13–25 s | Light sweeps over the limb | Smooth rim-light sweep |
| 25–38 s | Moon crosses foreground; optional thin ring | Slow orbital movement |
| 38–47 s | Pull back to show planet in star field | Rim light softens |
| 47–54 s | Planet turns into silhouette | Title: **A WORLD OF ITS OWN** |

**Sound:** Deep ambience, soft airy sweep, subtle orbital whoosh.  
**Closing line:** “Every world has a story written in its light.”  
**Transition:** A reflected star streak becomes a bright line.

---

# Episode 05 — The Strange Gravity of Black Holes
**Theme:** Black holes, event horizons, and gravity  
**Visual motif:** Dark central silhouette, luminous accretion disk, distorted background stars.  
**Palette focus:** `#443199`, `#E05454`, `#FFF2EC`, `#29204F`

### Narration
> Some objects are so compact that, beyond a boundary called the event horizon, not even light can escape to the outside. We call them black holes.  
> They are not cosmic vacuum cleaners roaming the universe. From far away, their gravity behaves like that of any object with the same mass.  
> The remarkable effects appear when matter gets very close. Gas can heat up as it spirals through an accretion disk, shining brightly before crossing the horizon.  
> Gravity can also bend light, making background stars appear distorted around the black hole.  
> We cannot see the event horizon directly, but we can study its surroundings and the motion of nearby matter. These observations turn an invisible boundary into something we can investigate.  
> A black hole is gravity pushed to an extreme.

### Scene plan
| Time | Visual | Motion |
|---|---|---|
| 0–5 s | Star field bends around a dark center | Immediate gravitational-lensing hook |
| 5–13 s | Tilted accretion disk appears | Coral highlights, violet shadows |
| 13–25 s | Disk rotates; arcs show lensing | Slow, legible distortion |
| 25–38 s | Background stars shift around the silhouette | Gentle camera orbit; do not depict a vacuum-cleaner effect |
| 38–47 s | Disk dims, leaving boundary and warped stars | Pull back |
| 47–54 s | Dark center and thin ring remain | Title: **THE STRANGE GRAVITY OF BLACK HOLES** |

**Sound:** Restrained low rumble, metallic shimmer, deep transition at the lensing reveal.  
**Closing line:** “A black hole is gravity pushed to an extreme.”  
**Transition:** The curved disk becomes a path through space.

---

# Episode 06 — The Distance Between Stars
**Theme:** Interstellar distances and the scale of the Milky Way  
**Visual motif:** Star field separates into nearby stars, then pulls back into a spiral-galaxy view.  
**Palette focus:** `#443199`, `#792CA2`, `#B8B2FF`, `#FFF2EC`

### Narration
> The night sky makes stars look close together. Most of that closeness is an illusion of perspective.  
> Between our Sun and the nearest star system lies a distance so large that light itself takes more than four years to cross it. A spacecraft traveling at speeds we can reach today would need far longer.  
> Inside a galaxy, stars are separated by vast stretches of space, even when they belong to the same neighborhood.  
> The Milky Way contains enormous numbers of stars, along with gas, dust, planets, and dark matter. Its spiral shape is easier to imagine from above, but we live inside it, observing from our own small position.  
> Distance changes how we explore: we measure light, track motion, and infer what cannot be visited directly.  
> The stars may share one galaxy, but they do not share one neighborhood.

### Scene plan
| Time | Visual | Motion |
|---|---|---|
| 0–5 s | Dense-looking star field | Pull back; stars separate in parallax |
| 5–13 s | Nearby stars become isolated points | Brief, clean distance markers |
| 13–25 s | Light pulse travels between two systems | No busy speedometer UI |
| 25–38 s | Camera pulls out into a stylized Milky Way | Dust and star clusters define the arms |
| 38–47 s | Camera returns toward one point in the spiral | Pull focus to our local position |
| 47–54 s | Sparse field holds | Title: **THE DISTANCE BETWEEN STARS** |

**Sound:** Spacious drone, soft pulse, no fast whooshes.  
**Closing line:** “The stars may share one galaxy, but not one neighborhood.”  
**Transition:** One distant star becomes Episode 07’s subject.

---

# Episode 07 — The Search for Other Worlds
**Theme:** Exoplanets and detection methods  
**Visual motif:** A planet transits a star; a minimal brightness curve dips and rises.  
**Palette focus:** `#792CA2`, `#C13383`, `#E05454`, `#FFF2EC`

### Narration
> For a long time, planets beyond our solar system were worlds we could only imagine. Today, astronomers have confirmed thousands of exoplanets orbiting distant stars.  
> Many are found through a small, repeating dip in a star’s brightness as a planet crosses in front of it. This is called the transit method.  
> Other planets reveal themselves through the slight wobble they cause in their star’s motion.  
> Each technique gives us a different clue: a planet’s size, its orbit, or sometimes its mass. Finding a planet is only the beginning. Its atmosphere, temperature, and distance from its star help scientists ask what conditions might exist there.  
> A world in a so-called habitable zone is not automatically inhabited. It is simply a place where liquid water could be possible under suitable conditions.  
> The search is not proof that we are alone—or that we are not. It is how we learn what is out there.

### Scene plan
| Time | Visual | Motion |
|---|---|---|
| 0–5 s | Small planet approaches a bright star | Star dims subtly during transit |
| 5–13 s | Transit repeats | Simple label: `TRANSIT` |
| 13–25 s | Brightness curve dips and rises | Clean, phone-readable chart |
| 25–38 s | Star’s slight wobble and orbital path | Subtle movement, not exaggerated |
| 38–47 s | Diverse planet silhouettes around distant stars | Avoid implying they are all known real planets |
| 47–54 s | One planet remains against its star | Title: **THE SEARCH FOR OTHER WORLDS** |

**Sound:** Quiet precise pulses, soft tonal lift at reveal.  
**Closing line:** “The search is how we learn what is out there.”  
**Transition:** A planet’s atmospheric rim leads into Episode 08.

---

# Episode 08 — Could Life Exist Elsewhere?
**Theme:** Astrobiology, habitability, and evidence  
**Visual motif:** Planet at the edge of starlight, icy moon, atmospheric layers, abstract chemical patterns.  
**Palette focus:** `#443199`, `#792CA2`, `#C13383`, `#B8B2FF`

### Narration
> Life as we know it depends on chemistry, energy, and environments where complex processes can continue. On Earth, liquid water plays a central role, but we should not assume every possible form of life must look like life here.  
> Scientists study places where water may exist, such as ancient Martian environments or hidden oceans suspected beneath the icy crusts of some moons.  
> They also examine exoplanet atmospheres for chemical patterns that might be interesting, while checking whether non-living processes could produce the same signals.  
> A promising environment is not the same as a discovery of life. Any claim would need multiple lines of evidence, careful measurements, and independent confirmation.  
> The question is profound, but the search is patient. We are learning which environments can support chemistry—and which clues deserve a closer look.  
> For now, the universe remains full of possibilities and unanswered questions.

### Scene plan
| Time | Visual | Motion |
|---|---|---|
| 0–5 s | Planet horizon with thin atmospheric rim | Slow sunrise |
| 5–13 s | Abstract water-like reflections beneath ice | Non-literal subsurface ocean |
| 13–25 s | Atmospheric layers wrap a planet | Molecule motifs drift, then dissolve |
| 25–38 s | Minimal spectral lines appear | Avoid claiming a specific biosignature |
| 38–47 s | Planet recedes into a field of possible worlds | Preserve uncertainty |
| 47–54 s | One point remains in purple haze | Title: **COULD LIFE EXIST ELSEWHERE?** |

**On-screen text:** `HABITABILITY IS NOT PROOF OF LIFE`  
**Sound:** Contemplative ambience, gentle pulse under spectral reveal.  
**Closing line:** “The universe remains full of possibilities and unanswered questions.”  
**Transition:** The atmospheric glow stretches into Episode 09’s luminous arc.

---

# Episode 09 — The Shape of the Invisible
**Theme:** Dark matter and unseen cosmic structure  
**Visual motif:** Galaxy inside a translucent halo, gravitational lensing, and a faint cosmic web.  
**Palette focus:** `#443199`, `#792CA2`, `#B8B2FF`, `#FFF2EC`

### Narration
> When astronomers measure how galaxies move, the visible stars and gas do not seem to tell the whole story.  
> In many galaxies, objects orbit in ways that suggest there is more mass than we can see directly. The leading explanation is dark matter: matter that does not emit or absorb light in the way ordinary matter does, but whose gravity affects its surroundings.  
> It is not the same as a black hole, and it is not simply empty space.  
> Scientists map its influence by studying galaxy motion, gravitational lensing, and the large-scale structure of the cosmos.  
> Yet its underlying nature remains unknown. We have strong evidence for its gravitational effects, but no confirmed identification of the particle or particles that may make it up.  
> The invisible can still leave measurable traces. Sometimes the shape of the universe is revealed by what its light cannot show us.

### Scene plan
| Time | Visual | Motion |
|---|---|---|
| 0–5 s | Luminous galaxy with faint outer halo | Halo appears gradually |
| 5–13 s | Stars trace curved paths around the galaxy | Thin, temporary orbit lines |
| 13–25 s | Gravitational lensing arcs around a distant object | Subtle background-light distortion |
| 25–38 s | Cosmic web emerges as faint filaments | Soft glowing nodes, no wireframe grid |
| 38–47 s | Visible galaxy fades; inferred halo remains | Emphasize inference, not direct imagery |
| 47–54 s | Filaments converge into a quiet star field | Title: **THE SHAPE OF THE INVISIBLE** |

**On-screen text:** `DARK MATTER` · optional note: `GRAVITY LEAVES CLUES`  
**Sound:** Spacious drone, granular movement, restrained swell.  
**Closing line:** “The invisible can still leave measurable traces.”  
**Transition:** Filaments flow toward Episode 10.

---

# Episode 10 — Beyond the Sky
**Theme:** Observable universe, cosmic horizons, and unanswered questions  
**Visual motif:** Journey from planet to solar system to galaxy to cosmic web, ending in one point of light.  
**Palette focus:** Use all four primary colors selectively; final point uses `#FFF2EC`.

### Narration
> We began with a world beneath a familiar sky.  
> Beyond it lies a solar system, a galaxy, and a universe filled with structures larger than our intuition can easily hold.  
> The observable universe is the region from which light has had time to reach us. Its horizon is not a wall in space; it marks the limit of what we can currently observe.  
> Beyond that horizon, the universe may continue, but we cannot simply look across it and know.  
> New instruments let us detect fainter light, study distant galaxies, and test ideas about how the cosmos changes over time.  
> Every answer sharpens some questions and creates others. We are small observers in a vast universe, yet we can measure ancient light, trace invisible mass, and discover worlds around distant stars.  
> The story is far from finished. Beyond the sky, the next question is waiting.

### Scene plan
| Time | Visual | Motion |
|---|---|---|
| 0–5 s | Begin close to a planet’s horizon | Familiar scale, slow upward drift |
| 5–13 s | Pull back to reveal a star system | Understated orbital paths |
| 13–25 s | Pull back to reveal a spiral galaxy | Solar system becomes a tiny point |
| 25–38 s | Galaxy becomes part of a cosmic-web panorama | Filaments stretch into the distance |
| 38–47 s | Soft horizon-like glow surrounds observable region | No hard wall; gradual falloff |
| 47–54 s | Filaments converge into one point, then fade | Title: **BEYOND THE SKY** |

**On-screen text:** `THE OBSERVABLE UNIVERSE`  
**Sound:** Gradual ambient build, then a gentle release into near-silence.  
**Closing line:** “Beyond the sky, the next question is waiting.”  
**Series loop:** Match the final point to Episode 01’s opening point for a seamless playlist loop.

---

# Data model and implementation notes

A typed data file should keep title, script, scene timings, subtitles, and audio aligned.

```ts
export type CosmicScene = {
  id: string;
  startSeconds: number;
  endSeconds: number;
  visualDescription: string;
  narration: string;
  onScreenText?: string[];
  soundCue?: string;
};

export type CosmicEpisode = {
  id: number;
  slug: string;
  title: string;
  theme: string;
  targetDurationSeconds: number; // 45–60 inclusive
  palette: string[];
  narrationLanguage: "en";
  scenes: CosmicScene[];
  closingLine: string;
};
```

Suggested data files:

```text
src/data/episodes/
  episode-01-first-light.ts
  episode-02-star-nurseries.ts
  episode-03-worlds-in-the-making.ts
  episode-04-world-of-its-own.ts
  episode-05-black-holes.ts
  episode-06-interstellar-distance.ts
  episode-07-exoplanets.ts
  episode-08-life-elsewhere.ts
  episode-09-dark-matter.ts
  episode-10-beyond-the-sky.ts
```

Duration helper:

```ts
export const assertEpisodeDuration = (seconds: number) => {
  if (seconds < 45 || seconds > 60) {
    throw new Error(`Episode duration must be 45–60 seconds; received ${seconds}s.`);
  }
};
```

Use `useVideoConfig()` for the active composition's actual FPS. The 30 fps frame counts in this document are planning values; calculate production frame counts from the configured FPS.

## Recommended composition strategy

- Use one reusable `CosmicEpisode` composition with episode configuration, or create `CosmicEpisode01` through `CosmicEpisode10` sharing the same scene components.
- Set each composition duration from its episode configuration. Recommended target: 54 seconds / 1,620 frames at 30 fps.
- Store narration and subtitle timings together; do not maintain separate hand-edited copies.
- Validate generated voiceover duration against each scene slot. Adjust the script or timing before speeding up speech excessively.
- Final render checks: dimensions, FPS, duration, audio clipping, missing assets, text safe zones, subtitle readability, and color contrast.

## Season-level acceptance checklist

- [ ] Ten distinct episodes, each 45–60 seconds.
- [ ] Vertical 9:16, 1080 × 1920, 30 fps.
- [ ] Each episode has a hook, central reveal, and memorable closing line.
- [ ] Narration and subtitles match and stay synchronized.
- [ ] Scientific uncertainty is not presented as settled fact.
- [ ] Primary palette is used selectively rather than forced into every frame.
- [ ] Procedural visuals are deterministic and require no external image assets.
- [ ] Text stays inside safe zones and remains readable on a phone.
- [ ] Ambient audio sits below narration; transitions do not clip or overpower the voice.
- [ ] Episode 10 can loop visually into Episode 01 if desired.

## Recommended production order

1. Build shared primitives: star field, nebula layers, planet, orbit, gravitational lensing, cosmic web, title, subtitles, grain.
2. Make a low-resolution animatic for all ten episodes before polishing any single episode.
3. Generate voiceover and validate duration; adjust scene timing where needed.
4. Polish Episode 01 and lock typography, safe zones, grain, and audio levels.
5. Reuse the approved visual system across Episodes 02–10, with one distinctive motif per episode.
6. Render final outputs and inspect them at phone size.

**Creative north star:** Make viewers feel small in scale, not small in importance. Reveal one cosmic idea at a time—with patience, clarity, and wonder.
