// ── CONTACT QUIZ OVERLAY ──
// Loads questions from quiz-questions.json and pitches from quiz-pitches.json

(function () {
  // ── BUILD STATIC SHELL ──
  document.body.insertAdjacentHTML('beforeend', `
    <div class="quiz-overlay" id="quiz-overlay" aria-hidden="true">
      <button class="quiz-close" id="quiz-close" aria-label="Close">&#x2715;</button>
      <div class="quiz-overlay-inner" id="quiz-content-wrap">
        <div class="quiz-progress-row" id="quiz-progress-row">
          <div class="quiz-progress" id="quiz-progress"></div>
          <span class="quiz-version quiz-fade-only">EA1 : My Robot Legs v2.1.2</span>
        </div>
        <div class="quiz-stage" id="quiz-stage"></div>
      </div>
    </div>
  `);

  let questions = [];
  let pitchVariants = [];
  let scoringData = null;
  let currentQ = 0;
  let totalQ = 0;
  let quizOpenedAt = 0;
  const answers = {};

  const overlay   = document.getElementById('quiz-overlay');
  const stage     = document.getElementById('quiz-stage');
  const progress  = document.getElementById('quiz-progress');

  // ── LOAD DATA ──
  Promise.all([
    fetch('quiz-questions.json').then(r => r.json()),
    fetch('quiz-pitches.json').then(r => r.json()),
    fetch('quiz-scoring.json').then(r => r.json())
  ]).then(function ([qData, pData, sData]) {
    questions = qData;
    pitchVariants = pData;
    scoringData = sData;
    totalQ = questions.length;
    buildUI();
    bindEvents();
  });

  // ── BUILD UI FROM JSON ──
  function buildUI() {
    // Progress dots
    let dotsHTML = '';
    for (let i = 0; i < totalQ; i++) {
      dotsHTML += '<span class="quiz-step-dot quiz-fade-only' + (i === 0 ? ' active' : '') + '" data-step="' + i + '"></span>';
    }
    progress.innerHTML = dotsHTML;

    // Question slides
    let stageHTML = '';
    questions.forEach(function (q, i) {
      stageHTML += '<div class="quiz-question' + (i === 0 ? ' active' : '') + '" data-q="' + i + '">';
      stageHTML += '<h2 class="quiz-heading quiz-fade-only">' + q.heading + '</h2>';
      stageHTML += '<div class="quiz-options">';
      q.options.forEach(function (opt) {
        stageHTML += '<button class="quiz-option quiz-animate" data-value="' + opt.value + '">' + opt.label + '</button>';
      });
      stageHTML += '</div></div>';
    });

    // Pitch slide (after quiz questions)
    stageHTML += '<div class="quiz-question" data-q="' + totalQ + '">';
    stageHTML += '<img class="quiz-shiba quiz-fade-only" src="images/quiz-shiba.png" alt="" width="140" height="140">';
    stageHTML += '<h2 class="quiz-heading quiz-fade-only" id="quiz-pitch-heading">You might have just found your secret weapon.</h2>';
    stageHTML += '<p class="quiz-pitch quiz-animate" id="quiz-pitch-body"></p>';
    stageHTML += '<div class="quiz-form">';
    stageHTML += '<input type="text" class="quiz-input quiz-animate" id="quiz-name" placeholder="Your name" autocomplete="name" required>';
    stageHTML += '<input type="text" class="quiz-input quiz-animate" id="quiz-company" placeholder="Company / Organization" autocomplete="organization" required>';
    stageHTML += '<input type="email" class="quiz-input quiz-animate" id="quiz-email" placeholder="Work email" autocomplete="email" required>';
    stageHTML += '<input type="text" id="quiz-website" name="website" autocomplete="off" tabindex="-1" aria-hidden="true" style="position:absolute;left:-9999px;opacity:0;height:0;width:0;">';
    stageHTML += '<button class="quiz-submit quiz-animate" id="quiz-submit">Let\'s talk →</button>';
    stageHTML += '</div></div>';

    // Thank-you slide
    stageHTML += '<div class="quiz-question" data-q="' + (totalQ + 1) + '">';
    stageHTML += '<img class="quiz-shiba quiz-fade-only" src="images/quiz-shiba.png" alt="" width="140" height="140">';
    stageHTML += '<h2 class="quiz-heading quiz-fade-only">Thank you.</h2>';
    stageHTML += '<p class="quiz-thanks quiz-animate">We will be in touch shortly!</p>';
    stageHTML += '<a href="#" class="quiz-work-link quiz-animate" id="quiz-work-link">Back to the site →</a>';
    stageHTML += '</div>';

    stage.innerHTML = stageHTML;
  }

  // ── NAVIGATION ──
  function goTo(index) {
    var contentWrap = document.getElementById('quiz-content-wrap');
    var questionEls = document.querySelectorAll('.quiz-question');
    var dots = document.querySelectorAll('.quiz-step-dot');

    contentWrap.style.transition = 'opacity 0.25s ease';
    contentWrap.style.opacity = '0';

    setTimeout(function () {
      questionEls[currentQ].classList.remove('active');
      currentQ = index;
      questionEls[currentQ].classList.add('active');

      // Set pitch text on pitch slide
      if (currentQ === totalQ) {
        var pitch = getPitch(answers);
        answers.pitchResult = pitch.id || 'default';
        document.getElementById('quiz-pitch-heading').textContent = pitch.heading;
        document.getElementById('quiz-pitch-body').textContent = pitch.body;
      }

      dots.forEach(function (dot, i) {
        dot.classList.remove('active', 'done');
        if (i < currentQ) dot.classList.add('done');
        else if (i === currentQ) dot.classList.add('active');
      });

      document.getElementById('quiz-progress-row').style.opacity = currentQ >= totalQ ? '0' : '1';
      contentWrap.style.opacity = '1';
      staggerIn(questionEls[currentQ], false);
    }, 260);
  }

  function resetQuiz() {
    var questionEls = document.querySelectorAll('.quiz-question');
    var dots = document.querySelectorAll('.quiz-step-dot');

    questionEls.forEach(function (q) { q.classList.remove('active'); });
    questionEls[0].classList.add('active');
    currentQ = 0;

    dots.forEach(function (dot, i) {
      dot.classList.remove('active', 'done');
      if (i === 0) dot.classList.add('active');
    });

    document.getElementById('quiz-progress-row').style.opacity = '1';
    document.getElementById('quiz-name').value = '';
    document.getElementById('quiz-company').value = '';
    document.getElementById('quiz-email').value = '';

    document.querySelectorAll('.quiz-option').forEach(function (btn) {
      btn.classList.remove('selected');
    });

    for (var k in answers) delete answers[k];
  }

  // ── PITCH MATCHING (score-based) ──
  function getPitch(answers) {
    var ids = scoringData.pitchIds;
    var scores = ids.map(function () { return 0; });

    // Tally points from each answer
    for (var q = 0; q < totalQ; q++) {
      var answer = answers['q' + q];
      var qScoring = scoringData.scoring['q' + q];
      if (answer && qScoring && qScoring[answer]) {
        var points = qScoring[answer];
        for (var i = 0; i < points.length; i++) {
          scores[i] += points[i];
        }
      }
    }

    // Find highest score (first match wins ties — order in pitchIds is priority)
    var bestIndex = 0;
    var bestScore = scores[0];
    for (var j = 1; j < scores.length; j++) {
      if (scores[j] > bestScore) {
        bestScore = scores[j];
        bestIndex = j;
      }
    }

    // Log for debugging
    var scoreLog = {};
    ids.forEach(function (id, i) { scoreLog[id] = scores[i]; });
    console.log('Quiz scores:', scoreLog, '→', ids[bestIndex]);

    // Find matching pitch by id
    var winnerId = ids[bestIndex];
    for (var p = 0; p < pitchVariants.length; p++) {
      if (pitchVariants[p].id === winnerId) return pitchVariants[p];
    }

    // Fallback to default
    for (var d = 0; d < pitchVariants.length; d++) {
      if (pitchVariants[d].id === 'default') return pitchVariants[d];
    }
    return { heading: "Let's talk.", body: "We'd love to learn more about what you're working on." };
  }

  // ── ANIMATION ──
  function staggerIn(container, firstTime) {
    var progressRowEls = document.querySelectorAll('#quiz-progress-row .quiz-fade-only');

    if (firstTime) {
      document.querySelectorAll('.quiz-animate, .quiz-fade-only').forEach(function (el) { el.classList.remove('in'); });
      progressRowEls.forEach(function (el, i) {
        setTimeout(function () { el.classList.add('in'); }, i * 60);
      });
    } else {
      container.querySelectorAll('.quiz-animate, .quiz-fade-only').forEach(function (el) { el.classList.remove('in'); });
    }

    var offset = firstTime ? progressRowEls.length * 60 + 60 : 60;

    container.querySelectorAll('.quiz-fade-only').forEach(function (el) {
      setTimeout(function () { el.classList.add('in'); }, offset);
    });

    container.querySelectorAll('.quiz-animate').forEach(function (el, i) {
      setTimeout(function () { el.classList.add('in'); }, offset + 100 + i * 80);
    });
  }

  // ── EVENT BINDING ──
  function bindEvents() {
    // Open
    window.openContactQuiz = function () {
      resetQuiz();
      quizOpenedAt = Date.now();
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      setTimeout(function () { staggerIn(document.getElementById('quiz-content-wrap'), true); }, 80);
    };

    // Close
    function closeContactQuiz() {
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    document.getElementById('quiz-close').addEventListener('click', closeContactQuiz);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeContactQuiz();
    });

    // Option clicks
    document.querySelectorAll('.quiz-option').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var qIndex = parseInt(this.closest('.quiz-question').dataset.q);
        answers['q' + qIndex] = this.dataset.value;
        this.classList.add('selected');
        setTimeout(function () { goTo(currentQ + 1); }, 320);
      });
    });

    // Submit
    document.getElementById('quiz-submit').addEventListener('click', function () {
      var name = document.getElementById('quiz-name').value.trim();
      var company = document.getElementById('quiz-company').value.trim();
      var email = document.getElementById('quiz-email').value.trim();
      if (!name) { document.getElementById('quiz-name').focus(); return; }
      if (!company) { document.getElementById('quiz-company').focus(); return; }
      if (!email) { document.getElementById('quiz-email').focus(); return; }

      // Honeypot — bots auto-fill hidden fields
      if (document.getElementById('quiz-website').value) {
        goTo(totalQ + 1); // fake success, silently discard
        return;
      }

      // Timing — nobody completes a 5-question quiz in under 5 seconds
      if (Date.now() - quizOpenedAt < 5000) {
        goTo(totalQ + 1);
        return;
      }

      // Basic email format check
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById('quiz-email').focus();
        return;
      }

      answers.name = name;
      answers.company = company;
      answers.email = email;

      // Attach full-text labels for email readability
      answers.labels = {};
      for (var qi = 0; qi < totalQ; qi++) {
        var val = answers['q' + qi];
        if (val && questions[qi]) {
          answers.labels['q' + qi] = {
            question: questions[qi].heading,
            answer: ''
          };
          questions[qi].options.forEach(function (opt) {
            if (opt.value === val) answers.labels['q' + qi].answer = opt.label;
          });
        }
      }

      // Attach full pitch text
      var matchedPitch = null;
      for (var pi = 0; pi < pitchVariants.length; pi++) {
        if (pitchVariants[pi].id === answers.pitchResult) { matchedPitch = pitchVariants[pi]; break; }
      }
      if (matchedPitch) {
        answers.pitchHeading = matchedPitch.heading;
        answers.pitchBody = matchedPitch.body;
      }

      fetch('/api/submit-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers)
      }).catch(function (err) {
        console.warn('Submit error:', err);
      });

      goTo(totalQ + 1);
    });

    // Enter key on form inputs
    document.querySelectorAll('.quiz-input').forEach(function (inp) {
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') document.getElementById('quiz-submit').click();
      });
    });

    // Work link closes overlay
    document.getElementById('quiz-work-link').addEventListener('click', function (e) {
      e.preventDefault();
      closeContactQuiz();
    });
  }
})();
