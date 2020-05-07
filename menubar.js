export default class MenuBar {
  constructor() {
    let el = $('.menubar');
    el.find('.help').click(function() {
      alert('音频和单词同步\n* 单击单词跳转音频进度\n* 移动音频进度跳转单词');
    });
    el.find('.about').click(function() {
      window.open('https://github.com/hulang1024/repeater');
    });
  }
}