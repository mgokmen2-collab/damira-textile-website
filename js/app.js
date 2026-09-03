/* COQ D'OR — MAISON DE LINGE (Uygulama Katmanı)
 * i18n, 6 Ürün Grubu (kart → inceleme paneli → model slider),
 * 25 Şehir Deseni (kategori filtreleri + inceleme modalı),
 * Modele desen bağlama (pending) & B2B teklif sepeti (localStorage)
 */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  const { CATEGORIES, DESIGNS, I18N } = window.DAMIRA;

  const LANG_ORDER = ['fr', 'en', 'tr']; // Dil sırası: FR → EN → TR

  const state = {
    lang: localStorage.getItem('damira-lang') || 'tr',
    activeCat: null,          // desen filtresi: seçili ürün grubu (chip) — boş = tümü
    quote: [],                // teklif kalemleri (localStorage'da)
    visibleCount: 8,          // desen sayfalama
    pendingModel: null,       // desen bağlanacak model: { cid, mid, name }
    pendingDesigns: [],       // o modele bağlanmış desen id'leri
    currentDesign: null,      // modalda açık desen
    msIndex: 0,               // desen modalı slider index
    group: null,              // inceleme panelindeki grup
    gIndex: 0,                // panel slider index
    gTimer: null,             // panel otomatik geçiş
    gCtx: null,               // panel açılış bağlamı { fromDesignId }
    lastTrigger: null
  };

  const els = {};
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  const QUOTE_KEY = 'damira-quote';

  /* ---------- Yardımcılar ---------- */
  const t = (key) => (I18N[state.lang] && I18N[state.lang][key]) || (I18N.tr && I18N.tr[key]) || key;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const catById = (id) => CATEGORIES.find((c) => c.id === id);
  const designById = (id) => DESIGNS.find((d) => d.id === id);
  const catLabel = (code) => t('cat.' + code) || code;

  function toast(msg) {
    const el = els.toast;
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._toastT);
    el._toastT = setTimeout(() => el.classList.remove('show'), 4400); // 2.2sn → 4.4sn
  }

  /* ---------- Teklif sepeti (localStorage) ---------- */
  function persistQuote() {
    try { localStorage.setItem(QUOTE_KEY, JSON.stringify(state.quote)); } catch (e) { /* dolu */ }
  }
  function loadQuote() {
    try {
      const raw = JSON.parse(localStorage.getItem(QUOTE_KEY) || '[]');
      if (Array.isArray(raw)) state.quote = raw;
    } catch (e) { state.quote = []; }
  }
  function addQuote(item) {
    if (state.quote.some((q) => q.key === item.key)) { toast(t('quote.exists') + ' ' + item.title); return; }
    state.quote.push(item);
    persistQuote();
    renderQuote();
    toast(t('quote.added') + ' ' + item.title);
  }
  function quoteTitle(model, designs, plain) {
    const ds = designs.filter(Boolean);
    if (plain || !ds.length) return `${model} (${t('quote.plain')})`;
    if (ds.length === 1) return `${model} + ${ds[0].tr ? ds[0].tr.n : ds[0]}`;
    return `${model} + ${ds.length} ${t('pending.designs')}`;
  }

  /* ---------- i18n uygula ---------- */
  function applyI18n() {
    document.documentElement.lang = state.lang;
    $$('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = val;
      else el.textContent = val;
    });
    $$('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.getAttribute('data-i18n-ph')); });
    $$('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); });
    document.title = state.lang === 'tr'
      ? 'COQ D’OR — Maison de Linge | Nice, Fransa · Toptan Lüks Tekstil'
      : state.lang === 'fr'
        ? 'COQ D’OR — Maison de Linge | Nice, France · Linge d’Hôtellerie en Gros'
        : 'COQ D’OR — Maison de Linge | Nice, France · Wholesale Luxury Linens';

    $$('.lang-btn').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.lang === state.lang));
    });

    renderCollections();
    renderFilterChips();
    renderDesigns();
    renderQuote();
    renderPendingBar();
    syncPanelI18n();
  }

  /* ============================================================
     1) ÜRÜN GRUPLARI — koleksiyon kartları → inceleme paneli
     ============================================================ */
  function renderCollections() {
    const grid = els.collectionGrid;
    if (!grid) return;

    grid.innerHTML = CATEGORIES.map((c) => {
      const count = (c.models || []).length;
      const ratio = c.ratio || 1;
      const fit = ratio >= 0.70 && ratio <= 0.80 ? 'fit' : 'crop';
      return `
        <article class="collection-card reveal">
          <button type="button" class="cc-open" data-open-group="${c.id}" aria-label="${esc(c[state.lang])} — ${count} ${t('modal.unit')}">
            <figure>
              <img class="cc-cover" src="${c.img}" alt="${esc(c[state.lang])}" loading="lazy" data-fit="${fit}">
              ${fit === 'crop' ? `<img class="cc-contain" src="${c.img}" alt="" aria-hidden="true" loading="lazy">` : ''}
              <figcaption>
                ${esc(c[state.lang])}
                <span class="collection-count">${count} ${t('modal.unit')}</span>
              </figcaption>
            </figure>
            <span class="btn btn-outline btn-sm cc-view">${t('panel.view')}</span>
          </button>
        </article>`;
    }).join('');

    grid.querySelectorAll('[data-open-group]').forEach((btn) => {
      btn.addEventListener('click', () => openGroupPanel(btn.dataset.openGroup));
    });
    observeReveals();
  }

  /* ---------- Grup inceleme paneli: model slider ---------- */
  function openGroupPanel(cid, opts) {
    const c = catById(cid);
    if (!c || !els.groupModal) return;
    const models = c.models || [];
    if (!models.length) return;

    state.group = cid;
    state.gIndex = 0;
    state.gCtx = opts || null;
    els.gmGroup.textContent = c[state.lang];
    els.gmTitle.textContent = t('panel.title');
    buildGmTrack(c, models);
    els.groupModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    gmGo(0);
    gmAuto(true);
    els.gmClose.focus();
  }

  function closeGroupPanel() {
    els.groupModal.classList.remove('open');
    document.body.style.overflow = '';
    gmAuto(false);
    state.group = null;
    state.gCtx = null;
  }

  function buildGmTrack(c, models) {
    els.gmTrack.innerHTML = models.map((m) => {
      const srcs = [m.img, m.gallery && m.gallery[1], m.img2].filter(Boolean);
      return `
        <div class="slide">
          <figure class="slide-fig">
            <img src="${srcs[0]}" alt="${esc(m.n[state.lang])}" loading="lazy" data-role="main">
            ${srcs.length > 1 ? `<img src="${srcs[1]}" alt="" aria-hidden="true" loading="lazy" class="slide-alt">` : ''}
          </figure>
          <div class="slide-cap">
            <span class="slide-name">${esc(m.n[state.lang])}</span>
            <span class="slide-meta">${esc(c[state.lang])}${m.n[state.lang] ? ' · ' + esc(m.n[state.lang]) : ''}</span>
          </div>
        </div>`;
    }).join('');
    els.gmDots.innerHTML = models.map((m, i) =>
      `<button class="dot" data-gdot="${i}" aria-label="${t('panel.prev')} ${i + 1}"></button>`
    ).join('');

    // Ok butonları: prev sola (index-1), next sağa (index+1) — terslik düzeltildi
    els.gmNext.onclick = () => { gmGo(state.gIndex + 1); gmAuto(true); };
    els.gmPrev.onclick = () => { gmGo(state.gIndex - 1); gmAuto(true); };

    els.gmDots.querySelectorAll('[data-gdot]').forEach((d) => {
      d.addEventListener('click', () => { gmGo(+d.dataset.gdot); gmAuto(true); });
    });

    // Swipe (touch)
    let startX = null;
    els.gmTrack.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    els.gmTrack.addEventListener('touchend', (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { gmGo(state.gIndex + (dx < 0 ? 1 : -1)); gmAuto(true); }
      startX = null;
    }, { passive: true });

    // Klavye
    els.gmTrack.tabIndex = 0;
    els.gmTrack.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { gmGo(state.gIndex + 1); gmAuto(true); }
      if (e.key === 'ArrowLeft') { gmGo(state.gIndex - 1); gmAuto(true); }
    });
  }

  function gmAuto(on) {
    if (els.gmTimer) { clearInterval(els.gmTimer); els.gmTimer = null; }
    if (!on || !state.group) return;
    els.gmTimer = setInterval(() => {
      if (!state.group) return;
      const c = catById(state.group);
      if (!c || !c.models.length) return;
      gmGo(state.gIndex + 1);
    }, 5000);
  }
  function gmStop() { gmAuto(false); }

  function gmGo(idx) {
    const c = catById(state.group);
    if (!c || !c.models.length) return;
    const n = c.models.length;
    state.gIndex = ((idx % n) + n) % n;
    const m = c.models[state.gIndex];

    els.gmTrack.style.transform = `translateX(-${state.gIndex * 100}%)`;
    els.gmCount.textContent = `${state.gIndex + 1} / ${n}`;
    els.gmDots.querySelectorAll('[data-gdot]').forEach((d, i) => d.classList.toggle('active', i === state.gIndex));
    els.gmSummary.innerHTML = `<strong>${esc(m.n[state.lang])}</strong>`;
    els.gmActions.innerHTML = `
      <button class="btn btn-outline" data-plain="${c.id}:${m.id}">${t('panel.plain')}</button>
      <button class="btn btn-gold-line" data-attach="${c.id}:${m.id}">${t('panel.attach')}</button>
      <a class="btn btn-ghost" href="catalog.html#${c.id}">${t('panel.openCatalog')}</a>
    `;
    els.gmHint.textContent = t('panel.hint');

    els.gmActions.querySelector('[data-plain]').addEventListener('click', (e) => {
      const [cid2, mid2] = e.currentTarget.dataset.plain.split(':');
      const cc = catById(cid2);
      const mm = cc.models.find((x) => x.id === mid2);
      addQuote({ key: 'plain:' + cid2 + ':' + mid2, title: quoteTitle(mm.n[state.lang], [], true) });
      closeGroupPanel();
    });
    els.gmActions.querySelector('[data-attach]').addEventListener('click', (e) => {
      const [cid2, mid2] = e.currentTarget.dataset.attach.split(':');
      const cc = catById(cid2);
      const mm = cc.models.find((x) => x.id === mid2);
      state.pendingModel = { cid: cid2, mid: mid2, name: mm.n[state.lang] };
      state.pendingDesigns = [];
      stopAutoAll();
      closeGroupPanel();
      renderPendingBar();
      toast(t('pending.sub'));
      const sec = $('#catalog');
      if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function stopAutoAll() { gmAuto(false); }

  /* ============================================================
     2) DESEN ARŞİVİ — bölgesel filtreler + kartlar
     ============================================================ */
  const CATS = ['riviera', 'provence', 'atlantik', 'kuzey', 'adalar', 'guney'];

  function renderFilterChips() {
    const wrap = els.filterChips;
    if (!wrap) return;

    const chip = (val, label, active) =>
      `<button class="chip" data-fcat="${val}" aria-pressed="${active}">${esc(label)}</button>`;

    const hasCat = DESIGNS.some((d) => d.cat);
    const base = hasCat
      ? chip('', t('cat.all'), !state.activeCat) + CATS.map((c) => chip(c, catLabel(c), state.activeCat === c)).join('')
      : CATEGORIES.map((c) => chip(c.id, c[state.lang], state.activeCat === c.id)).join('');

    wrap.innerHTML = base;
    wrap.querySelectorAll('.chip').forEach((b) => b.addEventListener('click', () => {
      state.activeCat = b.dataset.fcat || null;
      state.visibleCount = 8;
      syncChips();
      renderDesigns();
      history.replaceState(null, null, state.activeCat ? `#${state.activeCat}` : ' ');
    }));
  }

  function syncChips() {
    if (!els.filterChips) return;
    els.filterChips.querySelectorAll('.chip').forEach((chip2) => {
      chip2.setAttribute('aria-pressed', String(chip2.dataset.fcat === (state.activeCat || '')));
    });
  }

  function filteredDesigns() {
    if (!state.activeCat) return DESIGNS;
    return DESIGNS.filter((d) => d.cat === state.activeCat);
  }

  function renderDesigns() {
    if (!els.productGrid) return;
    const list = filteredDesigns();
    els.resetBtn.hidden = !state.activeCat;
    // Sayaç: 0 iken gizli, 1'den itibaren göster
    if (list.length === 0) {
      els.catalogCount.hidden = true;
    } else {
      els.catalogCount.textContent = `${list.length} ${t('catalog.count')}`;
      els.catalogCount.hidden = false;
    }

    const shown = list.slice(0, state.visibleCount);
    els.productGrid.innerHTML = shown.map(designCard).join('');

    els.productGrid.querySelectorAll('figure img').forEach((img) => {
      if (img.complete && img.naturalWidth > 0) img.classList.add('loaded');
      else img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
    });

    els.productGrid.querySelectorAll('[data-open]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.lastTrigger = btn;
        openDesignModal(btn.dataset.open);
      });
    });

    els.productGrid.querySelectorAll('[data-attach-des]').forEach((btn) => {
      btn.addEventListener('click', () => attachPending(btn.dataset.attachDes));
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

  function designCard(d) {
    const label = `${d[state.lang].n} — COQ D’OR`;
    const ratio = d.ratio || 1;
    const fit = ratio >= 0.85 && ratio <= 1.18 ? 'fit' : 'crop';
    const active = state.pendingDesigns.includes(d.id);
    return `
      <li class="product-card reveal revealed">
        <button type="button" data-open="${d.id}" aria-label="${esc(label)}" aria-pressed="${active}">
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
          <p class="product-coll">${esc(catLabel(d.cat) || d[state.lang].t)}</p>
        </div>
        <div class="pc-actions">
          ${state.pendingModel
            ? `<button class="btn btn-outline btn-sm" data-attach-des="${d.id}" aria-pressed="${active}">${active ? '✓ ' + t('panel.attach') : t('panel.attach')}</button>`
            : `<button class="design-detail-btn btn-block" data-open="${d.id}">${t('designs.detail')}</button>`}
        </div>
      </li>`;
  }

  function attachPending(id) {
    if (!state.pendingModel) { toast(t('pending.plainFirst')); return; }
    const d = designById(id);
    if (!d) return;
    if (state.pendingDesigns.includes(id)) {
      state.pendingDesigns = state.pendingDesigns.filter((x) => x !== id);
      toast(t('pending.removed') + ' ' + d[state.lang].n);
    } else {
      state.pendingDesigns.push(id);
      toast(t('pending.added') + ' ' + state.pendingModel.name + ' + ' + d[state.lang].n);
    }
    renderDesigns();
    renderPendingBar();
  }

  /* ---------- Pending bar (modele desen bağlama) ---------- */
  function renderPendingBar() {
    const bar = els.pendingBar;
    if (!bar) return;
    const pm = state.pendingModel;
    if (!pm) { bar.hidden = true; bar.innerHTML = ''; return; }
    const cc = catById(pm.cid);
    const mm = cc && cc.models.find((x) => x.id === pm.mid);
    const ds = state.pendingDesigns.map(designById).filter(Boolean);

    bar.hidden = false;
    bar.innerHTML = `
      <div class="pending-box">
        <span class="pending-model">${esc(mm ? mm.n[state.lang] : pm.name)}</span>
        <span class="pending-plus">+</span>
        <span class="pending-designs">
          ${ds.length
            ? ds.map((d) => `<span class="chip chip-s" aria-pressed="true">${esc(d[state.lang].n)}</span>`).join('')
            : `<em class="pending-none">${t('pending.noDesign')}</em>`}
        </span>
        <button class="btn btn-primary btn-sm" id="pendingCommit" ${ds.length ? '' : 'disabled'}>${t('pending.commit')}</button>
        <button class="btn btn-ghost btn-sm" id="pendingCancel">${t('pending.cancel')}</button>
      </div>`;

    $('#pendingCommit').addEventListener('click', () => {
      if (!ds.length) return;
      addQuote({
        key: 'combo:' + pm.cid + ':' + pm.mid + ':' + state.pendingDesigns.slice().sort().join('|'),
        title: quoteTitle(mm ? mm.n[state.lang] : pm.name, ds.map((d) => d[state.lang].n))
      });
      state.pendingModel = null;
      state.pendingDesigns = [];
      renderDesigns();
      renderPendingBar();
      const c = $('#contact');
      if (c) c.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    $('#pendingCancel').addEventListener('click', () => {
      const back = pm.cid;
      state.pendingModel = null;
      state.pendingDesigns = [];
      renderDesigns();
      renderPendingBar();
      openGroupPanel(back, null);
    });
  }

  /* ============================================================
     3) DESEN İNCELEME MODALI (slider: varyant görseller + aksiyonlar)
     ============================================================ */
  function designGallery(d) {
    const g = (d.gallery || []).filter(Boolean);
    if (!g.length) return [d.img];
    return [d.img].concat(g);
  }

  function openDesignModal(id) {
    const d = designById(id);
    if (!d || !els.modal) return;
    state.currentDesign = id;
    state.msIndex = 0;
    els.modal.hidden = false;
    document.body.style.overflow = 'hidden';

    els.modalCollection.textContent = catLabel(d.cat) || 'COQ D’OR — MAISON DE LINGE';
    els.modalTitle.textContent = d[state.lang].n;
    els.modalDesc.textContent = d[state.lang].d;
    els.modalSpecs.innerHTML = `
      <dt>${t('modal.specs')}</dt><dd>${t('modal.specsV')}</dd>
      <dt>${t('ecat.coll')}</dt><dd>${esc(catLabel(d.cat) || d[state.lang].t)}</dd>
    `;

    // Varyant slider'ı
    const imgs = designGallery(d);
    els.msTrack.innerHTML = imgs.map((src) =>
      `<div class="ms-slide"><img src="${src}" alt="${esc(d[state.lang].n)} — COQ D’OR" loading="lazy"></div>`
    ).join('');
    els.msDots.innerHTML = imgs.length > 1
      ? imgs.map((x, i) => `<button class="dot ${i === 0 ? 'active' : ''}" data-msdot="${i}" aria-label="Varyant ${i + 1}"></button>`).join('')
      : '';
    els.msTrack.style.transform = 'translateX(0%)';

    const msGo = (idx) => {
      const n = imgs.length;
      state.msIndex = ((idx % n) + n) % n;
      els.msTrack.style.transform = `translateX(-${state.msIndex * 100}%)`;
      els.msDots.querySelectorAll('[data-msdot]').forEach((dd, i) => dd.classList.toggle('active', i === state.msIndex));
    };
    const msNext = els.modal.querySelector('.ms-next');
    const msPrev = els.modal.querySelector('.ms-prev');
    msNext.onclick = () => msGo(state.msIndex + 1);
    msPrev.onclick = () => msGo(state.msIndex - 1);
    els.msDots.querySelectorAll('[data-msdot]').forEach((dd) => {
      dd.onclick = () => msGo(+dd.dataset.msdot);
    });

    const alreadyIn = state.quote.some((q) => q.key === 'design:' + id);
    els.modalQuoteBtn.textContent = alreadyIn ? '✓ ' + t('modal.inQuote') : t('modal.addQuote');
    els.modalPdfLink.href = `catalog.html#${id}`;
    els.modalClose.focus();
    history.replaceState(null, null, `#${id}`);
  }

  function closeDesignModal() {
    els.modal.hidden = true;
    document.body.style.overflow = '';
    state.currentDesign = null;
    if (state.lastTrigger && document.contains(state.lastTrigger)) state.lastTrigger.focus();
    state.lastTrigger = null;
    if (!state.activeCat) history.replaceState(null, null, ' ');
  }

  function trapModalFocus(e) {
    if (els.modal.hidden && !(els.groupModal && els.groupModal.classList.contains('open'))) return;
    if (e.key !== 'Tab') return;
    const activeModal = els.modal.hidden ? els.groupModal : els.modal;
    const focusables = activeModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function syncPanelI18n() {
    if (!els.gmActions) return;
    if (state.group) gmGo(state.gIndex);
  }

  /* ============================================================
     4) TEKLİF SEPETİ — rozet, sticky bar, form listesi
     ============================================================ */
  function renderQuote() {
    // Header rozeti
    const n = state.quote.length;
    $$('#quoteLink, #mobileQuoteLink').forEach((a) => {
      const label = t('nav.quote');
      a.textContent = '';
      a.appendChild(document.createTextNode(label + ' '));
      const badge = document.createElement('span');
      badge.className = 'quote-n';
      badge.textContent = n;
      badge.hidden = n === 0;      // 0 iken rozet görünmesin
      a.appendChild(badge);
    });

    // Sticky bar
    if (els.quoteSticky) {
      els.quoteSticky.hidden = n === 0;
      if (n > 0) {
        els.stickyCount.textContent = `${n} ${t('quote.items')}`;
        els.clearQuoteBtn.hidden = false;
      }
    }

    // Formdaki etiket listesi
    if (els.quoteItems) {
      const items = state.quote.map((q) => `
        <span class="quote-tag">${esc(q.title)}<button type="button" data-remove="${q.key}" aria-label="${t('modal.remove')}">×</button></span>
      `).join('');
      els.quoteItems.innerHTML = items;
      els.quoteEmpty.hidden = state.quote.length > 0;

      els.quoteItems.querySelectorAll('[data-remove]').forEach((b) => {
        b.addEventListener('click', () => {
          state.quote = state.quote.filter((x) => x.key !== b.dataset.remove);
          persistQuote();
          renderQuote();
          if (state.currentDesign) updateQuoteBtnState();
        });
      });
    }
  }

  function updateQuoteBtnState() {
    if (!els.modalQuoteBtn || !state.currentDesign) return;
    const alreadyIn = state.quote.some((q) => q.key === 'design:' + state.currentDesign);
    els.modalQuoteBtn.textContent = alreadyIn ? '✓ ' + t('modal.inQuote') : t('modal.addQuote');
  }

  function addCurrentDesignToQuote() {
    if (!state.currentDesign) return;
    const d = designById(state.currentDesign);
    if (!d) return;
    const key = 'design:' + d.id;
    if (state.quote.some((q) => q.key === key)) {
      state.quote = state.quote.filter((q) => q.key !== key);
      toast(t('quote.plain'));
    } else {
      state.quote.push({ key, title: `${d[state.lang].n} (${t('ecat.coll')})` });
      toast(t('quote.added') + ' ' + d[state.lang].n);
    }
    persistQuote();
    renderQuote();
    updateQuoteBtnState();
  }

  /* ---------- URL Hash (#bornoz → panel, #monaco → modal) ---------- */
  function checkUrlHash() {
    const hash = window.location.hash.replace('#', '').trim().toLowerCase();
    if (!hash) return;

    const isCat = CATEGORIES.some((c) => c.id.toLowerCase() === hash);
    if (isCat) {
      openGroupPanel(hash, null);
      return;
    }

    const isDesign = DESIGNS.some((d) => d.id.toLowerCase() === hash);
    if (isDesign) {
      openDesignModal(hash);
      const sec = $('#catalog');
      if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    // Kategori filtre hash'i
    if (CATS.includes(hash)) {
      state.activeCat = hash;
      syncChips();
      renderDesigns();
    }
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
        persistQuote();
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
      fName: $('#fName'),
      fEmail: $('#fEmail'),
      modal: $('#productModal'),
      modalClose: $('.modal-close'),
      msTrack: $('#msTrack'),
      msDots: $('#msDots'),
      modalCollection: $('#modalCollection'),
      modalTitle: $('#modalTitle'),
      modalDesc: $('#modalDesc'),
      modalSpecs: $('#modalSpecs'),
      modalPdfLink: $('#modalPdfLink'),
      modalQuoteBtn: $('#modalQuoteBtn'),
      navToggle: $('.nav-toggle'),
      mobileNav: $('#mobileNav'),
      quoteSticky: $('#quoteSticky'),
      stickyCount: $('#stickyCount'),
      clearQuoteBtn: $('#clearQuoteBtn'),
      pendingBar: $('#pendingBar'),
      toast: $('#toast'),
      groupModal: $('#groupModal'),
      gmClose: $('#groupModal .gm-close'),
      gmGroup: $('#gmGroup'),
      gmTitle: $('#gmTitle'),
      gmCount: $('#gmCount'),
      gmSlider: $('#gmSlider'),
      gmTrack: $('#gmTrack'),
      gmDots: $('#gmDots'),
      gmPrev: $('#gmPrev'),
      gmNext: $('#gmNext'),
      gmSummary: $('#gmSummary'),
      gmActions: $('#gmActions'),
      gmHint: $('#gmHint')
    });

    loadQuote();

    // Dil sırası: FR → EN → TR (DOM'daki sıra)
    $$('.lang-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.lang = btn.dataset.lang;
        localStorage.setItem('damira-lang', state.lang);
        applyI18n();
      });
    });

    if (els.resetBtn) els.resetBtn.addEventListener('click', () => {
      state.activeCat = null;
      state.visibleCount = 8;
      syncChips();
      renderDesigns();
      history.replaceState(null, null, ' ');
    });
    if (els.emptyResetBtn) els.emptyResetBtn.addEventListener('click', () => {
      state.activeCat = null;
      state.visibleCount = 8;
      syncChips();
      renderDesigns();
      history.replaceState(null, null, ' ');
    });

    if (els.loadMoreBtn) {
      els.loadMoreBtn.addEventListener('click', () => {
        state.visibleCount += 8;
        renderDesigns();
      });
    }

    if (els.modalQuoteBtn) els.modalQuoteBtn.addEventListener('click', addCurrentDesignToQuote);
    $$('[data-close-modal]').forEach((el) => el.addEventListener('click', closeDesignModal));
    if (els.gmClose) {
      $$('[data-gm-close]').forEach((el) => el.addEventListener('click', closeGroupPanel));
    }
    if (els.clearQuoteBtn) els.clearQuoteBtn.addEventListener('click', () => {
      state.quote = [];
      persistQuote();
      renderQuote();
    });
    if (els.stickyGoForm) {
      els.stickyGoForm.addEventListener('click', () => {
        const c = $('#contact');
        if (c) c.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (els.groupModal && els.groupModal.classList.contains('open')) { closeGroupPanel(); return; }
        if (els.modal && !els.modal.hidden) { closeDesignModal(); return; }
        if (els.navToggle && els.navToggle.getAttribute('aria-expanded') === 'true') { setNav(false); return; }
      }
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
