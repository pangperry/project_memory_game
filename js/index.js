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

  const updateCount = (guesses) => $('#guesses').text(guesses);

  const playCardSound = (audio) => {
    audio.currentTime = 0;
    audio.play();
  };

  const flip = (card) => card.addClass('flipped');

  const pauseClicks = () => $('li').off('click');

  const reflipCards = ($currentCard, $firstCard, audio) => {
    $currentCard.removeClass('flipped');
    $firstCard.removeClass('flipped');
    playCardSound(audio);
  };

  const endGame = (timer) => {
    clearInterval(timer);
    $('#modal').removeClass('hidden');
  };

  const startGame = () => {
    let timer;
    let pairs = 0;
    let guesses = 0;
    const cards = shuffleCards($('li'));
    const audio = $('audio')[0];
    audio.volume = .2;

    // recursively finds pairs until pairs equals 8
    const findPairs = (audio, $firstCard=null) => {
      updateCount(guesses);
      $('li').click(function (e) {
        e.preventDefault();
        playCardSound(audio);
        const $currentCard = $(this).find('.card');
        const isFlippable = !$currentCard.hasClass('flipped');

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
              reflipCards($currentCard, $firstCard, audio);
              $firstCard = null;
            }, 1000);
          }
          // delays one second so player has time to read cards
          setTimeout(function () {
            pairs < 2 ? findPairs(audio) : endGame(timer);
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

