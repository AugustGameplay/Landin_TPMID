/* ============================================================
   TOTALPLAY MÉRIDA — Data Layer (paquetes.js)
   Manages packages, contact info, testimonials via localStorage
   ============================================================ */

const DATA_KEYS = {
  packages: 'tp_packages',
  contact: 'tp_contact',
  testimonials: 'tp_testimonials',
  password: 'tp_admin_pwd',
  privacyAccepted: 'tp_privacy'
};

/* ---------- DEFAULT DATA ---------- */

const DEFAULT_PACKAGES = [
  {
    id: 'pkg-1',
    name: 'Internet Básico',
    type: 'internet',
    speed: 100,
    channels: null,
    price: 399,
    features: [
      'Fibra óptica simétrica',
      'Modem WiFi 6 incluido',
      'Sin contrato forzoso',
      'Soporte técnico 24/7'
    ],
    streaming: ['HBO Max'],
    popular: false,
    active: true,
    order: 0
  },
  {
    id: 'pkg-2',
    name: 'Doble Play',
    type: 'dobleplay',
    speed: 200,
    channels: 100,
    price: 549,
    features: [
      'Fibra óptica simétrica',
      'TV HD en todos tus dispositivos',
      'Modem WiFi 6 incluido',
      'Instalación en 24-48 hrs'
    ],
    streaming: ['HBO Max', 'Prime Video'],
    popular: false,
    active: true,
    order: 1
  },
  {
    id: 'pkg-3',
    name: 'Totalplay Plus',
    type: 'tripleplay',
    speed: 300,
    channels: 150,
    price: 699,
    features: [
      'Fibra óptica simétrica',
      '150+ canales HD y 4K',
      'Línea telefónica incluida',
      'WiFi Mesh para toda tu casa',
      'Instalación GRATIS'
    ],
    streaming: ['HBO Max', 'Prime Video', 'Paramount+'],
    popular: true,
    active: true,
    order: 2
  },
  {
    id: 'pkg-4',
    name: 'Totalplay Premium',
    type: 'tripleplay',
    speed: 500,
    channels: 200,
    price: 899,
    features: [
      'Fibra óptica simétrica',
      '200+ canales HD y 4K',
      'Línea telefónica incluida',
      'WiFi Mesh para toda tu casa',
      'Totalplay GO incluido',
      'Instalación GRATIS',
      'Soporte VIP prioritario'
    ],
    streaming: ['HBO Max', 'Prime Video', 'Paramount+', 'Netflix Estándar'],
    popular: false,
    active: true,
    order: 3
  },
  {
    id: 'pkg-5',
    name: 'Totalplay Max',
    type: 'tripleplay',
    speed: 1000,
    channels: 250,
    price: 1299,
    features: [
      '1 Gbps simétrico real',
      '250+ canales HD, 4K y 8K',
      'Línea telefónica ilimitada',
      'WiFi Mesh Pro (3 nodos)',
      'Totalplay GO incluido',
      'Instalación y activación GRATIS',
      'Asesor personal dedicado'
    ],
    streaming: ['HBO Max', 'Prime Video', 'Paramount+', 'Netflix Premium', 'Disney+'],
    popular: false,
    active: true,
    order: 4
  }
];

const DEFAULT_CONTACT = {
  phone: '999-000-0000',
  whatsapp: '5219990000000',
  email: 'contacto@ejemplo.com',
  advisorName: 'Tu Asesor Totalplay',
  advisorTitle: 'Distribuidor Autorizado',
  advisorBio: '¡Hola! Soy tu asesor certificado de Totalplay en Mérida. Estoy aquí para ayudarte a encontrar el paquete perfecto para tu hogar o negocio. ¡Contáctame sin compromiso!',
  advisorPhoto: null,
  schedule: 'Lunes a Sábado: 9:00 AM - 8:00 PM',
  address: 'Mérida, Yucatán, México',
  promoText: '🔥 ¡Instalación GRATIS + Router WiFi 6 de regalo este mes!'
};

const DEFAULT_TESTIMONIALS = [
  {
    id: 'test-1',
    name: 'Carlos M.',
    location: 'Col. Montebello, Mérida',
    text: 'Llevamos 6 meses con Totalplay y el servicio ha sido excelente. La velocidad es real y nunca se cae. ¡100% recomendado!',
    rating: 5,
    active: true
  },
  {
    id: 'test-2',
    name: 'María G.',
    location: 'Fracc. Las Américas, Mérida',
    text: 'La instalación fue rapidísima y el asesor muy amable. Mis hijos pueden hacer videollamadas y ver streaming al mismo tiempo sin problemas.',
    rating: 5,
    active: true
  },
  {
    id: 'test-3',
    name: 'Roberto L.',
    location: 'Col. García Ginerés, Mérida',
    text: 'Cambié de proveedor a Totalplay y la diferencia es abismal. Internet estable, TV con excelente calidad y buen precio. No me arrepiento.',
    rating: 5,
    active: true
  },
  {
    id: 'test-4',
    name: 'Ana P.',
    location: 'Fracc. Altabrisa, Mérida',
    text: 'Lo mejor es que incluye HBO Max y varias plataformas. Ya no pago servicios extra de streaming. ¡Todo en un solo paquete!',
    rating: 4,
    active: true
  }
];

/* ---------- DATA ACCESS FUNCTIONS ---------- */

function getSiteData() {
  return {
    packages: getPackages(),
    contact: getContact(),
    testimonials: getTestimonials()
  };
}

function getPackages() {
  try {
    const stored = localStorage.getItem(DATA_KEYS.packages);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) { /* fall through to defaults */ }
  return JSON.parse(JSON.stringify(DEFAULT_PACKAGES));
}

function savePackages(packages) {
  localStorage.setItem(DATA_KEYS.packages, JSON.stringify(packages));
}

function getContact() {
  try {
    const stored = localStorage.getItem(DATA_KEYS.contact);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.phone) return parsed;
    }
  } catch (e) { /* fall through */ }
  return JSON.parse(JSON.stringify(DEFAULT_CONTACT));
}

function saveContact(contact) {
  localStorage.setItem(DATA_KEYS.contact, JSON.stringify(contact));
}

function getTestimonials() {
  try {
    const stored = localStorage.getItem(DATA_KEYS.testimonials);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) { /* fall through */ }
  return JSON.parse(JSON.stringify(DEFAULT_TESTIMONIALS));
}

function saveTestimonials(testimonials) {
  localStorage.setItem(DATA_KEYS.testimonials, JSON.stringify(testimonials));
}

/* ---------- PASSWORD UTILS ---------- */

async function hashPassword(pwd) {
  const data = new TextEncoder().encode(pwd);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Default password: "totalplay2026"
const DEFAULT_PWD_HASH = null; // will be computed on first use

async function getDefaultHash() {
  return await hashPassword('totalplay2026');
}

async function verifyPassword(input) {
  const inputHash = await hashPassword(input);
  const stored = localStorage.getItem(DATA_KEYS.password);
  if (stored) return inputHash === stored;
  const defHash = await getDefaultHash();
  return inputHash === defHash;
}

async function changePassword(newPwd) {
  const hash = await hashPassword(newPwd);
  localStorage.setItem(DATA_KEYS.password, hash);
}

/* ---------- EXPORT / IMPORT ---------- */

function exportAllData() {
  const data = {
    packages: getPackages(),
    contact: getContact(),
    testimonials: getTestimonials(),
    exportDate: new Date().toISOString(),
    version: '1.0'
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `totalplay-data-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importAllData(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (data.packages) savePackages(data.packages);
    if (data.contact) saveContact(data.contact);
    if (data.testimonials) saveTestimonials(data.testimonials);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/* ---------- UTILITY: Generate unique ID ---------- */
function generateId(prefix = 'item') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/* ---------- UTILITY: Resize image to max dimension ---------- */
function resizeImage(file, maxDim = 400) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > height) {
          if (width > maxDim) { height = (height * maxDim) / width; width = maxDim; }
        } else {
          if (height > maxDim) { width = (width * maxDim) / height; height = maxDim; }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/webp', 0.8));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ---------- WhatsApp URL builder ---------- */
function buildWhatsAppURL(contact, message) {
  const phone = contact.whatsapp.replace(/\D/g, '');
  const text = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${text}`;
}
