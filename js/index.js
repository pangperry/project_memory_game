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
          $(`#${unit}`).text(`${unit} ${times[unit]} `);
        }
      });

    }, 1000);
  };

  var startGame = function() {
    var $matcher = null;
    var pairs = 0;
    var guesses = 0;
    var cards = shuffleCards($('li'));
    display(cards);

    //TODOs: 
    //Fix issue with multiple clicks--maybe using .off somehow
    //add end game conditions (while loop);
    //write stars logic
  
    $('li').click(function (e) {
      e.preventDefault();
      $card = $(this).find('.card');

      if (!$matcher && !$card.hasClass('flipped')) {
        $card.addClass('flipped');
        $matcher = $card; 
      } else if ($matcher && !$card.hasClass('flipped')) {
        $card.addClass('flipped');
        if ($matcher[0].dataset.pair === $card[0].dataset.pair) {
          pairs++;
          guesses++;
          $matcher = null;
        }
        if ($matcher && $matcher[0].dataset.pair !== $card[0].dataset.pair) {
          setTimeout(function() {
            $card.removeClass('flipped');
            $matcher.removeClass('flipped');
            $matcher = null;
          }, 1000);
          guesses++;
        }
      }
    });
  }
  startGame();


  var cards = $('li');
  var shuffled = shuffleCards(cards);
  startTimer();
});