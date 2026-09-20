import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/** Small reusable wood forms. Local origin is the shared transformation centre. */
export function createWoodForms() {
  const bark = new THREE.MeshStandardMaterial({ color: '#66503b', roughness: 1 });
  const grain = new THREE.MeshStandardMaterial({ color: '#927044', roughness: 1 });
  const sap = new THREE.MeshStandardMaterial({ color: '#82a455', emissive: '#304522', emissiveIntensity: .18, roughness: .9 });
  const geometries: THREE.BufferGeometry[] = [];
  function merged(parent: THREE.Group, parts: THREE.BufferGeometry[], material: THREE.Material) {
    const geometry = mergeGeometries(parts); for (const part of parts) part.dispose();
    geometries.push(geometry); parent.add(new THREE.Mesh(geometry, material));
  }
  function tube(points: THREE.Vector3[], radius: number, closed = false) {
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points, closed), 40, radius, 5, closed);
  }
  const burl = new THREE.Group(); burl.name = 'trunkBurl';
  // An asymmetric swelling, flattened against the trunk, with wrapping grain ridges.
  const core = new THREE.SphereGeometry(1, 14, 10); core.scale(.29,.43,.18);
  merged(burl,[core],bark);
  const rings: THREE.BufferGeometry[] = [];
  for(let j=0;j<5;j++) {
    const points: THREE.Vector3[]=[];
    for(let i=0;i<20;i++) { const a=i/20*Math.PI*2, r=.52+j*.105;
      points.push(new THREE.Vector3(Math.cos(a)*.29*r,Math.sin(a)*.43*r,.16+Math.sin(a*3+j)*.018)); }
    rings.push(tube(points,.012,true));
  }
  merged(burl,rings,grain);
  const knot = new THREE.Group(); knot.name = 'rootKnot';
  const roots: THREE.BufferGeometry[]=[];
  // Three interlaced, non-spherical strands: clear holes and crossings from every side.
  for(let j=0;j<3;j++) {
    const points: THREE.Vector3[]=[];
    for(let i=0;i<32;i++) { const a=i/32*Math.PI*2, phase=a+j*Math.PI*2/3;
      points.push(new THREE.Vector3((.15+.055*Math.cos(3*a))*Math.cos(phase),.14*Math.sin(3*a+j*2),(.15+.055*Math.cos(3*a))*Math.sin(phase))); }
    roots.push(tube(points,.037,true));
  }
  merged(knot,roots,bark);
  const tips: THREE.BufferGeometry[]=[];
  for(let side=-1;side<=1;side+=2) tips.push(tube([
    new THREE.Vector3(.05*side,.04,0),new THREE.Vector3(.12*side,.07,-.16),new THREE.Vector3(.05*side,0,-.30),
  ],.019));
  merged(knot,tips,grain);
  // The same little green bud survives inside both wooden silhouettes.
  for(const form of [burl,knot]) {
    const bud = new THREE.SphereGeometry(.055,8,6); bud.scale(.6,1,.65); bud.translate(.04,.08,.19);
    merged(form,[bud],sap);
  }
  return { burl,knot,dispose() { for(const g of geometries) g.dispose(); for(const m of [bark,grain,sap]) m.dispose(); } };
}
