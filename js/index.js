$(function() {
  var shuffleCards = function (list) {
    var length = list.length;
    var newLength = length;
    var tempList = list.slice();
    var shuffled = [];

    for (var i = 0; i < length; i++) {
      var index = Math.random() * newLength;
      shuffled.push(tempList.splice(index, 1));
    }
    return shuffled;
  };

  var display = function(cards) {
    $ul = $('ul');
    for (var card = 0; card < cards.length; card++) {
      $ul.append(cards[card]);
    }
  }

  var cards = $('li');
  var shuffled = shuffleCards(cards);
  display(shuffled);
  
  // console.log(shuffled);
});