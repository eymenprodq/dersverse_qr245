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
            
            // Eğer XP Katlayıcı Aktifse Çift XP Kazan
            const boosterActive = localStorage.getItem("dersverse_xp_booster") === "true";
            const earnedXP = boosterActive ? 100 : 50;
            
            addXP(earnedXP);
            alert(`Tebrikler! Pomodoro seansını tamamladınız ve +${earnedXP} XP kazandınız!${boosterActive ? ' (XP Katlayıcı Aktif!)' : ''}`);
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

// --- 4. GELİŞMİŞ GAMIFICATION / İŞLEVSEL ULTRA MAĞAZA ---
let userPoints = parseInt(localStorage.getItem("dersverse_xp") || "100");
let userInventory = JSON.parse(localStorage.getItem("dersverse_inventory") || "[]");
let activeTitle = localStorage.getItem("dersverse_active_title") || "🔥 LGS Canavarı";
let activeThemeEffect = localStorage.getItem("dersverse_active_effect") || "none";
let activeAudioTheme = localStorage.getItem("dersverse_active_audio") || "none";

function addXP(amount) {
    userPoints += amount;
    localStorage.setItem("dersverse_xp", userPoints);
    updateUserStats();
}

function deductXP(amount) {
    if (userPoints >= amount) {
        userPoints -= amount;
        localStorage.setItem("dersverse_xp", userPoints);
        updateUserStats();
        return true;
    }
    return false;
}

function updateUserStats() {
    const pointsEl = document.getElementById("user-points");
    const badgeEl = document.getElementById("user-badge");

    if (pointsEl) pointsEl.innerText = userPoints;
    if (badgeEl) badgeEl.innerText = activeTitle;
}

function openShopModal() {
    const modal = document.getElementById("dersverse-shop-modal");
    if (modal) {
        modal.style.display = "flex";
        renderShop();
    }
}

function closeShopModal() {
    const modal = document.getElementById("dersverse-shop-modal");
    if (modal) modal.style.display = "none";
}

// İşlevsel ve Çeşitlendirilmiş Mağaza Ögeleri
const shopItems = [
    // --- BÖLÜM 1: ÇALIŞAN ŞANS SANDIKLARI (GİZEMLİ KUTULAR) ---
    { id: 'chest_1', name: '🎁 Bronz Şans Sandığı', cost: 100, type: 'chest', value: 'bronz', desc: 'İçinden 50-300 arası XP veya rastgele Unvan çıkar!' },
    { id: 'chest_2', name: '🎁 Gümüş Şans Sandığı', cost: 250, type: 'chest', value: 'gumus', desc: 'İçinden 150-600 arası XP veya Ses Paketi çıkar!' },
    { id: 'chest_3', name: '🎁 Altın Şans Sandığı', cost: 500, type: 'chest', value: 'altin', desc: 'İçinden 400-1200 arası XP veya Özel Efekt çıkar!' },
    { id: 'chest_4', name: '👑 Efsanevi Krallık Sandığı', cost: 1000, type: 'chest', value: 'efsanevi', desc: 'Çok yüksek XP ve Garantili Efsanevi Perk içerir!' },

    // --- BÖLÜM 2: GÜÇLENDİRİCİLER & PERKLER (BOOSTERS) ---
    { id: 'boost_1', name: '⚡ 2x XP Katlayıcı İksir', cost: 300, type: 'booster', value: 'xp_double', desc: 'Pomodoro ve soru ekleme kazançlarını 2 katına çıkarır.' },
    { id: 'boost_2', name: '🛡️ Seri Koruma Kalkanı', cost: 200, type: 'booster', value: 'streak_shield', desc: 'Giremediğin günlerde çalışma serini korur.' },
    { id: 'boost_3', name: '📌 Soru Öne Çıkarma Biletı', cost: 150, type: 'perk', value: 'pin_question', desc: 'Kumbaradaki sorunu ana sayfada üst sıraya taşır.' },

    // --- BÖLÜM 3: ÇALIŞMA SES PAKETLERİ (AMBİYANS) ---
    { id: 'audio_1', name: '🌧️ Gece Yağmuru Odaklanma Sesi', cost: 180, type: 'audio', value: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_4a0e10b2df.mp3', desc: 'Arka planda dinlendirici yağmur sesi çalar.' },
    { id: 'audio_2', name: '☕ Lofi Kütüphane Ambiyansı', cost: 220, type: 'audio', value: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', desc: 'Çalışırken dinlenebilecek Lofi çalışma sesleri.' },
    { id: 'audio_3', name: '🔥 Şömine Ateşi Çatırtısı', cost: 150, type: 'audio', value: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', desc: 'Odaklanmayı artıran sıcak şömine sesi.' },

    // --- BÖLÜM 4: GÖRSEL EFEKTLER & TEMALAR ---
    { id: 'effect_1', name: '✨ Neon Işıklı Profil Aurası', cost: 350, type: 'effect', value: 'neon-border', desc: 'Profil çerçevene neon ışık efekti verir.' },
    { id: 'effect_2', name: '🔥 Alevli İsim Çerçevesi', cost: 400, type: 'effect', value: 'fire-aura', desc: 'Kullanıcı adının arkasında alev efektleri çıkartır.' },
    { id: 'effect_3', name: '🌌 Galaksi Yıldız Arka Planı', cost: 450, type: 'effect', value: 'galaxy-bg', desc: 'Arayüze galaksi temalı arka plan kazandırır.' },

    // --- BÖLÜM 5: HAUS UNVANLARI ---
    { id: 'title_1', name: '🧠 LGS Dahisi', cost: 150, type: 'title', value: '🧠 LGS Dahisi', desc: 'Unvan olarak profilinde görünür.' },
    { id: 'title_2', name: '⚡ Ders Efsanesi', cost: 300, type: 'title', value: '⚡ Ders Efsanesi', desc: 'Unvan olarak profilinde görünür.' },
    { id: 'title_3', name: '👑 LGS Birincisi', cost: 500, type: 'title', value: '👑 LGS Birincisi', desc: 'Unvan olarak profilinde görünür.' },
    { id: 'title_4', name: '🚀 Matematik Canavarı', cost: 200, type: 'title', value: '🚀 Matematik Canavarı', desc: 'Unvan olarak profilinde görünür.' },
    { id: 'title_5', name: '🧪 Fen Kurdu', cost: 200, type: 'title', value: '🧪 Fen Kurdu', desc: 'Unvan olarak profilinde görünür.' },
    { id: 'title_6', name: '💡 Paragraf Kralı', cost: 220, type: 'title', value: '💡 Paragraf Kralı', desc: 'Unvan olarak profilinde görünür.' },
    { id: 'title_7', name: '🎯 Hedef 500 Puan', cost: 600, type: 'title', value: '🎯 Hedef 500 Puan', desc: 'Unvan olarak profilinde görünür.' },
    { id: 'title_8', name: '🦾 Sayborg Beyin', cost: 450, type: 'title', value: '🦾 Sayborg Beyin', desc: 'Unvan olarak profilinde görünür.' },
    { id: 'title_9', name: '🐉 Ejderha Zihni', cost: 750, type: 'title', value: '🐉 Ejderha Zihni', desc: 'Unvan olarak profilinde görünür.' },
    { id: 'title_10', name: '🏔️ Zirvedeki Tek', cost: 1000, type: 'title', value: '🏔️ Zirvedeki Tek', desc: 'Unvan olarak profilinde görünür.' }
];

function renderShop() {
    const shopList = document.getElementById("shop-items-container");
    if (!shopList) return;

    shopList.innerHTML = shopItems.map(item => {
        const isOwned = userInventory.includes(item.id);
        const isEquipped = (item.type === 'title' && activeTitle === item.value) || 
                           (item.type === 'effect' && activeThemeEffect === item.value) ||
                           (item.type === 'audio' && activeAudioTheme === item.value);

        let buttonText = "Satın Al";
        let buttonAction = `buyShopItem('${item.id}', ${item.cost})`;

        if (isOwned) {
            if (item.type === 'chest') {
                buttonText = "📦 Aç";
                buttonAction = `openChest('${item.value}')`;
            } else if (item.type === 'booster' || item.type === 'perk') {
                buttonText = "⚡ Kullan";
                buttonAction = `usePerk('${item.id}', '${item.value}')`;
            } else if (isEquipped) {
                buttonText = "Kullanılıyor";
                buttonAction = "";
            } else {
                buttonText = "Kuşan / Aktif Et";
                buttonAction = `equipItem('${item.type}', '${item.value}')`;
            }
        }

        return `
            <div style="background: rgba(255,255,255,0.05); padding: 12px; margin-bottom: 10px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--dersverse-border, #333);">
                <div>
                    <strong>${item.name}</strong><br>
                    <small style="color: #aaa;">${item.desc || ''}</small><br>
                    <small style="color: #6366f1; font-weight: bold;">Maliyet: ${item.cost} XP</small>
                </div>
                <div>
                    ${isEquipped 
                        ? `<span style="color:#10b981; font-weight:bold;">Aktif</span>`
                        : `<button class="dersverse-btn ${isOwned ? 'dersverse-btn-outline' : ''}" onclick="${buttonAction}">${buttonText}</button>`
                    }
                </div>
            </div>
        `;
    }).join('');
}

function buyShopItem(itemId, cost) {
    if (userInventory.includes(itemId)) {
        alert("Bu eşyaya zaten sahipsiniz!");
        return;
    }

    if (deductXP(cost)) {
        userInventory.push(itemId);
        localStorage.setItem("dersverse_inventory", JSON.stringify(userInventory));
        
        const item = shopItems.find(i => i.id === itemId);
        if (item) {
            if (item.type === 'title') equipItem('title', item.value);
            if (item.type === 'effect') equipItem('effect', item.value);
        }
        
        alert("Satın alma başarılı! Ürün çantanıza eklendi.");
        renderShop();
    } else {
        alert("Yetersiz XP! Pomodoro tamamlayarak veya soru ekleyerek XP kazanabilirsiniz.");
    }
}

// Öğe Kuşanma / Aktif Etme Mantığı
function equipItem(type, value) {
    if (type === 'title') {
        activeTitle = value;
        localStorage.setItem("dersverse_active_title", activeTitle);
    } else if (type === 'effect') {
        activeThemeEffect = value;
        localStorage.setItem("dersverse_active_effect", activeThemeEffect);
        applyThemeEffect(value);
    } else if (type === 'audio') {
        activeAudioTheme = value;
        localStorage.setItem("dersverse_active_audio", activeAudioTheme);
        playAudioTheme(value);
    }
    updateUserStats();
    renderShop();
}

// Şans Sandığı Açma Sistemi
function openChest(chestType) {
    let rewardXP = 0;
    if (chestType === 'bronz') rewardXP = Math.floor(Math.random() * 250) + 50;
    if (chestType === 'gumus') rewardXP = Math.floor(Math.random() * 450) + 150;
    if (chestType === 'altin') rewardXP = Math.floor(Math.random() * 800) + 400;
    if (chestType === 'efsanevi') rewardXP = Math.floor(Math.random() * 1500) + 800;

    addXP(rewardXP);
    alert(`🎉 TEBRİKLER! Sandıktan +${rewardXP} XP Çıktı!`);
    renderShop();
}

// Perk / Güçlendirici Kullanma
function usePerk(itemId, perkValue) {
    if (perkValue === 'xp_double') {
        localStorage.setItem("dersverse_xp_booster", "true");
        alert("⚡ 2x XP Katlayıcı Aktif Edildi! Artık kazandığınız XP'ler 2 katına çıkacak.");
    } else if (perkValue === 'streak_shield') {
        alert("🛡️ Seri Koruma Kalkanı Aktif! Çalışma seriniz güvende.");
    } else if (perkValue === 'pin_question') {
        alert("📌 Soru Öne Çıkarma Bileti Kullanıldı! Bir sonraki eklediğiniz soru öne çıkarılacak.");
    }
}

// Temaya Görsel Efekt Uygulama Mantığı
function applyThemeEffect(effectClass) {
    document.body.classList.remove('neon-border', 'fire-aura', 'galaxy-bg');
    if (effectClass && effectClass !== 'none') {
        document.body.classList.add(effectClass);
    }
}

// Arka Plan Ses Ambiyansı Oynatıcı
let currentAudioPlayer = null;
function playAudioTheme(audioUrl) {
    if (currentAudioPlayer) {
        currentAudioPlayer.pause();
    }
    if (audioUrl && audioUrl !== 'none') {
        currentAudioPlayer = new Audio(audioUrl);
        currentAudioPlayer.loop = true;
        currentAudioPlayer.volume = 0.3;
        currentAudioPlayer.play().catch(e => console.log("Oynatma engellendi:", e));
        alert("🎵 Odaklanma ses paketi aktif edildi!");
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

    const boosterActive = localStorage.getItem("dersverse_xp_booster") === "true";
    const earnedXP = boosterActive ? 30 : 15;

    addXP(earnedXP);
    renderKumbara();
    alert(`Soru kaydedildi! (+${earnedXP} XP Kazandınız)${boosterActive ? ' (XP Katlayıcı Aktif!)' : ''}`);
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

// --- 6. KULLANICI ENGELLEME KONTROLÜ ---
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
                    <a href="${detailUrl}" class="dersverse-btn dersverse-btn-outline" style="flex: 1; text-align: center; text-decoration: none; font-size: 0.8rem; padding: 8px 4px;" onclick="addXP(10)">💬 Detay & Yorum</a>
                    <a href="${escapeHtml(linkUrl)}" target="_blank" class="dersverse-btn" style="flex: 1; text-align: center; text-decoration: none; font-size: 0.8rem; padding: 8px 4px;">🚀 Kitaba Git</a>
                </div>
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

// İçerik Ekleme
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
        const boosterActive = localStorage.getItem("dersverse_xp_booster") === "true";
        const earnedXP = boosterActive ? 40 : 20;

        addXP(earnedXP);
        if (contentStatus === 'approved') {
            alert(`İçeriğiniz başarıyla yayınlandı! (+${earnedXP} XP)${boosterActive ? ' (XP Katlayıcı Aktif!)' : ''}`);
        } else {
            alert(`İçerik bağlantınız iletildi. Onaylandıktan sonra yayınlanacaktır. (+${earnedXP} XP)`);
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

// --- SUPABASE XP ÇEKME VE CANLI DİNLEME SİSTEMİ ---
async function loadUserXP() {
    if (!dersverseSupabase) return;

    try {
        const { data: { user }, error: authError } = await dersverseSupabase.auth.getUser();

        if (authError || !user) return;

        const { data, error } = await dersverseSupabase
            .from('profiles')
            .select('xp')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error("XP çekilirken hata oluştu:", error.message);
            return;
        }

        if (data) {
            userPoints = data.xp || 0;
            localStorage.setItem("dersverse_xp", userPoints);
            updateUserStats();
        }
    } catch (err) {
        console.error("loadUserXP çalışırken beklenmeyen hata:", err);
    }
}

async function listenXPChanges() {
    if (!dersverseSupabase) return;

    const { data: { user } } = await dersverseSupabase.auth.getUser();
    if (!user) return;

    dersverseSupabase
        .channel('public:profiles:' + user.id)
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'profiles',
                filter: `id=eq.${user.id}`
            },
            (payload) => {
                if (payload.new && typeof payload.new.xp !== 'undefined') {
                    console.log("Canlı XP Güncellendi:", payload.new.xp);
                    userPoints = payload.new.xp;
                    localStorage.setItem("dersverse_xp", userPoints);
                    updateUserStats();
                }
            }
        )
        .subscribe();
}

// Otomatik Başlatma İşlemleri
window.onload = () => {
    startLGSTimer();
    loadSavedTheme();
    updateUserStats();
    dersverseCheckUser();
    loadUserXP();
    listenXPChanges();
    dersverseLoadContents();
    checkUserBannedStatus();
    applyThemeEffect(activeThemeEffect);
    if (activeAudioTheme !== 'none') playAudioTheme(activeAudioTheme);
};
