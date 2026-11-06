// 자전거와 사람. 스프라이트 이미지 없이 코드로 그린다.
import { rect, px, line, ring, shade } from '../engine/pixel.js';
import { P } from '../world/palette.js';

// y는 바퀴가 땅에 닿는 높이. 뒤쪽 사람(y가 작은 쪽)을 먼저 그려야 겹침이 자연스럽다.
export function createRiders() {
  return [
    {
      name: 'elliot', x: -60, y: 150, phase: 0.8,
      frame: '#2f6fb0', shirt: '#f6f1e6', stripe: '#cf4b3a', pants: '#e3d3a8',
      skin: '#f0c9a0', hair: '#e8c45c', hat: '#e9cf7a', hatBand: '#8a5a2b'
    },
    {
      name: 'me', x: -100, y: 156, phase: 0,
      frame: '#3f8a52', shirt: '#f2c230', stripe: null, pants: '#3e4f7a',
      skin: '#e6b48c', hair: '#5a3a24', cap: '#c9603f'
    }
  ];
}

function wheel(cx, cy, angle) {
  for (const [x, y] of ring) px(cx + x, cy + y, P.tyre);
  for (let k = 0; k < 2; k++) {
    const a = angle + k * Math.PI / 2;
    line(cx - Math.cos(a) * 5, cy - Math.sin(a) * 5, cx + Math.cos(a) * 5, cy + Math.sin(a) * 5, P.spoke);
  }
  px(cx, cy, P.tyre);
}

// wheelAngle: 바퀴 회전각(라디안). 페달은 이 값에 맞춰 돈다.
export function drawRider(r, wheelAngle) {
  const crankA = wheelAngle * 0.55 + r.phase;
  const bob = Math.sin(crankA * 2) > 0.6 ? 1 : 0;   // 페달 밟을 때 1픽셀 들썩임
  const x = Math.round(r.x), g = r.y;

  const rearHub = [x, g - 6], frontHub = [x + 18, g - 6], crank = [x + 8, g - 6];
  const seat = [x + 6, g - 15 + bob], head = [x + 15, g - 15 + bob];

  rect(x - 4, g + 1, 28, 1, P.shadow);
  wheel(rearHub[0], rearHub[1], wheelAngle);
  wheel(frontHub[0], frontHub[1], wheelAngle);

  // 프레임
  line(rearHub[0], rearHub[1], crank[0], crank[1], r.frame);
  line(crank[0], crank[1], seat[0], seat[1], r.frame);
  line(seat[0], seat[1], head[0], head[1], r.frame);
  line(head[0], head[1], frontHub[0], frontHub[1], r.frame);
  line(head[0], head[1], crank[0], crank[1], r.frame);
  line(rearHub[0], rearHub[1], seat[0], seat[1], r.frame);
  rect(seat[0] - 2, seat[1] - 1, 4, 1, P.leather);
  line(head[0], head[1], head[0] + 1, head[1] - 3, P.metal);
  rect(head[0] - 1, head[1] - 3, 3, 1, P.metal);

  // 다리: 엉덩이 → 무릎 → 페달
  const hip = [seat[0], seat[1] - 2];
  [0, Math.PI].forEach((o, k) => {
    const pedal = [crank[0] + Math.cos(crankA + o) * 3, crank[1] + Math.sin(crankA + o) * 3];
    const knee = [(hip[0] + pedal[0]) / 2 + 3, (hip[1] + pedal[1]) / 2 - 2];
    line(hip[0], hip[1], knee[0], knee[1], k === 0 ? r.pants : shade(r.pants), true);
    line(knee[0], knee[1], pedal[0], pedal[1], r.skin);
    px(pedal[0], pedal[1], P.leather);
  });

  // 몸통(줄무늬 셔츠면 한 줄씩 번갈아 색칠)
  const shoulder = [seat[0] + 5, seat[1] - 10];
  for (let t = 0; t <= 1; t += 0.12) {
    const sx = hip[0] + (shoulder[0] - hip[0]) * t;
    const sy = hip[1] + (shoulder[1] - hip[1]) * t;
    rect(sx - 1, sy, 3, 1, r.stripe && Math.round(sy) % 2 === 0 ? r.stripe : r.shirt);
  }

  // 팔
  line(shoulder[0], shoulder[1] + 1, head[0] + 1, head[1] - 3, r.skin);
  px(shoulder[0], shoulder[1] + 1, r.shirt);

  // 머리와 모자
  const hx = shoulder[0] - 1, hy = shoulder[1] - 5;
  rect(hx, hy, 4, 4, r.skin);
  px(hx + 3, hy + 1, P.leather);
  rect(hx, hy, 2, 2, r.hair);
  if (r.hat) {
    rect(hx - 2, hy - 1, 8, 1, r.hat);
    rect(hx, hy - 3, 4, 2, r.hat);
    rect(hx, hy - 1, 4, 1, r.hatBand);
  } else {
    rect(hx, hy - 1, 4, 1, r.cap);
    rect(hx + 3, hy, 2, 1, r.cap);
    px(hx - 1, hy + 1, r.hair);
  }
}
