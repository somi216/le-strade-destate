// "다음으로" 입력: 화면 클릭·탭, 스페이스바, 엔터. 버튼을 누른 경우는 제외한다.
export function onAdvance(screenEl, callback) {
  screenEl.addEventListener('click', e => {
    if (e.target.closest('button')) return;
    callback();
  });
  window.addEventListener('keydown', e => {
    if (e.target.closest && e.target.closest('button')) return;
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();   // 스페이스바로 페이지가 스크롤되지 않게
      callback();
    }
  });
}
