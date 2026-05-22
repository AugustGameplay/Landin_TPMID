/* ============================================================
   TOTALPLAY MÉRIDA — Cloudflare Worker Entry Point
   Routes /api/data requests to KV logic; serves everything
   else as static assets via env.ASSETS
   ============================================================ */

import { onRequestGet, onRequestPost, onRequestOptions } from './functions/api/data.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Route API requests
    if (url.pathname === '/api/data') {
      const context = { request, env, ctx };
      if (request.method === 'OPTIONS') return onRequestOptions(context);
      if (request.method === 'GET')     return onRequestGet(context);
      if (request.method === 'POST')    return onRequestPost(context);
      return new Response(JSON.stringify({ error: 'Método no permitido' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Serve static assets for everything else
    return env.ASSETS.fetch(request);
  }
};
