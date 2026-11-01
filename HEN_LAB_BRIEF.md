# Brief: the hen-of-the-woods lab (model, rig and behaviours)

For a fresh session (Opus 5.5 or Fable 5.1) that sets up an isolated lab page for this one creature, as `LAB.md` did for the rust monster.
Design: **`ECOLOGY.md`**, "The hen's life". Pictures: **`design/reference/hen-of-the-woods/`** (read its README). Written 2026-11-01,
branch `docs/vision`. Nothing here is built yet.

## Where the current model is

The in-game model (stacked cone tiers with two black dots for eyes; see `game-model-current-*.jpg`) is **not on this docs branch** in a
form I could find by search. Find it on the branch Noah is playing (the village build) before replacing it.

## What to build

1. **A lab page** that shows one hen on a plain ground with a trunk beside it, with buttons for each state and a slider for fatness.
   Judge it at a phone's portrait aspect.
2. **One body, two forms.**
   - **Walking:** a round, fluffed rosette. Tiers are rings of overlapping lobes, spreading evenly all the way round.
   - **Attached:** every lobe rotates about the vertical axis toward the creature's front, leaving a flat, rough, bark-textured
     **back face** bare; the creature backs onto the trunk with that face against it and the tiers fanning outward from the tree.
     (Reference: `backing-onto-tree-best.jpg`.) The back is a fixed side.
3. **Fatness 0 to 1** read from the silhouette alone: lean (few thin tiers, long thin legs, tall), middle, fat (broad, round,
   short legs), and the heaviest (too heavy to walk). Reference: `life-stages-four.jpg`. Speed falls as fatness rises.
4. **Face:** two glossy black eyes on thin curved stalks from the top, each able to droop, lean back or flare; pale stubby mushroom-stem
   legs; no beak, no feathers, no shell.
5. **Colourways** (a few: sulphur-orange with yellow edges, grey-brown ruffled hen, turkey-tail bands) as a tint parameter, not new models.

## States and animations

wander (a waddle, side-to-side sway, eyestalks lagging) · graze (head tipped forward, eating a grass tuft) · approach a budded tree base
· **swivel and attach** (turn, back on, tiers swing round, legs fold) · rest attached · **absorb the bud** (threads join, the bud melts into
the back face, fatness steps up) · **tear free** (bark and wood splinters, mycelium threads, a pale wound left on the trunk) · **fluff**
(tiers spring back to round, a burst of spores) · **stunned** (a harvester rips out the meaty centre; the hen rolls like a ball, lies on its
back with its legs waving, rocks and rights itself, hollow and irritated, fatness reset).

## Rules for the sim (from `ECOLOGY.md`)

- A hen has a fatness value; the meat a harvest can take is its fatness; a harvest sets it to lean and stuns it.
- Each attachment to a *budded* base absorbs the bud and raises fatness a step; the patch it leaves seals and slowly regrows a bud.
- The count of hens equals the count of bud sites, so nothing runs away. Population is static or scripted.
- Open questions (bud as food, how many attachments to full, what fire does, stun cost) are listed at the end of `ECOLOGY.md`.

## Conventions

Follow `CLAUDE.md`: small commits, `npm run build` green, record decisions in the docs as you go. Use the existing cel-shading and outline
look so the hen belongs in the world (`vistaShaders.ts`). Test at portrait phone size with the headless Chromium notes in `CLAUDE.md`.
