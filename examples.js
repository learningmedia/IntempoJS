import intempo from 'intempo';

loadArrayBuffer('audio/example.mp3')
  .then(arraybuffer => intempo.loadPlayer(arraybuffer))
  .then(player => player.play());

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
