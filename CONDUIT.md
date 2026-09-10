# The Broken Conduit

A separate campaign laboratory at `conduit.html`, linked from the existing lab.
Seven characters have already awakened. Three groups inhabit Greencrown,
Anviltooth, and the Meridian relay. This is a small playable situation in the
liberation campaign, before the Keystone assault; none of the origin scenes are
replaced. The six non-Hulda characters retain domain titles until named by the
designer.

## What to play

Start near Hulda and restore the thirsty roots. Swap adjacent gems, then spend
12 energy on her gift. Every successful swap releases energy to the controlled
champion and nearby companions; cascades count as one enemy turn. Pick up the
seedheart left beside the spring. Portraits switch attention to a character’s
actual position. World opens the canonical eight-karst cube network, shows the
three playable places, and lets a selected group travel. Cargo stays with its
carrier. Characters at other sites never contribute materials or energy.

There are two complete routes through the shared situation:

- **Living:** restore water → carry its seedheart to the Meridian → read the
  memory prism → Hulda grows a self-supporting crossing → quiet or banish the
  breach → Artificer returns the light. Water can be restored with help from the
  Alchemist; the Sage and Artificer can both read the prism.
- **Forged:** either establish the Steward’s covenant after restoring water,
  or reclaim the abandoned slag directly → Smith forges the coupling → carry it
  to the Meridian → read the prism → raise a stone cradle → fit the coupling →
  quiet or banish the breach → return the light.

Calming the breach preserves a future keeper. Fighting it leaves a scar.
The covenant adds a second consequence: local people take responsibility for
maintaining the restored connection. Ending text remembers all three choices.
The route-exclusive crossing consumes its physical ingredient exactly once.

## Controls and time

Drag the world to look. MOVE or WASD walks; Q/E turns on a keyboard. Holding
MOVE at its center uses Rootwake’s existing landing targets. Tap a worksite or
its nearby action; distant actions turn you toward it. Work happens within 4.2 m.
Allies on Follow walk toward the active champion, with simple collision checks.
Hold position leaves them where they stand. Nearby champions are selectable above
the encounter board; the controlled champion determines which gift can be cast.
Gem shapes supplement color. Tap two gems, drag a swap, or use keyboard focus.
Hint identifies a legal move without spending energy or changing the board.

The breach lashes after three successful swaps. A 9-energy ward absorbs a lash;
no real-time countdown runs. Vigor has a floor of 20 and weakens gifts below 40;
rest outside encounters restores 100 without advancing time. Walking, menus,
attention switches, and offline time do not advance the campaign clock.
Travel and project completion each advance one watch. Non-controlled champions
can gather fruit at the restored garden or tend a ward to recover vigor/energy;
both jobs take two watches and stop when the champion leaves or is controlled.
Supplies can be passed between nearby champions using The seven.

## State and architecture

`src/conduit/state.ts` owns the serializable versioned campaign and command
validation. Characters own positions, region, vigor, energy, cargo, and orders.
World progress and dropped items belong to the campaign. The existing `Player`
and movement controls are reused, binding one active controller to these stored
characters. The original plateau/underworld ownership has not been rewritten.
`world.ts` renders three modest 3D regions and visible repair states. Only the
active region is visible. `globe.ts` displays the eight cube-vertex anchors.
`main.ts` connects input, the existing pure match-three `Board`, camera, and UI.

The board is a flat DOM interaction surface over the 3D encounter, using the
existing swap/cascade rules. It is not a second match-three rules engine.
Each worksite keeps a seed and legal-move history, replayed to restore both its
layout and its next random refill. A successful swap commits board history,
energy, and enemy consequences together before its visual animation starts.
Character/cargo/world progress saves under `rootwake.broken-conduit.v1` in the
current browser, separate from all origin saves. Position checkpoints occur every
three seconds and on attention changes/pagehide. Export/import carries the full
journey to another browser. There is no automatic cloud sync. Invalid saves are
rejected as a whole; malformed imports leave the current journey unchanged.

## Validation

`npm run test:conduit`: both endings via gameplay commands, distant material
rejection, per-character persistence, travel and inventory ownership, threat turn
accounting, wards/fatigue floor, delegated work, deterministic board replay,
malformed saves, and all three scene/repair states. `npm run build` type-checks all
entries and creates the production bundle. No browser or device playtest was run
in this implementation session; phone feel and campaign pacing need Noah’s play.

The normal `dist/index.html` remains the plateau. When a local Sites manifest
selects `build`, the postbuild helper stages a separate preview with the campaign
at its root. The normal release build works without that manifest.

## Deliberate limits and questions to riff on

- Three authored regions and a strategic globe, not a continuously simulated
  planet. No army AI, complete 4X layer, or seventh origin campaign.
- One signature contribution per specialist, with overlapping roles where useful;
  party composition changes solutions, but progression trees remain to design.
- Followers have simple collision avoidance, not navigation meshes. If a prop
  separates a follower, take control and walk them around it.
- Delegation is bounded provisioning/recovery, not autonomous quest completion.
- Tangram imagery and the ancient light system inform the story, but a new
  tangram or beam-routing puzzle is not claimed here.
- Does crossing between distant perspectives feel meaningful? Does Hulda’s
  seedheart feel like a future use of her early gardening? Does carrying a forged
  object make the Smith’s contribution tangible? Does local stewardship make
  the eventual Diminishing feel like an understandable choice?

Sources: DiggyDwarves `GAME_DESIGN.md`, `DESIGN_ADDENDUM_2026-07-09.md`,
`src/world/worldGraph.ts`, `src/dwarves.ts`, and `src/state/WorldClock.ts`;
Rootwake `DESIGN.md`, `SYSTEMS.md`, and `MOBILITY.md`.
