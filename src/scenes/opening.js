// 오프닝: 검은 화면 → 자막 → 두 사람 등장 → 대화. 끝나면 타이틀로 넘어간다.
import { OPENING_LINES as LINES } from '../data/dialogue.js';
import { ui } from '../ui.js';
import { blip } from '../engine/audio.js';

const ease = t => (t < 0 ? 0 : t > 1 ? 1 : 1 - Math.pow(1 - t, 3));

let phase, t, lineIdx, typed, typingDone;

// 등장 연출 도중에 누르면 연출을 끝내고 바로 대화를 시작한다
function jumpToDialogue(game) {
  ui.caption(false);
  game.fade = 0;
  game.speed = 40;
  game.showRiders = true;
  game.riders[0].x = 150;
  game.riders[1].x = 112;
  phase = 'dialogue'; t = 0;
  showLine(0);
}

function showLine(i) {
  lineIdx = i;
  typed = 0;
  typingDone = false;
  ui.dialogOpen(LINES[i].who);
  blip(LINES[i].who === '나' ? 520 : 660);
}

export const opening = {
  enter(game) {
    phase = 'intro'; t = 0;
    game.cam = 0; game.speed = 14; game.fade = 1; game.showRiders = false;
    game.riders[0].x = -60;
    game.riders[1].x = -100;
    lineIdx = -1; typed = 0; typingDone = true;
    ui.hideAll();
    ui.skipButton(true);
  },

  update(dt, game) {
    t += dt;
    const [elliot, me] = game.riders;

    if (phase === 'intro') {
      game.fade = Math.max(0, 1 - t / 2.2);
      if (t > 0.6) ui.caption(true);
      if (t > 3.6) ui.caption(false);
      game.speed = 14 + Math.min(1, t / 4) * 16;
      if (t > 4.4) { phase = 'ridein'; t = 0; game.showRiders = true; }

    } else if (phase === 'ridein') {
      game.speed = 30 + ease(t / 3) * 10;
      elliot.x = -60 + ease(t / 3.4) * 210;
      me.x = -100 + ease((t - 0.5) / 3.4) * 212;
      if (t > 4.1) { phase = 'dialogue'; t = 0; showLine(0); }

    } else if (phase === 'dialogue') {
      const text = LINES[lineIdx].text;
      if (!typingDone) {
        typed = Math.min(text.length, typed + dt * 26);   // 초당 26글자
        ui.dialogText(text.slice(0, Math.floor(typed)));
        if (typed >= text.length) { typingDone = true; ui.dialogDone(); }
      }
      elliot.x = 150 + Math.sin(game.clock * 0.7) * 3;
      me.x = 112 + Math.sin(game.clock * 0.5 + 1) * 2;
    }
  },

  advance(game) {
    if (phase !== 'dialogue') { jumpToDialogue(game); return; }     // 등장 중에 누르면 대화로 바로 (건너뛰기는 버튼으로만)
    if (!typingDone) { typed = LINES[lineIdx].text.length; return; } // 글자 출력 중이면 한 번에 다 보여 주기
    if (lineIdx < LINES.length - 1) showLine(lineIdx + 1);
    else game.switchTo('title');
  }
};