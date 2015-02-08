import intempo from 'intempo';

let intempoPlayer;

loadArrayBuffer('audio/example.mp3')
  .then(arraybuffer => intempo.loadPlayer(arraybuffer))
  .then(player => {
    intempoPlayer = player;
    initializeButtons();
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

function initializeButtons() {
  let startButton = document.getElementById('startButton');
  let stopButton = document.getElementById('stopButton');
  let pauseButton = document.getElementById('pauseButton');

  startButton.addEventListener('click', play);
  startButton.removeAttribute('disabled');

  stopButton.addEventListener('click', stop);
  stopButton.removeAttribute('disabled');

  pauseButton.addEventListener('click', pause);
  pauseButton.removeAttribute('disabled');
}
