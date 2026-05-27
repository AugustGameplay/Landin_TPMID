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
  initFAQ();
  initForms();
  initScrollReveal();
  initPromoBanner();
  initMobileNav();
  initCounters();
  renderWhatsAppFloat();
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
        let icon = '🎬';
        let cls = '';
        if (s.toLowerCase().includes('netflix')) { icon = '🔴'; cls = 'chip-netflix'; }
        else if (s.toLowerCase().includes('hbo')) { icon = '🟣'; cls = 'chip-hbo'; }
        else if (s.toLowerCase().includes('apple')) { icon = '⚫'; cls = 'chip-apple'; }
        const isIncluded = s.toLowerCase().includes('incluido');
        return `<div class="streaming-chip ${cls} ${isIncluded ? 'chip-included' : ''}">${icon} ${s}</div>`;
      }).join('') : '';

      return `
        <div class="pkg-card ${pkg.popular ? 'popular' : ''}">
          ${pkg.popular ? '<div class="pkg-popular-badge">⭐ Más Popular</div>' : ''}

          <div class="pkg-category-label">${catLabel}</div>
          ${pkg.badge ? `<div class="pkg-custom-badge">${pkg.badge}</div>` : ''}

          <div class="pkg-speed-hero">
            <span class="speed-number">${pkg.speed}</span>
            <div class="speed-meta">
              <span class="speed-unit">Mbps</span>
              <span class="speed-type">Simétricos</span>
            </div>
          </div>

          ${pkg.channels ? '<div class="pkg-channels-badge">📺 +190 canales (124 HD)</div>' : ''}

          <div class="pkg-price-section">
            <div class="pkg-main-price-box">
              <div class="price-label-badge">💰 Precio Pronto Pago</div>
              <div class="pkg-price">
                <span class="currency">$</span>
                <span class="amount">${pkg.price}</span>
                <span class="period">/mes</span>
              </div>
              <div class="price-hint">${pkg.promptHint || 'Pagando 5 días antes de tu corte'}</div>
            </div>

            <div class="pkg-secondary-price-box">
              <div class="sec-price-row">
                <span class="sec-label">📋 Precio de lista:</span>
                <span class="sec-val line-through">$${listPrice}/mes</span>
              </div>
              <div class="sec-price-row highlight">
                <span class="sec-label">🎁 A partir del 6° mes:</span>
                <span class="sec-val font-bold">$${loyaltyPrice}/mes</span>
              </div>
              <div class="sec-discount-hint">Ahorro permanente de $${loyaltyDiscount} al mes por lealtad</div>
            </div>
          </div>

          <div class="pkg-includes-section">
            <div class="pkg-includes-title">✅ Incluye:</div>
            <ul class="pkg-features">
              ${pkg.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
          </div>

          ${streamingHTML ? `
            <div class="pkg-streaming-section">
              <div class="pkg-streaming-title">🎬 Plataformas de Streaming:</div>
              <div class="pkg-streaming-chips">
                ${streamingHTML}
              </div>
            </div>
          ` : ''}

          <a href="${waURL}" target="_blank" rel="noopener" class="btn btn-whatsapp pkg-cta-btn">
            💬 ¡Lo quiero! Contratar por WhatsApp
          </a>
        </div>
      `;
    }).join('');
  }

  // Reveal newly injected cards
  setTimeout(revealNewCards, 50);

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
          <a href="tel:${contact.phone}" class="btn btn-secondary btn-sm" title="Teléfono Principal">📞 ${contact.phone}</a>
          ${contact.phoneSecondary ? `<a href="tel:${contact.phoneSecondary}" class="btn btn-secondary btn-sm" title="Teléfono Secundario">📞 ${contact.phoneSecondary}</a>` : ''}
          <a href="${waURL}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-sm">💬 WhatsApp</a>
          <a href="mailto:${contact.email}" class="btn btn-secondary btn-sm">✉️ Email</a>
        </div>
      </div>
    </div>
  `;
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
      <div class="contact-icon">📞</div>
      <div>
        <h4>Teléfonos de atención</h4>
        <p><a href="tel:${contact.phone}">${contact.phone}</a> (Principal)</p>
        ${contact.phoneSecondary ? `<p style="margin-top:4px;"><a href="tel:${contact.phoneSecondary}">${contact.phoneSecondary}</a> (Secundario)</p>` : ''}
      </div>
    </div>
    <div class="contact-info-item">
      <div class="contact-icon">💬</div>
      <div>
        <h4>WhatsApp</h4>
        <p><a href="${waURL}" target="_blank" rel="noopener">Enviar mensaje directo</a></p>
      </div>
    </div>
    <div class="contact-info-item">
      <div class="contact-icon">✉️</div>
      <div>
        <h4>Correo electrónico</h4>
        <p><a href="mailto:${contact.email}">${contact.email}</a></p>
      </div>
    </div>
    <div class="contact-info-item">
      <div class="contact-icon">📍</div>
      <div>
        <h4>Ubicación</h4>
        <p>${contact.address}</p>
      </div>
    </div>
    <div class="contact-info-item">
      <div class="contact-icon">🕐</div>
      <div>
        <h4>Horario de atención</h4>
        <p>${contact.schedule}</p>
      </div>
    </div>
  `;
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
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);
    el.textContent = value.toLocaleString('en-US') + suffix;
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
  toast.innerHTML = `${type === 'success' ? '✅' : '❌'} ${message}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
