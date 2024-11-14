function initializeSequenceMutation() {
    console.log('Initializing sequence mutation');  // Debug log

    const sequence = `GGTGGAGGTTGCAGTGAGCCAAGATCATGCCACTGCACTCCACCCTGGGTGACAGAACAAGACTCTGTCCCCACCAAAAAGAAAAAATGTAAATGAAAAGGAAAGATCTGCCAGGCCATAGCTCCTTGCTTCCCAGGCCACATTCCAGGGAGGCCAGGAGAGGCCCAGAGACCAGTCTAACCGAGGTCCAGGCAGCCCAGAGCACGAAGGCTGGTGGAGAGCTGGCCACGTGTCCTGAGCTACGGTCAGTCAGAAGGCTGAAGGTGAGTCATCCCAGACACCGTGCTCAGTGCCAGGCCCATCAGAGGCCCTGGGCAGGAACAGCAGCACTCAGTAACAATGGGGACACTTACCACCCTTACCCTGGAAGGGCCTCAGAAGCACTCTCTCCAGGCTCGACTTGCCTAAGCTAGGAATCAGATCTGCAGAAACCCAAGTCCCATAGCGTGTGCTGGGTAGAGCCGCCTACTCCTCGTGGGGCCTTTGAGCAGGCAGACAGCTCTCTGTTGGGGATCACAAG`.toUpperCase();

    const colors = {
        'A': '#44AF69',
        'C': '#F8333C',
        'T': '#FCAB10',
        'G': '#2B9EB3'
    };

    function createSequenceDisplay() {
        console.log('Creating sequence display');  // Debug log
        const container = document.getElementById('sequence-container');
        if (!container) {
            console.error('Container not found');  // Debug log
            return;
        }

        container.innerHTML = '';
        let currentLine = document.createElement('div');
        currentLine.style.whiteSpace = 'pre';

        sequence.split('').forEach((letter, index) => {
            if (index > 0 && index % 50 === 0) {
                container.appendChild(currentLine);
                currentLine = document.createElement('div');
                currentLine.style.whiteSpace = 'pre';
            }

            const span = document.createElement('span');
            span.textContent = index === 199 ? 'G' : letter;
            span.className = 'sequence-letter';
            span.style.color = colors[index === 199 ? 'G' : letter];
            if (index === 199) {
                span.id = 'mutation-site';
            }
            currentLine.appendChild(span);
        });

        container.appendChild(currentLine);
        console.log('Sequence display created');  // Debug log
    }

    function mutateSequence() {
        const mutationSite = document.getElementById('mutation-site');
        if (mutationSite) {
            mutationSite.style.transition = 'all 0.3s ease';
            mutationSite.style.color = '#F8333C';
            mutationSite.textContent = 'C';
        }
    }

    // Wait for Reveal.js to be ready
    window.addEventListener('load', () => {
        console.log('Window loaded');  // Debug log
        if (typeof Reveal !== 'undefined') {
            Reveal.on('slidechanged', event => {
                console.log('Slide changed', event.currentSlide.id);  // Debug log
                if (event.currentSlide.id === 'sequence-mutation-slide') {
                    createSequenceDisplay();
                }
            });

            Reveal.on('fragmentshown', event => {
                console.log('Fragment shown');  // Debug log
                if (event.fragment.closest('#sequence-mutation-slide')) {
                    mutateSequence();
                }
            });

            // Initial creation if we start on this slide
            if (Reveal.getCurrentSlide()?.id === 'sequence-mutation-slide') {
                console.log('Initial creation');  // Debug log
                createSequenceDisplay();
            }
        } else {
            console.error('Reveal.js not found');  // Debug log
        }
    });
}

// Export and initialize
export { initializeSequenceMutation };
initializeSequenceMutation();