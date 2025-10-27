// ===== CHARTS FUNCTIONALITY =====

let chartInstances = {};

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
});

function initializeCharts() {
    // Dashboard charts
    if (document.getElementById('sleepChart')) {
        createDashboardSleepChart();
    }
    
    // Sleep tracker charts
    if (document.getElementById('sleepPatternChart')) {
        createSleepPatternChart();
    }
    
    if (document.getElementById('qualityChart')) {
        createQualityChart();
    }
    
    // Premium preview chart
    if (document.getElementById('previewChart')) {
        createPreviewChart();
    }
}

function createDashboardSleepChart() {
    const ctx = document.getElementById('sleepChart');
    if (!ctx) return;
    
    const sleepData = getSleepDataForChart(7); // Last 7 days
    
    chartInstances.sleepChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sleepData.labels,
            datasets: [{
                label: 'Durasi Tidur',
                data: sleepData.durations,
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#4f46e5',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }, {
                label: 'Target (8 jam)',
                data: new Array(sleepData.labels.length).fill(8),
                borderColor: '#10b981',
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderDash: [5, 5],
                pointRadius: 0,
                pointHoverRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#4f46e5',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)} jam`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#6b7280'
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 12,
                    grid: {
                        color: 'rgba(107, 114, 128, 0.1)'
                    },
                    ticks: {
                        color: '#6b7280',
                        callback: function(value) {
                            return value + ' jam';
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

function createSleepPatternChart() {
    const ctx = document.getElementById('sleepPatternChart');
    if (!ctx) return;
    
    const period = document.querySelector('input[name="chartPeriod"]:checked')?.id || 'week';
    const days = period === 'week' ? 7 : 30;
    const sleepData = getSleepDataForChart(days);
    
    chartInstances.sleepPatternChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sleepData.labels,
            datasets: [{
                label: 'Durasi Tidur',
                data: sleepData.durations,
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }, {
                label: 'Kualitas Tidur',
                data: sleepData.qualityScores,
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                    max: 12,
                    ticks: {
                        callback: function(value) {
                            return value + ' jam';
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    min: 0,
                    max: 10,
                    grid: {
                        drawOnChartArea: false,
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '/10';
                        }
                    }
                }
            }
        }
    });
}

function createQualityChart() {
    const ctx = document.getElementById('qualityChart');
    if (!ctx) return;
    
    const qualityData = getQualityDistribution();
    
    chartInstances.qualityChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Baik', 'Biasa', 'Buruk'],
            datasets: [{
                data: [qualityData.baik, qualityData.biasa, qualityData.buruk],
                backgroundColor: [
                    '#10b981',
                    '#f59e0b', 
                    '#ef4444'
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed}%`;
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

function createPreviewChart() {
    const ctx = document.getElementById('previewChart');
    if (!ctx) return;
    
    // Sample data for preview
    const sampleData = {
        labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
        data: [7.2, 6.8, 7.5, 8.1, 7.0, 8.5, 7.8]
    };
    
    chartInstances.previewChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sampleData.labels,
            datasets: [{
                label: 'Kualitas Tidur',
                data: sampleData.data,
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 10
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 10,
                    grid: {
                        color: 'rgba(107, 114, 128, 0.1)'
                    },
                    ticks: {
                        font: {
                            size: 10
                        }
                    }
                }
            }
        }
    });
}

function getSleepDataForChart(days) {
    const sleepData = JSON.parse(localStorage.getItem('sleepsync_sleep_data') || '[]');
    const recentData = sleepData.slice(-days);
    
    if (recentData.length === 0) {
        // Generate sample data if no real data exists
        return generateSampleChartData(days);
    }
    
    return {
        labels: recentData.map(entry => {
            const date = new Date(entry.date);
            return date.toLocaleDateString('id-ID', { 
                weekday: 'short', 
                day: 'numeric',
                month: 'short'
            });
        }),
        durations: recentData.map(entry => 
            calculateSleepDuration(entry.bedTime, entry.wakeTime)
        ),
        qualityScores: recentData.map(entry => {
            const qualityMap = { 'buruk': 3, 'biasa': 6, 'baik': 9 };
            return qualityMap[entry.quality] || 6;
        })
    };
}

function generateSampleChartData(days) {
    const labels = [];
    const durations = [];
    const qualityScores = [];
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        labels.push(date.toLocaleDateString('id-ID', { 
            weekday: 'short', 
            day: 'numeric' 
        }));
        
        // Generate realistic sample data
        durations.push(6.5 + Math.random() * 2.5); // 6.5-9 hours
        qualityScores.push(5 + Math.random() * 4); // 5-9 quality score
    }
    
    return { labels, durations, qualityScores };
}

function getQualityDistribution() {
    const sleepData = JSON.parse(localStorage.getItem('sleepsync_sleep_data') || '[]');
    
    if (sleepData.length === 0) {
        return { baik: 60, biasa: 30, buruk: 10 };
    }
    
    const total = sleepData.length;
    const counts = sleepData.reduce((acc, entry) => {
        acc[entry.quality] = (acc[entry.quality] || 0) + 1;
        return acc;
    }, {});
    
    return {
        baik: Math.round((counts.baik || 0) / total * 100),
        biasa: Math.round((counts.biasa || 0) / total * 100),
        buruk: Math.round((counts.buruk || 0) / total * 100)
    };
}

function calculateSleepDuration(bedTime, wakeTime) {
    const [bedHour, bedMinute] = bedTime.split(':').map(Number);
    const [wakeHour, wakeMinute] = wakeTime.split(':').map(Number);
    
    let bedTimeMinutes = bedHour * 60 + bedMinute;
    let wakeTimeMinutes = wakeHour * 60 + wakeMinute;
    
    // Handle overnight sleep
    if (wakeTimeMinutes < bedTimeMinutes) {
        wakeTimeMinutes += 24 * 60;
    }
    
    const durationMinutes = wakeTimeMinutes - bedTimeMinutes;
    return durationMinutes / 60;
}

function updateChartPeriod() {
    if (chartInstances.sleepPatternChart) {
        const period = document.querySelector('input[name="chartPeriod"]:checked')?.id || 'week';
        const days = period === 'week' ? 7 : 30;
        const newData = getSleepDataForChart(days);
        
        chartInstances.sleepPatternChart.data.labels = newData.labels;
        chartInstances.sleepPatternChart.data.datasets[0].data = newData.durations;
        chartInstances.sleepPatternChart.data.datasets[1].data = newData.qualityScores;
        chartInstances.sleepPatternChart.update();
    }
}

function destroyChart(chartId) {
    if (chartInstances[chartId]) {
        chartInstances[chartId].destroy();
        delete chartInstances[chartId];
    }
}

function resizeCharts() {
    Object.values(chartInstances).forEach(chart => {
        if (chart && typeof chart.resize === 'function') {
            chart.resize();
        }
    });
}

// Handle window resize
window.addEventListener('resize', function() {
    setTimeout(resizeCharts, 100);
});

// Export functions
window.updateChartPeriod = updateChartPeriod;
window.destroyChart = destroyChart;
window.resizeCharts = resizeCharts;
window.chartInstances = chartInstances;
