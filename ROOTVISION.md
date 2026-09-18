# Hulda: Beneath the Living World

A playable hypothesis for Noah's September 18 pivot. Hulda earns planetary agency by entering the living root network. Viewpoint, speech, borrowed presence, and physical transport are different abilities with different consequences.

## Run

`npm install`, then `npm run dev:roots`; open `/rootvision.html`.
`npm run build:roots` produces a standalone build in `dist-rootvision`, including an `index.html` for hosting. The regular build also includes `rootvision.html`. `npm run test:roots` checks progression and persistence. No additional runtime dependencies.

## A short playable journey

1. Start in third person near the Listening Tree. First person is also available. Reuses Rootwake's Player, shared thumbstick, terrain movement, and deterministic match-three Board.
2. Cultivate beside a tree. Legal matches grant three energy per cleared gem, capped at 36 per swap and 240 stored. Gather at least 54 to pay 36 for communion and 18 to release the spring.
3. Enter the roots. The camera moves beneath the spherical surface and looks upward. Soil becomes translucent, roots define the terrain, and village foundations protrude into a clearing. The initial radius is 32 meters.
4. Release the Knotted Spring. Learn Speak; reach becomes 51 m, communion costs 30.
5. Speak through the village tree and promise a living future. Learn Embody; reach becomes 80 m, communion costs 24.
6. Spend 36 to emerge as a temporary dryad in the Moonseed Grove. Walk within reach and untangle the bitter roots directly. The true body stays behind. Returning, timeout, or reload ends the borrowed body safely.
7. Learn Cross; reach becomes 110 m, communion costs 18. Physical travel costs 45 plus 0.35 per meter. Choose another known tree and emerge in your true body.
8. Spend 85 plus 0.35 per meter to invite the Mason to Stoneward Pass. The Mason and a road appear. This is a scripted council proof, not an economy or autonomous road construction simulation.

Communion lasts 75 active seconds; a borrowed body lasts 90. Menus and hidden tabs pause both. No offline catch-up or real-time punishment. Successful problem solving refreshes communion. Returning early is always free. Cultivation is unavailable in a borrowed body. Energy never regenerates off-screen.

## Controls and recovery

Drag the scene to look or drift through the roots. WASD or the shared stick walks; hold the stick's center for target steps. Tap a nearby tree or press Cultivate. Tap two neighboring gems or swipe. Hint identifies a legal pair; arrow keys navigate gems. Select a glowing root marker, or use the accessible thread selector. The becoming shows progression and a whole-planet interior study, explicitly separate from earned reach.

The save key is `rootwake.rootvision.v1`, independent of other game saves. Board seed and legal moves reproduce the random stream. Browser storage failures permit continued play and a JSON export. Reload restores the true body at its anchor tree; exact walking position is not persisted. Export is a backup; import UI is not implemented in this slice.

## Scope and construction

The complete 360 m diameter sphere is present from the start. Seeded trees, roots, and distant karst forms establish scale. Authored positions override vegetation around the village, grove, spring, and starting tree. One hemisphere contains the playable sites. The far-side daughter is narrative foreshadowing only; her gameplay and the ending are deliberately undecided.

Surface movement uses local vertical gravity on the authored spherical cap. Full planetary walking, cross-hemisphere transportation, continents, deep karst interiors, simulation LOD, supply routes, and city populations remain future work. Geometry uses simple stylized primitives. Buildings and vegetation are visual prototypes, not full collision/navigation obstacles. The root study lets the player look around from inside the planet; it is not a floating orbital camera.

Browsers with WebGL render the full Three.js scene. A deliberately simplified Canvas2D renderer projects the same scene and camera if WebGL is unavailable. It preserves the playable interactions but approximates mesh silhouettes and transparency. The test browser required this fallback; full WebGL visual quality still needs device playtesting.

Validation: seven rules tests and the TypeScript/Vite production build pass. The browser displayed the opening screen, opened cultivation, and identified a hinted match. Further browser interaction timed out before an end-to-end visual playthrough could be completed. Phone layout and full WebGL rendering remain playtest questions, not verified results.

## Design questions for Noah

- Does sinking beneath the ground feel like an extension of Hulda's senses?
- Do missing roots and building foundations make the village recognizable before a label explains it?
- Does paying for distance encourage useful choices, or merely more matching?
- Does a borrowed body feel different enough from transporting the true body?
- Is the road a satisfying answer to the high cost of sending the Mason?

## Next increments

1. Add choices to the village problem: spare its trees by supplying fuel, improve its stove with the Smith, or enforce a ban. Preserve consequences without predetermining Hulda's moral trajectory.
2. Replace the grove's single tending action with spatial root manipulation and three embedded teaching encounters.
3. Make council dispatch take time, train locals, and produce repeatable road capacity. Carry one physical cargo stack as the first transport experiment.
4. Extend reach along connected vegetation rather than radius alone. Give burned ground, water, seasonal growth, and restored groves distinct effects.
5. Add authored continental anchors, continuous spherical coordinates, and region streaming before expanding playable travel around the entire sphere.

The long-term principle: Hulda makes the first connection at exceptional cost. Her council teaches communities how to maintain and expand it through ordinary transport and communication.
