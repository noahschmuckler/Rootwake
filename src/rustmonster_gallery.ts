// The gallery supplies actions, routes and a clock. RustMonster renders the actual poses.
import * as THREE from 'three';
import { OreVein } from './orevein';
import { BODY_HEIGHT, WALL_HUG, RustMonster, TICKLE_S, SCRAPE_S, GROOM_S, type MonsterStudyFrame } from './rustmonster';
import { SquareSurfaceRoute } from './creatureMotion';
import { GROUND_Y } from './cave';
import { STUDY_BAYS, STUDY_RISE, STUDY_CENTRE_Z, STUDY_WIDTH, STUDY_DEPTH, STUDY_HEIGHT, type StudyId } from './labLayout';

const rock = new THREE.MeshStandardMaterial({ color: 0x252d35, roughness: 0.9 });
const metal = new THREE.MeshStandardMaterial({ color: 0x748592, roughness: 0.55, metalness: 0.45 });
const ground = new THREE.MeshStandardMaterial({ color: 0x171f26, roughness: 0.9 });
function box(w: number, h: number, d: number, mat: THREE.Material, x: number, y: number, z: number): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  return m;
}
export function labSign(title: string, subtitle: string, width = 4.8): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 160;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Lab labels require a 2D canvas');
  ctx.fillStyle = '#111c25'; ctx.fillRect(0, 0, 1024, 160);
  ctx.fillStyle = '#98c5c9'; ctx.fillRect(0, 0, 8, 160);
  ctx.fillStyle = '#e5edf1'; ctx.font = '600 38px system-ui';
  ctx.fillText(title, 34, 61);
  ctx.fillStyle = '#a8bfc9'; ctx.font = '28px system-ui'; ctx.fillText(subtitle, 34, 112);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sign = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, fog: false }));
  sign.scale.set(width, width * 160 / 1024, 1);
  return sign;
}
interface Study {
  id: StudyId;
  monster: RustMonster;
  group: THREE.Group;
  sample(seconds: number): MonsterStudyFrame;
  reset?(): void;
}

export class RustMonsterGallery {
  readonly group = new THREE.Group();
  readonly studies: Study[] = [];
  readonly surfaceRoute = new SquareSurfaceRoute();
  paused = false;
  playbackRate = 1;
  clockMs = 1;
  private lastMs: number | null = null;
  private queuedSteps = 0;

  constructor(scene: THREE.Scene, _floorY: number, seed: number) {
    this.group.name = 'study-annex';
    scene.add(this.group);
    const wayfinding = labSign('MOVEMENT STUDIES  >', 'East annex - open viewing aisle', 3.0);
    wayfinding.position.set(8.2, GROUND_Y + 5.4, 6.9);
    scene.add(wayfinding);
    const hallSign = labSign('<  LIVE PIT', 'Return through the connector', 2.8);
    hallSign.position.set(14.8, GROUND_Y + 5.3, 8.9);
    this.group.add(hallSign);

    for (let i = 0; i < STUDY_BAYS.length; i++) {
      const spec = STUDY_BAYS[i];
      const bay = new THREE.Group();
      bay.name = `study-${spec.id}`;
      bay.position.set(spec.x, GROUND_Y + STUDY_RISE, STUDY_CENTRE_Z);
      this.group.add(bay);
      bay.add(box(STUDY_WIDTH, 0.08, STUDY_DEPTH, ground, 0, -0.04, 0));
      bay.add(box(STUDY_WIDTH, STUDY_HEIGHT, 0.12, rock, 0, STUDY_HEIGHT / 2, -STUDY_DEPTH / 2));
      // Partitions stop 3 m short of the viewing edge; no sill or rail across the front.
      for (const side of [-1, 1]) bay.add(box(0.12, STUDY_HEIGHT, 4.5, rock, side * STUDY_WIDTH / 2, STUDY_HEIGHT / 2, -1.5));
      const sign = labSign(spec.title, spec.note);
      sign.position.set(0, STUDY_HEIGHT - 0.1, -2.9);
      bay.add(sign);
      const monster = new RustMonster(0, new THREE.Vector3(), [], () => true, seed ^ (0x100 + i));
      bay.add(monster.group);
      const floorFrame = (heading = 0, speed = 0): MonsterStudyFrame => ({ mode: speed > 0 ? 'skitter' : 'freeze', surface: 'floor', position: new THREE.Vector3(0, BODY_HEIGHT, 0.35), heading, speed });
      let sample: Study['sample'];
      let reset: Study['reset'];
      switch (spec.id) {
        case 'gait': {
          const stripes = Array.from({ length: 16 }, (_, n) => {
            const stripe = box(0.035, 0.015, 2.1, metal, n * 0.3 - 2.25, 0.013, 0.35);
            bay.add(stripe); return stripe;
          });
          sample = (seconds) => {
            // Belt and stance move backward at the same nominal speed.
            stripes.forEach((stripe, n) => stripe.position.x = ((n * 0.3 - seconds * 3.4) % 4.8 + 4.8) % 4.8 - 2.4);
            return floorFrame(-Math.PI / 2, 3.4);
          };
          break;
        }
        case 'surface': {
          const { width, height } = this.surfaceRoute;
          bay.add(box(width + 0.3, 0.15, 2.1, rock, 0, -0.075, 0));
          bay.add(box(width + 0.3, 0.15, 2.1, rock, 0, height + 0.075, 0));
          for (const side of [-1, 1]) bay.add(box(0.15, height, 2.1, rock, side * (width / 2 + 0.075), height / 2, 0));
          // Thin stripes mark the contact surfaces without pretending to be the surfaces themselves.
          for (const y of [0.008, height - 0.008]) bay.add(box(width, 0.016, 0.055, metal, 0, y, 1.02));
          sample = (seconds) => {
            const distance = 1.0 + seconds * 0.9;
            const frame = this.surfaceRoute.sample(distance);
            const surface = frame.up.y > 0.999 ? 'floor' : frame.up.y < -0.999 ? 'ceiling' : 'wall';
            return { mode: surface === 'floor' ? 'skitter' : 'wallmove', surface,
              position: frame.position, forward: frame.forward, up: frame.up, heading: 0, speed: 0.9,
              route: { path: this.surfaceRoute, distance } };
          };
          break;
        }
        case 'feeding': {
          // A nearer working panel, not a specimen pushed to the back of the deep enclosure.
          const panelZ = -0.95;
          bay.add(box(3.4, 4.8, 0.16, rock, 0, 2.4, panelZ - 0.08));
          const vein = new OreVein(new THREE.Vector3(0, 2.9, panelZ), new THREE.Vector3(0, 0, 1), seed ^ 0xfeed);
          bay.add(vein.group);
          const total = TICKLE_S + SCRAPE_S + 2 * GROOM_S + 2.6;
          let lastCycle = -1;
          sample = (seconds) => {
            const cycle = Math.floor(seconds / total);
            if (cycle !== lastCycle) { monster.resetStudy(); vein.setRust(0); lastCycle = cycle; }
            let t = seconds % total;
            let mode: MonsterStudyFrame['mode'] = 'wallfreeze', progress = 0, groomSide: 0 | 1 = 0;
            if (t < TICKLE_S) { mode = 'tickle'; progress = t / TICKLE_S; }
            else if ((t -= TICKLE_S) < SCRAPE_S) { mode = 'scrape'; progress = t / SCRAPE_S; }
            else if ((t -= SCRAPE_S) < GROOM_S * 2) { mode = 'groom'; groomSide = t < GROOM_S ? 0 : 1; progress = (t % GROOM_S) / GROOM_S; }
            return { mode, surface: 'wall', position: new THREE.Vector3(0, 1.95, panelZ + WALL_HUG),
              heading: 0, speed: 0, up: new THREE.Vector3(0, 0, 1), forward: new THREE.Vector3(0, 1, 0), vein, progress, groomSide };
          };
          reset = () => { lastCycle = -1; vein.setRust(0); };
          break;
        }
        case 'turn': {
          // A real closed S-shaped journey; the tail follows travelled headings rather than a pinned root.
          const route = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-1.8, BODY_HEIGHT, -1.3), new THREE.Vector3(0, BODY_HEIGHT, -1.25),
            new THREE.Vector3(1.7, BODY_HEIGHT, -0.8), new THREE.Vector3(1.2, BODY_HEIGHT, 0.45),
            new THREE.Vector3(-0.4, BODY_HEIGHT, 0.35), new THREE.Vector3(-1.5, BODY_HEIGHT, 1.25),
            new THREE.Vector3(0.4, BODY_HEIGHT, 1.6), new THREE.Vector3(1.9, BODY_HEIGHT, 0.9),
            new THREE.Vector3(0.1, BODY_HEIGHT, -0.3), new THREE.Vector3(-1.9, BODY_HEIGHT, -0.4),
          ], true, 'centripetal');
          const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(route.getPoints(160).map(p => new THREE.Vector3(p.x, 0.008, p.z))), new THREE.LineBasicMaterial({ color: 0x607582 }));
          bay.add(line);
          const length = route.getLength();
          sample = (seconds) => {
            const u = (seconds / 16) % 1;
            const tangent = route.getTangentAt(u);
            return { ...floorFrame(), mode: 'skitter', position: route.getPointAt(u), heading: Math.atan2(-tangent.x, -tangent.z), speed: length / 16 };
          };
          break;
        }
        case 'regard':
          sample = (seconds) => ({ ...floorFrame(Math.PI), mode: seconds % 6 < 2.5 ? 'regard' : 'freeze' });
          break;
        case 'idle':
          sample = (seconds) => {
            const t = seconds % 10;
            const heading = t < 2 ? THREE.MathUtils.smoothstep(t / 2, 0, 1) * 1.1 : t < 5 ? 1.1 : t < 7 ? (1 - THREE.MathUtils.smoothstep((t - 5) / 2, 0, 1)) * 1.1 : 0;
            return floorFrame(heading, 0);
          };
          break;
      }
      this.studies.push({ id: spec.id, monster, group: bay, sample, reset });
    }
  }

  restart(): void {
    this.clockMs = 1;
    for (const study of this.studies) { study.monster.resetStudy(); study.reset?.(); }
  }
  step(): void { this.paused = true; this.queuedSteps++; }
  /** Visibility is navigation state, not playback state; update it even without an animation step. */
  setObserver(player: THREE.Vector3): void {
    for (const study of this.studies) study.group.visible = Math.abs(player.x - study.group.position.x) < 16;
  }

  update(nowMs: number, player: THREE.Vector3): void {
    const dt = this.lastMs === null ? 0 : Math.min(0.1, Math.max(0, (nowMs - this.lastMs) / 1000));
    this.lastMs = nowMs;
    // View changes must remain usable while playback is paused.
    this.setObserver(player);
    if (!this.paused) this.clockMs += dt * 1000 * this.playbackRate;
    else if (this.queuedSteps) { this.clockMs += 1000 / 60; this.queuedSteps--; }
    else return;
    for (const study of this.studies) {
      // Culling rendering, not the animation clock, preserves the loop when moving between bays.
      study.group.visible = Math.abs(player.x - study.group.position.x) < 16;
      study.monster.updateStudy(this.clockMs, study.sample(this.clockMs / 1000), player);
    }
  }
}
