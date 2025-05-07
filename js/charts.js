// Charts module for the Air Quality Dashboard
let pollutionChart, categoryChart, top5Chart;
let chartAnimationsComplete = false;

// Initialize all charts
function initCharts() {
    // Create sorted data for charts
    const sortedData = [...pollutionData].sort((a, b) => b.pm25 - a.pm25);
    const top5Data = sortedData.slice(0, 5);
    
    // Calculate average pollution and update stats
    updateStatistics();
    
    // Initialize all charts with animation
    createMainBarChart();
    createCategoryChart();
    createTop5Chart(top5Data);
    
    // Mark animations as complete after all charts are initialized
    setTimeout(() => {
        chartAnimationsComplete = true;
    }, 2000);
}

// Update statistical information
function updateStatistics() {
    const avgPollution = calculateAvgPollution();
    document.getElementById("avg-pollution").textContent = avgPollution.toFixed(1) + " μg/m³";
    
    // Calculate percentage above global average (15 μg/m³)
    const pctAbove = ((avgPollution / 15) * 100) - 100;
    document.getElementById("pct-above").textContent = "+" + pctAbove.toFixed(0) + "%";
}

// Create main bar chart showing all countries
function createMainBarChart() {
    const ctx = document.getElementById('pollution-chart').getContext('2d');
    
    // Sort countries by PM2.5 levels for better visualization
    const sortedData = [...pollutionData].sort((a, b) => b.pm25 - a.pm25);
    
    pollutionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedData.map(country => country.name),
            datasets: [{
                label: 'مستوى PM2.5 (μg/m³)',
                data: sortedData.map(country => country.pm25),
                backgroundColor: sortedData.map(country => {
                    if (country.pm25 < 10) return '#4caf50';
                    else if (country.pm25 < 35) return '#ffb300';
                    else return '#e53935';
                }),
                borderColor: '#333',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            family: "'Cairo', sans-serif",
                            size: 14
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const country = sortedData[context.dataIndex];
                            return country.desc;
                        }
                    },
                    titleFont: {
                        family: "'Cairo', sans-serif",
                        size: 14
                    },
                    bodyFont: {
                        family: "'Cairo', sans-serif",
                        size: 13
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'PM2.5 (μg/m³)',
                        font: {
                            family: "'Cairo', sans-serif",
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        font: {
                            family: "'Cairo', sans-serif"
                        }
                    }
                },
                y: {
                    ticks: {
                        font: {
                            family: "'Cairo', sans-serif"
                        }
                    }
                }
            },
            onClick: (e, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const countryName = sortedData[index].name;
                    window.mapModule.focusCountry(countryName);
                }
            }
        }
    });
}

// Create category distribution chart (pie chart)
function createCategoryChart() {
    const categoryData = getCountriesByLevel();
    
    const ctx = document.getElementById('category-chart').getContext('2d');
    categoryChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['منخفض (أقل من 30)', 'متوسط (30-50)', 'مرتفع (أكثر من 50)'],
            datasets: [{
                data: [categoryData.low, categoryData.medium, categoryData.high],
                backgroundColor: ['#4caf50', '#ffb300', '#e53935'],
                borderWidth: 1,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 2000
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            family: "'Cairo', sans-serif",
                            size: 14
                        },
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    },
                    titleFont: {
                        family: "'Cairo', sans-serif"
                    },
                    bodyFont: {
                        family: "'Cairo', sans-serif"
                    }
                }
            }
        }
    });
}

// Create top 5 most polluted countries chart
function createTop5Chart(top5Data) {
    const ctx = document.getElementById('top5-chart').getContext('2d');
    top5Chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: top5Data.map(country => country.name),
            datasets: [{
                label: 'PM2.5 (μg/m³)',
                data: top5Data.map(country => country.pm25),
                backgroundColor: '#e53935',
                borderColor: '#333',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            animation: {
                delay: function(context) {
                    return context.dataIndex * 300;
                },
                duration: 1000,
                easing: 'easeOutBounce'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    titleFont: {
                        family: "'Cairo', sans-serif"
                    },
                    bodyFont: {
                        family: "'Cairo', sans-serif"
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            family: "'Cairo', sans-serif"
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            family: "'Cairo', sans-serif"
                        }
                    }
                }
            },
            onClick: (e, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const countryName = top5Data[index].name;
                    window.mapModule.focusCountry(countryName);
                }
            }
        }
    });
}

// Update charts with new data or animations
function updateCharts() {
    if (chartAnimationsComplete) {
        // Re-animate the charts for visual interest
        animateCharts();
    }
}

// Animate charts (for refresh or interaction)
function animateCharts() {
    if (pollutionChart) {
        // Animate the bar chart as if data is being re-calculated
        pollutionChart.data.datasets[0].data = pollutionChart.data.datasets[0].data.map(v => 0);
        pollutionChart.update('none');
        
        setTimeout(() => {
            const sortedData = [...pollutionData].sort((a, b) => b.pm25 - a.pm25);
            pollutionChart.data.datasets[0].data = sortedData.map(country => country.pm25);
            pollutionChart.update({
                duration: 1000,
                easing: 'easeOutQuart'
            });
        }, 300);
    }
    
    if (categoryChart) {
        // Animate the pie chart rotation
        categoryChart.options.animation = {
            animateRotate: true,
            animateScale: true,
            duration: 1000
        };
        categoryChart.update();
    }
    
    if (top5Chart) {
        // Animate the top 5 chart with bounce effect
        top5Chart.data.datasets[0].data = top5Chart.data.datasets[0].data.map(v => 0);
        top5Chart.update('none');
        
        setTimeout(() => {
            const top5Data = getTopPollutedCountries();
            top5Chart.data.datasets[0].data = top5Data.map(country => country.pm25);
            top5Chart.update({
                duration: 1000,
                easing: 'easeOutBounce'
            });
        }, 300);
    }
}

// Export functions for use in other modules
window.chartsModule = {
    initCharts,
    updateCharts,
    animateCharts
};