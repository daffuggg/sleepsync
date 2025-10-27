// ===== AUTHENTICATION MANAGEMENT =====

let isProcessingAuth = false;
const authState = {
    isLoggedIn: false,
    currentUser: null,
    initialized: false
};

// Initialize auth dengan delay
document.addEventListener('DOMContentLoaded', function() {
    // Tambahkan delay untuk memastikan storage ready
    setTimeout(() => {
        if (!authState.initialized) {
            initializeAuth();
        }
    }, 100);
});

function initializeAuth() {
    console.log('🔐 Initializing authentication...');
    
    // Coba beberapa kali jika gagal
    let attempts = 0;
    const maxAttempts = 3;
    
    function tryAuth() {
        attempts++;
        console.log(`🔄 Auth attempt ${attempts}/${maxAttempts}`);
        
        const authResult = checkAuthenticationStatus();
        
        if (!authResult && attempts < maxAttempts) {
            console.log('⏳ Retrying auth check...');
            setTimeout(tryAuth, 200);
            return;
        }
        
        setupAuthEventListeners();
        setupFormSwitching();
        authState.initialized = true;
        console.log('✅ Auth initialization complete');
    }
    
    tryAuth();
}

function checkAuthenticationStatus() {
    const currentPage = window.location.pathname.split('/').pop();
    const protectedPages = ['dashboard.html', 'sleep-tracker.html', 'sleep-test.html', 'cbt-program.html', 'education.html', 'premium.html'];
    
    console.log(`📄 Current page: ${currentPage}`);
    
    // Check storage dengan error handling
    let user = null;
    try {
        const savedUser = localStorage.getItem('sleepsync_user');
        const sessionUser = sessionStorage.getItem('sleepsync_user');
        
        console.log('💾 Storage check:', {
            localStorage: !!savedUser,
            sessionStorage: !!sessionUser
        });
        
        if (savedUser || sessionUser) {
            user = JSON.parse(savedUser || sessionUser);
            console.log('👤 User found:', user?.name || 'Unknown');
        }
    } catch (error) {
        console.error('❌ Storage read error:', error);
        return false;
    }
    
    if (user && user.isLoggedIn) {
        authState.currentUser = user;
        authState.isLoggedIn = true;
        updateUserInterface();
        
        console.log('✅ User authenticated');
        
        // Hanya redirect dari login ke dashboard
        if (currentPage === 'login.html') {
            console.log('🔄 Redirecting from login to dashboard');
            window.location.href = 'dashboard.html';
            return true;
        }
        
        // PENTING: Jangan redirect jika sudah di halaman yang benar
        console.log('✅ User on correct page, no redirect needed');
        return true;
    }
    
    // User tidak login, cek apakah di protected page
    if (protectedPages.includes(currentPage)) {
        console.log('🚫 User not authenticated, redirecting to login');
        window.location.href = 'login.html';
        return false;
    }
    
    console.log('ℹ️ Public page, no auth required');
    return true;
}

function setupAuthEventListeners() {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage !== 'login.html') return;
    
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const registerForm = document.getElementById('registerFormElement');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    const showRegisterBtn = document.getElementById('showRegister');
    const showLoginBtn = document.getElementById('showLogin');
    
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showRegisterForm();
        });
    }
    
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showLoginForm();
        });
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    if (isProcessingAuth) return false;
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Email dan password harus diisi');
        return false;
    }
    
    isProcessingAuth = true;
    showLoading(submitBtn);
    
    try {
        if (email === 'demo@sleepsync.com' && password === 'demo123') {
            const userData = {
                id: 1,
                name: 'Demo User',
                email: email,
                isLoggedIn: true,
                timestamp: Date.now()
            };

            // Simpan ke kedua storage untuk memastikan
            sessionStorage.setItem('sleepsync_user', JSON.stringify(userData));
            localStorage.setItem('sleepsync_user', JSON.stringify(userData));
            
            authState.currentUser = userData;
            authState.isLoggedIn = true;

            console.log('✅ Login successful, user data saved');
            alert('Login berhasil! Selamat datang');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
            
        } else {
            throw new Error('Email atau password salah');
        }
        
    } catch (error) {
        console.error('❌ Login error:', error);
        alert('Error: ' + error.message);
        
    } finally {
        isProcessingAuth = false;
        hideLoading(submitBtn);
    }
    
    return false;
}

function updateUserInterface() {
    if (authState.currentUser) {
        const userNameElements = document.querySelectorAll('#userName, #welcomeUserName');
        userNameElements.forEach(element => {
            if (element) {
                element.textContent = authState.currentUser.name;
            }
        });
    }
}

function setupFormSwitching() {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'login.html') {
        showLoginForm();
    }
}

function showLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm && registerForm) {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    }
}

function showRegisterForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm && registerForm) {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}

function showLoading(element) {
    if (element) {
        element.disabled = true;
        element.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Memproses...';
    }
}

function hideLoading(element) {
    if (element) {
        element.disabled = false;
        if (element.closest('#loginForm')) {
            element.innerHTML = '<i class="fas fa-sign-in-alt me-2"></i>Masuk';
        } else if (element.closest('#registerForm')) {
            element.innerHTML = '<i class="fas fa-user-plus me-2"></i>Daftar';
        }
    }
}

function logout() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        console.log('🚪 Logging out user');
        
        localStorage.removeItem('sleepsync_user');
        sessionStorage.removeItem('sleepsync_user');
        
        authState.currentUser = null;
        authState.isLoggedIn = false;
        authState.initialized = false;
        
        window.location.href = 'index.html';
    }
}

// Export functions
window.logout = logout;
window.showLoginForm = showLoginForm;
window.showRegisterForm = showRegisterForm;
