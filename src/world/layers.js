// 배경 레이어. cam(카메라 위치)에 레이어마다 다른 비율을 곱해 시차 스크롤을 만든다.
import { W, rect, px, hash } from '../engine/pixel.js';
import { P } from './palette.js';

// 같은 간격으로 반복되는 물체를 화면에 보이는 만큼만 그린다.
function repeat(spacing, parallax, cam, draw) {
  const off = cam * parallax;
  const i0 = Math.floor(off / spacing) - 1;
  for (let i = i0; i < i0 + W / spacing + 3; i++) draw(i, i * spacing - off);
}

function drawSky() {
  const band = 12;
  P.sky.forEach((c, i) => {
    rect(0, i * band, W, band, c);
    if (i < P.sky.length - 1) {          // 띠 사이를 디더링으로 섞기
      const next = P.sky[i + 1];
      for (let x = i % 2; x < W; x += 2) px(x, i * band + band - 1, next);
    }
  });
  rect(0, P.sky.length * band, W, 60, P.sky[P.sky.length - 1]);

  const sx = 252, sy = 30;               // 해
  for (let y = -13; y <= 13; y++) {
    for (let x = -13; x <= 13; x++) {
      const d = Math.hypot(x, y);
      if (d < 9) px(sx + x, sy + y, P.sun);
      else if (d < 12 && (x + y) % 2 === 0) px(sx + x, sy + y, P.sunHalo);
    }
  }
}

function drawClouds(cam, clock) {
  repeat(120, 0.04, cam + clock * 60, (i, x0) => {
    const x = x0 + hash(i) * 50, y = 14 + hash(i + 9) * 34, s = 0.7 + hash(i + 3) * 0.6;
    rect(x, y, 22 * s, 3, P.cloud);
    rect(x + 4 * s, y - 2, 12 * s, 2, P.cloud);
    rect(x + 7 * s, y - 4, 6 * s, 2, P.cloud);
    rect(x + 2, y + 3, 20 * s - 2, 1, P.cloudShade);
  });
}

const farY = x => 92 + 5 * Math.sin(x * 0.018) + 3 * Math.sin(x * 0.051 + 1.3);
const midY = x => 108 + 4 * Math.sin(x * 0.024 + 2) + 2 * Math.sin(x * 0.07);

function drawFarHills(cam) {
  const o = cam * 0.1;
  for (let x = 0; x < W; x++) {
    const y = Math.round(farY(x + o));
    rect(x, y, 1, 125 - y, P.far);
    if ((x + Math.round(o)) % 3 === 0) px(x, y, P.farShade);
  }
}

// 먼 언덕 위 마을: 종탑 하나와 집 세 채
function drawVillages(cam) {
  repeat(360, 0.15, cam, (i, x0) => {
    if (hash(i * 3.1) < 0.35) return;
    const x = Math.round(x0 + hash(i) * 120);
    const base = Math.round(farY(x + cam * 0.1)) + 4;
    rect(x, base - 20, 5, 20, P.tower);
    rect(x + 1, base - 16, 1, 2, P.roofDark);
    rect(x + 3, base - 16, 1, 2, P.roofDark);
    rect(x, base - 21, 5, 1, P.roofDark);
    rect(x + 1, base - 23, 3, 2, P.roof);
    px(x + 2, base - 24, P.roof);
    for (const [dx, w, h] of [[7, 10, 8], [18, 9, 7], [-12, 9, 6]]) {
      rect(x + dx, base - h, w, h, P.wall);
      rect(x + dx - 1, base - h - 2, w + 2, 2, P.roof);
      px(x + dx + 2, base - h + 3, P.roofDark);
      px(x + dx + w - 3, base - h + 3, P.roofDark);
    }
  });
}

function drawMidHills(cam) {
  const o = cam * 0.3;
  for (let x = 0; x < W; x++) {
    const y = Math.round(midY(x + o));
    rect(x, y, 1, 128 - y, P.mid);
  }
  // 포도밭 줄: 짧은 조각으로 그려야 스크롤이 눈에 보인다
  const shift = Math.round(o) % 5;
  for (let r = 0; r < 5; r++) {
    const y = 114 + r * 3;
    for (let x = -shift + (r % 2) * 2; x < W; x += 5) {
      rect(x, y, 3, 2, r % 2 ? P.vineDark : P.vine);
      if (hash(x + Math.round(o) + r * 31) > 0.82) px(x + 1, y + 1, P.grape);
    }
    rect(0, y + 2, W, 1, P.midDark);
  }
}

function cypress(x, base, h) {
  for (let r = 0; r < h; r++) {
    const t = r / h;
    const w = Math.round(3.2 * Math.pow(t, 0.65) * (t > 0.88 ? 0.75 : 1));
    const y = base - h + r;
    rect(x - w, y, w * 2 + 1, 1, P.cypress);
    if (r % 2 === 0 && w > 1) px(x - w + 1, y, P.cypressLit);
  }
  rect(x, base, 1, 4, P.trunk);
}

function drawCypresses(cam) {
  repeat(28, 0.55, cam, (i, x0) => {
    if (hash(i * 1.7) < 0.12) return;
    cypress(Math.round(x0 + hash(i) * 6), 124, 30 + Math.round(hash(i + 5) * 10));
  });
}

function sunflower(x, y, big) {
  rect(x, y, 1, big ? 7 : 5, P.stem);
  px(x + 1, y + 3, P.stem);
  if (big) {
    rect(x - 1, y - 3, 3, 3, P.petal);
    px(x, y - 4, P.petalLit); px(x - 2, y - 2, P.petal); px(x + 2, y - 2, P.petal); px(x, y, P.petal);
    px(x, y - 2, P.seed);
  } else {
    rect(x - 1, y - 2, 3, 2, P.petal);
    px(x, y - 2, P.seed);
  }
}

function drawSunflowers(cam) {
  rect(0, 124, W, 17, P.field);
  for (const [S, p, y, big] of [[6, 0.72, 128, false], [7, 0.85, 135, true]]) {
    repeat(S, p, cam, (i, x0) => {
      sunflower(Math.round(x0 + hash(i * 2.3 + S) * 3), y + Math.round(hash(i + S) * 2), big);
    });
  }
}

function drawRoad(cam) {
  rect(0, 141, W, 17, P.road);
  rect(0, 141, W, 1, P.roadEdge);
  rect(0, 157, W, 1, P.roadEdge);
  const o = Math.round(cam) % 11;
  for (let x = -o; x < W; x += 11) {
    rect(x, 147, 6, 1, P.rut);
    rect(x + 4, 153, 5, 1, P.rut);
  }
  repeat(9, 1, cam, (i, x) => px(Math.round(x), 143 + Math.round(hash(i) * 13), P.pebble));
}

// 자전거보다 앞에 오는 풀밭
export function drawForeground(cam) {
  rect(0, 158, W, 22, P.grass);
  repeat(5, 1.3, cam, (i, x0) => {
    const x = Math.round(x0), y = 160 + Math.round(hash(i) * 18);
    px(x, y, P.tuft);
    px(x + 1, y - 1, P.tuft);
  });
  repeat(17, 1.3, cam, (i, x0) => {
    const x = Math.round(x0 + hash(i * 4) * 8), y = 162 + Math.round(hash(i + 2) * 14);
    px(x, y, hash(i * 9) > 0.5 ? P.poppy : P.daisy);
    px(x, y + 1, P.stem);
  });
}

// 자전거보다 뒤에 오는 모든 것
export function drawBackdrop(cam, clock) {
  drawSky();
  drawClouds(cam, clock);
  drawFarHills(cam);
  drawVillages(cam);
  drawMidHills(cam);
  drawCypresses(cam);
  drawSunflowers(cam);
  drawRoad(cam);
}
