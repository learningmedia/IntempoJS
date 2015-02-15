import intempo from 'intempo';

let intempoPlayer;
let startButton = document.getElementById('startButton');
let stopButton = document.getElementById('stopButton');
let pauseButton = document.getElementById('pauseButton');
let positionLabel = document.getElementById('positionLabel');

loadArrayBuffer('audio/example.mp3')
  .then(arraybuffer => intempo.loadPlayer(arraybuffer, null, onStateChange, onPositionChange, 20))
  .then(player => {
    intempoPlayer = player;
    initializeUI();
  });

function play() {
  intempoPlayer.play();
}

function stop() {
  intempoPlayer.stop();
}

function pause() {
  intempoPlayer.pause();
}

function onStateChange(newState) {
  log(translateStateText(newState));
}

function onPositionChange(newPosition) {
  positionLabel.textContent = `${ newPosition / 1000 } / ${ intempoPlayer.duration / 1000 }`;
}

function log(text) {
  let logDiv = document.getElementById('log');
  let paragraph = document.createElement('p');
  paragraph.textContent = `${ new Date().toISOString() } - ${ text }`;
  logDiv.appendChild(paragraph);
}

function translateStateText(newState) {
  if (newState === intempo.STATE_STOPPED) {
    return 'Audioplayer stopped.';
  } else if (newState === intempo.STATE_PLAYING) {
    return 'Audioplayer started.';
  } else if (newState === intempo.STATE_PAUSING) {
    return 'Audioplayer paused.';
  } else {
    return 'Invalid state.';
  }
}

function loadArrayBuffer(url) {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onreadystatechange = () => {
      if (xhr.readyState === xhr.DONE) {
        resolve(xhr.response);
      }
    };
    xhr.send();
  });
}

function initializeUI() {
  startButton.addEventListener('click', play);
  startButton.removeAttribute('disabled');

  stopButton.addEventListener('click', stop);
  stopButton.removeAttribute('disabled');

  pauseButton.addEventListener('click', pause);
  pauseButton.removeAttribute('disabled');
}
