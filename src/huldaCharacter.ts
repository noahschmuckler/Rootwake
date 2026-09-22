// Hulda on the X Bot's skeleton: the same 65 bones, names, hierarchy and T-pose bind as Mixamo's rig
// (src/huldaSkeleton.json, extracted from public/models/xbot.fbx), dressed in her own rigid parts,
// leaf, bark and copper vine, each sized from the bone it hangs on. So every Mixamo clip drives her
// directly (setClips), and when no clips are loaded a procedural gait poses the same bones.
import * as THREE from 'three';
import { HuldaMotion } from './huldaMotion';
import { installGait, MODEL_HEIGHT, type Gait } from './huldaRig';
import skeletonData from './huldaSkeleton.json';

interface BoneData { name: string; parent: string | null; position: number[]; quaternion: number[]; scale: number[] }
const SKELETON: { root: string; bones: BoneData[] } = skeletonData;
export const BONE_PREFIX = 'mixamorig';
/** The clearing's 0.72 m capsule; the file's bind pose is in centimetres and faces +Z. */
export const HULDA_HEIGHT = MODEL_HEIGHT;
const bone = (short: string): string => BONE_PREFIX + short;

/** How a figure on this skeleton is dressed: Hulda by default; a hobbit is shorter, in cloth, without her leaves and vines. */
export interface FigureOptions { name: string; height: number; skin: string; cloth: string; clothLight: string; hair: string; feet: string; locks: boolean; leaves: boolean; skirt: boolean }
export const HULDA_FIGURE: FigureOptions = { name: 'Hulda', height: MODEL_HEIGHT, skin: '#b9cca0', cloth: '#326b42', clothLight: '#78a44c', hair: '#93462e', feet: '#514838', locks: true, leaves: true, skirt: true };
export function createHulda(options: Partial<FigureOptions> = {}) {
  const o: FigureOptions = { ...HULDA_FIGURE, ...options };
  const group = new THREE.Group(); group.name = o.name;
  const motion = new HuldaMotion();
  const skin = new THREE.MeshStandardMaterial({ color: o.skin, roughness: 0.83 });
  const leaf = new THREE.MeshStandardMaterial({ color: o.cloth, roughness: 0.85 });
  const lightLeaf = new THREE.MeshStandardMaterial({ color: o.clothLight, roughness: 0.82 });
  const hair = new THREE.MeshStandardMaterial({ color: o.hair, roughness: 0.85 });
  const bark = new THREE.MeshStandardMaterial({ color: o.feet, roughness: 1 });
  const eyes = new THREE.MeshStandardMaterial({ color: '#203d31', roughness: 0.5 });
  const sphere = new THREE.SphereGeometry(1, 12, 8);
  // A pointed folded leaf, with actual thickness/readable facets at phone scale.
  const leafGeo = new THREE.BufferGeometry();
  leafGeo.setAttribute('position', new THREE.Float32BufferAttribute([
    0,0,0, -.5,.4,0, 0,.48,-.13, -.5,.4,0, 0,1,0, 0,.48,-.13,
    0,1,0, .5,.4,0, 0,.48,-.13, .5,.4,0, 0,0,0, 0,.48,-.13,
    0,0,0, 0,1,0, -.5,.4,0, 0,0,0, .5,.4,0, 0,1,0,
  ], 3)); leafGeo.computeVertexNormals();
  // The skeleton, bone for bone from the file: the rig faces +Z in file units, so the rig group turns and scales it.
  const bones = new Map<string, THREE.Bone>(), bindLocal = new Map<string, THREE.Quaternion>(), bindWorld = new Map<string, THREE.Quaternion>();
  const rig = new THREE.Group(); rig.name = 'HuldaRig'; group.add(rig);
  for (const b of SKELETON.bones) {
    const j = new THREE.Bone(); j.name = b.name; j.position.fromArray(b.position); j.quaternion.fromArray(b.quaternion).normalize(); j.scale.fromArray(b.scale);
    (b.parent ? bones.get(b.parent)! : rig).add(j); bones.set(b.name, j);
    bindLocal.set(b.name, j.quaternion.clone()); bindWorld.set(b.name, (b.parent ? bindWorld.get(b.parent)!.clone() : new THREE.Quaternion()).multiply(j.quaternion));
  }
  rig.updateMatrixWorld(true);
  const top = new THREE.Vector3(); bones.get(bone('HeadTop_End'))!.getWorldPosition(top);
  const skeletonHeight = top.y, s = skeletonHeight / 1.9; // s: her authored sizes (a 1.9-tall figure) in the file's units.
  rig.scale.setScalar(o.height / skeletonHeight); rig.rotation.y = Math.PI;
  const J = (short: string): THREE.Bone => { const j = bones.get(bone(short)); if (!j) throw new Error(`no bone ${short}`); return j; };
  const childOf = (child: string): THREE.Vector3 => J(child).position.clone();
  /** An ellipsoid along a bone toward its child: the limb segment, sized by the bone's length. */
  function segment(parent: string, child: string, material: THREE.Material, rx: number, rz = rx, along = 1): THREE.Mesh {
    const d = childOf(child), L = d.length(), m = new THREE.Mesh(sphere, material);
    m.position.copy(d).multiplyScalar(0.5 * along); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()); m.scale.set(rx, L * 0.5 * along, rz);
    J(parent).add(m); return m;
  }
  function ellipsoid(parent: THREE.Object3D, material: THREE.Material, x: number, y: number, z: number, sx: number, sy: number, sz: number): THREE.Mesh {
    const m = new THREE.Mesh(sphere, material); m.position.set(x, y, z); m.scale.set(sx, sy, sz); parent.add(m); return m;
  }
  function blade(parent: THREE.Object3D, x: number, y: number, z: number, w: number, h: number, angle = 0, material = leaf): THREE.Mesh {
    const m = new THREE.Mesh(leafGeo, material); m.position.set(x, y, z); m.scale.set(w, h, w); m.rotation.z = angle; parent.add(m); return m;
  }
  // Torso: pelvis, belly, chest along the spine bones; the leaf skirt hangs from the hips (forward is +Z in the rig).
  const hips = J('Hips');
  ellipsoid(hips, leaf, 0, -0.02 * s, 0, 0.21 * s, 0.15 * s, 0.135 * s);
  // One torso along the whole spine (the three spine bones are short), and the chest over it.
  segment('Spine', 'Spine1', leaf, 0.16 * s, 0.12 * s, 3.4); segment('Spine2', 'Neck', leaf, 0.215 * s, 0.14 * s, 0.9);
  for (let i = 0; i < (o.skirt ? 9 : 0); i++) {
    const a = i * Math.PI * 2 / 9, panel = new THREE.Group(); panel.name = 'skirtLeaf' + i; panel.position.set(Math.sin(a) * 0.17 * s, -0.04 * s, -Math.cos(a) * 0.12 * s); panel.rotation.y = a + Math.PI; hips.add(panel);
    blade(panel, 0, 0, 0, 0.22 * s, 0.36 * s, Math.PI, i % 3 === 0 ? lightLeaf : leaf); panel.rotation.x = 0.22;
  }
  const chest = J('Spine2');
  if (o.leaves) for (const side of [-1, 1]) { blade(chest, side * 0.12 * s, 0.03 * s, 0.11 * s, 0.17 * s, 0.30 * s, side * -0.35, lightLeaf); blade(chest, side * 0.19 * s, 0.14 * s, -0.01 * s, 0.19 * s, 0.24 * s, side * -0.95); }
  segment('Neck', 'Head', skin, 0.062 * s, 0.063 * s);
  // The head, sized to the rig rather than her old big-headed self; the face is at +Z, the vine locks behind.
  const head = J('Head'), hx = 0.105 * s, hy = 0.14 * s, hz = 0.1 * s, headTop = childOf('HeadTop_End');
  const headCentre = new THREE.Vector3(0, headTop.y * 0.5, 0.02 * s);
  ellipsoid(head, skin, headCentre.x, headCentre.y, headCentre.z, hx, hy, hz);
  ellipsoid(head, skin, 0, headCentre.y - 0.012 * s, headCentre.z + hz * 0.98, 0.025 * s, 0.038 * s, 0.039 * s);
  for (const x of [-0.42, 0.42]) ellipsoid(head, eyes, x * hx, headCentre.y + 0.2 * hy, headCentre.z + hz * 0.9, 0.027 * s, 0.014 * s, 0.016 * s);
  ellipsoid(head, hair, 0, headCentre.y + 0.3 * hy, headCentre.z - 0.38 * hz, hx * 1.1, hy * 0.92, hz * 1.06);
  const locks: THREE.Group[] = [];
  for (let i = 0; i < (o.locks ? 5 : 0); i++) { const lock = new THREE.Group(); lock.name = 'vineHair' + i; lock.position.set((i - 2) * 0.05 * s, headCentre.y + 0.35 * hy, headCentre.z - 0.7 * hz); head.add(lock); ellipsoid(lock, hair, 0, -0.19 * s, -0.03 * s, 0.045 * s, 0.26 * s, 0.05 * s); locks.push(lock); }
  if (o.leaves) for (let i = 0; i < 3; i++) blade(head, (-0.13 + i * 0.045) * s, headCentre.y + 0.5 * hy, headCentre.z + 0.4 * hz, 0.09 * s, 0.14 * s, -0.6 + i * 0.3, lightLeaf);
  // Limbs along the bones; fingers too, so a hand clip reads. Bark feet.
  const limbs = [-1, 1].map(side => {
    const P = side < 0 ? 'Left' : 'Right';
    segment(P + 'Shoulder', P + 'Arm', leaf, 0.075 * s, 0.065 * s);
    segment(P + 'Arm', P + 'ForeArm', skin, 0.066 * s, 0.065 * s); segment(P + 'ForeArm', P + 'Hand', skin, 0.05 * s);
    const forearm = J(P + 'ForeArm'), fd = childOf(P + 'Hand'); if (o.leaves) blade(forearm, 0, fd.y * 0.85, -0.045 * s, 0.095 * s, 0.21 * s, Math.PI + 0.12 * side); // points back up the forearm
    segment(P + 'Hand', P + 'HandMiddle1', skin, 0.045 * s, 0.03 * s);
    for (const f of ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky']) for (let k = 1; k <= 3; k++) segment(`${P}Hand${f}${k}`, `${P}Hand${f}${k + 1}`, skin, 0.012 * s);
    segment(P + 'UpLeg', P + 'Leg', skin, 0.09 * s); segment(P + 'Leg', P + 'Foot', skin, 0.061 * s);
    const shin = J(P + 'Leg'), sd = childOf(P + 'Foot'); if (o.leaves) blade(shin, 0, sd.y * 0.9, -0.054 * s, 0.11 * s, 0.29 * s, Math.PI); // points up the shin
    segment(P + 'Foot', P + 'ToeBase', bark, 0.045 * s, 0.032 * s, 1.15); segment(P + 'ToeBase', P + 'Toe_End', bark, 0.04 * s, 0.02 * s, 1.3);
    return { side, shoulder: J(P + 'Arm'), elbow: J(P + 'ForeArm'), hand: J(P + 'Hand'), hip: J(P + 'UpLeg'), knee: J(P + 'Leg'), ankle: J(P + 'Foot') };
  });
  const joints = { hips, spine: J('Spine1'), neck: J('Neck'), head, limbs };
  const hipsRestY = hips.position.y;
  const tmpQ = new THREE.Quaternion(), tmpQ2 = new THREE.Quaternion(), X = new THREE.Vector3(-1, 0, 0), Z = new THREE.Vector3(0, 0, 1);
  /** A positive swing takes a hanging limb forward (and tips an upright bone back); roll turns about the forward axis, positive lifting the left side. */
  const swing = (angle: number, roll = 0): THREE.Quaternion => tmpQ.setFromAxisAngle(X, angle).multiply(new THREE.Quaternion().setFromAxisAngle(Z, roll));
  // The procedural gait's rest pose is the bind with the T-pose's arms hanging: each upper arm rolled to just off vertical, its
  // forearm, hand and fingers carried with it. Posing a bone is then a rotation in the rig's frame (x right, y up, z forward) on
  // top of that rest: new local = rest · conj(restWorld) · R · restWorld, so nested swings compose as the old rig's Eulers did.
  const restLocal = new Map(bindLocal), restWorld = new Map(bindWorld);
  const armHang = limbs.map(l => { const d = new THREE.Vector3(0, 1, 0).applyQuaternion(bindWorld.get(l.shoulder.name)!); return -Math.sign(d.x) * (Math.PI / 2 - Math.atan2(Math.abs(d.y), Math.abs(d.x)) - 0.08); });
  for (let i = 0; i < limbs.length; i++) {
    const arm = limbs[i].shoulder, roll = new THREE.Quaternion().setFromAxisAngle(Z, armHang[i]), wb = bindWorld.get(arm.name)!;
    restLocal.set(arm.name, bindLocal.get(arm.name)!.clone().multiply(wb.clone().invert()).multiply(roll).multiply(wb));
    arm.traverse(o => { if (o instanceof THREE.Bone) restWorld.set(o.name, roll.clone().multiply(bindWorld.get(o.name)!)); });
  }
  const pose = (j: THREE.Bone, R: THREE.Quaternion): void => { const wb = restWorld.get(j.name)!; j.quaternion.copy(restLocal.get(j.name)!).multiply(tmpQ2.copy(wb).invert()).multiply(R).multiply(wb); };
  let gait: Gait | null = null;
  const fold = { spine: swing(-0.8).clone(), neck: swing(0.3).clone(), hip: swing(1.35).clone(), knee: swing(-2.1).clone(), shoulder: swing(-1.3).clone(), elbow: swing(1.6).clone() };
  function procedural(dt: number, speed: number, heading: number, grounded: boolean): void {
    motion.update(dt, speed, heading, grounded);
    const { moving, run, phase, time } = motion;
    hips.position.y = hipsRestY + moving * (0.012 + 0.022 * run) * Math.cos(phase * 2) * s;
    pose(hips, tmpQ.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.sin(phase) * 0.08 * moving));
    pose(joints.spine, swing(-0.12 * run * moving, Math.sin(phase) * 0.025 * moving));
    pose(joints.neck, swing(0.07 * run * moving));
    for (let i = 0; i < limbs.length; i++) {
      const l = limbs[i], p = phase + (l.side < 0 ? 0 : Math.PI), sw = Math.sin(p) * moving;
      pose(l.hip, swing(sw * (0.48 + 0.3 * run)));
      // The knee flexes through the swing (toe-off at 3pi/2 to just before heel strike at pi/2), not the stance.
      pose(l.knee, swing(-Math.max(0, Math.cos(p - 7 * Math.PI / 4)) * (0.65 + 0.75 * run) * moving));
      pose(l.ankle, swing(-sw * 0.15));
      pose(l.shoulder, swing(-sw * (0.34 + 0.4 * run), l.side * -0.018 * Math.sin(time * 1.7)));
      pose(l.elbow, swing(0.12 + run * 0.95 + Math.max(0, -sw) * 0.15));
    }
    for (let i = 0; i < locks.length; i++) locks[i].rotation.x = -0.1 - run * 0.18 + Math.sin(time * 2.2 + i * 0.7) * 0.035 + Math.sin(phase + 0.4 * i) * moving * 0.07;
  }
  /** Crouch, tuck the knees and wrap the arms before the wooden form takes over; on top of whatever posed the bones. */
  function applyFold(k: number): void {
    if (k <= 0) return;
    hips.position.y = THREE.MathUtils.lerp(hips.position.y, hipsRestY - 0.08 * s, k);
    const blendTo = (j: THREE.Bone, R: THREE.Quaternion) => { pose(j, R); tmpQ2.copy(j.quaternion); };
    const mix = (j: THREE.Bone, R: THREE.Quaternion) => { const current = j.quaternion.clone(); blendTo(j, R); j.quaternion.copy(current.slerp(tmpQ2, k)); };
    mix(joints.spine, fold.spine); mix(joints.neck, fold.neck);
    for (const l of limbs) { mix(l.hip, fold.hip); mix(l.knee, fold.knee); mix(l.shoulder, fold.shoulder); mix(l.elbow, fold.elbow); }
  }
  function update(dt: number, speed: number, heading: number, grounded: boolean, foldAmount = 0): void {
    const k = THREE.MathUtils.clamp(foldAmount, 0, 1);
    if (gait) gait.update(dt, speed, heading, grounded, k); else procedural(dt, speed, heading, grounded);
    applyFold(k);
  }
  /** Prefab clips (Mixamo's, on these bone names) take over from the procedural gait; null returns to it. */
  function setClips(clips: THREE.AnimationClip[] | null): void {
    if (gait) { gait.dispose(); gait = null; }
    for (const [name, j] of bones) j.quaternion.copy(bindLocal.get(name)!); hips.position.y = hipsRestY;
    if (clips && clips.length) gait = installGait(rig, clips, motion);
  }
  function dispose() {
    setClips(null); group.removeFromParent(); sphere.dispose(); leafGeo.dispose();
    for (const material of [skin, leaf, lightLeaf, hair, bark, eyes]) material.dispose();
  }
  return { group, rig, motion, joints, bones, bindLocal, skeletonHeight, height: o.height, update, setClips, get gait() { return gait; }, dispose };
}
