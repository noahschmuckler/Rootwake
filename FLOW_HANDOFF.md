# The Clearing: continuation guide

## Latest status: complete and live
Play: https://noahschmuckler.github.io/Rootwake/flow/
Source branch: feat/free-flow (from the karst branch). Tested and published code commit: 2af3894 (handoff de8d761).
Successful verification and deployment run: https://github.com/noahschmuckler/Rootwake/actions/runs/35529029370 (all suites, the browser journey in GitHub's Chromium, publication of `flow/` only, public revision.json and asset check; screenshots in the run's `flow-browser-results` artifact). Deployment: `.github/workflows/deploy-flow.yml` on every push to the branch: mobility, lab and clearing unit tests, the production build at `/Rootwake/flow/`, the browser journey in GitHub's Chromium, publication of `flow/` only on gh-pages, then the public revision.json and asset check.

Next step is Noah's phone feedback (questions below).

## The brief
After the karst, Noah found the studies awkward: too much explanatory text, too many one-off buttons for bespoke interactions. Movement should feel free and natural, third person as the native view, in the spirit of Assassin's Creed and the roaming games that followed it: a unique set of moves tightened into automatic next steps from the thumbstick and a couple of buttons. Walking into a tree pauses; pressing into it enters the trunk as a bulge that slides up to the leaves, where the canopy reforms as her upper body; sideways slides to branches; down descends, pausing at the ground; down again sinks into the root network with the ground rendered translucent; double-tapping the stick emerges; double-tapping soil sinks and attaches to the nearest root. The first area's trees are placed so a surface root network allows uninterrupted travel, tapering visibly at its edges. Stone with handholds is climbed; blank stone, pressed into, turns her into a mass of ivy that grows up to a flat place and condenses back. Such growth is permanent: return and reconnect. She leaves a trail of distinct plant life, deepened each time she uses the same path. Screen messages to the bare minimum. The spring, roots and groves mechanic is set aside for this iteration.

## What is built
- **Third person is native.** The shared player in its third view, over the shoulder; the same drag orbits the camera in every form she takes. A single small button switches to first person and back. The only other button is help.
- **One stick, no menus.** Pressing into things is the verb (the stick held toward a thing she cannot walk through for a third of a second). No screen text except a one-line hint the first time each affordance appears, which fades in under three seconds.
- **Trees.** Press into a trunk: the avatar goes in and a bark bulge on the trunk's near side slides up as she pushes up. At the crown the bulge becomes a figure of leaves standing at the crown's edge; sideways slides her round the crown; pushing toward a neighbouring tree within reach leaps her, as leaves, across to its crown; down goes back into the trunk. At the trunk's foot, pausing; pushing down again sinks her into the roots.
- **Roots.** The ground goes glassy; she is a small bulge riding the network. The stick's direction along the root drives her; pushing back reverses; at a tree she takes whichever root is aligned with the stick; where a root tapers to nothing she stops. Double tap the stick to rise and reform on the ground above. Double tap the ground to sink from wherever she stands to the nearest root. The network joins every one of the fifteen trees (tested) and the outer trees send single roots outward that taper visibly to dead ends.
- **Stone.** The clearing is closed to the north by a wall with a ledge above. Press into the strip of handholds: she climbs with the stick, up, down and sideways, and steps onto the ledge (or down to the ground). Press into blank stone: she becomes a mass of ivy leaves and tendrils grow up the wall over three seconds, the mass rising with them, until she condenses on the ledge. The tendrils and leaves stay. Returning to a grown site, up or down, is a quick climb without regrowth. Pressing off the ledge where nothing has grown does nothing.
- **Her trail.** Every cell she walks (0.9 m) deepens with every pass, and flowering tufts grow there, larger the more the path is used. Trail and ivy save locally (`rootwake-clearing-v1`) and on page hide; reload keeps them. Position is not saved: she wakes at the south edge of the clearing.

## Files
- `src/flowModel.ts`: the layout (fifteen trees by hand), the root network (nearest neighbours within 10 m, plus tapering outward roots), the wall and its sites (`wallSite`), zones (`onGround`, `groundAt`), the rail (`nearestRoot`, `nextRoot`, `rootPoint`, `endTree`), crown hops, the trail (`tread`, `cellKey`), growth parse and serialise, the shared player's ground world. Tuning constants at the top.
- `src/flora.ts`: `taperedTube` and `treeParts` (trunk, branches, crown cards, root collar), shared plant geometry.
- `src/sprites.ts`: crossed standees and their textures; now with `bloom` for the trail.
- `src/flowWorld.ts`: the scene: glassy-able ground and ledge, wall, handhold knobs, sprite trees, the root network, grass, the trail as an instanced mesh, ivy tendrils that lengthen by draw range, and her other shapes (bulge, leaf figure, ivy mass).
- `src/flow.ts`, `flow.html`, `src/flow.css`: the modes (ground, trunk, crown, hop, root, sink, rise, climb, ivy), the press-into detection, double taps, the orbit camera, the hint line.
- `tests/flow.test.ts` (`node scripts/test-flow.mjs`): network connectivity and tapering, the rail, trees, crowns and wall sites, the ground world, the trail and saves.
- `scripts/browser-flow.mjs`: real touch journey: walk and trail, press into a tree, climb inside to the crown, slide round it, leap to a neighbour, descend into the roots, ride them, double tap out, double tap the ground in and out again, climb the handholds up and down, grow ivy, descend by it, reconnect to it quickly, reload with trail and ivy kept, four viewports.

## Tuning to judge on the phone
- Press-into time (0.35 s) and the trunk climb (2.4 m/s), root speed (3.4 m/s), crown slide and leap (0.9 s), ivy growth (3.2 s first time, 1.3 s after), handhold climb (1.4 m/s).
- Whether the bulge, the leaf figure and the ivy mass read as her; they are placeholders for a rigged avatar's transformations.
- Whether the crown leap wants a longer reach, and whether the roots need a visible cue for which way the stick will take her at a junction.
- The trail's growth rate (about one pass per level, three levels) and whether flowering tufts are the right "distinct plant life".
- Whether the hints should go entirely.

## Honest limits
Placeholders for her forms; no rigged animation. The ivy grows straight up to one ledge height; the wall is one flat face. No falling: the ledge edge holds. Browser emulation is not a phone.
