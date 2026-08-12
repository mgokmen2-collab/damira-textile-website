/* DAMIRA TEXTILE — uygulama katmanı
 * i18n toggle, katalog render/filtre/arama, modal, teklif sepeti, state'ler.
 */
(function () {
  'use strict';

  const { COLLECTIONS, PRODUCTS, I18N } = window.DAMIRA;

  const state = {
    lang: localStorage.getItem('damira-lang') || 'tr',
    activeColl: null,          // koleksiyon filtresi (null = tümü)
    search: '',
    sort: 'name',              // name | coll | type
    quote: [],                 // seçili desen id'leri
    visibleCount: 8,           // "daha fazla" sayfalama
    currentProduct: null,      // modalda açık ürün
    lastTrigger: null          // modalı açan öğe (focus dönüşü için)
  };

  const els = {};
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  /* ---------- Yardımcılar ---------- */
  const t = (key) => (I18N[state.lang] && I18N[state.lang][key]) || I18N.tr[key] || key;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const collName = (id) => COLLECTIONS.find((c) => c.id === id)[state.lang];
  const productById = (id) => PRODUCTS.find((p) => p.id === id);
  const matchesFilter = (p) => {
    const inColl = !state.activeColl || p.coll === state.activeColl;
    if (!inColl) return false;
    const q = state.search.trim().toLowerCase();
    if (!q) return true;
    return [p[state.lang].n, p[state.lang].t, collName(p.coll)]
      .join(' ').toLowerCase().includes(q);
  };
  const filteredProducts = () => {
    const list = PRODUCTS.filter(matchesFilter);
    const sortKey = { name: 'n', coll: 'coll', type: 't' }[state.sort] || 'n';
    const sorted = list.slice().sort((a, b) => {
      let va = a[state.lang][sortKey] || collName(a.coll) || '';
      let vb = b[state.lang][sortKey] || collName(b.coll) || '';
      if (sortKey === 'coll') { va = collName(a.coll); vb = collName(b.coll); }
      return va.localeCompare(vb, state.lang);
    });
    return sorted;
  };

  /* ---------- i18n uygula ---------- */
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
      ? 'DAMIRA TEXTILE — Nice, Fransa | Toptan Turistik Tekstil'
      : state.lang === 'fr'
        ? 'DAMIRA TEXTILE — Nice, France | Textiles Touristiques en Gros'
        : 'DAMIRA TEXTILE — Nice, France | Wholesale Tourist Textiles';
    $$('.lang-btn').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.lang === state.lang));
    });
    renderCollections();
    renderChips();
    renderProducts();
    renderQuote();
  }

  /* ---------- Koleksiyonlar ---------- */
  function renderCollections() {
    const grid = els.collectionGrid;
    grid.innerHTML = COLLECTIONS.map((c) => {
      const count = PRODUCTS.filter((p) => p.coll === c.id).length;
      return `
        <article class="collection-card reveal">
          <a href="#catalog" data-coll="${c.id}" aria-label="${esc(c[state.lang])} — ${count} ${t('modal.unit')}">
            <figure>
              <img src="${c.img}" alt="${esc(c[state.lang])} koleksiyonu, keten üzerine nakış" loading="lazy">
              <figcaption>${esc(c[state.lang])}<span class="collection-count">${count} ${t('modal.unit')}</span></figcaption>
            </figure>
          </a>
        </article>`;
    }).join('');
    grid.querySelectorAll('[data-coll]').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        state.activeColl = a.dataset.coll;
        syncChips();
        renderProducts();
        document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
      });
    });
    observeReveals();
  }

  /* ---------- Filtre çipleri ---------- */
  function renderChips() {
    const wrap = els.filterChips;
    const all = `<button class="chip" data-coll="" aria-pressed="${state.activeColl === null}">${t('catalog.all')}</button>`;
    const chips = COLLECTIONS.map((c) =>
      `<button class="chip" data-coll="${c.id}" aria-pressed="${state.activeColl === c.id}">${esc(c[state.lang])}</button>`
    ).join('');
    wrap.innerHTML = all + chips;
    wrap.querySelectorAll('.chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        state.activeColl = chip.dataset.coll || null;
        syncChips();
        renderProducts();
      });
    });
  }
  function syncChips() {
    els.filterChips.querySelectorAll('.chip').forEach((chip) => {
      chip.setAttribute('aria-pressed', String(chip.dataset.coll === (state.activeColl || '')));
    });
  }

  /* ---------- Ürün grid'i ---------- */
  function renderProducts() {
    const list = filteredProducts();
    const isEmpty = list.length === 0;
    const isFiltered = state.activeColl !== null || state.search.trim() !== '';
    els.catalogEmpty.hidden = !isEmpty;
    els.loadMoreBtn.hidden = list.length <= state.visibleCount;
    els.loadMoreBtn.disabled = false;
    els.resetBtn.hidden = !isFiltered;

    // Sonuç sayacı
    els.catalogCount.textContent = `${list.length} ${t('catalog.count')}`;
    els.catalogCount.hidden = false;

    const shown = list.slice(0, state.visibleCount);
    els.productGrid.innerHTML = shown.map(productCard).join('');

    // Görsel yüklenince shimmer kapat, opacity ile göster
    els.productGrid.querySelectorAll('figure img').forEach((img) => {
      if (img.complete && img.naturalWidth > 0) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
      }
    });

    els.productGrid.querySelectorAll('[data-open]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        state.lastTrigger = e.currentTarget;
        openModal(btn.dataset.open);
      });
    });

    const remaining = list.length - state.visibleCount;
    if (remaining > 0) {
      els.loadMoreBtn.textContent = `${t('catalog.more')} (${remaining})`;
    } else {
      els.loadMoreBtn.textContent = t('catalog.more');
    }
    observeReveals();
  }
  function resetFilters() {
    state.activeColl = null;
    state.search = '';
    state.visibleCount = 8;
    els.searchInput.value = '';
    syncChips();
    renderProducts();
  }
  function productCard(p) {
    const label = `${p[state.lang].n} — ${collName(p.coll)}`;
    return `
      <li class="product-card reveal revealed">
        <button type="button" data-open="${p.id}" aria-label="${esc(label)}: ${esc(p[state.lang].t)}">
          <figure>
            <img src="${p.img}" alt="${esc(label)}" loading="lazy">
            <figcaption>
              <span>${esc(p[state.lang].t)}</span>
              <p>${esc(p[state.lang].n)}</p>
            </figcaption>
          </figure>
        </button>
        <div class="product-info">
          <p class="product-name">${esc(p[state.lang].n)}</p>
          <p class="product-coll">${esc(collName(p.coll))}</p>
        </div>
      </li>`;
  }

  /* ---------- Modal ---------- */
  function openModal(id) {
    const p = productById(id);
    if (!p) return;
    state.currentProduct = id;
    els.modal.hidden = false;
    document.body.style.overflow = 'hidden';
    els.modalImg.src = p.img;
    els.modalImg.alt = `${p[state.lang].n} — ${collName(p.coll)}`;
    els.modalCollection.textContent = collName(p.coll).toUpperCase();
    els.modalTitle.textContent = p[state.lang].n;
    els.modalDesc.textContent = p[state.lang].d;
    els.modalSpecs.innerHTML = `
      <dt>${t('modal.specs')}</dt><dd>${t('modal.specsV')}</dd>
      <dt>${t('modal.unit')}</dt><dd>${esc(p[state.lang].t)}</dd>`;
    els.modalPdfLink.href = 'catalogs/damira-catalog-2026.pdf';
    els.modalQuoteBtn.textContent = state.quote.includes(id)
      ? '✓ ' + t('modal.inQuote') : t('modal.addQuote');
    // Focus modal içine al
    els.modalClose.focus();
  }
  function closeModal() {
    els.modal.hidden = true;
    document.body.style.overflow = '';
    state.currentProduct = null;
    // Focus tetikleyiciye dön
    if (state.lastTrigger && document.contains(state.lastTrigger)) {
      state.lastTrigger.focus();
    }
    state.lastTrigger = null;
  }
  function trapModalFocus(e) {
    if (els.modal.hidden) return;
    if (e.key !== 'Tab') return;
    const focusables = els.modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  /* ---------- Teklif sepeti ---------- */
  function renderQuote() {
    const items = state.quote.map((id) => {
      const p = productById(id);
      return `<span class="quote-tag">${esc(p[state.lang].n)}<button type="button" data-remove="${id}" aria-label="${t('modal.remove')} ${esc(p[state.lang].n)}">×</button></span>`;
    }).join('');
    els.quoteItems.innerHTML = items;
    els.quoteEmpty.hidden = state.quote.length > 0;
    els.quoteItems.querySelectorAll('[data-remove]').forEach((b) => {
      b.addEventListener('click', () => {
        state.quote = state.quote.filter((x) => x !== b.dataset.remove);
        renderQuote();
      });
    });
    if (state.currentProduct && els.modalQuoteBtn) {
      els.modalQuoteBtn.textContent = state.quote.includes(state.currentProduct)
        ? '✓ ' + t('modal.inQuote') : t('modal.addQuote');
    }
  }
  function toggleQuote(id) {
    state.quote = state.quote.includes(id)
      ? state.quote.filter((x) => x !== id)
      : state.quote.concat(id);
    renderQuote();
  }

  /* ---------- Form ---------- */
  function setFieldError(input, on) {
    input.setAttribute('aria-invalid', String(on));
    const errId = 'err-' + input.id;
    if (on) {
      if (!document.getElementById(errId)) {
        const err = document.createElement('p');
        err.id = errId;
        err.className = 'field-error';
        err.setAttribute('role', 'alert');
        input.parentElement.appendChild(err);
      }
      document.getElementById(errId).textContent = t('form.error');
    } else {
      const err = document.getElementById(errId);
      if (err) err.remove();
    }
  }
  function bindForm() {
    els.quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = els.fName.value.trim();
      const email = els.fEmail.value.trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      setFieldError(els.fName, !name);
      setFieldError(els.fEmail, !emailOk);
      els.formError.hidden = !(!name || !emailOk);
      if (!name) { els.fName.focus(); return; }
      if (!emailOk) { els.fEmail.focus(); return; }
      els.formSubmit.disabled = true;
      els.formSubmit.classList.add('is-loading');
      els.formSubmit.textContent = t('form.sending');
      setTimeout(() => {
        els.formSubmit.disabled = false;
        els.formSubmit.classList.remove('is-loading');
        els.formSubmit.textContent = t('form.submit');
        els.formSuccess.hidden = false;
        els.quoteForm.reset();
        state.quote = [];
        renderQuote();
        setTimeout(() => { els.formSuccess.hidden = true; }, 8000);
      }, 900);
    });
    // Hata durumunu yazmaya başlayınca temizle
    [els.fName, els.fEmail].forEach((input) => {
      input.addEventListener('input', () => setFieldError(input, false));
    });
  }

  /* ---------- Scroll reveal ---------- */
  let revealObserver;
  function observeReveals() {
    if (!('IntersectionObserver' in window)) {
      $$('.reveal').forEach((el) => el.classList.add('revealed'));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add('revealed'); revealObserver.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
    }
    $$('.reveal:not(.revealed)').forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Mobile nav ---------- */
  function bindNav() {
    els.navToggle.addEventListener('click', () => {
      const open = els.navToggle.getAttribute('aria-expanded') === 'true';
      els.navToggle.setAttribute('aria-expanded', String(!open));
      els.mobileNav.hidden = open;
      document.body.style.overflow = open ? '' : 'hidden';
    });
    els.mobileNav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        els.navToggle.setAttribute('aria-expanded', 'false');
        els.mobileNav.hidden = true;
        document.body.style.overflow = '';
      });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && els.navToggle.getAttribute('aria-expanded') === 'true') {
        els.navToggle.setAttribute('aria-expanded', 'false');
        els.mobileNav.hidden = true;
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    Object.assign(els, {
      collectionGrid: $('#collectionGrid'),
      filterChips: $('#filterChips'),
      searchInput: $('#searchInput'),
      sortSelect: $('#sortSelect'),
      catalogCount: $('#catalogCount'),
      resetBtn: $('#resetBtn'),
      emptyResetBtn: $('#emptyResetBtn'),
      productGrid: $('#productGrid'),
      catalogEmpty: $('#catalogEmpty'),
      loadMoreBtn: $('#loadMoreBtn'),
      quoteItems: $('#quoteItems'),
      quoteEmpty: $('#quoteEmpty'),
      quoteForm: $('#quoteForm'),
      formError: $('#formError'),
      formSuccess: $('#formSuccess'),
      formSubmit: $('#quoteForm .btn[type="submit"]'),
      fName: $('#fName'), fEmail: $('#fEmail'),
      modal: $('#productModal'),
      modalClose: $('.modal-close'),
      modalImg: $('#modalImg'),
      modalCollection: $('#modalCollection'),
      modalTitle: $('#modalTitle'),
      modalDesc: $('#modalDesc'),
      modalSpecs: $('#modalSpecs'),
      modalPdfLink: $('#modalPdfLink'),
      modalQuoteBtn: $('#modalQuoteBtn'),
      navToggle: $('.nav-toggle'),
      mobileNav: $('#mobileNav')
    });

    // Dil
    $$('.lang-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.lang = btn.dataset.lang;
        localStorage.setItem('damira-lang', state.lang);
        applyI18n();
      });
    });

    // Arama
    els.searchInput.addEventListener('input', () => {
      state.search = els.searchInput.value;
      state.visibleCount = 8;
      renderProducts();
    });

    // Sıralama
    els.sortSelect.addEventListener('change', () => {
      state.sort = els.sortSelect.value;
      renderProducts();
    });

    // Filtre temizleme
    els.resetBtn.addEventListener('click', resetFilters);
    els.emptyResetBtn.addEventListener('click', resetFilters);

    // Daha fazla
    els.loadMoreBtn.addEventListener('click', () => {
      state.visibleCount += 8;
      renderProducts();
    });

    // Modal
    els.modalQuoteBtn.addEventListener('click', () => {
      if (state.currentProduct) toggleQuote(state.currentProduct);
    });
    $$('[data-close-modal]').forEach((el) => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !els.modal.hidden) closeModal();
      trapModalFocus(e);
    });

    bindForm();
    bindNav();
    applyI18n();
    observeReveals();
  });
})();
