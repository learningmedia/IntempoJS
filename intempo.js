const AudioContext = window.AudioContext || window.webkitAudioContext;

const STATE_STOPPED = 0;
const STATE_PLAYING = 1;
const STATE_PAUSING = 2;

function createPlayer(audioContext, buffer, stateChangedCallback, positionChangedCallback, clockInterval) {

  let sound;
  let state;
  let pausedAt;
  let startedAt;
  let lastPosition;
  let duration;
  let intervalId;

  clockInterval = clockInterval || 20;
  state = STATE_STOPPED;
  lastPosition = 0;
  duration = buffer.duration * 1000;

  function play() {
    if (state === STATE_PLAYING) {
      return;
    }

    if (sound) {
      sound.onended = undefined;
    }

    sound = audioContext.createBufferSource();
    sound.buffer = buffer;
    sound.onended = onCurrentSoundEnded;
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
      onCurrentPositionChanged();
    }
  }

  function pause() {
    if (state !== STATE_PLAYING) {
      return;
    }

    sound.stop();
    pausedAt = Date.now() - startedAt;
    changeState(STATE_PAUSING);
    onCurrentPositionChanged();
  }

  function changeState(newState) {
    if (newState === STATE_PLAYING) {
      intervalId = window.setInterval(onCurrentPositionChanged, clockInterval);
    } else {
      window.clearInterval(intervalId);
    }

    state = newState;
    if (stateChangedCallback) {
      stateChangedCallback(newState);
    }
  }

  function calculateCurrentPosition() {
    if (state === STATE_PAUSING) {
      return pausedAt;
    } else if (state === STATE_PLAYING) {
      return Date.now() - startedAt;
    } else {
      return 0;
    }
  }

  function onCurrentPositionChanged() {
    const currentPosition = calculateCurrentPosition();
    if (currentPosition !== lastPosition) {
      lastPosition = currentPosition;
      if (positionChangedCallback) {
        positionChangedCallback(currentPosition);
      }
    }
  }

  function onCurrentSoundEnded() {
    if (state !== STATE_STOPPED && calculateCurrentPosition() >= duration) {
      changeState(STATE_STOPPED);
      pausedAt = undefined;
    }
  }

  return {
    play,
    stop,
    pause,
    get duration() {
      return duration;
    },
    get position() {
      return lastPosition;
    },
    get state() {
      return state;
    }
  };
}

function loadPlayer(arraybuffer, audioContext, stateChangedCallback, positionChangedCallback, clockInterval) {
  return new Promise((resolve, reject) => {

    if (!(arraybuffer instanceof ArrayBuffer)) {
      reject(new Error('arraybuffer is not an object.'));
    }

    audioContext = audioContext || new AudioContext();

    audioContext.decodeAudioData(
      arraybuffer,
      buffer => resolve(createPlayer(audioContext, buffer, stateChangedCallback, positionChangedCallback, clockInterval)),
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
