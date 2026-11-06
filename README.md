# Le Strade d'Estate (여름의 자전거 길)
클로드 토큰 다쓰려고 만들어보는 웹게임

이탈리아 시골길을 친구 엘리엇과 자전거로 달리는 픽셀 그래픽 웹 게임. 지금은 오프닝까지 만들어져 있다.

## 실행하기

ES 모듈(`import`)을 쓰기 때문에 `index.html`을 더블클릭하면 동작하지 않는다. 둘 중 하나로 연다.

- **VS Code Live Server**: 확장 프로그램 "Live Server" 설치 → `index.html` 우클릭 → *Open with Live Server*
- **터미널**: 이 폴더에서 `npx serve` 또는 `python -m http.server 8000` 실행 후 브라우저에서 `http://localhost:8000`

## 폴더 구조

```
index.html          캔버스와 UI 오버레이
style.css           화면 스타일
src/
  main.js           시작점: 장면 전환, 게임 루프
  ui.js             자막·대사창·타이틀·예고 화면 켜고 끄기
  engine/
    pixel.js        rect, px, line 등 그리기 도우미 (화면 320×180)
    loop.js         requestAnimationFrame 루프
    input.js        클릭·스페이스바·엔터 입력
    audio.js        매미 소리, 음악, 효과음
  world/
    palette.js      색상표
    layers.js       하늘·언덕·마을·포도밭·사이프러스·해바라기·길·풀밭
  entities/
    rider.js        자전거와 사람, 페달 애니메이션
  scenes/
    opening.js      오프닝(자막 → 등장 → 대화)
    title.js        타이틀과 출발
    chapter1.js     1장 자리(지금은 예고 화면)
  data/
    dialogue.js     대사
assets/             나중에 그릴 스프라이트·소리 파일
```

## 장면 만드는 규칙

장면은 모두 같은 모양의 객체다. `main.js`의 `scenes`에 등록하고 `game.switchTo('이름')`으로 넘어간다.

```js
export const myScene = {
  enter(game) {},        // 장면이 시작될 때 한 번
  update(dt, game) {},   // 매 프레임 (dt = 지난 프레임 이후 초)
  advance(game) {}       // 클릭·스페이스바·엔터를 눌렀을 때
};
```

`game`에는 모든 장면이 같이 쓰는 값이 들어 있다: `cam`(카메라 거리), `clock`, `speed`, `fade`, `showRiders`, `riders`.

## 다음 할 일

- `scenes/chapter1.js`에 본편 조작(페달, 점프, 엘리엇과의 거리) 만들기
- 대사를 늘릴 때는 `data/dialogue.js`에 추가
