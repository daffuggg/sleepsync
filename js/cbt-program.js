// ===== CBT-I PROGRAM FUNCTIONALITY =====

let cbtProgram = {
    currentDay: 3,
    completedDays: [1, 2],
    dayProgress: {},
    startDate: null,
    exercises: {}
};

// Initialize CBT program
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('cbt-program.html')) {
        initializeCBTProgram();
    }
});

function initializeCBTProgram() {
    loadCBTProgress();
    setupCBTEventListeners();
    updateCBTUI();
}

function loadCBTProgress() {
    const savedProgress = localStorage.getItem('sleepsync_cbt_progress');
    if (savedProgress) {
        cbtProgram = { ...cbtProgram, ...JSON.parse(savedProgress) };
    } else {
        // Initialize with default progress for demo
        cbtProgram.startDate = new Date().toISOString();
        saveCBTProgress();
    }
}

function saveCBTProgress() {
    localStorage.setItem('sleepsync_cbt_progress', JSON.stringify(cbtProgram));
}

function setupCBTEventListeners() {
    // Day completion buttons
    document.addEventListener('click', function(e) {
        if (e.target.matches('[onclick*="completeDay"]')) {
            const dayNumber = parseInt(e.target.getAttribute('onclick').match(/\d+/)[0]);
            completeDay(dayNumber);
        }
        
        if (e.target.matches('[onclick*="openDay"]')) {
            const dayNumber = parseInt(e.target.getAttribute('onclick').match(/\d+/)[0]);
            openDay(dayNumber);
        }
        
        if (e.target.matches('[onclick*="continueDay"]')) {
            const dayNumber = parseInt(e.target.getAttribute('onclick').match(/\d+/)[0]);
            continueDay(dayNumber);
        }
    });
}

function updateCBTUI() {
    updateProgressBar();
    updateDayCards();
    updateCurrentDayContent();
}

function updateProgressBar() {
    const progressPercentage = (cbtProgram.completedDays.length / 7) * 100;
    const progressBar = document.getElementById('overallProgress');
    if (progressBar) {
        progressBar.style.width = `${progressPercentage}%`;
    }
    
    const currentDayElement = document.getElementById('currentDay');
    if (currentDayElement) {
        currentDayElement.textContent = cbtProgram.currentDay;
    }
}

function updateDayCards() {
    const dayCards = document.querySelectorAll('.day-card, .program-day');
    
    dayCards.forEach((card, index) => {
        const dayNumber = index + 1;
        
        if (cbtProgram.completedDays.includes(dayNumber)) {
            card.classList.remove('active', 'locked');
            card.classList.add('completed');
        } else if (dayNumber === cbtProgram.currentDay) {
            card.classList.remove('completed', 'locked');
            card.classList.add('active');
        } else if (dayNumber > cbtProgram.currentDay) {
            card.classList.remove('completed', 'active');
            card.classList.add('locked');
        }
    });
}

function updateCurrentDayContent() {
    const currentDayData = getDayContent(cbtProgram.currentDay);
    
    // Update current day display if elements exist
    const elements = {
        'modalTitle': currentDayData.title,
        'dayTitle': currentDayData.title,
        'dayObjective': currentDayData.objective,
        'dayTheory': currentDayData.theory
    };
    
    Object.keys(elements).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = elements[id];
        }
    });
}

function getDayContent(dayNumber) {
    const dayContents = {
        1: {
            title: "Hari 1: Jurnal Kebiasaan Tidur",
            objective: "Mengidentifikasi pola tidur saat ini dan faktor-faktor yang mempengaruhi kualitas tidur Anda.",
            theory: "Langkah pertama dalam CBT-I adalah memahami pola tidur Anda saat ini. Sleep diary membantu mengidentifikasi kebiasaan yang mungkin mengganggu tidur.",
            activities: [
                "Catat waktu tidur dan bangun selama 7 hari",
                "Identifikasi faktor yang mempengaruhi tidur",
                "Evaluasi lingkungan tidur",
                "Buat baseline untuk perbaikan"
            ],
            exercises: {
                sleepDiary: "Isi sleep diary setiap hari",
                environmentCheck: "Evaluasi kamar tidur Anda"
            }
        },
        2: {
            title: "Hari 2: Teknik Relaksasi",
            objective: "Mempelajari dan mempraktikkan teknik relaksasi untuk mempersiapkan tubuh dan pikiran untuk tidur.",
            theory: "Teknik relaksasi membantu menurunkan arousal fisiologis dan psikologis yang dapat mengganggu tidur. Progressive muscle relaxation dan breathing exercises terbukti efektif.",
            activities: [
                "Pelajari teknik pernapasan 4-7-8",
                "Praktikkan progressive muscle relaxation",
                "Coba guided meditation",
                "Buat rutinitas relaksasi malam"
            ],
            exercises: {
                breathing: "Latihan pernapasan 4-7-8",
                muscleRelaxation: "Progressive muscle relaxation"
            }
        },
        3: {
            title: "Hari 3: Restrukturisasi Pikiran Negatif",
            objective: "Mengidentifikasi dan mengubah pikiran negatif tentang tidur yang dapat memperburuk insomnia.",
            theory: "Pikiran negatif tentang tidur dapat menciptakan siklus kecemasan yang memperburuk insomnia. Cognitive restructuring membantu mengubah pola pikir yang tidak membantu.",
            activities: [
                "Identifikasi pikiran negatif tentang tidur",
                "Pelajari teknik tantangan kognitif",
                "Buat daftar pikiran alternatif yang realistis",
                "Praktikkan thought stopping"
            ],
            exercises: {
                thoughtRecord: "Catat dan tantang pikiran negatif",
                affirmations: "Buat afirmasi positif untuk tidur"
            }
        },
        4: {
            title: "Hari 4: Higiene Tidur",
            objective: "Mengoptimalkan lingkungan dan kebiasaan untuk mendukung tidur yang berkualitas.",
            theory: "Sleep hygiene mencakup praktik dan kebiasaan yang mendukung tidur berkualitas secara konsisten. Lingkungan yang tepat sangat penting untuk tidur yang nyenyak.",
            activities: [
                "Optimalisasi suhu, cahaya, dan kebisingan kamar",
                "Buat rutinitas sebelum tidur yang konsisten",
                "Atur penggunaan elektronik",
                "Evaluasi kasur dan bantal"
            ],
            exercises: {
                environmentOptimization: "Audit dan perbaiki lingkungan tidur",
                routineCreation: "Buat rutinitas malam yang ideal"
            }
        },
        5: {
            title: "Hari 5: Kontrol Stimulus",
            objective: "Memperkuat asosiasi antara tempat tidur dengan tidur yang nyenyak.",
            theory: "Stimulus control membantu membangun kembali asosiasi yang kuat antara tempat tidur dan tidur. Ini mengurangi arousal yang terkait dengan tempat tidur.",
            activities: [
                "Terapkan aturan 20 menit",
                "Batasi aktivitas di tempat tidur",
                "Konsistensi waktu bangun",
                "Hindari tidur di luar tempat tidur"
            ],
            exercises: {
                twentyMinuteRule: "Praktikkan aturan 20 menit",
                bedAssociation: "Perkuat asosiasi tempat tidur dengan tidur"
            }
        },
        6: {
            title: "Hari 6: Pembatasan Tidur",
            objective: "Meningkatkan efisiensi tidur dengan membatasi waktu di tempat tidur.",
            theory: "Sleep restriction therapy meningkatkan sleep drive dan mengurangi waktu terjaga di tempat tidur. Ini membantu mengkonsolidasikan tidur.",
            activities: [
                "Hitung efisiensi tidur saat ini",
                "Tentukan window tidur yang optimal",
                "Terapkan jadwal tidur yang ketat",
                "Monitor dan sesuaikan secara bertahap"
            ],
            exercises: {
                sleepEfficiency: "Hitung dan tingkatkan efisiensi tidur",
                scheduleAdjustment: "Sesuaikan jadwal tidur secara bertahap"
            }
        },
        7: {
            title: "Hari 7: Evaluasi dan Maintenance",
            objective: "Mengevaluasi progress dan membuat rencana jangka panjang untuk mempertahankan perbaikan tidur.",
            theory: "Maintenance phase penting untuk mempertahankan perbaikan jangka panjang. Relapse prevention membantu mengatasi kemunduran yang mungkin terjadi.",
            activities: [
                "Evaluasi progress selama 7 hari",
                "Identifikasi strategi yang paling efektif",
                "Buat rencana maintenance jangka panjang",
                "Siapkan strategi untuk mengatasi kemunduran"
            ],
            exercises: {
                progressEvaluation: "Evaluasi komprehensif progress",
                maintenancePlan: "Buat rencana maintenance personal"
            }
        }
    };
    
    return dayContents[dayNumber] || dayContents[1];
}

function getDayTitle(day) {
    const titles = {
        3: 'Restrukturisasi Pikiran',
        // ...add other day titles
    };
    return titles[day] || 'Unknown';
}

function generateDayContent(day) {
    if (day === 3) {
        return `
            <div class="day-content">
                <h5 class="mb-3">Aktivitas Hari Ini</h5>
                <div class="task-list">
                    <div class="task-item mb-3">
                        <h6>1. Identifikasi Pikiran Negatif</h6>
                        <p>Catat pikiran negatif yang muncul sebelum tidur:</p>
                        <textarea class="form-control mb-2" rows="3" placeholder="Contoh: Saya pasti tidak bisa tidur malam ini..."></textarea>
                    </div>
                    <div class="task-item mb-3">
                        <h6>2. Tantangan Pikiran</h6>
                        <p>Tanyakan pada diri sendiri:</p>
                        <ul class="mb-2">
                            <li>Apakah ada bukti yang mendukung pikiran ini?</li>
                            <li>Apakah ada penjelasan alternatif?</li>
                            <li>Apa yang akan saya katakan pada teman dengan pikiran serupa?</li>
                        </ul>
                        <textarea class="form-control" rows="3" placeholder="Tulis tanggapan Anda..."></textarea>
                    </div>
                    <div class="task-item">
                        <h6>3. Afirmasi Positif</h6>
                        <p>Tuliskan afirmasi positif untuk mengganti pikiran negatif:</p>
                        <textarea class="form-control" rows="3" placeholder="Contoh: Saya mampu tidur dengan nyenyak..."></textarea>
                    </div>
                </div>
            </div>
        `;
    }
    return '<p>Konten tidak tersedia</p>';
}

function openDay(dayNumber) {
    if (dayNumber > cbtProgram.currentDay && !cbtProgram.completedDays.includes(dayNumber)) {
        showNotification('Selesaikan hari sebelumnya terlebih dahulu', 'warning');
        return;
    }
    
    const dayContent = getDayContent(dayNumber);
    showDayModal(dayContent, dayNumber);
}

let currentModal = null;

function continueDay(day) {
    try {
        // Get the modal element
        const modalElement = document.getElementById('dayContentModal');
        
        // Create new modal instance if not exists
        if (!currentModal) {
            currentModal = new bootstrap.Modal(modalElement);
        }

        // Set modal content
        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');
        modalTitle.textContent = `Hari ${day}: ${getDayTitle(day)}`;
        modalContent.innerHTML = generateDayContent(day);

        // Remove any existing event listeners
        const completeBtn = document.getElementById('completeActivityBtn');
        if (completeBtn) {
            const newBtn = completeBtn.cloneNode(true);
            completeBtn.parentNode.replaceChild(newBtn, completeBtn);
            
            // Add new event listener
            newBtn.addEventListener('click', () => {
                completeDayActivity(day);
                currentModal.hide();
            });
        }

        // Add modal hidden event listener
        modalElement.addEventListener('hidden.bs.modal', function () {
            modalContent.innerHTML = '';
            if (completeBtn) {
                completeBtn.removeEventListener('click', completeDayActivity);
            }
        }, { once: true });

        // Show modal
        currentModal.show();

    } catch (error) {
        console.error('Error in continueDay:', error);
        alert('Terjadi kesalahan saat membuka konten. Silakan coba lagi.');
    }
}

function completeDayActivity(day) {
    try {
        // Save progress
        saveDayProgress(day);
        
        // Update UI
        updateDayStatus(day);
        updateOverallProgress();
        
        // Show success notification
        showNotification('Aktivitas hari ini selesai!', 'success');
        
    } catch (error) {
        console.error('Error completing activity:', error);
        showNotification('Terjadi kesalahan. Silakan coba lagi.', 'error');
    }
}

function showDayModal(dayContent, dayNumber) {
    const modal = document.getElementById('dayContentModal');
    if (!modal) return;
    
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');
    const completeBtn = modal.querySelector('#completeActivityBtn');
    
    modalTitle.textContent = dayContent.title;
    
    modalBody.innerHTML = `
        <div class="day-content">
            <div class="mb-4">
                <h6 class="fw-bold text-primary">Tujuan Hari Ini:</h6>
                <p>${dayContent.objective}</p>
            </div>
            
            <div class="mb-4">
                <h6 class="fw-bold text-info">Teori Singkat:</h6>
                <p>${dayContent.theory}</p>
            </div>
            
            <div class="mb-4">
                <h6 class="fw-bold text-success">Aktivitas:</h6>
                <ul class="list-unstyled">
                    ${dayContent.activities.map(activity => 
                        `<li class="mb-2"><i class="fas fa-check-circle text-success me-2"></i>${activity}</li>`
                    ).join('')}
                </ul>
            </div>
            
            ${generateInteractiveExercise(dayNumber)}
        </div>
    `;
    
    // Setup complete button
    completeBtn.onclick = () => completeDay(dayNumber);
    
    // Show modal
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
}

function generateInteractiveExercise(dayNumber) {
    const exercises = {
        3: `
            <div class="card bg-light">
                <div class="card-body">
                    <h6 class="fw-bold mb-3">
                        <i class="fas fa-brain me-2 text-primary"></i>Latihan Interaktif: Restrukturisasi Pikiran
                    </h6>
                    <div class="mb-3">
                        <label class="form-label">Tuliskan satu pikiran negatif tentang tidur:</label>
                        <textarea class="form-control" id="negativeThought" rows="2" 
                                  placeholder="Contoh: Kalau saya tidak tidur 8 jam, besok saya akan sangat lelah"></textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Ubah menjadi pikiran yang lebih realistis:</label>
                        <textarea class="form-control" id="positiveThought" rows="2" 
                                  placeholder="Contoh: Meskipun tidur kurang dari 8 jam, saya masih bisa berfungsi dengan baik"></textarea>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="saveThoughtExercise()">
                        <i class="fas fa-save me-2"></i>Simpan Latihan
                    </button>
                </div>
            </div>
        `,
        2: `
            <div class="card bg-light">
                <div class="card-body">
                    <h6 class="fw-bold mb-3">
                        <i class="fas fa-lungs me-2 text-info"></i>Latihan Pernapasan 4-7-8
                    </h6>
                    <p class="mb-3">Ikuti panduan pernapasan ini:</p>
                    <div class="breathing-guide text-center">
                        <div class="breathing-circle mb-3" id="breathingCircle">
                            <span id="breathingText">Siap?</span>
                        </div>
                        <button class="btn btn-info" onclick="startBreathingExercise()">
                            <i class="fas fa-play me-2"></i>Mulai Latihan
                        </button>
                    </div>
                </div>
            </div>
        `
    };
    
    return exercises[dayNumber] || `
        <div class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>
            Latihan interaktif untuk hari ini akan segera tersedia.
        </div>
    `;
}

function completeDay(dayNumber) {
    if (dayNumber !== cbtProgram.currentDay) {
        showNotification('Anda hanya bisa menyelesaikan hari yang sedang aktif', 'warning');
        return;
    }
    
    // Mark day as completed
    if (!cbtProgram.completedDays.includes(dayNumber)) {
        cbtProgram.completedDays.push(dayNumber);
    }
    
    // Move to next day
    if (dayNumber < 7) {
        cbtProgram.currentDay = dayNumber + 1;
    }
    
    // Save progress
    saveCBTProgress();
    
    // Update UI
    updateCBTUI();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('dayContentModal'));
    if (modal) modal.hide();
    
    // Show completion message
    if (dayNumber === 7) {
        showNotification('Selamat! Anda telah menyelesaikan program CBT-I 7 hari!', 'success');
        setTimeout(() => {
            showProgramCompletionModal();
        }, 1000);
    } else {
        showNotification(`Hari ${dayNumber} selesai! Lanjutkan ke hari ${dayNumber + 1}`, 'success');
    }
}

function showProgramCompletionModal() {
    const modalHTML = `
        <div class="modal fade" id="completionModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-trophy me-2"></i>Program Selesai!
                        </h5>
                    </div>
                    <div class="modal-body text-center p-4">
                        <i class="fas fa-medal fa-4x text-warning mb-3"></i>
                        <h4 class="fw-bold mb-3">Selamat!</h4>
                        <p class="mb-4">
                            Anda telah berhasil menyelesaikan program CBT-I 7 hari. 
                            Ini adalah pencapaian yang luar biasa untuk kesehatan tidur Anda!
                        </p>
                        <div class="row g-3 mb-4">
                            <div class="col-4">
                                <div class="completion-stat">
                                    <h5 class="fw-bold text-primary">7</h5>
                                    <small class="text-muted">Hari Selesai</small>
                                                                </div>
                            </div>
                            <div class="col-4">
                                <div class="completion-stat">
                                    <h5 class="fw-bold text-success">100%</h5>
                                    <small class="text-muted">Progress</small>
                                                                </div>
                            </div>
                            <div class="col-4">
                                <div class="completion-stat">
                                    <h5 class="fw-bold text-success">100%</h5>
                                    <small class="text-muted">Progress</small>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="completion-stat">
                                    <h5 class="fw-bold text-warning">⭐</h5>
                                    <small class="text-muted">Achievement</small>
                                </div>
                            </div>
                        </div>
                        <div class="d-grid gap-2">
                            <a href="premium.html" class="btn btn-warning">
                                <i class="fas fa-crown me-2"></i>Upgrade ke Premium
                            </a>
                            <a href="dashboard.html" class="btn btn-outline-primary">
                                <i class="fas fa-home me-2"></i>Kembali ke Dashboard
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('completionModal'));
    modal.show();
}

function saveThoughtExercise() {
    const negativeThought = document.getElementById('negativeThought')?.value;
    const positiveThought = document.getElementById('positiveThought')?.value;
    
    if (!negativeThought || !positiveThought) {
        showNotification('Mohon lengkapi kedua field', 'warning');
        return;
    }
    
    // Save exercise data
    if (!cbtProgram.exercises) cbtProgram.exercises = {};
    cbtProgram.exercises.day3 = {
        negativeThought: negativeThought,
        positiveThought: positiveThought,
        completedAt: new Date().toISOString()
    };
    
    saveCBTProgress();
    showNotification('Latihan berhasil disimpan!', 'success');
    
    // Mark activity as completed
    document.getElementById('negativeThought').disabled = true;
    document.getElementById('positiveThought').disabled = true;
}

function startBreathingExercise() {
    const circle = document.getElementById('breathingCircle');
    const text = document.getElementById('breathingText');
    const button = event.target;
    
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Berlatih...';
    
    let phase = 0; // 0: inhale, 1: hold, 2: exhale
    let count = 0;
    let cycle = 0;
    const maxCycles = 4;
    
    const phases = [
        { duration: 4000, text: 'Tarik napas', class: 'inhale' },
        { duration: 7000, text: 'Tahan', class: 'hold' },
        { duration: 8000, text: 'Buang napas', class: 'exhale' }
    ];
    
    function runPhase() {
        if (cycle >= maxCycles) {
            text.textContent = 'Selesai!';
            circle.className = 'breathing-circle';
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-redo me-2"></i>Ulangi';
            
            // Save exercise completion
            if (!cbtProgram.exercises) cbtProgram.exercises = {};
            cbtProgram.exercises.day2_breathing = {
                completedAt: new Date().toISOString(),
                cycles: maxCycles
            };
            saveCBTProgress();
            showNotification('Latihan pernapasan selesai!', 'success');
            return;
        }
        
        const currentPhase = phases[phase];
        text.textContent = `${currentPhase.text} (${cycle + 1}/${maxCycles})`;
        circle.className = `breathing-circle ${currentPhase.class}`;
        
        setTimeout(() => {
            phase = (phase + 1) % 3;
            if (phase === 0) cycle++;
            runPhase();
        }, currentPhase.duration);
    }
    
    runPhase();
}

function reviewDay(dayNumber) {
    const dayContent = getDayContent(dayNumber);
    showDayModal(dayContent, dayNumber);
}

// Export functions
window.openDay = openDay;
window.continueDay = continueDay;
window.completeDay = completeDay;
window.reviewDay = reviewDay;
window.saveThoughtExercise = saveThoughtExercise;
window.startBreathingExercise = startBreathingExercise;

// Add modal cleanup on hidden event
document.addEventListener('DOMContentLoaded', function() {
    const dayContentModal = document.getElementById('dayContentModal');
    if (dayContentModal) {
        dayContentModal.addEventListener('hidden.bs.modal', function() {
            // Clean up modal content
            document.getElementById('modalContent').innerHTML = '';
            
            // Remove event listeners
            const completeBtn = document.getElementById('completeActivityBtn');
            if (completeBtn) {
                completeBtn.replaceWith(completeBtn.cloneNode(true));
            }
        });
    }
});
