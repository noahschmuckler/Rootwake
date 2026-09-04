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

Playable: you wake in a dark pocket inside a thicket of eight voxels.
Hold on the left of the screen to pick a spot and release to hop there, drag
to look, tap a voxel to lock the camera onto its face, then play the match-3
board: tap a gem and a neighbour to swap. Matches shoot the flower of their
colour; a filled flower recedes; five receded flowers sink the whole voxel.
Clear toward the light. `R` reshuffles (new seed), `?seed=N` repeats a
layout, `?slowmo=N` slows the animations.
