// ===== DASHBOARD FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('dashboard.html')) {
        initializeDashboard();
    }
});

function initializeDashboard() {
    updateUserInfo();
    initializeSleepChart();
    updateDashboardStats();
}

function updateUserInfo() {
    try {
        const user = JSON.parse(localStorage.getItem('sleepsync_user') || sessionStorage.getItem('sleepsync_user') || '{}');
        if (user && user.name) {
            document.getElementById('userName').textContent = user.name;
            document.getElementById('welcomeUserName').textContent = user.name;
        }
    } catch (error) {
        console.error('Error updating user info:', error);
    }
}

function initializeSleepChart() {
    const ctx = document.getElementById('sleepChart');
    if (!ctx) return;
    
    // Get sleep data
    const sleepData = getSleepData();
    
    // Create chart
    const sleepChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sleepData.labels,
            datasets: [{
                label: 'Durasi Tidur (jam)',
                data: sleepData.durations,
                backgroundColor: 'rgba(174, 221, 241, 0.2)',
                borderColor: '#aeddf1',
                borderWidth: 2,
                tension: 0.4,
                fill: true
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
                        color: '#b4cce0'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 4,
                    max: 10,
                    ticks: {
                        stepSize: 2,
                        color: '#b4cce0'
                    },
                    grid: {
                        color: 'rgba(180, 204, 224, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#b4cce0'
                    },
                    grid: {
                        color: 'rgba(180, 204, 224, 0.1)'
                    }
                }
            }
        }
    });
}

function getSleepData() {
    // Try to get data from localStorage
    let sleepTrackerData = [];
    try {
        const savedData = localStorage.getItem('sleepsync_sleep_data');
        if (savedData) {
            sleepTrackerData = JSON.parse(savedData);
        }
    } catch (error) {
        console.error('Error loading sleep data:', error);
    }
    
    // If no data, use sample data
    if (!sleepTrackerData || sleepTrackerData.length === 0) {
        return getSampleSleepData();
    }
    
    // Process last 7 days data
    const last7Days = sleepTrackerData
        .slice(-7)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return {
        labels: last7Days.map(entry => {
            const date = new Date(entry.date);
            return date.toLocaleDateString('id-ID', { weekday: 'short' });
        }),
        durations: last7Days.map(entry => calculateSleepDuration(entry.bedTime, entry.wakeTime))
    };
}

function calculateSleepDuration(bedTime, wakeTime) {
    const [bedHour, bedMinute] = bedTime.split(':').map(Number);
    const [wakeHour, wakeMinute] = wakeTime.split(':').map(Number);
    
    let duration = (wakeHour - bedHour) * 60 + (wakeMinute - bedMinute);
    
    // Handle overnight sleep (e.g., 23:00 to 06:00)
    if (duration < 0) {
        duration += 24 * 60;
    }
    
    return +(duration / 60).toFixed(1); // Convert to hours with 1 decimal place
}

function getSampleSleepData() {
    return {
        labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
        durations: [7.5, 6.8, 7.2, 8.0, 7.4, 7.8, 7.5]
    };
}

function updateDashboardStats() {
    // This function would update dashboard statistics based on user data
    // For now, we'll use the sample data that's already in the HTML
}
