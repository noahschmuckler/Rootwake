# Hulda — The Remembering Garden

A separate phone-first playtest on `feat/hulda-awakening`. Entry: `hulda.html`;
GitHub Pages destination: `/Rootwake/hulda/`. The original plateau, underworld
and lab keep their entries and shared movement behavior.

Hulda asks living things to change. She never needs an axe, logs, a cabin, or a
carpentered bed. Six remembered forms move from personal survival to a role in
civilization: fruit → living bower → root irrigation → medicine → orchard →
healing a blighted elder. The final memory points toward the other six and the
underworld; neither the full party nor an additional underworld is built here.

## Play

Drag the world to look. Drag MOVE to walk/run; hold its centre for landing
circles. Tap a nearby plant, or its action button. Swap adjacent gems to make
three. Matches animate into the plant and feed visible growth. Longer matches
reward extra growth and energy. Choose Store energy to bank more charge while
postponing growth. Quickening spends 12 charge for 18 growth. Root ward unlocks
after irrigation and absorbs two blight attacks. Mend unlocks with silverleaf,
restores vigor and also heals the elder. The blight announces its next attack
in matches; it never attacks while the player is simply thinking.

Walking and idle time cost nothing. Matching spends vigor, with a floor of 20.
Below 40, direct growth is 75% effective, never impossible. Rest anywhere restores
70; rest within the completed bower restores 100. Fruit restores 24 and remedies
40. Completed berry bushes, silverleaf and orchard remain renewable through
matching. Seeds are supplies for the future journey, not a spendable currency in
this slice. No hunger timer or compulsory carpentry.

Progress, stored charge and supplies save locally under a separate versioned key.
The memory journal offers an explicit two-tap reset. Device/cloud sync is not
implemented. Invalid saves fall back to a new awakening.

## References and intentional choices

Read alongside Rootwake `DESIGN.md`, `SYSTEMS.md`, and `MOBILITY.md`. Reference
repository: `noahschmuckler/DiggyDwarves`, `GAME_DESIGN.md`,
`DESIGN_ADDENDUM_2026-07-02.md`, and `LIVING_WORLD_SPEC.md`. This slice borrows
primordial plant forms, water seeping through the mountain, action-based fatigue,
renewable crops, immediate visible match rewards, and telegraphed encounters.
Tangrams remain a distinct future puzzle; these memories are not a replacement
implementation of their seven-piece mechanics.

The original plateau/cliff/river/horizon geometry is reused. Forest vegetation
is batched by material. Hulda's geometry-native model follows the supplied
brown-and-gold long robe, warm brown skin, long dark hair and gold ornaments.
It uses no portrait textures, external fonts, or new runtime dependencies.

All thresholds in `src/hulda/state.ts` are initial playtest values. The authored
sequence deliberately tests the survival-to-protector arc before introducing
freeform cultivation or a large quest system. The key playtest question is
whether matches feel like life answering her, and whether banking power offers
a satisfying choice beside direct growth.

## Verification and deployment

`npm run test:hulda`, `npm run test:mobility`, `npm run test:lab`, `npm run build`.
`node scripts/browser-hulda.mjs` runs against the production bundle with
Playwright installed: portrait, landscape, desktop, real pointer movement,
raycast board swaps, the full six-form progression on phone, and save/reload.
Screenshots are uploaded by `deploy-hulda.yml`. Only after verification does
that workflow copy the tested bundle into the `gh-pages` `hulda/` directory.
