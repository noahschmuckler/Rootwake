// Lab-only controls: fast travel is a convenience; the annex is also physically reachable.
import * as THREE from 'three';
import type { Player } from './player';
import type { RustMonsterGallery } from './rustmonster_gallery';
import { GROUND_Y } from './cave';
import { STUDY_BAYS } from './labLayout';
import type { MobilityCourse } from './mobilityCourse';
import { COURSE_SPAWNS, type CourseSection } from './mobilityCourseLayout';

export function installLabControls(gallery: RustMonsterGallery, player: Player, camera: THREE.PerspectiveCamera, course: MobilityCourse, trialLegs: (on: boolean) => boolean): void {
  const panel = document.createElement('section');
  panel.id = 'lab-controls';
  panel.setAttribute('aria-label', 'Rust monster laboratory controls');
  panel.innerHTML = `<div class="lab-row"><strong>LAB 3.0</strong><select aria-label="Viewing position" id="lab-view"><option value="live">Live pit</option><option value="hall">Study hall entrance</option>${STUDY_BAYS.map(b => `<option value="${b.id}">${b.title}</option>`).join('')}${Object.entries(COURSE_SPAWNS).map(([id, s]) => `<option value="${id}">${s.label}</option>`).join('')}</select></div><div class="lab-row"><button id="lab-pause">Pause studies</button><button id="lab-step">Step</button><button id="lab-restart">Restart</button><select id="lab-speed" aria-label="Playback speed"><option value="1">1x</option><option value="0.5">0.5x</option><option value="0.25">0.25x</option></select></div>`;
  document.body.appendChild(panel);
  const campaign = document.createElement('a');
  campaign.textContent = 'The Broken Conduit · seven-character campaign';
  campaign.href = (location.pathname.endsWith('/lab/') ? '../' : './') + 'conduit.html';
  campaign.style.cssText = 'display:block;padding:8px 0 2px;color:#e2cb99;font:12px system-ui';
  panel.appendChild(campaign);
  course.installControls(panel, player, trialLegs);
  const style = document.createElement('style');
  style.textContent = `#lab-controls{position:fixed;z-index:15;top:calc(env(safe-area-inset-top,0px) + 8px);left:12px;width:min(440px,calc(100vw - 24px));box-sizing:border-box;padding:8px 10px;background:#101c26ed;border:1px solid #536b76;border-radius:9px;color:#dce6ed;font:12px system-ui;touch-action:manipulation}.lab-row{display:flex;gap:6px;align-items:center}.lab-row+.lab-row{margin-top:6px}#lab-controls strong{white-space:nowrap;color:#a4ccd0;letter-spacing:1px}#lab-controls select,#lab-controls button{color:#dfebf1;background:#22333f;border:1px solid #526975;border-radius:5px;min-height:32px;padding:4px 7px;font:12px system-ui}#lab-view{flex:1;min-width:0}#lab-controls button{cursor:pointer;flex:1}#text{top:calc(env(safe-area-inset-top,0px) + 108px)!important;pointer-events:none}`;
  document.head.appendChild(style);
  for (const type of ['pointerdown', 'pointerup', 'touchstart', 'touchend']) panel.addEventListener(type, e => e.stopPropagation());
  const pause = panel.querySelector<HTMLButtonElement>('#lab-pause')!;
  pause.onclick = () => { gallery.paused = !gallery.paused; pause.textContent = gallery.paused ? 'Play studies' : 'Pause studies'; };
  panel.querySelector<HTMLButtonElement>('#lab-step')!.onclick = () => { gallery.step(); pause.textContent = 'Play studies'; };
  panel.querySelector<HTMLButtonElement>('#lab-restart')!.onclick = () => { gallery.restart(); gallery.paused = false; pause.textContent = 'Pause studies'; };
  panel.querySelector<HTMLSelectElement>('#lab-speed')!.onchange = e => gallery.playbackRate = Number((e.target as HTMLSelectElement).value);
  const views = panel.querySelector<HTMLSelectElement>('#lab-view')!;
  const frameView = (): void => {
    const bay = STUDY_BAYS.find(b => b.id === views.value);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.fov = bay ? (bay.id === 'surface' ? (camera.aspect < 0.8 ? 118 : 72) : (camera.aspect < 0.8 ? 78 : 60)) : views.value in COURSE_SPAWNS ? (camera.aspect < 0.8 ? 72 : 56) : 40;
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', frameView);
  const view = (id: string): void => {
    const bay = STUDY_BAYS.find(b => b.id === id);
    if (id in COURSE_SPAWNS) {
      course.select(id as CourseSection, player); frameView(); return;
    }
    player.cancelInput(); player.view = 'first';
    let target = new THREE.Vector3(0, GROUND_Y + 2.0, -3.5);
    if (bay) {
      // Stand at the open edge, not behind a floor that occludes the feet.
      player.teleport(bay.x, 5.3);
      target = new THREE.Vector3(bay.x, GROUND_Y + (id === 'surface' ? 3.85 : id === 'feeding' ? 3.5 : 2.4), 0.65);
    } else if (id === 'hall') {
      player.teleport(15.1, 7.2);
      target.set(23, GROUND_Y + 2.3, 0);
    } else player.teleport(0, 7.2);
    const eye = player.eye();
    const delta = target.sub(eye);
    player.yaw = Math.atan2(-delta.x, -delta.z);
    player.pitch = Math.atan2(delta.y, Math.hypot(delta.x, delta.z));
    // In portrait, fit a whole study rather than cropping both sides of the square circuit.
    frameView();
    // Empty inventory boxes otherwise cover the specimen's feeler tips.
    const hands = document.getElementById('hands');
    if (hands) hands.style.visibility = bay ? 'hidden' : '';
    gallery.setObserver(player.eye());
  };
  views.onchange = () => view(views.value);
  const initial = new URLSearchParams(location.search).get('course') ?? new URLSearchParams(location.search).get('study');
  if (initial && Array.from(views.options).some(o => o.value === initial)) {
    views.value = initial;
    // Frame after bootUnder has completed its initial camera and HUD setup.
    requestAnimationFrame(() => view(initial));
  }
}
