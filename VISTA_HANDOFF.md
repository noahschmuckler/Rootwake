# The Vista: graphics study (V0)

Branch `feat/vista`, entry `vista.html` → `src/vista.ts`. Live (once the workflow has run): https://noahschmuckler.github.io/Rootwake/vista/

**The question:** how far can the look go in a phone's browser, with no install? The art direction is Breath of the Wild (the designer's choice, 2026-10-13): believable terrain, painterly shading, aerial perspective. Hulda walks it on the shared player and mobility, with powered legs on, so a double tap and hold of the stick lifts her for the view.

## What is built

- **Land** (`vistaTerrain.ts`, no Three.js, node-tested). A 2048 m map (513² samples, 4 m cells) holds a winding north–south valley with a lake and ridged mountains past the 300 m snow line. 70,000 droplets of hydraulic erosion carve gullies and alluvial fans. From that come three maps: water flow (wet gullies, stream beds), sediment (scree) and cavity AO. Erosion fades out over the outer 200 m, so the map's edge matches the unaroded `shape`.
  - The far ring samples that shape out to 7 km, so the horizon is mountains all round.
  - `bakeSun` marches the heightfield toward the hour's sun, giving the long shadows mountains cast across the valley. It rebakes on every hour change, about 120 ms on desktop.
  - Trees, rocks and four **postcards** come from the land itself: Lakeshore, Valley meadow, Ridge over the lake and Summit. Every postcard is checked to be standable by the shared motor.
- **Shaders** (`vistaShaders.ts`). One GLSL atmosphere is shared by every surface: sun, sky gradient, haze integrated along the view ray and coloured by the sky toward the view, and a cel terminator with blue sky-lit shade.
  - Terrain colour is procedural, with no texture downloads:
    - grass by noise and wetness;
    - rock with strata on steep ground;
    - scree where sediment settled;
    - sand at the shore;
    - snow up high.
  - Shadows from the shared shadow map are folded into the baked sun visibility.
- **Scene** (`vistaWorld.ts`):
  - **Terrain:** 16×16 tiles of 128 m with four LODs by distance and skirts. The far ring is an 80 m grid.
  - **Lake:** depth from the height texture, Fresnel sky reflection, a sun glint and shoreline foam.
  - **Grass:** instanced tufts of three blades on a patch that wraps around the camera. Each blade takes its colour from the ground under it, bends in the wind, and a passing gust silvers the tips.
  - **Trees:** five kinds, three broadleaf and two conifer. Near trees have soft spherized lumps; far ones are a single blob. Only trees inside the shadow box cast shadows, through copies on `CASTER_LAYER`.
  - **Rocks:** flat-shaded, mossy on top, culled past 650 m.
  - **Sky:** painted cumulus.
- **Entry** (`vista.ts`):
  - Post-processing: half-float MSAA target → bloom (threshold 2.4, so only the sun, the sky's glow and glints bloom) → ACES → saturation and vignette grade.
  - Hulda's sun dims while she stands in a mountain's baked shadow.
  - **Dynamic render scale** moves within the tier's range toward 28–50 fps.
  - The HUD shows fps, frame ms, render scale, triangles and draw calls.

## Controls and URL flags

| Button | Does |
|---|---|
| ☀ | Cycle the hour: Morning, Midday, Golden hour, Dusk. |
| ▣ | Go to the next postcard. |
| Q | Cycle the tier: Low, Medium, High. Phones default to Medium, desktops to High. |
| ◎ | Photo mode. A tap brings the controls back. |
| 3rd/1st | Third or first person. |

URL flags: `?hour=0..3`, `?card=0..3`, `?q=low|medium|high`, `?dpr=` (a fixed render scale), `?photo=1`, `?intro=0`, `?seed=`.

## Tiers (tuning in `QUALITIES`)

| Tier | Grass tufts (patch) | Shadow map | Full-tree radius | Bloom | Render scale |
|---|---|---|---|---|---|
| Low | 9k (44 m) | off | 110 m | off | 0.6–1.0 |
| Medium | 22k (58 m) | 1024, ±38 m | 170 m | on | 0.7–1.35 |
| High | 42k (76 m) | 2048, ±60 m | 240 m | on | 0.8–2.0 |

Measured headless at the meadow at midday: about 0.45M triangles and 170 draw calls on Low, about 0.9M and 270 on Medium (the shadow pass included). SwiftShader frame times say nothing about a phone. **The phone readout is the measurement this study exists for.**

## Load cost

On desktop node: land 1.2 s (shape 0.2 s, erosion 0.75 s, AO 0.2 s), trees and rocks 0.05 s, sun bake 0.12 s. Expect roughly 3–4× that on a phone. If it is too slow:
1. Move generation into a worker.
2. Or bake `land` at build time into a ~2 MB binary.

## Known weaknesses (next candidates)

- **Coarse near terrain.** Near terrain is the 4 m grid itself. Snowy summits read as faceted pyramids, and crests are angular up close. Fix with a finer near LOD that adds detail noise, matched in `heightAt`.
- **Hulda is still the X Bot mannequin with leaves.** In a lit painterly world she reads as a placeholder. Characters are the biggest asset gap noted in the assessment.
- **Lakeshore grass is sparse.** The sand and sediment bands thin it.
- **Water is sky-only.** It reflects no mountains (no planar reflection, by design for cost).
- **No rivers or waterfalls.** The flow map knows where they would run.
- **No WebGPU path yet.** Still Three r169 on WebGL2; `WebGPURenderer` and compute grass are the next step up.

## Checks

- `node scripts/test-vista.mjs`: the land is a valley, determinism, the seam at the edge, erosion channels, the sun bake, placement, standable postcards.
- `npm run build`.
- `node scripts/browser-vista.mjs`: SwiftShader. No console or shader errors at every postcard × hour; screenshots land in `artifacts/vista/`.
- `.github/workflows/deploy-vista.yml` runs all of these on push to `feat/vista` and publishes to `/Rootwake/vista/` only.

# V1: the village in the vista

`/vista/village/` (entry `village-vista.html`, or `?look=vista` on the village) runs **the village unchanged** under the vista's look. The designer's call (2026-10-13) was to keep the layout: every place, rule, figure and save is the village's own. Only the land and the light change. Everything lives in `src/villageVista.ts`, plus small hooks:

- `village.ts`: the `LOOK` switch, the land, `look.frame` and `look.render` at the end of the frame, and refreshes on blight and new huts.
- `chunkWorld.ts`: `setLook` and `treesOf`.
- `villageWorld.ts`: its tree meshes are named.

## What it does

- **Land.** `villageLand` wraps the village's own `createTerrain`: the same gentle hills inside, with eroded mountains rising past the farthest place. "Farthest" is measured over every den, ruin, warren, wallow, moot, village and convergence, plus `MOUNTAIN_CLEAR` (260 m), using a rounded-square norm because the dens lie on a square grid.
  - The result is one `Terrain`. Every height the game reads (relief, feet, figures, dens) comes from it, and the vista draws exactly that surface. The near mesh samples the village's 2 m triangulated relief at half a cell (3.4 m).
  - Only the mountain belt erodes, gets AO and records stream beds. The map is 7 km at 1025² (6.9 m cells).
- **Trees.** Every chunk tree, built or not (`chunks.treesOf`), plus each village's own wood, is drawn as the vista's instanced trees:
  - kind 5 is sized as `flora.treeParts` at size 1, so her trunk climb and crown points meet it;
  - kind 6 is the dark forest's tree;
  - kind 7 is blighted, redrawn when the blight moves.

  The chunks keep their trees' colliders, roots and climbing, and draw neither ground nor trees.
- **Ground tint.** `groundTint` lays colours over the vista's grass: the meadows lush (whatever pale patch of the grass noise they fall in), the woods mossy, the dark forest and the blight near black.
- **Clearings.** Grass gives way where the village stands. Each village root is drawn from above into a mask (`CLEAR_SIDE` 220 m, 512²), redrawn when a hut is built.
  - Grass is `BLADE_H` 0.22 m tall, so hobbits stand above it.
  - Blades stand on a fine 96 m window of the exact relief.
- **The clock's sky.** `hourAtClock` blends seven keys across the village's day. The sun rises in the east at 05:30 and sets in the west at 19:30, then the moon and stars take over.
  - Mountain shadows rebake a few rows a frame into a back buffer while the sun moves, at half resolution on this map.
  - Hulda, the hobbits and the houses take the same sun, which dims in a mountain's shadow, plus the near shadow map and fog of the hour's horizon.
- **Kept behaviours.**
  - The view through soil during root travel (the vista terrain thins to glass around her).
  - The dark forest's gloom (`uGloom`).
  - Interiors (the deep, a den, the karst's cavern) hide the land and keep the village's own dark fog.
- **Cost readout.** `?hud=1` shows frame rate, triangles and draw calls; `?q=` picks the tier.

## Known gaps (next)

- **Load time.** About 2 s on desktop (shape 0.6 s, erosion 0.9 s, AO 0.6 s); expect 5–7 s on a phone. Move it to a worker, or bake the land at build time.
- **The karst's forest and plants** are still the free-flow study's standees.
- **The village's paths and green** are still its own decals, not painted into the ground.
- **No rocks** in the village land yet.
- **Mountains are scenery:** they are walkable but nothing is placed in them.
- **Cost at the green, at noon (headless).** Low: about 0.62M triangles. Medium: about 0.86M (vista trees about 0.25M within `TREE_REACH` 850 m, the land and grass about 0.3M, the village's own figures and houses about 0.3M).
- **Draw calls are about 750.** Most are the village's own scene (its figures, houses and chunk groups), which predates the look. Batching them is the next win if a phone struggles.

## Checks

- `node scripts/test-village.mjs` and `node scripts/test-world.mjs` (unchanged mechanics).
- `node scripts/browser-village.mjs`: passes against the default look. Under the vista look (with `dist/village-vista.html` copied over `dist/village.html`), it stops at the gathering check, because SwiftShader draws the heavier scene at about 2 fps and the village's clamped frame time slows its clock. Given more time she gathers 8 berries, so the mechanic holds; the test's timing is SwiftShader's.
- `node scripts/browser-village-vista.mjs`: the land drawn, the chunks' ground and trees not, mountains in `relief`, the sky following the clock, the cost readout, no shader errors; screenshots in `artifacts/village-vista/`.

## V1.1: finishing pass (after the first phone readout, 2026-10-14)

The phone read about 60 fps on the ground and fell into the 30s, at worst 19, on the karst. That view drew about 1.1M triangles in up to 551 calls.

- **Grass only near the ground.** No blades are drawn once the camera is more than `GRASS_CEILING` (14 m) above the land under it. On the summit this was 330k triangles nobody could see.
- **Trails painted into the land.** The village's worn paths and green (named `worn-*`) are no longer flat overlays. The clearing mask now has two channels: R is anything built (no grass), G is the paths and the green. The land paints G as trodden earth, lighter down the middle with ragged grassy edges, and redraws it when a hut is built.
- **The karst's trees in the vista style.**
  - Its broadleaves (kind 5) and maples (new kind 8, warm orange) are placed with the free flow's own `nodeFrame`, so the trees leaning on the pillar faces lean, and the trunk climb meets the crown.
  - Its pines become the vista conifer (kind 3 at 0.38 × size).
  - Ferns stay the karst's own.
  - Its `karst-wood` and `karst-leaves-*` meshes are hidden; they keep their colliders and their part in the free flow.
- **Lighter woods.**
  - The village tree has 5 larger lumps instead of 7–9.
  - Full crowns are drawn within 35% of the tier's radius (`NEAR_TREES`).
  - Shadow-casting copies only within 1.25 × the shadow box plus 8 m.
  - Together these took the karst foot from 1.2M to about 0.94M triangles.
- **Forest colour.** The village's kinds (`VARIED`) vary in warmer and cooler groves, with the odd tree already turning, so a wood seen from the karst is not one green.
- **Rocks.** About 900 small boulders, knee-high at most, in the woods away from every place, and 900 large ones on the foothills (`villageRocks`).
- **Readout.** `?hud=1` now sits at the bottom centre, clear of the village's panels.

Still open: the load (land generation on the main thread, 5–7 s on a phone) and the draw-call count of the village's and karst's own scenes.
