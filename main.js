let audioPlayer = new AudioPlayer();
let textDisplayer = new TextDisplayer({player: audioPlayer});
audioPlayer.setTextDisplayer(textDisplayer);
