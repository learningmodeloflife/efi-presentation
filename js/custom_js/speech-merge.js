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
        const speechesContainer = slideElement.querySelector('.speeches-container');
        
        // Get all text content and split into words
        const allWords = containers.map(container => 
            container.textContent.trim().split(/\s+/)
        ).flat();
        
        // Shuffle words
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

        // Prepare merged text in center container
        const centerContainer = containers[1];
        centerContainer.innerHTML = shuffledWords.join(' ');
        
        // Add merged class to slide for CSS styling
        slideElement.classList.add('merged');
        
        // Position center container to span full width
        centerContainer.style.width = '100%';
        centerContainer.style.position = 'absolute';
        centerContainer.style.left = '50%';
        centerContainer.style.transform = 'translateX(-50%)';
        
        // Hide other containers
        containers[0].style.display = 'none';
        containers[2].style.display = 'none';
        
        // Adjust speeches container
        speechesContainer.style.width = '100%';
        speechesContainer.style.padding = '0 calc(100% / 12)';
        
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