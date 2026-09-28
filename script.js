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
            
            const boosterActive = localStorage.getItem("dersverse_xp_booster") === "true";
            const earnedXP = boosterActive ? 100 : 50;
            
            addXP(earnedXP);
            triggerConfetti();
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

// --- 4. DİNAMİK KONFETİ ANİMASYONU ---
function triggerConfetti() {
    const confettiCount = 50;
    const container = document.body;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'dersverse-confetti';
        
        const size = Math.floor(Math.random() * 8) + 6;
        const color = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#3b82f6', '#8b5cf6'][Math.floor(Math.random() * 7)];
        
        confetti.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
            top: -10px;
            left: ${Math.random() * 100}vw;
            opacity: 1;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            z-index: 999999;
            pointer-events: none;
            transition: transform 1.5s ease-out, top 1.5s ease-in, opacity 1.5s ease-in;
        `;
        
        container.appendChild(confetti);

        const fallDuration = Math.random() * 1000 + 1000;
        const horizontalMovement = (Math.random() - 0.5) * 200;

        setTimeout(() => {
            confetti.style.transform = `translate(${horizontalMovement}px, ${window.innerHeight + 50}px) rotate(${Math.random() * 360}deg)`;
            confetti.style.opacity = '0';
        }, 50);

        setTimeout(() => {
            confetti.remove();
        }, fallDuration + 100);
    }
}

// --- 5. GAMIFICATION / YENİ NESİL MAĞAZA VE ŞANS ÇARKI ---
let userPoints = parseInt(localStorage.getItem("dersverse_xp") || "100");
let userInventory = JSON.parse(localStorage.getItem("dersverse_inventory") || "[]");
let userChestStock = JSON.parse(localStorage.getItem("dersverse_chest_stock") || "{}");
let activeTitle = localStorage.getItem("dersverse_active_title") || "🔥 LGS Canavarı";
let activeThemeEffect = localStorage.getItem("dersverse_active_effect") || "none";
let activeAudioTheme = localStorage.getItem("dersverse_active_audio") || "none";

function isUserAdmin() {
    return currentLoggedInUser && currentLoggedInUser.email === 'femememe1973@gmail.com';
}

function addXP(amount) {
    userPoints += amount;
    localStorage.setItem("dersverse_xp", userPoints);
    updateUserStats();
}

function deductXP(amount) {
    if (isUserAdmin()) {
        return true; 
    }
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

    if (pointsEl) {
        pointsEl.innerText = isUserAdmin() ? "♾️ Sınırsız XP" : userPoints;
    }
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

// Yeni Nesil Ürün Kataloğu (Eski Ürünler Temilendi, Yepyeni Seçenekler Eklendi)
function generateMassiveShopCatalog() {
    let items = [
        // Özel Şans Sandıkları
        { id: 'new_chest_bronze', name: '🎁 Yeni Sezon Bronz Sandık', cost: 120, type: 'chest', value: 'bronz', desc: 'İçinden 75-350 arası XP çıkar. Stoklanabilir.' },
        { id: 'new_chest_silver', name: '🎁 Yeni Sezon Gümüş Sandık', cost: 280, type: 'chest', value: 'gumus', desc: 'İçinden 200-700 arası XP çıkar. Stoklanabilir.' },
        { id: 'new_chest_gold', name: '🎁 Yeni Sezon Altın Sandık', cost: 550, type: 'chest', value: 'altin', desc: 'İçinden 500-1400 arası XP çıkar. Stoklanabilir.' },
        { id: 'new_chest_diamond', name: '💎 Elmas Akademi Sandığı', cost: 1200, type: 'chest', value: 'efsanevi', desc: 'İçinden 1000-3000 arası XP çıkar. Stoklanabilir.' },
        { id: 'new_chest_ultra', name: '🌌 Ultra Galaktik Sandık', cost: 2000, type: 'chest', value: 'kozmik', desc: 'İçinden 2000-6000 XP ve özel rozetler çıkar!' },
        
        // Yeni Güçlendiriciler ve Avantajlar
        { id: 'new_boost_2x', name: '⚡ 3x Turbo XP İksiri', cost: 400, type: 'booster', value: 'xp_double', desc: 'Tüm XP kazançlarını katlar.' },
        { id: 'new_boost_shield', name: '🛡️ Süper Seri Kalkanı', cost: 250, type: 'booster', value: 'streak_shield', desc: 'Çalışma serinizin bozulmasını engeller.' },
        { id: 'new_perk_pin', name: '📌 Yıldızlı Soru Öne Çıkarma', cost: 180, type: 'perk', value: 'pin_question', desc: 'Sorularınızı toplulukta öne çıkarır.' },
        { id: 'new_boost_magnet', name: '🧲 Mega XP Mıknatısı', cost: 500, type: 'booster', value: 'xp_magnet', desc: 'Etkinliklerden ekstra %75 bonus kazandırır.' },
        { id: 'new_perk_clock', name: '⏳ Esnek Zaman Kum Saati', cost: 380, type: 'perk', value: 'time_bender', desc: 'Pomodoro seanslarında ek mola hakkı tanır.' }
    ];

    // 1) 50 Adet Yepyeni Prestij Unvanı (Title)
    const prefixes = ['Elmas', 'Kuantum', 'Zirve', 'Prime', 'Apex', 'Yıldız', 'Nova', 'Ultra', 'Mega', 'Hyper', 'Titan', 'Master', 'Elite', 'Cyber', 'Neon'];
    const suffixes = ['Lideri', 'Şampiyonu', 'Kralı', 'Dahisi', 'Efsanesi', 'Reisi', 'Mimarı', 'Fatihi', 'Dehası', 'Gurusu'];
    
    for (let i = 1; i <= 50; i++) {
        let p = prefixes[i % prefixes.length];
        let s = suffixes[(i * 2) % suffixes.length];
        items.push({
            id: `new_title_${i}`,
            name: `🌟 Akademi Unvanı #${i}: ${p} ${s}`,
            cost: 150 + (i * 20),
            type: 'title',
            value: `🌟 ${p} ${s} (${i})`,
            desc: `Profilinizde fark yaratacak yeni sezon özel unvanı #${i}.`
        });
    }

    // 2) 30 Adet Yepyeni Profil Efekti ve Çerçeve (Effect)
    const effects = ['Alev', 'Cyber', 'Plazma', 'Kristal', 'Elmas', 'Gümüş', 'Altın', 'Kozmik', 'Lazer', 'Fırtına'];
    for (let i = 1; i <= 30; i++) {
        let eff = effects[i % effects.length];
        items.push({
            id: `new_effect_${i}`,
            name: `✨ Özel ${eff} Çerçeve V${i}`,
            cost: 180 + (i * 22),
            type: 'effect',
            value: `effect-new-${i}`,
            desc: `Profil kartınız için yeni nesil ${eff} parlama efekti #${i}.`
        });
    }

    // 3) 25 Adet Yepyeni Odak Sesi ve Ambiyans (Audio)
    const sounds = ['Lo-Fi', 'Uzay İstasyonu', 'Sakin Kafe', 'Derin Orman', 'Huzurlu Yağmur', 'Şömine Ateşi', 'Neon Şehir'];
    for (let i = 1; i <= 25; i++) {
        let snd = sounds[i % sounds.length];
        items.push({
            id: `new_audio_${i}`,
            name: `🎧 Yeni Nesil Odak Sesi: ${snd} #${i}`,
            cost: 130 + (i * 15),
            type: 'audio',
            value: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_4a0e10b2df.mp3',
            desc: `Ders çalışırken odaklanmanızı sağlayacak ${snd} ambiansı #${i}.`
        });
    }

    return items;
}

const shopItems = generateMassiveShopCatalog();

function renderShop() {
    const shopList = document.getElementById("shop-items-container");
    if (!shopList) return;

    shopList.innerHTML = shopItems.map(item => {
        const isOwned = userInventory.includes(item.id);
        const stockCount = userChestStock[item.id] || 0;
        const isEquipped = (item.type === 'title' && activeTitle === item.value) || 
                           (item.type === 'effect' && activeThemeEffect === item.value) ||
                           (item.type === 'audio' && activeAudioTheme === item.value);

        let stockInfoHtml = '';
        if (item.type === 'chest') {
            stockInfoHtml = `<br><small style="color: #10b981; font-weight: bold;">Envanterdeki Stok: ${stockCount} Adet</small>`;
        }

        let actionButtons = '';

        if (item.type === 'chest') {
            actionButtons = `
                <div style="display: flex; flex-direction: column; gap: 6px; align-items: flex-end;">
                    <div style="display: flex; gap: 4px;">
                        <button class="dersverse-btn" style="padding: 5px 10px; font-size: 0.75rem;" onclick="buyShopItem('${item.id}', ${item.cost}, 1)">Satın Al</button>
                        <button class="dersverse-btn dersverse-btn-outline" style="padding: 5px 10px; font-size: 0.75rem;" onclick="buyBulkPrompt('${item.id}', ${item.cost})">Toplu Al</button>
                    </div>
                    ${stockCount > 0 ? `<button class="dersverse-btn" style="background: #10b981; color: white; width: 100%; padding: 5px; font-size: 0.75rem;" onclick="triggerWheelAnimation('${item.value}', '${item.id}')">🎡 Çevir (${stockCount})</button>` : ''}
                </div>
            `;
        } else if (item.type === 'booster' || item.type === 'perk') {
            actionButtons = `
                <div style="display: flex; gap: 4px;">
                    ${!isOwned ? `<button class="dersverse-btn" style="padding: 5px 10px; font-size: 0.75rem;" onclick="buyShopItem('${item.id}',${item.cost}, 1)">Satın Al</button>` : ''}
                    <button class="dersverse-btn dersverse-btn-outline" style="padding: 5px 10px; font-size: 0.75rem; background: #6366f1; color: white;" onclick="usePerk('${item.id}', '${item.value}')">⚡ Kullan</button>
                </div>
            `;
        } else {
            if (isOwned) {
                if (isEquipped) {
                    actionButtons = `<span style="color:#10b981; font-weight:bold; font-size: 0.85rem;">Aktif / Kuşanıldı</span>`;
                } else {
                    actionButtons = `<button class="dersverse-btn dersverse-btn-outline" style="padding: 5px 10px; font-size: 0.75rem;" onclick="equipItem('${item.type}', '${item.value}')">Kuşan</button>`;
                }
            } else {
                actionButtons = `
                    <div style="display: flex; gap: 4px;">
                        <button class="dersverse-btn" style="padding: 5px 10px; font-size: 0.75rem;" onclick="buyShopItem('${item.id}', ${item.cost}, 1)">Satın Al</button>
                        <button class="dersverse-btn dersverse-btn-outline" style="padding: 5px 10px; font-size: 0.75rem;" onclick="equipItem('${item.type}', '${item.value}')">Kuşan</button>
                    </div>
                `;
            }
        }

        return `
            <div style="background: rgba(255,255,255,0.05); padding: 12px; margin-bottom: 10px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--dersverse-border, #333);">
                <div style="max-width: 60%;">
                    <strong>${item.name}</strong><br>
                    <small style="color: #aaa; font-size: 0.8rem;">${item.desc || ''}</small>${stockInfoHtml}<br>
                    <small style="color: #6366f1; font-weight: bold; font-size: 0.8rem;">Maliyet: ${isUserAdmin() ? 'Ücretsiz (Admin)' : item.cost + ' XP'}</small>
                </div>
                <div>
                    ${actionButtons}
                </div>
            </div>
        `;
    }).join('');
}

function buyShopItem(itemId, cost, quantity = 1) {
    const item = shopItems.find(i => i.id === itemId);
    const totalCost = isUserAdmin() ? 0 : cost * quantity;

    if (isUserAdmin() || deductXP(totalCost)) {
        if (item.type === 'chest') {
            userChestStock[itemId] = (userChestStock[itemId] || 0) + quantity;
            localStorage.setItem("dersverse_chest_stock", JSON.stringify(userChestStock));
        } else {
            if (!userInventory.includes(itemId)) {
                userInventory.push(itemId);
                localStorage.setItem("dersverse_inventory", JSON.stringify(userInventory));
            }
            if (item.type === 'title') equipItem('title', item.value);
            if (item.type === 'effect') equipItem('effect', item.value);
        }
        
        triggerConfetti();
        renderShop();
    } else {
        alert("Yetersiz XP! Pomodoro tamamlayarak veya soru ekleyerek XP kazanabilirsiniz.");
    }
}

function buyBulkPrompt(itemId, cost) {
    const qtyInput = prompt("Kaç adet satın almak istiyorsunuz?", "5");
    if (!qtyInput) return;
    const qty = parseInt(qtyInput);
    if (isNaN(qty) || qty <= 0) {
        alert("Lütfen geçerli bir sayı girin.");
        return;
    }
    buyShopItem(itemId, cost, qty);
}

// --- 6. ŞANS ÇARKI VE KUTU AÇILIM ANİMASYONU ---
function triggerWheelAnimation(chestType, itemId) {
    if (!userChestStock[itemId] || userChestStock[itemId] <= 0) {
        return;
    }

    userChestStock[itemId]--;
    localStorage.setItem("dersverse_chest_stock", JSON.stringify(userChestStock));

    let wheelModal = document.getElementById("dersverse-wheel-modal");
    if (!wheelModal) {
        wheelModal = document.createElement("div");
        wheelModal.id = "dersverse-wheel-modal";
        wheelModal.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); display:flex; justify-content:center; align-items:center; z-index:99999;";
        document.body.appendChild(wheelModal);
    }

    wheelModal.innerHTML = `
        <div style="background: #111827; padding: 30px; border-radius: 16px; border: 2px solid #6366f1; text-align: center; max-width: 360px; width: 90%; color: white; position: relative;">
            <h3 style="margin-top:0;">🎡 Şans Çarkı Dönüyor...</h3>
            <p style="font-size:0.85rem; color:#aaa;">Kutunuz açılıyor, lütfen bekleyin!</p>
            <div id="wheel-spinner-container" style="margin: 20px auto; width: 140px; height: 140px; border-radius: 50%; border: 8px solid #312e81; border-top: 8px solid #ef4444; animation: spinWheel 0.6s linear infinite;"></div>
            <div id="wheel-result-text" style="font-size: 1.2rem; font-weight: bold; margin-top: 15px; color: #f59e0b; min-height: 30px;">...</div>
        </div>
        <style>
            @keyframes spinWheel {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    wheelModal.style.display = "flex";

    let rewardXP = 0;
    if (chestType === 'bronz') rewardXP = Math.floor(Math.random() * 250) + 50;
    if (chestType === 'gumus') rewardXP = Math.floor(Math.random() * 450) + 150;
    if (chestType === 'altin') rewardXP = Math.floor(Math.random() * 800) + 400;
    if (chestType === 'efsanevi') rewardXP = Math.floor(Math.random() * 1700) + 800;
    if (chestType === 'kozmik') rewardXP = Math.floor(Math.random() * 3500) + 1500;

    setTimeout(() => {
        const spinner = document.getElementById("wheel-spinner-container");
        const resultText = document.getElementById("wheel-result-text");

        if (spinner) {
            spinner.style.animation = "none";
            spinner.style.border = "8px solid #10b981";
            spinner.innerText = "🎉";
            spinner.style.fontSize = "60px";
            spinner.style.lineHeight = "125px";
        }

        if (resultText) {
            resultText.innerText = `TEBRİKLER!\n+${rewardXP} XP Kazandınız!`;
        }

        addXP(rewardXP);
        triggerConfetti();
        renderShop();

        setTimeout(() => {
            wheelModal.style.display = "none";
        }, 2000);

    }, 2500);
}

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

function usePerk(itemId, perkValue) {
    if (!userInventory.includes(itemId)) {
        userInventory.push(itemId);
        localStorage.setItem("dersverse_inventory", JSON.stringify(userInventory));
    }
    if (perkValue === 'xp_double') {
        localStorage.setItem("dersverse_xp_booster", "true");
        alert("⚡ 3x Turbo XP İksiri etkinleştirildi!");
    } else {
        alert("Perk başarıyla kullanıldı!");
    }
    triggerConfetti();
    renderShop();
}

function applyThemeEffect(effectClass) {
    document.body.classList.remove('neon-border', 'fire-aura', 'galaxy-bg', 'lightning-aura');
    if (effectClass && effectClass !== 'none') {
        document.body.classList.add(effectClass);
    }
}

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
    }
}

// --- 7. SANAL SORU KUMBARASI ---
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
    triggerConfetti();
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

// --- 8. KULLANICI ENGELLEME VE OTURUM KONTROLÜ ---
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
    updateUserStats();
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
                    <a href="${detailUrl}" class="dersverse-btn dersverse-btn-outline" style="flex: 1; text-align: center; text-decoration: none; font-size: 0.8rem; padding: 8px 4px;" onclick="addXP(10)">💬 Detay & Yorum</a>
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
        const boosterActive = localStorage.getItem("dersverse_xp_booster") === "true";
        const earnedXP = boosterActive ? 40 : 20;

        addXP(earnedXP);
        triggerConfetti();
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

        if (error) return;

        if (data && !isUserAdmin()) {
            userPoints = data.xp || 0;
            localStorage.setItem("dersverse_xp", userPoints);
            updateUserStats();
        }
    } catch (err) {
        console.error("loadUserXP hatası:", err);
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
                if (payload.new && typeof payload.new.xp !== 'undefined' && !isUserAdmin()) {
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
    dersverseCheckUser();
    loadUserXP();
    listenXPChanges();
    dersverseLoadContents();
    checkUserBannedStatus();
    applyThemeEffect(activeThemeEffect);
    if (activeAudioTheme !== 'none') playAudioTheme(activeAudioTheme);
};
