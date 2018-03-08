$(() => {
  const shuffleCards = (cards) => {
    for (let i = 0; i < cards.length; i++) {
      let j = Math.floor(Math.random() * i);
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }

  const display = (cards) => {
    $ul = $('ul');
    for (var card = 0; card < cards.length; card++) {
      $ul.append(cards[card]);
    }
  };

  // starts and dynamically updates timer
  const startTimer = () => {
    const start = Date.now();
    const timer = setInterval(function () {
      let currentTime = Date.now();
      let elapsed = currentTime - start;
      let totalSeconds = Math.floor(elapsed / 1000);
      let times = {
        seconds: Math.floor(totalSeconds % 60),
        minutes: Math.floor(totalSeconds / 60 % 60),
        hours: Math.floor(totalSeconds / 1000 / 60 / 60 % 24),
      };
      (['hours', 'minutes', 'seconds']).forEach(unit => {
        if (times[unit]) {
          $(`#${unit}`).text(`${unit} ${times[unit]} `);
        }
      });
    }, 1000);
    return timer;
  };

  const resetTime = (timer) => {
    clearInterval(timer);
    timer = null;
    $('#hours').text('');
    $('#minutes').text('');
    $('#seconds').text('');
  };

  const resetWithConfirm = (timer) => {
    $('button').on('click', function() {
      if ($(this).hasClass('cancel')) {
        $('#restart-modal').addClass('hidden');
        enableResets(timer);
      };
      if ($(this).hasClass('reset-now')) {
        $('#restart-modal').addClass('hidden');
        $('li').find('.flipped').removeClass('flipped');
        resetTime(timer);
        enableResets(timer);
        runGame();
      }
    });
  }

  //enables all reset buttons
  const enableResets = (timer) => {
    $('button').on('click', function () {
      let confirmation = false;
      //resets with confirmation
      if ($(this).hasClass('re-btn') || $(this).hasClass('words-btn')) {
        $('#restart-modal').removeClass('hidden');
        $('button').off();
        resetWithConfirm(timer);
      //resets without confirmation
      } else if ($(this).hasClass('start-btn')) {
        if (!$('#modal').hasClass('hidden')) {
          $('#modal').addClass('hidden');
        }
        if (!$('.pyro').hasClass('hidden')) {
          $('.pyro').addClass('hidden');
        }
        if (!$('.pyro > *').hasClass('hidden')) {
          $('.pyro > *').addClass('hidden');
        }
        $('li').find('.flipped').removeClass('flipped');
        resetTime(timer);
        runGame();
      }
    });
  };

  const resetRatings = () => {
    const $stars = $('.stars');
    for (let i = 0; i < $stars.length; i++) {
      if (!$($stars[i]).hasClass('hidden')) {
        $($stars[i]).addClass('hidden');
      }
    }
  }

  const selectRating = (type) => {
    resetRatings();
    const $ratings = $('.stars');
    const options = ['best', 'great', 'good'];
    const rating = options.indexOf(type);
    $($ratings[rating]).removeClass('hidden');
  };

  // dynamically updates stars
  const enableStars = () => {
    $("#guesses").change(() => {
      let guessCount = Number($("#guesses").text());
      if (guessCount === 0) {
        selectRating('best')
      } else if (guessCount === 14) {
        resetRatings();
        selectRating('great');
      } else if (guessCount === 20) {
        resetRatings();
        selectRating('good');
      } 
    });
  };

  //updates guess display count
  const updateCount = (guesses) => {
    $('#guesses').text(guesses);
    $('#guesses').trigger('change');
  }

  const playCardSound = (audio) => {
    audio.currentTime = 0;
    audio.play();
  };

  const flip = (card) => card.addClass('flipped');

  //avoids multiple-click issues
  const pauseClicks = () => $('li').off('click');

  // returns pairs of flipped cards to starting position
  const toggleSpin = ($card1, $card2) => {
    $card1.addClass('win');
    $card2.addClass('win');

    // setTimeouts allow time for cards to be seen
    setTimeout(() => {
      $card1.removeClass('win');
      $card2.removeClass('win');
    }, 900);
  };

  const toggleShake = ($card1, $card2) => {
    $card1.addClass('vibrate');
    $card2.addClass('vibrate');

    // setTimeouts allow time for cards to be seen
    setTimeout(() => {
      $card1.removeClass('vibrate');
      $card2.removeClass('vibrate');
    }, 900);
  };

  const resetCards = ($currentCard, $firstCard, audio) => {
    toggleShake($currentCard, $firstCard);
    $currentCard.removeClass('flipped');
    $firstCard.removeClass('flipped');
    playCardSound(audio);
  };

  const endGame = (timer) => {
    clearInterval(timer);
    let finalTime = $('#time').text().slice(14);
    let stars = $('#stars').html();
    $('#end-time').text(finalTime);
    $('#end-stars').html(stars);
    $('#modal').removeClass('hidden');
    $('.pyro').removeClass('hidden');
    $('.pyro > *').removeClass('hidden');
    let yay = $("#yay")[0];
    yay.play();
  };

  // recursively finds pairs until pairs equals 8
  const findPairs = (audio, $firstCard, timer, guesses, pairs) => {
    updateCount(guesses);
    $('li').click(function (e) {
      playCardSound(audio);
      const $currentCard = $(this).find('.card');
      const isFlippable = !$currentCard.hasClass('flipped');
      if (!$firstCard && isFlippable) {
        flip($currentCard);
        $firstCard = $currentCard;
      } else if ($firstCard && isFlippable) {
        const isMatch = $firstCard[0].dataset.pair === $currentCard[0].dataset.pair;
        flip($currentCard);
        pauseClicks();
        guesses++;
        if (isMatch) {
          toggleSpin($currentCard, $firstCard);
          pairs++;
          $firstCard = null;
        } else {
          pauseClicks();

          // setTimeouts allow time for cards to be seen
          setTimeout(function () {
            resetCards($currentCard, $firstCard, $('#zap')[0]);
            // resetCards($currentCard, $firstCard, audio);
            $firstCard = null;
          }, 1000);
        }
        setTimeout(function () {
          pairs > 7 ?
            endGame(timer) : findPairs(audio, $firstCard, timer, guesses, pairs);
        }, 1000);
      }
    });
  }

  const runGame = () => {
    const cards = shuffleCards($('li'));
    const audio = $('audio')[0];
    const buzz = $('audio')[1];
    let pairs = 0;
    let guesses = 0;
    let timer = startTimer();
    audio.volume = .3;
    buzz.volume = .1;
    display(cards);
    enableStars();
    enableResets(timer);
    findPairs(audio, null, timer, guesses, pairs);
  }

  runGame();
});
//TODOS: 
  //required:
    // add Code dependencies to README
  //I found a bug: hit restart after clicking on one tile
    //consider looking at the suggestions before attacking the bug to see if it might be handled

  //suggestions:
    //simplify stars + fix star functionality
      //★☆
      //it looks like the stars dissapear after a certain number of guesses
    //


