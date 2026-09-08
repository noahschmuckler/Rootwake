import type { Player } from './player';
import { THUMBSTICK_RADIUS } from './movementGesture';

/** Shared binding, installed by both entry points. Each stick owns one captured pointer. */
export function installMobilityControls(player: Player): void {
  const right = document.getElementById('walk') as HTMLButtonElement;
  right.classList.add('mobility-stick');
  right.setAttribute('aria-label', 'Movement thumbstick. Drag to walk or run. Hold still for jump targets. Double tap and hold for powered hover.');
  right.innerHTML = '<span class="stick-cross"></span><span class="stick-puck"></span><span class="stick-label">MOVE</span>';
  const left = document.createElement('button');
  left.id = 'flight-stick'; left.type = 'button'; left.className = 'mobility-stick'; left.hidden = true;
  left.setAttribute('aria-label', 'Flight thumbstick. Up and down change altitude; left and right rotate.');
  left.innerHTML = '<span class="stick-cross"></span><span class="stick-puck"></span><span class="stick-label">LIFT / TURN</span>';
  const status = document.createElement('div'); status.id = 'mobility-status'; status.setAttribute('role', 'status');
  document.body.append(left, status);
  const style = document.createElement('style');
  style.textContent = `
    #tools:not(.locked){bottom:calc(env(safe-area-inset-bottom,0px) + 158px);right:16px;gap:8px}
    #tools #walk,#flight-stick{position:fixed;bottom:calc(env(safe-area-inset-bottom,0px) + 22px);width:116px;height:116px;border-radius:50%;border:2px solid #abc6bc99;background:radial-gradient(circle,#2a403aee 0 22%,#162824d9 24% 68%,#52786c99 69% 71%,#162824d9 72%);color:#e2f8ed;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;z-index:20;padding:0;display:block;box-sizing:border-box}
    #tools #walk{right:20px}#flight-stick{left:20px}#flight-stick[hidden],#tools #walk[hidden]{display:none}
    .stick-cross{position:absolute;inset:18px;background:linear-gradient(transparent 49%,#bad8cc44 50%,transparent 51%),linear-gradient(90deg,transparent 49%,#bad8cc44 50%,transparent 51%);pointer-events:none}
    .stick-puck{position:absolute;left:calc(50% - 19px);top:calc(50% - 19px);width:38px;height:38px;border:2px solid #d8ffebcc;border-radius:50%;background:#7ba596aa;box-sizing:border-box;box-shadow:0 3px 12px #0006;pointer-events:none}
    .stick-label{position:absolute;left:0;right:0;bottom:9px;font:9px system-ui;letter-spacing:1px;text-align:center;pointer-events:none}
    #tools #walk.targeting{border-color:#ffd389;box-shadow:0 0 16px #ffbb5544}#tools #walk.flying,#flight-stick{border-color:#8bdaeeaa}
    #mobility-status{position:fixed;z-index:12;bottom:calc(env(safe-area-inset-bottom,0px) + 148px);left:14px;max-width:calc(100vw - 100px);padding:5px 8px;border-radius:6px;background:#0c1b24d9;color:#deecea;font:11px/1.4 system-ui;pointer-events:none;white-space:pre-line}
    @media(max-height:500px){#tools:not(.locked){bottom:152px;flex-direction:row}#mobility-status{bottom:12px;left:150px;max-width:calc(100vw - 300px)}}
  `;
  document.head.appendChild(style);
  const rPuck = right.querySelector<HTMLElement>('.stick-puck')!, lPuck = left.querySelector<HTMLElement>('.stick-puck')!;
  let leftId: number | null = null, leftX = 0, leftY = 0;
  const capture = (el: HTMLElement, e: PointerEvent): void => { e.preventDefault(); e.stopPropagation(); try { el.setPointerCapture(e.pointerId); } catch { /* Synthetic browser tests. */ } };
  right.addEventListener('pointerdown', e => { capture(right, e); player.startMove(e); });
  right.addEventListener('pointermove', e => { e.preventDefault(); player.pointerMove(e); });
  for (const event of ['pointerup', 'pointercancel', 'lostpointercapture'] as const) right.addEventListener(event, e => player.pointerUp(e));
  left.addEventListener('pointerdown', e => {
    if (leftId !== null || !player.isFlying || !player.enabled) return;
    capture(left, e); leftId = e.pointerId; leftX = e.clientX; leftY = e.clientY; player.flightStick.held = true;
  });
  left.addEventListener('pointermove', e => {
    if (e.pointerId !== leftId) return;
    e.preventDefault(); const x = e.clientX - leftX, y = e.clientY - leftY, radius = Math.max(THUMBSTICK_RADIUS, Math.hypot(x, y));
    player.flightStick.x = x / radius; player.flightStick.y = y / radius;
  });
  const endLeft = (e: PointerEvent): void => { if (e.pointerId === leftId) { leftId = null; player.flightStick.held = false; player.flightStick.x = 0; player.flightStick.y = 0; } };
  for (const event of ['pointerup', 'pointercancel', 'lostpointercapture'] as const) left.addEventListener(event, endLeft);
  const acceptedKeys = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyQ', 'KeyE', 'KeyR', 'KeyV']);
  window.addEventListener('keydown', e => {
    if (!player.enabled || /INPUT|TEXTAREA|SELECT/.test((e.target as HTMLElement)?.tagName ?? '')) return;
    if (acceptedKeys.has(e.code)) { e.preventDefault(); player.keys.add(e.code); }
    if (e.code === 'KeyF' && !e.repeat) { if (player.isFlying) player.motor.cutThrusters(); else player.motor.ignite(); }
  });
  window.addEventListener('keyup', e => player.keys.delete(e.code));
  player.onMobilityFrame = () => {
    if (!player.flightStick.held) leftId = null;
    const active = player.enabled && !right.hidden;
    left.hidden = !active || !player.isFlying;
    if (left.hidden) { leftId = null; player.flightStick.held = false; player.flightStick.x = 0; player.flightStick.y = 0; }
    rPuck.style.transform = `translate(${player.gesture.x * 36}px,${player.gesture.y * 36}px)`;
    lPuck.style.transform = `translate(${player.flightStick.x * 36}px,${player.flightStick.y * 36}px)`;
    right.classList.toggle('targeting', player.targeting); right.classList.toggle('flying', player.isFlying);
    right.classList.toggle('active', player.gesture.held);
    status.hidden = !active;
    const selected = player.selectedTarget;
    if (player.targeting) status.textContent = selected ? `${selected.plan.kind.toUpperCase()}  ${Math.hypot(selected.plan.to.x - selected.plan.from.x, selected.plan.to.z - selected.plan.from.z).toFixed(1)} m  |  height ${selected.plan.to.y - selected.plan.from.y >= 0 ? '+' : ''}${(selected.plan.to.y - selected.plan.from.y).toFixed(1)} m\nRelease to move. Return to centre to cancel.` : 'AIM: direction + distance select a safe landing.\nGreen: walk / gold: jump / blue: drop. Centre cancels.';
    else if (player.isFlying) status.textContent = `${player.motor.mode === 'descending' ? 'LANDING' : 'HOVER'}  |  ${player.motor.speed.toFixed(1)} m/s\nLeft: altitude / turn. Right: strafe / advance. Double tap to cut.`;
    else if (player.motor.mode === 'falling') status.textContent = 'FALLING - thrusters off';
    else status.textContent = `${player.poweredLegs ? 'POWERED' : 'WALK / RUN'}  ${player.motor.speed.toFixed(1)} m/s\nHold centre for targets.${player.poweredLegs ? ' Double tap + hold to hover.' : ''}`;
  };
  player.onMobilityFrame();
}
