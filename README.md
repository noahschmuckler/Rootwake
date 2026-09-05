# Rootwake

A 3D prototype exploring a "confinement → open vista" cosmology, spun out of
[DiggyDwarves](../DiggyDwarves)' overworld design direction. Three.js +
TypeScript + Vite.

See `DESIGN.md` for the design brief and the current MVP spec, and
`CLAUDE.md` for dev commands and working conventions.

```
npm install
npm run dev
```

Playable: you wake on a grass patch in a pocket inside a dense thicket on a
mountain plateau. Hold on the left of the screen to pick a spot and release
to hop there, drag to look, tap a tree (any side) to lock onto it or tap
grass to lock looking down, then play the match-3 board: tap a gem and a
neighbour to swap. Every match feeds the tree; its flowers recede one by one
and when the pool fills the trunk topples with a thud, leaving a log, sticks
and seeds. Drag a hand box (top of the screen) to a thing to take it; both
hands to the log to drag it off; clear the footprint and it becomes
tillable. Drag seeds onto tilled ground to plant a tree, or hold the seed
box to eat them. Work tires you: the edges of the screen darken, colour
drains, hops shorten; rest with a still press on the right, or collapse and
wake tired. Night falls every few minutes: well fed you see the plateau by
moonlight, tired you see only the lichen glowing on the rock, and only
then can you gather it. Tilling turns up rocks: lift one, long-press
another, and knap it into a stone hand axe. Clear toward the light, walk to
the edge, and look down. `R`
reshuffles (new seed), `?seed=N` repeats a layout, `?slowmo=N` slows the
animations.
