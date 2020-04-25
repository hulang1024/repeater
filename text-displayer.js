class TextDisplayer {
  constructor({player}) {
    this.player = player;
    this.el = document.querySelector('.text-displayer');
    this.words = [];
    this.lastIndex = 0;
    this.currIndex = 0;
    
    this._renderText();
  }

  onSeeked(time) {
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

  onTimeUpdate(time, seeking) {
    const { words } = this;
    if (seeking) return;
    if (this.currIndex > words.length - 1) return;
    if (time < words[this.currIndex].time) return;
    words[this.lastIndex].unhighlight();
    words[this.currIndex].highlight();
    this.lastIndex = this.currIndex;
    this.currIndex++;
  }

  onEnded() {
    this.words[this.lastIndex].unhighlight();
  }

  _renderText() {
    var sentences = [
      [["Whatever",100],["is",625],["worth",764],["doing",1155],["is",1409],["worth",1750],["doing",2132],["well.",2500]],
      [["one",3861],["two",4143],["three",4400],["four",4740],["five",5040],["six",5430],["seven",5695],["eight",6097],["nine",6380]]
    ];
    sentences.forEach((sentence) => {
      let p = document.createElement('p');
      sentence.forEach((wordData) => {
        let word = new Word({
          text: wordData[0],
          time: wordData[1],
          onClick: () => {
            this.player.setCurrentTime(word.time);
          }
        });
        this.words.push(word);
        p.appendChild(word.el);
      });
      this.el.appendChild(p);
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
      borderRadius: b ? '1px' : ''
    });
  }
}