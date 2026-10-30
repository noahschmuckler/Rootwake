# The opening arc: the summit, the pool's sight, the first deepening and the first portal

Design discussion with Noah (2026-10-29), a draft spec, not a pass. Nothing here is built. It joins `BEGINNING.md` (the Eden and
its creatures), `VISION.md` (why the game exists) and the Descent (`DESCENT.md`, the catwalks as built in D0/D1). Lines marked
**Noah** are his decisions; **Proposal** lines are Claude's; **Open** lines wait on him.

## A change to the Descent (Noah)

The catwalk letters are **reversed from the repo's current order.**

- **Noah:** the top catwalk is **D**, and going down the letters spell **D‑E‑L‑I‑V‑E‑R** ("deliver"). Going up they spell
  **R‑E‑V‑I‑L‑E‑D** ("reviled"). (He said "revised"; I read it as REVILED, the word the repo already uses.)
- **The repo today says the opposite:** `LETTERS = ['R','E','V','I','L','E','D']` in `src/descentModel.ts` puts R at the top, and
  `DESCENT.md` says "going down they spell R‑E‑V‑I‑L‑E‑D". Three places need to follow when this is built: that array, the
  `DESCENT.md` sentence, and the snerk's line in `KEEPER_LINES` ("Read them going down and they curse you; going up, they ask a
  favour"), which should swap.
- **Proposal, why it works:** descending is the helpful direction ("Deliver these people, or be reviled"). Each step down is a
  letter of the promise, and climbing back out with the work undone spells the failure. It also puts the **D** (the layer you
  reach first) as the plain statement of purpose.

## The beat sequence

1. **The summit.** Hulda stands on top of the Wellspire and looks out over the valley. She can watch but cannot reach: the Cap
   seals the way down (`DESCENT.md`), so everything she sees is out of her hands. (PLATEAU.md already starts her on the summit and
   says she must meditate and cultivate before the first dive.)
2. **The pool's sight.** When she stands in the pool, under the stream of heavenly water falling from above, her vision is
   enhanced like a **heads-up display**: she sees **highlighted icons against the real world** showing the **location and status of
   every living entity**: the wolves, the deer, the thunderbird, the hobbits.
   - **Noah's intent:** this is how she develops a **yearning to go out and visit them.**
   - **Proposal, what "status" shows:** hunger, health, and what each is doing (a wolf stalking, a hobbit gathering, the
     thunderbird circling). It is the same data the village model already keeps (`HobbitState.activity`, `hunger`; raiders' states).
   - **Proposal, how it relates to what exists:** the explored map is a fog-of-war atlas (`overworldMap.ts`), and her sight
     already widens by tier (`TIER_VIEW`, VILLAGE_HANDOFF.md). The pool's sight is a live layer *over* the world, not the map. It
     works only while she stands in the water, so the water is the reason to keep returning.
3. **Petal teaches cultivation and the first deepening.** The tutorial character (`ADVERSARIES.md`, `VISION.md`) walks her through
   cultivating at the pool and diving the crystal drop to the first layer.
4. **The D catwalk.** On her first deepening she steps out onto **D**, the catwalk around the water droplet (the deep node is a
   waterdrop; `DESCENT.md`, D1). **Noah:** a character on the catwalk gives exposition, and the droplet can deliver some of it too.
5. **A task.** A **snerk** (Noah wrote "nark"; the repo's snerks already keep the information station on every layer) gives her a
   task to complete inside the first layer.
6. **The reward is information and a door.** Completing it:
   - **enables new information** when she next looks out from the top (the pool's sight gains something), and
   - **opens the first portal**, most likely to **the base of the Wellspire**, so she can venture out. (PLATEAU.md already places
     the ground-level portal on the island at the spire's foot, gated by clarity and a match-3 session; this adds the quest as the
     reason it opens.)

## The catwalk characters as quest-givers (Noah)

- The characters on each catwalk are **quest-givers who unlock mechanics at deeper and deeper levels.**
- They and Petal share one aim: to **teach Hulda to bring about a more advanced humanoid civilization.** It is built **layer by
  layer**, so each depth is a new lesson in what to build and what it costs.
- **Proposal, using what exists:** the keepers are already staged by depth (`descentModel.ts`): a snerk's archive on every layer, a
  hollowed's power node from the second, a greeblin's machine from the fourth. Each new keeper type is a natural new domain of
  quests, and the seven layers map to the seven bands (ROYGBIV).
- **Tie to the philosophy:** the keepers' quests are good and needed (the civilization is the point), and each advance feeds the
  counterpart (`VISION.md`). That lets Petal and the keepers want the same thing for different reasons, which is a good place for the
  player to feel the cost.

## Open

- **What breaks the Eden first?** Is it the first deepening (the first unlock, advancing Delvira's counterpart), or the portal out,
  when a goddess begins walking among animals and hobbits that have never met her?
- **Who speaks on D?** Does the droplet itself speak as a voice, or does it only set the scene for the keeper?
- **What the first quest asks.** Something small and teachable that fits the first layer (a browned-out station kept running with the
  board, `DESCENT.md` D3, is the existing idea).
- **What the pool's sight gains from the first quest.** Range, new categories (the apex animals' dens, the ruins), or detail on
  status.
