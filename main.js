// ===== MAIN JAVASCRIPT FILE =====

// Global Variables
let currentUser = null;
let sleepData = [];
let chartInstances = {};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuthStatus();
});

// Initialize Application
function initializeApp() {
    // Set current date for date inputs
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (!input.value) {
            input.value = today;
        }
    });

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Load saved data
    loadSavedData();
    
    // Update UI based on current page
    updatePageSpecificUI();
}

// Setup Event Listeners
function setupEventListeners() {
    // Navigation active state
    updateActiveNavigation();
    
    // Form submissions
    setupFormHandlers();
    
    // Button click handlers
    setupButtonHandlers();
    
    // Window resize handler
    window.addEventListener('resize', handleWindowResize);
    
    // Before unload handler
    window.addEventListener('beforeunload', saveDataBeforeUnload);
}

// ===== AUTHENTICATION HELPERS =====
function checkAuthStatus() {
    const user = localStorage.getItem('sleepsync_user');
    if (user) {
        currentUser = JSON.parse(user);
        updateUserDisplay();
    } else {
        // Redirect to login if not authenticated and not on public pages
        const publicPages = ['index.html', 'login.html', ''];
        const currentPage = window.location.pathname.split('/').pop();
        if (!publicPages.includes(currentPage)) {
            window.location.href = 'login.html';
        }
    }
}

function updateUserDisplay() {
    const userNameElements = document.querySelectorAll('#userName, #welcomeUserName');
    userNameElements.forEach(element => {
        if (element && currentUser) {
            element.textContent = currentUser.name || 'User';
        }
    });
}

function logout() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        localStorage.removeItem('sleepsync_user');
        localStorage.removeItem('sleepsync_sleep_data');
        localStorage.removeItem('sleepsync_test_result');
        localStorage.removeItem('sleepsync_cbt_progress');
        window.location.href = 'index.html';
    }
}

// ===== DATA MANAGEMENT =====
function loadSavedData() {
    // Load sleep data
    const savedSleepData = localStorage.getItem('sleepsync_sleep_data');
    if (savedSleepData) {
        sleepData = JSON.parse(savedSleepData);
    } else {
        // Initialize with sample data for demo
        sleepData = generateSampleSleepData();
        saveSleepData();
    }
}

function saveSleepData() {
    localStorage.setItem('sleepsync_sleep_data', JSON.stringify(sleepData));
}

function saveDataBeforeUnload() {
    // Save any pending data before page unload
    saveSleepData();
}

function generateSampleSleepData() {
    const sampleData = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        const bedTime = new Date(date);
        bedTime.setHours(22 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60));
        
        const wakeTime = new Date(date);
        wakeTime.setDate(wakeTime.getDate() + 1);
        wakeTime.setHours(6 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60));
        
        const qualities = ['buruk', 'biasa', 'baik'];
        const quality = qualities[Math.floor(Math.random() * qualities.length)];
        
        sampleData.push({
            id: Date.now() + i,
            date: date.toISOString().split('T')[0],
            bedTime: bedTime.toTimeString().slice(0, 5),
            wakeTime: wakeTime.toTimeString().slice(0, 5),
            quality: quality,
            notes: i === 0 ? 'Tidur cukup nyenyak malam ini' : '',
            factors: i === 1 ? ['stress', 'screenTime'] : []
        });
    }
    
    return sampleData;
}

// ===== UI HELPERS =====
function updateActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

function updatePageSpecificUI() {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'dashboard.html':
            updateDashboardStats();
            break;
        case 'sleep-tracker.html':
            updateSleepTrackerUI();
            break;
        case 'sleep-test.html':
            initializeSleepTest();
            break;
        case 'cbt-program.html':
            updateCBTProgress();
            break;
        case 'education.html':
            loadEducationContent();
            break;
        case 'premium.html':
            initializePremiumPage();
            break;
    }
}

function setupFormHandlers() {
    // Sleep form handler
    const sleepForm = document.getElementById('sleepForm');
    if (sleepForm) {
        sleepForm.addEventListener('submit', handleSleepFormSubmit);
    }
    
    // Login form handler
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    // Register form handler
    const registerForm = document.getElementById('registerFormElement');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterSubmit);
    }
}

function setupButtonHandlers() {
    // Category filter buttons
    const categoryButtons = document.querySelectorAll('[data-category]');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterContent(category);
            updateActiveButton(this, categoryButtons);
        });
    });
}

function handleWindowResize() {
    // Redraw charts on window resize
    Object.keys(chartInstances).forEach(chartId => {
        if (chartInstances[chartId]) {
            chartInstances[chartId].resize();
        }
    });
}

// ===== DASHBOARD FUNCTIONS =====
function updateDashboardStats() {
    if (sleepData.length === 0) return;
    
    // Calculate average sleep duration
    const avgSleep = calculateAverageSleep();
    const avgSleepElement = document.getElementById('avgSleep');
    if (avgSleepElement) {
        avgSleepElement.textContent = `${avgSleep.toFixed(1)} jam`;
    }
    
    // Update sleep quality
    const latestQuality = sleepData[sleepData.length - 1]?.quality || 'baik';
    const qualityElement = document.getElementById('sleepQuality');
    if (qualityElement) {
        qualityElement.textContent = capitalizeFirst(latestQuality);
    }
    
    // Update streak
    const streak = calculateSleepStreak();
    const streakElement = document.getElementById('streak');
    if (streakElement) {
        streakElement.textContent = `${streak} hari`;
    }
    
    // Update CBT progress
    const cbtProgress = getCBTProgress();
    const cbtElement = document.getElementById('cbtProgress');
    if (cbtElement) {
        cbtElement.textContent = `Hari ${cbtProgress.currentDay}`;
    }
}

function calculateAverageSleep() {
    if (sleepData.length === 0) return 7.5;
    
    const totalHours = sleepData.reduce((sum, entry) => {
        const duration = calculateSleepDuration(entry.bedTime, entry.wakeTime);
        return sum + duration;
    }, 0);
    
    return totalHours / sleepData.length;
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

function calculateSleepStreak() {
    if (sleepData.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    
    for (let i = sleepData.length - 1; i >= 0; i--) {
        const entryDate = new Date(sleepData[i].date);
        const daysDiff = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === streak) {
            const duration = calculateSleepDuration(sleepData[i].bedTime, sleepData[i].wakeTime);
            if (duration >= 6 && duration <= 10) { // Reasonable sleep duration
                streak++;
            } else {
                break;
            }
        } else {
            break;
        }
    }
    
    return streak;
}

function getCBTProgress() {
    const saved = localStorage.getItem('sleepsync_cbt_progress');
    if (saved) {
        return JSON.parse(saved);
    }
    return { currentDay: 3, completedDays: [1, 2], progress: 43 };
}

// ===== UTILITY FUNCTIONS =====
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    const [hour, minute] = timeString.split(':');
    return `${hour}:${minute}`;
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function showLoading(element) {
    if (element) {
        element.classList.add('loading');
        element.disabled = true;
    }
}

function hideLoading(element) {
    if (element) {
        element.classList.remove('loading');
        element.disabled = false;
    }
}

function filterContent(category) {
    const items = document.querySelectorAll('[data-category]');
    items.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = 'block';
            item.classList.remove('d-none');
        } else {
            item.style.display = 'none';
            item.classList.add('d-none');
        }
    });
}

function updateActiveButton(activeButton, allButtons) {
    allButtons.forEach(button => {
        button.classList.remove('active', 'btn-primary');
        button.classList.add('btn-outline-primary');
    });
    
    activeButton.classList.remove('btn-outline-primary');
    activeButton.classList.add('active', 'btn-primary');
}

// ===== FORM HANDLERS =====
function handleSleepFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const sleepEntry = {
        id: Date.now(),
        date: formData.get('sleepDate') || document.getElementById('sleepDate').value,
        bedTime: formData.get('bedTime') || document.getElementById('bedTime').value,
        wakeTime: formData.get('wakeTime') || document.getElementById('wakeTime').value,
        quality: formData.get('sleepQuality') || document.getElementById('sleepQualityInput').value,
        notes: formData.get('sleepNotes') || document.getElementById('sleepNotes').value,
        factors: getSelectedFactors()
    };
    
    // Validate data
    if (!sleepEntry.date || !sleepEntry.bedTime || !sleepEntry.wakeTime || !sleepEntry.quality) {
        showNotification('Mohon lengkapi semua field yang wajib diisi', 'danger');
        return;
    }
    
    // Add to sleep data
    sleepData.push(sleepEntry);
    saveSleepData();
    
    // Reset form
    e.target.reset();
    
    // Close modal if exists
    const modal = bootstrap.Modal.getInstance(document.getElementById('addSleepModal'));
    if (modal) {
        modal.hide();
    }
    
    // Update UI
    updateSleepTrackerUI();
    showNotification('Data tidur berhasil disimpan!', 'success');
}

function getSelectedFactors() {
    const factors = [];
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        factors.push(checkbox.id);
    });
    return factors;
}

function handleLoginSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Demo authentication
    if (email === 'demo@sleepsync.com' && password === 'demo123') {
        const user = {
            id: 1,
            name: 'Demo User',
            email: email,
            status: 'mahasiswa',
            joinDate: new Date().toISOString()
        };
        
        localStorage.setItem('sleepsync_user', JSON.stringify(user));
        currentUser = user;
        
        showNotification('Login berhasil! Selamat datang di SleepSync', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } else {
        showNotification('Email atau password salah. Gunakan demo@sleepsync.com / demo123', 'danger');
    }
}

function handleRegisterSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const age = document.getElementById('registerAge').value;
    const status = document.getElementById('registerStatus').value;
    
    // Simple validation
    if (!name || !email || !password || !age || !status) {
        showNotification('Mohon lengkapi semua field', 'danger');
        return;
    }
    
    // Create user
    const user = {
        id: Date.now(),
        name: name,
        email: email,
        age: parseInt(age),
        status: status,
        joinDate: new Date().toISOString()
    };
    
    localStorage.setItem('sleepsync_user', JSON.stringify(user));
    currentUser = user;
    
    showNotification('Registrasi berhasil! Selamat datang di SleepSync', 'success');
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

// ===== EXPORT FUNCTIONS =====
window.logout = logout;
window.showNotification = showNotification;
window.filterContent = filterContent;
window.updateActiveButton = updateActiveButton;
window.calculateSleepDuration = calculateSleepDuration;
window.formatDate = formatDate;
window.formatTime = formatTime;
window.capitalizeFirst = capitalizeFirst;
