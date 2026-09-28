// DersVerse - Supabase Bağlantı Yapılandırması
const DERSVERSE_SUPABASE_URL = 'https://dyxghgzquvsngehjjvcb.supabase.co';
const DERSVERSE_SUPABASE_KEY = 'sb_publishable_qgcYdZz60VDBkfLZ3UVftw_G9o30nYd'; 
const dersverseSupabase = supabase.createClient(DERSVERSE_SUPABASE_URL, DERSVERSE_SUPABASE_KEY);

let dersverseAllContents = [];
let currentLoggedInUser = null;

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
    
    localStorage.setItem("dersverse_theme", isLight ? "light" : "dark");
    
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
            alert("Pomodoro seansı tamamlandı! Harika odaklandın.");
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

// --- 4. SORU KUMBARASI MODAL YÖNETİMİ ---
function openSoruKumbarasiModal() {
    const modal = document.getElementById('dersverse-soru-kumbarasi-modal');
    if (modal) modal.style.display = 'flex';
}

function closeSoruKumbarasiModal() {
    const modal = document.getElementById('dersverse-soru-kumbarasi-modal');
    if (modal) modal.style.display = 'none';
}

// --- 5. KULLANICI ENGELLEME VE OTURUM KONTROLÜ ---
async function checkUserBannedStatus() {
    try {
        const { data: { user } } = await dersverseSupabase.auth.getUser();
        if (!user) return;

        if (user.email === 'femememe1973@gmail.com') return;

        const { data, error } = await dersverseSupabase
            .from('profiles')
            .select('is_banned')
            .eq('id', user.id)
            .single();

        if (data && data.is_banned) {
            window.location.href = 'engellendiniz.html';
        }
    } catch (err) {
        console.error("Engelleme kontrolü hatası:", err);
    }
}

async function dersverseCheckUser() {
    const { data: { user } } = await dersverseSupabase.auth.getUser();
    currentLoggedInUser = user;
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

async function dersverseLoadContents() {
    const grid = document.getElementById('dersverse-content-grid');
    if (!grid) return;

    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--dersverse-text-muted);">İçerikler yükleniyor...</p>';

    const { data, error } = await dersverseSupabase
        .from('contents')
        .select('*')
        .eq('status', 'approved');

    if (error) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #ef4444;">Yükleme sırasında hata oluştu.</p>';
        return;
    }

    dersverseAllContents = data || [];
    dersverseRenderContents(dersverseAllContents);
}

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
        const detailUrl = item.id ? `detay.html?id=${item.id}` : '#';

        return `
            <div class="dersverse-card" style="display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <span class="dersverse-card-tag" style="margin-bottom:0;">${escapeHtml(item.category || 'Genel')}</span>
                    </div>
                    <h3 class="dersverse-card-title">${escapeHtml(item.title)}</h3>
                    <p class="dersverse-card-desc">${escapeHtml(item.description)}</p>
                    <p style="font-size: 0.8rem; color: var(--dersverse-text-muted); margin-bottom: 1rem;">Paylaşan: ${authorDisplay} <span style="color: #6366f1;">${authorBadge}</span></p>
                </div>
                
                <div style="display: flex; gap: 8px; margin-top: 10px;">
                    <a href="${detailUrl}" class="dersverse-btn dersverse-btn-outline" style="flex: 1; text-align: center; text-decoration: none; font-size: 0.8rem; padding: 8px 4px;">💬 Detay & Yorum</a>
                    <a href="${escapeHtml(linkUrl)}" target="_blank" class="dersverse-btn" style="flex: 1; text-align: center; text-decoration: none; font-size: 0.8rem; padding: 8px 4px;">🚀 Kitaba Git</a>
                </div>
            </div>
        `;
    }).join('');
}

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

async function dersverseSubmitContent(e) {
    e.preventDefault();
    const { data: { user } } = await dersverseSupabase.auth.getUser();

    if (!user) {
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
            submitBtn.innerText = "Yükleniyor...";
            submitBtn.disabled = true;
        }

        const fileName = `${Date.now()}_${file.name}`;
        const filePath = `all_media/${fileName}`;

        const { data: uploadData, error: uploadError } = await dersverseSupabase.storage
            .from('uploads')
            .upload(filePath, file);

        if (uploadError) {
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

    if (!dbError) {
        dersverseCloseModal();
        const form = document.getElementById('dersverse-content-form');
        if (form) form.reset();
        dersverseLoadContents(); 
    }

    if (submitBtn) {
        submitBtn.innerText = "Paylaş";
        submitBtn.disabled = false;
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
    dersverseCheckUser();
    dersverseLoadContents();
    checkUserBannedStatus();
};
