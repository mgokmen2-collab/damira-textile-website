/* COQ D'OR — MAISON DE LINGE (Uygulama Katmanı)
 * i18n, 6 Kategori ve 25 Şehir Deseni Filtreleme, Akıllı URL Hash (#bornoz, #monaco)
 * Çapraz Ürün Kombini & B2B Teklif Sepeti
 */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  const { CATEGORIES, DESIGNS, I18N } = window.DAMIRA;

  const state = {
    lang: localStorage.getItem('damira-lang') || 'tr',
    activeCategory: null,      // Seçili ürün grubu filtresi
    selectedProductType: 'havlu', // Modalda seçili ürün tipi varyasyonu
    quote: [],                 // Teklife eklenen öğeler: { id, name, productType }
    visibleCount: 8,           // Sayfalama (25 desen için ilk başta 8)
    currentDesign: null,       // Modalda açık desen
    lastTrigger: null
  };

  const els = {};
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  /* ---------- Yardımcılar ---------- */
  const t = (key) => (I18N[state.lang] && I18N[state.lang][key]) || (I18N.tr && I18N.tr[key]) || key;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const catById = (id) => CATEGORIES.find((c) => c.id === id);
  const designById = (id) => DESIGNS.find((d) => d.id === id);

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
      ? 'COQ D’OR — Maison de Linge | Nice, Fransa · Toptan Lüks Tekstil'
      : state.lang === 'fr'
        ? 'COQ D’OR — Maison de Linge | Nice, France · Linge d’Hôtellerie en Gros'
        : 'COQ D’OR — Maison de Linge | Nice, France · Wholesale Luxury Linens';

    $$('.lang-btn').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.lang === state.lang));
    });

    renderCollections();
    renderChips();
    renderDesigns();
    renderQuote();
  }

  /* ---------- 6 Ürün Grubu (Kategoriler) ---------- */
  function renderCollections() {
    const grid = els.collectionGrid;
    if (!grid) return;

    grid.innerHTML = CATEGORIES.map((c) => {
      const modelCount = c.models ? c.models.length : 4;
      // 3/4 kutuya tam sığan görseller (ratio ≈ 0.75) zoom in alır,
      // diğerleri contain katmanıyla hover'da tam görünür
      const ratio = c.ratio || 1;
      const fit = ratio >= 0.70 && ratio <= 0.80 ? 'fit' : 'crop';
      return `
        <article class="collection-card reveal">
          <a href="#catalog" data-cat="${c.id}" aria-label="${esc(c[state.lang])} — ${modelCount} ${t('modal.unit')}">
            <figure>
              <img class="cc-cover" src="${c.img}" alt="${esc(c[state.lang])} koleksiyonu" loading="lazy" data-fit="${fit}">
              ${fit === 'crop' ? `<img class="cc-contain" src="${c.img}" alt="" aria-hidden="true" loading="lazy">` : ''}
              <figcaption>
                ${esc(c[state.lang])}
                <span class="collection-count">${modelCount} ${t('modal.unit')}</span>
              </figcaption>
            </figure>
          </a>
        </article>`;
    }).join('');

    grid.querySelectorAll('[data-cat]').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const catId = a.dataset.cat;
        selectCategory(catId);
      });
    });

    observeReveals();
  }

  function selectCategory(catId) {
    state.activeCategory = catId;
    syncChips();
    renderDesigns();
    const catalog = document.getElementById('catalog');
    if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, null, `#${catId}`);
  }

  /* ---------- Filtre Çipleri ---------- */
  function renderChips() {
    const wrap = els.filterChips;
    if (!wrap) return;

    const all = `<button class="chip" data-cat="" aria-pressed="${state.activeCategory === null}">${t('catalog.all')}</button>`;
    const chips = CATEGORIES.map((c) =>
      `<button class="chip" data-cat="${c.id}" aria-pressed="${state.activeCategory === c.id}">${esc(c[state.lang])}</button>`
    ).join('');
    wrap.innerHTML = all + chips;

    wrap.querySelectorAll('.chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        state.activeCategory = chip.dataset.cat || null;
        syncChips();
        renderDesigns();
        if (state.activeCategory) {
          history.replaceState(null, null, `#${state.activeCategory}`);
        } else {
          history.replaceState(null, null, ' ');
        }
      });
    });
  }

  function syncChips() {
    if (!els.filterChips) return;
    els.filterChips.querySelectorAll('.chip').forEach((chip) => {
      chip.setAttribute('aria-pressed', String(chip.dataset.cat === (state.activeCategory || '')));
    });
  }

  /* ---------- Desenler Grid'i (25 Şehir) ---------- */
  function renderDesigns() {
    if (!els.productGrid) return;

    const list = DESIGNS;
    const isFiltered = state.activeCategory !== null;
    els.resetBtn.hidden = !isFiltered;

    els.catalogCount.textContent = `${list.length} ${t('catalog.count')}`;
    els.catalogCount.hidden = false;

    const shown = list.slice(0, state.visibleCount);
    els.productGrid.innerHTML = shown.map(designCard).join('');

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
      els.loadMoreBtn.hidden = false;
      els.loadMoreBtn.textContent = `${t('catalog.more')} (${remaining})`;
    } else {
      els.loadMoreBtn.hidden = true;
    }

    observeReveals();
  }

  function resetFilters() {
    state.activeCategory = null;
    state.visibleCount = 8;
    syncChips();
    renderDesigns();
    history.replaceState(null, null, ' ');
  }

  function designCard(d) {
    const label = `${d[state.lang].n} — COQ D’OR`;
    // Kare kutuya tam sığan desenler (native oran ≈ 1) zoom in alır, diğerleri contain katmanıyla tam görünür
    const ratio = d.ratio || 1;
    const fit = ratio >= 0.85 && ratio <= 1.18 ? 'fit' : 'crop';
    return `
      <li class="product-card reveal revealed">
        <button type="button" data-open="${d.id}" aria-label="${esc(label)}">
          <figure>
            <img class="pc-cover" src="${d.img}" alt="${esc(label)}" loading="lazy" data-fit="${fit}">
            ${fit === 'crop' ? `<img class="pc-contain" src="${d.img}" alt="" aria-hidden="true" loading="lazy">` : ''}
            <figcaption>
              <span>${esc(d[state.lang].t)}</span>
              <p>${esc(d[state.lang].n)}</p>
            </figcaption>
          </figure>
        </button>
        <div class="product-info">
          <p class="product-name">${esc(d[state.lang].n)}</p>
          <p class="product-coll">${esc(d[state.lang].t)}</p>
        </div>
      </li>`;
  }

  /* ---------- Modal & Çapraz Ürün Kombini ---------- */
  function openModal(id) {
    const d = designById(id);
    if (!d) return;
    state.currentDesign = id;
    els.modal.hidden = false;
    document.body.style.overflow = 'hidden';

    els.modalImg.src = d.img;
    els.modalImg.alt = `${d[state.lang].n} — COQ D’OR`;
    els.modalCollection.textContent = 'COQ D’OR — MAISON DE LINGE';
    els.modalTitle.textContent = d[state.lang].n;
    els.modalDesc.textContent = d[state.lang].d;

    // Ürün kombin seçenekleri
    const productOptions = [
      { id: 'havlu', label: state.lang === 'fr' ? 'Serviette de Bain' : state.lang === 'en' ? 'Bath Towel' : 'Lüks Banyo Havlusu' },
      { id: 'bornoz', label: state.lang === 'fr' ? 'Peignoir Éponge' : state.lang === 'en' ? 'Plush Bathrobe' : 'Lüks Bornoz' },
      { id: 'pike', label: state.lang === 'fr' ? 'Piqué Gaufré' : state.lang === 'en' ? 'Waffle Piqué' : 'Balpeteği Pike' },
      { id: 'pestemal', label: state.lang === 'fr' ? 'Fouta Jacquard' : state.lang === 'en' ? 'Jacquard Fouta' : 'Jakar Peştemal' },
      { id: 'canta', label: state.lang === 'fr' ? 'Sac à Vin Toile' : state.lang === 'en' ? 'Canvas Wine Bag' : 'Kanvas Şarap Çantası' }
    ];

    const optionsHtml = `
      <div class="modal-combo-select">
        <span class="combo-label">${t('modal.chooseProduct')}</span>
        <div class="combo-chips">
          ${productOptions.map((opt) => `
            <button type="button" class="chip combo-chip ${state.selectedProductType === opt.id ? 'active' : ''}" data-type="${opt.id}">
              ${opt.label}
            </button>
          `).join('')}
        </div>
      </div>`;

    els.modalSpecs.innerHTML = `
      <dt>${t('modal.specs')}</dt><dd>${t('modal.specsV')}</dd>
      <dt>${t('ecat.coll')}</dt><dd>${esc(d[state.lang].t)}</dd>
      <div class="modal-combo-col">${optionsHtml}</div>`;

    // Seçim butonlarını dinle
    els.modalSpecs.querySelectorAll('.combo-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.selectedProductType = btn.dataset.type;
        els.modalSpecs.querySelectorAll('.combo-chip').forEach((b) => {
          b.classList.remove('active');
        });
        btn.classList.add('active');
        updateModalQuoteBtn();
      });
    });

    els.modalPdfLink.href = `catalog.html#${id}`;
    updateModalQuoteBtn();
    els.modalClose.focus();
    history.replaceState(null, null, `#${id}`);
  }

  function updateModalQuoteBtn() {
    const key = `${state.currentDesign}:${state.selectedProductType}`;
    const isIn = state.quote.some((q) => q.key === key);
    els.modalQuoteBtn.textContent = isIn ? '✓ ' + t('modal.inQuote') : t('modal.addQuote');
  }

  function closeModal() {
    els.modal.hidden = true;
    document.body.style.overflow = '';
    state.currentDesign = null;
    if (state.lastTrigger && document.contains(state.lastTrigger)) {
      state.lastTrigger.focus();
    }
    state.lastTrigger = null;
    if (!state.activeCategory) {
      history.replaceState(null, null, ' ');
    }
  }

  function trapModalFocus(e) {
    if (els.modal.hidden) return;
    if (e.key !== 'Tab') return;
    const focusables = els.modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  /* ---------- Teklif Sepeti ---------- */
  function renderQuote() {
    const items = state.quote.map((q) => {
      return `<span class="quote-tag">${esc(q.title)}<button type="button" data-remove="${q.key}" aria-label="${t('modal.remove')}">×</button></span>`;
    }).join('');
    els.quoteItems.innerHTML = items;
    els.quoteEmpty.hidden = state.quote.length > 0;

    els.quoteItems.querySelectorAll('[data-remove]').forEach((b) => {
      b.addEventListener('click', () => {
        state.quote = state.quote.filter((x) => x.key !== b.dataset.remove);
        renderQuote();
        if (state.currentDesign) updateModalQuoteBtn();
      });
    });
  }

  function addCurrentToQuote() {
    if (!state.currentDesign) return;
    const d = designById(state.currentDesign);
    if (!d) return;

    const key = `${state.currentDesign}:${state.selectedProductType}`;
    const exists = state.quote.some((q) => q.key === key);

    const typeLabels = {
      havlu: state.lang === 'fr' ? 'Serviette' : state.lang === 'en' ? 'Towel' : 'Havlu',
      bornoz: state.lang === 'fr' ? 'Peignoir' : state.lang === 'en' ? 'Bathrobe' : 'Bornoz',
      pike: state.lang === 'fr' ? 'Piqué' : state.lang === 'en' ? 'Piqué' : 'Pike',
      pestemal: state.lang === 'fr' ? 'Fouta' : state.lang === 'en' ? 'Fouta' : 'Peştemal',
      canta: state.lang === 'fr' ? 'Sac à Vin' : state.lang === 'en' ? 'Wine Bag' : 'Şarap Çantası'
    };

    const typeName = typeLabels[state.selectedProductType] || 'Ürün';
    const title = `${d[state.lang].n} (${typeName})`;

    if (exists) {
      state.quote = state.quote.filter((q) => q.key !== key);
    } else {
      state.quote.push({ key, id: state.currentDesign, productType: state.selectedProductType, title });
    }

    renderQuote();
    updateModalQuoteBtn();
  }

  /* ---------- URL Hash Okuma (#bornoz, #monaco) ---------- */
  function checkUrlHash() {
    const hash = window.location.hash.replace('#', '').trim().toLowerCase();
    if (!hash) return;

    // 1. Kategori kontrolü
    const isCat = CATEGORIES.some((c) => c.id.toLowerCase() === hash);
    if (isCat) {
      selectCategory(hash);
      return;
    }

    // 2. Desen kontrolü
    const isDesign = DESIGNS.some((d) => d.id.toLowerCase() === hash);
    if (isDesign) {
      openModal(hash);
      const catalog = document.getElementById('catalog');
      if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /* ---------- Form İşlemleri ---------- */
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
      document.getElementById(errId).textContent = t(input.id === 'fEmail' ? 'form.errEmail' : 'form.errName');
      input.setAttribute('aria-describedby', errId);
    } else {
      const err = document.getElementById(errId);
      if (err) err.remove();
      if (input.getAttribute('aria-describedby') === errId) input.removeAttribute('aria-describedby');
    }
  }

  function bindForm() {
    if (!els.quoteForm) return;
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
    [els.fName, els.fEmail].forEach((input) => {
      if (input) input.addEventListener('input', () => setFieldError(input, false));
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

  /* ---------- Mobile Nav ---------- */
  function setNav(open) {
    if (!els.navToggle || !els.mobileNav) return;
    els.navToggle.setAttribute('aria-expanded', String(open));
    els.mobileNav.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      const first = els.mobileNav.querySelector('a');
      if (first) first.focus();
    } else if (document.activeElement && els.mobileNav.contains(document.activeElement)) {
      els.navToggle.focus();
    }
  }

  function bindNav() {
    if (!els.navToggle || !els.mobileNav) return;
    els.navToggle.addEventListener('click', () => {
      setNav(els.navToggle.getAttribute('aria-expanded') !== 'true');
    });
    els.mobileNav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => setNav(false));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && els.navToggle.getAttribute('aria-expanded') === 'true') {
        setNav(false);
      }
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    Object.assign(els, {
      collectionGrid: $('#collectionGrid'),
      filterChips: $('#filterChips'),
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

    $$('.lang-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.lang = btn.dataset.lang;
        localStorage.setItem('damira-lang', state.lang);
        applyI18n();
      });
    });

    if (els.resetBtn) els.resetBtn.addEventListener('click', resetFilters);
    if (els.emptyResetBtn) els.emptyResetBtn.addEventListener('click', resetFilters);

    if (els.loadMoreBtn) {
      els.loadMoreBtn.addEventListener('click', () => {
        state.visibleCount += 8;
        renderDesigns();
      });
    }

    if (els.modalQuoteBtn) els.modalQuoteBtn.addEventListener('click', addCurrentToQuote);
    $$('[data-close-modal]').forEach((el) => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && els.modal && !els.modal.hidden) closeModal();
      trapModalFocus(e);
    });

    window.addEventListener('hashchange', checkUrlHash);

    bindForm();
    bindNav();
    window.DAMIRA.bindNav = bindNav;

    applyI18n();
    observeReveals();
    checkUrlHash();
  });
})();
