export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(request, env) });
    }

    try {
      const url = new URL(request.url);
      if (url.pathname === '/update-file' && request.method === 'POST') {
        if (env.REQUIRE_AUTH === 'true') {
          const claims = await verifyClerkJWT(request, env);
          if (!claims) return json({ error: 'Unauthorized' }, 401, request, env);

          // Optional claim filtering by email list
          // Optional allowlist by email or user id
          if (env.ALLOWED_EMAILS || env.ALLOWED_USER_IDS) {
            const allowed = (env.ALLOWED_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
            const allowedUserIds = (env.ALLOWED_USER_IDS || '').split(',').map(s => s.trim()).filter(Boolean);
            const candidateEmails = [];
            // Common single-value claims
            if (claims.email && typeof claims.email === 'string') candidateEmails.push(claims.email);
            if (claims.email_address && typeof claims.email_address === 'string') candidateEmails.push(claims.email_address);
            if (claims.primary_email_address && typeof claims.primary_email_address === 'string') candidateEmails.push(claims.primary_email_address);

            // Arrays of email strings or objects
            if (Array.isArray(claims.email_addresses)) {
              for (const item of claims.email_addresses) {
                if (!item) continue;
                if (typeof item === 'string') {
                  candidateEmails.push(item);
                } else if (typeof item === 'object') {
                  if (typeof item.email === 'string') candidateEmails.push(item.email);
                  if (typeof item.email_address === 'string') candidateEmails.push(item.email_address);
                }
              }
            }

            // Some templates might expose emails under `emails`
            if (Array.isArray(claims.emails)) {
              for (const item of claims.emails) {
                if (!item) continue;
                if (typeof item === 'string') {
                  candidateEmails.push(item);
                } else if (typeof item === 'object') {
                  if (typeof item.email === 'string') candidateEmails.push(item.email);
                  if (typeof item.email_address === 'string') candidateEmails.push(item.email_address);
                }
              }
            }

            const normalized = candidateEmails.map(e => String(e).toLowerCase()).filter(Boolean);
            const emailMatches = allowed.length ? normalized.some(e => allowed.includes(e)) : false;
            const userId = typeof claims.sub === 'string' ? claims.sub : null;
            const idMatches = allowedUserIds.length && userId ? allowedUserIds.includes(userId) : false;

            if ((allowed.length || allowedUserIds.length) && !emailMatches && !idMatches) {
              const debug = env.DEBUG_IDS === 'true' ? { 
                userId, 
                emails: normalized,
                allClaims: claims  // Show all JWT claims for debugging
              } : undefined;
              return json({ error: 'Forbidden: email/user not allowed', ... (debug ? { debug } : {}) }, 403, request, env);
            }
          }
        }

        const body = await request.json();
        const { owner, repo, branch, path, content, message } = body || {};
        let { sha } = body || {};
        if (!owner || !repo || !path || !content || !message) {
          return json({ error: 'Missing fields' }, 400, request, env);
        }

        // If SHA not provided, fetch current file to get it (required for updates)
        if (!sha) {
          const existingRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${branch || 'master'}`, {
            headers: {
              'Authorization': `token ${env.GH_TOKEN}`,
              'Accept': 'application/vnd.github+json',
              'User-Agent': 'Swai-Electronics-CMS-Worker/1.0'
            }
          });
          if (existingRes.ok) {
            const existingData = await existingRes.json();
            sha = existingData.sha;
          }
          // If 404 (new file), sha stays undefined which is fine for creation
        }

        const ghRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${env.GH_TOKEN}`,
            'Accept': 'application/vnd.github+json',
            'Content-Type': 'application/json',
            'User-Agent': 'Swai-Electronics-CMS-Worker/1.0'
          },
          body: JSON.stringify({
            message,
            content: btoa(content),
            branch: branch || 'master',
            sha
          })
        });

        if (!ghRes.ok) {
          const txt = await ghRes.text();
          return json({ error: 'GitHub error', status: ghRes.status, details: txt }, 502, request, env);
        }

        const data = await ghRes.json();
        return json({ ok: true, content: data.content, commit: data.commit.sha }, 200, request, env);
      }

      return json({ error: 'Not found' }, 404, request, env);
    } catch (e) {
      return json({ error: e.message || 'Server error' }, 500, request, env);
    }
  }
}

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '*';
  const allowOrigins = (env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  const allowed = allowOrigins.length ? (allowOrigins.includes(origin) ? origin : allowOrigins[0]) : origin;
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Vary': 'Origin'
  };
}

function json(obj, status, request, env) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...corsHeaders(request, env) } });
}

// ===== Clerk JWT verification (RS256 via JWKS) =====
let JWKS_CACHE = { keys: [], fetchedAt: 0 };

async function getJWKS(env) {
  const url = env.CLERK_JWKS_URL;
  if (!url) throw new Error('CLERK_JWKS_URL not configured');
  const now = Date.now();
  if (JWKS_CACHE.keys.length && now - JWKS_CACHE.fetchedAt < 5 * 60 * 1000) {
    return JWKS_CACHE.keys;
  }
  const res = await fetch(url, { cf: { cacheTtl: 300 } });
  if (!res.ok) throw new Error('Failed to fetch JWKS');
  const data = await res.json();
  JWKS_CACHE = { keys: data.keys || [], fetchedAt: now };
  return JWKS_CACHE.keys;
}

function b64urlToUint8Array(b64url) {
  const pad = '='.repeat((4 - (b64url.length % 4)) % 4);
  const base64 = (b64url.replace(/-/g, '+').replace(/_/g, '/')) + pad;
  const str = atob(base64);
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
  return bytes;
}

async function verifyClerkJWT(request, env) {
  const auth = request.headers.get('Authorization') || '';
  if (!auth.startsWith('Bearer ')) return null;
  const token = auth.slice('Bearer '.length).trim();
  const [encHeader, encPayload, encSignature] = token.split('.');
  if (!encHeader || !encPayload || !encSignature) return null;

  const header = JSON.parse(new TextDecoder().decode(b64urlToUint8Array(encHeader)));
  const payloadBytes = b64urlToUint8Array(encPayload);
  const payload = JSON.parse(new TextDecoder().decode(payloadBytes));

  // exp check
  if (payload.exp && Date.now() / 1000 > payload.exp) return null;

  // Optional issuer check
  if (env.CLERK_ISSUER && payload.iss && !String(payload.iss).startsWith(env.CLERK_ISSUER)) return null;

  const jwks = await getJWKS(env);
  const jwk = jwks.find(k => k.kid === header.kid && k.kty === 'RSA');
  if (!jwk) return null;

  const key = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const signature = b64urlToUint8Array(encSignature);
  const signingInput = new TextEncoder().encode(`${encHeader}.${encPayload}`);
  const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, signature, signingInput);
  return ok ? payload : null;
}
