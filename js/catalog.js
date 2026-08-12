/* DAMIRA TEXTILE — e-katalog renderer (catalog.html)
 * Koleksiyonları ve desenleri zengin düzenle listeler; i18n destekli.
 */
(function () {
  'use strict';

  const { COLLECTIONS, PRODUCTS, I18N } = window.DAMIRA;

  const state = {
    lang: localStorage.getItem('damira-lang') || 'tr'
  };

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  const t = (key) => (I18N[state.lang] && I18N[state.lang][key]) || I18N.tr[key] || key;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const collById = (id) => COLLECTIONS.find((c) => c.id === id);
  const collName = (c) => c[state.lang];
  const collDesc = (c) => (c.d && c.d[state.lang]) || '';
  const productsOf = (id) => PRODUCTS.filter((p) => p.coll === id);

  function renderCollections() {
    const list = $('#ecatCollectionList');
    list.innerHTML = COLLECTIONS.map((c) => {
      const count = productsOf(c.id).length;
      const ratio = c.ratio || 1;
      return `
        <article class="ecat-collection" id="coll-${c.id}">
          <div class="ecat-collection-fig">
            <img src="${c.img}" alt="${esc(collName(c))} koleksiyonu" loading="lazy" style="aspect-ratio: ${ratio}">
          </div>
          <div class="ecat-collection-body">
            <p class="eyebrow">${count} ${t('ecat.designs')}</p>
            <h2 class="ecat-collection-title">${esc(collName(c))}</h2>
            <p class="ecat-collection-desc">${esc(collDesc(c))}</p>
            <a class="text-link" href="#coll-${c.id}-designs" data-i18n="ecat.viewDesigns">Desenleri Gör →</a>
          </div>
        </article>`;
    }).join('');
  }

  function renderDesigns() {
    const list = $('#ecatDesignList');
    list.innerHTML = COLLECTIONS.map((c) => {
      const items = productsOf(c.id);
      return `
        <div class="ecat-design-group" id="coll-${c.id}-designs">
          <h3 class="ecat-design-group-title">${esc(collName(c))}</h3>
          <div class="ecat-design-grid">
            ${items.map(designCard).join('')}
          </div>
        </div>`;
    }).join('');
  }

  function designCard(p) {
    const c = collById(p.coll);
    const ratio = p.ratio || 1;
    const label = `${p[state.lang].n} — ${collName(c)}`;
    return `
      <article class="ecat-design">
        <figure class="ecat-design-fig">
          <img src="${p.img}" alt="${esc(label)}" loading="lazy" style="aspect-ratio: ${ratio}">
          <figcaption>
            <span>${esc(p[state.lang].t)}</span>
            <p>${esc(p[state.lang].n)}</p>
          </figcaption>
        </figure>
        <div class="ecat-design-body">
          <p class="ecat-design-desc">${esc(p[state.lang].d)}</p>
          <dl class="ecat-design-specs">
            <dt>${t('modal.specs')}</dt><dd>${t('modal.specsV')}</dd>
            <dt>${t('ecat.coll')}</dt><dd>${esc(collName(c))}</dd>
            <dt>${t('modal.unit')}</dt><dd>${esc(p[state.lang].t)}</dd>
          </dl>
          <a class="btn btn-outline btn-sm" href="index.html#contact" data-i18n="ecat.quoteDesign">Teklif İste</a>
        </div>
      </article>`;
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
      ? 'E-Katalog — DAMIRA TEXTILE | Tüm Koleksiyonlar ve Desenler'
      : state.lang === 'fr'
        ? 'E-Catalogue — DAMIRA TEXTILE | Toutes les collections et motifs'
        : 'E-Catalog — DAMIRA TEXTILE | All Collections & Designs';
    $$('.lang-btn').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.lang === state.lang));
    });
    renderCollections();
    renderDesigns();
  }

  document.addEventListener('DOMContentLoaded', () => {
    $$('.lang-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.lang = btn.dataset.lang;
        localStorage.setItem('damira-lang', state.lang);
        applyI18n();
      });
    });

    // Mobil menü (app.js'teki bindNav'ı burada da çalıştır)
    const navToggle = $('.nav-toggle');
    const mobileNav = $('#mobileNav');
    if (navToggle && mobileNav) {
      navToggle.addEventListener('click', () => {
        const open = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!open));
        mobileNav.hidden = open;
        document.body.style.overflow = open ? '' : 'hidden';
      });
      mobileNav.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => {
          navToggle.setAttribute('aria-expanded', 'false');
          mobileNav.hidden = true;
          document.body.style.overflow = '';
        });
      });
    }

    applyI18n();
  });
})();
