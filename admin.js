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

// Kullanıcı XP Güncelleme Fonksiyonu (Hataysız ve Güvenli)
export async function kullaniciXpGuncelle(userId, yeniXpDegeri) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ xp: yeniXpDegeri })
      .eq('id', userId)
      .select();

    if (error) {
      console.error("Supabase XP Güncelleme Hatası:", error);
      alert("XP güncellenirken veritabanı hatası oluştu: " + error.message);
      return false;
    }

    if (!data || data.length === 0) {
      // Eğer 'id' sütunu eşleşmediyse 'user_id' ile tekrar deneme güvenliği
      const { data: retryData, error: retryError } = await supabase
        .from('profiles')
        .update({ xp: yeniXpDegeri })
        .eq('user_id', userId)
        .select();

      if (retryError || !retryData || retryData.length === 0) {
        alert("Kullanıcı profili veritabanında bulunamadı veya güncellenemedi.");
        return false;
      }
    }

    alert("Kullanıcının XP puanı başarıyla güncellendi!");
    return true;
  } catch (err) {
    console.error("Beklenmeyen hata:", err);
    alert("Bir hata oluştu. Lütfen konsolu kontrol edin.");
    return false;
  }
}
