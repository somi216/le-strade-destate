// 시작점: 캔버스 준비, 장면 전환, 게임 루프.
import { setContext, fadeOverlay } from './engine/pixel.js';
import { startLoop } from './engine/loop.js';
import { onAdvance } from './engine/input.js';
import { audio } from './engine/audio.js';
import { drawBackdrop, drawForeground } from './world/layers.js';
import { createRiders, drawRider } from './entities/rider.js';
import { opening } from './scenes/opening.js';
import { title } from './scenes/title.js';
import { chapter1 } from './scenes/chapter1.js';

const canvas = document.getElementById('cv');
setContext(canvas.getContext('2d'));

const scenes = { opening, title, chapter1 };

// 모든 장면이 함께 쓰는 상태
const game = {
  cam: 0,          // 카메라가 이동한 거리(픽셀)
  clock: 0,        // 시작 후 지난 시간(초)
  speed: 0,        // 초당 스크롤 픽셀
  fade: 1,         // 0이면 밝음, 1이면 완전히 검은 화면
  showRiders: false,
  riders: createRiders(),
  scene: null,
  switchTo(name) {
    this.scene = scenes[name];
    this.scene.enter(this);
  }
};

function update(dt) {
  game.clock += dt;
  game.scene.update(dt, game);
  game.cam += game.speed * dt;
  audio.setSpeed(game.speed);
}

function render() {
  drawBackdrop(game.cam, game.clock);
  if (game.showRiders) {
    const wheelAngle = game.cam / 6;   // 바퀴 반지름 6픽셀
    game.riders.forEach(r => drawRider(r, wheelAngle));
  }
  drawForeground(game.cam);
  fadeOverlay(game.fade);
}

// 입력과 버튼
const screen = document.getElementById('screen');
onAdvance(screen, () => {
  audio.unlock();
  game.scene.advance(game);
});

const soundBtn = document.getElementById('soundBtn');
soundBtn.addEventListener('click', () => {
  const isOn = audio.toggle();
  soundBtn.textContent = isOn ? '소리 끄기' : '소리 켜기';
  soundBtn.setAttribute('aria-pressed', String(isOn));
});
document.getElementById('skipBtn').addEventListener('click', () => game.switchTo('title'));
document.getElementById('replayBtn').addEventListener('click', () => game.switchTo('opening'));

game.switchTo('opening');
startLoop(update, render);
screen.focus({ preventScroll: true });
