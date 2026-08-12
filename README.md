# DAMIRA TEXTILE — Turistik Tekstil Web Sitesi

Nice (Fransa) merkezli **DAMIRA TEXTILE** firmasının toptan (B2B) turistik tekstil ürünleri için modern, editoryal ve çok dilli web sitesi.

> Tasarım: minimalist, editoryal, "quiet luxury" — Tekla Fabrics ve Ferm Living çizgisinde.
> Palet: sıcak keten (`oklch(0.97 0.01 80)`), kömür siyahı (`oklch(0.20 0.01 80)`), şampanya altını (`oklch(0.72 0.08 75)`).

## Özellikler

- **E-Katalog:** 7 koleksiyon, 25 işlemeli desen (Monaco, Corsica, Vendée, Île d'Oléron, Baie de Somme, Marseille, Fort Boyard) — `catalog.html` sayfasında zengin açıklama ve görsellerle
- **Koleksiyon filtreleri + arama:** canlı filtreleme, "daha fazla" sayfalama, sıralama
- **Ürün modalı:** desen detayı, teknik özellikler, e-katalog bağlantısı
- **Teklif sepeti:** desenleri seçip hızlı teklif formuyla gönderme (TR/EN/FR)
- **Çok dilli:** TR / EN / FR dil değiştirici, seçim `localStorage`'ta kalıcı
- **Tamamen responsive:** 375px → 2560px, touch-first katalog
- **Erişilebilirlik:** klavye gezintisi, görünür focus halkaları, `prefers-reduced-motion` desteği

## Teknoloji

Saf HTML/CSS/JS — framework yok, build adımı yok, bağımlılık yok. Bir web sunucusuyla doğrudan çalışır.

- `index.html` — ana sayfa (hero, koleksiyonlar, desenler, atölye, teklif formu)
- `catalog.html` — e-katalog sayfası
- `css/styles.css` — OKLCH token sistemi, editoryal tipografi, responsive
- `js/data.js` — **modüler veri katmanı** (koleksiyonlar, desenler, çeviriler)
- `js/app.js` — ana sayfa: i18n, katalog render/filtre/arama, modal, teklif sepeti
- `js/catalog.js` — e-katalog render
- `items/` — ürün görselleri, koleksiyon klasörlerinde (işlemeli keten desenleri)
- `logos/` — marka logoları (DG monogramı)
- `catalogs/` — PDF kataloglar

## Çalıştırma

```bash
# Proje kökünde statik sunucu başlat
python3 -m http.server 8000
# veya
npx serve .
```

Tarayıcıda `http://localhost:8000` adresini açın.

## Yeni Koleksiyon / Desen Ekleme (Modüler Yapı)

Katalog tamamen `js/data.js` içindeki veriden üretilir. Yeni içerik eklemek için:

### 1. Yeni koleksiyon ekleme

`COLLECTIONS` dizisine kayıt ekleyin:

```js
{ id: 'normandie', img: 'items/normandie-cover.jpg', tr: 'Normandiya', en: 'Normandy', fr: 'Normandie' }
```

### 2. Yeni desen ekleme

`PRODUCTS` dizisine kayıt ekleyin:

```js
{ id: 'normandie-mont', coll: 'normandie', img: 'items/mont-saint-michel.jpg',
  tr: { n: 'Mont Saint-Michel', d: 'Koyda yükselen manastır adası.', t: 'Monument' },
  en: { n: 'Mont Saint-Michel', d: 'The abbey island rising from the bay.', t: 'Monument' },
  fr: { n: 'Mont Saint-Michel', d: "L'île abbatiale qui surgit de la baie.", t: 'Monument' } }
```

Filtre, arama, modal, teklif sepeti ve dil değiştirici otomatik olarak yeni kaydı algılar.

### 3. PDF katalog ekleme (isteğe bağlı)

`catalogs/` klasörüne `damira-catalog-2026.pdf` adıyla koyabilirsiniz; gerektiğinde `js/data.js` içindeki `modal.pdf` bağlantısı güncellenebilir.

## Yapı Notları

- Ürün görsel yolları `items/<koleksiyon>/` içindeki dosyalarla birebir eşleşir (boşluklar `%20` ile encode edilir).
- Çeviri anahtarları `I18N` objesinde üç dilde tutulur; eksik anahtar olursa TR'ye düşer.
- Dil seçimi `damira-lang` anahtarıyla tarayıcıda saklanır.
- Logo dosyaları `logos/` klasöründedir.

## Lisans

Özel proje — DAMIRA TEXTILE. Tüm hakları saklıdır.
