export default class AudioPlayer {
  constructor() {
    this.el = document.querySelector('.audio-player');
    const audio = document.querySelector('.audio-player audio');
    this.audio = audio;

    this.timeUpdateListeners = [];

    /* 原生timeupdate事件频率不高，setInterval代替实现 */
    let timeUpdateTimer = null;
    const startTimeUpdateTimer = () => {
      timeUpdateTimer = setInterval(() => {
        this.timeUpdateListeners.forEach((listener) => {
          listener(audio.currentTime);
        });
      }, 5);
    }

    audio.onplay = () => {
      startTimeUpdateTimer();
    }

    audio.onpause = () => {
      clearInterval(timeUpdateTimer);
    }

    this.el.appendChild(new _PlaySpeedController(this).el);
  }

  addAudioTimeUpdateListener(listener) {
    this.timeUpdateListeners.push(listener);
  }

  removeAudioTimeUpdateListener(listener) {
    this.timeUpdateListeners = this.timeUpdateListeners.filter(l => l != listener);
  }

  loadAudio({url}) {
    this.audio.src = url;
  }
}

class _PlaySpeedController {
  constructor(player) {
    this.el = $('.audio-player__play-speed').get(0);
    const menu = $('.dropdown-menu', this.el);
    for (let n = 25; n <= 200; n += 25) {
      menu.append($('<li>').append($('<a>')
        .data('value', n / 100)
        .text(n + '%')
        .click(function() {
          player.audio.playbackRate = +$(this).data('value');
          $('#play-speed-text').text($(this).text());
        })));
    }
    this.el.appendChild(menu.get(0));
  }
}