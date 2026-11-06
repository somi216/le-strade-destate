// 게임 루프. 탭을 오래 비웠다 돌아와도 한 프레임이 0.05초를 넘지 않게 막는다.
export function startLoop(update, render) {
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    update(dt);
    render();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
