# ADR-001: Ürün İç Galeri Veri Modeli ve Arayüz Entegrasyonu

## Durum (Context)
COQ D'OR — Maison de Linge B2B e-katalog ve web sitesinde, ürünlerin birden fazla profesyonel stüdyo ve lifestyle çekim açısı bulunmaktadır (ör. asılı, katlanmış, rulo, flatlay, makro dikiş detayları).

Önceki uygulamada, farklı çekim açıları vitrinde ayrı birer model kartı olarak listelenmiş (örneğin çanta kategorisinde 25 kart), bu durum vitrinde görsel kalabalığa ve B2B satın almacılar açısından teklif sepetinde mükerrer SKU kafa karışıklığına yol açmıştır.

## Karar (Decision)
1. **Veri Modeli (Data Layer):**
   - Her fiziksel ürün için tek bir model tanımı yapılacak.
   - En vurucu, kaliteli tek çekim açısı ana vitrin görseli (`img`) olarak belirlenecektir.
   - Ürüne ait diğer tüm çekim açıları (rulo, düz serili, katlı, makro detay) veri katmanında `gallery: [ ... ]` dizisi altında "İç Galeri" olarak eksiksiz yapılandırılacaktır.
2. **Arayüz Entegrasyonu (UI Scope):**
   - Mevcut aşamada vitrin ve katalog kartlarında yalnızca tek ana görsel gösterilecek; aynı ürünün çoklu açıları vitrinde mükerrer kart olarak açılmayacaktır.
   - Ürün inceleme panelinde (Group Modal / Product Detail) thumbnail şeridi / varyant geçişleri gibi gelişmiş iç galeri UI tasarımı ve entegrasyonu, tasarım dili onaylandıktan sonra bir sonraki geliştirme fazına bırakılacaktır.
3. **Desen Bağlantısı (Design Tagging):**
   - Üzerinde bölgesel Fransız şehir nakışı/arması bulunan her ürün, `designId` alanı ile desen arşivine (`DESIGNS`) bağlanacak; e-katalogda bir desene tıklandığında o desene ait tüm ürünler bağımsız bir modal slider ile listelenecektir.

## Sonuçlar (Consequences)
- Vitrin sade, kurumsal ve lüks marka kimliğine uygun hale gelir.
- Tüm görsel açıları veri katmanında hazır olduğu için iç galeri UI'ı geliştirildiğinde hiçbir veri kaybı olmadan doğrudan devreye alınabilecektir.
- B2B teklif sepetinde her ürün net ve tek bir kalem olarak işlem görür.
