// Tambahkan di awal file sleep-tracker.js
console.log('📊 Sleep tracker script loaded');

// Modifikasi initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('📊 Sleep tracker DOM loaded');
    console.log('📄 Current page:', window.location.pathname);
    
    if (window.location.pathname.includes('sleep-tracker.html')) {
        console.log('🎯 Sleep tracker page detected');
        
        // Tunggu auth selesai dulu
        setTimeout(() => {
            console.log('🚀 Initializing sleep tracker...');
            initializeSleepTracker();
        }, 300);
    }
});

// Tambahkan di function initializeSleepTracker()
function initializeSleepTracker() {
    console.log('📊 Sleep tracker initialization started');
    
    loadSleepTrackerData();
    setupSleepTrackerEventListeners();
    updateSleepTrackerUI();
    initializeSleepCharts();
    
    console.log('✅ Sleep tracker initialization complete');
}

// ===== SLEEP TRACKER FUNCTIONALITY =====
console.log('Sleep tracker script loaded');
let sleepTrackerData = [];
let sleepChart = null;
let qualityChart = null;

// Initialize sleep tracker
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('sleep-tracker.html')) {
        initializeSleepTracker();
    }
});

function initializeSleepTracker() {
    loadSleepTrackerData();
    setupSleepTrackerEventListeners();
    updateSleepTrackerUI();
    initializeSleepCharts();
}

function loadSleepTrackerData() {
    const savedData = localStorage.getItem('sleepsync_sleep_data');
    if (savedData) {
        sleepTrackerData = JSON.parse(savedData);
    } else {
        sleepTrackerData = generateSampleSleepData();
        saveSleepTrackerData();
    }
}

function saveSleepTrackerData() {
    localStorage.setItem('sleepsync_sleep_data', JSON.stringify(sleepTrackerData));
}

function setupSleepTrackerEventListeners() {
    // Sleep form submission
    const sleepForm = document.getElementById('sleepForm');
    if (sleepForm) {
        sleepForm.addEventListener('submit', handleSleepFormSubmission);
    }

    // Chart period buttons
    const periodButtons = document.querySelectorAll('input[name="chartPeriod"]');
    periodButtons.forEach(button => {
        button.addEventListener('change', updateChartPeriod);
    });

    // Quick sleep input buttons
    setupQuickSleepButtons();
}

function handleSleepFormSubmission(e) {
    e.preventDefault();
    
    const formData = {
        date: document.getElementById('sleepDate').value,
        bedTime: document.getElementById('bedTime').value,
        wakeTime: document.getElementById('wakeTime').value,
        quality: document.getElementById('sleepQualityInput').value,
        notes: document.getElementById('sleepNotes').value,
        factors: getSelectedSleepFactors()
    };

    // Validate required fields
    if (!formData.date || !formData.bedTime || !formData.wakeTime || !formData.quality) {
        showNotification('Mohon lengkapi semua field yang wajib diisi', 'danger');
        return;
    }

    // Check for duplicate date
    const existingEntry = sleepTrackerData.find(entry => entry.date === formData.date);
    if (existingEntry) {
        if (confirm('Data untuk tanggal ini sudah ada. Apakah ingin mengganti?')) {
            updateSleepEntry(existingEntry.id, formData);
        }
        return;
    }

    // Add new entry
    const newEntry = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString()
    };

    sleepTrackerData.push(newEntry);
    saveSleepTrackerData();

    // Reset form and close modal
    document.getElementById('sleepForm').reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById('addSleepModal'));
    if (modal) modal.hide();

    // Update UI
    updateSleepTrackerUI();
    showNotification('Data tidur berhasil disimpan!', 'success');
}

function getSelectedSleepFactors() {
    const factors = [];
    const checkboxes = document.querySelectorAll('#addSleepModal input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        factors.push(checkbox.id);
    });
    return factors;
}

function updateSleepEntry(id, newData) {
    const index = sleepTrackerData.findIndex(entry => entry.id === id);
    if (index !== -1) {
        sleepTrackerData[index] = { ...sleepTrackerData[index], ...newData };
        saveSleepTrackerData();
        updateSleepTrackerUI();
        showNotification('Data tidur berhasil diperbarui!', 'success');
    }
}

function deleteSleepEntry(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        sleepTrackerData = sleepTrackerData.filter(entry => entry.id !== id);
        saveSleepTrackerData();
        updateSleepTrackerUI();
        showNotification('Data tidur berhasil dihapus!', 'success');
    }
}

function updateSleepTrackerUI() {
    updateSleepStats();
    updateSleepLogTable();
    updateSleepCharts();
}

function updateSleepStats() {
    if (sleepTrackerData.length === 0) return;

    // Last night sleep
    const lastEntry = sleepTrackerData[sleepTrackerData.length - 1];
    const lastNightDuration = calculateSleepDuration(lastEntry.bedTime, lastEntry.wakeTime);
    updateElement('lastNightSleep', `${lastNightDuration.toFixed(1)} jam`);

    // Weekly average
    const recentEntries = sleepTrackerData.slice(-7);
    const weeklyAvg = recentEntries.reduce((sum, entry) => {
        return sum + calculateSleepDuration(entry.bedTime, entry.wakeTime);
    }, 0) / recentEntries.length;
    updateElement('weeklyAverage', `${weeklyAvg.toFixed(1)} jam`);

    // Sleep quality
    const qualityMap = { 'buruk': 'Buruk', 'biasa': 'Biasa', 'baik': 'Baik' };
    updateElement('sleepQuality', qualityMap[lastEntry.quality] || 'Baik');

    // Consistency
    const consistency = calculateSleepConsistency();
    updateElement('consistency', `${consistency}%`);
}

function calculateSleepConsistency() {
    if (sleepTrackerData.length < 2) return 100;

    const recentEntries = sleepTrackerData.slice(-7);
    const bedTimes = recentEntries.map(entry => {
        const [hour, minute] = entry.bedTime.split(':').map(Number);
        return hour * 60 + minute;
    });

    const avgBedTime = bedTimes.reduce((sum, time) => sum + time, 0) / bedTimes.length;
    const variance = bedTimes.reduce((sum, time) => sum + Math.pow(time - avgBedTime, 2), 0) / bedTimes.length;
    const standardDeviation = Math.sqrt(variance);

    // Convert to percentage (lower deviation = higher consistency)
    const consistency = Math.max(0, 100 - (standardDeviation / 60) * 100);
    return Math.round(consistency);
}

function updateSleepLogTable() {
    const tableBody = document.getElementById('sleepLogBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    // Sort by date (newest first)
    const sortedData = [...sleepTrackerData].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedData.forEach(entry => {
        const row = createSleepLogRow(entry);
        tableBody.appendChild(row);
    });
}

function createSleepLogRow(entry) {
    const row = document.createElement('tr');
    const duration = calculateSleepDuration(entry.bedTime, entry.wakeTime);
    const qualityBadge = getQualityBadge(entry.quality);

    row.innerHTML = `
        <td>${formatDate(entry.date)}</td>
        <td>${formatTime(entry.bedTime)}</td>
        <td>${formatTime(entry.wakeTime)}</td>
        <td>${duration.toFixed(1)} jam</td>
        <td>${qualityBadge}</td>
        <td>
            <span class="text-muted small">${entry.notes || '-'}</span>
            ${entry.factors.length > 0 ? `<br><small class="text-info">${formatFactors(entry.factors)}</small>` : ''}
        </td>
        <td>
            <button class="btn btn-sm btn-outline-primary me-1" onclick="editSleepEntry(${entry.id})">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteSleepEntry(${entry.id})">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;

    return row;
}

function getQualityBadge(quality) {
    const badges = {
        'buruk': '<span class="badge bg-danger">Buruk</span>',
        'biasa': '<span class="badge bg-warning">Biasa</span>',
        'baik': '<span class="badge bg-success">Baik</span>'
    };
    return badges[quality] || badges['baik'];
}

function formatFactors(factors) {
    const factorNames = {
        'caffeine': 'Kafein',
        'exercise': 'Olahraga',
        'stress': 'Stress',
        'screenTime': 'Screen Time',
        'lateEating': 'Makan Malam',
        'nap': 'Tidur Siang'
    };

    return factors.map(factor => factorNames[factor] || factor).join(', ');
}

function initializeSleepCharts() {
    createSleepPatternChart();
    createQualityDistributionChart();
}

function createSleepPatternChart() {
    const ctx = document.getElementById('sleepPatternChart');
    if (!ctx) return;

    const chartData = prepareSleepChartData();

    sleepChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Durasi Tidur (jam)',
                data: chartData.durations,
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
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
                y: {
                    beginAtZero: true,
                    max: 12,
                    ticks: {
                        callback: function(value) {
                            return value + ' jam';
                        }
                    }
                }
            }
        }
    });
}

function createQualityDistributionChart() {
    const ctx = document.getElementById('qualityChart');
    if (!ctx) return;

    const qualityData = calculateQualityDistribution();

    qualityChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Baik', 'Biasa', 'Buruk'],
            datasets: [{
                data: [qualityData.baik, qualityData.biasa, qualityData.buruk],
                backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Initialize charts when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize quality distribution chart
    const qualityCtx = document.getElementById('qualityChart').getContext('2d');
    const qualityChart = new Chart(qualityCtx, {
        type: 'doughnut',
        data: {
            labels: ['Baik', 'Biasa', 'Buruk'],
            datasets: [{
                data: [60, 30, 10],
                backgroundColor: [
                    '#aeddf1', // light-blue
                    '#ffdede', // soft-pink
                    '#b4cce0'  // muted-blue
                ],
                borderColor: '#f8f2e7', // cream
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            cutout: '70%'
        }
    });

    // Initialize sleep pattern chart
    const patternCtx = document.getElementById('sleepPatternChart').getContext('2d');
    const sleepPatternChart = new Chart(patternCtx, {
        type: 'line',
        data: {
            labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
            datasets: [{
                label: 'Durasi Tidur (jam)',
                data: [7.5, 6.8, 7.2, 8.0, 7.4, 7.8, 7.5],
                backgroundColor: 'rgba(174, 221, 241, 0.2)', // light-blue with opacity
                borderColor: '#aeddf1', // light-blue
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
                        color: '#b4cce0' // muted-blue
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
                        color: '#b4cce0' // muted-blue
                    },
                    grid: {
                        color: 'rgba(180, 204, 224, 0.1)' // muted-blue with opacity
                    }
                },
                x: {
                    ticks: {
                        color: '#b4cce0' // muted-blue
                    },
                    grid: {
                        color: 'rgba(180, 204, 224, 0.1)' // muted-blue with opacity
                    }
                }
            }
        }
    });

    // Handle chart period changes
    document.getElementById('week').addEventListener('change', function() {
        updateChartPeriod('week');
    });
    
    document.getElementById('month').addEventListener('change', function() {
        updateChartPeriod('month');
    });
});

// Function to update chart period
function updateChartPeriod(period) {
    // Add logic to fetch and update data based on selected period
    // This is where you would typically fetch data from localStorage
    // and update the chart accordingly
}

function prepareSleepChartData() {
    const period = document.querySelector('input[name="chartPeriod"]:checked')?.id || 'week';
    const days = period === 'week' ? 7 : 30;
    
    const recentData = sleepTrackerData.slice(-days);
    
    return {
        labels: recentData.map(entry => {
            const date = new Date(entry.date);
            return date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });
        }),
        durations: recentData.map(entry => 
            calculateSleepDuration(entry.bedTime, entry.wakeTime)
        )
    };
}

function calculateQualityDistribution() {
    const total = sleepTrackerData.length;
    if (total === 0) return { baik: 0, biasa: 0, buruk: 0 };

    const counts = sleepTrackerData.reduce((acc, entry) => {
        acc[entry.quality] = (acc[entry.quality] || 0) + 1;
        return acc;
    }, {});

    return {
        baik: Math.round((counts.baik || 0) / total * 100),
        biasa: Math.round((counts.biasa || 0) / total * 100),
        buruk: Math.round((counts.buruk || 0) / total * 100)
    };
}

function updateChartPeriod() {
    if (sleepChart) {
        const newData = prepareSleepChartData();
        sleepChart.data.labels = newData.labels;
        sleepChart.data.datasets[0].data = newData.durations;
        sleepChart.update();
    }
}

function updateSleepCharts() {
    updateChartPeriod();
    
    if (qualityChart) {
        const qualityData = calculateQualityDistribution();
        qualityChart.data.datasets[0].data = [qualityData.baik, qualityData.biasa, qualityData.buruk];
        qualityChart.update();
    }
}

function setupQuickSleepButtons() {
    // Quick sleep input functionality
    window.quickSleepInput = function(quality) {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        // Set default times based on quality
        let bedTime, wakeTime;
        switch(quality) {
            case 'baik':
                bedTime = '22:30';
                wakeTime = '06:30';
                break;
            case 'biasa':
                bedTime = '23:30';
                wakeTime = '07:00';
                break;
            case 'buruk':
                bedTime = '01:00';
                wakeTime = '08:00';
                break;
        }

        const quickEntry = {
            id: Date.now(),
            date: today,
            bedTime: bedTime,
            wakeTime: wakeTime,
            quality: quality,
            notes: 'Input cepat',
            factors: [],
            createdAt: new Date().toISOString()
        };

        sleepTrackerData.push(quickEntry);
        saveSleepTrackerData();
        updateSleepTrackerUI();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('addSleepModal'));
        if (modal) modal.hide();
        
        showNotification('Data tidur berhasil ditambahkan!', 'success');
    };
}

function editSleepEntry(id) {
    const entry = sleepTrackerData.find(e => e.id === id);
    if (!entry) return;

    // Fill form with existing data
    document.getElementById('sleepDate').value = entry.date;
    document.getElementById('bedTime').value = entry.bedTime;
    document.getElementById('wakeTime').value = entry.wakeTime;
    document.getElementById('sleepQualityInput').value = entry.quality;
    document.getElementById('sleepNotes').value = entry.notes || '';

    // Set factors checkboxes
    const checkboxes = document.querySelectorAll('#addSleepModal input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = entry.factors.includes(checkbox.id);
    });

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('addSleepModal'));
    modal.show();

    // Change form handler to update instead of create
    const form = document.getElementById('sleepForm');
    form.onsubmit = function(e) {
        e.preventDefault();
        updateSleepEntry(id, {
            date: document.getElementById('sleepDate').value,
            bedTime: document.getElementById('bedTime').value,
            wakeTime: document.getElementById('wakeTime').value,
            quality: document.getElementById('sleepQualityInput').value,
            notes: document.getElementById('sleepNotes').value,
            factors: getSelectedSleepFactors()
        });
        
        // Reset form handler
        form.onsubmit = handleSleepFormSubmission;
        modal.hide();
    };
}

function exportSleepData() {
    if (sleepTrackerData.length === 0) {
        showNotification('Tidak ada data untuk diekspor', 'warning');
        return;
    }

    const csvContent = generateCSVContent();
    downloadCSV(csvContent, 'sleep-data.csv');
    showNotification('Data berhasil diekspor!', 'success');
}

function generateCSVContent() {
    const headers = ['Tanggal', 'Waktu Tidur', 'Waktu Bangun', 'Durasi (jam)', 'Kualitas', 'Catatan', 'Faktor'];
    const rows = sleepTrackerData.map(entry => [
        entry.date,
        entry.bedTime,
        entry.wakeTime,
        calculateSleepDuration(entry.bedTime, entry.wakeTime).toFixed(1),
        entry.quality,
        entry.notes || '',
        formatFactors(entry.factors)
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function updateElement(id, content) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = content;
    }
}

// Export functions
window.saveSleepData = function() {
    const modal = document.getElementById('addSleepModal');
    const form = document.getElementById('sleepForm');
    if (form) {
        form.dispatchEvent(new Event('submit'));
    }
};

window.quickSleepInput = function(quality) {
    // Function defined in setupQuickSleepButtons
};

window.editSleepEntry = editSleepEntry;
window.deleteSleepEntry = deleteSleepEntry;
window.exportSleepData = exportSleepData;
