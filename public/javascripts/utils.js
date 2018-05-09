function updateLetterCounter() {
  //var num = (letterCounter / (game.time.now - letterTimer)) * 6000;

  var num = calcLettersPerMinute();
  countLetter = num.toFixed(0);
  countLetterText.text = countLstring + countLetter + ' (' + letterCounter + ')';

}


function calcLettersPerMinute() {
  return letterCounter / ((game.time.now - letterTimer) / 1000) * 60;
}
