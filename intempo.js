const AudioContext = window.AudioContext || window.webkitAudioContext;

const STATE_STOPPED = 0;
const STATE_PLAYING = 1;
const STATE_PAUSING = 2;

function createPlayer(audioContext, buffer, stateChangedCallback) {

  let sound;
  let state;
  let pausedAt;
  let startedAt;

  state = STATE_STOPPED;

  function play() {
    if (state === STATE_PLAYING) {
      return;
    }

    sound = audioContext.createBufferSource();
    sound.buffer = buffer;
    sound.connect(audioContext.destination);

    if (pausedAt) {
      startedAt = Date.now() - pausedAt;
      sound.start(audioContext.currentTime, pausedAt / 1000);
    } else {
      startedAt = Date.now();
      sound.start(audioContext.currentTime, 0);
    }

    changeState(STATE_PLAYING);
    pausedAt = undefined;
  }

  function stop() {
    if (state !== STATE_STOPPED) {
      sound.stop();
      changeState(STATE_STOPPED);
      pausedAt = undefined;
    }
  }

  function pause() {
    if (state !== STATE_PLAYING) {
      return;
    }

    sound.stop();
    pausedAt = Date.now() - startedAt;
    changeState(STATE_PAUSING);
  }

  function changeState(newState) {
    state = newState;
    if (stateChangedCallback) {
      stateChangedCallback(newState);
    }
  }

  return {
    play: play,
    stop: stop,
    pause: pause
  };
}

function loadPlayer(arraybuffer, audioContext, stateChangedCallback) {
  return new Promise((resolve, reject) => {

    if (!(arraybuffer instanceof ArrayBuffer)) {
      reject(new Error('arraybuffer is not an object.'));
    }

    audioContext = audioContext || new AudioContext();

    audioContext.decodeAudioData(
      arraybuffer,
      buffer => resolve(createPlayer(audioContext, buffer, stateChangedCallback)),
      error => reject(error)
    );
  });
}

export default {
  loadPlayer,
  STATE_STOPPED,
  STATE_PLAYING,
  STATE_PAUSING
};
