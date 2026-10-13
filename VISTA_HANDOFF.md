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
