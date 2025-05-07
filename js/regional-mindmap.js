// Regional Mind Map module for Air Quality Dashboard
let regionalMindmapSvg, regionalSimulation, regionalRoot, regionalLink, regionalNode;
let regionalCurrentZoom = { scale: 1, translate: [0, 0] };
let regionalZoomBehavior;

// Initialize the regional mind map
function initRegionalMindMap() {
    const width = document.getElementById('regional-mindmap').offsetWidth;
    const height = 600;
    
    // Create SVG container
    regionalMindmapSvg = d3.select("#regional-mindmap")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("class", "mindmap-svg");
    
    // Add zoom behavior
    regionalZoomBehavior = d3.zoom()
        .scaleExtent([0.5, 3])
        .on("zoom", (event) => {
            const container = d3.select(".regional-mindmap-container");
            container.attr("transform", event.transform);
            regionalCurrentZoom.scale = event.transform.k;
            regionalCurrentZoom.translate = [event.transform.x, event.transform.y];
        });
    
    regionalMindmapSvg.call(regionalZoomBehavior);
    
    // Create a container group for all elements
    const container = regionalMindmapSvg.append("g")
        .attr("class", "regional-mindmap-container");
    
    // Create hierarchical data structure
    regionalRoot = d3.hierarchy(regionalMindMapData);
    
    // Create force simulation
    regionalSimulation = d3.forceSimulation(regionalRoot.descendants())
        .force("link", d3.forceLink(regionalRoot.links()).id(d => d.id).distance(120).strength(1))
        .force("charge", d3.forceManyBody().strength(-1000))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX(width / 2).strength(0.1))
        .force("y", d3.forceY(height / 2).strength(0.1))
        .alphaTarget(0);
    
    // Create links
    regionalLink = container.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(regionalRoot.links())
        .enter().append("line")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 2)
        .attr("class", "mindmap-link");
    
    // Create nodes
    regionalNode = container.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(regionalRoot.descendants())
        .enter().append("g")
        .attr("class", "mindmap-node")
        .call(d3.drag()
            .on("start", regionalDragstarted)
            .on("drag", regionalDragged)
            .on("end", regionalDragended));
    
    // Add circles to nodes with varying sizes and colors based on depth
    regionalNode.append("circle")
        .attr("r", d => {
            if (d.depth === 0) return 35;
            if (d.depth === 1) return 25;
            return d.data.value ? Math.max(12, Math.min(18, d.data.value / 8)) : 12;
        })
        .attr("fill", d => {
            if (d.depth === 0) return "#1e88e5";
            if (d.depth === 1) {
                const regions = ["الشرق الأوسط وشمال أفريقيا", "آسيا", "أوروبا", "الأمريكتان", "أفريقيا", "أوقيانوسيا"];
                const colors = ["#ff8f00", "#e53935", "#43a047", "#5e35b1", "#0097a7", "#8e24aa"];
                const index = regions.indexOf(d.data.name);
                return index >= 0 ? colors[index] : "#2196f3";
            }
            return "#64b5f6";
        })
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .attr("class", "mindmap-circle");
    
    // Add text labels
    regionalNode.append("text")
        .attr("dy", ".35em")
        .attr("x", d => d.children ? -30 : 25)
        .attr("text-anchor", d => d.children ? "end" : "start")
        .text(d => d.data.name)
        .style("font-size", d => d.depth === 0 ? "18px" : d.depth === 1 ? "16px" : "14px")
        .style("fill", "#333")
        .style("pointer-events", "none")
        .style("font-family", "'Cairo', sans-serif")
        .attr("class", "mindmap-text");
    
    // Add hover effects and interaction
    regionalNode.on("mouseover", function() {
            d3.select(this).select("circle")
                .transition()
                .duration(300)
                .attr("r", function(d) {
                    const currentSize = d.depth === 0 ? 35 : d.depth === 1 ? 25 : 
                                        (d.data.value ? Math.max(12, Math.min(18, d.data.value / 8)) : 12);
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
                    return d.depth === 0 ? 35 : d.depth === 1 ? 25 : 
                           (d.data.value ? Math.max(12, Math.min(18, d.data.value / 8)) : 12);
                });
                
            d3.select(this).select("text")
                .transition()
                .duration(300)
                .style("font-weight", "normal");
        })
        .on("click", function(event, d) {
            // Pulse animation on click
            d3.select(this).select("circle")
                .transition()
                .duration(200)
                .attr("r", function(d) {
                    const currentSize = d.depth === 0 ? 35 : d.depth === 1 ? 25 : 
                                       (d.data.value ? Math.max(12, Math.min(18, d.data.value / 8)) : 12);
                    return currentSize * 1.5;
                })
                .transition()
                .duration(200)
                .attr("r", function(d) {
                    return d.depth === 0 ? 35 : d.depth === 1 ? 25 : 
                           (d.data.value ? Math.max(12, Math.min(18, d.data.value / 8)) : 12);
                });
        });
    
    // Update positions on each tick
    regionalSimulation.nodes(regionalRoot.descendants());
    regionalSimulation.force("link").links(regionalRoot.links());
    
    regionalSimulation.on("tick", () => {
        regionalLink
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
        
        regionalNode.attr("transform", d => `translate(${d.x},${d.y})`);
    });
    
    // Setup controls
    setupRegionalMindMapControls();
    
    // Initial animation
    animateRegionalMindMap();
}

// Animate regional mind map entrance
function animateRegionalMindMap() {
    // Hide all elements initially
    regionalLink.style("opacity", 0);
    regionalNode.style("opacity", 0);
    
    // Animate links first
    regionalLink.transition()
        .delay((d, i) => i * 20)
        .duration(500)
        .style("opacity", 0.6);
    
    // Then animate nodes
    regionalNode.transition()
        .delay((d, i) => 500 + i * 50)
        .duration(500)
        .style("opacity", 1);
}

// Setup regional mind map zoom controls
function setupRegionalMindMapControls() {
    document.getElementById("regional-zoom-in").addEventListener("click", () => {
        regionalMindmapSvg.transition().duration(500).call(
            regionalZoomBehavior.scaleBy, 1.3
        );
    });
    
    document.getElementById("regional-zoom-out").addEventListener("click", () => {
        regionalMindmapSvg.transition().duration(500).call(
            regionalZoomBehavior.scaleBy, 0.7
        );
    });
    
    document.getElementById("regional-reset-zoom").addEventListener("click", () => {
        regionalMindmapSvg.transition().duration(500).call(
            regionalZoomBehavior.transform, d3.zoomIdentity
        );
    });
}

// D3 drag functions for regional mind map
function regionalDragstarted(event, d) {
    if (!event.active) regionalSimulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function regionalDragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function regionalDragended(event, d) {
    if (!event.active) regionalSimulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

// Export functions for use in other modules
window.regionalMindmapModule = {
    initRegionalMindMap
}; 