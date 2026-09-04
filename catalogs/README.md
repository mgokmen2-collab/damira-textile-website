# COQ D'OR — Maison de Linge · Katalog indirmeleri

PDF kataloglar bu klasöre eklenir. (Site şu anda interaktif e-katalog `catalog.html` kullanır; bu klasör yalnızca ileride eklenecek PDF indirmeleri için yer tutucudur.)

- `coqdor-catalog-2026.pdf` — ana katalog (sitedeki katalog bağlantıları bu dosyayı bekler)

## Nasıl eklenir

1. PDF'i bu klasöre `coqdor-catalog-2026.pdf` adıyla koyun.
2. Ek koleksiyon katalogları için adlandırma: `coqdor-<collection>-<yil>.pdf` (örn. `coqdor-monaco-2026.pdf`).
3. Bağlantıyı değiştirmek için: `js/data.js` içindeki `modal.pdf` anahtarının karşılığına `catalogs/<dosya-adı>.pdf` yazın.
