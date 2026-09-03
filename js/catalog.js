/* COQ D'OR — MAISON DE LINGE (E-Katalog Katmanı)
 * Ürün grupları (büyük görsel + model thumb'ları → tıklayınca ana görsel değişir)
 * 25 Bölgesel Desen & Çok Dilli (TR / EN / FR) — dil sırası FR → EN → TR
 */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  const { CATEGORIES, DESIGNS, I18N } = window.DAMIRA;

  const state = {
    lang: localStorage.getItem('damira-lang') || 'tr'
  };

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  const t = (key) => (I18N[state.lang] && I18N[state.lang][key]) || (I18N.tr && I18N.tr[key]) || key;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const CAT_LABELS = {
    riviera: 'cat.riviera', provence: 'cat.provence', atlantik: 'cat.atlantik',
    kuzey: 'cat.kuzey', adalar: 'cat.adalar', guney: 'cat.guney'
  };
  const catLabel = (code) => (code && CAT_LABELS[code] ? t(CAT_LABELS[code]) : '');

  /* ---------- Ürün grupları: büyük görsel + model thumb'ları ---------- */
  function renderCategories() {
    const list = $('#ecatCollectionList');
    if (!list) return;

    list.innerHTML = CATEGORIES.map((c) => {
      const models = c.models || [];
      const first = models[0] || {};
      return `
        <article class="ecat-collection" id="${c.id}" data-group="${c.id}">
          <div class="ecat-collection-fig">
            <img src="${c.img}" alt="${esc(c[state.lang])}" class="ecat-main-img" data-main="${c.id}">
          </div>
          <div class="ecat-collection-body">
            <p class="eyebrow">${models.length} ${t('modal.unit')}</p>
            <h2 class="ecat-collection-title">${esc(c[state.lang])}</h2>
            <p class="ecat-collection-desc">${esc(c.d[state.lang])}</p>
            ${models.length > 0 ? `
              <div class="ecat-models-grid" data-thumbs="${c.id}">
                ${models.map((m) => {
                  // Ana görsel hangi modelin fotoğrafıysa o thumb başlangıçta aktif
                  const isActive = m.img === c.img;
                  return `
                    <button type="button" class="ecat-model${isActive ? ' active' : ''}" data-thumb="${c.id}:${m.id}" data-src="${m.img}" aria-label="${esc(m.n[state.lang])}">
                      <img src="${m.img}" alt="${esc(m.n[state.lang])}" loading="lazy">
                      <p>${esc(m.n[state.lang])}</p>
                    </button>`;
                }).join('')}
              </div>
            ` : ''}
            <div class="ecat-collection-actions">
              <a class="btn btn-primary btn-sm" href="index.html#${c.id}" data-i18n="panel.view">İncele &amp; Teklife Ekle</a>
              <a class="btn btn-ghost btn-sm" href="index.html#contact" data-i18n="ecat.quoteModel">Fiyat Teklifi İste</a>
            </div>
          </div>
        </article>`;
    }).join('');

    // Thumb'a tıklayınca ana büyük görsel değişir
    $$('.ecat-model[data-thumb]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const [gid] = btn.dataset.thumb.split(':');
        const main = document.querySelector(`.ecat-main-img[data-main="${gid}"]`);
        if (!main) return;
        main.src = btn.dataset.src;
        main.alt = btn.querySelector('p').textContent;
        // Aktif thumb vurgusu
        const wrap = document.querySelector(`[data-thumbs="${gid}"]`);
        if (wrap) {
          wrap.querySelectorAll('.ecat-model').forEach((x) => x.classList.remove('active'));
          btn.classList.add('active');
        }
      });
    });
  }

  /* ---------- 25 şehir deseni (bölgesel gruplu) ---------- */
  const CAT_ORDER = ['riviera', 'provence', 'atlantik', 'kuzey', 'adalar', 'guney'];

  function renderDesigns() {
    const list = $('#ecatDesignList');
    if (!list) return;

    const groups = CAT_ORDER.map((cat) => ({
      cat,
      items: DESIGNS.filter((d) => d.cat === cat)
    })).filter((g) => g.items.length);

    list.innerHTML = groups.map((g) => `
      <div class="ecat-design-group">
        <h3 class="ecat-design-group-title">${esc(catLabel(g.cat))}</h3>
        <div class="ecat-design-grid">
          ${g.items.map(designCard).join('')}
        </div>
      </div>
    `).join('');
  }

  function designCard(d) {
    const label = `${d[state.lang].n} — COQ D’OR`;
    const gal = (d.gallery || []).slice(0, 3);
    const thumbs = gal.length
      ? `<div class="ecat-design-thumbs">${gal.map((src) => `<img src="${src}" alt="" loading="lazy">`).join('')}</div>`
      : '';
    return `
      <article class="ecat-design" id="${d.id}">
        <figure class="ecat-design-fig">
          <img src="${d.img}" alt="${esc(label)}" loading="lazy">
          <figcaption>
            <span>${esc(d[state.lang].t)}</span>
            <p>${esc(d[state.lang].n)}</p>
          </figcaption>
        </figure>
        ${thumbs}
        <div class="ecat-design-body">
          <h4 class="ecat-design-title">${esc(d[state.lang].n)}</h4>
          <p class="ecat-design-desc">${esc(d[state.lang].d)}</p>
          <dl class="ecat-design-specs">
            <dt>${t('modal.specs')}</dt><dd>${t('modal.specsV')}</dd>
            <dt>${t('ecat.coll')}</dt><dd>${esc(d[state.lang].t)}</dd>
          </dl>
          <a class="btn btn-outline btn-sm btn-block" href="index.html#${d.id}" data-i18n="designs.detail">İncele</a>
        </div>
      </article>`;
  }

  /* ---------- Dil ---------- */
  function applyI18n() {
    document.documentElement.lang = state.lang;
    $$('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      if (el.tagName === 'INPUT') el.placeholder = val; else el.textContent = val;
    });
    $$('[data-i18n-ph]').forEach((el) => {
      el.placeholder = t(el.getAttribute('data-i18n-ph'));
    });
    document.title = state.lang === 'tr'
      ? 'E-Katalog — COQ D’OR | Maison de Linge · Koleksiyonlar & Desenler'
      : state.lang === 'fr'
        ? 'E-Catalogue — COQ D’OR | Maison de Linge · Gammes & Dessins'
        : 'E-Catalog — COQ D’OR | Maison de Linge · Collections & Designs';

    $$('.lang-btn').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.lang === state.lang));
    });

    renderCategories();
    renderDesigns();
    checkUrlHash();
  }

  /* ---------- URL Hash odaklama ---------- */
  function checkUrlHash() {
    const hash = window.location.hash.replace('#', '').trim().toLowerCase();
    if (!hash) return;

    const el = document.getElementById(hash);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.style.outline = '2px solid var(--gold-deep)';
        setTimeout(() => { el.style.outline = ''; }, 3000);
      }, 200);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    $$('.lang-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.lang = btn.dataset.lang;
        localStorage.setItem('damira-lang', state.lang);
        applyI18n();
      });
    });

    if (window.DAMIRA && window.DAMIRA.bindNav) window.DAMIRA.bindNav();
    window.addEventListener('hashchange', checkUrlHash);

    applyI18n();
  });
})();
