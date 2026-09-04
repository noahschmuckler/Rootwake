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
and the whole tree sinks when the pool fills. On grass, matches till the
patch down to clods. Clear toward the light, walk to the edge, and look
down. `R` reshuffles (new seed), `?seed=N` repeats a layout, `?slowmo=N`
slows the animations.
