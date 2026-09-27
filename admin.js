import { supabase } from './supabase.js'

// Fonksiyonları dışarıdan (HTML içindeki onclick'lerden) tetiklenebilmesi için window'a bağlıyoruz:
window.bekleyenIcerikleriGetir = async function() {
  const { data, error } = await supabase
    .from('contents')
    .select('*')
    .eq('status', 'pending');
  return data;
}

window.icerikOnayla = async function(contentId) {
  const { error } = await supabase
    .from('contents')
    .update({ status: 'approved' })
    .eq('id', contentId);

  if (!error) {
    alert("İçerik onaylandı ve canlıya alındı!");
    location.reload();
  }
}

window.icerikSil = async function(contentId) {
  const { error } = await supabase
    .from('contents')
    .delete()
    .eq('id', contentId);

  if (!error) {
    alert("İçerik veritabanından silindi.");
    location.reload();
  }
}

// XP Güncelleme Fonksiyonu
window.kullaniciXpGuncelle = async function(userId, yeniXpDegeri) {
  console.log("XP Güncelleniyor... Kullanıcı ID:", userId, "Yeni XP:", yeniXpDegeri);

  const { data, error } = await supabase
    .from('profiles')
    .update({ xp: yeniXpDegeri, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select();

  if (error) {
    console.error("Supabase XP Güncelleme Hatası:", error);
    alert("XP Güncellenirken Hata Oluştu: " + error.message);
    return false;
  }

  console.log("Güncelleme Başarılı:", data);
  alert("Kullanıcının XP puanı başarıyla güncellendi!");
  return true;
}
