import { supabase } from './supabase.js'

export async function bekleyenIcerikleriGetir() {
  const { data, error } = await supabase
    .from('contents')
    .select('*')
    .eq('status', 'pending');
  return data;
}

export async function icerikOnayla(contentId) {
  const { error } = await supabase
    .from('contents')
    .update({ status: 'approved' })
    .eq('id', contentId);

  if (!error) alert("İçerik onaylandı ve canlıya alındı!");
}

export async function icerikSil(contentId) {
  const { error } = await supabase
    .from('contents')
    .delete()
    .eq('id', contentId);

  if (!error) alert("İçerik veritabanından silindi.");
}

// Doğrudan Supabase update komutu (Fonksiyonsuz, saf JS)
export async function kullaniciXpGuncelle(userId, yeniXpDegeri) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ xp: yeniXpDegeri })
    .eq('id', userId)
    .select();

  if (error) {
    alert("XP Güncelleme Hatası: " + error.message);
    console.error("Supabase Error:", error);
    return false;
  }

  alert("Kullanıcının XP puanı başarıyla güncellendi!");
  return true;
}
