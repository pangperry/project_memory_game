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

  //updates guess display count
  const updateCount = (guesses) => $('#guesses').text(guesses);

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
      e.preventDefault();
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
          pairs > 0 ? 
            endGame(timer) : findPairs(audio, $firstCard, timer, guesses, pairs);
        }, 1000);
      }
    });
  }

  const runGame = () => {
    const cards = shuffleCards($('li'));
    let pairs = 0;
    let guesses = 0;
    let timer = startTimer();
    let audio = $('audio')[0];
    audio.volume = .2;
    display(cards);
    findPairs(audio, null, timer, guesses, pairs);
  }

  runGame();
});

    //TODOs: 
    //add wrong guess sound and action
    //write stars logic
    //wire up reset
    //make responsive
    //add high score list with local storage

