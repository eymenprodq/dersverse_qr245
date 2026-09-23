// DersVerse - Supabase Bağlantı Yapılandırması
const DERSVERSE_SUPABASE_URL = 'https://dyxghgzquvsngehjjvcb.supabase.co';
const DERSVERSE_SUPABASE_KEY = 'sb_publishable_qgcYdZz60VDBkfLZ3UVftw_G9o30nYd'; 
const dersverseSupabase = supabase.createClient(DERSVERSE_SUPABASE_URL, DERSVERSE_SUPABASE_KEY);

let dersverseAllContents = [];

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
                <a href="detay.html?id=${item.id}" class="dersverse-btn dersverse-btn-outline" style="text-align: center; text-decoration: none;">Detayları Gör & Yorum Yap</a>
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

// İçerik Ekleme (Dosya Yükleme veya Harici LGS/YKS vb. Link Desteğiyle)
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
        alert("Lütfen LGS veya diğer ders kaynakları için ya bir dosya yükleyin ya da Google Drive / Yandex gibi harici bir indirme bağlantısı (link) girin!");
        return;
    }

    let contentStatus = 'pending'; 
    let finalLink = manualLink;
    let uploadUrlField = null;

    if (file) {
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
    } else {
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
        if (contentStatus === 'approved') {
            alert('Dosyanız başarıyla yüklendi ve doğrudan siteye eklendi!');
        } else {
            alert('İçerik/LGS bağlantınız başarıyla iletildi. Yönetici onayından sonra yayınlanacaktır.');
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

window.onload = () => {
    dersverseCheckUser();
    dersverseLoadContents();
};
