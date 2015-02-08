const AudioContext = window.AudioContext || window.webkitAudioContext;

function createPlayer(audioContext, buffer) {
  function play() {
    const sound = audioContext.createBufferSource(); // Declare a New Sound
    sound.buffer = buffer;                           // Attatch our Audio Data as it's Buffer
    sound.connect(audioContext.destination);         // Link the Sound to the Output
    sound.start(audioContext.currentTime, 0);        // Play the Sound Immediately
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
