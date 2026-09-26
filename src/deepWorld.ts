// The deep node as scene (G4): the taproot's bore she dives down from the pool (a tube seen from inside,
// dark, its veins faintly lit), the hollow at the node (a dark sphere seen from inside, a few root-lights
// hanging up into it), and the bore of a deep root she is launched along, built for each launch from its
// curve and taken away after. Fog does the rest: while she is in the deep the entry sets it thick, so only
// the bore's walls near her show, and the world beyond the pillar's stone never leaks through.
import * as THREE from 'three';
export function createDeepWorld(scene: THREE.Scene) {
  const wall = new THREE.MeshStandardMaterial({ color: '#2a1d0c', emissive: '#4a2c10', emissiveIntensity: 0.25, roughness: 1, side: THREE.BackSide });
  // The veins: the bore's own mesh drawn again as a wireframe, seen from inside, so the walls have lines that stream past (the pace reads).
  const vein = new THREE.MeshBasicMaterial({ color: '#c9a24a', transparent: true, opacity: 0.35, depthWrite: false, wireframe: true, side: THREE.BackSide });
  const hollowMat = new THREE.MeshStandardMaterial({ color: '#0a0e14', emissive: '#101a2a', emissiveIntensity: 0.5, roughness: 1, side: THREE.BackSide });
  const group = new THREE.Group(); group.name = 'deep'; group.visible = false; scene.add(group);
  let bore: THREE.Mesh | null = null, veins: THREE.Mesh | null = null;
  const hollow = new THREE.Mesh(new THREE.SphereGeometry(7, 20, 14), hollowMat); group.add(hollow);
  const glow = new THREE.PointLight('#b8d8ff', 2.5, 30, 1.5); group.add(glow);
  // The root-lights: threads hanging up from the hollow's roof, lit, so looking up reads as roots above.
  const threads = new THREE.Group(); group.add(threads);
  { const mat = new THREE.MeshBasicMaterial({ color: '#8fb8e0', transparent: true, opacity: 0.55, depthWrite: false }); for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2 + (i % 3) * 0.4, r = 2 + (i % 4) * 1.1, m = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.06, 3 + (i % 5) * 0.8, 5), mat); m.position.set(Math.cos(a) * r, 5.2 - (i % 5) * 0.4, Math.sin(a) * r); threads.add(m); } }
  function clearBore(): void { if (bore) { group.remove(bore); bore.geometry.dispose(); bore = null; } if (veins) { group.remove(veins); veins.geometry.dispose(); veins = null; } }
  /** A bore along a curve (world coordinates), radius r: she rides inside it. */
  function setBore(curve: THREE.Curve<THREE.Vector3>, r = 1.4): void {
    clearBore(); const segs = Math.max(12, Math.ceil(curve.getLength() / 3));
    bore = new THREE.Mesh(new THREE.TubeGeometry(curve, segs, r, 10, false), wall); group.add(bore);
    veins = new THREE.Mesh(new THREE.TubeGeometry(curve, segs * 2, r * 0.97, 10, false), vein); group.add(veins);
  }
  /** The hollow at the node. */
  function setNode(at: THREE.Vector3): void { hollow.position.copy(at); threads.position.copy(at); glow.position.copy(at).add(new THREE.Vector3(0, 2, 0)); }
  function show(on: boolean): void { group.visible = on; if (!on) clearBore(); }
  function update(t: number): void { if (!group.visible) return; vein.opacity = 0.25 + 0.15 * Math.sin(t * 0.004); glow.intensity = 2.2 + 0.6 * Math.sin(t * 0.0023); threads.rotation.y = t * 0.00008; }
  return { setBore, clearBore, setNode, show, update, get shown() { return group.visible; } };
}
export type DeepWorld = ReturnType<typeof createDeepWorld>;
