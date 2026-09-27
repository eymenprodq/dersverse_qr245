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
