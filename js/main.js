/* ============================================================
   TOTALPLAY MÉRIDA — Landing Page Logic (main.js)
   ============================================================ */

let currentCategory = 'tv';
let revealObserver = null;

document.addEventListener('DOMContentLoaded', async () => {
  // Load data from Cloudflare KV API before rendering
  await loadSiteData();

  initTopbar();
  initTabs();
  renderPackages();
  renderTestimonials();
  renderAdvisor();
  renderContactInfo();
  renderContent();
  initFAQ();
  initForms();
  initScrollReveal();
  initPromoBanner();
  initMobileNav();
  // initCounters(); // Counters now init inside renderContent() after DOM is populated
  renderWhatsAppFloat();
  // 2026 UX enhancements
  initScrollProgress();
  initCustomCursor();
  initCardTilt();
  // Initialize Lucide icons (static elements)
  if (window.lucide) lucide.createIcons();
});

/* ---------- CATEGORY TABS ---------- */
function initTabs() {
  const tabs = document.querySelectorAll('.pkg-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.dataset.category;
      
      const addonBanner = document.getElementById('addon-banner-tv');
      if (addonBanner) {
        addonBanner.style.display = (currentCategory === 'tv') ? 'block' : 'none';
      }
      renderPackages();
    });
  });
}

/* ---------- TOPBAR SCROLL ---------- */
function initTopbar() {
  const topbar = document.getElementById('topbar');
  if (!topbar) return;
  window.addEventListener('scroll', () => {
    topbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

/* ---------- RENDER PACKAGES ---------- */
function renderPackages() {
  const grid = document.getElementById('packages-grid');
  if (!grid) return;
  
  const allPackages = getPackages().sort((a, b) => a.order - b.order);
  const filtered = allPackages.filter(p => p.active && p.category === currentCategory);
  
  const contact = getContact();

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--gray-400);">No hay paquetes disponibles en esta categoría en este momento.</p>';
  } else {
    grid.innerHTML = filtered.map(pkg => {
      const waMsg = `¡Hola! Me interesa el paquete *${pkg.name}* ($${pkg.price}/mes, ${pkg.speed} Mbps). ¿Me pueden dar más información?`;
      const waURL = buildWhatsAppURL(contact, waMsg);
      const listPrice = pkg.listPrice || (pkg.price + 50);
      const loyaltyPrice = pkg.loyaltyPrice || (pkg.price - 30);
      const loyaltyDiscount = pkg.loyaltyDiscount || 30;
      const catLabel = pkg.category === 'tv' ? 'TV + Internet' : 'Solo Internet';

      // Build streaming chips
      const streamingHTML = (pkg.streaming && pkg.streaming.length > 0) ? pkg.streaming.map(s => {
      let iconHtml = '<i data-lucide="play" class="streaming-icon"></i>';
        let cls = '';
        if (s.toLowerCase().includes('netflix')) { iconHtml = '<span class="chip-dot chip-dot-netflix"></span>'; cls = 'chip-netflix'; }
        else if (s.toLowerCase().includes('hbo')) { iconHtml = '<span class="chip-dot chip-dot-hbo"></span>'; cls = 'chip-hbo'; }
        else if (s.toLowerCase().includes('apple')) { iconHtml = '<span class="chip-dot chip-dot-apple"></span>'; cls = 'chip-apple'; }
        const isIncluded = s.toLowerCase().includes('incluido');
        return `<div class="streaming-chip ${cls} ${isIncluded ? 'chip-included' : ''}">${iconHtml} ${s}</div>`;
      }).join('') : '';

      return `
        <div class="pkg-card ${pkg.popular ? 'popular' : ''}">
          ${pkg.popular ? '<div class="pkg-popular-badge"><svg class="icon-inline" viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> Más Popular</div>' : ''}

          <div class="pkg-category-label">${catLabel}</div>
          ${pkg.badge ? `<div class="pkg-custom-badge">${pkg.badge}</div>` : ''}

          <div class="pkg-speed-hero">
            <span class="speed-number">${pkg.speed}</span>
            <div class="speed-meta">
              <span class="speed-unit">Mbps</span>
              <span class="speed-type">Simétricos</span>
            </div>
          </div>

          ${pkg.channels ? '<div class="pkg-channels-badge"><i data-lucide="tv-2"></i> +190 canales (124 HD)</div>' : ''}

          <div class="pkg-price-section">
            <div class="pkg-main-price-box">
              <div class="price-label-badge"><i data-lucide="tag"></i> Precio Pronto Pago</div>
              <div class="pkg-price">
                <span class="currency">$</span>
                <span class="amount">${pkg.price}</span>
                <span class="period">/mes</span>
              </div>
              <div class="price-hint">${pkg.promptHint || 'Pagando 5 días antes de tu corte'}</div>
            </div>

            <div class="pkg-secondary-price-box">
              <div class="sec-price-row">
                <span class="sec-label"><i data-lucide="list"></i> Precio de lista:</span>
                <span class="sec-val line-through">$${listPrice}/mes</span>
              </div>
              <div class="sec-price-row highlight">
                <span class="sec-label"><i data-lucide="gift"></i> A partir del 6° mes:</span>
                <span class="sec-val font-bold">$${loyaltyPrice}/mes</span>
              </div>
              <div class="sec-discount-hint">Ahorro permanente de $${loyaltyDiscount} al mes por lealtad</div>
            </div>
          </div>

          <div class="pkg-includes-section">
            <div class="pkg-includes-title"><i data-lucide="check-circle"></i> Incluye:</div>
            <ul class="pkg-features">
              ${pkg.features.map(f => {
                const clean = f.replace(/^[^\wà-ÿ\(]+/, '').trim();
                return `<li><i data-lucide="check" class="feature-check"></i>${clean}</li>`;
              }).join('')}
            </ul>
          </div>

          ${streamingHTML ? `
            <div class="pkg-streaming-section">
              <div class="pkg-streaming-title"><i data-lucide="play-circle"></i> Plataformas de Streaming:</div>
              <div class="pkg-streaming-chips">
                ${streamingHTML}
              </div>
            </div>
          ` : ''}

          <a href="${waURL}" target="_blank" rel="noopener" class="btn btn-whatsapp pkg-cta-btn">
            <i data-lucide="message-circle"></i> ¡Lo quiero! Contratar por WhatsApp
          </a>
        </div>
      `;
    }).join('');
  }

  // Reveal newly injected cards
  setTimeout(revealNewCards, 50);
  // Re-initialize Lucide icons inside packages grid
  if (window.lucide) lucide.createIcons({ nameAttr: 'data-lucide' });

  // Populate select in forms
  const selects = document.querySelectorAll('.pkg-select');
  selects.forEach(sel => {
    const opts = allPackages.filter(p => p.active).map(p => {
      const catLabel = p.category === 'tv' ? 'TV+Internet' : 'Solo Internet';
      return `<option value="${p.name} (${catLabel})">${p.name} (${catLabel}) — $${p.price}/mes</option>`;
    }).join('');
    sel.innerHTML = '<option value="">Selecciona un paquete oficial...</option>' + opts;
  });
}

/* ---------- RENDER TESTIMONIALS ---------- */
function renderTestimonials() {
  const grid = document.getElementById('testimonials-grid');
  if (!grid) return;
  const testimonials = getTestimonials().filter(t => t.active);

  grid.innerHTML = testimonials.map(t => `
    <div class="testimonial-card reveal">
      <div class="testimonial-stars">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</div>
      <p class="testimonial-text">"${t.text}"</p>
      <div class="testimonial-author">${t.name}</div>
      <div class="testimonial-location">${t.location}</div>
    </div>
  `).join('');
}

/* ---------- RENDER ADVISOR ---------- */
function renderAdvisor() {
  const section = document.getElementById('advisor-section');
  if (!section) return;
  const contact = getContact();

  const photoHTML = contact.advisorPhoto
    ? `<img src="${contact.advisorPhoto}" alt="${contact.advisorName}">`
    : '👤';

  const waURL = buildWhatsAppURL(contact, '¡Hola! Quisiera información sobre los paquetes de Totalplay.');

  section.innerHTML = `
    <div class="advisor-card">
      <div class="advisor-photo">${photoHTML}</div>
      <div>
        <div class="advisor-name">${contact.advisorName}</div>
        <div class="advisor-title">${contact.advisorTitle}</div>
        <p class="advisor-bio">${contact.advisorBio}</p>
        <div class="advisor-contact" style="flex-wrap:wrap;gap:8px;">
          <a href="tel:${contact.phone}" class="btn btn-secondary btn-sm" title="Teléfono Principal"><i data-lucide="phone"></i> ${contact.phone}</a>
          ${contact.phoneSecondary ? `<a href="tel:${contact.phoneSecondary}" class="btn btn-secondary btn-sm" title="Teléfono Secundario"><i data-lucide="phone"></i> ${contact.phoneSecondary}</a>` : ''}
          <a href="${waURL}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-sm"><i data-lucide="message-circle"></i> WhatsApp</a>
          <a href="mailto:${contact.email}" class="btn btn-secondary btn-sm"><i data-lucide="mail"></i> Email</a>
        </div>
      </div>
    </div>
  `;
  if (window.lucide) lucide.createIcons();
}

/* ---------- RENDER CONTACT INFO ---------- */
function renderContactInfo() {
  const el = document.getElementById('contact-info');
  const contact = getContact();

  // Update topbar phone dynamically
  const topbarPhone = document.getElementById('topbar-phone');
  if (topbarPhone && contact.phone) topbarPhone.textContent = contact.phone;

  if (!el) return;
  const waURL = buildWhatsAppURL(contact, '¡Hola! Quisiera contratar un paquete de Totalplay.');

  el.innerHTML = `
    <div class="contact-info-item">
      <div class="contact-icon"><i data-lucide="phone"></i></div>
      <div>
        <h4>Teléfonos de atención</h4>
        <p><a href="tel:${contact.phone}">${contact.phone}</a> (Principal)</p>
        ${contact.phoneSecondary ? `<p style="margin-top:4px;"><a href="tel:${contact.phoneSecondary}">${contact.phoneSecondary}</a> (Secundario)</p>` : ''}
      </div>
    </div>
    <div class="contact-info-item">
      <div class="contact-icon"><i data-lucide="message-circle"></i></div>
      <div>
        <h4>WhatsApp</h4>
        <p><a href="${waURL}" target="_blank" rel="noopener">Enviar mensaje directo</a></p>
      </div>
    </div>
    <div class="contact-info-item">
      <div class="contact-icon"><i data-lucide="mail"></i></div>
      <div>
        <h4>Correo electrónico</h4>
        <p><a href="mailto:${contact.email}">${contact.email}</a></p>
      </div>
    </div>
    <div class="contact-info-item">
      <div class="contact-icon"><i data-lucide="map-pin"></i></div>
      <div>
        <h4>Ubicación</h4>
        <p>${contact.address}</p>
      </div>
    </div>
    <div class="contact-info-item">
      <div class="contact-icon"><i data-lucide="clock"></i></div>
      <div>
        <h4>Horario de atención</h4>
        <p>${contact.schedule}</p>
      </div>
    </div>
  `;
  if (window.lucide) lucide.createIcons();
}

/* ---------- RENDER CONTENT (SEO, HERO, FAQ) ---------- */
function renderContent() {
  const c = getContent();
  if (!c) return;

  // SEO
  if (c.seo) {
    if (c.seo.title) document.title = c.seo.title;
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta && c.seo.description) descMeta.content = c.seo.description;
    const keyMeta = document.querySelector('meta[name="keywords"]');
    if (keyMeta && c.seo.keywords) keyMeta.content = c.seo.keywords;
  }

  // Hero
  if (c.hero) {
    const titleEl = document.getElementById('hero-title');
    if (titleEl && c.hero.title) titleEl.innerHTML = c.hero.title;
    
    const subEl = document.getElementById('hero-subtitle');
    if (subEl && c.hero.subtitle) subEl.textContent = c.hero.subtitle;

    // Stats
    const mapStat = (i) => {
      const valEl = document.getElementById(`hero-stat-${i}-val`);
      const lblEl = document.getElementById(`hero-stat-${i}-lbl`);
      if (valEl) {
        valEl.dataset.count = c.hero[`stat${i}Value`] || 0;
        valEl.dataset.suffix = c.hero[`stat${i}Suffix`] || '';
        valEl.dataset.prefix = c.hero[`stat${i}Prefix`] || '';
      }
      if (lblEl && c.hero[`stat${i}Label`]) {
        lblEl.textContent = c.hero[`stat${i}Label`];
      }
    };
    mapStat(1); mapStat(2); mapStat(3);
    initCounters(); // Re-init after DOM populated
  }

  // FAQ
  const faqList = document.getElementById('faq-list-container');
  if (faqList && c.faq) {
    const activeFaqs = c.faq.filter(f => f.active !== false);
    if (activeFaqs.length > 0) {
      faqList.innerHTML = activeFaqs.map(f => `
        <div class="faq-item reveal">
          <button class="faq-question">
            ${f.q}
            <span class="faq-icon">+</span>
          </button>
          <div class="faq-answer">
            <div class="faq-answer-inner">${f.a}</div>
          </div>
        </div>
      `).join('');
    }
  }
}

/* ---------- FAQ ---------- */
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item').forEach(fi => {
        fi.classList.remove('active');
        fi.querySelector('.faq-answer').style.maxHeight = '0';
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ---------- FORMS ---------- */
function initForms() {
  // Hero quick form
  const heroForm = document.getElementById('hero-form');
  if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(heroForm);
      const contact = getContact();
      const msg = `¡Hola! Soy *${data.get('name')}*.\nMi teléfono es: ${data.get('phone')}\nCódigo postal: ${data.get('zip')}\n\n¡Me interesa contratar Totalplay!`;
      const url = buildWhatsAppURL(contact, msg);
      window.open(url, '_blank');
      showToast('¡Mensaje enviado! Te contactaremos pronto. 🎉', 'success');
      heroForm.reset();
    });
  }

  // Full contact form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(contactForm);
      const contact = getContact();
      const pkg = data.get('package') ? `\nPaquete de interés: *${data.get('package')}*` : '';
      const msg = `¡Hola! Soy *${data.get('fullname')}*.
📞 ${data.get('fullphone')}
✉️ ${data.get('fullemail')}
📍 CP: ${data.get('fullzip')}${pkg}
💬 ${data.get('message') || 'Me interesa contratar Totalplay'}`;
      const url = buildWhatsAppURL(contact, msg);
      window.open(url, '_blank');
      showToast('¡Formulario enviado por WhatsApp! 🎉', 'success');
      contactForm.reset();
    });
  }
}

/* ---------- SCROLL REVEAL ---------- */
function initScrollReveal() {
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

/* Re-observe any newly rendered .reveal elements (e.g. after tab switch) */
function revealNewCards() {
  if (!revealObserver) return;
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    revealObserver.observe(el);
  });
  // Also immediately show cards already in viewport
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    }
  });
}

/* ---------- PROMO BANNER ---------- */
function initPromoBanner() {
  const banner = document.getElementById('promo-banner');
  if (!banner) return;
  const contact = getContact();
  const textEl = banner.querySelector('.promo-text');
  if (textEl && contact.promoText) {
    textEl.textContent = contact.promoText;
  }

  const closeBtn = banner.querySelector('.promo-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      banner.style.display = 'none';
      document.getElementById('topbar').style.top = '0';
      document.querySelector('.hero').style.paddingTop = '64px';
    });
  }
}

/* ---------- MOBILE NAV ---------- */
function initMobileNav() {
  const btn = document.getElementById('mobile-menu-btn');
  const nav = document.getElementById('mobile-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => nav.classList.add('open'));

  nav.querySelectorAll('a, .mobile-nav-close').forEach(el => {
    el.addEventListener('click', () => nav.classList.remove('open'));
  });
}

/* ---------- COUNTERS ---------- */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count.replace(/,/g, ''));
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);
    el.textContent = prefix + value.toLocaleString('en-US') + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

/* ---------- WHATSAPP FLOAT ---------- */
function renderWhatsAppFloat() {
  const el = document.getElementById('whatsapp-float');
  if (!el) return;
  const contact = getContact();
  const url = buildWhatsAppURL(contact, '¡Hola! Quisiera información sobre los paquetes de Totalplay en Mérida.');
  el.href = url;
}

/* ---------- TOAST ---------- */
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `${type === 'success' ? '<i data-lucide="check-circle" class="icon-toast"></i>' : '<i data-lucide="x-circle" class="icon-toast"></i>'} ${message}`;
  container.appendChild(toast);
  if (window.lucide) lucide.createIcons();
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ---------- SCROLL PROGRESS BAR ---------- */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  const update = () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total <= 0) return;
    bar.style.width = ((window.scrollY / total) * 100) + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ---------- CUSTOM CURSOR ---------- */
function initCustomCursor() {
  // Only on pointer devices (desktop)
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const dot = document.getElementById('cursor-dot');
  const orb = document.getElementById('cursor-orb');
  if (!dot || !orb) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let orbX   = mouseX;
  let orbY   = mouseY;
  let rafId  = null;

  // Instantly move the dot
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Lag the orb with lerp
  function animateOrb() {
    orbX += (mouseX - orbX) * 0.10;
    orbY += (mouseY - orbY) * 0.10;
    orb.style.left = orbX + 'px';
    orb.style.top  = orbY + 'px';
    rafId = requestAnimationFrame(animateOrb);
  }
  animateOrb();

  // Expand orb on interactive elements
  const hoverTargets = 'a, button, .pkg-card, .btn, .faq-question, .pkg-tab-btn, input, select, textarea';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) orb.classList.add('expanded');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) orb.classList.remove('expanded');
  });

  // Shrink on click
  document.addEventListener('mousedown', () => orb.classList.add('clicking'));
  document.addEventListener('mouseup',   () => orb.classList.remove('clicking'));

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    orb.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    orb.style.opacity = '1';
  });
}

/* ---------- 3D TILT ON PACKAGE CARDS ---------- */
function initCardTilt() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  // Event delegation so it works after tab switches / re-renders
  document.addEventListener('mousemove', (e) => {
    const card = e.target.closest('#packages-grid .pkg-card');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;  // -0.5 → 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform =
      `perspective(900px) rotateX(${y * -6}deg) rotateY(${x * 6}deg) translateY(-6px) scale(1.01)`;
  });

  document.addEventListener('mouseout', (e) => {
    const card = e.target.closest('#packages-grid .pkg-card');
    if (card && !card.contains(e.relatedTarget)) {
      card.style.transform = '';
    }
  });
}
