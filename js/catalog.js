/* COQ D'OR — MAISON DE LINGE (E-Katalog Katmanı)
 * 6 Temel Ürün Grubu ve 25 Bölgesel Fransız Sahil Deseni Render
 * Akıllı URL Hash Desteği (#bornoz, #monaco) & Çok Dilli (TR / EN / FR)
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

  /* ---------- 6 Ürün Grubunu Render Et ---------- */
  function renderCategories() {
    const list = $('#ecatCollectionList');
    if (!list) return;

    list.innerHTML = CATEGORIES.map((c) => {
      const models = c.models || [];
      const badge = c.badge ? c.badge[state.lang] : '';
      return `
        <article class="ecat-collection" id="${c.id}" style="margin-bottom: 50px; border-bottom: 1px solid var(--line); padding-bottom: 40px;">
          <div class="ecat-collection-fig" style="position: relative;">
            ${badge ? `<span class="badge badge-new" style="position:absolute; top:16px; left:16px; z-index:2;">${esc(badge)}</span>` : ''}
            <img src="${c.img}" alt="${esc(c[state.lang])}" loading="lazy" style="aspect-ratio: 4/3; width:100%; object-fit:cover; border-radius:8px;">
          </div>
          <div class="ecat-collection-body">
            <p class="eyebrow">${models.length} ${t('modal.unit')}</p>
            <h2 class="ecat-collection-title">${esc(c[state.lang])}</h2>
            <p class="ecat-collection-desc" style="font-size:1.05rem; line-height:1.6; color:var(--ink-soft); margin-bottom:20px;">
              ${esc(c.d[state.lang])}
            </p>
            
            ${models.length > 0 ? `
              <div class="ecat-models-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap:12px; margin-bottom:24px;">
                ${models.map((m) => `
                  <div style="background:var(--bg-soft); border-radius:6px; overflow:hidden; border:1px solid var(--line);">
                    <img src="${m.img}" alt="${esc(m.n[state.lang])}" loading="lazy" style="width:100%; aspect-ratio:1/1; object-fit:cover; display:block;">
                    <p style="font-size:0.75rem; padding:6px; text-align:center; font-weight:500; color:var(--ink);">${esc(m.n[state.lang])}</p>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <a class="btn btn-primary btn-sm" href="index.html#contact" data-i18n="ecat.quoteDesign">Fiyat Teklifi İste</a>
          </div>
        </article>`;
    }).join('');
  }

  /* ---------- 25 Şehir Desenini Render Et ---------- */
  function renderDesigns() {
    const list = $('#ecatDesignList');
    if (!list) return;

    list.innerHTML = `
      <div class="ecat-design-group">
        <h3 class="ecat-design-group-title" style="font-family:var(--font-serif); font-size:2.2rem; margin-bottom:24px;">
          ${t('catalog.title')}
        </h3>
        <div class="ecat-design-grid">
          ${DESIGNS.map(designCard).join('')}
        </div>
      </div>`;
  }

  function designCard(d) {
    const label = `${d[state.lang].n} — COQ D’OR`;
    return `
      <article class="ecat-design" id="${d.id}" style="border:1px solid var(--line); border-radius:8px; overflow:hidden; background:var(--bg-card);">
        <figure class="ecat-design-fig" style="aspect-ratio:1/1; overflow:hidden; background:var(--bg-soft);">
          <img src="${d.img}" alt="${esc(label)}" loading="lazy" style="width:100%; height:100%; object-fit:cover;">
          <figcaption>
            <span>${esc(d[state.lang].t)}</span>
            <p>${esc(d[state.lang].n)}</p>
          </figcaption>
        </figure>
        <div class="ecat-design-body" style="padding:16px;">
          <h4 style="font-family:var(--font-serif); font-size:1.3rem; margin-bottom:6px;">${esc(d[state.lang].n)}</h4>
          <p class="ecat-design-desc" style="font-size:0.88rem; color:var(--ink-soft); margin-bottom:12px;">${esc(d[state.lang].d)}</p>
          <dl class="ecat-design-specs" style="font-size:0.8rem; margin-bottom:16px;">
            <dt>${t('modal.specs')}</dt><dd>${t('modal.specsV')}</dd>
            <dt>${t('ecat.coll')}</dt><dd>${esc(d[state.lang].t)}</dd>
          </dl>
          <a class="btn btn-outline btn-sm btn-block" href="index.html#${d.id}" data-i18n="ecat.quoteDesign">Sipariş &amp; Teklif</a>
        </div>
      </article>`;
  }

  /* ---------- URL Hash Odaklama ---------- */
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
