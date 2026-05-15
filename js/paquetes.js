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
  // ================= TOTALPLAY TV + INTERNET =================
  {
    id: 'pkg-tv-150',
    name: '150 Megas Simétricos',
    category: 'tv',
    type: 'tripleplay',
    speed: 150,
    channels: null,
    price: 599,
    listPrice: 649,
    loyaltyPrice: 569,
    loyaltyDiscount: 30,
    features: [
      '✅ Totalplay TV',
      '📞 Línea Telefónica y App Totalplay',
      '🌐 Fibra óptica 100% simétrica'
    ],
    streaming: ['Netflix básico con anuncios (5 meses)', 'HBO Max básico con anuncios (5 meses)', 'Apple TV+ (3 meses)'],
    badge: '',
    popular: false,
    active: true,
    order: 0
  },
  {
    id: 'pkg-tv-250',
    name: '250 Megas Simétricos',
    category: 'tv',
    type: 'tripleplay',
    speed: 250,
    channels: null,
    price: 699,
    listPrice: 749,
    loyaltyPrice: 669,
    loyaltyDiscount: 30,
    features: [
      '✅ Totalplay TV',
      '📞 Línea Telefónica y App Totalplay',
      '🌐 Fibra óptica 100% simétrica'
    ],
    streaming: ['Netflix básico con anuncios (5 meses)', 'HBO Max básico con anuncios (5 meses)', 'Apple TV+ (3 meses)'],
    badge: '',
    popular: false,
    active: true,
    order: 1
  },
  {
    id: 'pkg-tv-350',
    name: '350 Megas Simétricos',
    category: 'tv',
    type: 'tripleplay',
    speed: 350,
    channels: null,
    price: 799,
    listPrice: 849,
    loyaltyPrice: 759,
    loyaltyDiscount: 40,
    features: [
      '✅ Totalplay TV',
      '📞 Línea Telefónica y App Totalplay',
      '🌐 Fibra óptica 100% simétrica'
    ],
    streaming: ['Netflix básico con anuncios (5 meses)', 'HBO Max básico con anuncios (5 meses)', 'Apple TV+ (3 meses)'],
    badge: '',
    popular: true,
    active: true,
    order: 2
  },
  {
    id: 'pkg-tv-500',
    name: '500 Megas Simétricos',
    category: 'tv',
    type: 'tripleplay',
    speed: 500,
    channels: 190,
    price: 999,
    listPrice: 1049,
    loyaltyPrice: 949,
    loyaltyDiscount: 50,
    features: [
      '✅ Totalplay TV + Nuevo Totalplay TV',
      '📺 +190 canales (124 HD)',
      '📞 Línea Telefónica y App Totalplay',
      '🌐 Fibra óptica 100% simétrica'
    ],
    streaming: ['Netflix básico con anuncios (5 meses)', 'HBO Max básico con anuncios (5 meses)', 'Apple TV+ (3 meses)'],
    badge: '⚽ ¡Paquete futbolero!',
    popular: false,
    active: true,
    order: 3
  },
  {
    id: 'pkg-tv-1000',
    name: '1000 Megas Simétricos',
    category: 'tv',
    type: 'tripleplay',
    speed: 1000,
    channels: 190,
    price: 1640,
    listPrice: 1720,
    loyaltyPrice: 1540,
    loyaltyDiscount: 100,
    features: [
      '✅ Totalplay TV + Nuevo Totalplay TV',
      '📺 +190 canales (124 HD)',
      '📞 Línea Telefónica y App Totalplay',
      '🌐 Fibra óptica simétrica 1 Gbps'
    ],
    streaming: ['Netflix básico con anuncios (INCLUIDO permanente)', 'HBO Max básico con anuncios (INCLUIDO permanente)', 'Apple TV+ (3 meses)'],
    badge: '🔊 ¡Surround incluido!',
    popular: false,
    active: true,
    order: 4
  },

  // ================= TOTALPLAY INTERNET (Solo Internet) =================
  {
    id: 'pkg-int-150',
    name: '150 Megas Simétricos',
    category: 'internet',
    type: 'internet',
    speed: 150,
    channels: null,
    price: 460,
    listPrice: 510,
    loyaltyPrice: 440,
    loyaltyDiscount: 20,
    features: [
      '📞 Línea Telefónica y App Totalplay',
      '🌐 Fibra óptica 100% simétrica',
      '📶 Modem WiFi incluido'
    ],
    streaming: ['Netflix básico con anuncios (3 meses)', 'HBO Max básico con anuncios (3 meses)', 'Apple TV+ (3 meses)'],
    badge: '',
    popular: false,
    active: true,
    order: 5
  },
  {
    id: 'pkg-int-250',
    name: '250 Megas Simétricos',
    category: 'internet',
    type: 'internet',
    speed: 250,
    channels: null,
    price: 559,
    listPrice: 609,
    loyaltyPrice: 539,
    loyaltyDiscount: 20,
    features: [
      '📞 Línea Telefónica y App Totalplay',
      '🌐 Fibra óptica 100% simétrica',
      '📶 Modem WiFi incluido'
    ],
    streaming: ['Netflix básico con anuncios (3 meses)', 'HBO Max básico con anuncios (3 meses)', 'Apple TV+ (3 meses)'],
    badge: '',
    popular: false,
    active: true,
    order: 6
  },
  {
    id: 'pkg-int-350',
    name: '350 Megas Simétricos',
    category: 'internet',
    type: 'internet',
    speed: 350,
    channels: null,
    price: 669,
    listPrice: 719,
    loyaltyPrice: 639,
    loyaltyDiscount: 30,
    features: [
      '📞 Línea Telefónica y App Totalplay',
      '🌐 Fibra óptica 100% simétrica',
      '📶 Modem WiFi incluido'
    ],
    streaming: ['Netflix básico con anuncios (5 meses)', 'HBO Max básico con anuncios (5 meses)', 'Apple TV+ (3 meses)'],
    badge: '',
    popular: false,
    active: true,
    order: 7
  },
  {
    id: 'pkg-int-500',
    name: '500 Megas Simétricos',
    category: 'internet',
    type: 'internet',
    speed: 500,
    channels: null,
    price: 830,
    listPrice: 880,
    loyaltyPrice: 770,
    loyaltyDiscount: 60,
    features: [
      '📞 Línea Telefónica y App Totalplay',
      '🌐 Fibra óptica 100% simétrica',
      '📶 Modem WiFi incluido'
    ],
    streaming: ['Netflix básico con anuncios (5 meses)', 'HBO Max básico con anuncios (5 meses)', 'Apple TV+ (3 meses)'],
    badge: '',
    popular: false,
    active: true,
    order: 8
  },
  {
    id: 'pkg-int-1000',
    name: '1000 Megas Simétricos',
    category: 'internet',
    type: 'internet',
    speed: 1000,
    channels: null,
    price: 1470,
    listPrice: 1550,
    loyaltyPrice: 1390,
    loyaltyDiscount: 80,
    features: [
      '📞 Línea Telefónica y App Totalplay',
      '🌐 Fibra óptica simétrica 1 Gbps',
      '📶 Modem WiFi incluido'
    ],
    streaming: ['Netflix básico con anuncios (INCLUIDO permanente)', 'HBO Max básico con anuncios (INCLUIDO permanente)', 'Apple TV+ (3 meses)'],
    badge: '',
    popular: false,
    active: true,
    order: 9
  }
];

const DEFAULT_CONTACT = {
  phone: '990 194 5673',
  phoneSecondary: '999 433 6427',
  whatsapp: '5219901945673',
  email: 'Totalplay.contrataciones.mid@gmail.com',
  advisorName: 'Tu Asesor Totalplay',
  advisorTitle: 'Distribuidor Autorizado',
  advisorBio: '¡Hola! Soy tu asesor certificado de Totalplay en Mérida. Estoy aquí para ayudarte a encontrar el paquete perfecto para tu hogar o negocio. ¡Contáctame sin compromiso!',
  advisorPhoto: null,
  schedule: 'Lunes a Sábado de 9:00 AM a 8:00 PM',
  address: 'Calle 17 #299, City 32, Fundadora Montello, CP 97113, Mérida Yucatán',
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
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Invalidate old mock data
        if (parsed.some(p => p.name === 'Internet Básico' || p.price === 399)) {
          localStorage.removeItem(DATA_KEYS.packages);
        } else {
          // Force re-save if any package is missing category to fix stale cache
          const needsFix = parsed.some(p => !p.category);
          if (needsFix) {
            localStorage.removeItem(DATA_KEYS.packages);
          } else {
            return parsed.map(p => ({
              ...p,
              listPrice: p.listPrice || (p.price + 50),
              loyaltyPrice: p.loyaltyPrice || (p.price - 30),
              loyaltyDiscount: p.loyaltyDiscount || 30
            }));
          }
        }
      }
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
