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
    startTimer();

    //TODOs: 
    //add end game conditions (while loop);
    //write stars logic
    //wire up reset
    //make responsive

    var findPair = function() {
      var audio = $('audio')[0];
      $('#guesses').text(guesses);
      $('li').click(function (e) {
        e.preventDefault();
        audio.currentTime = 0;
        audio.play();
        // $('audio')[0].play();
        $card = $(this).find('.card');

        if (!$matcher && !$card.hasClass('flipped')) {
          $card.addClass('flipped');
          $matcher = $card;
        } else if ($matcher && !$card.hasClass('flipped')) {
          guesses++;
          $('li').off('click');
          $card.addClass('flipped');
          if ($matcher[0].dataset.pair === $card[0].dataset.pair) {
            pairs++;
            $matcher = null;
          }
          if ($matcher && $matcher[0].dataset.pair !== $card[0].dataset.pair) {
            $('li').off('click');
            setTimeout(function () {
              $card.removeClass('flipped');
              $matcher.removeClass('flipped');
              audio.currentTime = 0;
              audio.play();
              $matcher = null;
            }, 1000);
          }
          setTimeout(function() {
            if (pairs < 8) {
              findPair();
            }
          }, 1500);
        }
      });
    }
    findPair();
  }

  startGame();
});