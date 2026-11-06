// 픽셀 그리기 도우미. 모든 그리기는 320×180 캔버스 하나에 한다.
export const W = 320;
export const H = 180;

let ctx = null;

export function setContext(context) {
  ctx = context;
  ctx.imageSmoothingEnabled = false;
}

export function rect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
}

export function px(x, y, color) {
  rect(x, y, 1, 1, color);
}

// 브레젠험 직선. thick이면 가로로 2픽셀 두께.
export function line(x0, y0, x1, y1, color, thick = false) {
  x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  ctx.fillStyle = color;
  for (;;) {
    ctx.fillRect(x0, y0, thick ? 2 : 1, 1);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
}

// 같은 입력에는 항상 같은 0~1 값을 돌려주는 의사 난수. 배경 배치를 매번 같게 만든다.
export function hash(n) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

// 색을 18% 어둡게
export function shade(hex) {
  const n = parseInt(hex.slice(1), 16);
  const f = v => Math.max(0, Math.round(v * 0.82));
  return '#' + [f(n >> 16), f((n >> 8) & 255), f(n & 255)]
    .map(v => v.toString(16).padStart(2, '0')).join('');
}

// 반지름 6짜리 바퀴 테두리 픽셀 목록
export const ring = (() => {
  const pts = [], r = 6;
  for (let y = -r; y <= r; y++) {
    for (let x = -r; x <= r; x++) {
      if (Math.abs(Math.hypot(x, y) - r) < 0.55) pts.push([x, y]);
    }
  }
  return pts;
})();

export function fadeOverlay(alpha) {
  if (alpha <= 0) return;
  ctx.fillStyle = `rgba(10,8,14,${alpha})`;
  ctx.fillRect(0, 0, W, H);
}
