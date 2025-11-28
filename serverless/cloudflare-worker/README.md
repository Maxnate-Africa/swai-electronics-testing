# Cloudflare Worker: Write API for GitHub JSON (Swai Electronics)

## Overview

- Purpose: provide a tiny API endpoint that updates JSON files in GitHub on behalf of the static CMS (hosted on GitHub Pages).
- Auth: Clerk JWT verification at the edge (via JWKS). CORS limited to your origins.
- Secret: `GH_TOKEN` (fine-grained PAT) stored as a Worker secret; scope to repo `Maxnate-Africa/swai-electronics-testing` with Contents: Read/Write.

## Deploy

1) Install Wrangler

```bash
npm i -g wrangler
```

2) Auth and publish

```bash
wrangler login
cd serverless/cloudflare-worker
wrangler secret put GH_TOKEN
wrangler publish
```

3) Configure env vars (wrangler.toml or dashboard)

- `CORS_ORIGINS`: add your Pages origin(s), e.g. `https://maxnate-africa.github.io`
- `REQUIRE_AUTH`: `true`
- `CLERK_JWKS_URL`: `https://<instance>.clerk.accounts.dev/.well-known/jwks.json`
- `CLERK_ISSUER` (optional): `https://<instance>.clerk.accounts.dev`

4) Point the CMS to the API

- In the web app `.env`, set:

```env
VITE_WRITE_API_BASE=https://swai-electronics-write-api.<user>.workers.dev
```

- The CMS will automatically send writes to the API; reads continue via GitHub unauthenticated.

## Endpoint

- `POST /update-file`
  - Body JSON: `{ owner, repo, branch, path, content, message, sha }`
  - Returns: `{ ok: true, content, commit }`

## Security Notes

- Use a fine-grained PAT with minimal scope.
- Clerk JWT is verified (Authorization: Bearer) using JWKS.
- Optionally restrict with Cloudflare Access in front of a custom domain.
