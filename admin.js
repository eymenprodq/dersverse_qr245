import { supabase } from './supabase.js'

// Onay bekleyenleri çekme
export async function bekleyenIcerikleriGetir() {
  const { data, error } = await supabase
    .from('contents')
    .select('*')
    .eq('status', 'pending');

  return data;
}

// İçeriği onaylama
export async function icerikOnayla(contentId) {
  const { error } = await supabase
    .from('contents')
    .update({ status: 'approved' })
    .eq('id', contentId);

  if (!error) {
    alert("İçerik onaylandı ve canlıya alındı!");
    location.reload();
  }
}

// İçeriği reddetme/silme
export async function icerikSil(contentId) {
  const { error } = await supabase
    .from('contents')
    .delete()
    .eq('id', contentId);

  if (!error) {
    alert("İçerik veritabanından silindi.");
    location.reload();
  }
}

// Kullanıcıları ve XP bilgilerini getiren fonksiyon
export async function adminKullanicilariGetir() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, xp');

  if (error) {
    console.error("Kullanıcılar çekilemedi:", error.message);
    return [];
  }

  return data;
}

// Kullanıcının XP değerini güncelleyen fonksiyon
export async function kullaniciXpGuncelle(userId, yeniXpDegeri) {
  const xpMiktari = parseInt(yeniXpDegeri);

  if (isNaN(xpMiktari)) {
    alert("Lütfen geçerli bir sayı giriniz!");
    return;
  }

  const { error } = await supabase
    .from('profiles')
    .update({ xp: xpMiktari })
    .eq('id', userId);

  if (error) {
    console.error("XP güncellenemedi:", error.message);
    alert("XP güncellenirken bir hata oluştu: " + error.message);
    return false;
  }

  alert("Kullanıcı XP'si başarıyla güncellendi!");
  location.reload();
  return true;
}

// HTML içerisindeki butonların doğrudan görebilmesi için global window'a bağlıyoruz
window.kullaniciXpGuncelle = kullaniciXpGuncelle;
window.adminKullanicilariGetir = adminKullanicilariGetir;
