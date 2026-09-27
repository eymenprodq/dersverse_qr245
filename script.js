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

// --- 4. GELİŞMİŞ GAMIFICATION / PUAN VE 250+ ÖĞELİK ULTRA DEV MAĞAZA ---
let userPoints = parseInt(localStorage.getItem("dersverse_xp") || "100");
let userInventory = JSON.parse(localStorage.getItem("dersverse_inventory") || "[]");
let activeTitle = localStorage.getItem("dersverse_active_title") || "🔥 LGS Canavarı";

function addXP(amount) {
    userPoints += amount;
    localStorage.setItem("dersverse_xp", userPoints);
    updateUserStats();
}

async function deductXP(amount) {
    // Yönetici kontrolü
    try {
        const { data: { user } } = await dersverseSupabase.auth.getUser();
        if (user && user.email === 'femememe1973@gmail.com') {
            return true; // Yönetici için XP düşülmez, her işlem onaylanır
        }
    } catch(e) {}

    if (userPoints >= amount) {
        userPoints -= amount;
        localStorage.setItem("dersverse_xp", userPoints);
        updateUserStats();
        return true;
    }
    return false;
}

async function updateUserStats() {
    const pointsEl = document.getElementById("user-points");
    const badgeEl = document.getElementById("user-badge");

    const { data: { user } } = await dersverseSupabase.auth.getUser();
    const isAdmin = user && user.email === 'femememe1973@gmail.com';

    if (pointsEl) pointsEl.innerText = isAdmin ? "∞ (Sınırsız)" : userPoints;
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

// 250+ Öğelik Mağaza Listesi
const shopItems = [
    // --- UNVANLAR (1-100) ---
    { id: 'item_1', name: '🧠 LGS Dahisi Unvanı', cost: 150, type: 'title', value: '🧠 LGS Dahisi' },
    { id: 'item_2', name: '⚡ Ders Efsanesi Unvanı', cost: 300, type: 'title', value: '⚡ Ders Efsanesi' },
    { id: 'item_3', name: '👑 LGS Birincisi Unvanı', cost: 500, type: 'title', value: '👑 LGS Birincisi' },
    { id: 'item_4', name: '🚀 Matematik Canavarı', cost: 200, type: 'title', value: '🚀 Matematik Canavarı' },
    { id: 'item_5', name: '🧪 Fen Kurdu Unvanı', cost: 200, type: 'title', value: '🧪 Fen Kurdu' },
    { id: 'item_6', name: '📚 Kitap Kurdu Unvanı', cost: 180, type: 'title', value: '📚 Kitap Kurdu' },
    { id: 'item_7', name: '💡 Paragraf Kralı', cost: 220, type: 'title', value: '💡 Paragraf Kralı' },
    { id: 'item_8', name: '🎯 Hedef 500 Puan', cost: 600, type: 'title', value: '🎯 Hedef 500 Puan' },
    { id: 'item_9', name: '⏳ Zaman Bükücü', cost: 250, type: 'title', value: '⏳ Zaman Bükücü' },
    { id: 'item_10', name: '🛡️ Sınav Savaşçısı', cost: 270, type: 'title', value: '🛡️ Sınav Savaşçısı' },
    { id: 'item_11', name: '💻 Kodlama Gurusu', cost: 350, type: 'title', value: '💻 Kodlama Gurusu' },
    { id: 'item_12', name: '🎨 Tasarım Uzmanı', cost: 300, type: 'title', value: '🎨 Tasarım Uzmanı' },
    { id: 'item_13', name: '🌟 Parlayan Yıldız', cost: 120, type: 'title', value: '🌟 Parlayan Yıldız' },
    { id: 'item_14', name: '🧊 Soğukkanlı Çözücü', cost: 210, type: 'title', value: '🧊 Soğukkanlı Çözücü' },
    { id: 'item_15', name: '🔥 İstikrar Abidesi', cost: 400, type: 'title', value: '🔥 İstikrar Abidesi' },
    { id: 'item_16', name: '🦅 Keskin Nişancı', cost: 230, type: 'title', value: '🦅 Keskin Nişancı' },
    { id: 'item_17', name: '🔮 Bilge Öğrenci', cost: 320, type: 'title', value: '🔮 Bilge Öğrenci' },
    { id: 'item_18', name: '⚙️ Robotik Uzmanı', cost: 340, type: 'title', value: '⚙️ Robotik Uzmanı' },
    { id: 'item_19', name: '🏆 Şampiyon Adayı', cost: 450, type: 'title', value: '🏆 Şampiyon Adayı' },
    { id: 'item_20', name: '💎 Elmas Zihin', cost: 550, type: 'title', value: '💎 Elmas Zihin' },
    { id: 'item_21', name: '🌙 Gece Çalışanı', cost: 190, type: 'title', value: '🌙 Gece Çalışanı' },
    { id: 'item_22', name: '☀️ Erken Kalkan', cost: 190, type: 'title', value: '☀️ Erken Kalkan' },
    { id: 'item_23', name: '📝 Not Mühendisi', cost: 260, type: 'title', value: '📝 Not Mühendisi' },
    { id: 'item_24', name: '🔬 Deney Faresi', cost: 210, type: 'title', value: '🔬 Deney Faresi' },
    { id: 'item_25', name: '🗺️ Tarihçi', cost: 180, type: 'title', value: '🗺️ Tarihçi' },
    { id: 'item_26', name: '🌍 Coğrafya Profesörü', cost: 180, type: 'title', value: '🌍 Coğrafya Profesörü' },
    { id: 'item_27', name: '🗣️ İngilizce Üstadı', cost: 240, type: 'title', value: '🗣️ İngilizce Üstadı' },
    { id: 'item_28', name: '⚖️ Din Kültürü Bilgini', cost: 160, type: 'title', value: '⚖️ Din Kültürü Bilgini' },
    { id: 'item_29', name: '📊 Grafik Avcısı', cost: 220, type: 'title', value: '📊 Grafik Avcısı' },
    { id: 'item_30', name: '⚡ Hızlı Çözücü', cost: 310, type: 'title', value: '⚡ Hızlı Çözücü' },
    { id: 'item_31', name: '🧩 Mantık Yürütücü', cost: 290, type: 'title', value: '🧩 Mantık Yürütücü' },
    { id: 'item_32', name: '🔍 Detay Avcısı', cost: 200, type: 'title', value: '🔍 Detay Avcısı' },
    { id: 'item_33', name: '🛡️ Hata Savunucusu', cost: 250, type: 'title', value: '🛡️ Hata Savunucusu' },
    { id: 'item_34', name: '📌 Hedef Odaklı', cost: 170, type: 'title', value: '📌 Hedef Odaklı' },
    { id: 'item_35', name: '🌀 Paradoks Çözen', cost: 330, type: 'title', value: '🌀 Paradoks Çözen' },
    { id: 'item_36', name: '🔋 Tam Enerji', cost: 140, type: 'title', value: '🔋 Tam Enerji' },
    { id: 'item_37', name: '🎈 Motivasyon Kaynağı', cost: 150, type: 'title', value: '🎈 Motivasyon Kaynağı' },
    { id: 'item_38', name: '🦾 Sayborg Beyin', cost: 480, type: 'title', value: '🦾 Sayborg Beyin' },
    { id: 'item_39', name: '🛸 Uzaylı Zeka', cost: 520, type: 'title', value: '🛸 Uzaylı Zeka' },
    { id: 'item_40', name: '🔥 Efsanevi Unvan', cost: 700, type: 'title', value: '🔥 Efsanevi Unvan' },
    { id: 'item_41', name: '⭐ VIP Üye', cost: 500, type: 'title', value: '⭐ VIP Üye' },
    { id: 'item_42', name: '🛡️ Kıdemli Üye', cost: 350, type: 'title', value: '🛡️ Kıdemli Üye' },
    { id: 'item_43', name: '💎 Elmas Üye', cost: 600, type: 'title', value: '💎 Elmas Üye' },
    { id: 'item_44', name: '👑 Efsanevi Üye', cost: 800, type: 'title', value: '👑 Efsanevi Üye' },
    { id: 'item_45', name: '💻 Pro Öğrenci', cost: 250, type: 'title', value: '💻 Pro Öğrenci' },
    { id: 'item_46', name: '🎯 Master Sınavcı', cost: 400, type: 'title', value: '🎯 Master Sınavcı' },
    { id: 'item_47', name: '🧠 Alfa Beyin', cost: 450, type: 'title', value: '🧠 Alfa Beyin' },
    { id: 'item_48', name: '⚡ Beta Kodlayıcı', cost: 300, type: 'title', value: '⚡ Beta Kodlayıcı' },
    { id: 'item_49', name: '🌌 Omega Güç', cost: 550, type: 'title', value: '🌌 Omega Güç' },
    { id: 'item_50', name: '🚀 Süper Zeka', cost: 500, type: 'title', value: '🚀 Süper Zeka' },
    { id: 'item_51', name: '👑 Kral', cost: 900, type: 'title', value: '👑 Kral' },
    { id: 'item_52', name: '🐅 Kaplan', cost: 320, type: 'title', value: '🐅 Kaplan' },
    { id: 'item_53', name: '🦅 Kartal', cost: 320, type: 'title', value: '🦅 Kartal' },
    { id: 'item_54', name: '🐺 Kurt', cost: 320, type: 'title', value: '🐺 Kurt' },
    { id: 'item_55', name: '🐉 Ejderha', cost: 750, type: 'title', value: '🐉 Ejderha' },
    { id: 'item_56', name: '🦄 Anka Kuşu', cost: 700, type: 'title', value: '🦄 Anka Kuşu' },
    { id: 'item_57', name: '⚡ Şimşek Hızı', cost: 310, type: 'title', value: '⚡ Şimşek Hızı' },
    { id: 'item_58', name: '🌪️ Kasırga Zihin', cost: 340, type: 'title', value: '🌪️ Kasırga Zihin' },
    { id: 'item_59', name: '🌊 Okyanus Derinliği', cost: 290, type: 'title', value: '🌊 Okyanus Derinliği' },
    { id: 'item_60', name: '🌋 Volkanik Güç', cost: 380, type: 'title', value: '🌋 Volkanik Güç' },
    { id: 'item_61', name: '🧊 Buzul Zeka', cost: 300, type: 'title', value: '🧊 Buzul Zeka' },
    { id: 'item_62', name: '🪐 Gezegen Kaşifi', cost: 410, type: 'title', value: '🪐 Gezegen Kaşifi' },
    { id: 'item_63', name: '☄️ Meteor Çarpması', cost: 440, type: 'title', value: '☄️ Meteor Çarpması' },
    { id: 'item_64', name: '🌠 Kayayan Yıldız', cost: 260, type: 'title', value: '🌠 Kayayan Yıldız' },
    { id: 'item_65', name: '🌌 Karanlık Madde', cost: 600, type: 'title', value: '🌌 Karanlık Madde' },
    { id: 'item_66', name: '🧭 Pusula Rehberi', cost: 180, type: 'title', value: '🧭 Pusula Rehberi' },
    { id: 'item_67', name: '⚓ Sağlam Temel', cost: 200, type: 'title', value: '⚓ Sağlam Temel' },
    { id: 'item_68', name: '🛠️ Tamirci Ruhlu', cost: 220, type: 'title', value: '🛠️ Tamirci Ruhlu' },
    { id: 'item_69', name: '🔮 Bilici', cost: 250, type: 'title', value: '🔮 Bilici' },
    { id: 'item_70', name: '🧬 Genetik Dahi', cost: 490, type: 'title', value: '🧬 Genetik Dahi' },
    { id: 'item_71', name: '🎒 Süper Öğrenci', cost: 210, type: 'title', value: '🎒 Süper Öğrenci' },
    { id: 'item_72', name: '🏃 Maraton Koşucusu', cost: 310, type: 'title', value: '🏃 Maraton Koşucusu' },
    { id: 'item_73', name: '🧠 Zihin Okuyucu', cost: 420, type: 'title', value: '🧠 Zihin Okuyucu' },
    { id: 'item_74', name: '🏗️ Kod Mimarı', cost: 380, type: 'title', value: '🏗️ Kod Mimarı' },
    { id: 'item_75', name: '💾 Veri Tabanı Uzmanı', cost: 360, type: 'title', value: '💾 Veri Tabanı Uzmanı' },
    { id: 'item_76', name: '📱 Arayüz Tasarımcısı', cost: 340, type: 'title', value: '📱 Arayüz Tasarımcısı' },
    { id: 'item_77', name: '⚙️ Sistem Yöneticisi', cost: 500, type: 'title', value: '⚙️ Sistem Yöneticisi' },
    { id: 'item_78', name: '🐞 Hata Ayıklayıcı', cost: 290, type: 'title', value: '🐞 Hata Ayıklayıcı' },
    { id: 'item_79', name: '🟩 Komut Bloğu Üstadı', cost: 450, type: 'title', value: '🟩 Komut Bloğu Üstadı' },
    { id: 'item_80', name: '🌐 Sunucu Sahibi', cost: 480, type: 'title', value: '🌐 Sunucu Sahibi' },
    { id: 'item_81', name: '📝 LGS Uzmanı', cost: 300, type: 'title', value: '📝 LGS Uzmanı' },
    { id: 'item_82', name: '🎯 Soru Avcısı', cost: 270, type: 'title', value: '🎯 Soru Avcısı' },
    { id: 'item_83', name: '📈 Deneme Canavarı', cost: 330, type: 'title', value: '📈 Deneme Canavarı' },
    { id: 'item_84', name: '💰 Puan Kolik', cost: 250, type: 'title', value: '💰 Puan Kolik' },
    { id: 'item_85', name: '⭐ XP Lordu', cost: 600, type: 'title', value: '⭐ XP Lordu' },
    { id: 'item_86', name: '👑 XP Kralı', cost: 750, type: 'title', value: '👑 XP Kralı' },
    { id: 'item_87', name: '🆙 Seviye Atlatan', cost: 400, type: 'title', value: '🆙 Seviye Atlatan' },
    { id: 'item_88', name: '📋 Görev Adamı', cost: 220, type: 'title', value: '📋 Görev Adamı' },
    { id: 'item_89', name: '⚡ Pratik Zeka', cost: 280, type: 'title', value: '⚡ Pratik Zeka' },
    { id: 'item_90', name: '⚡ Şimşek Beyin', cost: 390, type: 'title', value: '⚡ Şimşek Beyin' },
    { id: 'item_91', name: '👣 Kararlı Adımlar', cost: 200, type: 'title', value: '👣 Kararlı Adımlar' },
    { id: 'item_92', name: '🏔️ Zirvedeki Tek', cost: 1000, type: 'title', value: '🏔️ Zirvedeki Tek' },
    { id: 'item_93', name: '🔄 Efsane Geri Döndü', cost: 850, type: 'title', value: '🔄 Efsane Geri Döndü' },
    { id: 'item_94', name: '👁️ Gizli Güç', cost: 550, type: 'title', value: '👁️ Gizli Güç' },
    { id: 'item_95', name: '🧘 Sakin Güç', cost: 300, type: 'title', value: '🧘 Sakin Güç' },
    { id: 'item_96', name: '🚀 Hiperaktif Çalışkan', cost: 350, type: 'title', value: '🚀 Hiperaktif Çalışkan' },
    { id: 'item_97', name: '🎯 Odak Modu Açık', cost: 260, type: 'title', value: '🎯 Odak Modu Açık' },
    { id: 'item_98', name: '🤝 Sınav Tayfa', cost: 190, type: 'title', value: '🤝 Sınav Tayfa' },
    { id: 'item_99', name: '🏫 Dershane Kralı', cost: 340, type: 'title', value: '🏫 Dershane Kralı' },
    { id: 'item_100', name: '🌀 Son Sınav Bükücü', cost: 999, type: 'title', value: '🌀 Son Sınav Bükücü' },

    // --- ROZETLER VE ÇERÇEVELER (101-160) ---
    { id: 'item_101', name: '✨ Altın Çerçeve Rozeti', cost: 250, type: 'badge', value: '✨' },
    { id: 'item_102', name: '💎 Gümüş Çerçeve Rozeti', cost: 200, type: 'badge', value: '💎' },
    { id: 'item_103', name: '🔥 Ateşli Çerçeve Rozeti', cost: 300, type: 'badge', value: '🔥' },
    { id: 'item_104', name: '⚡ Yıldırım Rozeti', cost: 220, type: 'badge', value: '⚡' },
    { id: 'item_105', name: '👑 Kraliyet Tacı Rozeti', cost: 400, type: 'badge', value: '👑' },
    { id: 'item_106', name: '🌟 Parlayan Rozet', cost: 180, type: 'badge', value: '🌟' },
    { id: 'item_107', name: '🍀 Şanslı Yonca Rozeti', cost: 150, type: 'badge', value: '🍀' },
    { id: 'item_108', name: '🎯 Hedef Rozeti', cost: 170, type: 'badge', value: '🎯' },
    { id: 'item_109', name: '🚀 Roket Rozeti', cost: 280, type: 'badge', value: '🚀' },
    { id: 'item_110', name: '💡 Ampul Rozeti', cost: 160, type: 'badge', value: '💡' },
    { id: 'item_111', name: '🥉 Bronz Madalya', cost: 100, type: 'badge', value: '🥉' },
    { id: 'item_112', name: '🥈 Gümüş Madalya', cost: 200, type: 'badge', value: '🥈' },
    { id: 'item_113', name: '🥇 Altın Madalya', cost: 300, type: 'badge', value: '🥇' },
    { id: 'item_114', name: '🎖️ Platin Madalya', cost: 450, type: 'badge', value: '🎖️' },
    { id: 'item_115', name: '🔮 Kristal Küre', cost: 350, type: 'badge', value: '🔮' },
    { id: 'item_116', name: '🌀 Enerji Küresi', cost: 250, type: 'badge', value: '🌀' },
    { id: 'item_117', name: '📌 Mavi Raptiye', cost: 50, type: 'badge', value: '📌' },
    { id: 'item_118', name: '📎 Ataç Rozeti', cost: 50, type: 'badge', value: '📎' },
    { id: 'item_119', name: '📐 Gönye Rozeti', cost: 80, type: 'badge', value: '📐' },
    { id: 'item_120', name: '📏 Cetvel Rozeti', cost: 80, type: 'badge', value: '📏' },
    { id: 'item_121', name: '🎒 Sırt Çantası Rozeti', cost: 120, type: 'badge', value: '🎒' },
    { id: 'item_122', name: '✏️ Kurşun Kalem Rozeti', cost: 70, type: 'badge', value: '✏️' },
    { id: 'item_123', name: '🖊️ Tükenmez Kalem Rozeti', cost: 90, type: 'badge', value: '🖊️' },
    { id: 'item_124', name: '📓 Not Defteri Rozeti', cost: 110, type: 'badge', value: '📓' },
    { id: 'item_125', name: '🔎 Büyüteç Rozeti', cost: 130, type: 'badge', value: '🔎' },
    { id: 'item_126', name: '🔬 Mikroskop Rozeti', cost: 220, type: 'badge', value: '🔬' },
    { id: 'item_127', name: '🧪 Test Tüpü Rozeti', cost: 190, type: 'badge', value: '🧪' },
    { id: 'item_128', name: '🧬 DNA Sarmalı Rozeti', cost: 280, type: 'badge', value: '🧬' },
    { id: 'item_129', name: '🌍 Dünya Küresi Rozeti', cost: 240, type: 'badge', value: '🌍' },
    { id: 'item_130', name: '🎓 Mezuniyet Kep Rozeti', cost: 600, type: 'badge', value: '🎓' },
    { id: 'item_131', name: '🛡️ Çelik Kalkan Rozeti', cost: 300, type: 'badge', value: '🛡️' },
    { id: 'item_132', name: '⚔️ Kılıç Rozeti', cost: 320, type: 'badge', value: '⚔️' },
    { id: 'item_133', name: '🏹 Yay ve Ok Rozeti', cost: 290, type: 'badge', value: '🏹' },
    { id: 'item_134', name: '🧪 İksir Rozeti', cost: 210, type: 'badge', value: '🧪' },
    { id: 'item_135', name: '📜 Parşömen Rozeti', cost: 170, type: 'badge', value: '📜' },
    { id: 'item_136', name: '🗝️ Anahtar Rozeti', cost: 190, type: 'badge', value: '🗝️' },
    { id: 'item_137', name: '⚙️ Dişli Çark Rozeti', cost: 200, type: 'badge', value: '⚙️' },
    { id: 'item_138', name: '🧲 Mıknatıs Rozeti', cost: 140, type: 'badge', value: '🧲' },
    { id: 'item_139', name: '🔋 Pil Rozeti', cost: 130, type: 'badge', value: '🔋' },
    { id: 'item_140', name: '💡 Akıllı Ampul', cost: 180, type: 'badge', value: '💡' },
    { id: 'item_141', name: '💻 Laptop Rozeti', cost: 350, type: 'badge', value: '💻' },
    { id: 'item_142', name: '📱 Telefon Rozeti', cost: 250, type: 'badge', value: '📱' },
    { id: 'item_143', name: '🎮 Oyun Kumandası Rozeti', cost: 280, type: 'badge', value: '🎮' },
    { id: 'item_144', name: '🕹️ Joystick Rozeti', cost: 260, type: 'badge', value: '🕹️' },
    { id: 'item_145', name: '🎧 Kulaklık Rozeti', cost: 220, type: 'badge', value: '🎧' },
    { id: 'item_146', name: '🎙️ Mikrofon Rozeti', cost: 240, type: 'badge', value: '🎙️' },
    { id: 'item_147', name: '📷 Kamera Rozeti', cost: 300, type: 'badge', value: '📷' },
    { id: 'item_148', name: '🎥 Film Şeridi Rozeti', cost: 310, type: 'badge', value: '🎥' },
    { id: 'item_149', name: '🎨 Palet Rozeti', cost: 270, type: 'badge', value: '🎨' },
    { id: 'item_150', name: '✍️ Dolma Kalem Rozeti', cost: 210, type: 'badge', value: '✍️' },
    { id: 'item_151', name: '🎸 Gitar Rozeti', cost: 330, type: 'badge', value: '🎸' },
    { id: 'item_152', name: '🎹 Piyano Tuşu Rozeti', cost: 340, type: 'badge', value: '🎹' },
    { id: 'item_153', name: '⚽ Futbol Topu Rozeti', cost: 150, type: 'badge', value: '⚽' },
    { id: 'item_154', name: '🏀 Basketbol Topu Rozeti', cost: 150, type: 'badge', value: '🏀' },
    { id: 'item_155', name: '🏆 Kupa Rozeti', cost: 400, type: 'badge', value: '🏆' },
    { id: 'item_156', name: '🏁 Bitiş Çizgisi Rozeti', cost: 200, type: 'badge', value: '🏁' },
    { id: 'item_157', name: '⏱️ Kronometre Rozeti', cost: 190, type: 'badge', value: '⏱️' },
    { id: 'item_158', name: '⏰ Çalar Saat Rozeti', cost: 180, type: 'badge', value: '⏰' },
    { id: 'item_159', name: '⌛ Kum Saati Rozeti', cost: 210, type: 'badge', value: '⌛' },
    { id: 'item_160', name: '📅 Takvim Rozeti', cost: 160, type: 'badge', value: '📅' },

    // --- TEMA VE RENK EFEKTLERİ (161-200) ---
    { id: 'item_161', name: '🎨 Neon Tema Efekti', cost: 350, type: 'theme', value: 'neon' },
    { id: 'item_162', name: '🌌 Galaksi Tema Efekti', cost: 400, type: 'theme', value: 'galaxy' },
    { id: 'item_163', name: '🌲 Doğa Tema Efekti', cost: 250, type: 'theme', value: 'nature' },
    { id: 'item_164', name: '⚡ Cyberpunk Tema Efekti', cost: 450, type: 'theme', value: 'cyberpunk' },
    { id: 'item_165', name: '🔥 Cehennem Ateşi Tema Efekti', cost: 500, type: 'theme', value: 'fire' },
    { id: 'item_166', name: '❄️ Buzul Çağı Tema Efekti', cost: 380, type: 'theme', value: 'ice' },
    { id: 'item_167', name: '🌸 Sakura Baharı Tema Efekti', cost: 300, type: 'theme', value: 'sakura' },
    { id: 'item_168', name: '🕶️ Matrix Kodu Tema Efekti', cost: 600, type: 'theme', value: 'matrix' },
    { id: 'item_169', name: '🪙 Altın Sarayı Tema Efekti', cost: 700, type: 'theme', value: 'gold_theme' },
    { id: 'item_170', name: '🪩 Disko Işıkları Tema Efekti', cost: 550, type: 'theme', value: 'disco' },
    { id: 'item_171', name: '🥇 Altın Rengi İsim', cost: 300, type: 'color', value: 'gold' },
    { id: 'item_172', name: '🥈 Gümüş Rengi İsim', cost: 200, type: 'color', value: 'silver' },
    { id: 'item_173', name: '💖 Pembe Rengi İsim', cost: 180, type: 'color', value: 'pink' },
    { id: 'item_174', name: '💙 Masmavi İsim', cost: 180, type: 'color', value: 'blue' },
    { id: 'item_175', name: '💚 Zümrüt Yeşili İsim', cost: 180, type: 'color', value: 'green' },
    { id: 'item_176', name: '💜 Mor Büyü İsim', cost: 220, type: 'color', value: 'purple' },
    { id: 'item_177', name: '🧡 Turuncu Ateş İsim', cost: 200, type: 'color', value: 'orange' },
    { id: 'item_178', name: '❤️ Kan Kırmızı İsim', cost: 250, type: 'color', value: 'red' },
    { id: 'item_179', name: '💛 Parlak Sarı İsim', cost: 210, type: 'color', value: 'yellow' },
    { id: 'item_180', name: '🖤 Karanlık Siyah İsim', cost: 280, type: 'color', value: 'black' },
    { id: 'item_181', name: '🤍 Saf Beyaz İsim', cost: 260, type: 'color', value: 'white' },
    { id: 'item_182', name: 'Turkuaz İsim', cost: 230, type: 'color', value: 'turquoise' },
    { id: 'item_183', name: '🍇 Magenta Mor İsim', cost: 240, type: 'color', value: 'magenta' },
    { id: 'item_184', name: '🍋 Limon Yeşili İsim', cost: 220, type: 'color', value: 'lime' },
    { id: 'item_185', name: '🪸 Mercan Rengi İsim', cost: 210, type: 'color', value: 'coral' },
    { id: 'item_186', name: '🦚 Tavus Kuşu Mavisi İsim', cost: 260, type: 'color', value: 'peacock' },
    { id: 'item_187', name: '🍫 Çikolata Kahverengi İsim', cost: 190, type: 'color', value: 'chocolate' },
    { id: 'item_188', name: '🦄 Gökkuşağı Renkli İsim', cost: 800, type: 'color', value: 'rainbow' },
    { id: 'item_189', name: '🔥 Alevli Renkli İsim', cost: 750, type: 'color', value: 'flame_color' },
    { id: 'item_190', name: '✨ Parlayan Neon İsim', cost: 650, type: 'color', value: 'neon_color' },
    { id: 'item_191', name: '🌟 Yıldızlı Arka Plan', cost: 400, type: 'theme', value: 'stars_bg' },
    { id: 'item_192', name: '🌧️ Dijital Yağmur', cost: 450, type: 'theme', value: 'matrix_bg' },
    { id: 'item_193', name: '🫧 Sabun Köpüğü Arka Plan', cost: 320, type: 'theme', value: 'bubbles_bg' },
    { id: 'item_194', name: '🍂 Sonbahar Yaprakları', cost: 300, type: 'theme', value: 'autumn_bg' },
    { id: 'item_195', name: '❄️ Kar Yağışı Arka Plan', cost: 350, type: 'theme', value: 'snow_bg' },
    { id: 'item_196', name: '⚡ Şimşek Çakması Efekti', cost: 480, type: 'theme', value: 'lightning_bg' },
    { id: 'item_197', name: '🌊 Dalga Efekti', cost: 330, type: 'theme', value: 'wave_bg' },
    { id: 'item_198', name: '🔥 Kor Efekti', cost: 410, type: 'theme', value: 'embers_bg' },
    { id: 'item_199', name: '💎 Elmas Parıltısı', cost: 550, type: 'theme', value: 'diamond_bg' },
    { id: 'item_200', name: '🌌 Sonsuzluk Evreni', cost: 900, type: 'theme', value: 'universe_bg' },

    // --- ÖZEL PERKLER, SANDIKLAR VE GÜÇLENDİRİCİLER (201-250+) ---
    { id: 'item_201', name: '📜 Özel Soru Çözüm Hakkı I', cost: 100, type: 'perk', value: 'perk_1' },
    { id: 'item_202', name: '📜 Özel Soru Çözüm Hakkı II', cost: 100, type: 'perk', value: 'perk_2' },
    { id: 'item_203', name: '📜 Özel Soru Çözüm Hakkı III', cost: 100, type: 'perk', value: 'perk_3' },
    { id: 'item_204', name: '🎁 Gizli Sandık I', cost: 250, type: 'chest', value: 'chest_1' },
    { id: 'item_205', name: '🎁 Gizli Sandık II', cost: 350, type: 'chest', value: 'chest_2' },
    { id: 'item_206', name: '🎁 Gizli Sandık III', cost: 500, type: 'chest', value: 'chest_3' },
    { id: 'item_207', name: '🎁 Efsanevi Sandık', cost: 1000, type: 'chest', value: 'epic_chest' },
    { id: 'item_208', name: '🛡️ Reklam Koruma Kalkanı', cost: 150, type: 'perk', value: 'shield' },
    { id: 'item_209', name: '⚡ Çift XP İksiri (1 Günlük)', cost: 300, type: 'boost', value: 'xp_double' },
    { id: 'item_210', name: '⚡ Üç Kat XP İksiri (1 Saatlik)', cost: 600, type: 'boost', value: 'xp_triple' },
    { id: 'item_211', name: '☕ Sanal Kahve Molası', cost: 50, type: 'perk', value: 'coffee' },
    { id: 'item_212', name: '🎧 Odaklanma Müzik Listesi', cost: 120, type: 'perk', value: 'music' },
    { id: 'item_213', name: '🍎 Zihin Açıcı Elma', cost: 70, type: 'perk', value: 'apple' },
    { id: 'item_214', name: '🍫 Enerji Çikolatası', cost: 80, type: 'perk', value: 'chocolate_bar' },
    { id: 'item_215', name: '🧊 Serinletici Soda', cost: 60, type: 'perk', value: 'soda' },
    { id: 'item_216', name: '📘 VIP Ders Notu Erişimi', cost: 400, type: 'perk', value: 'vip_notes' },
    { id: 'item_217', name: '📝 Sınırsız Soru Ekleme Hakkı', cost: 500, type: 'perk', value: 'unlimited_questions' },
    { id: 'item_218', name: '🔑 Admin Paneli İpucu', cost: 800, type: 'perk', value: 'admin_hint' },
    { id: 'item_219', name: '🍀 Şans İksiri (XP Şansı)', cost: 350, type: 'boost', value: 'luck_potion' },
    { id: 'item_220', name: '⏰ Pomodoro Süre Uzatıcı', cost: 150, type: 'perk', value: 'pomo_boost' },
    { id: 'item_221', name: '🧪 Kimya Deney Kartı', cost: 180, type: 'perk', value: 'chem_card' },
    { id: 'item_222', name: '📐 Geometri Çözüm Pusulası', cost: 200, type: 'perk', value: 'geo_compass' },
    { id: 'item_223', name: '📖 Paragraf Taktiği Kitapçığı', cost: 220, type: 'perk', value: 'paragraf_guide' },
    { id: 'item_224', name: '🔬 Fen Bilimleri Özet Kartı', cost: 190, type: 'perk', value: 'science_summary' },
    { id: 'item_225', name: '🗺️ İnkılap Tarihi Kronolojisi', cost: 170, type: 'perk', value: 'history_chrono' },
    { id: 'item_226', name: '🗣️ İngilizce Kelime Kartları', cost: 160, type: 'perk', value: 'english_words' },
    { id: 'item_227', name: '⚖️ Din Kültürü Kavram Sözlüğü', cost: 150, type: 'perk', value: 'religion_dict' },
    { id: 'item_228', name: '🎯 LGS Hedef Kartı', cost: 250, type: 'perk', value: 'lgs_target_card' },
    { id: 'item_229', name: '🧠 Hafıza Güçlendirici Çay', cost: 90, type: 'perk', value: 'memory_tea' },
    { id: 'item_230', name: '🛌 Dinlenme Modu Bileti', cost: 110, type: 'perk', value: 'rest_ticket' },
    { id: 'item_231', name: '🧩 Zeka Küpü Oyuncak', cost: 130, type: 'perk', value: 'rubik_cube' },
    { id: 'item_232', name: '🎨 Dijital Çizim Tuvali', cost: 300, type: 'perk', value: 'digital_canvas' },
    { id: 'item_233', name: '🎵 Lofi Çalışma Müzikleri', cost: 140, type: 'perk', value: 'lofi_music' },
    { id: 'item_234', name: '🔥 Kesintisiz Seri Desteği', cost: 450, type: 'boost', value: 'streak_saver' },
    { id: 'item_235', name: '🌟 Profil Parlatma Efekti', cost: 500, type: 'theme', value: 'profile_glow' },
    { id: 'item_236', name: '💫 İsim Yıldızlandırma', cost: 350, type: 'color', value: 'star_name' },
    { id: 'item_237', name: '🎇 Havai Fişek Gösterisi Bileti', cost: 600, type: 'perk', value: 'fireworks' },
    { id: 'item_238', name: '🎈 Kutlama Balonu', cost: 80, type: 'perk', value: 'party_balloon' },
    { id: 'item_239', name: '🎊 Konfeti Patlatma Hakkı', cost: 100, type: 'perk', value: 'confetti' },
    { id: 'item_240', name: '🏆 Şampiyonluk Kürsüsü Yeri', cost: 1200, type: 'perk', value: 'podium_spot' },
    { id: 'item_241', name: '📦 Gizli Paket A', cost: 200, type: 'chest', value: 'pack_a' },
    { id: 'item_242', name: '📦 Gizli Paket B', cost: 200, type: 'chest', value: 'pack_b' },
    { id: 'item_243', name: '📦 Gizli Paket C', cost: 200, type: 'chest', value: 'pack_c' },
    { id: 'item_244', name: '🔑 Gizli Oda Anahtarı', cost: 750, type: 'perk', value: 'secret_key' },
    { id: 'item_245', name: '🚪 Gizli Kapı Kartı', cost: 700, type: 'perk', value: 'secret_card' },
    { id: 'item_246', name: '📜 Eski Parşömen', cost: 300, type: 'perk', value: 'old_scroll' },
    { id: 'item_247', name: '🧪 Alsimist İksiri', cost: 500, type: 'boost', value: 'alchemist_potion' },
    { id: 'item_248', name: '🔮 Kehanet Küresi', cost: 600, type: 'perk', value: 'prophecy_ball' },
    { id: 'item_249', name: '⚡ Yıldırım Gücü', cost: 800, type: 'boost', value: 'lightning_power' },
    { id: 'item_250', name: '🌌 Sonsuzluk Eldiveni', cost: 2500, type: 'perk', value: 'infinity_gauntlet' }
];

function renderShop() {
    const shopList = document.getElementById("shop-items-container");
    if (!shopList) return;

    shopList.innerHTML = shopItems.map(item => {
        const isOwned = userInventory.includes(item.id);
        const isActive = activeTitle === item.value;

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
        `;
    }).join('');
}

async function buyShopItem(itemId, cost) {
    if (userInventory.includes(itemId)) {
        alert("Bu eşyaya zaten sahipsiniz!");
        return;
    }

    // YÖNETİCİ KONTROLÜ: E-posta femememe1973@gmail.com ise doğrudan onay ver
    let isAdmin = false;
    try {
        const { data: { user } } = await dersverseSupabase.auth.getUser();
        if (user && user.email === 'femememe1973@gmail.com') {
            isAdmin = true;
        }
    } catch (e) {}

    const canPurchase = isAdmin || (await deductXP(cost));

    if (canPurchase) {
        userInventory.push(itemId);
        localStorage.setItem("dersverse_inventory", JSON.stringify(userInventory));
        
        const item = shopItems.find(i => i.id === itemId);
        if (item && item.type === 'title') {
            equipTitle(item.value);
        }
        
        alert("Satın alma başarılı! Ürün hesabınıza tanımlandı.");
        renderShop();
    } else {
        alert("Yetersiz XP! Daha fazla ders çalışarak veya soru ekleyerek XP kazanabilirsiniz.");
    }
}

function equipTitle(titleValue) {
    activeTitle = titleValue;
    localStorage.setItem("dersverse_active_title", activeTitle);
    updateUserStats();
    renderShop();
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
    alert("Soru kaydedildi! (+15 XP Kazandınız)");
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

// Kullanıcı Oturum Kontrolü
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

// Giriş/Çıkış
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

// Arama ve Filtreleme
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

    // Supabase XP Çekme ve Canlı Dinleme
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

            if (data) {
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
                    if (payload.new && typeof payload.new.xp !== 'undefined') {
                        userPoints = payload.new.xp;
                        localStorage.setItem("dersverse_xp", userPoints);
                        updateUserStats();
                    }
                }
            )
            .subscribe();
    }

    loadUserXP();
    listenXPChanges();
    dersverseLoadContents();
    checkUserBannedStatus();
};
