// 캔버스 위에 겹친 DOM 요소(자막, 대사창, 타이틀, 예고 화면)를 켜고 끈다.
const $ = id => document.getElementById(id);

const el = {
  caption: $('caption'),
  dialog: $('dialog'),
  who: $('who'),
  line: $('line'),
  next: $('nextMark'),
  title: $('title'),
  end: $('end'),
  skip: $('skipBtn')
};

export const ui = {
  caption(show) { el.caption.classList.toggle('on', show); },

  dialogOpen(who) {
    el.who.textContent = who;
    el.who.classList.toggle('me', who === '나');
    el.line.textContent = '';
    el.next.hidden = true;
    el.dialog.classList.add('on');
  },
  dialogText(text) { el.line.textContent = text; },
  dialogDone() { el.next.hidden = false; },
  dialogClose() { el.dialog.classList.remove('on'); },

  title(show) { el.title.classList.toggle('on', show); },
  end(show) { el.end.classList.toggle('on', show); },
  skipButton(show) { el.skip.hidden = !show; },

  hideAll() {
    this.caption(false);
    this.dialogClose();
    this.title(false);
    this.end(false);
  }
};
