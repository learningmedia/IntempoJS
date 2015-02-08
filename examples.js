import intempo from 'intempo';

let intempoPlayer;

loadArrayBuffer('audio/example.mp3')
  .then(arraybuffer => intempo.loadPlayer(arraybuffer))
  .then(player => {
    intempoPlayer = player;
    player.play();
  });

document
  .getElementById('stopButton')
  .addEventListener('click', intempoPlayer.stop);

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
