// Initialize function
function initializeSequencingCosts() {
    function createGenomeGraph() {
        // Clear any existing graph
        d3.select("#graph").selectAll("*").remove();
        
        // Set up dimensions
        const width = 800;
        const height = 500;
        const margin = {top: 40, right: 60, bottom: 60, left: 80};
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Create SVG container
        const svg = d3.select("#graph")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // Create group for the graph
        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Data
        const data = [
            { year: 2001, cost: 100000000 },
            { year: 2002, cost: 50000000 },
            { year: 2003, cost: 25000000 },
            { year: 2004, cost: 15000000 },
            { year: 2005, cost: 10000000 },
            { year: 2006, cost: 8000000 },
            { year: 2007, cost: 5000000 },
            { year: 2008, cost: 2000000 },
            { year: 2009, cost: 100000 },
            { year: 2010, cost: 50000 },
            { year: 2011, cost: 10000 },
            { year: 2012, cost: 5000 },
            { year: 2013, cost: 4000 },
            { year: 2014, cost: 3000 },
            { year: 2015, cost: 2000 },
            { year: 2016, cost: 1500 },
            { year: 2017, cost: 1200 },
            { year: 2018, cost: 1000 },
            { year: 2019, cost: 800 },
            { year: 2020, cost: 600 },
            { year: 2021, cost: 500 },
            { year: 2022, cost: 400 },
            { year: 2023, cost: 300 }
        ];

        // Moore's Law data (halving every 18 months)
        const mooresData = data.map(d => ({
            year: d.year,
            cost: 100000000 * Math.pow(0.5, (d.year - 2001) / 1.5)
        }));

        // Scales
        const xScale = d3.scaleLinear()
            .domain([2001, 2023])
            .range([0, innerWidth]);

        const yScale = d3.scaleLog()
            .domain([100, 100000000])
            .range([innerHeight, 0]);

        // Axes
        const xAxis = d3.axisBottom(xScale)
            .ticks(10)
            .tickFormat(d3.format("d"));

        const yAxis = d3.axisLeft(yScale)
            .tickValues([100, 1000, 10000, 100000, 1000000, 10000000, 100000000])
            .tickFormat(d => {
                if (d >= 1000000) return `$${d/1000000}M`;
                if (d >= 1000) return `$${d/1000}K`;
                return `$${d}`;
            });

        // Add axes
        g.append("g")
            .attr("class", "axis")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(xAxis);

        g.append("g")
            .attr("class", "axis")
            .call(yAxis);

        // Line generators
        const mooresLine = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.cost));

        const realCostLine = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.cost));

        // Add paths with initial dashoffset for animation
        const mooresPath = g.append("path")
            .datum(mooresData)
            .attr("fill", "none")
            .attr("stroke", "#999")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "4,4")
            .attr("d", mooresLine)
            .attr("stroke-dashoffset", function() { return this.getTotalLength(); })
            .attr("stroke-dasharray", function() { return this.getTotalLength(); });

        const realCostPath = g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#e41a1c")
            .attr("stroke-width", 2)
            .attr("d", realCostLine)
            .attr("stroke-dashoffset", function() { return this.getTotalLength(); })
            .attr("stroke-dasharray", function() { return this.getTotalLength(); });

        // Add labels
        g.append("text")
            .attr("class", "axis-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -innerHeight / 2)
            .attr("y", -60)
            .attr("text-anchor", "middle")
            .attr("font-size", "0.4em")
            .text("Cost per Genome");

        // Add legend
        g.append("line")
            .attr("x1", innerWidth - 120)
            .attr("x2", innerWidth - 90)
            .attr("y1", 18)
            .attr("y2", 18)
            .attr("stroke", "#999")
            .attr("stroke-width", 2);

        g.append("line")
            .attr("x1", innerWidth - 120)
            .attr("x2", innerWidth - 90)
            .attr("y1", 38)
            .attr("y2", 38)
            .attr("stroke", "#e41a1c")
            .attr("stroke-width", 2);

        g.append("text")
            .attr("x", innerWidth - 80)
            .attr("y", 18)
            .attr("alignment-baseline", "middle")
            .attr("font-size", "0.4em")
            .text("Moore's Law");

        g.append("text")
            .attr("x", innerWidth - 80)
            .attr("y", 38)
            .attr("alignment-baseline", "middle")
            .attr("font-size", "0.4em")
            .text("Real cost");

        // Animate Moore's Law line
        mooresPath.transition()
            .duration(4000)
            .attr("stroke-dashoffset", 0)
            .on("end", function() {
                // After Moore's Law line is drawn, animate real cost line
                realCostPath.transition()
                    .duration(4000)
                    .attr("stroke-dashoffset", 0);
            });
    }

    // Wait for Reveal to be ready
    window.addEventListener('reveal-ready', () => {
        Reveal.on('slidechanged', event => {
            if (event.currentSlide.id === 'genome-cost-slide') {
                createGenomeGraph();
            }
        });

        // Initial creation if needed
        if (Reveal.getCurrentSlide()?.id === 'genome-cost-slide') {
            createGenomeGraph();
        }
    });
}

// Export and auto-initialize
export { initializeSequencingCosts };
initializeSequencingCosts();