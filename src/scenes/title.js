// 타이틀: 제목을 띄우고, 누르면 두 사람이 속도를 내며 화면 밖으로 달려 나간다.
import { ui } from '../ui.js';
import { chime } from '../engine/audio.js';

let phase, t;

export const title = {
  enter(game) {
    phase = 'idle'; t = 0;
    game.speed = 40; game.fade = 0; game.showRiders = true;
    // 오프닝을 건너뛰고 들어온 경우에도 자리를 잡아 준다
    if (game.riders[0].x < 140) { game.riders[0].x = 150; game.riders[1].x = 112; }
    ui.hideAll();
    ui.title(true);
    ui.skipButton(false);
  },

  update(dt, game) {
    t += dt;
    const [elliot, me] = game.riders;
    if (phase === 'idle') {
      elliot.x = 150 + Math.sin(game.clock * 0.7) * 3;
      me.x = 112 + Math.sin(game.clock * 0.5 + 1) * 2;
    } else {
      game.speed = 40 + t * 30;
      elliot.x += dt * (30 + t * 60);
      me.x += dt * (24 + t * 62);
      game.fade = Math.min(1, Math.max(0, (t - 1.6) / 1.2));
      if (t > 3.1) game.switchTo('chapter1');
    }
  },

  advance() {
    if (phase === 'idle' && t > 0.8) {
      phase = 'depart'; t = 0;
      ui.title(false);
      chime();
    }
  }
};
