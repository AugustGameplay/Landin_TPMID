/* ============================================================
   TOTALPLAY MÉRIDA — Admin Panel Logic (admin.js)
   Now uses async API calls via paquetes.js data layer
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initLogin();
  initTabs();
  initDataManagement();
  initMobileSidebar();
});

/* ==================== LOGIN ==================== */
function initLogin() {
  const loginScreen = document.getElementById('login-screen');
  const adminApp = document.getElementById('admin-app');
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');
  const logoutBtn = document.getElementById('logout-btn');

  // Check session — if we have a token, load data and show app
  if (sessionStorage.getItem('tp_admin_token')) {
    loginScreen.style.display = 'none';
    adminApp.classList.add('active');
    initAdminData();
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pwd = document.getElementById('login-password').value;
      const valid = await verifyPassword(pwd);
      if (valid) {
        loginScreen.style.display = 'none';
        adminApp.classList.add('active');
        initAdminData();
        adminToast('¡Bienvenido al panel de administración!', 'success');
      } else {
        loginError.classList.add('show');
        const errTxt = document.getElementById('login-error-text');
        if (errTxt) errTxt.textContent = 'Contraseña incorrecta. Inténtalo de nuevo.';
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('tp_admin_token');
      location.reload();
    });
  }
}

// Load data from API then render all sections
async function initAdminData() {
  try {
    await loadSiteData();
    loadAllSections();
  } catch (e) {
    adminToast('Error al cargar datos: ' + e.message, 'error');
    loadAllSections(); // try with defaults
  }
}

/* ==================== TABS ==================== */
const TAB_TITLES = {
  'tab-packages':    'Paquetes',
  'tab-contact':     'Contacto',
  'tab-testimonials':'Testimonios',
  'tab-settings':    'Configuración'
};

function initTabs() {
  document.querySelectorAll('.nav-item[data-tab]').forEach(item => {
    item.addEventListener('click', () => {
      const tabId = item.dataset.tab;
      // Update nav active state
      document.querySelectorAll('.nav-item[data-tab]').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      // Update panels
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      const panel = document.getElementById(tabId);
      if (panel) panel.classList.add('active');
      // Update topbar title
      const topbarTitle = document.getElementById('topbar-title');
      if (topbarTitle) topbarTitle.textContent = TAB_TITLES[tabId] || '';
      // Close mobile sidebar
      closeMobileSidebar();
    });
  });
}

/* ==================== MOBILE SIDEBAR ==================== */
function initMobileSidebar() {
  const toggle = document.getElementById('menu-toggle');
  const overlay = document.getElementById('sidebar-overlay');
  if (toggle) toggle.addEventListener('click', () => {
    document.getElementById('admin-sidebar').classList.add('open');
    overlay.classList.add('show');
  });
  if (overlay) overlay.addEventListener('click', closeMobileSidebar);
}
function closeMobileSidebar() {
  const sidebar = document.getElementById('admin-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('show');
}

/* ==================== LOAD ALL ==================== */
function loadAllSections() {
  renderPackageList();
  loadContactForm();
  loadTestimonialsList();
  loadPasswordSection();
  updateStats();
}

/* ==================== STATS ==================== */
function updateStats() {
  const packages = getPackages();
  const active = packages.filter(p => p.active);
  const minPrice = active.length ? Math.min(...active.map(p => p.price)) : 0;
  const elTotal = document.getElementById('stat-total');
  const elActive = document.getElementById('stat-active');
  const elMin = document.getElementById('stat-min-price');
  if (elTotal) elTotal.textContent = packages.length;
  if (elActive) elActive.textContent = active.length;
  if (elMin) elMin.textContent = minPrice ? `$${minPrice}` : '—';
}

/* ==================== PACKAGES ==================== */
function renderPackageList() {
  const list = document.getElementById('pkg-list');
  if (!list) return;
  const packages = getPackages().sort((a, b) => a.order - b.order);
  updateStats();

  if (packages.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
        <p>No hay paquetes. ¡Agrega uno con el botón de arriba!</p>
      </div>`;
    return;
  }

  const typeLabel = { internet: 'Internet', dobleplay: 'Doble Play', tripleplay: 'Triple Play' };

  list.innerHTML = packages.map(pkg => `
    <div class="pkg-list-item" data-id="${pkg.id}">
      <div class="drag-handle" title="Arrastrar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1" fill="currentColor"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="9" cy="19" r="1" fill="currentColor"/><circle cx="15" cy="5" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="19" r="1" fill="currentColor"/></svg>
      </div>
      <div class="pkg-info">
        <h3>${pkg.name}</h3>
        <p>${pkg.speed} Mbps${pkg.channels ? ' · ' + pkg.channels + ' canales' : ''}</p>
      </div>
      <div class="pkg-list-price">$${pkg.price}/mes</div>
      <div class="pkg-badges">
        ${pkg.popular ? '<span class="pkg-badge popular">⭐ Popular</span>' : ''}
        <span class="pkg-badge type">${typeLabel[pkg.type] || pkg.type}</span>
        <span class="pkg-badge ${pkg.active ? 'active' : 'inactive'}">${pkg.active ? '● Activo' : '● Inactivo'}</span>
      </div>
      <div class="pkg-actions">
        <button class="btn-icon blue" onclick="editPackage('${pkg.id}')" title="Editar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="btn-icon" onclick="togglePackage('${pkg.id}')" title="Activar/Desactivar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
        <button class="btn-icon danger" onclick="deletePackage('${pkg.id}')" title="Eliminar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
        </button>
      </div>
    </div>
  `).join('');
}

// Open modal to add/edit package
function openPackageModal(pkg = null) {
  const modal = document.getElementById('pkg-modal');
  const title = document.getElementById('pkg-modal-title');
  const form = document.getElementById('pkg-form');

  title.textContent = pkg ? 'Editar Paquete' : 'Nuevo Paquete';
  form.dataset.editId = pkg ? pkg.id : '';

  document.getElementById('pkg-name').value = pkg ? pkg.name : '';
  document.getElementById('pkg-type').value = pkg ? pkg.type : 'internet';
  document.getElementById('pkg-speed').value = pkg ? pkg.speed : '';
  document.getElementById('pkg-channels').value = pkg ? (pkg.channels || '') : '';
  document.getElementById('pkg-price').value = pkg ? pkg.price : '';
  document.getElementById('pkg-features').value = pkg ? pkg.features.join('\n') : '';
  document.getElementById('pkg-streaming').value = pkg ? (pkg.streaming || []).join(', ') : '';
  document.getElementById('pkg-popular').checked = pkg ? pkg.popular : false;
  document.getElementById('pkg-active').checked = pkg ? pkg.active : true;

  modal.classList.add('active');
}

function closePackageModal() {
  document.getElementById('pkg-modal').classList.remove('active');
}

async function savePackage() {
  const form = document.getElementById('pkg-form');
  const editId = form.dataset.editId;
  const packages = getPackages();

  const name = document.getElementById('pkg-name').value.trim();
  const speed = parseInt(document.getElementById('pkg-speed').value);
  const price = parseInt(document.getElementById('pkg-price').value);

  if (!name || !speed || !price) {
    adminToast('Completa los campos obligatorios (nombre, velocidad, precio)', 'error');
    return;
  }

  const pkgData = {
    id: editId || generateId('pkg'),
    name: name,
    type: document.getElementById('pkg-type').value,
    speed: speed,
    channels: parseInt(document.getElementById('pkg-channels').value) || null,
    price: price,
    features: document.getElementById('pkg-features').value.split('\n').map(f => f.trim()).filter(Boolean),
    streaming: document.getElementById('pkg-streaming').value.split(',').map(s => s.trim()).filter(Boolean),
    popular: document.getElementById('pkg-popular').checked,
    active: document.getElementById('pkg-active').checked,
    order: 0
  };

  if (editId) {
    const idx = packages.findIndex(p => p.id === editId);
    if (idx !== -1) {
      const oldPkg = packages[idx];
      pkgData.order = oldPkg.order;
      pkgData.category = oldPkg.category;
      pkgData.listPrice = oldPkg.listPrice;
      pkgData.loyaltyPrice = oldPkg.loyaltyPrice;
      pkgData.loyaltyDiscount = oldPkg.loyaltyDiscount;
      pkgData.badge = oldPkg.badge;
      packages[idx] = pkgData;
    }
  } else {
    pkgData.order = packages.length;
    pkgData.category = pkgData.channels ? 'tv' : 'internet';
    packages.push(pkgData);
  }

  try {
    await savePackages(packages);
    renderPackageList();
    closePackageModal();
    adminToast(editId ? 'Paquete actualizado ✅' : 'Paquete creado ✅', 'success');
  } catch (e) {
    adminToast('Error al guardar: ' + e.message, 'error');
  }
}

function editPackage(id) {
  const pkg = getPackages().find(p => p.id === id);
  if (pkg) openPackageModal(pkg);
}

async function togglePackage(id) {
  const packages = getPackages();
  const pkg = packages.find(p => p.id === id);
  if (pkg) {
    pkg.active = !pkg.active;
    try {
      await savePackages(packages);
      renderPackageList();
      adminToast(pkg.active ? 'Paquete activado' : 'Paquete desactivado', 'info');
    } catch (e) {
      adminToast('Error: ' + e.message, 'error');
    }
  }
}

async function deletePackage(id) {
  if (!confirm('¿Estás seguro de que quieres eliminar este paquete?')) return;
  const packages = getPackages().filter(p => p.id !== id);
  try {
    await savePackages(packages);
    renderPackageList();
    adminToast('Paquete eliminado', 'success');
  } catch (e) {
    adminToast('Error: ' + e.message, 'error');
  }
}

/* ==================== CONTACT INFO ==================== */
function loadContactForm() {
  const contact = getContact();
  document.getElementById('ct-phone').value = contact.phone || '';
  const phoneSecEl = document.getElementById('ct-phone-sec');
  if (phoneSecEl) phoneSecEl.value = contact.phoneSecondary || '';
  document.getElementById('ct-whatsapp').value = contact.whatsapp || '';
  document.getElementById('ct-email').value = contact.email || '';
  document.getElementById('ct-name').value = contact.advisorName || '';
  document.getElementById('ct-title').value = contact.advisorTitle || '';
  document.getElementById('ct-bio').value = contact.advisorBio || '';
  document.getElementById('ct-schedule').value = contact.schedule || '';
  document.getElementById('ct-address').value = contact.address || '';
  document.getElementById('ct-promo').value = contact.promoText || '';

  // Photo preview
  const preview = document.getElementById('ct-photo-preview');
  if (contact.advisorPhoto) {
    preview.innerHTML = `<img src="${contact.advisorPhoto}" alt="Foto">`;
  } else {
    preview.innerHTML = '👤';
  }

  // Photo upload handler
  const photoInput = document.getElementById('ct-photo-input');
  if (photoInput) {
    photoInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const dataURL = await resizeImage(file, 300);
        preview.innerHTML = `<img src="${dataURL}" alt="Foto">`;
        // Store temporarily in dataset
        preview.dataset.newPhoto = dataURL;
        adminToast('Foto cargada. Guarda los cambios.', 'info');
      } catch (err) {
        adminToast('Error al cargar la imagen', 'error');
      }
    });
  }
}

async function saveContactInfo() {
  const preview = document.getElementById('ct-photo-preview');
  const phoneSecEl = document.getElementById('ct-phone-sec');
  const contact = {
    phone: document.getElementById('ct-phone').value.trim(),
    phoneSecondary: phoneSecEl ? phoneSecEl.value.trim() : '',
    whatsapp: document.getElementById('ct-whatsapp').value.trim(),
    email: document.getElementById('ct-email').value.trim(),
    advisorName: document.getElementById('ct-name').value.trim(),
    advisorTitle: document.getElementById('ct-title').value.trim(),
    advisorBio: document.getElementById('ct-bio').value.trim(),
    advisorPhoto: preview.dataset.newPhoto || getContact().advisorPhoto || null,
    schedule: document.getElementById('ct-schedule').value.trim(),
    address: document.getElementById('ct-address').value.trim(),
    promoText: document.getElementById('ct-promo').value.trim()
  };

  if (!contact.phone || !contact.whatsapp) {
    adminToast('Teléfono y WhatsApp son obligatorios', 'error');
    return;
  }

  try {
    await saveContact(contact);
    adminToast('Información de contacto guardada ✅', 'success');
  } catch (e) {
    adminToast('Error al guardar: ' + e.message, 'error');
  }
}

/* ==================== TESTIMONIALS ==================== */
function loadTestimonialsList() {
  const list = document.getElementById('testimonials-list');
  if (!list) return;
  const testimonials = getTestimonials();

  if (testimonials.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <p>No hay testimonios. ¡Agrega el primero!</p>
      </div>`;
    return;
  }

  list.innerHTML = testimonials.map(t => `
    <div class="pkg-list-item" data-id="${t.id}">
      <div class="drag-handle">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1" fill="currentColor"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="9" cy="19" r="1" fill="currentColor"/><circle cx="15" cy="5" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="19" r="1" fill="currentColor"/></svg>
      </div>
      <div class="pkg-info">
        <h3>${t.name}</h3>
        <p>${t.location || 'Sin ubicación'} · ${'★'.repeat(t.rating)}</p>
      </div>
      <div style="flex:1;font-size:0.82rem;color:var(--gray-500);max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
        "${t.text}"
      </div>
      <div class="pkg-badges">
        <span class="pkg-badge ${t.active ? 'active' : 'inactive'}">${t.active ? '● Activo' : '● Inactivo'}</span>
      </div>
      <div class="pkg-actions">
        <button class="btn-icon blue" onclick="editTestimonial('${t.id}')" title="Editar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="btn-icon" onclick="toggleTestimonial('${t.id}')" title="Activar/Desactivar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
        <button class="btn-icon danger" onclick="deleteTestimonial('${t.id}')" title="Eliminar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
        </button>
      </div>
    </div>
  `).join('');
}

function openTestimonialModal(t = null) {
  const modal = document.getElementById('test-modal');
  const title = document.getElementById('test-modal-title');
  const form = document.getElementById('test-form');

  title.textContent = t ? 'Editar Testimonio' : 'Nuevo Testimonio';
  form.dataset.editId = t ? t.id : '';

  document.getElementById('test-name').value = t ? t.name : '';
  document.getElementById('test-location').value = t ? t.location : '';
  document.getElementById('test-text').value = t ? t.text : '';
  document.getElementById('test-rating').value = t ? t.rating : 5;

  modal.classList.add('active');
}

function closeTestimonialModal() {
  document.getElementById('test-modal').classList.remove('active');
}

async function saveTestimonial() {
  const form = document.getElementById('test-form');
  const editId = form.dataset.editId;
  const testimonials = getTestimonials();

  const name = document.getElementById('test-name').value.trim();
  const text = document.getElementById('test-text').value.trim();
  if (!name || !text) {
    adminToast('Nombre y testimonio son obligatorios', 'error');
    return;
  }

  const tData = {
    id: editId || generateId('test'),
    name: name,
    location: document.getElementById('test-location').value.trim(),
    text: text,
    rating: parseInt(document.getElementById('test-rating').value) || 5,
    active: true
  };

  if (editId) {
    const idx = testimonials.findIndex(t => t.id === editId);
    if (idx !== -1) {
      tData.active = testimonials[idx].active;
      testimonials[idx] = tData;
    }
  } else {
    testimonials.push(tData);
  }

  try {
    await saveTestimonials(testimonials);
    loadTestimonialsList();
    closeTestimonialModal();
    adminToast(editId ? 'Testimonio actualizado ✅' : 'Testimonio creado ✅', 'success');
  } catch (e) {
    adminToast('Error: ' + e.message, 'error');
  }
}

function editTestimonial(id) {
  const t = getTestimonials().find(t => t.id === id);
  if (t) openTestimonialModal(t);
}

async function toggleTestimonial(id) {
  const testimonials = getTestimonials();
  const t = testimonials.find(t => t.id === id);
  if (t) {
    t.active = !t.active;
    try {
      await saveTestimonials(testimonials);
      loadTestimonialsList();
      adminToast(t.active ? 'Testimonio activado' : 'Testimonio desactivado', 'info');
    } catch (e) {
      adminToast('Error: ' + e.message, 'error');
    }
  }
}

async function deleteTestimonial(id) {
  if (!confirm('¿Eliminar este testimonio?')) return;
  const testimonials = getTestimonials().filter(t => t.id !== id);
  try {
    await saveTestimonials(testimonials);
    loadTestimonialsList();
    adminToast('Testimonio eliminado', 'success');
  } catch (e) {
    adminToast('Error: ' + e.message, 'error');
  }
}

/* ==================== PASSWORD ==================== */
function loadPasswordSection() {
  // Nothing to preload, form is static
}

async function handleChangePassword() {
  const newPwd = document.getElementById('new-password').value;
  const confirmPwd = document.getElementById('confirm-password').value;

  if (!newPwd || newPwd.length < 6) {
    adminToast('La contraseña debe tener al menos 6 caracteres', 'error');
    return;
  }
  if (newPwd !== confirmPwd) {
    adminToast('Las contraseñas no coinciden', 'error');
    return;
  }

  try {
    await changePassword(newPwd);
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
    adminToast('Contraseña actualizada ✅', 'success');
  } catch (e) {
    adminToast('Error: ' + e.message, 'error');
  }
}

/* ==================== DATA MANAGEMENT ==================== */
function initDataManagement() {
  const importInput = document.getElementById('import-file');
  if (importInput) {
    importInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const result = await importAllData(ev.target.result);
        if (result.success) {
          adminToast('Datos importados correctamente ✅', 'success');
          loadAllSections();
        } else {
          adminToast('Error al importar: ' + result.error, 'error');
        }
      };
      reader.readAsText(file);
      importInput.value = '';
    });
  }
}

function handleExport() {
  exportAllData();
  adminToast('Datos exportados ✅', 'success');
}

async function handleResetDefaults() {
  if (!confirm('¿Estás seguro? Esto restaurará TODOS los datos a los valores originales. Esta acción no se puede deshacer.')) return;
  try {
    await resetToDefaults();
    loadAllSections();
    adminToast('Datos restaurados a valores predeterminados', 'success');
  } catch (e) {
    adminToast('Error: ' + e.message, 'error');
  }
}

/* ==================== TOAST ==================== */
const TOAST_ICONS = {
  success: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
  error:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  info:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
};

function adminToast(message, type = 'info') {
  let container = document.querySelector('.admin-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'admin-toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `admin-toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${TOAST_ICONS[type] || TOAST_ICONS.info}</div>
    <div class="toast-msg">${message}</div>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = '0.35s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(120%)';
    setTimeout(() => toast.remove(), 350);
  }, 3800);
}
