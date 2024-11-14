export function initializeDecodingAnimation() {
  const container = document.getElementById('decoding-animation');
  if (!container || window.innerWidth <= 768) return; 
  const content = container.textContent.trim();
  container.textContent = null;

  function calculateCharSize() {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const totalWidth = vw * (2/5); 
    const charWidth = totalWidth / content.length;
    const charWidthClamped = Math.min(Math.max(8, charWidth), 50); 
    const charHeight = charWidthClamped * 1.1; 
    return {
        width: charWidthClamped,
        height: charHeight
    };
  }

  let { height: charHeight, width: charWidth } = calculateCharSize();

  const nucleotides = ['A', 'C', 'T', 'G'];
  const binaryDigits = ['0', '1'];

  const chars = [];
  const delayOffset = 1.5;
  const delayWindow = 1.5;
  const blendDuration = 0.5;

  const resetRadius = 100;
  const resetChance = 1.0;

  function isMobile() {
    return window.innerWidth <= 590;
  }

  function createLayout() {
    container.innerHTML = '';
    chars.length = 0;

    if (isMobile()) {
      createMobileLayout();
    } else {
      createDesktopLayout();
    }
  }

  function createMobileLayout() {
    const words = content.split(' ');
    words.forEach(word => {
      const wordContainer = document.createElement('div');
      wordContainer.className = 'decoding-word';
      word.split('').forEach((letter, index) => {
        const char = createChar(letter, chars.length);
        wordContainer.appendChild(char);
        chars.push(char);
      });
      container.appendChild(wordContainer);
    });
  }

  function createDesktopLayout() {
    const textWidth = content.length * charWidth;
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-block';
    wrapper.style.width = textWidth + 'px';
    wrapper.style.height = charHeight + 'px';
    
    for (let i = 0; i < content.length; i++) {
        const char = createChar(content[i], i);
        char.style.position = 'absolute';
        char.style.left = `${i * charWidth}px`;
        char.style.top = '0';
        wrapper.appendChild(char);
        chars.push(char);
    }
    
    container.appendChild(wrapper);
  }

  function createChar(letter, index) {
    const char = document.createElement('span');
    char.classList.add('decoding-char', 'decoded-text');
    char.style.width = `${charWidth}px`;
    char.style.height = `${charHeight}px`;
    char.style.fontSize = `${charHeight * 0.9}px`;
    char.dataset.final_char = letter;
    char.dataset.index = index;
    runDecoding(char, delayOffset);
    return char;
  }

  async function runDecoding(char, delayInitial) {
    if (!char.classList.contains('decoding')) {
      char.classList.add('decoding');
      char.classList.replace('decoded-text', 'encoded-text');
      char.textContent = sampleLetter(nucleotides);

      const blendOut = { opacity: [1, 0] };
      const blendIn = { opacity: [0, 1] };

      const durationNucleotide = delayInitial + Math.random() * delayWindow;
      const durationBinary = delayOffset + Math.random() * delayWindow;

      await char.animate(blendOut, { duration: durationNucleotide * 1000, iterations: 1, fill: 'forwards' }).finished;
      char.textContent = sampleLetter(binaryDigits);
      await char.animate(blendIn, { duration: durationBinary * 1000, iterations: 1, fill: 'forwards' }).finished;

      await char.animate(blendOut, { duration: blendDuration * 1000, delay: durationBinary * 1000, iterations: 1, fill: 'forwards' }).finished;
      char.textContent = char.dataset.final_char;
      char.classList.replace('encoded-text', 'decoded-text');
      await char.animate(blendIn, { duration: blendDuration * 1000, iterations: 1, fill: 'forwards' }).finished;
      char.classList.remove('decoding');
    }
  }

  function sampleLetter(letters) {
    return letters[Math.floor(Math.random() * letters.length)];
  }

  function resetNearbyChars(event) {
    const rect = container.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    chars.forEach(char => {
      const charRect = char.getBoundingClientRect();
      const charCenterX = charRect.left + charRect.width / 2 - rect.left;
      const charCenterY = charRect.top + charRect.height / 2 - rect.top;

      const distance = Math.sqrt(
        Math.pow(mouseX - charCenterX, 2) + Math.pow(mouseY - charCenterY, 2)
      );

      if (distance <= resetRadius) {
        if (resetChance * (1 - distance / resetRadius) > Math.random()) {
          runDecoding(char, 0);
        }
      }
    });
  }

  createLayout();
  container.addEventListener('mousemove', resetNearbyChars);

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      ({ height: charHeight, width: charWidth } = calculateCharSize());
      createLayout();
    }, 250);
  });
}

window.addEventListener('reveal-ready', () => {
  initializeDecodingAnimation();
});
