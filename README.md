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
Left thumb (or WASD) to walk, drag to look, tap a voxel to lock the camera
onto its face, tap three same-colour flowers and the whole voxel sinks away.
Clear toward the light. `R` reshuffles (new seed), `?seed=N` repeats a
layout, `?slowmo=N` slows the animations.
