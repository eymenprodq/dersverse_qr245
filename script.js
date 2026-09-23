// DersVerse - Supabase Bağlantı Yapılandırması
const DERSVERSE_SUPABASE_URL = 'https://dyxghgzquvsngehjjvcb.supabase.co';
const DERSVERSE_SUPABASE_KEY = 'sb_publishable_qgcYdZz60VDBkfLZ3UVftw_G9o30nYd'; 
const dersverseSupabase = supabase.createClient(DERSVERSE_SUPABASE_URL, DERSVERSE_SUPABASE_KEY);

let dersverseAllContents = [];

// GLOBAL KULLANICI İSMİ VE ROZET DÜZENLEYİCİ
function dersverseGetFormattedUser(email, originalName = '') {
    if (email === 'femememe1973@gmail.com') {
        return {
            name: 'Kadir Eymen Açıkoğlu',
            badge: ' ✔️ 🔨', // Doğrulama ve Çekiç (Yönetici) İşareti
            isAdmin: true
        };
    }
    return {
        name: originalName || email.split('@')[0],
        badge: '',
        isAdmin: false
    };
}

// Kullanıcı Oturum Kontrolü
async function dersverseCheckUser() {
    const { data: { user } } = await dersverseSupabase.auth.getUser();
    const authBtn = document.getElementById('dersverse-auth-btn');
    if (user) {
        const userInfo = dersverseGetFormattedUser(user.email, user.user_metadata?.full_name);
        authBtn.innerText = 'Çıkış Yap (' + userInfo.name + userInfo.badge + ')';
    } else {
        authBtn.innerText = 'Kayıt Ol / Giriş Yap';
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

function dersverseOpenModal() { document.getElementById('dersverse-add-modal').style.display = 'flex'; }
function dersverseCloseModal() { document.getElementById('dersverse-add-modal').style.display = 'none'; }

// Onaylanmış İçerikleri Yükleme
async function dersverseLoadContents() {
    const { data, error } = await dersverseSupabase
        .from('contents')
        .select('*')
        .eq('status', 'approved');

    if (error) {
        console.error("Veri yüklenirken hata:", error);
        return;
    }

    dersverseAllContents = data || [];
    dersverseRenderContents(dersverseAllContents);
}

// İçerik Kartlarını Ekrana Basma (Öğretmen ve Admin Rozet Desteğiyle)
function dersverseRenderContents(contents) {
    const grid = document.getElementById('dersverse-content-grid');

    if (!contents || contents.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--dersverse-text-muted);">Aradığınız kriterlere uygun içerik bulunamadı.</p>';
        return;
    }

    grid.innerHTML = contents.map(item => {
        const isTeacher = item.is_teacher || false;
        
        let authorDisplay = escapeHtml(item.user_name || 'Kullanıcı');
        let authorBadge = '';
        
        if (item.user_email === 'femememe1973@gmail.com' || item.user_name === 'Kadir Eymen Açıkoğlu') {
            authorDisplay = 'Kadir Eymen Açıkoğlu';
            authorBadge = ' ✔️ 🔨';
        }

        return `
            <div class="dersverse-card">
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <span class="dersverse-card-tag" style="margin-bottom:0;">${escapeHtml(item.category || 'Genel')}</span>
                        ${isTeacher ? '<span style="font-size: 0.75rem; background: rgba(99,102,241,0.2); color: #818cf8; padding: 2px 8px; border-radius: 12px; border: 1px solid #6366f1;">✔ Doğrulanmış Öğretmen</span>' : ''}
                    </div>
                    <h3 class="dersverse-card-title">${escapeHtml(item.title)}</h3>
                    <p class="dersverse-card-desc">${escapeHtml(item.description)}</p>
                    <p style="font-size: 0.8rem; color: var(--dersverse-text-muted); margin-bottom: 1rem;">Paylaşan: ${authorDisplay} <span style="color: #6366f1;">${authorBadge}</span></p>
                </div>
                <a href="detay.html?id=${item.id}" class="dersverse-btn dersverse-btn-outline" style="text-align: center; text-decoration: none;">Detayları Gör & Yorum Yap</a>
            </div>
        `;
    }).join('');
}

// Arama ve Kategori Filtreleme Mantığı
function dersverseFilterContents() {
    const searchVal = document.getElementById('dersverse-search-input').value.toLowerCase();
    const categoryVal = document.getElementById('dersverse-category-filter').value;

    const filtered = dersverseAllContents.filter(item => {
        const titleMatch = item.title && item.title.toLowerCase().includes(searchVal);
        const descMatch = item.description && item.description.toLowerCase().includes(searchVal);
        const matchesSearch = titleMatch || descMatch;

        const matchesCategory = categoryVal === 'Tümü' || item.category === categoryVal;

        return matchesSearch && matchesCategory;
    });

    dersverseRenderContents(filtered);
}

// LGS ve Diğer Büyük Dosyalar İçin Esnek İçerik Ekleme (Dosya Veya Harici Link)
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
    
    const fileInput = document.getElementById('dersverse-file-upload');
    const file = fileInput ? fileInput.files[0] : null;
    let manualLink = document.getElementById('dersverse-link') ? document.getElementById('dersverse-link').value : '';
    const submitBtn = document.getElementById('submit-content-btn');

    if (!file && !manualLink) {
        alert("Lütfen LGS/YKS gibi kaynaklar için ya bir dosya yükleyin ya da Google Drive / Yandex gibi harici bir indirme bağlantısı (link) girin!");
        return;
    }

    let contentStatus = 'pending'; 
    let finalLink = manualLink;
    let uploadUrlField = null;

    if (file) {
        submitBtn.innerText = "Yükleniyor... Lütfen Bekleyin";
        submitBtn.disabled = true;

        const fileName = `${Date.now()}_${file.name}`;
        const filePath = `all_media/${fileName}`;

        const { data: uploadData, error: uploadError } = await dersverseSupabase.storage
            .from('uploads')
            .upload(filePath, file);

        if (uploadError) {
            alert("Dosya yükleme hatası: " + uploadError.message);
            submitBtn.innerText = "Paylaş";
            submitBtn.disabled = false;
            return;
        }

        const { data: urlData } = dersverseSupabase.storage
            .from('uploads')
            .getPublicUrl(filePath);

        uploadUrlField = urlData.publicUrl;
        finalLink = urlData.publicUrl;
        contentStatus = 'approved'; 
    } else {
        // Eğer harici link girildiyse (LGS arşivi vb.) yöneticinin onayından geçmesi için pending yapılır
        contentStatus = 'pending';
    }

    const userInfo = dersverseGetFormattedUser(user.email, user.user_metadata?.full_name);
    const userName = userInfo.name;
    const isTeacher = user.user_metadata?.role === 'teacher' || false;

    const { error: dbError } = await dersverseSupabase.from('contents').insert([{
        title,
        category,
        description,
        link: finalLink,
        download_url: uploadUrlField,
        user_id: user.id,
        user_name: userName,
        user_email: user.email,
        status: contentStatus,
        is_teacher: isTeacher
    }]);

    if (dbError) {
        alert('Hata: ' + dbError.message);
        submitBtn.innerText = "Paylaş";
        submitBtn.disabled = false;
    } else {
        if (contentStatus === 'approved') {
            alert('Dosyanız başarıyla yüklendi ve doğrudan siteye eklendi!');
        } else {
            alert('LGS/Ders içerik bağlantınız başarıyla iletildi. Yönetici onayından sonra yayınlanacaktır.');
        }
        dersverseCloseModal();
        document.getElementById('dersverse-content-form').reset();
        submitBtn.innerText = "Paylaş";
        submitBtn.disabled = false;
        dersverseLoadContents(); 
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

window.onload = () => {
    dersverseCheckUser();
    dersverseLoadContents();
};
