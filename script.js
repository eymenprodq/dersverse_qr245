// DersVerse - Supabase Bağlantı Yapılandırması[cite: 5]
const DERSVERSE_SUPABASE_URL = 'https://dyxghgzquvsngehjjvcb.supabase.co'; //[cite: 5]
const DERSVERSE_SUPABASE_KEY = 'sb_publishable_qgcYdZz60VDBkfLZ3UVftw_G9o30nYd';  //[cite: 5]
const dersverseSupabase = supabase.createClient(DERSVERSE_SUPABASE_URL, DERSVERSE_SUPABASE_KEY); //[cite: 5]

let dersverseAllContents = []; //[cite: 5]

// --- 1. LGS CANLI GERİ SAYIM SAYACI ---
function startLGSTimer() { //[cite: 5]
    const lgsDate = new Date("June 6, 2027 09:30:00").getTime(); //[cite: 5]
    setInterval(function() { //[cite: 5]
        const now = new Date().getTime(); //[cite: 5]
        const distance = lgsDate - now; //[cite: 5]

        const el = document.getElementById("lgs-countdown"); //[cite: 5]
        if (!el) return; //[cite: 5]

        if (distance < 0) { //[cite: 5]
            el.innerText = "Sınav Başladı!"; //[cite: 5]
            return; //[cite: 5]
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24)); //[cite: 5]
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); //[cite: 5]
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)); //[cite: 5]
        const seconds = Math.floor((distance % (1000 * 60)) / 1000); //[cite: 5]

        el.innerText = `${days} Gün ${hours} Saat ${minutes} Dk ${seconds} Sn`; //[cite: 5]
    }, 1000); //[cite: 5]
}

// --- 2. TEMA DEĞİŞTİRME (DARK / LIGHT MODE) ---
function dersverseToggleTheme() { //[cite: 5]
    document.body.classList.toggle("light-theme"); //[cite: 5]
    const isLight = document.body.classList.contains("light-theme"); //[cite: 5]
    
    localStorage.setItem("dersverse_theme", isLight ? "light" : "dark"); //[cite: 5]
    
    const btn = document.getElementById("dersverse-theme-toggle"); //[cite: 5]
    if (btn) { //[cite: 5]
        btn.innerText = isLight ? "🌙 Gece Modu" : "☀️ Gündüz Modu"; //[cite: 5]
    }
}

function loadSavedTheme() { //[cite: 5]
    const savedTheme = localStorage.getItem("dersverse_theme"); //[cite: 5]
    const btn = document.getElementById("dersverse-theme-toggle"); //[cite: 5]
    
    if (savedTheme === "light") { //[cite: 5]
        document.body.classList.add("light-theme"); //[cite: 5]
        if (btn) btn.innerText = "🌙 Gece Modu"; //[cite: 5]
    } else {
        document.body.classList.remove("light-theme"); //[cite: 5]
        if (btn) btn.innerText = "☀️ Gündüz Modu"; //[cite: 5]
    }
}

// --- 3. POMODORO KRONOMETRESİ ---
let pomoInterval = null; //[cite: 5]
let pomoTimeLeft = 25 * 60; //[cite: 5]
let isPomoRunning = false; //[cite: 5]

function openPomodoroModal() { //[cite: 5]
    const modal = document.getElementById("dersverse-pomodoro-modal"); //[cite: 5]
    if (modal) modal.style.display = "flex"; //[cite: 5]
}

function closePomodoroModal() { //[cite: 5]
    const modal = document.getElementById("dersverse-pomodoro-modal"); //[cite: 5]
    if (modal) modal.style.display = "none"; //[cite: 5]
}

function updatePomoDisplay() { //[cite: 5]
    const minutes = Math.floor(pomoTimeLeft / 60); //[cite: 5]
    const seconds = pomoTimeLeft % 60; //[cite: 5]
    const display = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; //[cite: 5]
    const el = document.getElementById("pomodoro-timer-display"); //[cite: 5]
    if (el) el.innerText = display; //[cite: 5]
}

function startPomodoro() { //[cite: 5]
    if (isPomoRunning) return; //[cite: 5]
    isPomoRunning = true; //[cite: 5]
    pomoInterval = setInterval(() => { //[cite: 5]
        if (pomoTimeLeft > 0) { //[cite: 5]
            pomoTimeLeft--; //[cite: 5]
            updatePomoDisplay(); //[cite: 5]
        } else {
            clearInterval(pomoInterval); //[cite: 5]
            isPomoRunning = false; //[cite: 5]
            addXP(50); //[cite: 5]
            alert("Tebrikler! Pomodoro seansını tamamladınız ve +50 XP kazandınız!"); //[cite: 5]
        }
    }, 1000); //[cite: 5]
}

function pausePomodoro() { //[cite: 5]
    clearInterval(pomoInterval); //[cite: 5]
    isPomoRunning = false; //[cite: 5]
}

function resetPomodoro() { //[cite: 5]
    pausePomodoro(); //[cite: 5]
    pomoTimeLeft = 25 * 60; //[cite: 5]
    updatePomoDisplay(); //[cite: 5]
}

// --- 4. GELİŞMİŞ GAMIFICATION / PUAN VE MAĞAZA SİSTEMİ ---
let userPoints = parseInt(localStorage.getItem("dersverse_xp") || "100"); //[cite: 5]
let userInventory = JSON.parse(localStorage.getItem("dersverse_inventory") || "[]"); //[cite: 5]
let activeTitle = localStorage.getItem("dersverse_active_title") || "🔥 LGS Canavarı"; //[cite: 5]

function addXP(amount) { //[cite: 5]
    userPoints += amount; //[cite: 5]
    localStorage.setItem("dersverse_xp", userPoints); //[cite: 5]
    updateUserStats(); //[cite: 5]
}

function deductXP(amount) { //[cite: 5]
    if (userPoints >= amount) { //[cite: 5]
        userPoints -= amount; //[cite: 5]
        localStorage.setItem("dersverse_xp", userPoints); //[cite: 5]
        updateUserStats(); //[cite: 5]
        return true; //[cite: 5]
    }
    return false; //[cite: 5]
}

function updateUserStats() { //[cite: 5]
    const pointsEl = document.getElementById("user-points"); //[cite: 5]
    const badgeEl = document.getElementById("user-badge"); //[cite: 5]

    if (pointsEl) pointsEl.innerText = userPoints; //[cite: 5]
    if (badgeEl) badgeEl.innerText = activeTitle; //[cite: 5]
}

function openShopModal() { //[cite: 5]
    const modal = document.getElementById("dersverse-shop-modal"); //[cite: 5]
    if (modal) {
        modal.style.display = "flex"; //[cite: 5]
        renderShop(); //[cite: 5]
    }
}

function closeShopModal() { //[cite: 5]
    const modal = document.getElementById("dersverse-shop-modal"); //[cite: 5]
    if (modal) modal.style.display = "none"; //[cite: 5]
}

const shopItems = [ //[cite: 5]
    { id: 'title_dahi', name: '🧠 LGS Dahisi Unvanı', cost: 150, type: 'title', value: '🧠 LGS Dahisi' }, //[cite: 5]
    { id: 'title_efsane', name: '⚡ Ders Efsanesi Unvanı', cost: 300, type: 'title', value: '⚡ Ders Efsanesi' }, //[cite: 5]
    { id: 'title_derece', name: '👑 LGS Birincisi Unvanı', cost: 500, type: 'title', value: '👑 LGS Birincisi' } //[cite: 5]
];

function renderShop() { //[cite: 5]
    const shopList = document.getElementById("shop-items-container"); //[cite: 5]
    if (!shopList) return; //[cite: 5]

    shopList.innerHTML = shopItems.map(item => { //[cite: 5]
        const isOwned = userInventory.includes(item.id); //[cite: 5]
        const isActive = activeTitle === item.value; //[cite: 5]

        return `
            <div style="background: rgba(255,255,255,0.05); padding: 12px; margin-bottom: 10px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--dersverse-border, #333);">
                <div>
                    <strong>${item.name}</strong><br>
                    <small style="color: #6366f1;">Maliyet: ${item.cost} XP</small>
                </div>
                <div>
                    ${isOwned 
                        ? (isActive 
                            ? `<span style="color:#10b981; font-weight:bold;">Kullanılıyor</span>`
                            : `<button class="dersverse-btn dersverse-btn-outline" onclick="equipTitle('${item.value}')">Kuşan</button>`)
                        : `<button class="dersverse-btn" onclick="buyShopItem('${item.id}',${item.cost})">Satın Al</button>`
                    }
                </div>
            </div>
        `; //[cite: 5]
    }).join('');
}

function buyShopItem(itemId, cost) { //[cite: 5]
    if (userInventory.includes(itemId)) { //[cite: 5]
        alert("Bu eşyaya zaten sahipsiniz!"); //[cite: 5]
        return; //[cite: 5]
    }

    if (deductXP(cost)) { //[cite: 5]
        userInventory.push(itemId); //[cite: 5]
        localStorage.setItem("dersverse_inventory", JSON.stringify(userInventory)); //[cite: 5]
        
        const item = shopItems.find(i => i.id === itemId); //[cite: 5]
        if (item && item.type === 'title') { //[cite: 5]
            equipTitle(item.value); //[cite: 5]
        }
        
        alert("Satın alma başarılı! Ürün hesabınıza tanımlandı."); //[cite: 5]
        renderShop(); //[cite: 5]
    } else {
        alert("Yetersiz XP! Daha fazla ders çalışarak veya soru ekleyerek XP kazanabilirsiniz."); //[cite: 5]
    }
}

function equipTitle(titleValue) { //[cite: 5]
    activeTitle = titleValue; //[cite: 5]
    localStorage.setItem("dersverse_active_title", activeTitle); //[cite: 5]
    updateUserStats(); //[cite: 5]
    renderShop(); //[cite: 5]
}

// --- 5. SANAL SORU KUMBARASI ---
function openKumbaraModal() { //[cite: 5]
    const modal = document.getElementById("dersverse-kumbara-modal"); //[cite: 5]
    if (modal) {
        modal.style.display = "flex"; //[cite: 5]
        renderKumbara(); //[cite: 5]
    }
}

function closeKumbaraModal() { //[cite: 5]
    const modal = document.getElementById("dersverse-kumbara-modal"); //[cite: 5]
    if (modal) modal.style.display = "none"; //[cite: 5]
}

function addQuestionToKumbara() { //[cite: 5]
    const noteEl = document.getElementById("kumbara-note"); //[cite: 5]
    const linkEl = document.getElementById("kumbara-link"); //[cite: 5]

    const note = noteEl ? noteEl.value.trim() : ""; //[cite: 5]
    const link = linkEl ? linkEl.value.trim() : ""; //[cite: 5]

    if (!note) { //[cite: 5]
        alert("Lütfen soru için bir not girin."); //[cite: 5]
        return; //[cite: 5]
    }

    const questions = JSON.parse(localStorage.getItem("dersverse_kumbara") || "[]"); //[cite: 5]
    questions.push({ note, link }); //[cite: 5]
    localStorage.setItem("dersverse_kumbara", JSON.stringify(questions)); //[cite: 5]

    if (noteEl) noteEl.value = ""; //[cite: 5]
    if (linkEl) linkEl.value = ""; //[cite: 5]

    addXP(15); //[cite: 5]
    renderKumbara(); //[cite: 5]
    alert("Soru kaydedildi! (+15 XP Kazandınız)"); //[cite: 5]
}

function renderKumbara() { //[cite: 5]
    const questions = JSON.parse(localStorage.getItem("dersverse_kumbara") || "[]"); //[cite: 5]
    const listEl = document.getElementById("kumbara-list"); //[cite: 5]
    if (!listEl) return; //[cite: 5]

    listEl.innerHTML = ""; //[cite: 5]

    if (questions.length === 0) { //[cite: 5]
        listEl.innerHTML = "<p style='color: var(--dersverse-text-muted); font-size: 0.9rem;'>Henüz kaydedilmiş soru yok.</p>"; //[cite: 5]
        return; //[cite: 5]
    }

    questions.forEach((q) => { //[cite: 5]
        const item = document.createElement("div"); //[cite: 5]
        item.className = "question-card"; //[cite: 5]
        item.style.cssText = "background: rgba(255,255,255,0.05); padding: 8px; margin-top: 5px; border-radius: 6px; border: 1px solid var(--dersverse-border, #333);"; //[cite: 5]
        item.innerHTML = `
            <strong>${escapeHtml(q.note)}</strong>
            ${q.link ? `<br><a href="${escapeHtml(q.link)}" target="_blank" style="color:#6366f1; font-size: 0.85rem; text-decoration: underline;">🔗 Soruyu Gör / Linke Git</a>` : ''}
        `; //[cite: 5]
        listEl.appendChild(item); //[cite: 5]
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
async function dersverseCheckUser() { //[cite: 5]
    const { data: { user } } = await dersverseSupabase.auth.getUser(); //[cite: 5]
    const authBtn = document.getElementById('dersverse-auth-btn'); //[cite: 5]
    if (authBtn) {
        if (user) {
            let displayName = user.user_metadata?.full_name || user.email.split('@')[0]; //[cite: 5]
            let badge = ''; //[cite: 5]
            if (user.email === 'femememe1973@gmail.com') { //[cite: 5]
                displayName = 'Kadir Eymen Açıkoğlu'; //[cite: 5]
                badge = ' ✔️ 🔨'; //[cite: 5]
            }
            authBtn.innerText = 'Çıkış Yap (' + displayName + badge + ')'; //[cite: 5]
        } else {
            authBtn.innerText = 'Kayıt Ol / Giriş Yap'; //[cite: 5]
        }
    }
    dersverseSetupProtection(user); //[cite: 5]
}

// Geliştirici Kısıtlamaları (Admin Hariç Koruma)
function dersverseSetupProtection(user) { //[cite: 5]
    const isAdmin = user && user.email === 'femememe1973@gmail.com'; //[cite: 5]
    if (isAdmin) return; //[cite: 5]

    document.addEventListener('contextmenu', e => e.preventDefault()); //[cite: 5]
    document.addEventListener('keydown', e => { //[cite: 5]
        if (e.key === 'F12' || 
            (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S')) ||
            (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key))) { //[cite: 5]
            e.preventDefault(); //[cite: 5]
            return false; //[cite: 5]
        }
    });
}

// Giriş/Çıkış Yönlendirme Mantığı
async function dersverseHandleAuth() { //[cite: 5]
    const { data: { user } } = await dersverseSupabase.auth.getUser(); //[cite: 5]
    if (user) {
        await dersverseSupabase.auth.signOut(); //[cite: 5]
        window.location.reload(); //[cite: 5]
    } else {
        window.location.href = "login.html"; //[cite: 5]
    }
}

function dersverseOpenModal() { //[cite: 5]
    const modal = document.getElementById('dersverse-add-modal'); //[cite: 5]
    if (modal) modal.style.display = 'flex'; //[cite: 5]
}

function dersverseCloseModal() { //[cite: 5]
    const modal = document.getElementById('dersverse-add-modal'); //[cite: 5]
    if (modal) modal.style.display = 'none'; //[cite: 5]
}

// Onaylanmış İçerikleri Yükleme
async function dersverseLoadContents() { //[cite: 5]
    const grid = document.getElementById('dersverse-content-grid'); //[cite: 5]
    if (!grid) return; //[cite: 5]

    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--dersverse-text-muted);">İçerikler yükleniyor...</p>'; //[cite: 5]

    const { data, error } = await dersverseSupabase //[cite: 5]
        .from('contents') //[cite: 5]
        .select('*') //[cite: 5]
        .eq('status', 'approved'); //[cite: 5]

    if (error) { //[cite: 5]
        console.error("Veri yüklenirken hata:", error); //[cite: 5]
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #ef4444;">Yükleme sırasında hata oluştu.</p>'; //[cite: 5]
        return; //[cite: 5]
    }

    dersverseAllContents = data || []; //[cite: 5]
    dersverseRenderContents(dersverseAllContents); //[cite: 5]
}

// İçerik Kartlarını Ekrana Basma (DETAY SAYFASINA YÖNLENDİRME GÜNCELLENDİ)
function dersverseRenderContents(contents) { //[cite: 5]
    const grid = document.getElementById('dersverse-content-grid'); //[cite: 5]
    if (!grid) return; //[cite: 5]

    if (!contents || contents.length === 0) { //[cite: 5]
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--dersverse-text-muted);">Aradığınız kriterlere uygun içerik bulunamadı.</p>'; //[cite: 5]
        return; //[cite: 5]
    }

    grid.innerHTML = contents.map(item => { //[cite: 5]
        let authorDisplay = escapeHtml(item.user_name || 'Kullanıcı'); //[cite: 5]
        let authorBadge = ''; //[cite: 5]
        
        if (authorDisplay === 'Kadir Eymen Açıkoğlu' || (item.user_email && item.user_email === 'femememe1973@gmail.com')) { //[cite: 5]
            authorDisplay = 'Kadir Eymen Açıkoğlu'; //[cite: 5]
            authorBadge = ' ✔️ 🔨'; //[cite: 5]
        }

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
                <a href="detay.html?id=${item.id}" class="dersverse-btn dersverse-btn-outline" style="text-align: center; text-decoration: none;" onclick="addXP(10)">Detayları Gör & İncele (+10 XP)</a>
            </div>
        `; //[cite: 5]
    }).join('');
}

// Arama ve Kategori Filtreleme Mantığı
function dersverseFilterContents() { //[cite: 5]
    const searchInput = document.getElementById('dersverse-search-input'); //[cite: 5]
    const categoryFilter = document.getElementById('dersverse-category-filter'); //[cite: 5]
    
    const searchVal = searchInput ? searchInput.value.toLowerCase() : ''; //[cite: 5]
    const categoryVal = categoryFilter ? categoryFilter.value : 'Tümü'; //[cite: 5]

    const filtered = dersverseAllContents.filter(item => { //[cite: 5]
        const titleMatch = item.title && item.title.toLowerCase().includes(searchVal); //[cite: 5]
        const descMatch = item.description && item.description.toLowerCase().includes(searchVal); //[cite: 5]
        const matchesSearch = titleMatch || descMatch; //[cite: 5]

        const matchesCategory = categoryVal === 'Tümü' || item.category === categoryVal; //[cite: 5]

        return matchesSearch && matchesCategory; //[cite: 5]
    });

    dersverseRenderContents(filtered); //[cite: 5]
}

// İçerik Ekleme
async function dersverseSubmitContent(e) { //[cite: 5]
    e.preventDefault(); //[cite: 5]
    const { data: { user } } = await dersverseSupabase.auth.getUser(); //[cite: 5]

    if (!user) { //[cite: 5]
        alert('İçerik paylaşabilmek için lütfen giriş yapınız.'); //[cite: 5]
        window.location.href = "login.html"; //[cite: 5]
        return; //[cite: 5]
    }

    const title = document.getElementById('dersverse-title').value; //[cite: 5]
    const category = document.getElementById('dersverse-category').value; //[cite: 5]
    const description = document.getElementById('dersverse-description').value; //[cite: 5]
    
    const embedInput = document.getElementById('dersverse-embed-link'); //[cite: 5]
    const embedLink = embedInput ? embedInput.value.trim() : ''; //[cite: 5]

    const fileInput = document.getElementById('dersverse-file-upload'); //[cite: 5]
    const file = fileInput ? fileInput.files[0] : null; //[cite: 5]

    let manualLink = document.getElementById('dersverse-link') ? document.getElementById('dersverse-link').value.trim() : ''; //[cite: 5]
    const submitBtn = document.getElementById('submit-content-btn'); //[cite: 5]

    if (!embedLink && !file && !manualLink) { //[cite: 5]
        alert("Lütfen bir FlipHTML5/Embed bağlantısı ekleyin, dosya yükleyin ya da harici bir indirme bağlantısı girin!"); //[cite: 5]
        return; //[cite: 5]
    }

    let contentStatus = 'pending';  //[cite: 5]
    let finalLink = manualLink; //[cite: 5]
    let uploadUrlField = null; //[cite: 5]

    if (embedLink) { //[cite: 5]
        finalLink = embedLink; //[cite: 5]
        contentStatus = 'approved'; //[cite: 5]
    } 
    else if (file) {
        if (submitBtn) {
            submitBtn.innerText = "Yükleniyor... Lütfen Bekleyin"; //[cite: 5]
            submitBtn.disabled = true; //[cite: 5]
        }

        const fileName = `${Date.now()}_${file.name}`; //[cite: 5]
        const filePath = `all_media/${fileName}`; //[cite: 5]

        const { data: uploadData, error: uploadError } = await dersverseSupabase.storage //[cite: 5]
            .from('uploads') //[cite: 5]
            .upload(filePath, file); //[cite: 5]

        if (uploadError) { //[cite: 5]
            alert("Dosya yükleme hatası: " + uploadError.message); //[cite: 5]
            if (submitBtn) {
                submitBtn.innerText = "Paylaş"; //[cite: 5]
                submitBtn.disabled = false; //[cite: 5]
            }
            return; //[cite: 5]
        }

        const { data: urlData } = dersverseSupabase.storage //[cite: 5]
            .from('uploads') //[cite: 5]
            .getPublicUrl(filePath); //[cite: 5]

        uploadUrlField = urlData.publicUrl; //[cite: 5]
        finalLink = urlData.publicUrl; //[cite: 5]
        contentStatus = 'approved';  //[cite: 5]
    } 
    else {
        contentStatus = 'pending'; //[cite: 5]
    }

    let userName = user.user_metadata?.full_name || user.email.split('@')[0]; //[cite: 5]
    if (user.email === 'femememe1973@gmail.com') { //[cite: 5]
        userName = 'Kadir Eymen Açıkoğlu'; //[cite: 5]
    }

    const { error: dbError } = await dersverseSupabase.from('contents').insert([{ //[cite: 5]
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

    if (dbError) { //[cite: 5]
        alert('Hata: ' + dbError.message); //[cite: 5]
        if (submitBtn) {
            submitBtn.innerText = "Paylaş"; //[cite: 5]
            submitBtn.disabled = false; //[cite: 5]
        }
    } else {
        addXP(20); //[cite: 5]
        if (contentStatus === 'approved') { //[cite: 5]
            alert('İçeriğiniz/FlipHTML5 yayınınız başarıyla kaydedildi ve yayınlandı! (+20 XP)'); //[cite: 5]
        } else {
            alert('İçerik bağlantınız başarıyla iletildi. Yönetici onayından sonra yayınlanacaktır. (+20 XP)'); //[cite: 5]
        }
        dersverseCloseModal(); //[cite: 5]
        const form = document.getElementById('dersverse-content-form'); //[cite: 5]
        if (form) form.reset(); //[cite: 5]
        if (submitBtn) {
            submitBtn.innerText = "Paylaş"; //[cite: 5]
            submitBtn.disabled = false; //[cite: 5]
        }
        dersverseLoadContents();  //[cite: 5]
    }
}

function escapeHtml(str) { //[cite: 5]
    if (!str) return ''; //[cite: 5]
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); //[cite: 5]
}

// Otomatik Başlatma İşlemleri
window.onload = () => {
    startLGSTimer(); //[cite: 5]
    loadSavedTheme(); //[cite: 5]
    updateUserStats(); //[cite: 5]
    dersverseCheckUser(); //[cite: 5]
    dersverseLoadContents(); //[cite: 5]
    checkUserBannedStatus();
};
