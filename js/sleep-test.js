// ===== SLEEP TEST FUNCTIONALITY - BREUS CHRONOTYPES =====

let testQuestions = [];
let currentQuestionIndex = 0;
let testAnswers = [];
let testResult = null;

// Initialize sleep test
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('sleep-test.html')) {
        initializeSleepTest();
    }
});

function initializeSleepTest() {
    loadTestQuestions();
    setupTestEventListeners();
    checkExistingResult();
}

function loadTestQuestions() {
    testQuestions = [
        {
            id: 1,
            question: "Jam berapa biasanya kamu merasa paling berenergi?",
            options: [
                { value: "lion", text: "05.00–09.00 pagi" },
                { value: "bear", text: "09.00–12.00 siang" },
                { value: "wolf", text: "17.00–22.00 sore/malam" },
                { value: "dolphin", text: "Energi naik-turun, susah ditebak" }
            ]
        },
        {
            id: 2,
            question: "Jam berapa kamu bangun alami tanpa alarm?",
            options: [
                { value: "lion", text: "05.00–06.00 pagi" },
                { value: "bear", text: "07.00–08.00 pagi" },
                { value: "wolf", text: "09.00–11.00 pagi" },
                { value: "dolphin", text: "Tidak konsisten" }
            ]
        },
        {
            id: 3,
            question: "Jam berapa kamu biasanya mengantuk dan siap tidur?",
            options: [
                { value: "lion", text: "21.00–22.00 malam" },
                { value: "bear", text: "23.00–24.00 malam" },
                { value: "wolf", text: "01.00–02.00 pagi" },
                { value: "dolphin", text: "Sulit tidur" }
            ]
        },
        {
            id: 4,
            question: "Bagaimana kualitas tidurmu?",
            options: [
                { value: "lion", text: "Nyenyak & mudah tidur" },
                { value: "bear", text: "Cukup baik, rutin" },
                { value: "wolf", text: "Sering kesiangan" },
                { value: "dolphin", text: "Gelisah, sering terbangun" }
            ]
        },
        {
            id: 5,
            question: "Bagaimana energi harianmu?",
            options: [
                { value: "lion", text: "Tinggi pagi" },
                { value: "bear", text: "Stabil mengikuti matahari" },
                { value: "wolf", text: "Tinggi sore–malam" },
                { value: "dolphin", text: "Fluktuatif, sulit fokus" }
            ]
        },
        {
            id: 6,
            question: "Seberapa mudah kamu menyesuaikan jadwal tidur baru?",
            options: [
                { value: "lion", text: "Bisa, tapi lebih nyaman pagi" },
                { value: "bear", text: "Bisa menyesuaikan" },
                { value: "wolf", text: "Sulit, lebih nyaman malam" },
                { value: "dolphin", text: "Sangat sulit" }
            ]
        },
        {
            id: 7,
            question: "Suasana hatimu pagi hari biasanya?",
            options: [
                { value: "lion", text: "Segar & produktif" },
                { value: "bear", text: "Cukup segar" },
                { value: "wolf", text: "Lesu, butuh kopi" },
                { value: "dolphin", text: "Tidak konsisten" }
            ]
        },
        {
            id: 8,
            question: "Apakah kamu sering terbangun di malam hari?",
            options: [
                { value: "lion", text: "Tidak Pernah" },
                { value: "bear", text: "Jarang" },
                { value: "wolf", text: "Kadang" },
                { value: "dolphin", text: "Sering" }
            ]
        },
        {
            id: 9,
            question: "Saat harus begadang, kamu…",
            options: [
                { value: "lion", text: "Bisa tapi lebih nyaman tidur cepat" },
                { value: "bear", text: "Bisa menyesuaikan" },
                { value: "wolf", text: "Nyaman & produktif" },
                { value: "dolphin", text: "Sulit tidur & tidak nyaman" }
            ]
        },
        {
            id: 10,
            question: "Apakah kamu gampang mengantuk di siang hari?",
            options: [
                { value: "lion", text: "Tidak Pernah" },
                { value: "bear", text: "Kadang" },
                { value: "wolf", text: "Jarang" },
                { value: "dolphin", text: "Sering" }
            ]
        }
    ];
}

function setupTestEventListeners() {
    // Start test button
    const startBtn = document.querySelector('button[onclick="startTest()"]');
    if (startBtn) {
        startBtn.addEventListener('click', startTest);
    }
}

function checkExistingResult() {
    const savedResult = localStorage.getItem('sleepsync_test_result');
    if (savedResult) {
        testResult = JSON.parse(savedResult);
        showTestResults();
    }
}

function startTest() {
    document.getElementById('testIntro').style.display = 'none';
    document.getElementById('testQuestions').style.display = 'block';
    
    currentQuestionIndex = 0;
    testAnswers = [];
    
    showQuestion(0);
}

function showQuestion(index) {
    if (index >= testQuestions.length) {
        calculateResults();
        return;
    }
    
    const question = testQuestions[index];
    const container = document.getElementById('questionContainer');
    
    container.innerHTML = `
        <div class="question-content">
            <h5 class="fw-bold mb-4">${question.question}</h5>
            <div class="options-container">
                ${question.options.map((option, i) => `
                    <div class="form-check mb-3">
                        <input class="form-check-input" type="radio" name="question${question.id}" 
                               id="option${i}" value="${option.value}">
                        <label class="form-check-label" for="option${i}">
                            ${option.text}
                        </label>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Update progress
    const progress = ((index + 1) / testQuestions.length) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
    document.getElementById('currentQuestion').textContent = index + 1;
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.disabled = index === 0;
    nextBtn.disabled = true;
    
    // Add event listeners to radio buttons
    const radioButtons = container.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            nextBtn.disabled = false;
            if (index === testQuestions.length - 1) {
                nextBtn.innerHTML = 'Selesai <i class="fas fa-check ms-2"></i>';
            }
        });
    });
}

function nextQuestion() {
    const selectedOption = document.querySelector(`input[name="question${testQuestions[currentQuestionIndex].id}"]:checked`);
    
    if (!selectedOption) {
        showNotification('Mohon pilih salah satu jawaban', 'warning');
        return;
    }
    
    // Save answer
    testAnswers[currentQuestionIndex] = {
        questionId: testQuestions[currentQuestionIndex].id,
        answer: selectedOption.value
    };
    
    currentQuestionIndex++;
    
    if (currentQuestionIndex >= testQuestions.length) {
        calculateResults();
    } else {
        showQuestion(currentQuestionIndex);
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(currentQuestionIndex);
        
        // Restore previous answer if exists
        if (testAnswers[currentQuestionIndex]) {
            const previousAnswer = testAnswers[currentQuestionIndex].answer;
            const radioButton = document.querySelector(`input[value="${previousAnswer}"]`);
            if (radioButton) {
                radioButton.checked = true;
                document.getElementById('nextBtn').disabled = false;
            }
        }
    }
}

function calculateResults() {
    const scores = {
        lion: 0,
        bear: 0,
        wolf: 0,
        dolphin: 0
    };
    
    // Count frequency of each chronotype answer
    testAnswers.forEach(answer => {
        scores[answer.answer]++;
    });
    
    // Determine primary chronotype (highest score)
    const maxScore = Math.max(...Object.values(scores));
    const primaryType = Object.keys(scores).find(key => scores[key] === maxScore);
    
    // Calculate percentages
    const totalScore = testQuestions.length;
    const percentages = {};
    Object.keys(scores).forEach(type => {
        percentages[type] = Math.round((scores[type] / totalScore) * 100);
    });
    
    testResult = {
        primaryType: primaryType,
        scores: scores,
        percentages: percentages,
        completedAt: new Date().toISOString(),
        recommendations: getRecommendations(primaryType),
        characteristics: getCharacteristics(primaryType),
        optimalSchedule: getOptimalSchedule(primaryType)
    };
    
    // Save result
    localStorage.setItem('sleepsync_test_result', JSON.stringify(testResult));
    
    showTestResults();
}

function getRecommendations(type) {
    const recommendations = {
        lion: [
            "Manfaatkan produktivitas pagi untuk tugas-tugas penting dan kompleks",
            "Hindari kafein setelah jam 14:00 untuk menjaga kualitas tidur",
            "Lakukan olahraga di pagi hari (06:00-08:00) untuk energi optimal",
            "Selesaikan meeting dan diskusi penting sebelum siang",
            "Tidur lebih awal (21:00-22:00) untuk menjaga ritme sirkadian alami"
        ],
        bear: [
            "Ikuti ritme matahari - bangun saat terbit, tidur setelah matahari terbenam",
            "Jadwalkan tugas penting antara jam 10:00-14:00 saat energi puncak",
            "Tidur siang singkat (20-30 menit) di siang hari jika diperlukan",
            "Hindari screen time 1 jam sebelum tidur (jam 22:00)",
            "Pertahankan jadwal tidur konsisten, termasuk di akhir pekan"
        ],
        wolf: [
            "Hindari cahaya biru 2-3 jam sebelum tidur (mulai jam 22:00)",
            "Jadwalkan tugas kreatif dan kompleks di sore-malam hari (17:00-22:00)",
            "Gunakan blackout curtains dan masker mata untuk tidur lebih nyenyak",
            "Hindari meeting pagi jika memungkinkan, lebih baik siang-sore",
            "Gunakan alarm bertahap dan cahaya terang di pagi hari untuk bangun lebih mudah"
        ],
        dolphin: [
            "Praktikkan teknik CBT-I secara konsisten untuk insomnia",
            "Hindari tidur siang sama sekali untuk meningkatkan sleep pressure",
            "Buat rutinitas wind-down 60-90 menit sebelum tidur",
            "Gunakan teknik mindfulness dan meditasi untuk menenangkan pikiran",
            "Konsultasi dengan sleep specialist jika insomnia berlanjut lebih dari 3 bulan"
        ]
    };
    
    return recommendations[type] || recommendations.bear;
}

function getCharacteristics(type) {
    const characteristics = {
        lion: [
            "Bangun sangat pagi (05:00-06:00) tanpa alarm",
            "Energi puncak di pagi hari, produktif sebelum siang",
            "Cenderung mengantuk di sore hari dan tidur lebih awal",
            "Termasuk 15-20% populasi",
            "Sering menjadi pemimpin yang terorganisir dan berorientasi pada tujuan"
        ],
        bear: [
            "Mengikuti ritme matahari secara alami",
            "Bangun sekitar jam 07:00-07:30, tidur sekitar 22:30-23:00",
            "Energi stabil sepanjang hari dengan puncak di siang hari",
            "Tipe paling umum, mencakup sekitar 50% populasi",
            "Mudah beradaptasi dengan jadwal kerja standar 9-to-5"
        ],
        wolf: [
            "Sulit bangun pagi, lebih suka tidur hingga siang",
            "Energi puncak di sore hingga malam hari (17:00-midnight)",
            "Lebih kreatif dan produktif di malam hari",
            "Termasuk 15-20% populasi",
            "Cenderung introvert dan sangat kreatif"
        ],
        dolphin: [
            "Tidur ringan dan mudah terbangun di tengah malam",
            "Sering mengalami insomnia dan sulit memulai tidur",
            "Energi tidak konsisten, kadang lelah sepanjang hari",
            "Termasuk 10% populasi dengan tipe chronotype paling jarang",
            "Sangat perfeksionis, cerdas, dan sering cemas tentang kualitas tidur"
        ]
    };
    
    return characteristics[type] || characteristics.bear;
}

function getOptimalSchedule(type) {
    const schedules = {
        lion: {
            bedtime: "21:00 - 22:00",
            wakeTime: "05:00 - 06:00",
            napTime: "Tidak disarankan",
            studyTime: "06:00 - 12:00",
            exerciseTime: "06:00 - 08:00"
        },
        bear: {
            bedtime: "22:30 - 23:00",
            wakeTime: "07:00 - 07:30",
            napTime: "14:00 - 14:30 (20-30 menit)",
            studyTime: "10:00 - 14:00",
            exerciseTime: "12:00 - 18:00"
        },
        wolf: {
            bedtime: "23:30 - 00:30",
            wakeTime: "07:30 - 09:00",
            napTime: "13:00 - 13:30 (jika perlu)",
            studyTime: "17:00 - 23:00",
            exerciseTime: "18:00 - 20:00"
        },
        dolphin: {
            bedtime: "23:30 - 00:00",
            wakeTime: "06:00 - 06:30",
            napTime: "Hindari tidur siang",
            studyTime: "Sesuaikan dengan energi (fluktuatif)",
            exerciseTime: "07:30 - 08:30 atau 17:30 - 18:30"
        }
    };
    
    return schedules[type] || schedules.bear;
}

function showTestResults() {
    document.getElementById('testIntro').style.display = 'none';
    document.getElementById('testQuestions').style.display = 'none';
    document.getElementById('testResults').style.display = 'block';
    
    const typeNames = {
        lion: "Lion (Singa)",
        bear: "Bear (Beruang)",
        wolf: "Wolf (Serigala)",
        dolphin: "Dolphin (Lumba-lumba)"
    };
    
    const typeDescriptions = {
        lion: "Anda adalah tipe Lion - bangun sangat pagi dan paling produktif di jam-jam awal. Anda adalah pemimpin alami yang terorganisir.",
        bear: "Anda adalah tipe Bear - mengikuti ritme matahari secara alami. Ini adalah chronotype paling umum yang mudah beradaptasi.",
        wolf: "Anda adalah tipe Wolf - lebih aktif dan kreatif di malam hari. Anda cenderung introvert dengan kreativitas tinggi.",
        dolphin: "Anda adalah tipe Dolphin - tidur ringan dengan kecenderungan insomnia. Anda perfeksionis dan sangat cerdas."
    };
    
    const typeIcons = {
        lion: '<i class="fas fa-sun fa-4x text-warning"></i>',
        bear: '<i class="fas fa-mountain fa-4x text-success"></i>',
        wolf: '<i class="fas fa-moon fa-4x text-primary"></i>',
        dolphin: '<i class="fas fa-fish fa-4x text-info"></i>'
    };
    
    // Update result display
    document.getElementById('resultIcon').innerHTML = typeIcons[testResult.primaryType];
    document.getElementById('resultTitle').textContent = typeNames[testResult.primaryType];
    document.getElementById('resultSubtitle').textContent = typeDescriptions[testResult.primaryType];
    
    // Update characteristics
    const characteristicsList = document.getElementById('characteristics');
    characteristicsList.innerHTML = testResult.characteristics.map(char => 
        `<li class="mb-2"><i class="fas fa-check text-success me-2"></i>${char}</li>`
    ).join('');
    
    // Update recommendations
    const recommendationsList = document.getElementById('recommendations');
    recommendationsList.innerHTML = testResult.recommendations.map(rec => 
        `<li class="mb-2"><i class="fas fa-lightbulb text-warning me-2"></i>${rec}</li>`
    ).join('');
    
    // Update optimal schedule
    document.getElementById('idealBedtime').textContent = testResult.optimalSchedule.bedtime;
    document.getElementById('idealWakeTime').textContent = testResult.optimalSchedule.wakeTime;
}

function retakeTest() {
    if (confirm('Apakah Anda yakin ingin mengulang tes? Hasil sebelumnya akan dihapus.')) {
        localStorage.removeItem('sleepsync_test_result');
        testResult = null;
        currentQuestionIndex = 0;
        testAnswers = [];
        
        document.getElementById('testResults').style.display = 'none';
        document.getElementById('testIntro').style.display = 'block';
        
        showNotification('Tes direset. Anda dapat memulai kembali.', 'info');
    }
}

function saveResults() {
    if (testResult) {
        // Mark test as completed in user profile
        const user = JSON.parse(localStorage.getItem('sleepsync_user') || '{}');
        user.sleepTestCompleted = true;
        user.sleepType = testResult.primaryType;
        localStorage.setItem('sleepsync_user', JSON.stringify(user));
        
        showNotification('Hasil tes berhasil disimpan!', 'success');
        
        // Redirect to CBT program after 2 seconds
        setTimeout(() => {
            window.location.href = 'cbt-program.html';
        }, 2000);
    }
}

// Export functions
window.startTest = startTest;
window.nextQuestion = nextQuestion;
window.previousQuestion = previousQuestion;
window.retakeTest = retakeTest;
window.saveResults = saveResults;