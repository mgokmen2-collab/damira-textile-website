# DAMIRA TEXTILE — B2B Turistik Tekstil Web Sitesi & E-Katalog

Nice (Fransa) merkezli **DAMIRA TEXTILE** firmasının toptan (B2B) turistik tekstil ürünleri için modern, editoryal ve çok dilli dijital vitrini ve interaktif e-kataloğu.

> **Tasarım Dili:** Minimalist, editoryal, "quiet luxury" — Tekla Fabrics ve Ferm Living estetiği.  
> **Renk Paleti:** Sıcak keten (`oklch(0.97 0.01 80)`), kömür siyahı (`oklch(0.20 0.01 80)`), şampanya altını (`oklch(0.72 0.08 75)`).

---

## 🌟 Temel Özellikler

- **Ürün Odaklı Bilgi Mimarisi:** 6 ana ürün kategorisi ve 25 bölgesel Fransız kıyı deseni ile ayrıştırılmış B2B ürün kataloğu.
- **İnteraktif E-Katalog (`catalog.html`):** Kategori bazlı model varyasyonları, teknik kumaş detayları ve desen eşleştirmeleri.
- **Canlı Filtreleme & Arama:** Koleksiyon kategorilerine, desen bölgelerine göre anlık filtreleme, arama ve sayfalama.
- **Ürün & Model Modalı:** Yüksek çözünürlüklü görsel sunumu, kumaş/boyut spesifikasyonları ve e-katalog doğrudan erişimi.
- **B2B Teklif Sepeti & Talep Formu:** Müşterilerin desen ve ürünleri seçip hızlı teklif listesi oluşturabilmesi (TR / EN / FR).
- **Çok Dilli Altyapı (i18n):** Türkçe, İngilizce ve Fransızca tam dil desteği, `localStorage` üzerinde kalıcı kullanıcı tercihi.
- **Tam Responsive & Optimize:** 375px mobil ekranlardan 2560px 2K/4K ultra geniş ekranlara kadar kesintisiz editoryal deneyim.
- **Erişilebilirlik (a11y):** Tam klavye navigasyonu, görünür odaklama halkaları, `prefers-reduced-motion` desteği.

---

## 📐 Görsel Standartları & En/Boy Oranı (Aspect Ratio) Mimarisi

Katalogdaki tüm görsel varlıklar, kadraj kayıplarını (crop) sıfıra indirmek ve editoryal sunumu korumak için standardize edilmiştir:

| Varlık Türü | Hedef En/Boy Oranı | Çözünürlük Standardı | CSS Kuralı | Açıklama |
| :--- | :---: | :---: | :---: | :--- |
| **Hero Banner** | `16:9` | 2K (1920×1080 / 2560×1440) | `object-fit: cover` | Ana sayfa karşılama, Côte d'Azur editoryal lüks atmosfer. |
| **Ürün Koleksiyon Modelleri** | `3:4` | Dikey Portre (1536×2048 / 2K) | `aspect-ratio: 3/4`<br>`object-fit: contain` | Manken başı, omuzlar ve bornoz/etek boyu kesilmeden ferah sergilenir. |
| **Koleksiyon Kart Kapakları** | `3:4` | Dikey Portre (1536×2048 / 2K) | `aspect-ratio: 3/4`<br>`object-fit: cover` | 6 kategori kapak görseli, %0.4 minimum kadraj toleransı. |
| **Bölgesel İşleme/Baskı Desenleri** | `1:1` | Tam Kare (1024×1024) | `aspect-ratio: 1/1`<br>`object-fit: contain` | Nakış, iplik dokusu ve kenar motifleri tam kare içinde %0 kırpılma ile korunur. |

---

## 🗂️ Dosya & Proje Yapısı

Proje saf HTML, CSS ve JavaScript (Vanilla ES6+) ile geliştirilmiştir. Harici framework, build aracı veya derleme bağımlılığı yoktur.

```text
damira-website/
├── index.html              # Ana sayfa (Hero, 6 Koleksiyon, 25 Desen, Atölye, İletişim)
├── catalog.html            # İnteraktif E-Katalog sayfası
├── css/
│   └── styles.css          # OKLCH renk token'ları, tipografi, grid ve responsive kuralları
├── js/
│   ├── data.js             # Modüler veri katmanı (CATEGORIES, DESIGNS, PRODUCTS, I18N)
│   ├── app.js              # Ana sayfa: filtreleme, arama, modal, sepet, dil yönetimi
│   └── catalog.js          # E-katalog: model listeleme, filtreleme ve detay görünümleri
├── koleksiyonlar/          # 6 Ürün kategorisinin yüksek çözünürlüklü model ve kapak görselleri
│   ├── bornoz/             # Bukle havlu, waffle kimono, kapüşonlu spa bornozları
│   ├── havlu/              # Jakarlı plaj havluları, otel banyo setleri, peşkirler
│   ├── pike/               # Fransız stil waffle ve jakarlı yatak örtüleri
│   ├── pestemal/           # Taş yıkama saçaklı fouta ve peştemaller
│   ├── canta/              # Ham keten plaj ve şehir çantaları, fermuarlı clutch'lar
│   └── hediyelik/          # Mutfak kurulama bezleri, lavanta keseleri, hediye setleri
├── items/                  # 25 Bölgesel işlemeli desen görseli (1024x1024 px kare)
├── assets/                 # Hero banner ve statik editoryal görseller
├── logos/                  # Marka logoları ve DG monogram vektörleri
└── catalogs/               # İndirilebilir B2B PDF katalogları
```

---

## 🚀 Yerel Geliştirme (Local Development)

Projeyi yerel makinenizde test etmek için herhangi bir statik web sunucusu yeterlidir:

```bash
# Python 3 ile yerel sunucu başlatma
python3 -m http.server 8000

# veya Node.js npx serve ile
npx serve .
```

Tarayıcınızda `http://localhost:8000` adresini açarak siteyi görüntüleyebilirsiniz.

---

## 🧩 Modüler Veri Katmanı (`js/data.js`)

Katalogdaki tüm veriler `js/data.js` üzerinden yönetilir.

### 1. Yeni Ürün Kategorisi Ekleme
`CATEGORIES` dizisine yeni kategori tanımı ekleyin:
```javascript
{
  id: 'yastik',
  img: 'koleksiyonlar/yastik/kapak.jpeg',
  tr: { title: 'Dekoratif Kırlent & Yastık', desc: 'Doğal keten dokulu kırlent kılıfları.' },
  en: { title: 'Cushions & Pillows', desc: 'Natural linen textured cushion covers.' },
  fr: { title: 'Coussins & Oreillers', desc: 'Housses de coussin en lin naturel.' }
}
```

### 2. Yeni Bölgesel Desen Ekleme
`DESIGNS` dizisine 1:1 kare formatında yeni nakış/baskı deseni ekleyin:
```javascript
{
  id: 'antibes',
  img: 'items/antibes.jpg',
  tr: { n: 'Antibes', d: 'Tarihi kale surları ve Akdeniz esintisi.' },
  en: { n: 'Antibes', d: 'Historic ramparts and Mediterranean breeze.' },
  fr: { n: 'Antibes', d: 'Remparts historiques et brise méditerranéenne.' }
}
```

Arama, filtreleme, teklif sepeti ve çeviri motoru yeni eklenen kayıtları otomatik olarak algılar.

---

## 🌐 Dağıtım & Yayın (Deployment)

Site **GitHub Pages** altyapısıyla barındırılmaktadır:

- **Canlı URL:** [https://mgokmen2-collab.github.io/damira-textile-website/](https://mgokmen2-collab.github.io/damira-textile-website/)
- `main` dalına (branch) yapılan her onaylanmış güncelleme, `.github/workflows/pages.yml` iş akışı aracılığıyla otomatik olarak canlıya alınır.
- Kalıcı özel alan adı (örn. `damiratextile.com`) GitHub Pages ayarlarından tanımlanabilir.

---

## 📄 Lisans & Mülkiyet

Telif Hakkı © 2026 **DAMIRA TEXTILE** (Nice, Fransa). Tüm hakları saklıdır.
B2B toptan ticari kullanım ve özel dağıtım içindir.
