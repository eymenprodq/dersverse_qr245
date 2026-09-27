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

// Kullanıcıya XP ekleme / güncelleme fonksiyonu
export async function kullaniciXpGuncelle(userId, yeniXpDegeri) {
  const { error } = await supabase
    .from('profiles')
    .update({ xp: yeniXpDegeri, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) {
    alert("XP güncellenirken hata oluştu: " + error.message);
    return false;
  } else {
    alert("Kullanıcının XP puanı başarıyla güncellendi!");
    return true;
  }
}
