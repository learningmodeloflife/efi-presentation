export function initializeSpeechMerge() {
    window.addEventListener('load', () => {
        if (typeof Reveal !== 'undefined') {
            Reveal.on('fragmentshown', event => {
                if (event.fragment.classList.contains('merge-trigger')) {
                    mergeTexts(event.fragment.closest('.speech-slide'));
                }
            });
        }
    });

    async function mergeTexts(slideElement) {
        const containers = Array.from(slideElement.querySelectorAll('.speech-container'));
        
        // First, set the initial colors for each container
        containers[0].style.color = '#011627';
        containers[1].style.color = '#f71735';
        containers[2].style.color = '#57886c';
        
        // Get all text content and split into words with color information
        const allWords = containers.map((container, index) => {
            const words = container.textContent.trim().split(/\s+/);
            return words.map(word => ({
                text: word,
                color: container.style.color
            }));
        }).flat();
        
        // Shuffle words while preserving their colors
        const shuffledWords = shuffleArray(allWords);
        
        // Create fade out animation
        const fadeOut = { opacity: [1, 0] };
        const fadeIn = { opacity: [0, 1] };
        
        // Fade out all containers
        await Promise.all(containers.map(container =>
            container.animate(fadeOut, { 
                duration: 1000, 
                fill: 'forwards' 
            }).finished
        ));

        // Prepare merged text in center container with preserved colors
        const centerContainer = containers[1];
        centerContainer.innerHTML = shuffledWords.map(word => 
            `<span class="word" style="color: ${word.color}">${word.text}</span>`
        ).join(' ');
        
        // Add merged class to slide for CSS styling
        slideElement.classList.add('merged');
        
        // Position center container
        centerContainer.style.width = '100%';
        centerContainer.style.position = 'absolute';
        centerContainer.style.left = '50%';
        centerContainer.style.transform = 'translateX(-50%)';
        
        // Hide other containers
        containers[0].style.display = 'none';
        containers[2].style.display = 'none';
        
        // Fade in merged text
        await centerContainer.animate(fadeIn, { 
            duration: 1000, 
            fill: 'forwards' 
        }).finished;
    }

    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
}