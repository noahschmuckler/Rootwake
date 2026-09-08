import * as THREE from 'three';
import { buildLook } from './objects';
import type { Player } from './player';
import { BODY_HEIGHT } from './mobility';
import { COURSE, COURSE_PASSAGE, COURSE_SOLIDS, COURSE_SPAWNS, NORMAL_PADS, POWERED_PADS, FLIGHT_GATES, RECOVERY_RAMP, rampHeight, solidHeight, CourseGeometry, crossedGate, type CourseSection } from './mobilityCourseLayout';

function label(text: string, width = 4, color = '#d8edeb'): THREE.Sprite {
  if (typeof document === 'undefined') { const marker = new THREE.Sprite(); marker.name = text; return marker; }
  const canvas = document.createElement('canvas'); canvas.width = 768; canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#10222bea'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = color; ctx.lineWidth = 4; ctx.strokeRect(3, 3, 762, 122);
  ctx.fillStyle = color; ctx.font = 'bold 42px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, 384, 64, 728);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas), depthWrite: false, toneMapped: false }));
  sprite.scale.set(width, width / 6, 1); return sprite;
}

export class MobilityCourse {
  readonly geometry = new CourseGeometry();
  readonly group = new THREE.Group();
  readonly ringMeshes: THREE.Mesh[] = [];
  section: CourseSection = 'track';
  ringIndex = 0;
  normalIndex = 0;
  poweredIndex = 0;
  slalomIndex = 0;
  elapsed: number | null = null;
  peakSpeed = 0;
  private startedAt: number | null = null;
  private previous: THREE.Vector3 | null = null;
  private readonly nextMaterial = new THREE.MeshBasicMaterial({ color: 0xffd784 });
  private readonly futureMaterial = new THREE.MeshBasicMaterial({ color: 0x5b849b, transparent: true, opacity: 0.7 });
  private readonly completeMaterial = new THREE.MeshBasicMaterial({ color: 0x94f7ba });
  private status: HTMLElement | null = null;
  private gearButton: HTMLButtonElement | null = null;

  constructor(scene: THREE.Scene) {
    this.group.name = 'Mobility obstacle course';
    const slab = (w: number, h: number, d: number, x: number, y: number, z: number, color: number): THREE.Mesh => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color, roughness: 0.85 }));
      m.position.set(x, y, z); this.group.add(m); return m;
    };
    slab(COURSE.x1 - COURSE.x0, 0.4, COURSE.z1 - COURSE.z0, (COURSE.x0 + COURSE.x1) / 2, COURSE.floor - 0.2, (COURSE.z0 + COURSE.z1) / 2, 0x283c49);
    slab(COURSE_PASSAGE.x1 - COURSE_PASSAGE.x0, 0.25, COURSE_PASSAGE.z1 - COURSE_PASSAGE.z0, (COURSE_PASSAGE.x0 + COURSE_PASSAGE.x1) / 2, COURSE_PASSAGE.floor - 0.125, (COURSE_PASSAGE.z0 + COURSE_PASSAGE.z1) / 2, 0x536e70);
    for (const z of [COURSE_PASSAGE.z0, COURSE_PASSAGE.z1]) slab(4.2, 3.8, 0.15, 58.9, 3.1, z, 0x253b48);
    slab(4.2, 0.2, 3.5, 58.9, COURSE_PASSAGE.roof + 0.1, 6.85, 0x253b48);
    for (const s of COURSE_SOLIDS) {
      slab(s.x1 - s.x0, s.top - s.bottom, s.z1 - s.z0, (s.x0 + s.x1) / 2, (s.top + s.bottom) / 2, (s.z0 + s.z1) / 2, s.color);
      if (s.rough) {
        const geo = new THREE.PlaneGeometry(s.x1 - s.x0, s.z1 - s.z0, 184, 48); geo.rotateX(-Math.PI / 2);
        const p = geo.getAttribute('position');
        for (let i = 0; i < p.count; i++) p.setY(i, solidHeight(s, p.getX(i) + (s.x0 + s.x1) / 2, p.getZ(i) + (s.z0 + s.z1) / 2) - s.top + 0.002);
        geo.computeVertexNormals();
        const surface = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x526b72, roughness: 1 }));
        surface.position.set((s.x0 + s.x1) / 2, s.top, (s.z0 + s.z1) / 2); this.group.add(surface);
      }
    }
    const rampGeo = new THREE.PlaneGeometry(RECOVERY_RAMP.x1 - RECOVERY_RAMP.x0, RECOVERY_RAMP.z1 - RECOVERY_RAMP.z0, 1, 12); rampGeo.rotateX(-Math.PI / 2);
    const rp = rampGeo.getAttribute('position');
    for (let i = 0; i < rp.count; i++) rp.setY(i, rampHeight(rp.getZ(i) + (RECOVERY_RAMP.z0 + RECOVERY_RAMP.z1) / 2));
    rampGeo.computeVertexNormals();
    const ramp = new THREE.Mesh(rampGeo, new THREE.MeshStandardMaterial({ color: 0x637c75, side: THREE.DoubleSide }));
    ramp.position.set(63, 0, (RECOVERY_RAMP.z0 + RECOVERY_RAMP.z1) / 2); this.group.add(ramp);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x537080, transparent: true, opacity: 0.35 });
    const grid: THREE.Vector3[] = [];
    for (let x = 60; x <= 116; x += 2) grid.push(new THREE.Vector3(x, COURSE.floor + 0.005, -22), new THREE.Vector3(x, COURSE.floor + 0.005, 11));
    for (let z = -22; z <= 10; z += 2) grid.push(new THREE.Vector3(60, COURSE.floor + 0.005, z), new THREE.Vector3(116, COURSE.floor + 0.005, z));
    this.group.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(grid), lineMat));
    // One-metre ticks and a measured 16 m timing interval. Rough patch is inside the track.
    for (let x = 64; x <= 80; x++) {
      const tick = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.012, x % 4 === 0 ? 4.8 : 0.7), new THREE.MeshBasicMaterial({ color: x === 64 || x === 80 ? 0xd6efb4 : 0xa5c5c3 }));
      tick.position.set(x, solidHeight(COURSE_SOLIDS[0], x, 7.5) + 0.02, x % 4 === 0 ? 7.5 : 9.85); this.group.add(tick);
      if ((x - 64) % 4 === 0) { const t = label(`${x - 64} m`, 1); t.position.set(x, 1.9, 10.2); this.group.add(t); }
    }
    const signs: [string, number, number, number, number][] = [
      ['MOBILITY >', 55.5, 3.0, 7, 3],
      ['01 / PRECISION TO RUN', 65, 3.1, 10, 5],
      ['02 / SLALOM', 85, 3.2, 10, 4],
      ['03 / JUMP + DROP', 63, 2.8, -5.7, 4],
      ['04 / PARKOUR', 63, 3.3, 0.5, 3.6],
      ['05 / POWERED PARKOUR', 89, 4.4, 0.6, 5],
      ['06 / HOVER RINGS', 65, 3.8, -7.2, 4],
      ['RECOVERY RAMP', 63, 1, -2, 2.4],
    ];
    for (const [text, x, y, z, w] of signs) { const sign = label(text, w); sign.position.set(x, y, z); this.group.add(sign); }
    for (const [i, pad] of [...NORMAL_PADS, ...POWERED_PADS].entries()) {
      const t = label(`${i < NORMAL_PADS.length ? 'P' + (i + 1) : 'BOOST ' + (i - NORMAL_PADS.length + 1)} / ${(pad.top - 1.2).toFixed(1)} m`, 1.8, i < NORMAL_PADS.length ? '#b2e7d5' : '#ffd28e');
      t.position.set((pad.x0 + pad.x1) / 2, pad.top + 0.48, pad.z0 + 0.05); this.group.add(t);
    }
    for (const [i, gate] of FLIGHT_GATES.entries()) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(gate.radius + 0.09, 0.09, 8, 40), i === 0 ? this.nextMaterial : this.futureMaterial);
      ring.position.copy(gate.centre); ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), gate.normal);
      this.ringMeshes.push(ring); this.group.add(ring);
      const t = label(`RING ${i + 1}`, 1.7); t.position.copy(gate.centre).add(new THREE.Vector3(0, gate.radius + 0.5, 0)); this.group.add(t);
    }
    // Trial racks are explicit lab fixtures. Equipping still calls the real suit pipeline.
    for (const [x, y, z] of [[87, 1.2, 9.8], [63.8, COURSE.floor, -7.5]]) {
      const legs = buildLook('leg_armor'); legs.scale.setScalar(2.2); legs.position.set(x, y + 0.75, z); this.group.add(legs);
      const t = label('TRIAL LEGS / EQUIP', 2.6, '#ffd79e'); t.position.set(x, y + 1.8, z); this.group.add(t);
    }
    // Visible boundary and ceiling frame agree with the movement volume.
    for (const z of [COURSE.z0, COURSE.z1]) slab(56, 0.18, 0.15, 88, COURSE.floor + 0.1, z, 0x7394a2);
    for (const x of [60, 88, 116]) for (const z of [-22, 11]) slab(0.18, 17, 0.18, x, 7.5, z, 0x4c6373);
    for (const x of [60, 88, 116]) slab(0.18, 0.18, 33, x, COURSE.roof, -5.5, 0x4c6373);
    for (const x of [69, 91, 111]) {
      const light = new THREE.PointLight(0xc8e4ee, 100, 30, 1.3); light.position.set(x, 11, -3); this.group.add(light);
    }
    scene.add(this.group);
  }
  reset(): void {
    this.previous = null; this.ringIndex = 0; this.normalIndex = 0; this.poweredIndex = 0; this.slalomIndex = 0; this.startedAt = null; this.elapsed = null; this.peakSpeed = 0;
    this.ringMeshes.forEach((r, i) => r.material = i === 0 ? this.nextMaterial : this.futureMaterial);
  }
  select(section: CourseSection, player: Player): void {
    this.section = section; this.reset(); const p = COURSE_SPAWNS[section]; player.teleport(p.x, p.z, p.yaw);
    player.pitch = section === 'flight' ? 0.12 : -0.12; player.view = 'third'; player.thirdZoom = 1.05;
    const viewButton = document.getElementById('view'); if (viewButton) viewButton.innerHTML = '<b>1st</b>view';
  }
  installControls(panel: HTMLElement, player: Player, trialLegs: (on: boolean) => boolean): void {
    const row = document.createElement('div'); row.id = 'course-actions'; row.className = 'lab-row'; row.hidden = true;
    row.innerHTML = '<button id="course-reset">Reset course</button><button id="trial-legs">Equip trial legs</button>';
    this.status = document.createElement('div'); this.status.id = 'course-progress'; this.status.hidden = true;
    panel.append(row, this.status);
    this.gearButton = row.querySelector<HTMLButtonElement>('#trial-legs')!;
    this.gearButton.onclick = () => { trialLegs(!player.poweredLegs); };
    row.querySelector<HTMLButtonElement>('#course-reset')!.onclick = () => this.select(this.section, player);
    const style = document.createElement('style'); style.textContent = '#course-actions[hidden],#course-progress[hidden]{display:none}#course-progress{margin-top:7px;color:#b8d9d6;font:11px/1.45 system-ui}.course-active #text{display:none}.course-active #hands{visibility:hidden}#trial-legs:disabled{opacity:.45}.course-active #lab-controls{background:#12232be8}'; document.head.appendChild(style);
  }
  update(nowMs: number, player: Player): void {
    const feet = player.feet(); const active = feet.x > 57;
    document.body.classList.toggle('course-active', active);
    const row = document.getElementById('course-actions'); if (row) row.hidden = !active;
    if (this.status) this.status.hidden = !active;
    if (!active) { this.previous = null; return; }
    const nearRack = Math.hypot(feet.x - 87, feet.z - 9.8) < 4 || Math.hypot(feet.x - 63.8, feet.z + 7.5) < 4;
    if (this.gearButton) { this.gearButton.disabled = !nearRack; this.gearButton.textContent = player.poweredLegs ? 'Remove trial legs' : 'Equip trial legs'; this.gearButton.title = nearRack ? 'Uses the same equip/unequip rules as crafted armor' : 'Approach either illuminated trial rack'; }
    this.peakSpeed = Math.max(this.peakSpeed, player.motor.speed);
    const body = feet.clone().add(new THREE.Vector3(0, BODY_HEIGHT / 2, 0));
    if (this.previous && this.previous.distanceTo(body) < 3) {
      if (feet.z > 5 && feet.z < 10 && !player.motor.airborne) {
        if (this.previous.x < 64 && body.x >= 64) { this.startedAt = nowMs; this.elapsed = null; }
        if (this.startedAt !== null && this.previous.x < 80 && body.x >= 80) { this.elapsed = (nowMs - this.startedAt) / 1000; this.startedAt = null; }
      }
      if (player.isFlying && this.ringIndex < FLIGHT_GATES.length && crossedGate(this.previous, body, FLIGHT_GATES[this.ringIndex])) {
        this.ringMeshes[this.ringIndex].material = this.completeMaterial; this.ringIndex++;
        if (this.ringMeshes[this.ringIndex]) this.ringMeshes[this.ringIndex].material = this.nextMaterial;
      }
    }
    const checkPad = (pads: typeof NORMAL_PADS, index: number): number => {
      const pad = pads[index]; if (!pad || player.motor.mode !== 'grounded') return index;
      return Math.abs(feet.y - pad.top) < 0.15 && Math.hypot(feet.x - (pad.x0 + pad.x1) / 2, feet.z - (pad.z0 + pad.z1) / 2) < 1 ? index + 1 : index;
    };
    this.normalIndex = checkPad(NORMAL_PADS, this.normalIndex); this.poweredIndex = checkPad(POWERED_PADS, this.poweredIndex);
    const sx = [87.5, 92.5, 97.5, 102.5, 109][this.slalomIndex], sz = this.slalomIndex % 2 ? 6 : 9;
    if (sx !== undefined && Math.hypot(feet.x - sx, feet.z - sz) < 1 && !player.motor.airborne) this.slalomIndex++;
    this.previous = body;
    if (this.status) {
      const time = this.elapsed !== null ? `${this.elapsed.toFixed(2)} s / 16 m` : this.startedAt !== null ? `${((nowMs - this.startedAt) / 1000).toFixed(1)} s` : 'cross the 0 m line to time';
      this.status.textContent = `Track: ${time} | peak ${this.peakSpeed.toFixed(1)} m/s | Slalom ${this.slalomIndex}/5\nParkour ${this.normalIndex}/${NORMAL_PADS.length} | Powered ${this.poweredIndex}/${POWERED_PADS.length} | Rings ${this.ringIndex}/${FLIGHT_GATES.length}${this.ringIndex === FLIGHT_GATES.length ? ' COMPLETE' : ''}`;
      this.status.style.whiteSpace = 'pre-line';
    }
  }
}
