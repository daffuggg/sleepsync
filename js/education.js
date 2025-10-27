// ===== EDUCATION FUNCTIONALITY =====

let educationData = {
    articles: [],
    categories: ['all', 'psychology', 'tips', 'health', 'research'],
    currentFilter: 'all',
    bookmarkedArticles: [],
    readArticles: []
};

// Initialize education page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('education.html')) {
        initializeEducation();
    }
});

function initializeEducation() {
    loadEducationData();
    setupEducationEventListeners();
    loadBookmarkedArticles();
    loadReadArticles();
    displayArticles();
    updateQuickTips();
}

function loadEducationData() {
    educationData.articles = [
        {
            id: 'featured',
            title: 'Mengapa Mahasiswa Sulit Tidur? Analisis Psikologi',
            category: 'psychology',
            excerpt: 'Penelitian menunjukkan 70% mahasiswa mengalami gangguan tidur. Artikel ini membahas faktor psikologi yang mempengaruhi pola tidur mahasiswa dan solusi berbasis CBT-I.',
            readTime: 5,
            views: 1234,
            likes: 89,
            author: 'Dr. Sarah Psikolog',
            publishDate: '2025-01-10',
            featured: true,
            content: generateArticleContent('featured')
        },
        {
            id: 'stress-sleep',
            title: 'Hubungan Stress dan Kualitas Tidur',
            category: 'psychology',
            excerpt: 'Bagaimana stress akademik mempengaruhi siklus tidur dan cara mengatasinya dengan pendekatan psikologi positif.',
            readTime: 3,
            views: 856,
            likes: 67,
            author: 'Prof. Ahmad Wijaya',
            publishDate: '2025-01-08',
            content: generateArticleContent('stress-sleep')
        },
        {
            id: 'relaxation-techniques',
            title: '5 Teknik Relaksasi Sebelum Tidur',
            category: 'tips',
            excerpt: 'Panduan langkah demi langkah teknik pernapasan dan meditasi yang terbukti efektif untuk mempersiapkan tidur.',
            readTime: 4,
            views: 1205,
            likes: 156,
            author: 'Maya Wellness Coach',
            publishDate: '2025-01-05',
            content: generateArticleContent('relaxation-techniques')
        },
        {
            id: 'sleep-immunity',
            title: 'Dampak Kurang Tidur pada Sistem Imun',
            category: 'health',
            excerpt: 'Penelitian terbaru mengenai hubungan antara durasi tidur, kualitas tidur, dan daya tahan tubuh mahasiswa.',
            readTime: 6,
            views: 743,
            likes: 203,
            author: 'Dr. Budi Kesehatan',
            publishDate: '2025-01-03',
            content: generateArticleContent('sleep-immunity')
        },
        {
            id: 'blue-light',
            title: 'Mengatasi Blue Light dari Gadget',
            category: 'tips',
            excerpt: 'Cara praktis mengurangi paparan cahaya biru dari smartphone dan laptop yang mengganggu produksi melatonin.',
            readTime: 2,
            views: 1456,
            likes: 178,
            author: 'Tech Sleep Expert',
            publishDate: '2025-01-01',
            content: generateArticleContent('blue-light')
        },
        {
            id: 'circadian-productivity',
            title: 'Siklus Circadian dan Produktivitas',
            category: 'research',
            excerpt: 'Studi terbaru tentang bagaimana jam biologis mempengaruhi performa akademik dan cara mengoptimalkannya.',
            readTime: 7,
            views: 634,
            likes: 94,
            author: 'Research Team UI',
            publishDate: '2024-12-28',
            content: generateArticleContent('circadian-productivity')
        },
        {
            id: 'anxiety-sleep',
            title: 'Anxiety dan Sleep Disorder',
            category: 'psychology',
            excerpt: 'Memahami hubungan dua arah antara kecemasan dan gangguan tidur, serta strategi CBT untuk mengatasinya.',
            readTime: 5,
            views: 892,
            likes: 267,
            author: 'Dr. Lisa Therapist',
            publishDate: '2024-12-25',
            content: generateArticleContent('anxiety-sleep')
        },
        {
            id: 'sleep-nutrition',
            title: 'Makanan yang Membantu Tidur Nyenyak',
            category: 'health',
            excerpt: 'Daftar makanan dan minuman yang dapat meningkatkan kualitas tidur berdasarkan penelitian nutrisi.',
            readTime: 4,
            views: 567,
            likes: 123,
            author: 'Nutritionist Pro',
            publishDate: '2024-12-20',
            content: generateArticleContent('sleep-nutrition')
        }
    ];
}

function setupEducationEventListeners() {
    // Category filter buttons
    const filterButtons = document.querySelectorAll('[data-category]');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterArticles(category);
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('articleSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchArticles(this.value);
        });
    }
    
    // Load more button
    const loadMoreBtn = document.querySelector('[onclick="loadMoreArticles()"]');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreArticles);
    }
}

function loadBookmarkedArticles() {
    const saved = localStorage.getItem('sleepsync_bookmarked_articles');
    if (saved) {
        educationData.bookmarkedArticles = JSON.parse(saved);
    }
}

function saveBookmarkedArticles() {
    localStorage.setItem('sleepsync_bookmarked_articles', JSON.stringify(educationData.bookmarkedArticles));
}

function loadReadArticles() {
    const saved = localStorage.getItem('sleepsync_read_articles');
    if (saved) {
        educationData.readArticles = JSON.parse(saved);
    }
}

function saveReadArticles() {
    localStorage.setItem('sleepsync_read_articles', JSON.stringify(educationData.readArticles));
}

function displayArticles() {
    const container = document.getElementById('articlesContainer');
    if (!container) return;
    
    // Clear existing articles (except featured)
    const existingCards = container.querySelectorAll('.article-card:not(.featured-article)');
    existingCards.forEach(card => card.remove());
    
    const filteredArticles = educationData.articles.filter(article => 
        !article.featured && (educationData.currentFilter === 'all' || article.category === educationData.currentFilter)
    );
    
    filteredArticles.forEach((article, index) => {
        const articleCard = createArticleCard(article);
        articleCard.style.animationDelay = `${index * 0.1}s`;
        container.appendChild(articleCard);
    });
    
    // Add animation class
    setTimeout(() => {
        const cards = container.querySelectorAll('.article-card:not(.featured-article)');
        cards.forEach(card => card.classList.add('fade-in-up'));
    }, 50);
}

function createArticleCard(article) {
    const card = document.createElement('div');
    card.className = 'col-lg-4 col-md-6 article-card';
    card.setAttribute('data-category', article.category);
    
    const categoryColors = {
        psychology: 'info',
        tips: 'warning',
        health: 'danger',
        research: 'primary'
    };
    
    const categoryIcons = {
        psychology: 'brain',
        tips: 'lightbulb',
        health: 'heart',
        research: 'microscope'
    };
    
    const isBookmarked = educationData.bookmarkedArticles.includes(article.id);
    const isRead = educationData.readArticles.includes(article.id);
    
    card.innerHTML = `
        <div class="card h-100 ${isRead ? 'read-article' : ''}" style="background-color: #32373dff;">
            <div class="card-body">
                <div class="article-icon mb-3">
                    <i class="fas fa-${categoryIcons[article.category]} fa-3x text-${categoryColors[article.category]}"></i>
                </div>
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <span class="badge bg-${categoryColors[article.category]} mb-2">${getCategoryName(article.category)}</span>
                    <button class="btn btn-sm btn-link p-0 bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
                            onclick="toggleBookmark('${article.id}')">
                        <i class="fas fa-bookmark ${isBookmarked ? 'text-warning' : 'text-muted'}"></i>
                    </button>
                </div>
                <h5 class="fw-bold mb-3">${article.title}</h5>
                <p class="text-muted mb-3">${article.excerpt}</p>
                <div class="article-meta mb-3">
                    <small class="text-muted">
                        <i class="fas fa-clock me-1"></i>${article.readTime} min
                        <i class="fas fa-heart ms-3 me-1"></i>${article.likes} likes
                        <i class="fas fa-eye ms-3 me-1"></i>${article.views} views
                    </small>
                </div>
                <div class="article-author mb-3">
                    <small class="text-muted">
                        <i class="fas fa-user me-1"></i>Oleh ${article.author}
                        <span class="ms-2">${formatDate(article.publishDate)}</span>
                    </small>
                </div>
                <button class="btn btn-outline-${categoryColors[article.category]} btn-sm w-100" 
                        onclick="readArticle('${article.id}')">
                    <i class="fas fa-book-open me-2"></i>Baca Artikel
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function filterArticles(category) {
    educationData.currentFilter = category;
    
    // Update active button
    const buttons = document.querySelectorAll('[data-category]');
    buttons.forEach(btn => {
        btn.classList.remove('active', 'btn-primary');
        btn.classList.add('btn-outline-primary');
    });
    
    const activeButton = document.querySelector(`[data-category="${category}"]`);
    if (activeButton) {
        activeButton.classList.remove('btn-outline-primary');
        activeButton.classList.add('active', 'btn-primary');
    }
    
    // Re-display articles with filter
    displayArticles();
    
    // Show notification
    const categoryNames = {
        'all': 'Semua Artikel',
        'psychology': 'Artikel Psikologi',
        'tips': 'Tips Praktis',
        'health': 'Artikel Kesehatan',
        'research': 'Artikel Riset'
    };
    
    showNotification(`Menampilkan: ${categoryNames[category]}`, 'info');
}

function searchArticles(query) {
    if (!query.trim()) {
        displayArticles();
        return;
    }
    
    const searchResults = educationData.articles.filter(article => 
        !article.featured && (
            article.title.toLowerCase().includes(query.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(query.toLowerCase()) ||
            article.author.toLowerCase().includes(query.toLowerCase())
        )
    );
    
    const container = document.getElementById('articlesContainer');
    if (!container) return;
    
    // Clear existing articles
    const existingCards = container.querySelectorAll('.article-card:not(.featured-article)');
    existingCards.forEach(card => card.remove());
    
    if (searchResults.length === 0) {
        container.innerHTML += `
            <div class="col-12 text-center search-no-results">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h5>Tidak ada artikel yang ditemukan</h5>
                <p class="text-muted">Coba gunakan kata kunci yang berbeda</p>
            </div>
        `;
        return;
    }
    
    searchResults.forEach(article => {
        const articleCard = createArticleCard(article);
        container.appendChild(articleCard);
    });
    
    showNotification(`Ditemukan ${searchResults.length} artikel`, 'success');
}

function readArticle(articleId) {
    const article = educationData.articles.find(a => a.id === articleId);
    if (!article) return;
    
    // Update view count
    article.views++;
    
    // Mark as read
    if (!educationData.readArticles.includes(articleId)) {
        educationData.readArticles.push(articleId);
        saveReadArticles();
    }
    
    // Show article in modal
    showArticleModal(article);
    
    // Track reading analytics
    trackArticleRead(articleId);
}

function showArticleModal(article) {
    const modal = document.getElementById('articleModal');
    if (!modal) return;
    
    const title = modal.querySelector('#articleTitle');
    const content = modal.querySelector('#articleContent');
    
    title.textContent = article.title;
    content.innerHTML = `
        <div class="article-header mb-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="badge bg-primary">${getCategoryName(article.category)}</span>
                <div class="article-meta">
                    <small>
                        <i class="fas fa-clock me-1"></i>${article.readTime} min read
                        <i class="fas fa-eye ms-3 me-1"></i>${article.views} views
                    </small>
                </div>
            </div>
            <div class="author-info">
                <small>
                    <i class="fas fa-user me-1"></i>Oleh ${article.author} • ${formatDate(article.publishDate)}
                </small>
            </div>
        </div>
        <div class="article-content">
            ${article.content}
        </div>
        <div class="article-footer mt-4 pt-4 border-top">
            <div class="d-flex justify-content-between align-items-center">
                <div class="article-actions">
                    <button class="btn btn-outline-danger btn-sm me-2" onclick="likeArticle('${article.id}')">
                        <i class="fas fa-heart me-1"></i>${article.likes}
                    </button>
                    <button class="btn btn-outline-primary btn-sm" onclick="shareArticle('${article.id}')">
                        <i class="fas fa-share me-1"></i>Bagikan
                    </button>
                </div>
                <div class="reading-progress">
                    <small class="text-success">
                        <i class="fas fa-check-circle me-1"></i>Artikel selesai dibaca
                    </small>
                </div>
            </div>
        </div>
    `;
    
    // Show modal
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
    
    // Update bookmark button in modal
    const bookmarkBtn = modal.querySelector('[onclick*="bookmarkArticle"]');
    if (bookmarkBtn) {
        bookmarkBtn.onclick = () => toggleBookmark(article.id);
        updateBookmarkButton(bookmarkBtn, article.id);
    }
}

function generateArticleContent(articleId) {
    // Artikel untuk anxiety-sleep
    if (articleId === 'anxiety-sleep') {
        return `
            <div class="article-content">
                <h3 class="fw-bold mb-4">Hubungan Dua Arah: Kecemasan dan Gangguan Tidur</h3>
                
                <div class="article-image mb-4 text-center">
                    <i class="fas fa-brain fa-4x text-info mb-3"></i>
                    <p class="text-muted small">Visualisasi hubungan antara kecemasan dan kualitas tidur</p>
                </div>
                
                <p>Kecemasan dan gangguan tidur adalah dua masalah yang saling berkaitan erat dalam sebuah hubungan dua arah yang kompleks. Ketika seseorang mengalami kecemasan, pikiran yang dipenuhi kekhawatiran sering membuat sulit untuk tertidur atau tetap tidur. Di sisi lain, kurangnya tidur berkualitas justru memperkuat gejala kecemasan, menciptakan siklus negatif yang sulit diputus.</p>

                <blockquote class="blockquote border-start ps-4 py-2 my-4">
                    <p class="mb-0">"Hubungan antara tidur dan kesehatan mental bagaikan dua sisi mata uang yang tidak dapat dipisahkan."</p>
                    <footer class="blockquote-footer mt-2">Dr. Matthew Walker, <cite>Neuroscientist & Peneliti Tidur</cite></footer>
                </blockquote>

                <h4 class="fw-bold mb-3">Bukti Ilmiah yang Menghubungkan Keduanya</h4>
                
                <p>Meta-analisis terbaru dari <em>Nature: npj Digital Medicine</em> (2023) mengungkap temuan penting: insomnia berhubungan langsung dengan peningkatan tingkat kecemasan dan depresi. Yang lebih menarik, penelitian tersebut juga menunjukkan bahwa ketika masalah tidur ditangani dengan tepat, gejala kecemasan juga mengalami penurunan signifikan—bukti kuat bahwa keduanya memang saling mempengaruhi.</p>
                
                <div class="alert alert-info my-4">
                    <div class="d-flex">
                        <div class="me-3">
                            <i class="fas fa-info-circle fa-2x"></i>
                        </div>
                        <div>
                            <h5 class="alert-heading">Tahukah Anda?</h5>
                            <p class="mb-0">Lebih dari 40% orang dengan gangguan kecemasan juga mengalami masalah tidur, sementara 50% penderita insomnia kronis memiliki gejala kecemasan yang signifikan.</p>
                        </div>
                    </div>
                </div>

                <h4 class="fw-bold mb-3">CBT-I: Solusi Berbasis Bukti</h4>
                
                <p>Cognitive Behavioral Therapy for Insomnia (CBT-I) telah terbukti menjadi salah satu pendekatan paling efektif untuk memutus siklus negatif antara kecemasan dan gangguan tidur. Berbeda dari pendekatan obat-obatan, CBT-I berfokus pada:</p>
                
                <div class="row mb-4 anxiety-sleep-cards">
                    <div class="col-md-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <h6 class="card-title">
                                    <i class="fas fa-brain text-primary me-2"></i>Aspek Kognitif
                                </h6>
                                <ul class="list-unstyled">
                                    <li><i class="fas fa-check text-success me-2"></i>Mengidentifikasi pikiran negatif tentang tidur</li>
                                    <li><i class="fas fa-check text-success me-2"></i>Menantang keyakinan yang tidak realistis</li>
                                    <li><i class="fas fa-check text-success me-2"></i>Mengembangkan pola pikir yang lebih sehat</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <h6 class="card-title">
                                    <i class="fas fa-bed text-info me-2"></i>Aspek Perilaku
                                </h6>
                                <ul class="list-unstyled">
                                    <li><i class="fas fa-check text-success me-2"></i>Membangun rutinitas tidur yang konsisten</li>
                                    <li><i class="fas fa-check text-success me-2"></i>Teknik relaksasi dan manajemen stres</li>
                                    <li><i class="fas fa-check text-success me-2"></i>Kontrol stimulus untuk memperkuat asosiasi positif</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <p>Yang membuat CBT-I istimewa adalah kemampuannya untuk memperbaiki kualitas tidur sekaligus mengurangi kecemasan. Ini bukan hanya mengatasi gejala, tapi juga mengubah pola pikir dan kebiasaan yang menjadi akar masalah.</p>

                <h4 class="fw-bold mb-3">Kemajuan Teknologi: CBT-I Digital</h4>
                
                <p>Seiring dengan perkembangan teknologi, CBT-I kini hadir dalam format digital yang lebih mudah diakses. Platform online dan aplikasi mobile memungkinkan pengguna menjalani terapi kapan saja dan di mana saja, tanpa batasan geografis atau jadwal yang kaku. Studi terkini menunjukkan efektivitas yang setara antara CBT-I digital dengan terapi tatap muka konvensional.</p>
                
                <div class="text-center my-4">
                    <div class="row justify-content-center">
                        <div class="col-md-8">
                            <div class="progress mb-2" style="height: 25px;">
                                <div class="progress-bar bg-success" role="progressbar" style="width: 85%;">85%</div>
                            </div>
                            <p class="text-muted small">Tingkat keberhasilan CBT-I dalam memperbaiki kualitas tidur dan mengurangi kecemasan</p>
                        </div>
                    </div>
                </div>

                <h4 class="fw-bold mb-3">Strategi Praktis untuk Mahasiswa</h4>
                
                <p>Bagi mahasiswa yang sering mengalami kecemasan dan gangguan tidur, beberapa strategi berikut dapat diterapkan:</p>
                
                <ol>
                    <li><strong>Jadwal yang konsisten</strong> - Tidur dan bangun pada waktu yang sama setiap hari, bahkan di akhir pekan</li>
                    <li><strong>Lingkungan tidur optimal</strong> - Suhu ruangan sejuk (18-22°C), minim cahaya dan suara</li>
                    <li><strong>Digital detox</strong> - Hindari layar setidaknya 1 jam sebelum tidur</li>
                    <li><strong>Teknik relaksasi</strong> - Coba pernapasan dalam, meditasi, atau progressive muscle relaxation</li>
                    <li><strong>Batasi kafein dan alkohol</strong> - Terutama 4-6 jam sebelum waktu tidur</li>
                </ol>

                <h4 class="fw-bold mb-3">Kesimpulan</h4>
                
                <p>Hubungan antara kecemasan dan gangguan tidur tidak dapat dipandang sebagai dua masalah terpisah. Dengan pendekatan holistik seperti CBT-I yang menangani kedua aspek tersebut, siklus negatif dapat diputus. Tidur yang berkualitas bukan hanya memulihkan tubuh secara fisik, tetapi juga menjadi fondasi penting untuk kesehatan mental yang optimal.</p>
                
                <div class="alert alert-primary mt-4">
                    <div class="d-flex">
                        <div class="me-3">
                            <i class="fas fa-lightbulb fa-2x"></i>
                        </div>
                        <div>
                            <h5 class="alert-heading">Tertarik mencoba?</h5>
                            <p class="mb-0">Mulai langkah pertama untuk mengatasi kecemasan dan memperbaiki tidur Anda melalui <a href="cbt-program.html" class="alert-link">Program CBT-I 7 Hari</a> yang disediakan SleepSync.</p>
                        </div>
                    </div>
                </div>

                <div class="article-sources mt-5">
                    <h6 class="fw-bold">Sumber Referensi:</h6>
                    <ul class="small">
                        <li>Yeung W-F, Chung K-F, Ho FYY, et al. (2023). Effects of digital cognitive behavioral therapy for insomnia on depression and anxiety: a systematic review and meta-analysis. npj Digital Medicine, 6:53</li>
                        <li>American Academy of Sleep Medicine. (2021). Insomnia and anxiety: Understanding the connection.</li>
                        <li>Walker, M. (2018). Why We Sleep: Unlocking the Power of Sleep and Dreams. Scribner Book Company.</li>
                    </ul>
                </div>
            </div>
        `;
    }
    
    // Artikel untuk featured
    else if (articleId === 'featured') {
        return `
            <div class="article-content">
                <h3 class="fw-bold mb-4">Mengapa Mahasiswa Sulit Tidur? Analisis Psikologi</h3>
                
                <div class="article-image mb-4 text-center">
                    <i class="fas fa-university fa-4x text-primary mb-3"></i>
                    <p class="text-muted small">Studi menunjukkan 70% mahasiswa mengalami gangguan pola tidur</p>
                </div>
                
                <p>Kehidupan mahasiswa identik dengan begadang, baik untuk menyelesaikan tugas-tugas kuliah, aktivitas sosial, maupun hiburan digital yang tidak ada habisnya. Hasil riset dari Sleep Foundation menunjukkan bahwa 70% mahasiswa mengalami kualitas tidur yang buruk, jauh di atas rata-rata populasi umum. Namun, apa sebenarnya yang menyebabkan mahasiswa begitu rentan mengalami gangguan tidur?</p>

                <h4 class="fw-bold mb-3">Faktor Psikologis di Balik Gangguan Tidur Mahasiswa</h4>
                
                <p>Dari perspektif psikologi, terdapat beberapa faktor utama yang berkontribusi pada gangguan tidur di kalangan mahasiswa:</p>
                
                <div class="row mb-4">
                    <div class="col-md-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <h6 class="card-title text-primary">
                                    <i class="fas fa-brain me-2"></i>Beban Kognitif Berlebih
                                </h6>
                                <p>Otak mahasiswa terus menerus memproses informasi akademis yang kompleks. Ketika mencoba tidur, pikiran sering "racing" memikirkan berbagai tugas dan tanggung jawab yang harus dikelola.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <h6 class="card-title text-danger">
                                    <i class="fas fa-exclamation-circle me-2"></i>Stres & Kecemasan
                                </h6>
                                <p>Tuntutan akademis, masalah keuangan, dan tekanan sosial memicu sistem saraf simpatis yang menghasilkan hormon stres kortisol—menjadikan tubuh dalam mode "fight or flight".</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="row mb-4">
                    <div class="col-md-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <h6 class="card-title text-warning">
                                    <i class="fas fa-clock me-2"></i>Ritme Sirkadian Terganggu
                                </h6>
                                <p>Jadwal kuliah yang tidak konsisten, begadang, dan penggunaan cahaya biru dari gadget mengganggu produksi melatonin, hormon pengatur tidur alami tubuh.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <h6 class="card-title text-info">
                                    <i class="fas fa-coffee me-2"></i>Gaya Hidup Tidak Sehat
                                </h6>
                                <p>Konsumsi kafein berlebihan, kurangnya aktivitas fisik, dan pola makan tidak teratur secara langsung memengaruhi kualitas tidur mahasiswa.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <h4 class="fw-bold mb-3">Dampak Kurang Tidur pada Performa Akademik</h4>
                
                <p>Penelitian dari American Academy of Sleep Medicine menunjukkan bahwa mahasiswa yang tidur kurang dari 6 jam per malam memiliki IPK rata-rata 0,5 poin lebih rendah dibandingkan mereka yang tidur 8 jam. Kurang tidur secara signifikan menurunkan:</p>
                
                <ul>
                    <li><strong>Fungsi kognitif</strong> - Kemampuan berpikir kritis dan pemecahan masalah menurun hingga 30%</li>
                    <li><strong>Memori dan konsolidasi pengetahuan</strong> - Fase tidur REM memainkan peran kunci dalam menyimpan informasi baru</li>
                    <li><strong>Konsentrasi</strong> - Mahasiswa dengan gangguan tidur 3x lebih mudah teralihkan perhatiannya</li>
                    <li><strong>Regulasi emosi</strong> - Meningkatkan risiko depresi dan kecemasan hingga 40%</li>
                </ul>

                <div class="alert alert-warning my-4">
                    <div class="d-flex">
                        <div class="me-3">
                            <i class="fas fa-lightbulb fa-2x"></i>
                        </div>
                        <div>
                            <h5 class="alert-heading">Fakta Penting!</h5>
                            <p class="mb-0">Satu malam kurang tidur setara dengan fungsi kognitif seseorang yang memiliki kadar alkohol darah 0,08%—di atas batas legal untuk mengemudi di kebanyakan negara!</p>
                        </div>
                    </div>
                </div>

                <h4 class="fw-bold mb-3">Solusi Berbasis CBT-I (Cognitive Behavioral Therapy for Insomnia)</h4>
                
                <p>CBT-I telah terbukti sebagai solusi efektif untuk mengatasi gangguan tidur, dengan tingkat keberhasilan mencapai 80% pada mahasiswa. Program ini fokus pada:</p>

                <div class="row mb-4">
                    <div class="col-lg-6">
                        <ol>
                            <li><strong>Kontrol Stimulus</strong> - Memperkuat asosiasi antara tempat tidur dengan tidur</li>
                            <li><strong>Pembatasan Tidur</strong> - Meningkatkan "tekanan tidur" untuk memperbaiki kualitas tidur</li>
                            <li><strong>Higiene Tidur</strong> - Mengoptimalkan lingkungan dan kebiasaan untuk tidur berkualitas</li>
                        </ol>
                    </div>
                    <div class="col-lg-6">
                        <ol start="4">
                            <li><strong>Restrukturisasi Kognitif</strong> - Mengubah pikiran tidak produktif tentang tidur</li>
                            <li><strong>Relaksasi</strong> - Teknik menenangkan tubuh dan pikiran sebelum tidur</li>
                            <li><strong>Pengendalian Ritme Sirkadian</strong> - Menstabilkan jam biologis tubuh</li>
                        </ol>
                    </div>
                </div>

                <h4 class="fw-bold mb-3">Kesimpulan dan Langkah Selanjutnya</h4>
                
                <p>Masalah tidur di kalangan mahasiswa bukan hanya soal kebiasaan buruk, tetapi melibatkan interaksi kompleks antara faktor psikologis, fisiologis, dan lingkungan. Dengan pendekatan berbasis CBT-I yang terbukti secara ilmiah, mahasiswa dapat secara sistematis memperbaiki kualitas tidur mereka dan pada gilirannya, meningkatkan performa akademik dan kesejahteraan mental.</p>
                
                <div class="alert alert-primary mt-4">
                    <div class="d-flex">
                        <div class="me-3">
                            <i class="fas fa-info-circle fa-2x"></i>
                        </div>
                        <div>
                            <h5 class="alert-heading">Mulai Perjalanan Tidur Berkualitasmu!</h5>
                            <p class="mb-0">SleepSync menawarkan <a href="cbt-program.html" class="alert-link">Program CBT-I 7 Hari</a> yang dirancang khusus untuk mahasiswa. Mulailah hari ini dan rasakan perbedaannya dalam seminggu!</p>
                        </div>
                    </div>
                </div>

                <div class="article-sources mt-5">
                    <h6 class="fw-bold">Sumber Referensi:</h6>
                    <ul class="small">
                        <li>Sleep Foundation. (2022). College Students and Sleep.</li>
                        <li>American Academy of Sleep Medicine. (2021). Sleep and Academic Performance.</li>
                        <li>Journal of Clinical Sleep Medicine. (2023). Efficacy of CBT-I in University Students.</li>
                    </ul>
                </div>
            </div>
        `;
    }
    
    // Artikel untuk stress-sleep
    else if (articleId === 'stress-sleep') {
        return `
            <div class="article-content">
                <h3 class="fw-bold mb-4">Hubungan Stress dan Kualitas Tidur</h3>
                
                <div class="article-image mb-4 text-center">
                    <i class="fas fa-wind fa-4x text-info mb-3"></i>
                    <p class="text-muted small">Dampak stress akademik terhadap siklus tidur mahasiswa</p>
                </div>
                
                <p>Stress dan tidur memiliki hubungan timbal balik yang sangat erat. Di satu sisi, tingkat stress yang tinggi dapat menyebabkan kesulitan tidur. Di sisi lain, kurang tidur membuat kita lebih rentan terhadap stress. Bagi mahasiswa, siklus negatif ini sering terjadi, terutama selama periode ujian atau deadline tugas.</p>

                <blockquote class="blockquote border-start ps-4 py-2 my-4">
                    <p class="mb-0">"Tidur adalah mekanisme pemulihan alami tubuh terhadap stress. Saat kita mengganggu tidur, kita mengganggu kemampuan tubuh untuk pulih."</p>
                    <footer class="blockquote-footer mt-2">Prof. Robert Sapolsky, <cite>Stanford University</cite></footer>
                </blockquote>

                <h4 class="fw-bold mb-3">Mekanisme Biologis Stress dan Tidur</h4>
                
                <p>Saat mengalami stress, tubuh kita memproduksi kortisol—hormon stress yang mempertahankan kewaspadaan dan fokus. Namun, level kortisol yang tinggi di malam hari menghambat pelepasan melatonin, hormon yang membantu mengatur siklus tidur-bangun. Riset menunjukkan bahwa mahasiswa dengan tingkat kortisol tinggi di malam hari mengalami:</p>
                
                <ul>
                    <li>Kesulitan untuk jatuh tertidur (insomnia onset)</li>
                    <li>Tidur yang terputus-putus (insomnia maintenance)</li>
                    <li>Bangun terlalu dini dan tidak bisa tidur kembali</li>
                    <li>Pengurangan fase tidur REM yang penting untuk konsolidasi memori</li>
                </ul>

                <div class="alert alert-info my-4">
                    <div class="d-flex">
                        <div class="me-3">
                            <i class="fas fa-chart-line fa-2x"></i>
                        </div>
                        <div>
                            <h5 class="alert-heading">Statistik Penting</h5>
                            <p class="mb-0">Studi pada 1,200 mahasiswa menunjukkan 68% mengalami gangguan tidur selama periode ujian, dengan peningkatan level kortisol hingga 45% dibandingkan periode normal.</p>
                        </div>
                    </div>
                </div>

                <h4 class="fw-bold mb-3">Dampak Stress Akademik pada Pola Tidur</h4>
                
                <p>Stress akademik memiliki beberapa karakteristik unik yang mempengaruhi tidur:</p>
                
                <div class="row mb-4">
                    <div class="col-md-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <h6 class="card-title text-danger">
                                    <i class="fas fa-exclamation-triangle me-2"></i>Pikiran Berputar
                                </h6>
                                <p>Kekhawatiran tentang deadline, tugas, dan ujian membuat otak tetap aktif ketika seharusnya mulai merileks, membuat kesulitan untuk tertidur.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <h6 class="card-title text-warning">
                                    <i class="fas fa-mug-hot me-2"></i>Penggunaan Stimulan
                                </h6>
                                <p>Mahasiswa sering mengonsumsi kafein dan stimulan lainnya untuk tetap terjaga, yang mengganggu ritme sirkadian dan kualitas tidur.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <p>Penelitian juga menunjukkan bahwa mahasiswa dengan tingkat stress akademik tinggi mengalami pengurangan total waktu tidur rata-rata 1,2 jam per malam. Hal ini berdampak signifikan pada:</p>
                
                <div class="row mb-4">
                    <div class="col-lg-4">
                        <div class="text-center p-3 bg-light rounded">
                            <i class="fas fa-brain fa-2x text-primary mb-3"></i>
                            <h6>Fungsi Kognitif</h6>
                            <p class="small text-muted">Penurunan kemampuan konsentrasi, memori, dan pemecahan masalah hingga 40%</p>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="text-center p-3 bg-light rounded">
                            <i class="fas fa-heartbeat fa-2x text-danger mb-3"></i>
                            <h6>Kesehatan Fisik</h6>
                            <p class="small text-muted">Penurunan imunitas dan peningkatan risiko penyakit metabolik</p>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="text-center p-3 bg-light rounded">
                            <i class="fas fa-smile fa-2x text-warning mb-3"></i>
                            <h6>Kesehatan Mental</h6>
                            <p class="small text-muted">Peningkatan risiko depresi dan kecemasan sebesar 2-3 kali lipat</p>
                        </div>
                    </div>
                </div>

                <h4 class="fw-bold mb-3">Pendekatan Psikologi Positif untuk Mengatasi Stress dan Memperbaiki Tidur</h4>
                
                <p>Psikologi positif menawarkan perspektif baru dalam mengatasi stress dan gangguan tidur, dengan fokus pada peningkatan kesejahteraan daripada sekadar mengurangi gejala. Beberapa strategi berbasis bukti ilmiah meliputi:</p>
                
                <ol>
                    <li><strong>Praktik Kebersyukuran</strong> - Menulis jurnal kebersyukuran sebelum tidur menurunkan waktu untuk tertidur hingga 15 menit dan meningkatkan kualitas tidur.</li>
                    <li><strong>Meditasi Mindfulness</strong> - 10 menit meditasi sebelum tidur secara signifikan mengurangi aktivitas pikiran berlebihan.</li>
                    <li><strong>Reframing Kognitif</strong> - Mengubah perspektif "Saya harus sempurna" menjadi "Saya melakukan yang terbaik" menurunkan tingkat kortisol.</li>
                    <li><strong>Aktivasi Perilaku Positif</strong> - Melakukan aktivitas yang menyenangkan dan bermakna di siang hari meningkatkan kualitas tidur di malam hari.</li>
                    <li><strong>Dukungan Sosial</strong> - Memiliki sistem dukungan sosial yang kuat berkorelasi dengan kualitas tidur yang lebih baik dan ketahanan terhadap stress.</li>
                </ol>

                <div class="alert alert-success mt-4">
                    <div class="d-flex">
                        <div class="me-3">
                            <i class="fas fa-lightbulb fa-2x"></i>
                        </div>
                        <div>
                            <h5 class="alert-heading">Tips Praktis</h5>
                            <p class="mb-0">Coba latihan "3-3-3" sebelum tidur: Identifikasi 3 hal positif yang terjadi hari ini, 3 hal yang Anda nantikan besok, dan 3 kekuatan diri yang Anda gunakan hari ini.</p>
                        </div>
                    </div>
                </div>

                <h4 class="fw-bold mb-3">Kesimpulan</h4>
                
                <p>Memahami hubungan antara stress dan tidur memberikan kita kekuatan untuk memutus siklus negatif ini. Dengan mengadopsi pendekatan psikologi positif, mahasiswa dapat membangun ketahanan terhadap stress akademik sekaligus memperbaiki kualitas tidur mereka. Kedua aspek ini saling menguatkan dalam sebuah siklus positif yang mendukung kesuksesan akademis dan kesejahteraan secara keseluruhan.</p>

                <div class="article-sources mt-5">
                    <h6 class="fw-bold">Sumber Referensi:</h6>
                    <ul class="small">
                        <li>Journal of Sleep Research. (2022). Academic Stress and Sleep Quality in College Students.</li>
                        <li>Positive Psychology in Practice. (2023). Gratitude Interventions and Sleep Quality.</li>
                        <li>Sapolsky, R. (2020). Why Zebras Don't Get Ulcers. Henry Holt and Co.</li>
                    </ul>
                </div>
            </div>
        `;
    }
    
    // Artikel untuk relaxation-techniques
    else if (articleId === 'relaxation-techniques') {
        return `
            <div class="article-content">
                <h3 class="fw-bold mb-4">5 Teknik Relaksasi Sebelum Tidur</h3>
                
                <div class="article-image mb-4 text-center">
                    <i class="fas fa-spa fa-4x text-success mb-3"></i>
                    <p class="text-muted small">Panduan langkah demi langkah untuk rileksasi efektif menjelang tidur</p>
                </div>
                
                <p>Sulit tidur adalah masalah umum yang dihadapi banyak mahasiswa. Setelah seharian penuh dengan aktivitas kuliah, tugas, dan interaksi sosial, otak dan tubuh kita sering kali masih dalam mode aktif saat seharusnya bersiap untuk beristirahat. Teknik relaksasi sebelum tidur terbukti efektif membantu tubuh dan pikiran beralih dari mode "aktif" ke mode "istirahat".</p>

                <p>Berikut adalah lima teknik relaksasi berbasis bukti ilmiah yang dapat Anda praktikkan 20-30 menit sebelum tidur untuk meningkatkan kualitas tidur secara signifikan:</p>

                <h4 class="fw-bold mb-3">1. Pernapasan 4-7-8</h4>
                
                <p>Dikembangkan oleh Dr. Andrew Weil, teknik pernapasan ini berfungsi sebagai "penenang alami" untuk sistem saraf. Studi menunjukkan teknik ini menurunkan detak jantung dan tekanan darah dalam hitungan menit.</p>
                
                <div class="card mb-4">
                    <div class="card-body">
                        <h6 class="fw-bold mb-3">Cara Melakukan:</h6>
                        <ol>
                            <li>Duduk dengan punggung tegak atau berbaring dengan nyaman</li>
                            <li>Letakkan ujung lidah di belakang gigi depan atas</li>
                            <li>Buang napas sepenuhnya melalui mulut, membuat suara "whoosh"</li>
                            <li>Tutup mulut dan hirup napas melalui hidung sambil menghitung hingga 4</li>
                            <li>Tahan napas sambil menghitung hingga 7</li>
                            <li>Buang napas melalui mulut dengan suara "whoosh" sambil menghitung hingga 8</li>
                            <li>Ulangi siklus ini 4 kali</li>
                        </ol>
                    </div>
                </div>

                <h4 class="fw-bold mb-3">2. Progressive Muscle Relaxation (PMR)</h4>
                
                <p>Teknik ini membantu melepaskan ketegangan otot yang terbangun sepanjang hari. Penelitian menunjukkan PMR meningkatkan kualitas tidur hingga 60% pada mahasiswa dengan insomnia.</p>
                
                <div class="card mb-4">
                    <div class="card-body">
                        <h6 class="fw-bold mb-3">Cara Melakukan:</h6>
                        <ol>
                            <li>Berbaring dengan nyaman di tempat tidur</li>
                            <li>Mulai dari jari kaki: kencangkan otot selama 5 detik, lalu rilekskan selama 10 detik</li>
                            <li>Perlahan-lahan naik ke atas: pergelangan kaki, betis, paha, perut, dada, tangan, lengan, bahu, leher, dan wajah</li>
                            <li>Fokus pada perbedaan sensasi antara ketegangan dan relaksasi</li>
                            <li>Setelah selesai, rasakan seluruh tubuh Anda dalam keadaan rileks sepenuhnya</li>
                        </ol>
                    </div>
                </div>

                <div class="alert alert-info my-4">
                    <div class="d-flex">
                        <div class="me-3">
                            <i class="fas fa-info-circle fa-2x"></i>
                        </div>
                        <div>
                            <h5 class="alert-heading">Manfaat PMR</h5>
                            <p class="mb-0">Studi di Harvard Medical School menunjukkan bahwa PMR yang dilakukan secara rutin menurunkan aktivitas sistem saraf simpatik (respons "fight or flight") dan meningkatkan aktivitas sistem parasimpatik (respons "rest and digest").</p>
                        </div>
                    </div>
                </div>

                <h4 class="fw-bold mb-3">3. Meditasi Mindfulness</h4>
                
                <p>Mindfulness membantu menenangkan "pikiran yang berputar" yang sering mengganggu tidur. Fokus pada momen saat ini membantu mengurangi kecemasan tentang masa depan atau penyesalan tentang masa lalu.</p>
                
                <div class="card mb-4">
                    <div class="card-body">
                        <h6 class="fw-bold mb-3">Cara Melakukan:</h6>
                        <ol>
                            <li>Duduk atau berbaring dengan nyaman</li>
                            <li>Fokuskan perhatian pada napas Anda</li>
                            <li>Perhatikan sensasi udara masuk dan keluar dari tubuh Anda</li>
                            <li>Saat pikiran mengembara (ini normal), dengan lembut kembalikan fokus ke napas</li>
                            <li>Lakukan selama 5-10 menit sebelum tidur</li>
                        </ol>
                    </div>
                </div>

                <h4 class="fw-bold mb-3">4. Body Scan Meditation</h4>
                
                <p>Teknik ini membantu meningkatkan kesadaran tubuh dan melepaskan ketegangan yang mungkin tidak Anda sadari. Body scan sangat membantu untuk mereka yang mengalami kesulitan mengidentifikasi sumber stres fisik.</p>
                
                <div class="card mb-4">
                    <div class="card-body">
                        <h6 class="fw-bold mb-3">Cara Melakukan:</h6>
                        <ol>
                            <li>Berbaring dengan nyaman tanpa bantal atau bantal tipis</li>
                            <li>Perlahan-lahan arahkan perhatian ke berbagai bagian tubuh, dimulai dari ujung kaki</li>
                            <li>Untuk setiap bagian tubuh, perhatikan sensasi yang muncul tanpa penilaian</li>
                            <li>Bayangkan napas Anda mengalir ke area yang Anda perhatikan, melepaskan ketegangan</li>
                            <li>Secara bertahap naik ke atas tubuh hingga mencapai kepala</li>
                            <li>Akhiri dengan kesadaran akan seluruh tubuh Anda sebagai satu kesatuan</li>
                        </ol>
                    </div>
                </div>

                <h4 class="fw-bold mb-3">5. Visualisasi Terpandu</h4>
                
                <p>Visualisasi membantu mengalihkan pikiran dari kecemasan dan menciptakan keadaan mental yang kondusif untuk tidur. Teknik ini memanfaatkan kemampuan otak untuk merespon gambar mental dengan cara yang sama seperti pengalaman nyata.</p>
                
                <div class="card mb-4">
                    <div class="card-body">
                        <h6 class="fw-bold mb-3">Cara Melakukan:</h6>
                        <ol>
                            <li>Berbaring dengan nyaman, tutup mata, dan ambil beberapa napas dalam</li>
                            <li>Bayangkan diri Anda berada di tempat yang damai dan menenangkan (pantai, hutan, dll)</li>
                            <li>Gunakan semua indera Anda dalam visualisasi:</li>
                            <ul>
                                <li>Apa yang Anda lihat? (warna, pemandangan)</li>
                                <li>Apa yang Anda dengar? (ombak, burung, angin)</li>
                                <li>Apa yang Anda rasakan? (pasir hangat, angin sepoi)</li>
                                <li>Aroma apa yang Anda cium? (garam laut, pinus)</li>
                            </ul>
                            <li>Biarkan diri Anda terbenam dalam pengalaman ini selama 5-10 menit</li>
                            <li>Secara bertahap, bawa kesadaran Anda kembali ke tempat tidur, merasa tenang dan siap tidur</li>
                        </ol>
                    </div>
                </div>

                <div class="alert alert-success my-4">
                    <div class="d-flex">
                        <div class="me-3">
                            <i class="fas fa-check-circle fa-2x"></i>
                        </div>
                        <div>
                            <h5 class="alert-heading">Tips Sukses:</h5>
                            <p class="mb-0">Konsistensi adalah kunci! Praktikkan teknik-teknik ini secara rutin sebagai bagian dari rutinitas sebelum tidur Anda. Manfaat terbesar datang setelah 2-3 minggu praktik rutin.</p>
                        </div>
                    </div>
                </div>

                <h4 class="fw-bold mb-3">Kesimpulan</h4>
                
                <p>Kelima teknik relaksasi ini dapat digunakan secara terpisah atau dikombinasikan untuk menciptakan rutinitas sebelum tidur yang personal. Cobalah masing-masing teknik selama beberapa hari untuk melihat mana yang paling sesuai dengan kebutuhan Anda. Ingat bahwa praktik relaksasi adalah keterampilan yang semakin membaik dengan latihan rutin.</p>
                
                <p>Tubuh dan pikiran kita membutuhkan waktu untuk beralih dari mode aktivitas tinggi ke keadaan tenang yang kondusif untuk tidur. Dengan mempraktikkan teknik-teknik relaksasi ini secara konsisten, Anda membantu menciptakan jembatan alami antara aktivitas siang hari dan istirahat malam yang berkualitas.</p>

                <div class="article-sources mt-5">
                    <h6 class="fw-bold">Sumber Referensi:</h6>
                    <ul class="small">
                        <li>Journal of Sleep Research. (2022). Progressive Muscle Relaxation and Sleep Quality in College Students.</li>
                        <li>Mindfulness. (2023). Effects of Pre-Sleep Mindfulness Practice on Sleep Onset and Quality.</li>
                        <li>Weil, A. (2021). Breathing Techniques for Better Sleep and Stress Management.</li>
                    </ul>
                </div>
            </div>
        `;
    }
    
    // Artikel untuk sleep-immunity
    else if (articleId === 'sleep-immunity') {
        return `
            <div class="article-content">
                <h3 class="fw-bold mb-4">Dampak Kurang Tidur pada Sistem Imun</h3>
                
                <div class="article-image mb-4 text-center">
                    <i class="fas fa-shield-virus fa-4x text-danger mb-3"></i>
                    <p class="text-muted small">Hubungan antara kualitas tidur dan daya tahan tubuh mahasiswa</p>
                </div>
                
                <p>Di tengah jadwal kuliah yang padat, proyek kelompok, dan tenggat waktu tugas, tidur sering menjadi hal yang dikorbankan oleh mahasiswa. Apa yang banyak tidak disadari adalah dampak signifikan dari kurang tidur terhadap sistem kekebalan tubuh. Penelitian terbaru mengungkapkan bahwa hubungan antara tidur dan imunitas jauh lebih kompleks dan penting daripada yang pernah kita pahami sebelumnya.</p>

                <h4 class="fw-bold mb-3">Mekanisme Biologis: Bagaimana Tidur Memengaruhi Sistem Imun</h4>
                
                <p>Sistem imun kita bukanlah entitas statis, melainkan jaringan kompleks yang mengalami fluktuasi aktivitas sepanjang siklus 24 jam. Tidur memainkan peran krusial dalam mengatur dan mengoptimalkan fungsi imun melalui beberapa mekanisme:</p>
                
                <div class="row mb-4">
                    <div class="col-md-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <h6 class="card-title text-danger">
                                    <i class="fas fa-vial me-2"></i>Produksi Sitokin
                                </h6>
                                <p>Selama tidur, tubuh meningkatkan produksi sitokin—protein penting yang menargetkan infeksi dan peradangan. Kurang tidur mengurangi produksi sitokin protektif, membuat Anda lebih rentan terhadap infeksi.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <h6 class="card-title text-primary">
                                    <i class="fas fa-bacterium me-2"></i>Sel T dan Antibodi
                                </h6>
                                <p>Tidur meningkatkan fungsi sel T—sel yang melawan patogen. Studi menunjukkan bahwa satu malam kurang tidur dapat menurunkan aktivitas sel T hingga 70%, secara dramatis mengurangi kemampuan tubuh untuk melawan virus.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row mb-4">
                    <div class="col-md-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <h6 class="card-title text-success">
                                    <i class="fas fa-sync-alt me-2"></i>Memori Imunologis
                                </h6>
                                <p>Fase tidur slow-wave (tidur dalam) mendukung pembentukan memori imunologis—kemampuan sistem imun untuk mengenali dan merespon patogen yang pernah ditemui sebelumnya dengan lebih efisien.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <h6 class="card-title text-warning">
                                    <i class="fas fa-balance-scale me-2"></i>Keseimbangan Peradangan
                                </h6>
                                <p>Tidur membantu mengatur respons inflamasi tubuh. Kurang tidur kronis menghasilkan peradangan tingkat rendah yang persisten, meningkatkan risiko berbagai penyakit termasuk penyakit jantung dan metabolik.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <blockquote class="blockquote border-start ps-4 py-2 my-4">
                    <p class="mb-0">"Tidur dan sistem imun memiliki hubungan bilateral yang kuat—tidur memengaruhi fungsi imun, dan aktivitas sistem imun dapat memengaruhi kualitas tidur."</p>
                    <footer class="blockquote-footer mt-2">Dr. Matthew Walker, <cite>Neuroscientist & Penulis "Why We Sleep"</cite></footer>
                </blockquote>

                <h4 class="fw-bold mb-3">Studi Kasus: Mahasiswa dan Kerentanan Imun</h4>
                
                <p>Sebuah penelitian longitudinal yang dilakukan di beberapa kampus di Indonesia menemukan korelasi yang mengkhawatirkan antara kebiasaan tidur mahasiswa dan kesehatan mereka:</p>
                
                <div class="alert alert-danger my-4">
                    <div class="d-flex">
                        <div class="me-3">
                            <i class="fas fa-exclamation-circle fa-2x"></i>
                        </div>
                        <div>
                            <h5 class="alert-heading">Temuan Penting:</h5>
                            <ul class="mb-0">
                                <li>Mahasiswa yang tidur kurang dari 6 jam per malam mengalami 4.2x lebih banyak infeksi saluran pernapasan atas</li>
                                <li>Durasi sakit rata-rata 3 hari lebih lama pada mahasiswa dengan kualitas tidur buruk</li>
                                <li>Respons terhadap vaksin menurun hingga 50% pada periode kurang tidur</li>
                                <li>70% mahasiswa melaporkan penurunan daya tahan tubuh selama periode ujian, berkorelasi dengan pola tidur yang terganggu</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <h4 class="fw-bold mb-3">Periode Kritis: Ujian dan Sistem Imun</h4>
                
                <p>Periode ujian merepresentasikan "badai sempurna" bagi sistem imun mahasiswa, dengan kombinasi:</p>
                
                <ul>
                    <li><strong>Pengurangan durasi tidur</strong> - Rata-rata mahasiswa kehilangan 1.5 jam tidur per malam selama minggu ujian</li>
                    <li><strong>Peningkatan stress</strong> - Meningkatkan level kortisol yang menekan fungsi imun</li>
                    <li><strong>Perubahan pola makan</strong> - Peningkatan konsumsi makanan olahan dan penurunan asupan nutrisi esensial</li>
                    <li><strong>Berkurangnya aktivitas fisik</strong> - Mengurangi stimulus positif untuk sistem imun</li>
                </ul>

                <p>Studi dari Universitas Indonesia menunjukkan bahwa 68% mahasiswa mengalami setidaknya satu episode sakit selama atau segera setelah periode ujian akhir, dengan korelasi kuat terhadap kualitas tidur.</p>

                <div class="text-center my-4">
                    <img src="assets/images/sleep-immune-chart.png" alt="Grafik hubungan tidur dan imunitas" class="img-fluid rounded">
                    <p class="text-muted small mt-2">Grafik: Korelasi antara durasi tidur dan marker fungsi imun pada mahasiswa</p>
                </div>

                <h4 class="fw-bold mb-3">Strategi Praktis: Menjaga Keseimbangan Tidur dan Imunitas</h4>
                
                <p>Berikut strategi berbasis bukti ilmiah untuk mendukung sistem imun melalui tidur berkualitas:</p>
                
                <div class="row mb-4">
                    <div class="col-lg-6">
                        <div class="card h-100 bg-light">
                            <div class="card-body">
                                <h6 class="fw-bold text-primary mb-3">Prioritaskan Konsistensi</h6>
                                <p>Jaga jadwal tidur konsisten, bahkan di akhir pekan. Sistem imun bekerja optimal dengan ritme sirkadian yang stabil.</p>
                                <p class="small"><strong>Tujuan:</strong> Maksimal 1 jam perbedaan waktu tidur antar hari.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="card h-100 bg-light">
                            <div class="card-body">
                                <h6 class="fw-bold text-success mb-3">Hindari Jetlag Sosial</h6>
                                <p>Perbedaan besar antara jadwal tidur hari kerja dan akhir pekan menyebabkan "jetlag sosial" yang melemahkan sistem imun.</p>
                                <p class="small"><strong>Strategi:</strong> Gunakan alarm bangun yang konsisten setiap hari.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row mb-4">
                    <div class="col-lg-6">
                        <div class="card h-100 bg-light">
                            <div class="card-body">
                                <h6 class="fw-bold text-warning mb-3">Power Nap Strategis</h6>
                                <p>Tidur siang 20-30 menit pada periode tinggi stress dapat membantu memulihkan fungsi imun yang terganggu oleh kurang tidur malam.</p>
                                <p class="small"><strong>Waktu optimal:</strong> Antara jam 13:00-15:00, jangan terlalu dekat dengan waktu tidur malam.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="card h-100 bg-light">
                            <div class="card-body">
                                <h6 class="fw-bold text-danger mb-3">Protokol Pre-Ujian</h6>
                                <p>Pada 2 minggu menjelang ujian, prioritaskan tidur sebagai bagian dari strategi belajar, bukan penghambat.</p>
                                <p class="small"><strong>Strategi:</strong> Tidur 7-8 jam sebelum ujian meningkatkan performa kognitif lebih efektif daripada belajar semalam suntuk.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <h4 class="fw-bold mb-3">Kesimpulan</h4>
                
                <p>Bagi mahasiswa, memahami hubungan antara tidur dan sistem imun bukan hanya soal kesehatan, tetapi juga strategi akademis yang cerdas. Tidur berkualitas seharusnya dipandang sebagai investasi, bukan kemewahan. Penelitian konsisten menunjukkan bahwa mahasiswa dengan kebiasaan tidur lebih baik tidak hanya memiliki kesehatan yang lebih prima, tetapi juga performa akademik yang lebih baik.</p>
                
                <p>Di tengah tuntutan akademik yang tinggi, ingatlah bahwa sistem imun yang kuat adalah fondasi utama untuk produktivitas dan kesuksesan jangka panjang. Memprioritaskan tidur berkualitas adalah salah satu keputusan terpenting yang dapat Anda ambil untuk kesehatan dan karir akademik Anda.</p>

                <div class="alert alert-primary mt-4">
                    <div class="d-flex">
                        <div class="me-3">
                            <i class="fas fa-lightbulb fa-2x"></i>
                        </div>
                        <div>
                            <h5 class="alert-heading">Mulai Sekarang!</h5>
                            <p class="mb-0">Gunakan fitur <a href="sleep-tracker.html" class="alert-link">Sleep Tracker</a> di SleepSync untuk memantau pola tidur Anda dan melihat korelasinya dengan kesehatan Anda. Catat setiap episode sakit untuk melihat hubungannya dengan kualitas tidur Anda.</p>
                        </div>
                    </div>
                </div>

                <div class="article-sources mt-5">
                    <h6 class="fw-bold">Sumber Referensi:</h6>
                    <ul class="small">
                        <li>Journal of Immunology. (2022). Sleep Duration and Markers of Inflammation in College Students.</li>
                        <li>Walker, M. (2018). Why We Sleep: Unlocking the Power of Sleep and Dreams.</li>
                        <li>Universitas Indonesia. (2023). Studi Longitudinal Pola Tidur dan Kesehatan Mahasiswa Indonesia.</li>
                    </ul>
                </div>
            </div>
        `;
    }
    
    // Artikel untuk blue-light
    else if (articleId === 'blue-light') {
        return `
            <div class="article-content">
                <h3 class="fw-bold mb-4">Mengatasi Blue Light dari Gadget</h3>
                
                <div class="article-image mb-4 text-center">
                    <i class="fas fa-mobile-alt fa-4x text-info mb-3"></i>
                    <p class="text-muted small">Dampak cahaya biru dan cara mengatasinya</p>
                </div>
                
                <p>Di era digital saat ini, mayoritas mahasiswa menghabiskan waktu 8-10 jam per hari di depan layar. Laptop untuk kuliah online, smartphone untuk sosial media, dan tablet untuk membaca—semua perangkat ini memancarkan cahaya biru yang dapat mengganggu produksi melatonin alami tubuh, hormon yang mengatur siklus tidur-bangun kita.</p>

                <h4 class="fw-bold mb-3">Mengapa Cahaya Biru Begitu Bermasalah?</h4>
                
                <p>Cahaya biru memiliki panjang gelombang pendek dan energi tinggi yang menipu otak kita untuk berpikir bahwa masih siang hari. Ketika terpapar cahaya biru di malam hari, tubuh menunda produksi melatonin—hormon yang memberi sinyal pada tubuh untuk bersiap tidur. Penelitian dari Harvard Medical School menunjukkan bahwa paparan cahaya biru dapat menunda produksi melatonin hingga 3 jam dan menggeser ritme sirkadian sebanyak 1,5 jam.</p>
                
                <blockquote class="blockquote border-start ps-4 py-2 my-4">
                    <p class="mb-0">"Cahaya biru bukan musuh. Yang menjadi masalah adalah waktu dan durasi paparan, terutama menjelang waktu tidur."</p>
                    <footer class="blockquote-footer mt-2">Dr. Charles Czeisler, <cite>Harvard Medical School</cite></footer>
                </blockquote>

                <div class="alert alert-info my-4">
                    <div class="d-flex">
                        <div class="me-3">
                            <i class="fas fa-info-circle fa-2x"></i>
                        </div>
                        <div>
                            <h5 class="alert-heading">Fakta Menarik!</h5>
                            <p class="mb-0">Penggunaan gadget 2 jam sebelum tidur dapat menurunkan kualitas tidur hingga 40% dan mengurangi fase REM sebanyak 20 menit.</p>
                        </div>
                    </div>
                </div>

                <h4 class="fw-bold mb-3">7 Cara Praktis Mengatasi Cahaya Biru</h4>
                
                <div class="row g-4 mb-4">
                    <div class="col-md-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title fw-bold">
                                    <i class="fas fa-clock text-danger me-2"></i>Aturan 2 Jam
                                </h5>
                                <p>Hindari penggunaan gadget minimal 2 jam sebelum waktu tidur. Jika tidak memungkinkan, kurangi secara bertahap: mulai dari 30 menit, lalu 1 jam, hingga mencapai target 2 jam.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title fw-bold">
                                    <i class="fas fa-glasses text-primary me-2"></i>Kacamata Anti Blue Light
                                </h5>
                                <p>Gunakan kacamata khusus yang memblokir cahaya biru saat harus menggunakan gadget di malam hari. Efektivitasnya mencapai 50-60% dalam memblokir gelombang cahaya biru yang berbahaya.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row g-4 mb-4">
                    <div class="col-md-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title fw-bold">
                                    <i class="fas fa-moon text-warning me-2"></i>Mode Malam/Night Shift
                                </h5>
                                <p>Aktifkan fitur Night Mode, Night Shift, atau Blue Light Filter yang tersedia di hampir semua perangkat modern. Jadwalkan agar aktif otomatis setelah jam 7 malam.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title fw-bold">
                                    <i class="fas fa-download text-success me-2"></i>Aplikasi Filter Cahaya
                                </h5>
                                <p>Gunakan aplikasi seperti f.lux, Twilight, atau Night Filter yang dapat menyesuaikan suhu warna layar berdasarkan waktu hari dan lokasi geografis Anda.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row g-4 mb-4">
                    <div class="col-md-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title fw-bold">
                                    <i class="fas fa-lightbulb text-warning me-2"></i>Pencahayaan Ruangan
                                </h5>
                                <p>Gunakan lampu dengan warna hangat (kekuningan) di kamar tidur dan ruang belajar saat malam hari. Hindari lampu putih terang yang mengandung komponen cahaya biru tinggi.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title fw-bold">
                                    <i class="fas fa-adjust text-dark me-2"></i>Kecerahan Layar
                                </h5>
                                <p>Kurangi kecerahan layar hingga level terendah yang masih nyaman dibaca. Setiap 20% pengurangan kecerahan dapat menurunkan paparan cahaya biru hingga 15%.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row g-4 mb-4">
                    <div class="col-md-6 mx-auto">
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title fw-bold">
                                    <i class="fas fa-book text-info me-2"></i>Media Fisik
                                </h5>
                                <p>Ganti kebiasaan membaca di gadget dengan buku fisik atau e-reader dengan teknologi e-ink yang tidak memancarkan cahaya biru dan lebih mirip kertas asli.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="alert alert-success my-4">
                    <div class="d-flex">
                        <div class="me-3">
                            <i class="fas fa-lightbulb fa-2x"></i>
                        </div>
                        <div>
                            <h5 class="alert-heading">Teknik 20-20-20</h5>
                            <p class="mb-0">Untuk mengurangi kelelahan mata dan dampak cahaya biru: setiap 20 menit, lihat objek berjarak 20 kaki (6 meter) selama 20 detik. Teknik ini tidak hanya menyegarkan mata, tapi juga mengurangi akumulasi efek cahaya biru.</p>
                        </div>
                    </div>
                </div>

                <h4 class="fw-bold mb-3">Hasil Ilmiah dari Mengurangi Cahaya Biru</h4>
                
                <p>Studi dari University of Houston menemukan bahwa peserta yang mengurangi paparan cahaya biru di malam hari mengalami:</p>
                
                <ul>
                    <li>Peningkatan produksi melatonin hingga 58%</li>
                    <li>Pengurangan waktu untuk tertidur (sleep latency) sebanyak 14 menit</li>
                    <li>Peningkatan kualitas tidur sebesar 27%</li>
                    <li>Perbaikan mood dan tingkat kewaspadaan di pagi hari</li>
                </ul>

                <div class="text-center my-4">
                    <img src="assets/images/blue-light-spectrum.jpg" alt="Spektrum cahaya biru" class="img-fluid rounded">
                    <p class="text-muted small mt-2">Spektrum cahaya dan efeknya pada produksi melatonin</p>
                </div>

                <h4 class="fw-bold mb-3">Kesimpulan</h4>
                
                <p>Mengurangi paparan cahaya biru dari gadget bukan berarti harus menghindari teknologi sepenuhnya. Dengan strategi yang tepat dan konsisten, kita dapat memanfaatkan teknologi modern sambil tetap menjaga kualitas tidur. Ingat bahwa perubahan kecil namun konsisten dalam kebiasaan penggunaan gadget dapat memberikan dampak besar pada kualitas tidur dan kesehatan secara keseluruhan.</p>
                
                <p>Mulailah dengan langkah kecil seperti mengaktifkan mode malam dan mengurangi penggunaan gadget 30 menit sebelum tidur, kemudian tingkatkan secara bertahap. Tubuh Anda akan berterima kasih dengan tidur yang lebih nyenyak dan energi yang lebih baik di pagi hari.</p>

                <div class="article-sources mt-5">
                    <h6 class="fw-bold">Sumber Referensi:</h6>
                    <ul class="small">
                        <li>Harvard Health Publishing. (2022). Blue light has a dark side.</li>
                        <li>University of Houston. (2023). Study on Blue Light Exposure and Melatonin Production.</li>
                        <li>Journal of Applied Physiology. (2021). Effects of Blue Light-Filtering Glasses on Sleep Quality.</li>
                    </ul>
                </div>
            </div>
        `;
    }
    
    // Artikel untuk sleep-nutrition
    else if (articleId === 'sleep-nutrition') {
        return `
            <div class="article-content">
                <h3 class="fw-bold mb-4">Makanan yang Membantu Tidur Nyenyak</h3>
                
                <div class="article-image mb-4 text-center">
                    <i class="fas fa-utensils fa-4x text-success mb-3"></i>
                    <p class="text-muted small">Nutrisi untuk tidur berkualitas</p>
                </div>
                
                <p>Hubungan antara pola makan dan kualitas tidur sering kali diabaikan oleh banyak mahasiswa. Padahal, apa yang Anda konsumsi—terutama beberapa jam sebelum tidur—dapat memainkan peran penting dalam menentukan seberapa cepat Anda tertidur, berapa lama Anda tidur, dan seberapa restoratif tidur Anda.</p>

                <blockquote class="blockquote border-start ps-4 py-2 my-4">
                    <p class="mb-0">"Tidur dan nutrisi adalah dua pilar kesehatan yang saling menopang. Apa yang Anda makan mempengaruhi bagaimana Anda tidur, dan bagaimana Anda tidur mempengaruhi metabolisme makanan."</p>
                    <footer class="blockquote-footer mt-2">Dr. Michael Breus, <cite>The Sleep Doctor</cite></footer>
                </blockquote>

                <h4 class="fw-bold mb-3">Nutrisi Kunci untuk Tidur Berkualitas</h4>
                
                <p>Berdasarkan penelitian dari Journal of Clinical Sleep Medicine, terdapat beberapa nutrisi penting yang berperan dalam regulasi tidur:</p>
                
                <div class="row g-4 mb-4">
                    <div class="col-md-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title fw-bold">
                                    <i class="fas fa-moon text-primary me-2"></i>Triptofan
                                </h5>
                                <p>Asam amino esensial yang menjadi prekursor serotonin dan melatonin—dua neurotransmitter kunci dalam regulasi tidur. Tubuh tidak dapat memproduksi triptofan sendiri, sehingga harus diperoleh dari makanan.</p>
                                <span class="badge bg-success">Membantu Induksi Tidur</span>
                                                       </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title fw-bold">
                                    <i class="fas fa-cloud-moon text-info me-2"></i>Melatonin
                                </h5>
                                <p>Hormon yang diproduksi secara alami oleh kelenjar pineal di otak, melatonin mengatur siklus tidur-bangun. Beberapa makanan mengandung melatonin alami yang dapat membantu meningkatkan levelnya dalam tubuh.</p>
                                <span class="badge bg-success">Pengatur Ritme Sirkadian</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row g-4 mb-4">
                    <div class="col-md-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title fw-bold">
                                    <i class="fas fa-magnet text-danger me-2"></i>Magnesium
                                </h5>
                                <p>Mineral penting yang berperan sebagai relaksan alami, membantu mengaktifkan mekanisme parasimpatis dan mengurangi kadar hormon stres kortisol. Defisiensi magnesium dikaitkan dengan insomnia dan tidur gelisah.</p>
                                <span class="badge bg-success">Relaksan Otot & Saraf</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title fw-bold">
                                    <i class="fas fa-apple-alt text-success me-2"></i>Vitamin B6
                                </h5>
                                <p>Vitamin yang berperan dalam produksi serotonin dan melatonin dari triptofan. Tanpa B6 yang cukup, triptofan tidak dapat dikonversi menjadi serotonin dan melatonin secara efisien.</p>
                                <span class="badge bg-success">Konversi Triptofan</span>
                            </div>
                        </div>
                    </div>
                </div>

                <h4 class="fw-bold mb-3">10 Makanan Terbaik untuk Tidur Nyenyak</h4>

                <div class="alert alert-info my-4">
                    <div class="d-flex">
                        <div class="me-3">
                            <i class="fas fa-utensils fa-2x"></i>
                        </div>
                        <div>
                            <h5 class="alert-heading">Waktu Konsumsi</h5>
                            <p class="mb-0">Untuk efek optimal, konsumsi makanan pendukung tidur 1-3 jam sebelum waktu tidur. Terlalu dekat dengan waktu tidur dapat menyebabkan gangguan pencernaan yang justru mengganggu tidur.</p>
                        </div>
                    </div>
                </div>
                
                <div class="row g-4">
                    <div class="col-md-6">
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="d-flex align-items-center mb-2">
                                    <i class="fas fa-cheese fa-2x text-warning me-3"></i>
                                    <h5 class="card-title fw-bold mb-0">Keju Cottage & Susu Rendah Lemak</h5>
                                </div>
                                <p class="card-text">Sumber triptofan dan kalsium yang sangat baik. Kalsium membantu otak menggunakan triptofan untuk memproduksi melatonin. Susu hangat dengan sedikit madu dapat menjadi pilihan "minuman tidur" yang ideal.</p>
                                <span class="badge bg-primary">Tinggi Triptofan</span>
                                <span class="badge bg-info">Mengandung Kalsium</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="d-flex align-items-center mb-2">
                                    <i class="fas fa-seedling fa-2x text-success me-3"></i>
                                    <h5 class="card-title fw-bold mb-0">Kacang Almond & Walnut</h5>
                                </div>
                                <p class="card-text">Kacang-kacangan ini kaya akan magnesium dan melatonin alami. Segenggam kecil (~1 ons) dapat membantu meredakan ketegangan otot dan mempersiapkan tubuh untuk tidur nyenyak.</p>
                                <span class="badge bg-danger">Kaya Magnesium</span>
                                <span class="badge bg-warning">Sumber Melatonin</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="d-flex align-items-center mb-2">
                                    <i class="fas fa-fish fa-2x text-info me-3"></i>
                                    <h5 class="card-title fw-bold mb-0">Ikan Berlemak (Salmon, Tuna)</h5>
                                </div>
                                <p class="card-text">Ikan-ikan ini kaya akan vitamin D dan asam lemak omega-3, yang keduanya telah terbukti meningkatkan produksi serotonin. Penelitian menunjukkan bahwa konsumsi omega-3 secara teratur dikaitkan dengan tidur yang lebih nyenyak.</p>
                                <span class="badge bg-primary">Omega-3</span>
                                <span class="badge bg-warning">Vitamin D</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="d-flex align-items-center mb-2">
                                    <i class="fas fa-apple-alt fa-2x text-danger me-3"></i>
                                    <h5 class="card-title fw-bold mb-0">Buah Ceri Asam & Kiwi</h5>
                                </div>
                                <p class="card-text">Ceri asam adalah salah satu sumber melatonin alami terbaik, sementara kiwi mengandung serotonin dan antioksidan. Studi menunjukkan konsumsi 2 buah kiwi 1 jam sebelum tidur dapat memperbaiki onset, durasi dan efisiensi tidur.</p>
                                <span class="badge bg-danger">Sumber Melatonin Alami</span>
                                <span class="badge bg-success">Antioksidan</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="d-flex align-items-center mb-2">
                                    <i class="fas fa-spa fa-2x text-success me-3"></i>
                                    <h5 class="card-title fw-bold mb-0">Teh Chamomile & Valerian</h5>
                                </div>
                                <p class="card-text">Herbal yang telah digunakan selama berabad-abad sebagai obat tidur alami. Chamomile mengandung apigenin yang mengikat reseptor GABA di otak, menciptakan efek menenangkan, sementara valerian bekerja mirip dengan obat penenang ringan.</p>
                                <span class="badge bg-info">Relaksan Alami</span>
                                <span class="badge bg-primary">Minuman Sebelum Tidur</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="d-flex align-items-center mb-2">
                                    <i class="fas fa-bread-slice fa-2x text-warning me-3"></i>
                                    <h5 class="card-title fw-bold mb-0">Oatmeal & Roti Gandum Utuh</h5>
                                </div>
                                <p class="card-text">Karbohidrat kompleks ini memicu pelepasan insulin, yang membantu triptofan memasuki otak dengan lebih efisien. Oatmeal juga kaya akan melatonin, menjadikannya pilihan sarapan malam ideal untuk mahasiswa dengan jadwal malam.</p>
                                <span class="badge bg-warning">Karbohidrat Kompleks</span>
                                <span class="badge bg-success">Indeks Glikemik Rendah</span>
                            </div>
                        </div>
                    </div>
                </div>

                <h4 class="fw-bold mt-4 mb-3">Makanan yang Harus Dihindari Sebelum Tidur</h4>
                
                <p>Sama pentingnya dengan mengetahui makanan yang membantu tidur, Anda juga perlu mengetahui makanan yang dapat mengganggu tidur:</p>
                
                <div class="row g-4 mb-4">
                    <div class="col-md-4">
                        <div class="card bg-light h-100">
                            <div class="card-body">
                                <div class="text-center mb-2">
                                    <i class="fas fa-coffee fa-3x text-danger"></i>
                                </div>
                                <h5 class="card-title text-center">Kafein</h5>
                                <p class="small text-center">Hindari kafein (kopi, teh, cokelat, minuman energi) minimal 6 jam sebelum waktu tidur. Kafein memiliki waktu paruh hingga 5-7 jam.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card bg-light h-100">
                            <div class="card-body">
                                <div class="text-center mb-2">
                                    <i class="fas fa-wine-glass-alt fa-3x text-danger"></i>
                                </div>
                                <h5 class="card-title text-center">Alkohol</h5>
                                <p class="small text-center">Meskipun dapat membuat mengantuk, alkohol mengganggu siklus REM dan menyebabkan tidur tidak restoratif dan terbangun di tengah malam.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card bg-light h-100">
                            <div class="card-body">
                                <div class="text-center mb-2">
                                    <i class="fas fa-pizza-slice fa-3x text-danger"></i>
                                </div>
                                <h5 class="card-title text-center">Makanan Berlemak & Pedas</h5>
                                <p class="small text-center">Makanan ini sulit dicerna dan dapat menyebabkan heartburn atau gangguan pencernaan yang mengganggu tidur.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <h4 class="fw-bold mb-3">Menu Ideal Sebelum Tidur untuk Mahasiswa</h4>
                
                <p>Berikut adalah beberapa kombinasi makanan praktis yang dapat dikonsumsi 1-2 jam sebelum tidur, dirancang khusus untuk budget dan keterbatasan waktu mahasiswa:</p>
                
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead class="table-light">
                            <tr>
                                <th>Menu</th>
                                <th>Bahan</th>
                                <th>Nutrisi Tidur</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Smoothie Tidur Nyenyak</td>
                                <td>Susu almond, pisang, 1 sdm almond butter, sedikit madu</td>
                                <td>Triptofan, Magnesium, Karbohidrat kompleks</td>
                            </tr>
                            <tr>
                                <td>Toast Santai</td>
                                <td>Roti gandum utuh, alpukat, telur rebus</td>
                                <td>Triptofan, Magnesium, Vitamin B6</td>
                            </tr>
                            <tr>
                                <td>Oatmeal Malam</td>
                                <td>Oatmeal, susu, kacang almond, buah ceri atau pisang</td>
                                <td>Melatonin, Triptofan, Magnesium</td>
                            </tr>
                            <tr>
                                <td>Tuna Wrap</td>
                                <td>Tortilla gandum utuh, tuna kalengan, selada, alpukat</td>
                                <td>Omega-3, Triptofan, Vitamin B6</td>
                            </tr>
                            <tr>
                                <td>Teh & Camilan Ringan</td>
                                <td>Teh chamomile, segenggam kecil kacang dan 2-3 buah kiwi</td>
                                <td>Apigenin, Serotonin, Melatonin</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="alert alert-success my-4">
                    <div class="d-flex">
                        <div class="me-3">
                            <i class="fas fa-lightbulb fa-2x"></i>
                        </div>
                        <div>
                            <h5 class="alert-heading">Tip Profesional</h5>
                            <p class="mb-0">Untuk mahasiswa dengan jadwal padat, siapkan "Sleep Snack Pack" yang berisi kombinasi kacang-kacangan, buah kering, dan dark chocolate (kadar minimal) yang dapat dikonsumsi 1 jam sebelum tidur. Simpan dalam container kecil di tas atau meja belajar Anda.</p>
                        </div>
                    </div>
                </div>

                <h4 class="fw-bold mb-3">Kesimpulan</h4>
                
                <p>Nutrisi memainkan peran penting dalam kualitas tidur yang sering diabaikan oleh mahasiswa yang sibuk. Dengan mengintegrasikan makanan pendukung tidur ke dalam diet harian dan menghindari makanan yang mengganggu tidur, Anda dapat secara alami meningkatkan kualitas istirahat malam tanpa bergantung pada suplemen atau obat tidur.</p>
                
                <p>Ingatlah bahwa perubahan pola makan membutuhkan konsistensi. Anda mungkin tidak melihat efek dramatis dalam satu malam, tetapi konsumsi makanan pendukung tidur secara teratur selama 1-2 minggu akan menunjukkan perbaikan yang signifikan dalam kualitas tidur dan kesehatan secara keseluruhan.</p>

                <div class="article-sources mt-5">
                    <h6 class="fw-bold">Sumber Referensi:</h6>
                    <ul class="small">
                        <li>Journal of Clinical Sleep Medicine. (2022). Diet and Sleep Quality: A Systematic Review.</li>
                        <li>St-Onge, M. P., et al. (2021). Effects of Diet on Sleep Quality. Advances in Nutrition, 7(5), 938-949.</li>
                        <li>Sleep Foundation. (2023). Best Foods for Sleep.</li>
                    </ul>
                </div>
            </div>
        `;
    }
    
    // Artikel untuk circadian-productivity
    else if (articleId === 'circadian-productivity') {
        return `
            <div class="article-content">
                <h3 class="fw-bold mb-4">Siklus Circadian dan Produktivitas</h3>
                
                <div class="article-image mb-4 text-center">
                    <i class="fas fa-clock fa-4x text-primary mb-3"></i>
                    <p class="text-muted small">Mengoptimalkan jam biologis untuk performa terbaik</p>
                </div>
                
                <p>Siklus circadian adalah ritme alami tubuh yang mengatur siklus tidur-bangun selama 24 jam. Ritme ini dipengaruhi oleh paparan cahaya, aktivitas fisik, dan pola makan. Bagi mahasiswa, memahami dan mengoptimalkan siklus circadian dapat berdampak signifikan terhadap produktivitas dan kesejahteraan.</p>

                <h4 class="fw-bold mb-3">Mengapa Siklus Circadian Penting?</h4>
                
                <p>Siklus circadian yang seimbang berkontribusi pada:</p>
                
                <ul>
                    <li><strong>Kualitas Tidur yang Lebih Baik:</strong> Tidur dan bangun pada waktu yang sama setiap hari membantu mengatur jam biologis, meningkatkan kualitas tidur.</li>
                    <li><strong>Peningkatan Kewaspadaan:</strong> Paparan cahaya alami di pagi hari meningkatkan kewaspadaan dan suasana hati.</li>
                    <li><strong>Performa Akademik yang Optimal:</strong> Ritme biologis yang teratur berhubungan dengan peningkatan konsentrasi, memori, dan kemampuan pemecahan masalah.</li>
                </ul>

                <div class="alert alert-info my-4">
                    <div class="d-flex">
                        <div class="me-3">
                            <i class="fas fa-info-circle fa-2x"></i>
                        </div>
                        <div>
                            <h5 class="alert-heading">Fakta Menarik!</h5>
                            <p class="mb-0">Mahasiswa yang memiliki ritme sirkadian teratur cenderung memiliki IPK 0,4 poin lebih tinggi dan tingkat stres yang lebih rendah.</p>
                        </div>
                    </div>
                </div>

                <h4 class="fw-bold mb-3">Cara Mengoptimalkan Siklus Circadian</h4>
                
                <div class="row g-4 mb-4">
                    <div class="col-md-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title fw-bold">
                                    <i class="fas fa-sun text-warning me-2"></i>Paparan Cahaya Alami
                                </h5>
                                <p>Usahakan untuk mendapatkan paparan sinar matahari pagi selama 20-30 menit setiap hari. Ini membantu mengatur ritme sirkadian dan meningkatkan produksi serotonin.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title fw-bold">
                                    <i class="fas fa-bed text-primary me-2"></i>Rutinitas Tidur yang Konsisten
                                </h5>
                                <p>Tidur dan bangun pada waktu yang sama setiap hari, bahkan di akhir pekan. Konsistensi adalah kunci untuk mengatur jam biologis tubuh.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row g-4 mb-4">
                    <div class="col-md-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title fw-bold">
                                    <i class="fas fa-coffee text-danger me-2"></i>Batasi Kafein
                                </h5>
                                <p>Hindari konsumsi kafein 6 jam sebelum tidur. Kafein dapat mengganggu kemampuan tubuh untuk memproduksi melatonin dan mengatur siklus tidur.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title fw-bold">
                                    <i class="fas fa-moon text-info me-2"></i>Gunakan Fitur Night Mode
                                </h5>
                                <p>Aktifkan fitur Night Shift atau Blue Light Filter di perangkat Anda setelah matahari terbenam untuk mengurangi paparan cahaya biru.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <h4 class="fw-bold mb-3">Kesimpulan</h4>
                
                <p>Dengan memahami dan mengoptimalkan siklus circadian, mahasiswa dapat meningkatkan kualitas tidur, kesehatan mental, dan performa akademik. Mulailah dengan langkah kecil seperti mendapatkan paparan sinar matahari di pagi hari dan menjaga rutinitas tidur yang konsisten.</p>
                
                <p>Ingatlah bahwa perubahan gaya hidup yang signifikan memerlukan waktu dan konsistensi. Berikan waktu bagi tubuh Anda untuk beradaptasi dengan ritme baru, dan Anda akan mulai merasakan manfaatnya dalam beberapa minggu.</p>

                <div class="article-sources mt-5">
                    <h6 class="fw-bold">Sumber Referensi:</h6>
                    <ul class="small">
                        <li>American Academy of Sleep Medicine. (2022). Circadian Rhythm and Sleep Disorders.</li>
                        <li>Harvard Health Publishing. (2021). The Importance of a Consistent Sleep Schedule.</li>
                        <li>Journal of Clinical Sleep Medicine. (2023). Circadian Misalignment and Sleep Quality in College Students.</li>
                    </ul>
                </div>
            </div>
        `;
    }
    
    // Template untuk artikel lainnya
    // Tambahkan kondisi lain untuk artikel-artikel yang tersisa
    
    // Default return jika artikelId tidak cocok
    return '<p>Konten artikel tidak tersedia</p>';
}

function toggleBookmark(articleId) {
    const index = educationData.bookmarkedArticles.indexOf(articleId);
    
    if (index === -1) {
        educationData.bookmarkedArticles.push(articleId);
        showNotification('Artikel berhasil disimpan!', 'success');
    } else {
        educationData.bookmarkedArticles.splice(index, 1);
        showNotification('Artikel dihapus dari bookmark', 'info');
    }
    
    saveBookmarkedArticles();
    updateBookmarkButtons();
}

function updateBookmarkButtons() {
    const bookmarkButtons = document.querySelectorAll('.bookmark-btn');
    bookmarkButtons.forEach(button => {
        const onclick = button.getAttribute('onclick');
        if (onclick) {
            const articleIdMatch = onclick.match(/'([^']+)'/);
            if (articleIdMatch) {
                const articleId = articleIdMatch[1];
                updateBookmarkButton(button, articleId);
            }
        }
    });
}

function updateBookmarkButton(button, articleId) {
    const isBookmarked = educationData.bookmarkedArticles.includes(articleId);
    const icon = button.querySelector('i');
    
    if (isBookmarked) {
        button.classList.add('bookmarked');
        icon.classList.remove('text-muted');
        icon.classList.add('text-warning');
    } else {
        button.classList.remove('bookmarked');
        icon.classList.remove('text-warning');
        icon.classList.add('text-muted');
    }
}

function shareArticle(articleId) {
    const article = educationData.articles.find(a => a.id === articleId);
    if (!article) return;
    
    const shareData = {
        title: article.title,
        text: article.excerpt,
        url: window.location.href + '?article=' + articleId
    };
    
    if (navigator.share) {
        navigator.share(shareData).then(() => {
            showNotification('Artikel berhasil dibagikan!', 'success');
        }).catch(err => {
            console.log('Error sharing:', err);
            fallbackShare(shareData);
        });
    } else {
        fallbackShare(shareData);
    }
}

function fallbackShare(shareData) {
    const shareText = `${shareData.title}\n\n${shareData.text}\n\nBaca selengkapnya: ${shareData.url}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('Link artikel berhasil disalin ke clipboard!', 'success');
        }).catch(() => {
            showShareModal(shareData);
        });
    } else {
        showShareModal(shareData);
    }
}

function showShareModal(shareData) {
    const shareModalHTML = `
        <div class="modal fade" id="shareModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-share me-2"></i>Bagikan Artikel
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p class="mb-3">Salin link di bawah ini untuk membagikan artikel:</p>
                        <div class="input-group">
                            <input type="text" class="form-control" value="${shareData.url}" id="shareUrl" readonly>
                            <button class="btn btn-outline-primary" onclick="copyShareUrl()">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                        <div class="mt-3">
                            <h6>Atau bagikan ke:</h6>
                            <div class="d-flex gap-2">
                                <button class="btn btn-outline-primary btn-sm" onclick="shareToWhatsApp('${shareData.url}')">
                                    <i class="fab fa-whatsapp me-1"></i>WhatsApp
                                </button>
                                <button class="btn btn-outline-info btn-sm" onclick="shareToTwitter('${shareData.title}', '${shareData.url}')">
                                    <i class="fab fa-twitter me-1"></i>Twitter
                                </button>
                                <button class="btn btn-outline-primary btn-sm" onclick="shareToFacebook('${shareData.url}')">
                                    <i class="fab fa-facebook me-1"></i>Facebook
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', shareModalHTML);
    const modal = new bootstrap.Modal(document.getElementById('shareModal'));
    modal.show();
    
    // Remove modal after closing
    modal._element.addEventListener('hidden.bs.modal', function() {
        modal._element.remove();
    });
}

function copyShareUrl() {
    const urlInput = document.getElementById('shareUrl');
    urlInput.select();
    document.execCommand('copy');
    showNotification('Link berhasil disalin!', 'success');
}

function shareToWhatsApp(url) {
    window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, '_blank');
}

function shareToTwitter(title, url) {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
}

function shareToFacebook(url) {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
}

function likeArticle(articleId) {
    const article = educationData.articles.find(a => a.id === articleId);
    if (!article) return;
    
    const likedArticles = JSON.parse(localStorage.getItem('sleepsync_liked_articles') || '[]');
    const isLiked = likedArticles.includes(articleId);
    
    if (isLiked) {
        // Unlike
        const index = likedArticles.indexOf(articleId);
        likedArticles.splice(index, 1);
        article.likes--;
        showNotification('Like dihapus', 'info');
    } else {
        // Like
        likedArticles.push(articleId);
        article.likes++;
        showNotification('Artikel disukai!', 'success');
    }
    
    localStorage.setItem('sleepsync_liked_articles', JSON.stringify(likedArticles));
    
    // Update like button
    const likeButton = document.querySelector(`[onclick*="likeArticle('${articleId}')"]`);
    if (likeButton) {
        const icon = likeButton.querySelector('i');
        const text = likeButton.childNodes[likeButton.childNodes.length - 1];
        
        if (isLiked) {
            icon.classList.remove('fas');
            icon.classList.add('far');
            likeButton.classList.remove('btn-danger');
            likeButton.classList.add('btn-outline-danger');
        } else {
            icon.classList.remove('far');
            icon.classList.add('fas');
            likeButton.classList.remove('btn-outline-danger');
            likeButton.classList.add('btn-danger');
        }
        
        text.textContent = article.likes;
    }
}

function loadMoreArticles() {
    // Simulate loading more articles
    const additionalArticles = [
        {
            id: 'sleep-exercise',
            title: 'Olahraga dan Kualitas Tidur',
            category: 'health',
            excerpt: 'Bagaimana aktivitas fisik mempengaruhi pola tidur dan waktu terbaik untuk berolahraga.',
            readTime: 4,
            views: 445,
            likes: 78,
            author: 'Fitness Coach',
            publishDate: '2024-12-15',
            content: '<p>Konten tentang olahraga dan tidur...</p>'
        },
        {
            id: 'sleep-environment',
            title: 'Menciptakan Kamar Tidur Ideal',
            category: 'tips',
            excerpt: 'Panduan lengkap mengoptimalkan lingkungan tidur untuk kualitas istirahat terbaik.',
            readTime: 6,
            views: 623,
            likes: 134,
            author: 'Interior Sleep Expert',
            publishDate: '2024-12-10',
            content: '<p>Konten tentang lingkungan tidur...</p>'
        }
    ];
    
    // Add new articles to the data
    educationData.articles.push(...additionalArticles);
    
    // Re-display articles
    displayArticles();
    
    showNotification(`${additionalArticles.length} artikel baru dimuat!`, 'success');
    
    // Hide load more button after loading
    const loadMoreBtn = document.querySelector('[onclick="loadMoreArticles()"]');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = 'none';
    }
}

function searchArticles(query) {
    if (!query.trim()) {
        displayArticles();
        return;
    }
    
    const searchResults = educationData.articles.filter(article => 
        !article.featured && (
            article.title.toLowerCase().includes(query.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(query.toLowerCase()) ||
            article.author.toLowerCase().includes(query.toLowerCase()) ||
            getCategoryName(article.category).toLowerCase().includes(query.toLowerCase())
        )
    );
    
    const container = document.getElementById('articlesContainer');
    if (!container) return;
    
    // Clear existing articles
    const existingCards = container.querySelectorAll('.article-card:not(.featured-article)');
    existingCards.forEach(card => card.remove());
    
    if (searchResults.length === 0) {
        const noResultsHTML = `
            <div class="col-12 text-center py-5 search-no-results">
                <i class="fas fa-search fa-4x text-muted mb-3"></i>
                <h5>Tidak ada artikel yang ditemukan</h5>
                <p class="text-muted">Coba gunakan kata kunci yang berbeda atau jelajahi kategori lain</p>
                <button class="btn btn-primary" onclick="clearSearch()">
                    <i class="fas fa-times me-2"></i>Hapus Pencarian
                </button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', noResultsHTML);
        return;
    }
    
    searchResults.forEach((article, index) => {
        const articleCard = createArticleCard(article);
        articleCard.style.animationDelay = `${index * 0.1}s`;
        articleCard.classList.add('search-result');
        container.appendChild(articleCard);
    });
    
    // Add animation
    setTimeout(() => {
        const searchResultCards = container.querySelectorAll('.search-result');
        searchResultCards.forEach(card => card.classList.add('fade-in-up'));
    }, 50);
    
    showNotification(`Ditemukan ${searchResults.length} artikel`, 'success');
}

function clearSearch() {
    const searchInput = document.getElementById('articleSearch');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Remove no results message
    const noResults = document.querySelector('.search-no-results');
    if (noResults) {
        noResults.remove();
    }
    
    displayArticles();
}

function trackArticleRead(articleId) {
    if (!educationData.readArticles.includes(articleId)) {
        educationData.readArticles.push(articleId);
        saveReadArticles();
       }
    
    // Track reading analytics (could be sent to analytics service)
    const readingData = {
        articleId: articleId,
        timestamp: new Date().toISOString(),
        userId: getCurrentUserId()
    };
    
    // Store reading history
    const readingHistory = JSON.parse(localStorage.getItem('sleepsync_reading_history' ) || '[]');
    readingHistory.push(readingData);
    
    // Keep only last 100 reads
    if (readingHistory.length > 100) {
        readingHistory.splice(0, readingHistory.length - 100);
    }
    
    localStorage.setItem('sleepsync_reading_history', JSON.stringify(readingHistory));
}

function getCurrentUserId() {
    const user = JSON.parse(localStorage.getItem('sleepsync_user' || '{}'));
    return user.id || 'anonymous';
}

function updateQuickTips() {
    const quickTipsContainer = document.querySelector('.quick-tips-container');
    if (!quickTipsContainer) return;
    
    const tips = [
        {
            icon: 'moon',
            title: 'Rutinitas Malam',
            text: 'Matikan gadget 1 jam sebelum tidur untuk meningkatkan produksi melatonin alami.'
        },
        {
            icon: 'thermometer-half',
            title: 'Suhu Ideal',
            text: 'Jaga suhu kamar antara 18-22°C untuk kualitas tidur yang optimal.'
        },
        {
            icon: 'coffee',
            title: 'Batasi Kafein',
            text: 'Hindari kafein 6 jam sebelum waktu tidur untuk menghindari gangguan tidur.'
        }
    ];
    
    // Rotate tips daily
    const today = new Date().getDate();
    const todayTip = tips[today % tips.length];
    
    const tipHTML = `
        <div class="quick-tip text-center">
            <i class="fas fa-${todayTip.icon} fa-2x text-primary mb-2"></i>
            <h6 class="fw-bold">${todayTip.title}</h6>
            <p class="small text-muted mb-0">${todayTip.text}</p>
        </div>
    `;
    
    quickTipsContainer.innerHTML = tipHTML;
}

function getCategoryName(category) {
    const categoryNames = {
        'psychology': 'Psikologi',
        'tips': 'Tips Praktis',
        'health': 'Kesehatan',
        'research': 'Riset'
    };
    return categoryNames[category] || category;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Export functions to global scope
window.filterArticles = filterArticles;
window.readArticle = readArticle;
window.toggleBookmark = toggleBookmark;
window.shareArticle = shareArticle;
window.likeArticle = likeArticle;
window.loadMoreArticles = loadMoreArticles;
window.searchArticles = searchArticles;
window.clearSearch = clearSearch;
window.copyShareUrl = copyShareUrl;
window.shareToWhatsApp = shareToWhatsApp;
window.shareToTwitter = shareToTwitter;
window.shareToFacebook = shareToFacebook;


