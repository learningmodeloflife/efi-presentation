class AnimatedSequence {
    constructor(rootElement) {
        this.root = rootElement;
        this.pressedKey = null;
        this.minutes = 8760000;
        this.isAnimating = false;
        this.CHARS_PER_MINUTE = 300;
        this.INTERVAL_MS = (60 * 1000) / this.CHARS_PER_MINUTE;
        this.letterInterval = null;
        this.timerInterval = null;
        this.nucleotides = ['A', 'C', 'T', 'G'];
        
        this.completionDate = this.calculateCompletionDate();
        this.createDOMStructure();
        
        setTimeout(() => {
            const dateSpan = this.root.querySelector('.completion-date .date');
            if (dateSpan) {
                dateSpan.style.opacity = '1';
            }
        }, 5000);
        
        this.startAnimation();
    }
  
    calculateCompletionDate() {
        const date = new Date();
        date.setDate(date.getDate() + 7407);
        return date.toLocaleDateString('en-UK', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    createDOMStructure() {
        const keyboardLayout = {
            functionRow: ['esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'logo'],
            numberRow: ['§', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'delete'],
            topRow: ['tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
            homeRow: ['caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', '\'', 'return'],
            bottomRow: ['shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'shift'],
            modifierRow: ['fn', 'control', 'option', 'command', 'space', 'command', 'option', 'control']
        };

        const keySize = 45;
        const keySpacing = 48;
        const rowSpacing = 48;
        
        this.root.innerHTML = `
            <div class="timer-wrapper">
                <div class="completion-date">
                    <span class="label">Complete on: </span>
                    <span class="date" style="opacity: 0">${this.completionDate}</span>
                </div>
                <div class="timer" id="timer"></div>
            </div>
            
            <div class="typed-text" id="typed-text"></div>
            
            <div class="keyboard">
                <svg viewBox="0 0 850 340" style="width: 850px;">
                    ${this.generateKeyboardRows(keyboardLayout, keySize, keySpacing, rowSpacing)}
                </svg>
            </div>
        `;

        this.timerElement = this.root.querySelector('#timer');
    }

    generateKeyboardRows(layout, keySize, keySpacing, rowSpacing) {
        let yOffset = 20;
        let html = '';
        
        const keySizes = {
            'delete': 1.5,
            'tab': 1.5,
            'caps': 1.5,
            'shift': 2.25,
            'return': 2,
            'command': 1.25,
            'option': 1.25,
            'control': 1.25,
            'fn': 1.25,
            'space': 4.5,
            'logo': 1.5,
            '\\': 1.5
        };

        // Calculate total width for the widest row
        const getTotalRowWidth = (keys) => {
            return keys.reduce((total, key) => {
                const width = (keySizes[key] || 1) * keySize;
                return total + width + 3;
            }, 0);
        };

        const maxWidth = Math.max(...Object.values(layout).map(getTotalRowWidth));
        const startX = (850 - maxWidth) / 2;

        Object.entries(layout).forEach(([rowName, keys]) => {
            // Calculate the actual width of this row
            const rowWidth = getTotalRowWidth(keys);
            
            // Center align each row
            let xOffset = startX + (maxWidth - rowWidth) / 2;
            
            keys.forEach(key => {
                const width = (keySizes[key] || 1) * keySize;
                const isSpecialKey = key.length > 1;
                const isFunctionKey = rowName === 'functionRow';
                
                const displayKey = key
                    .replace('space', '')
                    .replace('command', '⌘')
                    .replace('option', '⌥')
                    .replace('shift', '⇧')
                    .replace('control', '⌃')
                    .replace('delete', '⌫')
                    .replace('return', '↵')
                    .replace('caps', '⇪')
                    .replace('logo', `<image href="assets/LML_logo.png" x="${width/2 - 10}" y="${keySize/2 - 10}" width="20" height="20"/>`);
                
                html += `
                    <g transform="translate(${xOffset}, ${yOffset})" class="key-group">
                        <rect x="2" y="2" 
                              width="${width-4}" height="${keySize-4}"
                              rx="4" ry="4"
                              fill="#ffffff"
                              stroke="#d0d0d0"
                              stroke-width="1.5"
                              class="key-${key.replace(/[^a-zA-Z0-9]/g, '_')}"/>
                        
                        ${key === 'logo' ? displayKey : `
                            <text x="${width/2}" y="${keySize/2}" 
                                  font-family="SF Pro, -apple-system, Arial, sans-serif" 
                                  font-size="${isSpecialKey ? '11' : isFunctionKey ? '10' : '13'}" 
                                  font-weight="${isSpecialKey ? '500' : '400'}"
                                  text-anchor="middle" 
                                  dominant-baseline="middle"
                                  fill="#505050"
                            >${displayKey}</text>
                        `}
                    </g>
                `;
                
                xOffset += width + 3;
            });
            
            yOffset += rowSpacing;
        });
        
        return html;
    }

    updateTimer() {
        if (!this.isAnimating) return;

        let charCount = this.getCharacterCount();
        const countStr = charCount.toString();
        
        // Create the HTML structure with empty boxes on the left
        const totalBoxes = 10;  // Total number of boxes to show
        const emptyBoxes = totalBoxes - countStr.length;
        
        this.timerElement.innerHTML = 
            // Empty boxes
            Array(emptyBoxes).fill(0).map(() => 
                `<div class="digit-box">&nbsp;</div>`
            ).join('') +
            // Actual count boxes
            countStr.split('').map(digit => 
                `<div class="digit-box">${digit}</div>`
            ).join('');
    }

    getCharacterCount() {
        this._characterCount = (this._characterCount || 0) + 1;
        return this._characterCount;
    }

    createLetter(letter) {
        const keyClass = `key-${letter.replace(/[^a-zA-Z0-9]/g, '_')}`;
        const keyElement = this.root.querySelector(`.${keyClass}`);
        
        if (keyElement) {
            // Flash the key
            const keyGroup = keyElement.closest('.key-group');
            keyGroup.classList.add('pressed');
            
            setTimeout(() => {
                keyGroup.classList.remove('pressed');
            }, 80);

            // Update the counter
            this.updateTimer();

            // Add letter to typed text with color
            const typedText = this.root.querySelector('#typed-text');
            const span = document.createElement('span');
            span.textContent = letter;
            
            // Set initial state - fully visible immediately
            span.style.position = 'relative';
            span.style.display = 'inline-block';
            span.style.opacity = '1';  // Start visible
            
            // Set color based on nucleotide
            const colors = {
                'A': '#44AF69',
                'C': '#F8333C',
                'T': '#FCAB10',
                'G': '#2B9EB3'
            };
            span.style.color = colors[letter];
            
            // Add to DOM
            typedText.prepend(span);

            // Fade out and remove
            setTimeout(() => {
                span.style.transition = 'all 0.5s ease-out';
                span.style.opacity = '0.5';
                setTimeout(() => span.remove(), 500);
            }, 3000);
        }
    }

    startAnimation() {
        this.isAnimating = true;
        this._characterCount = 0;
        this.updateTimer();
        
        this.letterInterval = setInterval(() => {
            const randomNucleotide = this.nucleotides[Math.floor(Math.random() * this.nucleotides.length)];
            this.createLetter(randomNucleotide);
        }, this.INTERVAL_MS);
    }

    stopAnimation() {
        this.isAnimating = false;
        clearInterval(this.letterInterval);
        clearInterval(this.timerInterval);
    }

    cleanup() {
        this.stopAnimation();
        this.root.innerHTML = '';
    }
}

// Export for use in Reveal.js
export function initializeSequence(rootElement) {
    return new AnimatedSequence(rootElement);
}

let sequenceInstance = null;

export function initializeRevealHandlers() {
    // Initialize when Reveal.js is ready
    const setupSequence = (slide) => {
        const root = slide.querySelector('#animated-sequence-root');
        if (root) {
            sequenceInstance = initializeSequence(root);
        }
    };

    const cleanupSequence = () => {
        if (sequenceInstance) {
            sequenceInstance.cleanup();
            sequenceInstance = null;
        }
    };

    // Initial setup
    const currentSlide = Reveal.getCurrentSlide();
    if (currentSlide && currentSlide.classList.contains('sequence-slide')) {
        setupSequence(currentSlide);
    }

    // Handle slide changes
    Reveal.on('slidechanged', event => {
        cleanupSequence();
        if (event.currentSlide.classList.contains('sequence-slide')) {
            setupSequence(event.currentSlide);
        }
    });
}

// Listen for reveal-ready event instead of auto-initializing
window.addEventListener('reveal-ready', () => {
    if (typeof Reveal !== 'undefined') {
        initializeRevealHandlers();
    } else {
        console.error('Reveal.js not found. Timer initialization failed.');
    }
});