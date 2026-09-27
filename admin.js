import { supabase } from './supabase.js'

// Onay bekleyenleri çekme
export async function bekleyenIcerikleriGetir() {
  const { data, error } = await supabase
    .from('contents')
    .select('*')
    .eq('status', 'pending');

  return data;
}

// İçeriği onaylama (Durumu approved yapar)
export async function icerikOnayla(contentId) {
  const { error } = await supabase
    .from('contents')
    .update({ status: 'approved' })
    .eq('id', contentId);

  if (!error) {
    alert("İçerik onaylandı ve canlıya alındı!");
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
  }
}

// Kullanıcıları ve XP bilgilerini getiren fonksiyon
export async function adminKullanicilariGetir() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, xp'); // Özellikle 'xp' sütununu çektiğimizden emin oluyoruz

  if (error) {
    console.error("Kullanıcılar çekilemedi:", error);
    return [];
  }

  return data;
}

// Kullanıcının XP değerini güncelleyen fonksiyon (Eksik olan ve hataya sebep olan fonksiyon buydu)
export async function kullaniciXpGuncelle(userId, yeniXp) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ xp: yeniXp })
    .eq('id', userId);

  if (error) {
    console.error("XP güncellenemedi:", error.message);
    alert("XP güncellenirken bir hata oluştu!");
    return false;
  }

  alert("Kullanıcı XP'si başarıyla güncellendi!");
  return true;
}
