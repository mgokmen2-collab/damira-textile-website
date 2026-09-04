# COQ D'OR — Maison de Linge · Design Constitution

Tek kaynak: bu dosya. `.commandcode/design/brief.md` (2026-08-12 DAMIRA sürümü) güncellendi: marka kimliği COQ D'OR'a geçti, IA ve bileşen kuralları 2026-09-03/04 ürün-önce yeniden tasarımına (feature/product-visuals-and-catalog) göre yenilendi.

## Register

**Brand (içinde ürün yüzeyi).** Site bir dijital showroom'dur: Nice merkezli lüks turistik/otel tekstili toptancısının deneyimi sitedir. Duygusal varış, editoryal ritim, quiet luxury. E-katalog sayfası ve ürün grubu/desen inceleme panelleri, marka yüzeyinin içindeki ürün yüzeyleridir.

## Business Reality (kullanıcı doğrulamalı)

- **COQ D'OR — Maison de Linge SAS**, Nice (Fransa). %100 Ege pamuğu bornoz, havlu, pike, peştemal/fouta, kanvas çanta & şarap kılıfı, hediyelik/özel nakış üretimi.
- İki bağımsız eksen: **ürün grubu → model** (sade/desensiz sipariş edilebilir) ve **bölgesel desen** (her desen her ürüne uygulanabilir). Katalog, içerik ajansı tarafından sağlanan model fotoğraflarıyla doğrulanmıştır.
- Kataloglar modüler: yeni koleksiyon/desen eklemek tek veri kaydı ile mümkün (`js/data.js`).
- Alıcılar: hediyelik eşya mağazaları, oteller, butikler, perakende turistik satış noktaları (B2B).

## Target Audience & Requirements

- B2B müşteriler; otel ve butik alıcılar; dokunmatik öncelikli tablet kullanımı (showroom ziyaretleri).
- **Diller:** TR / EN / FR; başlıkta FR-EN-TR sıralı metin geçişi. Seçim `localStorage` (`damira-lang`) ile kalıcıdır.
- **Birincil iş:** İlk kez gelen B2B alıcı, ~30 saniyede "bu bornoz + bu desen" isteyebilmeli; sipariş/numune için teklif sepeti ve form.
- **Temel akışlar:** Koleksiyon kartı → ürün grubu inceleme paneli (slider) → "Desen İstemiyorum" (sade ekle) veya "Desen Seç & Ekle" (modele desen bağla) → kalıcı "Teklif Oluştur" → teklif formu; desen kartı → desen inceleme görünümü → teklife ekle / e-kataloğu aç.
- **PDF indirme yok:** `catalog.html` interaktif e-katalogdur; katalog bağlantıları görsel taramaya ikincildir. `catalogs/` yalnızca README yer tutucusu içerir.

## Voice

- **Fiziksel sözcükler:** linen, warm, tactile, unhurried, editorial, quiet, precise, generous; Riviera / Côte d'Azur / %100 Ege pamuğu.
- Şiirsel/editoryal ama kısa cümleler; numerik başlık istatistikleri yok ("6 Temel Kategori..." reddedildi); başlıklar zarif, anlamlı cümleler olmalı.
- Kopya kısa, sentence case, ünlem yok; Türkçe kaynak dil; EN/FR çeviriler satır uzunluğunu bozmamalı. Kumaş adları ve koleksiyon adları özel isimdir; onları koru.
- Tek satırlık meta satırları (eyebrow, B2B notu) asla iki satıra inmemeli; gerekirse `white-space: nowrap` ve küçültme.
- Kullanıcı tarafından dikte edilen metinleri birebir uygula (TR HTML fallback + üç dilde çeviri).

## Anti-References

- Eski DAMIRA sisteminin bayat kısımları ve eski modal-yoğun, tarihli grid.
- Eski tasarıma kıyasla kalite kaybı: yeni içerik/marka korunmalı ama kanıtlanmış editoryal sistem (tipografi, ferahlık, kompozisyon, 1440px genişlik) gerilememeli. "İlk hali daha iyiydi, ona dönelim" her zaman olası yönerge.
- Generic tech/startup refleksleri: mavi-mor CTA'lar, purple-cyan gradyanlar, pill butonlar, glassmorphism, emoji ikonlar, stok-foto lüks klişeleri, tekrarlanan "Desenler/Desenler" başlıkları, header'da iki satıra kırılan metinler.
- SaaS "her yerde card grid" kalıbı; kartlar yalnızca içerik gerçekten kart biçimliyse (kumaş örnekleri, kapaklar).
- Merkezlenmiş hero + üç özellik kartı varsayılan kompozisyonu.

## Inspiration & Competitor Benchmarks

- **Tekla Fabrics:** mimari tipografi, cömert boşluk, yüksek kalite fotoğraf odağı.
- **Ferm Living:** editoryal lookbook'lar, sıcak minimal UI.
- Eski DAMIRA görsel dili (linen + kömür + şampanya altını + serif/sans) kalite taban çizgisidir; bu sistem marka dönüşümünden sağ çıkmalıdır.

## Design Principles

1. **Texture before decoration.** Kumaş fotoğrafı kahramandır; UI araya girmez. Cömert negatif alan; rakip desen yok. 1440px tam genişlik.
2. **Editorial hierarchy.** Serif display ile gerçek ölçek kontrastı; 3 seviyeli metin blokları (hook/bridge/detail); paragraflar ~62-76ch.
3. **Katalog bir lookbook'tur, dosya listesi değil.** Grid'ler editoryal; görsel tarama birincil.
4. **Quiet luxury restraint demektir.** Altın aksan yüzeyin ~%10'undan azında; keten zemini sayfayı taşır.
5. **Touch-first.** Hover geliştirmedir, asla kapı değil; dokunmatikte hover karşılıkları (`:active` zoom, dokunma tepkileri) tasarlanır.
6. **Ürün-önce IA, müşteri odaklı.** Kullanıcı önce ürün grubunun gerçek modellerini görür; iç taksonomi müşteri yolculuğunu ele geçirmez.

## Accessibility Expectations

- Kontrast: kömür/linen AA; altın yalnızca aksan/görüntü.
- Odak halkaları görünür, 3:1 kontrast; hairline geometriyle tutarlı.
- Hedefler ≥44×44 (görsel olarak küçük öğelerde `::before` ile büyüt).
- `prefers-reduced-motion` saygı duyulur; dokunmatik zoom ve shimmer efektleri iOS Hareketi Azalt'ta da canlı kalmalı (kullanıcı bu efekti sever).
- Klavye: tüm grid'ler, dil değiştirici, paneller, form; modal/grup panelinde odak yönetimi.
- Türkçe karakter bozulması (mojibake) yok; etiketler her zaman görünür, placeholder etiket değil.

## Visual Foundation

- **Brand Identity:** COQ D'OR — Maison de Linge. Lüks otel & butik tekstili. Minimalist, editoryal, quiet luxury; "atelier" hissi.
- **Logo (header):** `logos/yatay_header.png` — yatay COQ D'OR lockup (yatay_header.jpg aynı görselin JPG'si; logo-yeni.jpeg değerlendirilebilir). Marka metni zaten logoda; yanına ekstra HTML metin ekleme. Header'da büyük ve okunaklı olmalı; responsive (≤480px) küçülür. Favicon `logos/kare_horoz.png`; `logos/eski/` (damira_horizontal_logo_preview.jpg, logo-dg.png) eski marka kalıntısı.
- **Colors (OKLCH):**
  - Zemin: Sıcak Keten `oklch(0.97 0.01 80)` / `#FAF8F5`; `--bg-soft` kum tonu.
  - Metin: Kömür `oklch(0.20 0.01 80)` / `#1A1918`; `--ink-soft`/`--ink-faint` gövde ve mikro etiketler.
  - Aksan: Şampanya Altını `oklch(0.72 0.08 75)` / `#C5A059`; `--gold-deep` metin/kontrast için.
  - Kenarlıklar: Kum `oklch(0.92 0.01 80)` / `--line-strong`; odak `--focus`.
  - Semantik roller Riviera tonlu (zeytin başarı, pişmiş toprak hata).
- **Type:** `Cormorant Garamond` (editoryal serif display; italik vurgu altın "gold" ile) + `Inter` (sessiz UI sans). Harf aralıklı büyük harf etiketler (eyebrow). Ölçek modüler (rem); hero display `clamp(2.8rem,6vw,5rem)`.
- **Photography:** model/ürün fotoğrafları `koleksiyonlar/<grup>/` (3:4 portre, `cover`); bölgesel desenler `items/designs/` (1:1 kare, `contain`). Yakın plan, doku odaklı, eşit yumuşak ışık, minimal stil. Hero: video (`videos/hero-coqdor.mp4`) + poster `items/giris-foto-new-2k.jpeg`, 16:9 çerçeve, ~12px radius. Kırpma sıfır hedeflenir; hover'da tam görünüm katmanı (contain) veya `scale(1.06)` zoom-in; dokunmatikte `:active` karşılığı. Kullanıcı, grid'deki aynı görselin tekrarını (md5) reddeder.

## Component Rules

- **Header:** logo sol; nav sağda: Koleksiyonlar / E-Katalog / Desenler / Atölye / İletişim; CTA "Teklif Al" (doluysa altın sayaç rozeti, 0'da gizli). FR-EN-TR metin geçişi (hairline kutu). ≤768px hamburger overlay (`position:fixed`, safe-area, X her zaman görünür, header üstte). CTA 0 sayaçta gizli; sticky sepet çubuğu da 0'da gizli (1'den itibaren görünür). İki satıra kırılma yok (nowrap).
- **Kartlar (koleksiyon & desen):** tam genişlik, ortalanmış, görünür hover (dolu zemin) butonlar; koleksiyon kartı "İncele & Teklife Ekle", desen kartı "İncele" (tıklayınca desen inceleme görünümü). Koleksiyon kartının tamamı (foto dahil) tıklanabilir. Kırpma yok, tekrarlanan görsel yok; sıralı yavaş shimmer (2.8s, kademeli).
- **Ürün grubu inceleme paneli (.group-modal):** bulanık arka plan, model fotoğraf slider'ı (oklar, noktalar, auto-advance, swipe), "Desen İstemiyorum" (sade ekle) ve "Desen Seç & Ekle" kararları, alt bilgi özeti; E-Kataloğu Aç bağlama duyarlı (`catalog.html#bornoz` gibi hash).
- **Modele desen bağlama (pending bar):** desen arşivi bölümünün altında sabit; seçilen model + desenleri gösterir; "Teklif Oluştur" seçimleriyle birlikte forma gider.
- **E-Katalog (catalog.html):** kapak başlığı; her grubun büyük görsel + açıklama + model minyatürleri (tıklayınca ana görsel değişir; aktif thumb işaretli); desen grupları bölgesel kategorilere göre (chip mantığı, tam set); her desen varyant thumb'ları; "Teklif Alın" CTA.
- **Teklif formu:** ad, firma, e-posta (zorunlu), telefon, mesaj; seçilen ürünler/desenler yukarıda etiketler (çıkarılabilir); alan bazlı hata işaretleri (`aria-invalid`, `role=alert`); başarı "2 iş günü" yanıtını adlandırır; seçimler başarısız gönderimde korunur.
- **Modal (ürün/desen detay):** 2 sütun (figür + içerik), varyant slider'ı, Escape/backdrop/× kapatma; "Teklife Ekle" + "E-Kataloğu Aç".
- **Toast:** ekleme onayı sağ altta ~2× süre; "sepeti temizle" sessiz.
- **Dil:** localStorage kalıcılığı, `aria-pressed`; FR uzun etiketlerde satır kırılması yok.
- **Modüler veri:** tüm koleksiyonlar/desenler/çeviriler `js/data.js` içinde (`window.DAMIRA`; CATEGORIES, DESIGNS, I18N). Desen eklemek = bir obje kaydı; UI (filtre, ara, teklif, modal) otomatik algılar. Uygulama `js/app.js`; e-katalog `js/catalog.js`.

## Deployment & CI (context)

- Branch `main` → push, `.github/workflows/pages.yml` ile GitHub Pages (`/damira-textile-website/`) + Cloudflare Pages (`damira-textile` projesi) dağıtır.
- Geliştirme branch'i açık PR (`feature/product-visuals-and-catalog`); **merge ana dalına yalnızca kullanıcı onayıyla**, push günlük hijyendir. Yayın öncesi son kontroller localhost'ta test edilir (bkz. taste: local-first, verify).
