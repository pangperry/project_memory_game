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
  };

  var startTimer = function() {
    var start = Date.now();

    setInterval(function() {
      var currentTime = Date.now();
      var elapsed = currentTime - start;
      var totalSeconds = Math.floor(elapsed / 1000);

      var times = {
        seconds : Math.floor(totalSeconds % 60), 
        minutes : Math.floor(totalSeconds / 60 % 60),
        hours : Math.floor(totalSeconds  / 1000 / 60 / 60 % 24),
      };

      (['hours', 'minutes', 'seconds']).forEach(unit => {
        if (times[unit]) {
          $(`#${unit}`).text(`${unit} ${times[unit]}`);
        }
      });

    }, 1000);
  };

  $('.flip').click(function () {
    $(this).find('.card').addClass('flipped').mouseleave(function () {
      $(this).removeClass('flipped');
    });
    return true;
  });


  var cards = $('li');
  var shuffled = shuffleCards(cards);
  startTimer();
});