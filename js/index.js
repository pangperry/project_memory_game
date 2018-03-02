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
  }

  //enables both reset buttons, one with confirmation
  const enableResets = (timer) => {
    $('button').on('click', function () {
      let confirmation = true;
      if ($(this).hasClass('re-btn')) {
        message = window.confirm("Restart game?");
      }
      if (confirmation || $(this).hasClass('start-btn')) {
        if (!$('#modal').hasClass('hidden')) {
          $('#modal').addClass('hidden');
        }
        $('li').find('.flipped').removeClass('flipped');
        resetTime(timer);
        runGame();
      };
    });
  };
  
  const resetRatings = () => {
    const $stars = $('.stars');
    for (let i = 0; i < $stars.length; i++) {
      if(!$($stars[i]).hasClass('hidden')) {
        $($stars[i]).addClass('hidden');
      }
    }
  }

  const selectRating = (type) => {
    resetRatings();
    const $ratings = $('.stars');
    const options = ['best', 'great', 'good', 'fair'];
    const rating = options.indexOf(type);
    $($ratings[rating]).removeClass('hidden');
  };

  const enableStars = () => {
    $("#guesses").change(() => {
      let guessCount = Number($("#guesses").text());
      if (guessCount === 0) {
        selectRating('best')
      } else if (guessCount === 14) {
        selectRating('good');
      } else if (guessCount === 20) {
        selectRating('fair');
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
  const resetCards = ($currentCard, $firstCard, audio) => {
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
          pairs++;
          $firstCard = null;
        } else {
          pauseClicks();

          // setTimeouts allow time for cards to be seen
          setTimeout(function () {
            resetCards($currentCard, $firstCard, audio);
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
    let pairs = 0;
    let guesses = 0;
    let timer = startTimer();
    audio.volume = .2;
    display(cards);
    enableStars();
    enableResets(timer);
    findPairs(audio, null, timer, guesses, pairs);
  }

  runGame();
});

    //TODOs: 
      //write stars logic
      //add wrong guess sound and action
      //make responsive
      //maybe replace confirmation with modal confirmation
      //add high score list with local storage