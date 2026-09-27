// DersVerse - Supabase Bağlantı Yapılandırması
const DERSVERSE_SUPABASE_URL = 'https://dyxghgzquvsngehjjvcb.supabase.co';
const DERSVERSE_SUPABASE_KEY = 'sb_publishable_qgcYdZz60VDBkfLZ3UVftw_G9o30nYd'; 
const dersverseSupabase = supabase.createClient(DERSVERSE_SUPABASE_URL, DERSVERSE_SUPABASE_KEY);

let dersverseAllContents = [];

// --- 1. LGS CANLI GERİ SAYIM SAYACI ---
function startLGSTimer() {
    const lgsDate = new Date("June 6, 2027 09:30:00").getTime();
    setInterval(function() {
        const now = new Date().getTime();
        const distance = lgsDate - now;

        const el = document.getElementById("lgs-countdown");
        if (!el) return;

        if (distance < 0) {
            el.innerText = "Sınav Başladı!";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        el.innerText = `${days} Gün ${hours} Saat ${minutes} Dk ${seconds} Sn`;
    }, 1000);
}

// --- 2. TEMA DEĞİŞTİRME (DARK / LIGHT MODE) ---
function dersverseToggleTheme() {
    document.body.classList.toggle("light-theme");
    const isLight = document.body.classList.contains("light-theme");
    
    // Tercihi yerel hafızaya kaydet
    localStorage.setItem("dersverse_theme", isLight ? "light" : "dark");
    
    // Buton metnini ve ikonunu güncelle
    const btn = document.getElementById("dersverse-theme-toggle");
    if (btn) {
        btn.innerText = isLight ? "🌙 Gece Modu" : "☀️ Gündüz Modu";
    }
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem("dersverse_theme");
    const btn = document.getElementById("dersverse-theme-toggle");
    
    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
        if (btn) btn.innerText = "🌙 Gece Modu";
    } else {
        document.body.classList.remove("light-theme");
        if (btn) btn.innerText = "☀️ Gündüz Modu";
    }
}

// --- 3. POMODORO KRONOMETRESİ ---
let pomoInterval = null;
let pomoTimeLeft = 25 * 60;
let isPomoRunning = false;

function openPomodoroModal() {
    const modal = document.getElementById("dersverse-pomodoro-modal");
    if (modal) modal.style.display = "flex";
}

function closePomodoroModal() {
    const modal = document.getElementById("dersverse-pomodoro-modal");
    if (modal) modal.style.display = "none";
}

function updatePomoDisplay() {
    const minutes = Math.floor(pomoTimeLeft / 60);
    const seconds = pomoTimeLeft % 60;
    const display = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    const el = document.getElementById("pomodoro-timer-display");
    if (el) el.innerText = display;
}

function startPomodoro() {
    if (isPomoRunning) return;
    isPomoRunning = true;
    pomoInterval = setInterval(() => {
        if (pomoTimeLeft > 0) {
            pomoTimeLeft--;
            updatePomoDisplay();
        } else {
            clearInterval(pomoInterval);
            isPomoRunning = false;
            addXP(50);
            alert("Tebrikler! Pomodoro seansını tamamladınız ve +50 XP kazandınız!");
        }
    }, 1000);
}

function pausePomodoro() {
    clearInterval(pomoInterval);
    isPomoRunning = false;
}

function resetPomodoro() {
    pausePomodoro();
    pomoTimeLeft = 25 * 60;
    updatePomoDisplay();
}

// --- 4. GAMIFICATION / PUAN VE ROZET SİSTEMİ ---
let userPoints = parseInt(localStorage.getItem("dersverse_xp") || "120");

function addXP(amount) {
    userPoints += amount;
    localStorage.setItem("dersverse_xp", userPoints);
    updateUserStats();
}

function updateUserStats() {
    const pointsEl = document.getElementById("user-points");
    const badgeEl = document.getElementById("user-badge");

    if (pointsEl) pointsEl.innerText = userPoints;

    if (badgeEl) {
        if (userPoints >= 300) {
            badgeEl.innerText = "👑 LGS Şampiyonu";
        } else if (userPoints >= 200) {
            badgeEl.innerText = "⚡ Bilgi Ustası";
        } else {
            badgeEl.innerText = "🔥 LGS Canavarı";
        }
    }
}

// --- 5. SANAL SORU KUMBARASI ---
function openKumbaraModal() {
    const modal = document.getElementById("dersverse-kumbara-modal");
    if (modal) {
        modal.style.display = "flex";
        renderKumbara();
    }
}

function closeKumbaraModal() {
    const modal = document.getElementById("dersverse-kumbara-modal");
    if (modal) modal.style.display = "none";
}

function addQuestionToKumbara() {
    const noteEl = document.getElementById("kumbara-note");
    const linkEl = document.getElementById("kumbara-link");

    const note = noteEl ? noteEl.value.trim() : "";
    const link = linkEl ? linkEl.value.trim() : "";

    if (!note) {
        alert("Lütfen soru için bir not girin.");
        return;
    }

    const questions = JSON.parse(localStorage.getItem("dersverse_kumbara") || "[]");
    questions.push({ note, link });
    localStorage.setItem("dersverse_kumbara", JSON.stringify(questions));

    if (noteEl) noteEl.value = "";
    if (linkEl) linkEl.value = "";

    addXP(15);
    renderKumbara();
}

function renderKumbara() {
    const questions = JSON.parse(localStorage.getItem("dersverse_kumbara") || "[]");
    const listEl = document.getElementById("kumbara-list");
    if (!listEl) return;

    listEl.innerHTML = "";

    if (questions.length === 0) {
        listEl.innerHTML = "<p style='color: var(--dersverse-text-muted); font-size: 0.9rem;'>Henüz kaydedilmiş soru yok.</p>";
        return;
    }

    questions.forEach((q) => {
        const item = document.createElement("div");
        item.className = "question-card";
        item.style.cssText = "background: rgba(255,255,255,0.05); padding: 8px; margin-top: 5px; border-radius: 6px; border: 1px solid var(--dersverse-border, #333);";
        item.innerHTML = `
            <strong>${escapeHtml(q.note)}</strong>
            ${q.link ? `<br><a href="${escapeHtml(q.link)}" target="_blank" style="color:#6366f1; font-size: 0.85rem; text-decoration: underline;">🔗 Soruyu Gör / Linke Git</a>` : ''}
        `;
        listEl.appendChild(item);
    });
}

// Kullanıcı Oturum Kontrolü ve Rozet Desteği
async function dersverseCheckUser() {
    const { data: { user } } = await dersverseSupabase.auth.getUser();
    const authBtn = document.getElementById('dersverse-auth-btn');
    if (authBtn) {
        if (user) {
            let displayName = user.user_metadata?.full_name || user.email.split('@')[0];
            let badge = '';
            if (user.email === 'femememe1973@gmail.com') {
                displayName = 'Kadir Eymen Açıkoğlu';
                badge = ' ✔️ 🔨';
            }
            authBtn.innerText = 'Çıkış Yap (' + displayName + badge + ')';
        } else {
            authBtn.innerText = 'Kayıt Ol / Giriş Yap';
        }
    }
    dersverseSetupProtection(user);
}

// Geliştirici Kısıtlamaları (Admin Hariç Koruma)
function dersverseSetupProtection(user) {
    const isAdmin = user && user.email === 'femememe1973@gmail.com';
    if (isAdmin) return;

    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => {
        if (e.key === 'F12' || 
            (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S')) ||
            (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key))) {
            e.preventDefault();
            return false;
        }
    });
}

// Giriş/Çıkış Yönlendirme Mantığı
async function dersverseHandleAuth() {
    const { data: { user } } = await dersverseSupabase.auth.getUser();
    if (user) {
        await dersverseSupabase.auth.signOut();
        window.location.reload();
    } else {
        window.location.href = "login.html";
    }
}

function dersverseOpenModal() { 
    const modal = document.getElementById('dersverse-add-modal');
    if (modal) modal.style.display = 'flex'; 
}

function dersverseCloseModal() { 
    const modal = document.getElementById('dersverse-add-modal');
    if (modal) modal.style.display = 'none'; 
}

// Onaylanmış İçerikleri Yükleme
async function dersverseLoadContents() {
    const grid = document.getElementById('dersverse-content-grid');
    if (!grid) return;

    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--dersverse-text-muted);">İçerikler yükleniyor...</p>';

    const { data, error } = await dersverseSupabase
        .from('contents')
        .select('*')
        .eq('status', 'approved');

    if (error) {
        console.error("Veri yüklenirken hata:", error);
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #ef4444;">Yükleme sırasında hata oluştu.</p>';
        return;
    }

    dersverseAllContents = data || [];
    dersverseRenderContents(dersverseAllContents);
}

// İçerik Kartlarını Ekrana Basma
function dersverseRenderContents(contents) {
    const grid = document.getElementById('dersverse-content-grid');
    if (!grid) return;

    if (!contents || contents.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--dersverse-text-muted);">Aradığınız kriterlere uygun içerik bulunamadı.</p>';
        return;
    }

    grid.innerHTML = contents.map(item => {
        let authorDisplay = escapeHtml(item.user_name || 'Kullanıcı');
        let authorBadge = '';
        
        if (authorDisplay === 'Kadir Eymen Açıkoğlu' || (item.user_email && item.user_email === 'femememe1973@gmail.com')) {
            authorDisplay = 'Kadir Eymen Açıkoğlu';
            authorBadge = ' ✔️ 🔨';
        }

        const linkUrl = item.link || item.download_url || '#';

        return `
            <div class="dersverse-card">
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <span class="dersverse-card-tag" style="margin-bottom:0;">${escapeHtml(item.category || 'Genel')}</span>
                    </div>
                    <h3 class="dersverse-card-title">${escapeHtml(item.title)}</h3>
                    <p class="dersverse-card-desc">${escapeHtml(item.description)}</p>
                    <p style="font-size: 0.8rem; color: var(--dersverse-text-muted); margin-bottom: 1rem;">Paylaşan: ${authorDisplay} <span style="color: #6366f1;">${authorBadge}</span></p>
                </div>
                <a href="${escapeHtml(linkUrl)}" target="_blank" class="dersverse-btn dersverse-btn-outline" style="text-align: center; text-decoration: none;" onclick="addXP(10)">Detayları Gör & İncele (+10 XP)</a>
            </div>
        `;
    }).join('');
}

// Arama ve Kategori Filtreleme Mantığı
function dersverseFilterContents() {
    const searchInput = document.getElementById('dersverse-search-input');
    const categoryFilter = document.getElementById('dersverse-category-filter');
    
    const searchVal = searchInput ? searchInput.value.toLowerCase() : '';
    const categoryVal = categoryFilter ? categoryFilter.value : 'Tümü';

    const filtered = dersverseAllContents.filter(item => {
        const titleMatch = item.title && item.title.toLowerCase().includes(searchVal);
        const descMatch = item.description && item.description.toLowerCase().includes(searchVal);
        const matchesSearch = titleMatch || descMatch;

        const matchesCategory = categoryVal === 'Tümü' || item.category === categoryVal;

        return matchesSearch && matchesCategory;
    });

    dersverseRenderContents(filtered);
}

// İçerik Ekleme (FlipHTML5/Embed, Dosya Yükleme veya Harici Link Desteğiyle)
async function dersverseSubmitContent(e) {
    e.preventDefault();
    const { data: { user } } = await dersverseSupabase.auth.getUser();

    if (!user) {
        alert('İçerik paylaşabilmek için lütfen giriş yapınız.');
        window.location.href = "login.html";
        return;
    }

    const title = document.getElementById('dersverse-title').value;
    const category = document.getElementById('dersverse-category').value;
    const description = document.getElementById('dersverse-description').value;
    
    const embedInput = document.getElementById('dersverse-embed-link');
    const embedLink = embedInput ? embedInput.value.trim() : '';

    const fileInput = document.getElementById('dersverse-file-upload');
    const file = fileInput ? fileInput.files[0] : null;

    let manualLink = document.getElementById('dersverse-link') ? document.getElementById('dersverse-link').value.trim() : '';
    const submitBtn = document.getElementById('submit-content-btn');

    if (!embedLink && !file && !manualLink) {
        alert("Lütfen bir FlipHTML5/Embed bağlantısı ekleyin, dosya yükleyin ya da harici bir indirme bağlantısı girin!");
        return;
    }

    let contentStatus = 'pending'; 
    let finalLink = manualLink;
    let uploadUrlField = null;

    if (embedLink) {
        finalLink = embedLink;
        contentStatus = 'approved';
    } 
    else if (file) {
        if (submitBtn) {
            submitBtn.innerText = "Yükleniyor... Lütfen Bekleyin";
            submitBtn.disabled = true;
        }

        const fileName = `${Date.now()}_${file.name}`;
        const filePath = `all_media/${fileName}`;

        const { data: uploadData, error: uploadError } = await dersverseSupabase.storage
            .from('uploads')
            .upload(filePath, file);

        if (uploadError) {
            alert("Dosya yükleme hatası: " + uploadError.message);
            if (submitBtn) {
                submitBtn.innerText = "Paylaş";
                submitBtn.disabled = false;
            }
            return;
        }

        const { data: urlData } = dersverseSupabase.storage
            .from('uploads')
            .getPublicUrl(filePath);

        uploadUrlField = urlData.publicUrl;
        finalLink = urlData.publicUrl;
        contentStatus = 'approved'; 
    } 
    else {
        contentStatus = 'pending';
    }

    let userName = user.user_metadata?.full_name || user.email.split('@')[0];
    if (user.email === 'femememe1973@gmail.com') {
        userName = 'Kadir Eymen Açıkoğlu';
    }

    const { error: dbError } = await dersverseSupabase.from('contents').insert([{
        title,
        category,
        description,
        link: finalLink,
        download_url: uploadUrlField,
        user_id: user.id,
        user_name: userName,
        user_email: user.email,
        status: contentStatus
    }]);

    if (dbError) {
        alert('Hata: ' + dbError.message);
        if (submitBtn) {
            submitBtn.innerText = "Paylaş";
            submitBtn.disabled = false;
        }
    } else {
        addXP(20);
        if (contentStatus === 'approved') {
            alert('İçeriğiniz/FlipHTML5 yayınınız başarıyla kaydedildi ve yayınlandı! (+20 XP)');
        } else {
            alert('İçerik bağlantınız başarıyla iletildi. Yönetici onayından sonra yayınlanacaktır. (+20 XP)');
        }
        dersverseCloseModal();
        const form = document.getElementById('dersverse-content-form');
        if (form) form.reset();
        if (submitBtn) {
            submitBtn.innerText = "Paylaş";
            submitBtn.disabled = false;
        }
        dersverseLoadContents(); 
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Otomatik Başlatma İşlemleri
window.onload = () => {
    startLGSTimer();
    loadSavedTheme();
    updateUserStats();
    dersverseCheckUser();
    dersverseLoadContents();
};
