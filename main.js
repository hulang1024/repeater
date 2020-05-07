import MenuBar from './menubar.js';
import AudioPlayer from './audio-player.js';
import TextDisplayer from './displayer.js';

let menubar = new MenuBar();
let audioPlayer = new AudioPlayer();
let textDisplayer = new TextDisplayer({audioPlayer});
audioPlayer.loadAudio({
  url: 'https://raw.githubusercontent.com/hulang1024/repeater/master/data/count.mp3'
});
textDisplayer.fetchText({
  url: 'https://raw.githubusercontent.com/hulang1024/repeater/master/data/count.json'
});
