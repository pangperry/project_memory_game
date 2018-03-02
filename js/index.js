$(function() {
  function shuffleCards(cards) {
    for (i = 0;  i < cards.length; i++) {
      const j = Math.floor(Math.random() * i);
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }

  var display = function(cards) {
    $ul = $('ul');
    for (var card = 0; card < cards.length; card++) {
      $ul.append(cards[card]);
    }
  };

  // starts and dynamically updates timer
  var startTimer = function() {
    var start = Date.now();
    var timer = setInterval(function() {
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
    return timer;
  };

  var updateCount = function(guesses) {
    $('#guesses').text(guesses);
  }

  var playCardSound = function(audio) {
    audio.currentTime = 0;
    audio.play();
  }

  var flip = function(card) {
    card.addClass('flipped');
  }

  var pauseClicks = function() {
    $('li').off('click');
  }

  var startGame = function() {
    var timer; 
    var pairs = 0;
    var guesses = 0;
    var cards = shuffleCards($('li'));
    var audio = $('audio')[0];
    audio.volume = .2;

    // recursively finds pairs until pairs equals 8
    var findPairs = function(audio, $firstCard=null) {
      updateCount(guesses);
      $('li').click(function (e) {
        e.preventDefault();
        playCardSound(audio);
        var $currentCard = $(this).find('.card');
        var isFlippable = !$currentCard.hasClass('flipped');

        if (!$firstCard && isFlippable) {
          flip($currentCard);
          $firstCard = $currentCard;
        } else if ($firstCard && isFlippable) {
          var isMatch = $firstCard[0].dataset.pair === $currentCard[0].dataset.pair;
          flip($currentCard);
          pauseClicks();
          guesses++;

          if (isMatch) {
            pairs++;
            $firstCard = null;
          } else { 
            pauseClicks();
            // delays one second so player has time to read cards
            setTimeout(function () {
              $currentCard.removeClass('flipped');
              $firstCard.removeClass('flipped');
              playCardSound(audio);
              $firstCard = null;
            }, 1000);
          }
          // delays one second so player has time to read cards
          setTimeout(function() {
            if (pairs < 8) {
              findPairs(audio);
            } else {
              clearInterval(timer);
              $('#modal').removeClass('hidden');
            }
          }, 1000);
        }
      });
    }

    timer = startTimer();
    display(cards);
    findPairs(audio);
  }

  startGame();
});

    //TODOs: 
    //add wrong guess sound and action
    //write stars logic
    //wire up reset
    //make responsive
    //add high score list with local storage

