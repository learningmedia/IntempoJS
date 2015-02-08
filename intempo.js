function createAudioPlayer(arraybuffer) {

  if (typeof arraybuffer !== 'object') {
    throw new Error('arraybuffer is not an object.');
  }

  function play() {
    // body...
  }

  function stop() {
    // body...
  }

  function pause() {
    // body...
  }

  return {
    play: play,
    stop: stop,
    pause: pause
  };
}

export default {
  createAudioPlayer: createAudioPlayer
};
