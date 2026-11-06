// 소리: 매미, 자전거 체인 소리, 잔잔한 아르페지오. 브라우저 정책상 사용자가 버튼을 누른 뒤에만 켜진다.
let ac = null, master = null, chainGain = null;
let on = false, nextNote = 0, step = 0;

const PROGRESSION = [[60, 64, 67, 72], [57, 60, 64, 69], [53, 57, 60, 65], [55, 59, 62, 67]]; // C Am F G
const PATTERN = [0, 1, 2, 3, 2, 1, 2, 3];
const BPM = 84;
const hz = midi => 440 * Math.pow(2, (midi - 69) / 12);

function build() {
  ac = new (window.AudioContext || window.webkitAudioContext)();
  master = ac.createGain();
  master.gain.value = 0;
  master.connect(ac.destination);

  // 매미: 대역 통과 필터를 거친 노이즈에 빠른 떨림을 준다
  const buf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const noise = ac.createBufferSource();
  noise.buffer = buf;
  noise.loop = true;
  const band = ac.createBiquadFilter();
  band.type = 'bandpass'; band.frequency.value = 5200; band.Q.value = 9;
  const trem = ac.createGain(); trem.gain.value = 0.5;
  const lfo = ac.createOscillator(); lfo.frequency.value = 17;
  const lfoDepth = ac.createGain(); lfoDepth.gain.value = 0.5;
  lfo.connect(lfoDepth).connect(trem.gain);
  const cicadaVol = ac.createGain(); cicadaVol.gain.value = 0.05;
  noise.connect(band).connect(trem).connect(cicadaVol).connect(master);
  noise.start(); lfo.start();

  // 체인 소리: 속도가 빠를수록 커진다
  const tick = ac.createOscillator(); tick.type = 'square'; tick.frequency.value = 9;
  const hp = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2500;
  chainGain = ac.createGain(); chainGain.gain.value = 0;
  tick.connect(hp).connect(chainGain).connect(master);
  tick.start();

  nextNote = ac.currentTime + 0.1;
  setInterval(schedule, 80);
}

function note(midi, t, len, vol, type = 'triangle') {
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = type;
  o.frequency.value = hz(midi);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + len);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + len + 0.05);
}

// 0.3초 앞까지 음표를 미리 예약해 박자가 밀리지 않게 한다
function schedule() {
  if (!on) return;
  const eighth = 60 / BPM / 2;
  while (nextNote < ac.currentTime + 0.3) {
    const chord = PROGRESSION[Math.floor(step / 8) % 4];
    note(chord[PATTERN[step % 8]] + 12, nextNote, 0.9, 0.07);
    if (step % 8 === 0) note(chord[0] - 12, nextNote, 2.2, 0.08, 'sine');
    nextNote += eighth;
    step++;
  }
}

export const audio = {
  unlock() {
    if (on && ac && ac.state === 'suspended') ac.resume();
  },
  toggle() {
    if (!ac) build();
    on = !on;
    if (on) { ac.resume(); nextNote = ac.currentTime + 0.05; }
    master.gain.setTargetAtTime(on ? 0.6 : 0, ac.currentTime, 0.15);
    return on;
  },
  setSpeed(v) {
    if (!ac || !chainGain) return;
    chainGain.gain.setTargetAtTime(on ? Math.min(0.012, v / 4000) : 0, ac.currentTime, 0.2);
  },
  tone(freq, len, vol) {
    if (!on || !ac) return;
    const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
    o.type = 'square';
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + len);
  }
};

export const blip = freq => audio.tone(freq, 0.06, 0.03);
export const chime = () => {
  audio.tone(1318, 0.25, 0.04);
  setTimeout(() => audio.tone(1760, 0.35, 0.04), 120);
};
