/* ============================================================
   TOTALPLAY MÉRIDA — Landing Page Logic (main.js)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initTopbar();
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
  const packages = getPackages().filter(p => p.active).sort((a, b) => a.order - b.order);
  const contact = getContact();

  grid.innerHTML = packages.map(pkg => {
    const typeLabels = {
      internet: 'Solo Internet',
      dobleplay: 'Doble Play',
      tripleplay: 'Triple Play'
    };
    const waMsg = `¡Hola! Me interesa el paquete *${pkg.name}* de $${pkg.price}/mes. ¿Me pueden dar más información?`;
    const waURL = buildWhatsAppURL(contact, waMsg);

    return `
      <div class="pkg-card ${pkg.popular ? 'popular' : ''} reveal">
        ${pkg.popular ? '<div class="pkg-popular-badge">Más Popular</div>' : ''}
        <div class="pkg-type">${typeLabels[pkg.type] || pkg.type}</div>
        <div class="pkg-name">${pkg.name}</div>
        <div class="pkg-price">
          <span class="currency">$</span>
          <span class="amount">${pkg.price}</span>
          <span class="period">/mes</span>
        </div>
        <div class="pkg-speed">
          ⚡ <strong>${pkg.speed} Mbps</strong>&nbsp;simétricos
          ${pkg.channels ? ` &nbsp;|&nbsp; 📺 ${pkg.channels}+ canales` : ''}
        </div>
        <ul class="pkg-features">
          ${pkg.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
        ${pkg.streaming && pkg.streaming.length > 0 ? `
          <div class="pkg-streaming">
            ${pkg.streaming.map(s => `<span>${s}</span>`).join('')}
          </div>
        ` : ''}
        <a href="${waURL}" target="_blank" rel="noopener" class="btn btn-primary" style="width:100%">
          ¡Lo Quiero! 🚀
        </a>
      </div>
    `;
  }).join('');

  // Also populate select in forms
  const selects = document.querySelectorAll('.pkg-select');
  selects.forEach(sel => {
    const opts = packages.map(p => `<option value="${p.name}">${p.name} — $${p.price}/mes</option>`).join('');
    sel.innerHTML = '<option value="">Selecciona un paquete...</option>' + opts;
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
    <div class="advisor-card reveal">
      <div class="advisor-photo">${photoHTML}</div>
      <div>
        <div class="advisor-name">${contact.advisorName}</div>
        <div class="advisor-title">${contact.advisorTitle}</div>
        <p class="advisor-bio">${contact.advisorBio}</p>
        <div class="advisor-contact">
          <a href="tel:${contact.phone}" class="btn btn-secondary btn-sm">📞 ${contact.phone}</a>
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
  if (!el) return;
  const contact = getContact();
  const waURL = buildWhatsAppURL(contact, '¡Hola! Quisiera contratar un paquete de Totalplay.');

  el.innerHTML = `
    <div class="contact-info-item">
      <div class="contact-icon">📞</div>
      <div>
        <h4>Teléfono</h4>
        <p><a href="tel:${contact.phone}">${contact.phone}</a></p>
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
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
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
  const target = parseInt(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);
    el.textContent = value.toLocaleString() + suffix;
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
