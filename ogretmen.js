// ogretmen.js
document.addEventListener("DOMContentLoaded", function () {
    console.log("Öğretmen paneli başarıyla yüklendi.");

    const menuElemanlari = document.querySelectorAll(".sidebar ul li");
    const anaBaslik = document.querySelector(".main-icerik h1") || olusturBaslik();

    menuElemanlari.forEach(item => {
        item.addEventListener("click", function () {
            // Aktif sınıfını değiştirme
            menuElemanlari.forEach(el => el.classList.remove("aktif"));
            this.classList.add("aktif");

            // Sekme adına göre içeriği güncelleme
            const secilenSekme = this.textContent.trim();
            anaBaslik.textContent = secilenSekme;
            
            sayfaIceriginiGuncelle(secilenSekme);
        });
    });
});

function olusturBaslik() {
    const mainIcerik = document.querySelector(".main-icerik");
    const baslik = document.createElement("h1");
    baslik.style.marginBottom = "20px";
    baslik.style.color = "#2c3e50";
    mainIcerik.prepend(baslik);
    return baslik;
}

function sayfaIceriginiGuncelle(sekmeAdi) {
    const kartAlani = document.querySelector(".kart p");
    if (kartAlani) {
        kartAlani.textContent = `${sekmeAdi} sekmesine ait içerikler ve yönetim araçları burada listelenmektedir.`;
    }
}
