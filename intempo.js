const AudioContext = window.AudioContext || window.webkitAudioContext;

export const STATE_STOPPED = 0;
export const STATE_PLAYING = 1;
export const STATE_PAUSING = 2;

function noop() {}

function createPlayer(options, buffer) {

  let sound;
  let state;
  let pausePosition;
  let startTime;
  let lastPosition;
  let duration;
  let intervalId;

  state = STATE_STOPPED;
  lastPosition = 0;
  duration = buffer.duration * 1000;

  function start(position = 0) {
    if (sound) {
      sound.onended = undefined;
    }

    if (state === STATE_PLAYING) {
      window.clearInterval(intervalId);
      sound.stop();
    }

    sound = options.audioContext.createBufferSource();
    sound.buffer = buffer;
    sound.onended = onCurrentSoundEnded;
    sound.connect(options.audioContext.destination);

    position = position || pausePosition || 0;
    startTime = Date.now() - position;
    sound.start(options.audioContext.currentTime, position / 1000);

    changeState(STATE_PLAYING);
    pausePosition = undefined;
  }

  function stop() {
    if (state !== STATE_STOPPED) {
      sound.stop();
      changeState(STATE_STOPPED);
      pausePosition = undefined;
      onCurrentPositionChanged();
    }
  }

  function pause() {
    if (state !== STATE_PLAYING) {
      return;
    }

    sound.stop();
    pausePosition = Date.now() - startTime;
    changeState(STATE_PAUSING);
    onCurrentPositionChanged();
  }

  function setPosition(value) {
    if (state === STATE_PLAYING) {
      start(value);
    } else if (state === STATE_PAUSING) {
      startTime = Date.now() - value;
      pausePosition = value;
      onCurrentPositionChanged();
    }
  }

  function changeState(newState) {
    if (newState === STATE_PLAYING) {
      intervalId = window.setInterval(onCurrentPositionChanged, options.clockInterval);
    } else {
      window.clearInterval(intervalId);
    }

    state = newState;
    options.stateChangedCallback(newState);
  }

  function calculateCurrentPosition() {
    if (state === STATE_PAUSING) {
      return pausePosition;
    } else if (state === STATE_PLAYING) {
      return Date.now() - startTime;
    } else {
      return 0;
    }
  }

  function onCurrentPositionChanged() {
    const currentPosition = calculateCurrentPosition();
    if (currentPosition !== lastPosition) {
      lastPosition = currentPosition;
      options.positionChangedCallback(currentPosition);
    }
  }

  function onCurrentSoundEnded() {
    if (state !== STATE_STOPPED && calculateCurrentPosition() >= duration) {
      changeState(STATE_STOPPED);
      pausePosition = undefined;
    }
  }

  return {
    start,
    stop,
    pause,
    get duration() {
      return duration;
    },
    get state() {
      return state;
    },
    get position() {
      return lastPosition;
    },
    set position(value) {
      setPosition(value);
    }
  };
}

export function loadPlayer(options) {
  return new Promise((resolve, reject) => {

    if (!(options.arraybuffer instanceof ArrayBuffer)) {
      reject(new Error('arraybuffer is not an object.'));
    }

    // Set default options:
    options.audioContext = options.audioContext || new AudioContext();
    options.stateChangedCallback = options.stateChangedCallback || noop;
    options.positionChangedCallback = options.positionChangedCallback || noop;
    options.clockInterval = options.clockInterval || 20;

    options.audioContext.decodeAudioData(
      options.arraybuffer,
      buffer => resolve(createPlayer(options, buffer)),
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
