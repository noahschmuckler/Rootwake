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
2. **A pale creature in a dress.** The body is a small pale creature with a bare white bottom, lanky legs and two eyestalks. The brackets are
   **a gown of many tiers and tresses** worn over it (the dress is the woody part; the body inside is the meat).
   - **Walking:** the dress is fluffed and round, evenly spread all the way round.
   - **Attaching:** it approaches a budded tree base, **hoists the gown** to show a bare white bottom, **backs up and sits against the
     trunk,** the dress's folds bunched up behind it around its neck and the tiers spilling down in front. (Reference:
     `backing-onto-tree-best.jpg`.) While sitting, **new tresses grow and the body thickens.**
   - **Harvested:** the meat is pulled from beneath, the eyestalks yoink in, and the dress lies **flat and splayed with no occupant.**
     Then two eyestalks pop up from the middle, and the occupant **springs out on stilt legs wearing a miniskirt of a few small
     brackets.**
   - **Recovery:** it runs to the nearest budded tree, flips its skirt up for a moment, sits against the tree, and its eyestalks bob in relief.
   - Comedy is the point: keep it cartoonish and gentle.
3. **Fatness 0 to 1** read from the silhouette alone: lean (few thin tiers, long thin legs, tall), middle, fat (broad, round,
   short legs), and the heaviest (too heavy to walk). Reference: `life-stages-four.jpg`. Speed falls as fatness rises.
4. **Face:** two glossy black eyes on thin curved stalks from the top, each able to droop, lean back or flare; pale stubby mushroom-stem
   legs; no beak, no feathers, no shell.
5. **Colourways** (a few: sulphur-orange with yellow edges, grey-brown ruffled hen, turkey-tail bands) as a tint parameter, not new models.

## States and animations

wander (a waddle, side-to-side sway, eyestalks lagging) · graze (head tipped forward, eating a grass tuft) · approach a budded tree base
· **hoist the gown and sit** (turn, back on, skirt lifted then bunched behind, legs fold) · rest attached · **absorb the bud** (threads join, the bud melts into
the back face, fatness steps up) · **tear free** (bark and wood splinters, mycelium threads, a pale wound left on the trunk) · **fluff**
(tiers spring back to round, a burst of spores) · **harvested** (the meat is pulled out from beneath; the dress collapses flat and splayed, the eyestalks pop up, the occupant springs out on stilt legs in a miniskirt, runs to a budded tree, flips its skirt and sits, fatness reset). **Rig hint:** the tiers are stacked rings on a spine or pelvis chain; the hoist and the bunching are lifting and rotating rings upward and back; the flat dress is every ring dropped and splayed on the ground.

## Rules for the sim (from `ECOLOGY.md`)

- A hen has a fatness value; the meat a harvest can take is its fatness; a harvest sets it to lean and stuns it.
- Each attachment to a *budded* base absorbs the bud and raises fatness a step; the patch it leaves seals and slowly regrows a bud.
- The count of hens equals the count of bud sites, so nothing runs away. Population is static or scripted.
- Open questions (bud as food, how many attachments to full, what fire does, stun cost) are listed at the end of `ECOLOGY.md`.

## Conventions

Follow `CLAUDE.md`: small commits, `npm run build` green, record decisions in the docs as you go. Use the existing cel-shading and outline
look so the hen belongs in the world (`vistaShaders.ts`). Test at portrait phone size with the headless Chromium notes in `CLAUDE.md`.
