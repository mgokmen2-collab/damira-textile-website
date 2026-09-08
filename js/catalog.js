/* COQ D'OR — MAISON DE LINGE (E-Katalog Katmanı)
 * Tüm Ürün Grupları (Büyük görsel veya küçük kart tıklanınca Group Modal hızlı inceleme paneli açılır)
 * 25 Bölgesel Desen, Evrensel Lightbox, Swipe Desteği & Çok Dilli (TR / EN / FR)
 */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  const { CATEGORIES, DESIGNS, I18N } = window.DAMIRA;

  const state = {
    lang: localStorage.getItem('damira-lang') || 'fr',
    group: null,       // Açık olan kategori id'si
    gIndex: 0,         // Modal slider aktif indeks
    lb: null           // Lightbox durumu: { open, list, index }
  };

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  const t = (key) => (I18N[state.lang] && I18N[state.lang][key]) || (I18N.tr && I18N.tr[key]) || key;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const catById = (id) => CATEGORIES.find((c) => c.id === id);

  const CAT_LABELS = {
    riviera: 'cat.riviera', provence: 'cat.provence', atlantik: 'cat.atlantik',
    kuzey: 'cat.kuzey', adalar: 'cat.adalar', guney: 'cat.guney'
  };
  const catLabel = (code) => (code && CAT_LABELS[code] ? t(CAT_LABELS[code]) : '');

  const QUOTE_KEY = 'damira-quote';

  /* ---------- Toast Bildirim ---------- */
  function toast(msg) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._toastT);
    el._toastT = setTimeout(() => el.classList.remove('show'), 4400);
  }

  /* ---------- Teklif Listesi (localStorage: damira-quote) ---------- */
  function getQuote() {
    try {
      const raw = JSON.parse(localStorage.getItem(QUOTE_KEY) || '[]');
      return Array.isArray(raw) ? raw : [];
    } catch (e) {
      return [];
    }
  }

  function persistQuote(list) {
    try {
      localStorage.setItem(QUOTE_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  function quoteTitle(modelName) {
    const plainLabel = t('quote.plain') || (state.lang === 'tr' ? 'Sade' : state.lang === 'fr' ? 'Uni' : 'Plain');
    return `${modelName} (${plainLabel})`;
  }

  function isModelInQuote(cid, mid) {
    const list = getQuote();
    return list.some((q) => q.key === `plain:${cid}:${mid}`);
  }

  function addModelToQuote(c, m) {
    const list = getQuote();
    const key = `plain:${c.id}:${m.id}`;
    const title = quoteTitle(m.n[state.lang]);
    if (!list.some((q) => q.key === key)) {
      list.push({ key, title });
      persistQuote(list);
      renderQuoteBadges();
      return true;
    }
    return false;
  }

  function removeModelFromQuote(c, m) {
    let list = getQuote();
    const key = `plain:${c.id}:${m.id}`;
    list = list.filter((q) => q.key !== key);
    persistQuote(list);
    renderQuoteBadges();
  }

  function renderQuoteBadges() {
    const n = getQuote().length;
    $$('#quoteLink, #mobileQuoteLink').forEach((a) => {
      const label = t('nav.quote');
      a.textContent = '';
      a.appendChild(document.createTextNode(label + ' '));
      const badge = document.createElement('span');
      badge.className = 'quote-n';
      badge.textContent = n;
      badge.hidden = n === 0;
      a.appendChild(badge);
    });
  }

  const els = {};

  /* ---------- Dokunmatik Swipe Yöneticisi ---------- */
  function attachSwipe(el, handlers) {
    if (!el) return;
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let isControlTarget = false;

    el.addEventListener('touchstart', (e) => {
      // Butonlara (oklar, kapatma, zoom, noktalar) dokunulduğunda swipe veya tap tetikleme
      if (e.target.closest('button, a, .slider-arrow, .slider-dots, .figure-bar, [data-gm-close], [data-lb-close]')) {
        isControlTarget = true;
        return;
      }
      isControlTarget = false;
      const touch = e.changedTouches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = Date.now();
    }, { passive: true });

    el.addEventListener('touchend', (e) => {
      if (isControlTarget || e.target.closest('button, a, .slider-arrow, .slider-dots, .figure-bar, [data-gm-close], [data-lb-close]')) {
        isControlTarget = false;
        return;
      }
      if (!startTime) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      const dt = Date.now() - startTime;
      startTime = 0;

      // Yatay kaydırma (swipe)
      if (dt < 400 && Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        if (dx < 0 && handlers.onNext) handlers.onNext();
        else if (dx > 0 && handlers.onPrev) handlers.onPrev();
      } else if (dt < 250 && Math.abs(dx) < 12 && Math.abs(dy) < 12 && handlers.onTap) {
        // Yalnızca doğrudan görsel alanına dokunulduğunda tam ekran aç
        if (e.target.closest('.gm-slide, #gmTrack, .lb-viewport, img')) {
          handlers.onTap();
        }
      }
    }, { passive: true });
  }

  /* ---------- Ürün grupları: Model Kartları Vitrini ---------- */
  function renderCategories() {
    const list = $('#ecatCollectionList');
    if (!list) return;

    list.innerHTML = CATEGORIES.map((c) => {
      const models = c.models || [];
      return `
        <article class="ecat-collection" id="${c.id}" data-group="${c.id}">
          <header class="ecat-group-head">
            <p class="eyebrow">${models.length} ${t('modal.unit')}</p>
            <h2 class="ecat-collection-title">${esc(c[state.lang])}</h2>
            <p class="ecat-collection-desc">${esc(c.d[state.lang])}</p>
          </header>

          ${models.length > 0 ? `
            <div class="ecat-models-grid" data-thumbs="${c.id}">
              ${models.map((m, mIdx) => `
                <button type="button" class="ecat-model-card" data-thumb="${c.id}:${m.id}" data-idx="${mIdx}" aria-label="${esc(m.n[state.lang])}">
                  <figure class="ecat-card-fig">
                    <img src="${m.img}" alt="${esc(m.n[state.lang])}" loading="lazy">
                    <span class="ecat-card-badge" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                      <span>${t('ui.zoom')}</span>
                    </span>
                  </figure>
                  <div class="ecat-card-body">
                    <h3 class="ecat-card-title">${esc(m.n[state.lang])}</h3>
                    <span class="ecat-card-action">${t('panel.view')} →</span>
                  </div>
                </button>
              `).join('')}
            </div>
          ` : ''}
        </article>`;
    }).join('');

    // Herhangi bir model kartına tıklandığında doğrudan Group Modal o modelle açılır
    $$('.ecat-model-card[data-thumb]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const [gid] = btn.dataset.thumb.split(':');
        const mIdx = parseInt(btn.dataset.idx, 10) || 0;
        openGroupModal(gid, mIdx);
      });
    });
  }

  /* ---------- Ürün Grubu İnceleme Paneli (Group Modal) ---------- */
  function openGroupModal(cid, targetIdx) {
    const c = catById(cid);
    if (!c || !els.groupModal) return;
    const models = c.models || [];
    if (!models.length) return;

    state.group = cid;
    const validIdx = (typeof targetIdx === 'number' && targetIdx >= 0 && targetIdx < models.length) ? targetIdx : 0;
    state.gIndex = validIdx;

    els.gmGroup.textContent = c[state.lang];
    buildGmTrack(c, models);
    els.groupModal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Arka planı inert yap
    const bgEls = ['#catalogMain', '#siteHeader', '.site-footer', '#mobileNav'];
    bgEls.forEach((sel) => {
      $$(sel).forEach((el) => el.setAttribute('inert', ''));
    });

    gmGo(state.gIndex);
    if (els.gmClose) {
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        els.gmClose.focus({ preventScroll: true });
      } else {
        els.gmClose.blur();
      }
    }
  }

  function closeGroupModal() {
    if (!els.groupModal) return;
    els.groupModal.classList.remove('open');
    document.body.style.overflow = '';

    const bgEls = ['#catalogMain', '#siteHeader', '.site-footer', '#mobileNav'];
    bgEls.forEach((sel) => {
      $$(sel).forEach((el) => el.removeAttribute('inert'));
    });

    state.group = null;
  }

  function buildGmTrack(c, models) {
    if (!els.gmTrack) return;
    els.gmTrack.innerHTML = models.map((m) => {
      const srcs = [m.img, m.gallery && m.gallery[1], m.img2].filter(Boolean);
      return `
        <div class="slide" title="${t('ui.zoom')}">
          <figure class="slide-fig">
            <img src="${srcs[0]}" alt="${esc(m.n[state.lang])}" loading="lazy" data-role="main">
            ${srcs.length > 1 ? `<img src="${srcs[1]}" alt="" aria-hidden="true" loading="lazy" class="slide-alt">` : ''}
          </figure>
        </div>`;
    }).join('');

    if (els.gmDots) {
      els.gmDots.innerHTML = (models.length > 1 && models.length <= 10)
        ? models.map((m, i) => `<button class="dot" data-gdot="${i}" aria-label="${t('ui.variant')} ${i + 1}"></button>`).join('')
        : '';

      els.gmDots.querySelectorAll('[data-gdot]').forEach((d) => {
        d.onclick = (e) => {
          e.stopPropagation();
          gmGo(+d.dataset.gdot);
        };
      });
    }

    if (els.gmNext) els.gmNext.onclick = (e) => { e.stopPropagation(); gmGo(state.gIndex + 1); };
    if (els.gmPrev) els.gmPrev.onclick = (e) => { e.stopPropagation(); gmGo(state.gIndex - 1); };

    if (els.gmZoomBtn) {
      els.gmZoomBtn.onclick = (e) => {
        e.stopPropagation();
        openGroupLightbox();
      };
    }

    els.gmTrack.tabIndex = 0;
    els.gmTrack.style.cursor = 'zoom-in';
    els.gmTrack.onclick = (e) => {
      if (e.target.tagName === 'IMG' || e.target.classList.contains('gm-slide')) {
        openGroupLightbox();
      }
    };
    els.gmTrack.onkeydown = (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); gmGo(state.gIndex + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); gmGo(state.gIndex - 1); }
    };
  }

  function gmGo(idx) {
    const c = catById(state.group);
    if (!c || !c.models || !c.models.length) return;
    const n = c.models.length;
    state.gIndex = ((idx % n) + n) % n;
    const m = c.models[state.gIndex];

    if (els.gmTrack) els.gmTrack.style.transform = `translateX(-${state.gIndex * 100}%)`;
    if (els.gmCount) els.gmCount.textContent = `${state.gIndex + 1} / ${n}`;
    if (els.gmTitle) els.gmTitle.textContent = m.n[state.lang];
    if (els.gmDesc) els.gmDesc.textContent = c.d ? c.d[state.lang] : '';
    if (els.gmStatus) els.gmStatus.textContent = `${t('ui.sliderStatus')} ${m.n[state.lang]}`;

    if (els.gmDots) {
      els.gmDots.querySelectorAll('[data-gdot]').forEach((d, i) => d.classList.toggle('active', i === state.gIndex));
    }

    const inQuote = isModelInQuote(c.id, m.id);

    if (els.gmSummary) {
      const plainLabel = t('quote.plain') || (state.lang === 'tr' ? 'Sade' : state.lang === 'fr' ? 'Uni' : 'Plain');
      const inQuoteText = t('modal.inQuote') || (state.lang === 'tr' ? 'Teklife Eklendi' : state.lang === 'fr' ? 'Ajouté au Devis' : 'Added to Quote');
      els.gmSummary.innerHTML = inQuote
        ? `<strong style="color:var(--gold-deep)">✓ ${esc(inQuoteText)}</strong> — ${esc(m.n[state.lang])} (${esc(plainLabel)})`
        : `<strong>${esc(m.n[state.lang])}</strong> · ${esc(plainLabel)} · ${esc(c[state.lang])}`;
    }

    if (els.gmActions) {
      els.gmActions.innerHTML = `
        <button type="button" class="btn btn-primary" data-gm-quote-direct>
          ${t('ecat.quoteModel')}
        </button>
        <button type="button" class="btn ${inQuote ? 'btn-gold-line active' : 'btn-gold-line'}" data-gm-add-quote>
          ${inQuote ? '✓ ' + (t('modal.inQuote') || 'Teklifte Var') : '+ ' + (t('modal.addQuote') || 'Teklife Ekle')}
        </button>
        <button type="button" class="btn btn-outline" data-gm-close-btn>
          ${t('ui.closeMenu') || 'Kapat'}
        </button>
      `;

      // 1. Fiyat Teklifi İste: Modele teklife ekler VE doğrudan index.html#contact sayfasına yönlendirir
      const directBtn = els.gmActions.querySelector('[data-gm-quote-direct]');
      if (directBtn) {
        directBtn.onclick = () => {
          addModelToQuote(c, m);
          window.location.href = 'index.html#contact';
        };
      }

      // 2. Teklife Ekle / Çıkar: Sayfada kalarak teklif sepetine ekler
      const addBtn = els.gmActions.querySelector('[data-gm-add-quote]');
      if (addBtn) {
        addBtn.onclick = () => {
          if (isModelInQuote(c.id, m.id)) {
            removeModelFromQuote(c, m);
            addBtn.classList.remove('active');
            addBtn.textContent = '+ ' + (t('modal.addQuote') || 'Teklife Ekle');
            toast((t('modal.remove') || 'Kaldırıldı') + ': ' + m.n[state.lang]);
          } else {
            addModelToQuote(c, m);
            addBtn.classList.add('active');
            addBtn.textContent = '✓ ' + (t('modal.inQuote') || 'Teklifte Var');
            toast((t('quote.added') || 'Teklife eklendi:') + ' ' + m.n[state.lang]);
          }
          if (els.gmSummary) {
            const nowIn = isModelInQuote(c.id, m.id);
            const plainLabel = t('quote.plain') || (state.lang === 'tr' ? 'Sade' : state.lang === 'fr' ? 'Uni' : 'Plain');
            const inQuoteText = t('modal.inQuote') || 'Teklife Eklendi';
            els.gmSummary.innerHTML = nowIn
              ? `<strong style="color:var(--gold-deep)">✓ ${esc(inQuoteText)}</strong> — ${esc(m.n[state.lang])} (${esc(plainLabel)})`
              : `<strong>${esc(m.n[state.lang])}</strong> · ${esc(plainLabel)} · ${esc(c[state.lang])}`;
          }
        };
      }

      // 3. Kapat butonu
      const closeBtn = els.gmActions.querySelector('[data-gm-close-btn]');
      if (closeBtn) closeBtn.onclick = closeGroupModal;
    }

    // Katalog sayfasındaki aktif model kartını vurgula
    const wrap = document.querySelector(`[data-thumbs="${c.id}"]`);
    if (wrap) {
      wrap.querySelectorAll('.ecat-model-card').forEach((card, tIdx) => {
        card.classList.toggle('active', tIdx === state.gIndex);
      });
    }
  }

  /* ---------- Evrensel Lightbox (Tam Ekran İnceleme) ---------- */
  function openGroupLightbox() {
    const c = catById(state.group);
    if (!c || !c.models || !c.models.length) return;
    const items = c.models.map((mod) => ({
      src: mod.img,
      title: mod.n[state.lang],
      eyebrow: c[state.lang]
    }));
    openLightbox(items, state.gIndex);
  }

  function openLightbox(list, startIndex) {
    if (!els.siteLightbox || !list || !list.length) return;
    state.lb = {
      open: true,
      list: list,
      index: (typeof startIndex === 'number' && startIndex >= 0 && startIndex < list.length) ? startIndex : 0
    };
    els.siteLightbox.hidden = false;
    renderLightboxItem();
    if (els.lbClose) els.lbClose.focus();
  }

  function closeLightbox() {
    if (!els.siteLightbox) return;
    els.siteLightbox.hidden = true;
    state.lb = null;
  }

  function lbGo(step) {
    if (!state.lb || !state.lb.open || !state.lb.list.length) return;
    const n = state.lb.list.length;
    state.lb.index = ((state.lb.index + step) % n + n) % n;
    renderLightboxItem();
  }

  function renderLightboxItem() {
    if (!state.lb || !state.lb.list.length) return;
    const item = state.lb.list[state.lb.index];
    if (els.lbImg) {
      els.lbImg.src = item.src;
      els.lbImg.alt = item.title || '';
    }
    if (els.lbEyebrow) els.lbEyebrow.textContent = item.eyebrow || '';
    if (els.lbName) els.lbName.textContent = item.title || '';
    if (els.lbCount) els.lbCount.textContent = `${state.lb.index + 1} / ${state.lb.list.length}`;
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

  /* ---------- Dil Yönetimi ---------- */
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
    $$('[data-i18n-aria]').forEach((el) => {
      if (el.classList && el.classList.contains('nav-toggle')) return;
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });
    if (els.navToggle) {
      els.navToggle.setAttribute('aria-label', els.navToggle.getAttribute('aria-expanded') === 'true' ? t('ui.closeMenu') : t('ui.menu'));
    }
    document.title = state.lang === 'tr'
      ? 'E-Katalog — COQ D’OR | Maison de Linge · Koleksiyonlar & Desenler'
      : state.lang === 'fr'
        ? 'E-Catalogue — COQ D’OR | Maison de Linge · Gammes & Dessins'
        : 'E-Catalog — COQ D’OR | Maison de Linge · Collections & Designs';

    $$('.lang-btn').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.lang === state.lang));
    });

    const langCurrent = $('#langCurrent');
    if (langCurrent) langCurrent.textContent = state.lang.toUpperCase();

    renderCategories();
    renderDesigns();
    renderQuoteBadges();

    if (state.group) {
      const c = catById(state.group);
      if (c) {
        if (els.gmGroup) els.gmGroup.textContent = c[state.lang];
        gmGo(state.gIndex);
      }
    }
  }

  /* ---------- Mobil Gezinme (Nav) ---------- */
  function setNav(open) {
    if (!els.navToggle || !els.mobileNav) return;
    els.navToggle.setAttribute('aria-expanded', String(open));
    els.navToggle.setAttribute('aria-label', open ? t('ui.closeMenu') : t('ui.menu'));
    els.mobileNav.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      const first = els.mobileNav.querySelector('a');
      if (first) first.focus();
    }
  }

  function bindNav() {
    if (!els.navToggle || !els.mobileNav) return;
    els.navToggle.onclick = () => {
      const open = els.navToggle.getAttribute('aria-expanded') !== 'true';
      setNav(open);
    };
    els.mobileNav.querySelectorAll('a').forEach((a) => {
      a.onclick = () => setNav(false);
    });

    // Mobil dil dropdown aç/kapa
    const langBtn = $('#langMobileBtn');
    const langDrop = $('#langDropdown');
    if (langBtn && langDrop) {
      langBtn.onclick = (e) => {
        e.stopPropagation();
        const exp = langBtn.getAttribute('aria-expanded') === 'true';
        langBtn.setAttribute('aria-expanded', String(!exp));
        langDrop.hidden = exp;
      };
      document.addEventListener('click', (e) => {
        if (!langBtn.contains(e.target) && !langDrop.contains(e.target)) {
          langBtn.setAttribute('aria-expanded', 'false');
          langDrop.hidden = true;
        }
      });
    }
  }

  /* ---------- URL Hash odaklama (Yalnızca yumuşak scroll, modal AÇMAZ) ---------- */
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

  /* ---------- Başlangıç (Init) ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    Object.assign(els, {
      groupModal: $('#groupModal'),
      gmClose: $('#groupModal [data-gm-close]'),
      gmGroup: $('#gmGroup'),
      gmTitle: $('#gmTitle'),
      gmCount: $('#gmCount'),
      gmSlider: $('#gmSlider'),
      gmTrack: $('#gmTrack'),
      gmDots: $('#gmDots'),
      gmStatus: $('#gmStatus'),
      gmPrev: $('#gmPrev'),
      gmNext: $('#gmNext'),
      gmSummary: $('#gmSummary'),
      gmActions: $('#gmActions'),
      gmDesc: $('#gmDesc'),
      gmZoomBtn: $('#gmZoomBtn'),
      siteLightbox: $('#siteLightbox'),
      lbClose: $('#siteLightbox .lb-close'),
      lbPrev: $('#lbPrev'),
      lbNext: $('#lbNext'),
      lbImg: $('#lbImg'),
      lbEyebrow: $('#lbEyebrow'),
      lbName: $('#lbName'),
      lbCount: $('#lbCount'),
      lbViewport: $('#lbViewport'),
      navToggle: $('.nav-toggle'),
      mobileNav: $('#mobileNav')
    });

    // Group modal backdrop veya close tıklandığında kapat
    $$('[data-gm-close]').forEach((el) => {
      el.addEventListener('click', closeGroupModal);
    });

    // Lightbox backdrop veya close tıklandığında kapat
    $$('[data-lb-close]').forEach((el) => {
      el.addEventListener('click', closeLightbox);
    });
    if (els.lbPrev) els.lbPrev.onclick = (e) => { e.stopPropagation(); lbGo(-1); };
    if (els.lbNext) els.lbNext.onclick = (e) => { e.stopPropagation(); lbGo(1); };

    // Group modal dokunmatik swipe
    if (els.gmSlider) {
      attachSwipe(els.gmSlider, {
        onNext: () => gmGo(state.gIndex + 1),
        onPrev: () => gmGo(state.gIndex - 1),
        onTap: () => openGroupLightbox()
      });
    }

    // Lightbox dokunmatik swipe
    if (els.lbViewport) {
      attachSwipe(els.lbViewport, {
        onNext: () => lbGo(1),
        onPrev: () => lbGo(-1)
      });
    }

    // Klavye kontrolleri
    document.addEventListener('keydown', (e) => {
      if (state.lb && state.lb.open) {
        if (e.key === 'Escape') { closeLightbox(); return; }
        if (e.key === 'ArrowLeft') { lbGo(-1); return; }
        if (e.key === 'ArrowRight') { lbGo(1); return; }
      }
      if (state.group && els.groupModal && els.groupModal.classList.contains('open')) {
        if (e.key === 'Escape') { closeGroupModal(); return; }
        if (e.key === 'ArrowLeft') { gmGo(state.gIndex - 1); return; }
        if (e.key === 'ArrowRight') { gmGo(state.gIndex + 1); return; }
      }
      if (els.navToggle && els.navToggle.getAttribute('aria-expanded') === 'true') {
        if (e.key === 'Escape') { setNav(false); return; }
      }
    });

    // Dil seçicileri
    $$('.lang-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.lang = btn.dataset.lang;
        localStorage.setItem('damira-lang', state.lang);
        applyI18n();
      });
    });

    bindNav();
    window.addEventListener('hashchange', checkUrlHash);

    applyI18n();
  });
})();
