const AudioContext = window.AudioContext || window.webkitAudioContext;

const STATE_STOPPED = 0;
const STATE_PLAYING = 1;
const STATE_PAUSING = 2;

function createPlayer(audioContext, buffer) {

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

    state = STATE_PLAYING;
    pausedAt = undefined;
  }

  function stop() {
    if (state === STATE_PLAYING) {
      sound.stop();
    }

    state = STATE_STOPPED;
    pausedAt = undefined;
  }

  function pause() {
    if (state !== STATE_PLAYING) {
      return;
    }

    sound.stop();
    pausedAt = Date.now() - startedAt;
    state = STATE_PAUSING;
  }

  return {
    play: play,
    stop: stop,
    pause: pause
  };
}

function loadPlayer(arraybuffer, audioContext) {
  return new Promise((resolve, reject) => {

    if (!(arraybuffer instanceof ArrayBuffer)) {
      reject(new Error('arraybuffer is not an object.'));
    }

    audioContext = audioContext || new AudioContext();

    audioContext.decodeAudioData(
      arraybuffer,
      buffer => resolve(createPlayer(audioContext, buffer)),
      error => reject(error)
    );
  });
}

export default {
  loadPlayer: loadPlayer
};
