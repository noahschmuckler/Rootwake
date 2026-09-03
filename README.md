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

Playable: drag to orbit the voxel, tap it to lock the camera onto its face,
tap three same-colour flowers to make them recede into the trunk, "Back
out" to return to the orbit view. `R` reshuffles (new seed), `?seed=N`
repeats a board, `?slowmo=N` slows the recede and camera tweens.
