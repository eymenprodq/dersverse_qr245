import { supabase } from './supabase.js'

export async function icerikGonder(userName, category, title, description, downloadUrl) {
  // Benzersiz 18 haneli ID üretimi
  const uniqueId = Math.floor(100000000000000000 + Math.random() * 900000000000000000).toString();

  const { data, error } = await supabase
    .from('contents')
    .insert([
      { 
        id: uniqueId, 
        user_name: userName, 
        category: category, 
        title: title, 
        description: description, 
        download_url: downloadUrl, 
        status: 'pending' // Admin onayına düşer
      }
    ])

  if (error) {
    alert("Hata oluştu: " + error.message);
  } else {
    alert(`İçerik başarıyla gönderildi!\nOnaylandıktan sonraki adresi:\nsiteismi.vercel.app/${userName}/${category}/${uniqueId}`);
  }
}