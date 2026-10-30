// O1 (OPENING_SEQUENCE.md §4, ADVERSARIES.md): Petal, the infant Delvira, in 2D: a baby flower fairy drawn on a canvas, smiling,
// who steps out of the UI to speak in short sentences. Hulda never answers. A tap on her or her bubble gives the next line;
// the last line of a speech stays until the entry says she is done. (She grows toward Gozer with every deal: not this slice.)
export interface Petal {
  /** Say these lines one at a time; `onDone` fires after the last is tapped away (or at once when `hold`, the last line waits on the entry). */
  say(lines: string[], onDone?: () => void, hold?: boolean): void;
  /** The next line (a tap). */ next(): void;
  hide(): void;
  readonly talking: boolean; readonly line: string | null; readonly el: HTMLElement;
}

export function createPetal(): Petal {
  const style = document.createElement('style');
  style.textContent = `#petal{position:fixed;z-index:23;left:12px;bottom:calc(env(safe-area-inset-bottom,0px) + 118px);display:flex;align-items:flex-end;gap:8px;opacity:0;transform:translateY(12px) scale(.9);transition:opacity .5s,transform .5s;pointer-events:none}#petal.on{opacity:1;transform:none;pointer-events:auto}#petal img{width:104px;height:104px;animation:petalBob 3.2s ease-in-out infinite}#petal .bubble{position:relative;max-width:min(230px,58vw);margin-bottom:46px;padding:10px 13px;border-radius:14px;background:#fff7e6f2;color:#3a2a30;font:15px/1.35 Georgia,serif;box-shadow:0 4px 14px #0007}#petal .bubble::after{content:'';position:absolute;left:-9px;bottom:14px;border:9px solid transparent;border-right-color:#fff7e6f2;border-left:0}#petal .bubble i{display:block;margin-top:6px;font:11px/1 system-ui;letter-spacing:.5px;color:#9a7a88;text-transform:uppercase}@keyframes petalBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}`;
  document.head.append(style);
  const el = document.createElement('div'); el.id = 'petal'; el.hidden = true;
  // Drawn once on a canvas and shown as an image: a live 2D canvas composited over the WebGL canvas costs a software compositor (the headless check's SwiftShader) whole seconds a frame; an image is a plain layer.
  const canvas = document.createElement('canvas'); canvas.width = 208; canvas.height = 208; draw(canvas.getContext('2d')!);
  const img = document.createElement('img'); img.alt = 'Petal'; img.draggable = false; img.src = canvas.toDataURL();
  const bubble = document.createElement('div'); bubble.className = 'bubble'; const text = document.createElement('span'); const hint = document.createElement('i'); bubble.append(text, hint); el.append(img, bubble); document.body.append(el);
  let lines: string[] = [], i = 0, onDone: (() => void) | null = null, hold = false;
  function show(): void { text.textContent = lines[i]; hint.textContent = i < lines.length - 1 ? 'tap' : hold ? '' : 'tap'; hint.hidden = hint.textContent === ''; }
  function say(ls: string[], done?: () => void, h = false): void { lines = ls.slice(); i = 0; onDone = done ?? null; hold = h; el.hidden = false; requestAnimationFrame(() => el.classList.add('on')); show(); }
  function next(): void { if (!lines.length) return; if (i < lines.length - 1) { i++; show(); return; } if (hold) return; const d = onDone; hide(); d?.(); }
  function hide(): void { lines = []; i = 0; onDone = null; el.classList.remove('on'); window.setTimeout(() => { if (!lines.length) el.hidden = true; }, 520); }
  el.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); next(); });
  return { say, next, hide, el, get talking() { return lines.length > 0; }, get line() { return lines.length ? lines[i] : null; } };
}

/** The infant flower fairy: a corolla of petals round a round face, big eyes, a smile, a leaf of a body. */
function draw(c: CanvasRenderingContext2D): void {
  const cx = 104, cy = 84; c.lineWidth = 3; c.lineJoin = 'round';
  // The body: a green leaf dress, two leaf arms, bare feet.
  c.fillStyle = '#7ed957'; c.strokeStyle = '#2f5a2a';
  c.beginPath(); c.moveTo(cx, cy + 34); c.quadraticCurveTo(cx + 34, cy + 70, cx + 10, cy + 112); c.lineTo(cx - 10, cy + 112); c.quadraticCurveTo(cx - 34, cy + 70, cx, cy + 34); c.closePath(); c.fill(); c.stroke();
  for (const s of [-1, 1]) { c.beginPath(); c.moveTo(cx + s * 14, cy + 58); c.quadraticCurveTo(cx + s * 44, cy + 48, cx + s * 52, cy + 72); c.quadraticCurveTo(cx + s * 34, cy + 72, cx + s * 14, cy + 66); c.closePath(); c.fill(); c.stroke(); }
  c.fillStyle = '#ffd9bf'; for (const s of [-1, 1]) { c.beginPath(); c.ellipse(cx + s * 9, cy + 116, 9, 5, 0, 0, Math.PI * 2); c.fill(); c.stroke(); }
  // The corolla: ten petals of rose, lighter at the edge.
  for (let k = 0; k < 10; k++) {
    const a = k / 10 * Math.PI * 2 - Math.PI / 2; c.save(); c.translate(cx + Math.cos(a) * 40, cy + Math.sin(a) * 40); c.rotate(a);
    const g = c.createLinearGradient(-18, 0, 18, 0); g.addColorStop(0, '#f07aa8'); g.addColorStop(1, '#ffc6dc'); c.fillStyle = g; c.strokeStyle = '#8a3a60';
    c.beginPath(); c.ellipse(0, 0, 22, 12, 0, 0, Math.PI * 2); c.fill(); c.stroke(); c.restore();
  }
  // The face.
  c.fillStyle = '#ffe3cf'; c.strokeStyle = '#5a3a40'; c.beginPath(); c.arc(cx, cy, 34, 0, Math.PI * 2); c.fill(); c.stroke();
  c.fillStyle = '#f7a3b8'; c.globalAlpha = 0.6; for (const s of [-1, 1]) { c.beginPath(); c.arc(cx + s * 20, cy + 10, 7, 0, Math.PI * 2); c.fill(); } c.globalAlpha = 1;
  c.fillStyle = '#3a2430'; for (const s of [-1, 1]) { c.beginPath(); c.ellipse(cx + s * 12, cy - 2, 7, 9, 0, 0, Math.PI * 2); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(cx + s * 12 - 2, cy - 5, 2.6, 0, Math.PI * 2); c.fill(); c.beginPath(); c.arc(cx + s * 12 + 2, cy + 1, 1.3, 0, Math.PI * 2); c.fill(); c.fillStyle = '#3a2430'; }
  c.strokeStyle = '#5a3a40'; c.lineWidth = 3; c.beginPath(); c.arc(cx, cy + 8, 11, Math.PI * 0.15, Math.PI * 0.85); c.stroke();
  // A sprout of hair with a dewdrop.
  c.strokeStyle = '#2f5a2a'; c.beginPath(); c.moveTo(cx, cy - 34); c.quadraticCurveTo(cx + 8, cy - 52, cx - 4, cy - 60); c.stroke();
  c.fillStyle = '#bfe8ff'; c.beginPath(); c.arc(cx - 5, cy - 62, 4, 0, Math.PI * 2); c.fill();
}
