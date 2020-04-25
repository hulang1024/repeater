class TextDisplayer {
  constructor({audioPlayer}) {
    this.audioPlayer = audioPlayer;
    this.el = document.querySelector('.displayer');
    this.words = [];
    this.lastIndex = 0;
    this.currIndex = 0;
    this._setAudioEventListeners();
  }

  fetchText({url}) {
    $('.displayer__text-loading').fadeIn();
    $.ajax({
      type: 'GET',
      url,
      dataType: 'json',
      complete: () => {
        $('.displayer__text-loading').hide();
      },
      success: (data) => {
        this._clearText();
        this._renderText(data);

        const { audio } = this.audioPlayer;
        this.onSeeked(audio.currentTime);
        audio.addEventListener('seeked', this.onSeeked);
        this.audioPlayer.addAudioTimeUpdateListener(this.onTimeUpdate);
      },
      error: () => {
        $('.displayer__text-load_error').fadeIn();
      }
    });
  }

  _setAudioEventListeners() {
    const { audio } = this.audioPlayer;

    const toMS = (s) => Math.round(s * 1000);
    this.onSeeked = () => {
      this._onSeeked(toMS(audio.currentTime));
    };
    this.onTimeUpdate = () => {
      this._onTimeUpdate(toMS(audio.currentTime));
    };

    audio.addEventListener('loadstart', () => {
      this.lastIndex = 0;
      this.currIndex = 0;
      $('.displayer__audio-loading').fadeIn();
      audio.removeEventListener('seeked', this.onSeeked);
      this.audioPlayer.removeAudioTimeUpdateListener(this.onTimeUpdate);
    })

    audio.addEventListener('loadeddata', () => {
      $('.displayer__audio-loading').fadeOut();
    });

    audio.addEventListener('ended', () => {
      this.words[this.lastIndex].unhighlight();
    });

    audio.addEventListener('error', () => {
      $('.displayer__audio-loading').hide();
      $('.displayer__audio-load-error').fadeIn();
    });
  }

  _onSeeked(time) {
    const { words } = this;
    // 找出大于等于当前时间点time的单词的索引
    let index = 0;
    while (index < words.length && words[index].time < time) {
      index++;
    }
    this.currIndex = index;

    words[this.lastIndex].unhighlight();

    if (this.currIndex > 0) {
      words[this.currIndex - 1].highlight();
      this.lastIndex = this.currIndex - 1;
    }
    this.onTimeUpdate(time, false);
  }

  _onTimeUpdate(time, seeking) {
    const { words } = this;
    if (seeking) return;
    if (this.currIndex > words.length - 1) return;
    if (time < words[this.currIndex].time) return;
    words[this.lastIndex].unhighlight();
    words[this.currIndex].highlight();
    this.lastIndex = this.currIndex;
    this.currIndex++;
  }

  _clearText() {
    const container = this.el.querySelector('.displayer__text');
    container.innerHTML = '';
  }

  _renderText(sentences) {
    const container = this.el.querySelector('.displayer__text');
    sentences.forEach((sentence) => {
      let p = document.createElement('p');
      sentence.forEach((wordData) => {
        let word = new Word({
          text: wordData[0],
          time: wordData[1],
          onClick: () => {
            this.audioPlayer.audio.currentTime = word.time / 1000;
            this.audioPlayer.play();
          }
        });
        this.words.push(word);
        p.appendChild(word.el);
      });
      container.appendChild(p);
    });
  }
}

class Word {
  constructor({text, time, onClick}) {
    this.text = text;
    this.time = time;
    this.el = $('<span>')
      .text(text)
      .css({
        padding: '0px 4px',
        cursor: 'pointer'
      })
      .click(() => {
        onClick.call(this);
      })
      .hover(
        () => {
          if (!this.highlighted)
            this._setHighlight(true);
        },
        () => {
          if (!this.highlighted)
            this._setHighlight(false);
        }).get(0);
  }

  highlight() {
    this.highlighted = true;
    this._setHighlight(true);
  }
  unhighlight() {
    this.highlighted = false;
    this._setHighlight(false);
  }

  _setHighlight(b) {
    $(this.el).css({
      background: b ? 'blue' : '',
      borderBottom: b ? '2px solid red' : '',
      borderRadius: b ? '2px' : ''
    });
  }
}