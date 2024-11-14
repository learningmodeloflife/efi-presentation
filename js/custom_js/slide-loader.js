export async function loadSlides() {
    try {
        // Fetch and parse YAML configuration
        const yamlResponse = await fetch('slides.yaml');
        const yamlText = await yamlResponse.text();
        const config = jsyaml.load(yamlText);

        const slidesContainer = document.querySelector('.slides');
        
        // Load each slide
        for (const slide of config.slides) {
            try {
                const response = await fetch(slide.file);
                if (!response.ok) {
                    throw new Error(`Failed to load slide: ${slide.file}`);
                }
                const html = await response.text();
                
                // Create a temporary container
                const temp = document.createElement('div');
                temp.innerHTML = html.trim();
                
                // Get the first section element
                const slideElement = temp.querySelector('section');
                if (!slideElement) {
                    console.error(`No section element found in ${slide.file}`);
                    continue;
                }
                
                // Append the slide
                slidesContainer.appendChild(slideElement);
            } catch (error) {
                console.error(`Error loading slide ${slide.file}:`, error);
            }
        }
    } catch (error) {
        console.error('Error loading slides:', error);
        throw error;
    }
}