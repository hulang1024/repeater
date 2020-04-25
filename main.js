let audioPlayer = new AudioPlayer();
let textDisplayer = new TextDisplayer({audioPlayer});
audioPlayer.loadAudio({
  url: 'https://raw.githubusercontent.com/hulang1024/repeater/master/data/count.mp3'
});
textDisplayer.fetchText({
  url: 'https://raw.githubusercontent.com/hulang1024/repeater/master/data/count.json'
});
