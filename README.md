![IntempoJS](logo/IntempoJS-Logo.png)

ECMAScript 6 audio player module using the Web Audio API.

## Installation

Either just copy the file `intempo.js` into your project or use [bower](http://bower.io) to import it:

~~~shell
$ bower install intempojs --save
~~~

## Usage

~~~javascript
import intempo from './path/to/intempo';

intempo.loadPlayer({                                              // returns a promise of the player instance

  arraybuffer: mybuffer,                                          // Must be an instance of ArrayBuffer
  audioContext: new AudioContext(),                               // optional, will be created if not specified
  stateChangedCallback: state => console.log(state),              // optional, see section "Properties"
  positionChangedCallback: position => console.log(position),     // optional, see section "Properties"
  clockInterval: 25                                               // optional, default: 20

}).then(player => {                                               // now we have the player instance

  player.start();                                                 // start at the current position
  player.pause();                                                 // pause at the current position
  player.start(3000);                                             // start at the 3rd second into the file
  player.stop();                                                  // stop and rewind to the beginning of the file

}).catch(error => {                                               // the player could not be loaded...

  console.error(error);

});
~~~

## Properties

~~~javascript
player.duration       // gets the duration of the file in milliseconds (readonly)

player.state          // gets the current state of the player (readonly), can be one of these:
                      //   intempo.STATE_STOPPED,
                      //   intempo.STATE_PLAYING,
                      //   intempo.STATE_PAUSING

player.position       // gets or sets the current position in milliseconds
~~~

## Example

Start a webserver in the root directory and browse to `examples.html`.

---
Licensed under MIT.