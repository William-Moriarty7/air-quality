// Map module for the Air Quality Dashboard
let map;
let markers = [];
let selectedCountry = null;

// Initialize the map
function initMap() {
    // Create map centered on the Arab world
    map = L.map("map").setView([24, 45], 4);

    // Add OpenStreetMap tiles with custom styling
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Add markers for each country
    createMarkers();
    
    // Setup filter change event
    document.getElementById("pollution-filter").addEventListener("change", filterMarkers);
}

// Create markers for each country
function createMarkers() {
    markers = [];
    
    pollutionData.forEach(function (country) {
        // Determine marker color based on PM2.5 value
        const color = country.pm25 < 10 ? "#4caf50" : country.pm25 < 35 ? "#ffb300" : "#e53935";
        
        // Calculate marker size based on pollution level (more pollution = larger marker)
        const radius = Math.max(8, Math.min(15, country.pm25 / 8));
        
        const marker = L.circleMarker(country.coords, {
            radius: radius,
            fillColor: color,
            color: "#333",
            weight: 1,
            opacity: 0.8,
            fillOpacity: 0.8,
            className: `marker-${getFilterLevel(country.pm25)}`
        }).addTo(map);

        // Add pulse animation to marker
        marker.getElement().classList.add('pulse-marker');

        // Add custom click event for detailed view
        marker.on('click', function() {
            showCountryDetails(country);
            selectedCountry = country;
            
            // Highlight the selected marker
            markers.forEach(item => {
                if (item.country === country) {
                    item.marker.setStyle({
                        weight: 3,
                        color: "#000",
                        fillOpacity: 1,
                        opacity: 1
                    });
                } else {
                    item.marker.setStyle({
                        weight: 1,
                        color: "#333",
                        fillOpacity: 0.8,
                        opacity: 0.8
                    });
                }
            });
        });

        // Show basic info on hover
        marker.bindPopup(
            `<div class="popup-content">
                <h4>${country.name}</h4>
                <p>PM2.5: <strong>${country.pm25} μg/m³</strong></p>
                <p>اضغط للمزيد من التفاصيل</p>
            </div>`
        );
        
        // Make popup interactive
        marker.on('mouseover', function() {
            this.openPopup();
            this.getElement().classList.add('hover');
        });
        
        marker.on('mouseout', function() {
            this.closePopup();
            this.getElement().classList.remove('hover');
        });
        
        // Add marker to our array for filtering
        markers.push({
            marker: marker,
            level: getFilterLevel(country.pm25),
            country: country
        });
    });
}

// Filter markers based on pollution level
function filterMarkers() {
    const filterValue = document.getElementById("pollution-filter").value;
    
    markers.forEach(item => {
        if (filterValue === "all" || item.level === filterValue) {
            if (!map.hasLayer(item.marker)) {
                map.addLayer(item.marker);
                
                // Add animation when marker appears
                setTimeout(() => {
                    item.marker.getElement().classList.add('marker-appear');
                    setTimeout(() => {
                        item.marker.getElement().classList.remove('marker-appear');
                    }, 500);
                }, 10);
            }
        } else {
            if (map.hasLayer(item.marker)) {
                // Add fade out animation
                item.marker.getElement().classList.add('marker-fade-out');
                setTimeout(() => {
                    map.removeLayer(item.marker);
                }, 300);
            }
        }
    });
}

// Show country details in panel
function showCountryDetails(country) {
    const detailsPanel = document.getElementById("country-details");
    const nameEl = document.getElementById("detail-name");
    const pm25El = document.getElementById("detail-pm25");
    const riskEl = document.getElementById("detail-risk");
    const descEl = document.getElementById("detail-desc");
    const healthEl = document.getElementById("health-effects");
    
    // Get risk level info
    const risk = getRiskLevel(country.pm25);
    
    // Update details
    nameEl.textContent = country.name;
    pm25El.textContent = `${country.pm25} μg/m³`;
    riskEl.textContent = risk.level;
    riskEl.className = `stat-value text-${risk.class}`;
    descEl.textContent = country.desc;
    
    // Clear and update health effects
    healthEl.innerHTML = "";
    let effectsList;
    
    if (country.pm25 < 10) {
        effectsList = healthEffects.low;
    } else if (country.pm25 < 50) {
        effectsList = healthEffects.medium;
    } else {
        effectsList = healthEffects.high;
    }
    
    effectsList.forEach(effect => {
        const li = document.createElement("li");
        li.textContent = effect;
        healthEl.appendChild(li);
    });
    
    // Animate panel
    detailsPanel.classList.remove("hidden");
    
    // Return to this country on map resets
    selectedCountry = country;
}

// Reset map view
function resetMapView() {
    map.setView([24, 45], 4);
}

// Focus on specific country
function focusCountry(countryName) {
    const country = pollutionData.find(c => c.name === countryName);
    if (country) {
        map.setView(country.coords, 7);
        
        // Find and click the marker
        const markerItem = markers.find(m => m.country.name === countryName);
        if (markerItem) {
            markerItem.marker.fire('click');
        }
    }
}

// Export functions for use in other modules
window.mapModule = {
    initMap,
    filterMarkers,
    resetMapView,
    focusCountry
};