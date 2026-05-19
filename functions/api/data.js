/* ============================================================
   TOTALPLAY MÉRIDA — Cloudflare Pages Function API
   Handles GET/POST for site data stored in KV
   ============================================================ */

// Default data (same as paquetes.js defaults) — used to seed KV on first request
const DEFAULT_PACKAGES = [
  {
    id: 'pkg-tv-150', name: '150 Megas Simétricos', category: 'tv', type: 'tripleplay',
    speed: 150, channels: null, price: 599, listPrice: 649, loyaltyPrice: 569, loyaltyDiscount: 30,
    features: ['✅ Totalplay TV', '📞 Línea Telefónica y App Totalplay', '🌐 Fibra óptica 100% simétrica'],
    streaming: ['Netflix básico con anuncios (5 meses)', 'HBO Max básico con anuncios (5 meses)', 'Apple TV+ (3 meses)'],
    badge: '', popular: false, active: true, order: 0
  },
  {
    id: 'pkg-tv-250', name: '250 Megas Simétricos', category: 'tv', type: 'tripleplay',
    speed: 250, channels: null, price: 699, listPrice: 749, loyaltyPrice: 669, loyaltyDiscount: 30,
    features: ['✅ Totalplay TV', '📞 Línea Telefónica y App Totalplay', '🌐 Fibra óptica 100% simétrica'],
    streaming: ['Netflix básico con anuncios (5 meses)', 'HBO Max básico con anuncios (5 meses)', 'Apple TV+ (3 meses)'],
    badge: '', popular: false, active: true, order: 1
  },
  {
    id: 'pkg-tv-350', name: '350 Megas Simétricos', category: 'tv', type: 'tripleplay',
    speed: 350, channels: null, price: 799, listPrice: 849, loyaltyPrice: 759, loyaltyDiscount: 40,
    features: ['✅ Totalplay TV', '📞 Línea Telefónica y App Totalplay', '🌐 Fibra óptica 100% simétrica'],
    streaming: ['Netflix básico con anuncios (5 meses)', 'HBO Max básico con anuncios (5 meses)', 'Apple TV+ (3 meses)'],
    badge: '', popular: true, active: true, order: 2
  },
  {
    id: 'pkg-tv-500', name: '500 Megas Simétricos', category: 'tv', type: 'tripleplay',
    speed: 500, channels: 190, price: 999, listPrice: 1049, loyaltyPrice: 949, loyaltyDiscount: 50,
    features: ['✅ Totalplay TV + Nuevo Totalplay TV', '📺 +190 canales (124 HD)', '📞 Línea Telefónica y App Totalplay', '🌐 Fibra óptica 100% simétrica'],
    streaming: ['Netflix básico con anuncios (5 meses)', 'HBO Max básico con anuncios (5 meses)', 'Apple TV+ (3 meses)'],
    badge: '⚽ ¡Paquete futbolero!', popular: false, active: true, order: 3
  },
  {
    id: 'pkg-tv-1000', name: '1000 Megas Simétricos', category: 'tv', type: 'tripleplay',
    speed: 1000, channels: 190, price: 1640, listPrice: 1720, loyaltyPrice: 1540, loyaltyDiscount: 100,
    features: ['✅ Totalplay TV + Nuevo Totalplay TV', '📺 +190 canales (124 HD)', '📞 Línea Telefónica y App Totalplay', '🌐 Fibra óptica simétrica 1 Gbps'],
    streaming: ['Netflix básico con anuncios (INCLUIDO permanente)', 'HBO Max básico con anuncios (INCLUIDO permanente)', 'Apple TV+ (3 meses)'],
    badge: '🔊 ¡Surround incluido!', popular: false, active: true, order: 4
  },
  {
    id: 'pkg-int-150', name: '150 Megas Simétricos', category: 'internet', type: 'internet',
    speed: 150, channels: null, price: 460, listPrice: 510, loyaltyPrice: 440, loyaltyDiscount: 20,
    features: ['📞 Línea Telefónica y App Totalplay', '🌐 Fibra óptica 100% simétrica', '📶 Modem WiFi incluido'],
    streaming: ['Netflix básico con anuncios (3 meses)', 'HBO Max básico con anuncios (3 meses)', 'Apple TV+ (3 meses)'],
    badge: '', popular: false, active: true, order: 5
  },
  {
    id: 'pkg-int-250', name: '250 Megas Simétricos', category: 'internet', type: 'internet',
    speed: 250, channels: null, price: 559, listPrice: 609, loyaltyPrice: 539, loyaltyDiscount: 20,
    features: ['📞 Línea Telefónica y App Totalplay', '🌐 Fibra óptica 100% simétrica', '📶 Modem WiFi incluido'],
    streaming: ['Netflix básico con anuncios (3 meses)', 'HBO Max básico con anuncios (3 meses)', 'Apple TV+ (3 meses)'],
    badge: '', popular: false, active: true, order: 6
  },
  {
    id: 'pkg-int-350', name: '350 Megas Simétricos', category: 'internet', type: 'internet',
    speed: 350, channels: null, price: 669, listPrice: 719, loyaltyPrice: 639, loyaltyDiscount: 30,
    features: ['📞 Línea Telefónica y App Totalplay', '🌐 Fibra óptica 100% simétrica', '📶 Modem WiFi incluido'],
    streaming: ['Netflix básico con anuncios (5 meses)', 'HBO Max básico con anuncios (5 meses)', 'Apple TV+ (3 meses)'],
    badge: '', popular: false, active: true, order: 7
  },
  {
    id: 'pkg-int-500', name: '500 Megas Simétricos', category: 'internet', type: 'internet',
    speed: 500, channels: null, price: 830, listPrice: 880, loyaltyPrice: 770, loyaltyDiscount: 60,
    features: ['📞 Línea Telefónica y App Totalplay', '🌐 Fibra óptica 100% simétrica', '📶 Modem WiFi incluido'],
    streaming: ['Netflix básico con anuncios (5 meses)', 'HBO Max básico con anuncios (5 meses)', 'Apple TV+ (3 meses)'],
    badge: '', popular: false, active: true, order: 8
  },
  {
    id: 'pkg-int-1000', name: '1000 Megas Simétricos', category: 'internet', type: 'internet',
    speed: 1000, channels: null, price: 1470, listPrice: 1550, loyaltyPrice: 1390, loyaltyDiscount: 80,
    features: ['📞 Línea Telefónica y App Totalplay', '🌐 Fibra óptica simétrica 1 Gbps', '📶 Modem WiFi incluido'],
    streaming: ['Netflix básico con anuncios (INCLUIDO permanente)', 'HBO Max básico con anuncios (INCLUIDO permanente)', 'Apple TV+ (3 meses)'],
    badge: '', popular: false, active: true, order: 9
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
  { id: 'test-1', name: 'Carlos M.', location: 'Col. Montebello, Mérida', text: 'Llevamos 6 meses con Totalplay y el servicio ha sido excelente. La velocidad es real y nunca se cae. ¡100% recomendado!', rating: 5, active: true },
  { id: 'test-2', name: 'María G.', location: 'Fracc. Las Américas, Mérida', text: 'La instalación fue rapidísima y el asesor muy amable. Mis hijos pueden hacer videollamadas y ver streaming al mismo tiempo sin problemas.', rating: 5, active: true },
  { id: 'test-3', name: 'Roberto L.', location: 'Col. García Ginerés, Mérida', text: 'Cambié de proveedor a Totalplay y la diferencia es abismal. Internet estable, TV con excelente calidad y buen precio. No me arrepiento.', rating: 5, active: true },
  { id: 'test-4', name: 'Ana P.', location: 'Fracc. Altabrisa, Mérida', text: 'Lo mejor es que incluye HBO Max y varias plataformas. Ya no pago servicios extra de streaming. ¡Todo en un solo paquete!', rating: 4, active: true }
];

const DEFAULT_PASSWORD_HASH = null; // computed on first use

// CORS headers
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
  'Content-Type': 'application/json'
};

// Helper: get value from KV or return default
async function kvGet(kv, key, defaultValue) {
  const val = await kv.get(key, 'json');
  if (val !== null && val !== undefined) return val;
  // Seed the default into KV
  await kv.put(key, JSON.stringify(defaultValue));
  return defaultValue;
}

// ---------- GET: return all site data ----------
export async function onRequestGet(context) {
  const { env } = context;
  const kv = env.TP_DATA;

  try {
    const [packages, contact, testimonials] = await Promise.all([
      kvGet(kv, 'packages', DEFAULT_PACKAGES),
      kvGet(kv, 'contact', DEFAULT_CONTACT),
      kvGet(kv, 'testimonials', DEFAULT_TESTIMONIALS)
    ]);

    return new Response(JSON.stringify({ packages, contact, testimonials }), {
      status: 200,
      headers: CORS
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: CORS
    });
  }
}

// ---------- POST: update specific data ----------
export async function onRequestPost(context) {
  const { request, env } = context;
  const kv = env.TP_DATA;

  try {
    const body = await request.json();
    const { type, data, password, newPassword } = body;

    // Verify admin password for write operations
    if (type !== 'verify_password') {
      const token = request.headers.get('X-Admin-Token');
      if (!token) {
        return new Response(JSON.stringify({ error: 'No autorizado' }), {
          status: 401,
          headers: CORS
        });
      }
      // Verify the token matches stored hash
      const storedHash = await kv.get('admin_password');
      const defaultHash = await hashPassword('totalplay2026');
      const validHash = storedHash || defaultHash;
      if (token !== validHash) {
        return new Response(JSON.stringify({ error: 'Token inválido' }), {
          status: 403,
          headers: CORS
        });
      }
    }

    switch (type) {
      case 'verify_password': {
        const inputHash = await hashPassword(password);
        const storedHash = await kv.get('admin_password');
        const defaultHash = await hashPassword('totalplay2026');
        const valid = inputHash === (storedHash || defaultHash);
        return new Response(JSON.stringify({ valid, token: valid ? inputHash : null }), {
          status: 200,
          headers: CORS
        });
      }

      case 'packages':
        await kv.put('packages', JSON.stringify(data));
        return new Response(JSON.stringify({ success: true }), { status: 200, headers: CORS });

      case 'contact':
        await kv.put('contact', JSON.stringify(data));
        return new Response(JSON.stringify({ success: true }), { status: 200, headers: CORS });

      case 'testimonials':
        await kv.put('testimonials', JSON.stringify(data));
        return new Response(JSON.stringify({ success: true }), { status: 200, headers: CORS });

      case 'change_password': {
        const newHash = await hashPassword(newPassword);
        await kv.put('admin_password', newHash);
        return new Response(JSON.stringify({ success: true, token: newHash }), { status: 200, headers: CORS });
      }

      case 'reset_defaults':
        await kv.put('packages', JSON.stringify(DEFAULT_PACKAGES));
        await kv.put('contact', JSON.stringify(DEFAULT_CONTACT));
        await kv.put('testimonials', JSON.stringify(DEFAULT_TESTIMONIALS));
        return new Response(JSON.stringify({ success: true }), { status: 200, headers: CORS });

      case 'import_all':
        if (data.packages) await kv.put('packages', JSON.stringify(data.packages));
        if (data.contact) await kv.put('contact', JSON.stringify(data.contact));
        if (data.testimonials) await kv.put('testimonials', JSON.stringify(data.testimonials));
        return new Response(JSON.stringify({ success: true }), { status: 200, headers: CORS });

      default:
        return new Response(JSON.stringify({ error: 'Tipo no válido' }), {
          status: 400,
          headers: CORS
        });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: CORS
    });
  }
}

// ---------- OPTIONS: CORS preflight ----------
export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

// ---------- SHA-256 hash ----------
async function hashPassword(pwd) {
  const data = new TextEncoder().encode(pwd);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}
