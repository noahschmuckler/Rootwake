# Hulda: style sheet (v1, 2026-10-14)

The look is chosen (Noah, from Midjourney and ChatGPT concepts): `turnaround-v1.png` (front, side, back in an A-pose, flat light) and `concept-v1.png` (the mood). She is a tall, strong, dark-skinned forest spirit, amazonian among the hobbits, after Breath of the Wild's cel-shaded style.

## Silhouette: what must read at 60–80 px tall on a phone
1. **The copper braid.** One very long, thick braid of vines down her back to the knees, with loose vine tendrils and small leaves round the face and shoulders. This is her signature shape from behind, which is how the camera mostly sees her.
2. **The leaf skirt.** Knee-length layers of pointed leaves, ragged at the hem, longer at the back. It is the widest shape on her and reads as a triangle.
3. **The birch limbs.** Cream bark sleeves from elbow to wrist and greaves from knee to ankle, wrapped crosswise with thin vines. These give four pale bars against the dark skin.
4. **The violet sash.** At the waist, its tails hanging at the left hip with lavender sprigs and two wooden leaf charms. It is the one cool accent.

Smaller details are optional at game scale: the leaf-strap bodice, pointed ears, white blossoms in the hair, root-veined bare feet, armlets of vine.

## Palette (sampled from the turnaround; sRGB)
| Part | Base | Shade | Light |
|---|---|---|---|
| Skin | `#6e4426` | `#4a2a17` | `#9a6a45` |
| Hair (copper vines) | `#9d3911` | `#572015` | `#d4652a` |
| Leaves, skirt and bodice | `#717e49` | `#4a5b31` | `#b0a258` |
| Moss and vine wraps | `#88801d` | `#5c5a18` | `#c1a930` |
| Birch bark | `#d2cea1` | `#9f9a78` | `#ece8cc`, flecks `#2d3523` |
| Sash | `#6f4888` | `#4f385b` | `#976da0` |
| Blossoms | `#f4efe0` | — | — |

## Proportions
- Adult, athletic and broad-shouldered, about 7.5 heads tall.
- Against the hobbits she should stand roughly 1.5–2× their height. This is an open question for the game: her traversal capsule is 0.72 m; the visual scale can grow without changing the capsule, but the camera and the crowns would want a look.

## Build plan (see the chat of 2026-10-14)
- **The body:** image-to-3D or a free rigged base, from a plain-body turnaround in the same proportions. Auto-rigged on Mixamo's skeleton, so the clips already in `public/models/clips` drive it. Then dropped in at `public/models/hulda.glb`.
- **Hair, leaves and bark:** built in code on that body, sharing the world's leaf and bark materials and the vista's cel shading, so they can fold into her burl, knot, leaf and ivy forms.
- **The braid:** a chain of a few segments that sways with her gait (spring physics), not a sculpted mass.
- **Budget:** about 10–15k triangles in all, two or three materials.
