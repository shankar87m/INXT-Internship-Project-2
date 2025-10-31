(() => {
  const words = [
    {word: "JAVASCRIPT", hint: "Programming language"},
    {word: "HTML", hint: "Markup language"},
    {word: "CSS", hint: "Styling language"},
    {word: "FUNCTION", hint: "Reusable block of code"},
    {word: "VARIABLE", hint: "Stores value"},
    {word: "ARRAY", hint: "Ordered list"},
    {word: "OBJECT", hint: "Key-value pairs"}
  ];

  const maxWrong = 6;
  let selected = null;
  let guessed = new Set();
  let wrongLetters = [];

  const wordEl = document.getElementById('word');
  const wrongEl = document.getElementById('wrong-letters');
  const keyboardEl = document.getElementById('keyboard');
  const messageEl = document.getElementById('message');
  const newBtn = document.getElementById('new-game');
  const hintBtn = document.getElementById('show-hint');

  const hangmanParts = [
    document.getElementById('head'),
    document.getElementById('body'),
    document.getElementById('left-arm'),
    document.getElementById('right-arm'),
    document.getElementById('left-leg'),
    document.getElementById('right-leg')
  ];

  function pickWord() {
    return words[Math.floor(Math.random() * words.length)];
  }

  function createKeyboard() {
    keyboardEl.innerHTML = '';
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    letters.forEach(ch => {
      const btn = document.createElement('button');
      btn.className = 'key';
      btn.textContent = ch;
      btn.addEventListener('click', () => handleGuess(ch, btn));
      keyboardEl.appendChild(btn);
    });
  }

  function handleGuess(letter, btn) {
    if (!selected || btn.classList.contains('disabled')) return;
    btn.classList.add('disabled');

    if (selected.word.includes(letter)) {
      guessed.add(letter);
      updateWordDisplay();
      checkWin();
    } else {
      wrongLetters.push(letter);
      wrongEl.textContent = wrongLetters.join(', ');
      revealPart(wrongLetters.length - 1);
      checkLose();
    }
  }

  function updateWordDisplay() {
    wordEl.innerHTML = '';
    for (const ch of selected.word) {
      const span = document.createElement('div');
      span.className = 'letter-box';
      span.textContent = guessed.has(ch) ? ch : '';
      wordEl.appendChild(span);
    }
  }

  function revealPart(index) {
    if (index >= 0 && index < hangmanParts.length) {
      hangmanParts[index].style.opacity = '1';
    }
  }

  function resetHangman() {
    hangmanParts.forEach(p => { p.style.opacity = '0'; });
  }

  function checkWin() {
    const allLetters = selected.word.replace(/\s+/g, '').split('');
    const unique = Array.from(new Set(allLetters));
    const won = unique.every(l => guessed.has(l));
    if (won) {
      messageEl.textContent = '🎉 Aap jeet gaye! (You win)';
      disableKeyboard();
    }
  }

  function checkLose() {
    if (wrongLetters.length >= maxWrong) {
      messageEl.textContent = `😞 Haar gaye — Word tha: ${selected.word}`;
      for (const ch of selected.word) guessed.add(ch);
      updateWordDisplay();
      disableKeyboard();
    }
  }

  function disableKeyboard() {
    const keys = keyboardEl.querySelectorAll('.key');
    keys.forEach(k => k.classList.add('disabled'));
  }

  function enableKeyboard() {
    const keys = keyboardEl.querySelectorAll('.key');
    keys.forEach(k => k.classList.remove('disabled'));
  }

  function startGame() {
    selected = pickWord();
    guessed = new Set();
    wrongLetters = [];
    wrongEl.textContent = '';
    messageEl.textContent = '';
    resetHangman();
    updateWordDisplay();
    enableKeyboard();
  }

  newBtn.addEventListener('click', startGame);
  hintBtn.addEventListener('click', () => {
    if (!selected) return;
    alert('Hint: ' + (selected.hint || 'No hint'));
  });

  createKeyboard();
  startGame();

  window.addEventListener('keydown', (e) => {
    if (!selected) return;
    const key = (e.key || '').toUpperCase();
    if (!/^[A-Z]$/.test(key)) return;
    const btn = Array.from(keyboardEl.children).find(b => b.textContent === key);
    if (btn && !btn.classList.contains('disabled')) btn.click();
  });
})();
