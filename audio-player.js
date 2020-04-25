class AudioPlayer {
  constructor() {
    this.el = document.querySelector('.player');
    const audio = document.querySelector('.player audio');
    this.audio = audio;
    audio.src = '/data/count.mp3';

    /* 原生timeupdate事件频率不高，setInterval代替实现 */
    let timeUpdateTimer = null;
    const startTimeUpdateTimer = () => {
      timeUpdateTimer = setInterval(() => {
        this.textDisplayer.onTimeUpdate(getAudioCurrentMS());
      }, 5);
    }

    audio.onplay = () => {
      clearInterval(timeUpdateTimer);
      startTimeUpdateTimer();
    }

    audio.onpause = () => {
      clearInterval(timeUpdateTimer);
    }

    audio.onseeked = () => {
      this.textDisplayer.onSeeked(getAudioCurrentMS());
    }

    audio.onended = () => {
      this.textDisplayer.onEnded();
    }
    
    function getAudioCurrentMS() {
      return Math.round(audio.currentTime * 1000);
    }

    this.el.appendChild(new PlaySpeedController(this).el);
  }

  setCurrentTime(ms) {
    this.audio.currentTime = ms / 1000;
  }

  setTextDisplayer(textDisplayer) {
    this.textDisplayer = textDisplayer;
  }
}

class PlaySpeedController {
  constructor(player) {
    this.el = $('.player__play-speed').get(0);
    const menu = $('.player__play-speed .dropdown-menu');
    for (var n = 25; n <= 200; n += 25) {
      menu.append($('<li>').append($('<a>')
        .click(function() {
          player.audio.playbackRate = +$(this).data('value');
          $('#play-speed-text').text($(this).text());
        })
        .data('value', n / 100)
        .text(n + '%')));
    }
    this.el.appendChild(menu.get(0));
  }
}