import { supabase } from './supabase.js'

// Sayfa açıldığında kullanıcıları otomatik getiren ve tabloya basan ana fonksiyon
export async function adminKullanicilariGetir() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, xp');

  if (error) {
    console.error("Kullanıcılar çekilemedi:", error.message);
    return [];
  }

  // Kullanıcı listesini ekrandaki tabloya otomatik basıyoruz
  const tabloGovdesi = document.getElementById('kullaniciTablosuBody');
  if (tabloGovdesi) {
    tabloGovdesi.innerHTML = '';
    
    data.forEach(kullanici => {
      const satir = document.createElement('tr');
      satir.innerHTML = `
        <td>${kullanici.email || 'Belirtilmemiş'}</td>
        <td>${kullanici.role || 'user'}</td>
        <td>
          <input type="number" id="xp-input-${kullanici.id}" value="${kullanici.xp || 0}" style="width: 80px; padding: 4px;">
        </td>
        <td>
          <button onclick="kullaniciXpGuncelle('${kullanici.id}')" style="background: #4f46e5; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px;">
            Güncelle
          </button>
        </td>
      `;
      tabloGovdesi.appendChild(satir);
    });
  }

  return data;
}

// Kullanıcının XP değerini güncelleyen fonksiyon
export async function kullaniciXpGuncelle(userId) {
  const inputElement = document.getElementById(`xp-input-${userId}`);
  if (!inputElement) return;

  const yeniXp = parseInt(inputElement.value);

  if (isNaN(yeniXp)) {
    alert("Lütfen geçerli bir sayı giriniz!");
    return;
  }

  const { error } = await supabase
    .from('profiles')
    .update({ xp: yeniXp })
    .eq('id', userId);

  if (error) {
    console.error("XP güncellenemedi:", error.message);
    alert("XP güncellenirken hata oluştu: " + error.message);
    return;
  }

  alert("Kullanıcı XP'si başarıyla güncellendi!");
  adminKullanicilariGetir(); // Listeyi yenile
}

// Global window'a bağlayarak butonların direkt görmesini sağlıyoruz
window.kullaniciXpGuncelle = kullaniciXpGuncelle;
window.adminKullanicilariGetir = adminKullanicilariGetir;

// Sayfa yüklendiği an otomatik çalıştır
document.addEventListener('DOMContentLoaded', () => {
  adminKullanicilariGetir();
});
