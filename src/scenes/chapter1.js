// 1장 자리. 지금은 예고 화면만 띄운다. 본편 게임 플레이는 여기에 만들면 된다.
import { ui } from '../ui.js';

export const chapter1 = {
  enter(game) {
    game.fade = 1;
    game.speed = 0;
    ui.hideAll();
    ui.end(true);
  },
  update() {},
  advance() {}
};
