// Mind map module for Air Quality Dashboard
let mindmapSvg, simulation, root, link, node;
let currentZoom = { scale: 1, translate: [0, 0] };
let zoomBehavior;

// Initialize the mind map
function initMindMap() {
    const width = document.getElementById('mindmap').offsetWidth;
    const height = 600;
    
    // Create SVG container
    mindmapSvg = d3.select("#mindmap")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("class", "mindmap-svg");
    
    // Add zoom behavior
    zoomBehavior = d3.zoom()
        .scaleExtent([0.5, 3])
        .on("zoom", (event) => {
            const container = d3.select(".mindmap-container");
            container.attr("transform", event.transform);
            currentZoom.scale = event.transform.k;
            currentZoom.translate = [event.transform.x, event.transform.y];
        });
    
    mindmapSvg.call(zoomBehavior);
    
    // Create a container group for all elements
    const container = mindmapSvg.append("g")
        .attr("class", "mindmap-container");
    
    // Update mind map data with top polluted countries
    const mindMapDataWithCountries = updateMindMapWithTopCountries();
    
    // Create hierarchical data structure
    root = d3.hierarchy(mindMapDataWithCountries);
    
    // Create force simulation
    simulation = d3.forceSimulation(root.descendants())
        .force("link", d3.forceLink(root.links()).id(d => d.id).distance(100).strength(1))
        .force("charge", d3.forceManyBody().strength(-800))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX(width / 2).strength(0.1))
        .force("y", d3.forceY(height / 2).strength(0.1))
        .alphaTarget(0);
    
    // Create links
    link = container.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(root.links())
        .enter().append("line")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 2)
        .attr("class", "mindmap-link");
    
    // Create nodes
    node = container.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(root.descendants())
        .enter().append("g")
        .attr("class", "mindmap-node")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
    
    // Add circles to nodes with varying sizes and colors based on depth
    node.append("circle")
        .attr("r", d => {
            // Main node is bigger
            if (d.depth === 0) return 30;
            // Category nodes are medium
            if (d.depth === 1) return 20;
            // Leaf nodes size based on value if available
            return d.data.value ? Math.max(10, Math.min(15, d.data.value / 10)) : 10;
        })
        .attr("fill", d => {
            // Color scheme based on node depth and category
            if (d.depth === 0) return "#1e88e5"; // Main node - primary color
            if (d.depth === 1) {
                // Category nodes get different colors
                const categories = ["أسباب التلوث", "التأثيرات الصحية", "الحلول", "الدول الأكثر تلوثاً"];
                const colors = ["#ff8f00", "#e53935", "#43a047", "#5e35b1"];
                const index = categories.indexOf(d.data.name);
                return index >= 0 ? colors[index] : "#2196f3";
            }
            // Leaf nodes for countries colored by pollution level
            if (d.parent && d.parent.data.name === "الدول الأكثر تلوثاً") {
                return d.data.value < 30 ? "#4caf50" : 
                       d.data.value < 50 ? "#ffb300" : "#e53935";
            }
            return "#64b5f6"; // Default color for other leaf nodes
        })
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .attr("class", "mindmap-circle");
    
    // Add text labels
    node.append("text")
        .attr("dy", ".35em")
        .attr("x", d => d.children ? -25 : 20)
        .attr("text-anchor", d => d.children ? "end" : "start")
        .text(d => d.data.name)
        .style("font-size", d => d.depth === 0 ? "16px" : d.depth === 1 ? "14px" : "12px")
        .style("fill", "#333")
        .style("pointer-events", "none")
        .style("font-family", "'Cairo', sans-serif")
        .attr("class", "mindmap-text");
    
    // Add hover effects and interaction
    node.on("mouseover", function() {
            d3.select(this).select("circle")
                .transition()
                .duration(300)
                .attr("r", function(d) {
                    const currentSize = d.depth === 0 ? 30 : d.depth === 1 ? 20 : 
                                        (d.data.value ? Math.max(10, Math.min(15, d.data.value / 10)) : 10);
                    return currentSize * 1.2;
                });
            
            d3.select(this).select("text")
                .transition()
                .duration(300)
                .style("font-weight", "bold");
        })
        .on("mouseout", function() {
            d3.select(this).select("circle")
                .transition()
                .duration(300)
                .attr("r", function(d) {
                    return d.depth === 0 ? 30 : d.depth === 1 ? 20 : 
                           (d.data.value ? Math.max(10, Math.min(15, d.data.value / 10)) : 10);
                });
                
            d3.select(this).select("text")
                .transition()
                .duration(300)
                .style("font-weight", "normal");
        })
        .on("click", function(event, d) {
            // If it's a country node, highlight it on the map
            if (d.parent && d.parent.data.name === "الدول الأكثر تلوثاً") {
                window.mapModule.focusCountry(d.data.name);
            }
            
            // Pulse animation on click
            d3.select(this).select("circle")
                .transition()
                .duration(200)
                .attr("r", function(d) {
                    const currentSize = d.depth === 0 ? 30 : d.depth === 1 ? 20 : 
                                       (d.data.value ? Math.max(10, Math.min(15, d.data.value / 10)) : 10);
                    return currentSize * 1.5;
                })
                .transition()
                .duration(200)
                .attr("r", function(d) {
                    return d.depth === 0 ? 30 : d.depth === 1 ? 20 : 
                           (d.data.value ? Math.max(10, Math.min(15, d.data.value / 10)) : 10);
                });
        });
    
    // Update positions on each tick
    simulation.nodes(root.descendants());
    simulation.force("link").links(root.links());
    
    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
        
        node.attr("transform", d => `translate(${d.x},${d.y})`);
    });
    
    // Setup controls
    setupMindMapControls();
    
    // Initial animation
    animateMindMap();
}

// Animate mind map entrance
function animateMindMap() {
    // Hide all elements initially
    link.style("opacity", 0);
    node.style("opacity", 0);
    
    // Animate links first
    link.transition()
        .delay((d, i) => i * 20)
        .duration(500)
        .style("opacity", 0.6);
    
    // Then animate nodes
    node.transition()
        .delay((d, i) => 500 + i * 50)
        .duration(500)
        .style("opacity", 1);
}

// Setup mind map zoom controls
function setupMindMapControls() {
    document.getElementById("zoom-in").addEventListener("click", () => {
        mindmapSvg.transition().duration(500).call(
            zoomBehavior.scaleBy, 1.3
        );
    });
    
    document.getElementById("zoom-out").addEventListener("click", () => {
        mindmapSvg.transition().duration(500).call(
            zoomBehavior.scaleBy, 0.7
        );
    });
    
    document.getElementById("reset-zoom").addEventListener("click", () => {
        mindmapSvg.transition().duration(500).call(
            zoomBehavior.transform, d3.zoomIdentity
        );
    });
}

// D3 drag functions
function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

// Highlight specific nodes by category
function highlightCategory(category) {
    node.select("circle")
        .transition()
        .duration(300)
        .style("opacity", d => {
            if (d.depth === 0) return 1; // Always show central node
            if (d.depth === 1) return d.data.name === category ? 1 : 0.3;
            return d.parent && d.parent.data.name === category ? 1 : 0.3;
        });
    
    link.transition()
        .duration(300)
        .style("opacity", d => {
            const isHighlighted = 
                (d.source.depth === 0 && d.target.data.name === category) ||
                (d.source.data.name === category);
            return isHighlighted ? 0.8 : 0.1;
        });
}

// Reset highlights
function resetHighlights() {
    node.select("circle")
        .transition()
        .duration(300)
        .style("opacity", 1);
    
    link.transition()
        .duration(300)
        .style("opacity", 0.6);
}

// Export functions for use in other modules
window.mindmapModule = {
    initMindMap,
    highlightCategory,
    resetHighlights
};