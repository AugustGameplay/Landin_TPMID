/* ============================================================
   TOTALPLAY MÉRIDA — Admin Panel Logic (admin.js)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initLogin();
  initTabs();
  initDataManagement();
});

/* ==================== LOGIN ==================== */
function initLogin() {
  const loginScreen = document.getElementById('login-screen');
  const adminApp = document.getElementById('admin-app');
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');
  const logoutBtn = document.getElementById('logout-btn');

  // Check session
  if (sessionStorage.getItem('tp_admin_auth') === 'true') {
    loginScreen.style.display = 'none';
    adminApp.classList.add('active');
    loadAllSections();
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pwd = document.getElementById('login-password').value;
      const valid = await verifyPassword(pwd);
      if (valid) {
        sessionStorage.setItem('tp_admin_auth', 'true');
        loginScreen.style.display = 'none';
        adminApp.classList.add('active');
        loadAllSections();
        adminToast('¡Bienvenido al panel de administración!', 'success');
      } else {
        loginError.classList.add('show');
        loginError.textContent = '❌ Contraseña incorrecta. Inténtalo de nuevo.';
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('tp_admin_auth');
      location.reload();
    });
  }
}

/* ==================== TABS ==================== */
function initTabs() {
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });
}

/* ==================== LOAD ALL ==================== */
function loadAllSections() {
  renderPackageList();
  loadContactForm();
  loadTestimonialsList();
  loadPasswordSection();
}

/* ==================== PACKAGES ==================== */
function renderPackageList() {
  const list = document.getElementById('pkg-list');
  if (!list) return;
  const packages = getPackages().sort((a, b) => a.order - b.order);

  if (packages.length === 0) {
    list.innerHTML = '<p style="color:var(--gray-500);text-align:center;padding:40px;">No hay paquetes. ¡Agrega uno!</p>';
    return;
  }

  list.innerHTML = packages.map(pkg => `
    <div class="pkg-list-item" data-id="${pkg.id}">
      <div class="drag-handle" title="Arrastrar">⠿</div>
      <div class="pkg-info">
        <h3>${pkg.name}</h3>
        <p>${pkg.speed} Mbps${pkg.channels ? ' · ' + pkg.channels + '+ canales' : ''}</p>
      </div>
      <div class="pkg-list-price">$${pkg.price}/mes</div>
      <span class="pkg-badge ${pkg.popular ? 'popular' : ''}" style="${pkg.popular ? '' : 'display:none'}">${pkg.popular ? '⭐ Popular' : ''}</span>
      <span class="pkg-badge ${pkg.active ? 'active' : 'inactive'}">${pkg.active ? 'Activo' : 'Inactivo'}</span>
      <div class="pkg-actions">
        <button class="btn-icon" onclick="editPackage('${pkg.id}')" title="Editar">✏️</button>
        <button class="btn-icon" onclick="togglePackage('${pkg.id}')" title="Activar/Desactivar">👁️</button>
        <button class="btn-icon" onclick="deletePackage('${pkg.id}')" title="Eliminar">🗑️</button>
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

function savePackage() {
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
      pkgData.order = packages[idx].order;
      packages[idx] = pkgData;
    }
  } else {
    pkgData.order = packages.length;
    packages.push(pkgData);
  }

  savePackages(packages);
  renderPackageList();
  closePackageModal();
  adminToast(editId ? 'Paquete actualizado ✅' : 'Paquete creado ✅', 'success');
}

function editPackage(id) {
  const pkg = getPackages().find(p => p.id === id);
  if (pkg) openPackageModal(pkg);
}

function togglePackage(id) {
  const packages = getPackages();
  const pkg = packages.find(p => p.id === id);
  if (pkg) {
    pkg.active = !pkg.active;
    savePackages(packages);
    renderPackageList();
    adminToast(pkg.active ? 'Paquete activado' : 'Paquete desactivado', 'info');
  }
}

function deletePackage(id) {
  if (!confirm('¿Estás seguro de que quieres eliminar este paquete?')) return;
  const packages = getPackages().filter(p => p.id !== id);
  savePackages(packages);
  renderPackageList();
  adminToast('Paquete eliminado', 'success');
}

/* ==================== CONTACT INFO ==================== */
function loadContactForm() {
  const contact = getContact();
  document.getElementById('ct-phone').value = contact.phone || '';
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

function saveContactInfo() {
  const preview = document.getElementById('ct-photo-preview');
  const contact = {
    phone: document.getElementById('ct-phone').value.trim(),
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

  saveContact(contact);
  adminToast('Información de contacto guardada ✅', 'success');
}

/* ==================== TESTIMONIALS ==================== */
function loadTestimonialsList() {
  const list = document.getElementById('testimonials-list');
  if (!list) return;
  const testimonials = getTestimonials();

  list.innerHTML = testimonials.map(t => `
    <div class="pkg-list-item" data-id="${t.id}">
      <div class="drag-handle">⠿</div>
      <div class="pkg-info">
        <h3>${t.name}</h3>
        <p>${t.location} · ${'★'.repeat(t.rating)}</p>
      </div>
      <div style="flex:1;font-size:0.85rem;color:var(--gray-300);max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
        "${t.text}"
      </div>
      <span class="pkg-badge ${t.active ? 'active' : 'inactive'}">${t.active ? 'Activo' : 'Inactivo'}</span>
      <div class="pkg-actions">
        <button class="btn-icon" onclick="editTestimonial('${t.id}')" title="Editar">✏️</button>
        <button class="btn-icon" onclick="toggleTestimonial('${t.id}')" title="Activar/Desactivar">👁️</button>
        <button class="btn-icon" onclick="deleteTestimonial('${t.id}')" title="Eliminar">🗑️</button>
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

function saveTestimonial() {
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

  saveTestimonials(testimonials);
  loadTestimonialsList();
  closeTestimonialModal();
  adminToast(editId ? 'Testimonio actualizado ✅' : 'Testimonio creado ✅', 'success');
}

function editTestimonial(id) {
  const t = getTestimonials().find(t => t.id === id);
  if (t) openTestimonialModal(t);
}

function toggleTestimonial(id) {
  const testimonials = getTestimonials();
  const t = testimonials.find(t => t.id === id);
  if (t) {
    t.active = !t.active;
    saveTestimonials(testimonials);
    loadTestimonialsList();
    adminToast(t.active ? 'Testimonio activado' : 'Testimonio desactivado', 'info');
  }
}

function deleteTestimonial(id) {
  if (!confirm('¿Eliminar este testimonio?')) return;
  const testimonials = getTestimonials().filter(t => t.id !== id);
  saveTestimonials(testimonials);
  loadTestimonialsList();
  adminToast('Testimonio eliminado', 'success');
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

  await changePassword(newPwd);
  document.getElementById('new-password').value = '';
  document.getElementById('confirm-password').value = '';
  adminToast('Contraseña actualizada ✅', 'success');
}

/* ==================== DATA MANAGEMENT ==================== */
function initDataManagement() {
  const importInput = document.getElementById('import-file');
  if (importInput) {
    importInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = importAllData(ev.target.result);
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

function handleResetDefaults() {
  if (!confirm('¿Estás seguro? Esto restaurará TODOS los datos a los valores originales. Esta acción no se puede deshacer.')) return;
  localStorage.removeItem(DATA_KEYS.packages);
  localStorage.removeItem(DATA_KEYS.contact);
  localStorage.removeItem(DATA_KEYS.testimonials);
  loadAllSections();
  adminToast('Datos restaurados a valores predeterminados', 'success');
}

/* ==================== TOAST ==================== */
function adminToast(message, type = 'info') {
  let container = document.querySelector('.admin-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'admin-toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `admin-toast ${type}`;
  toast.innerHTML = `${icons[type] || ''} ${message}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = '0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
