// The tree stag (Noah, 2026-10-22; STAGS.md): an oily, leathery, gaunt black figure with a deer stag's skull for a
// head, stained oily black too, its eyes pulsing with the Colour and the rhythm of the mother's heartbeat. It steps out
// of the twitching trees.
//
// It wears the X Bot skeleton (src/huldaSkeleton.json), as every figure does, so the Mixamo clips walk it and strike
// with it. The dressing is its own: limbs too long and too thin for the bones, a ribcage over a starved belly, knuckled
// knees and elbows, long fingers ending in claws. The skull is a long cranium and a downturned muzzle, empty sockets
// with the eyes deep in them, and antlers of a main beam with tines. The hide is near black and oily (low roughness,
// a little metal), the skull a shade lighter so it reads. Tuning constants at the top.
import * as THREE from 'three';
import skeletonData from './huldaSkeleton.json';
import { HuldaMotion } from './huldaMotion';
import { installGait, MODEL_HEIGHT, type Gait } from './huldaRig';
import { taperedTube } from './flora';

/** Its height to the top of the skull (m); the antlers rise above. Tuning. */
export const STAG_HEIGHT = 1.9;
/** The Colour of its eyes: the in-breath's magenta and, at the out-breath's height, flicker toward its yellow and green (MOTHER.md); the eyes swell with each beat. Tuning. */
const EYE_IN = new THREE.Color('#ff2fb4'), EYE_OUT = [new THREE.Color('#f4ff3a'), new THREE.Color('#3aff8a'), new THREE.Color('#ff7a1a')], EYE_SWELL = 0.8;
const HIDE = '#0e0a0d', SKULL = '#3a332c';
/** How much thinner than its bones its flesh is. Tuning. */
const GAUNT = 0.62;

interface BoneData { name: string; parent: string | null; position: number[]; quaternion: number[]; scale: number[] }
const SKELETON: { root: string; bones: BoneData[] } = skeletonData;

export interface StagLook { moving: boolean; speed: number; heading: number; hurt: number; rooted: number; inTree: boolean; emerging: boolean; tell: number; pulse: number; attention: number }
export interface TreeStagFigure { group: THREE.Group; update(s: StagLook, dt: number, t: number): void; setClips(clips: THREE.AnimationClip[] | null): void; attack(): void }

export function createTreeStag(seed = 1): TreeStagFigure {
  const group = new THREE.Group(); group.name = 'tree-stag';
  const rig = new THREE.Group(); group.add(rig);
  const bones = new Map<string, THREE.Bone>(), bind = new Map<string, THREE.Quaternion>();
  for (const b of SKELETON.bones) {
    const j = new THREE.Bone(); j.name = b.name; j.position.fromArray(b.position); j.quaternion.fromArray(b.quaternion).normalize(); j.scale.fromArray(b.scale);
    (b.parent ? bones.get(b.parent)! : rig).add(j); bones.set(b.name, j); bind.set(b.name, j.quaternion.clone());
  }
  rig.updateMatrixWorld(true);
  const J = (short: string): THREE.Bone => bones.get('mixamorig' + short)!;
  const top = new THREE.Vector3(); J('HeadTop_End').getWorldPosition(top);
  const skeletonHeight = top.y, s = skeletonHeight / 1.9;
  rig.scale.setScalar(STAG_HEIGHT / skeletonHeight); rig.rotation.y = Math.PI;
  const hide = new THREE.MeshStandardMaterial({ color: HIDE, roughness: 0.2, metalness: 0.35, emissive: '#000000' });
  const bone = new THREE.MeshStandardMaterial({ color: SKULL, roughness: 0.32, metalness: 0.2 });
  const socket = new THREE.MeshBasicMaterial({ color: '#030102' }), eyeMat = new THREE.MeshBasicMaterial({ color: EYE_IN.clone() });
  const sphere = new THREE.SphereGeometry(1, 12, 8);
  const childOf = (c: string): THREE.Vector3 => J(c).position.clone();
  function segment(parent: string, child: string, mat: THREE.Material, rx: number, rz = rx, along = 1): THREE.Mesh {
    const d = childOf(child), L = d.length(), m = new THREE.Mesh(sphere, mat); m.position.copy(d).multiplyScalar(0.5 * along); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()); m.scale.set(rx * GAUNT, L * 0.5 * along, rz * GAUNT); m.castShadow = true; J(parent).add(m); return m;
  }
  function blob(parent: THREE.Object3D, mat: THREE.Material, x: number, y: number, z: number, sx: number, sy: number, sz: number): THREE.Mesh { const m = new THREE.Mesh(sphere, mat); m.position.set(x, y, z); m.scale.set(sx, sy, sz); m.castShadow = true; parent.add(m); return m; }
  const tube = (parent: THREE.Object3D, pts: THREE.Vector3[], r0: number, mat: THREE.Material): void => { const m = new THREE.Mesh(taperedTube(new THREE.CatmullRomCurve3(pts), 10, 6, t => r0 * (1 - t * 0.85), 0.02), mat); m.castShadow = true; parent.add(m); };
  // The starved body: a narrow pelvis, a thin spine, a ribcage of hoops over it, collarbones.
  blob(J('Hips'), hide, 0, -0.01 * s, 0, 0.09 * s, 0.07 * s, 0.065 * s);
  segment('Spine', 'Spine1', hide, 0.075 * s, 0.06 * s, 3.2);
  segment('Spine2', 'Neck', hide, 0.13 * s, 0.085 * s, 0.85);
  const chest = J('Spine2'), ribL = childOf('Neck').length();
  for (let i = 0; i < 5; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(1, 0.06, 5, 14, Math.PI * 1.1), hide); r.scale.set(0.085 * s * (1 - i * 0.07), 0.085 * s * (1 - i * 0.07), 0.065 * s); r.rotation.set(Math.PI / 2, 0, -Math.PI * 0.12); r.position.set(0, ribL * (0.75 - i * 0.18), 0.015 * s); chest.add(r); }
  for (const x of [-1, 1]) segment(x < 0 ? 'LeftShoulder' : 'RightShoulder', x < 0 ? 'LeftArm' : 'RightArm', hide, 0.03 * s);
  // The neck, long; the skull on the head bone.
  segment('Neck', 'Head', hide, 0.038 * s, 0.04 * s, 1.1);
  const head = J('Head'), headTop = childOf('HeadTop_End'), skull = new THREE.Group(); skull.position.set(0, headTop.y * 0.45, 0.01 * s); head.add(skull);
  blob(skull, bone, 0, 0.02 * s, -0.01 * s, 0.075 * s, 0.07 * s, 0.085 * s); // the cranium
  const muzzle = new THREE.Mesh(new THREE.ConeGeometry(0.05 * s, 0.24 * s, 8), bone); muzzle.rotation.x = Math.PI / 2 + 0.35; muzzle.position.set(0, -0.045 * s, 0.14 * s); muzzle.scale.set(1, 1, 0.7); skull.add(muzzle);
  blob(skull, socket, 0, -0.06 * s, 0.245 * s, 0.018 * s, 0.012 * s, 0.012 * s); // the nasal hole at the muzzle's tip
  const eyes: THREE.Mesh[] = [];
  for (const x of [-1, 1]) { blob(skull, socket, x * 0.052 * s, 0.0, 0.055 * s, 0.03 * s, 0.026 * s, 0.024 * s); eyes.push(blob(skull, eyeMat, x * 0.054 * s, 0.0, 0.066 * s, 0.011 * s, 0.011 * s, 0.009 * s)); }
  // The antlers: a main beam up and back from the poll, three tines forward off it.
  const rand = ((n: number) => () => (n = (n * 9301 + 49297) % 233280) / 233280)(seed * 7 + 3);
  for (const x of [-1, 1]) {
    const v = (a: number, b: number, c: number): THREE.Vector3 => new THREE.Vector3(x * a * s, b * s, c * s);
    const beam = [v(0.05, 0.06, -0.02), v(0.16, 0.2, -0.08), v(0.24, 0.38, -0.06), v(0.27, 0.56, 0.02)];
    tube(skull, beam, 0.022 * s, bone);
    const curve = new THREE.CatmullRomCurve3(beam);
    for (const [u, len] of [[0.3, 0.13], [0.55, 0.17], [0.8, 0.12]] as const) { const p = curve.getPoint(u), up = 0.06 + rand() * 0.05; tube(skull, [p, p.clone().add(new THREE.Vector3(x * 0.02 * s, up * s, len * 0.5 * s)), p.clone().add(new THREE.Vector3(x * 0.04 * s, (up + 0.05) * s, len * s))], 0.012 * s, bone); }
    tube(skull, [v(0.04, 0.07, 0.0), v(0.08, 0.12, 0.08), v(0.09, 0.13, 0.15)], 0.012 * s, bone); // the brow tine
  }
  // The limbs, too thin for the bones, knuckled at the joints; long fingers with claws; long toes.
  for (const P of ['Left', 'Right']) {
    segment(P + 'Arm', P + 'ForeArm', hide, 0.03 * s); segment(P + 'ForeArm', P + 'Hand', hide, 0.024 * s);
    blob(J(P + 'ForeArm'), hide, 0, 0, 0, 0.035 * s, 0.035 * s, 0.035 * s);
    segment(P + 'Hand', P + 'HandMiddle1', hide, 0.026 * s, 0.014 * s);
    for (const f of ['Index', 'Middle', 'Ring', 'Pinky', 'Thumb']) {
      for (let k = 1; k <= 3; k++) segment(`${P}Hand${f}${k}`, `${P}Hand${f}${k + 1}`, hide, 0.007 * s, 0.007 * s, 1.35);
      const tip = J(`${P}Hand${f}4`), claw = new THREE.Mesh(new THREE.ConeGeometry(0.006 * s, 0.05 * s, 5), bone); claw.position.y = 0.02 * s; tip.add(claw);
    }
    segment(P + 'UpLeg', P + 'Leg', hide, 0.04 * s); segment(P + 'Leg', P + 'Foot', hide, 0.03 * s);
    blob(J(P + 'Leg'), hide, 0, 0, 0, 0.045 * s, 0.045 * s, 0.045 * s);
    segment(P + 'Foot', P + 'ToeBase', hide, 0.03 * s, 0.018 * s, 1.2); segment(P + 'ToeBase', P + 'Toe_End', bone, 0.02 * s, 0.01 * s, 1.6);
  }
  const motion = new HuldaMotion(); let gait: Gait | null = null, clips: THREE.AnimationClip[] = [], strike: THREE.AnimationAction | null = null, strikeT = 0, flinch = 0, outPick = 0;
  // Its gait is a human's at a human's scale: the clips' strides are Hulda's, so the stag's speed is told to them in her measure.
  const toGait = MODEL_HEIGHT / STAG_HEIGHT;
  return {
    group,
    setClips(c) {
      if (gait) { gait.dispose(); gait = null; strike = null; } for (const [n, j] of bones) j.quaternion.copy(bind.get(n)!);
      clips = c ?? []; if (clips.length) { gait = installGait(rig, clips, motion); const a = clips.find(x => /attack-2|attack-1|heavy/.test(x.name)); if (a) { strike = gait.mixer.clipAction(a); strike.setLoop(THREE.LoopOnce, 1); strike.clampWhenFinished = true; } }
    },
    attack() { if (!strike) return; strike.reset(); strike.setEffectiveWeight(1); strike.play(); strikeT = strike.getClip().duration; },
    update(st, dt, t) {
      group.visible = !st.inTree;
      if (gait) {
        strikeT = Math.max(0, strikeT - dt); gait.suppress = strikeT > 0 ? 1 : 0; if (strike && strikeT <= 0 && strike.isRunning()) strike.stop();
        gait.update(st.rooted > 0 ? 0 : dt, st.moving ? st.speed * toGait : 0, st.heading, true);
      }
      // Stepping out of its tree it shudders, as the trees do; held by the roots it strains; its tell is a hunch and a lowered skull.
      const shake = st.emerging ? 0.04 : st.rooted > 0 ? 0.02 : 0;
      group.rotation.z = shake ? Math.sin(t * 61) * shake : 0; group.rotation.x = -0.25 * st.tell;
      flinch = Math.max(0, flinch - dt * 3); hide.emissive.setRGB(0.6 * Math.max(st.hurt / 0.3, flinch), 0, 0);
      // The eyes: the Colour, beating with her breath.
      if (st.pulse > 0.85 && Math.random() < dt * 6) outPick = Math.floor(Math.random() * EYE_OUT.length);
      eyeMat.color.copy(EYE_IN).lerp(EYE_OUT[outPick], Math.max(0, st.pulse - 0.6) * 2 * (0.4 + st.attention * 0.6)).multiplyScalar(0.7 + st.pulse * 1.3);
      const sw = 1 + st.pulse * EYE_SWELL + st.tell * 0.6; for (const e of eyes) e.scale.set(0.011 * s * sw, 0.011 * s * sw, 0.009 * s * sw);
    },
  };
}
