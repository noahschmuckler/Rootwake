import * as THREE from 'three';
import { HuldaMotion } from './huldaMotion';

/** Rigid joint rig in authoring metres. Scale preserves /flow's 0.72m capsule. */
export const HULDA_SCALE = 0.375;
export function createHulda() {
  const group = new THREE.Group(); group.name = 'Hulda'; group.scale.setScalar(HULDA_SCALE);
  const motion = new HuldaMotion();
  const skin = new THREE.MeshStandardMaterial({ color: '#b9cca0', roughness: 0.83 });
  const leaf = new THREE.MeshStandardMaterial({ color: '#326b42', roughness: 0.85 });
  const lightLeaf = new THREE.MeshStandardMaterial({ color: '#78a44c', roughness: 0.82 });
  const hair = new THREE.MeshStandardMaterial({ color: '#93462e', roughness: 0.85 });
  const bark = new THREE.MeshStandardMaterial({ color: '#514838', roughness: 1 });
  const eyes = new THREE.MeshStandardMaterial({ color: '#203d31', roughness: 0.5 });
  const sphere = new THREE.SphereGeometry(1, 12, 8);
  // A pointed folded leaf, with actual thickness/readable facets at phone scale.
  const leafGeo = new THREE.BufferGeometry();
  leafGeo.setAttribute('position', new THREE.Float32BufferAttribute([
    0,0,0, -.5,.4,0, 0,.48,-.13, -.5,.4,0, 0,1,0, 0,.48,-.13,
    0,1,0, .5,.4,0, 0,.48,-.13, .5,.4,0, 0,0,0, 0,.48,-.13,
    0,0,0, 0,1,0, -.5,.4,0, 0,0,0, .5,.4,0, 0,1,0,
  ], 3)); leafGeo.computeVertexNormals();
  function joint(name: string, parent: THREE.Object3D, x: number, y: number, z = 0) {
    const j = new THREE.Group(); j.name = name; j.position.set(x, y, z); parent.add(j); return j;
  }
  function ellipsoid(parent: THREE.Object3D, material: THREE.Material, x: number, y: number, z: number, sx: number, sy: number, sz: number) {
    const m = new THREE.Mesh(sphere, material); m.position.set(x, y, z); m.scale.set(sx, sy, sz); parent.add(m); return m;
  }
  function blade(parent: THREE.Object3D, x: number, y: number, z: number, w: number, h: number, angle = 0, material = leaf) {
    const m = new THREE.Mesh(leafGeo, material); m.position.set(x, y, z); m.scale.set(w,h,w); m.rotation.z = angle; parent.add(m); return m;
  }
  const hips = joint('hips', group, 0, 0.86);
  ellipsoid(hips, leaf, 0,0,0, .21,.15,.135);
  const spine = joint('spine', hips, 0,.13);
  ellipsoid(spine, leaf, 0,.11,0, .145,.22,.115);
  ellipsoid(spine, leaf, 0,.28,0, .225,.17,.135);
  const neck = joint('neck', spine, 0,.43);
  ellipsoid(neck, skin, 0,.035,0, .062,.095,.063);
  const head = joint('head', neck, 0,.19);
  ellipsoid(head, skin, 0,0,0, .132,.18,.122);
  ellipsoid(head, skin, 0,-.015,-.123, .025,.038,.039);
  for (const x of [-.055,.055]) ellipsoid(head, eyes, x,.035,-.111, .027,.014,.016);
  ellipsoid(head, hair, 0,.055,.046, .146,.165,.13);
  // Copper vine locks behind the face; a leaf comb keeps the silhouette botanical.
  const locks: THREE.Group[] = [];
  for (let i=0; i<5; i++) {
    const lock = joint('vineHair'+i, head, (i-2)*.062,.07,.09);
    ellipsoid(lock,hair,0,-.21,.035,.045,.29,.055); locks.push(lock);
  }
  for (let i=0;i<3;i++) blade(head,-.13+i*.045,.10,-.055,.10,.21,-.6+i*.3,lightLeaf);
  // Overlapping leaves form a short flared skirt; legs remain readable in motion.
  for (let i=0;i<9;i++) {
    const a=i*Math.PI*2/9, panel=joint('skirtLeaf'+i,hips,Math.sin(a)*.17,-.015,Math.cos(a)*.12);
    panel.rotation.y=a; blade(panel,0,0,0,.22,.36,Math.PI,i%3===0?lightLeaf:leaf);
    panel.rotation.x=-.22;
  }
  for (const side of [-1,1]) {
    blade(spine,side*.12,.14,-.12,.17,.30,side*-.35,lightLeaf);
    blade(spine,side*.19,.34,.01,.19,.24,side*-.95);
  }
  const limbs = [-1,1].map((side, index) => {
    const prefix = index===0?'left':'right';
    const shoulder=joint(prefix+'Shoulder',spine,side*.235,.32);
    ellipsoid(shoulder,skin,0,-.14,0,.066,.17,.065);
    const elbow=joint(prefix+'Elbow',shoulder,0,-.29);
    ellipsoid(elbow,skin,0,-.115,0,.05,.135,.05);
    const hand=joint(prefix+'Hand',elbow,0,-.26);
    ellipsoid(hand,skin,0,-.025,0,.05,.075,.034);
    blade(elbow,0,-.17,-.045,.095,.21,.12*side,leaf);
    const hip=joint(prefix+'Hip',hips,side*.12,-.055);
    ellipsoid(hip,skin,0,-.17,0,.09,.20,.09);
    const knee=joint(prefix+'Knee',hip,0,-.36);
    ellipsoid(knee,skin,0,-.17,0,.061,.185,.061);
    const ankle=joint(prefix+'Ankle',knee,0,-.35);
    ellipsoid(ankle,bark,0,-.035,-.047,.074,.055,.115);
    blade(knee,0,-.27,-.054,.11,.29,0,leaf);
    return { side, shoulder, elbow, hand, hip, knee, ankle };
  });
  function update(dt: number, speed: number, heading: number, grounded: boolean) {
    motion.update(dt,speed,heading,grounded);
    const {moving,run,phase,time}=motion;
    hips.position.y=.86 + moving*(.012+.022*run)*Math.cos(phase*2);
    hips.rotation.y=Math.sin(phase)*.08*moving;
    spine.rotation.x=-.12*run*moving;
    spine.rotation.z=Math.sin(phase)*.025*moving;
    spine.rotation.y=-hips.rotation.y*.65;
    neck.rotation.x=-spine.rotation.x*.6;
    for(const l of limbs) {
      const p=phase+(l.side<0?0:Math.PI), swing=Math.sin(p)*moving;
      l.hip.rotation.x=swing*(.48+.3*run);
      l.knee.rotation.x=-Math.max(0,-Math.cos(p))*(.65+.75*run)*moving;
      l.ankle.rotation.x=-l.hip.rotation.x*.3-l.knee.rotation.x*.4;
      l.shoulder.rotation.x=-swing*(.34+.4*run);
      l.shoulder.rotation.z=l.side*(.08+.018*Math.sin(time*1.7));
      l.elbow.rotation.x=-.12-run*.95+Math.max(0,swing)*.15;
    }
    for(let i=0;i<locks.length;i++) locks[i].rotation.x=.1+run*.18+Math.sin(time*2.2+i*.7)*.035+Math.sin(phase+.4*i)*moving*.07;
  }
  function dispose() {
    group.removeFromParent(); sphere.dispose(); leafGeo.dispose();
    for(const material of [skin,leaf,lightLeaf,hair,bark,eyes]) material.dispose();
  }
  return { group, motion, joints: {hips,spine,neck,head,limbs}, update, dispose };
}
