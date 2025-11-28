# Swai Electronics - React Website + MaxCMS

**Modern E-commerce Website with Integrated CMS**  
Built with React 19, TypeScript, Vite | MaxNate Branding

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Quick Start](#quick-start)
4. [Setup Guide](#setup-guide)
5. [CMS Usage](#cms-usage)
6. [Development](#development)
7. [Deployment](#deployment)
8. [Cloudflare Worker (Writes)](#cloudflare-worker-writes)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Swai Electronics is a premium electronics e-commerce platform in Mwanza, Tanzania, featuring:

- **Public Website**: Product catalog with filtering and special offers
- **MaxCMS**: React-based admin panel for content management
- **GitHub Pages**: Free static hosting
- **Clerk Auth**: Secure authentication (10K users free)
- **GitHub API**: JSON-based data storage

### Tech Stack

```
Frontend:     React 19 + TypeScript + Vite
Hosting:      GitHub Pages (free, unlimited bandwidth)
Auth:         Clerk (free tier: 10K users)
Storage:      GitHub API + JSON files
Styling:      CSS3 (MaxNate teal theme)
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         GitHub Pages (Free)              │
│  https://maxnate-africa.github.io/       │
│         swai-electronics-testing         │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│     React App (Vite + TypeScript)       │
│  - Public website (/products, /offers)  │
│  - Admin CMS panel (/admin)             │
│  - MaxNate branding (#008080)           │
└─────────────────────────────────────────┘
                  ↓
        ┌────────┴────────┐
        ↓                 ↓
┌───────────────┐  ┌──────────────────┐
│ Clerk Auth    │  │  GitHub API      │
│ - 10K free    │  │  - JSON storage  │
│ - Email auth  │  │  - public/data/  │
│ - Social auth │  │  - Auto commits  │
└───────────────┘  └──────────────────┘
```

### Data Structure

```
public/data/
├── products.json    # { "products": [...] }
├── offers.json      # { "offers": [...] }
└── filters.json     # { categories[], labels, toggles }
```

**Important:** CMS manages files in `public/data/` NOT `_data/`

---

## 🚀 Quick Start

### 1. Clone Repository

```powershell
git clone https://github.com/Maxnate-Africa/swai-electronics-testing.git
cd swai-electronics-testing
```

### 2. Install Dependencies

```powershell
npm install
```

### 3. Set Up Environment Variables

Copy example env file:

```powershell
Copy-Item .env.example .env
```

Edit `.env` with your credentials:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_CLERK_KEY_HERE
VITE_GITHUB_TOKEN=ghp_YOUR_GITHUB_PERSONAL_ACCESS_TOKEN
```

### 4. Run Development Server

```powershell
npm run dev
```

Visit:
- **Website**: http://localhost:5173
- **CMS**: http://localhost:5173/admin

---

## 🔧 Setup Guide

### Step 1: Clerk Authentication Setup

1. **Create Clerk Account**
   - Go to [clerk.com](https://clerk.com)
   - Sign up for free account
   - Click "Add application"

2. **Configure Application**
   - Name: **Swai Electronics Admin**
   - Enable: Email + Password
   - Optional: Google, GitHub social auth

3. **Get Publishable Key**
   - Navigate to "API Keys" in Clerk dashboard
   - Copy "Publishable Key" (starts with `pk_test_`)
   - Add to `.env`: `VITE_CLERK_PUBLISHABLE_KEY=pk_test_...`

4. **Add Admin User**
   - In Clerk dashboard, go to "Users"
   - Click "Create user"
   - Add your admin email
   - User will receive verification email

### Step 2: Writes Strategy (Choose One)

Recommended (Background Writes via Cloudflare Worker)
- No tokens in the browser; editors just Save.
- Later section covers deploy details; for now add to `.env`:
  ```env
  VITE_WRITE_API_BASE=https://your-worker-subdomain.workers.dev
  ```

Fallback (Client-Side GitHub Token)
- Use only if you don’t deploy the Worker.
- Create a fine‑grained PAT scoped to repo `Maxnate-Africa/swai-electronics-testing` with Contents: Read/Write.
- Add to `.env`:
  ```env
  VITE_GITHUB_TOKEN=ghp_...
  ```
- The token UI appears in Admin → Settings; stored in session only.

### Step 3: Repository Setup

Your repo is already configured:
- **Owner**: `Maxnate-Africa`
- **Repo**: `swai-electronics-testing`
- **Branch**: `master`

These are hardcoded in `src/services/githubService.ts`

### Step 4: Verify Setup

Run validation script:

```powershell
.\validate-cms-setup.ps1
```

Should show all ✅ checks passing.

---

## 📝 CMS Usage

### Accessing the CMS

1. Navigate to `/admin` (e.g., http://localhost:5173/admin)
2. Sign in with your Clerk account
3. You'll see the MaxCMS dashboard

### Managing Products

**Add Product:**
1. Go to "Products" in sidebar
2. Click "Add New Product"
3. Fill in details:
   - Title, Category, Price
   - Optional: Sale Price, Image URL, Description
   - Toggle: Featured
4. Click "Add Product"
5. ✅ Automatically commits to GitHub

**Edit Product:**
1. Click "Edit" button on product card
2. Modify fields
3. Click "Update Product"

**Delete Product:**
1. Click "Delete" button
2. Confirm deletion

### Managing Offers

**Add Offer:**
1. Go to "Special Offers" in sidebar
2. Click "Add New Offer"
3. Fill in:
   - Title (e.g., "Summer Sale")
   - Discount (e.g., "25% OFF")
   - Expiry date
   - Description (optional)
4. Toggle: Active
5. Click "Add Offer"

### Managing Filters

**Configure Categories:**
1. Go to "Filter Settings" in sidebar
2. Add new category in text input
3. Click "Add Category"
4. Reorder: Use ↑ ↓ buttons
5. Remove: Click × button

**Configure Labels:**
- Toggle "Show All Products" filter
- Edit "All Products" label text
- Toggle "On Sale" filter
- Edit "On Sale" label text

**Save Changes:**
Click "Save Changes" button at top

### Settings & Data Export

**View Statistics:**
- Total Products
- Featured Products
- Active Offers
- Product Categories

**Export Data:**
1. Go to "Settings"
2. Click "Export Data" button
3. Downloads JSON backup file

**Account Info:**
- View your Clerk email
- System information
- CMS version

---

## 💻 Development

### Project Structure

```
swai-electronics-testing/
├── public/
│   ├── data/               # 🎯 CMS manages these files
│   │   ├── products.json
│   │   ├── offers.json
│   │   └── filters.json
│   └── assets/
│
├── src/
│   ├── components/
│   │   ├── AdminLayout.tsx    # CMS sidebar & header
│   │   ├── FilterBar.tsx      # Product filtering
│   │   └── OffersCard.tsx     # Special offers display
│   │
│   ├── contexts/
│   │   └── AdminContext.tsx   # CMS state management
│   │
│   ├── pages/
│   │   ├── Home.tsx           # Public homepage
│   │   ├── ProductDetail.tsx  # Product page
│   │   └── admin/             # 🔒 Protected CMS pages
│   │       ├── Products.tsx
│   │       ├── Offers.tsx
│   │       ├── Filters.tsx
│   │       └── Settings.tsx
│   │
│   ├── services/
│   │   └── githubService.ts   # GitHub API integration
│   │
│   ├── types.ts               # TypeScript interfaces
│   ├── App.tsx                # Routes & Clerk wrapper
│   └── main.tsx               # App entry point
│
├── .env                       # 🔐 Environment variables (gitignored)
├── .env.example               # Template for .env
├── package.json
└── vite.config.ts
```

### Available Scripts

```powershell
# Development
npm run dev              # Start dev server (http://localhost:5173)

# Build
npm run build            # Build for production (outputs to dist/)
npm run preview          # Preview production build

# Linting
npm run lint             # Run ESLint

# Validation
.\validate-cms-setup.ps1 # Check env vars & config
```

### Adding New Features

**Add New Admin Page:**

1. Create page in `src/pages/admin/NewPage.tsx`
2. Add route in `src/App.tsx`:
   ```tsx
   <Route path="/admin/newpage" element={<ProtectedRoute><NewPage /></ProtectedRoute>} />
   ```
3. Add navigation in `src/components/AdminLayout.tsx`:
   ```tsx
   { path: '/admin/newpage', label: 'New Page', icon: ... }
   ```

**Add New Data Type:**

1. Add interface in `src/types.ts`
2. Add functions in `src/services/githubService.ts`
3. Update `src/contexts/AdminContext.tsx`
4. Create management page in `src/pages/admin/`

---

## 🚀 Deployment

### Deploy to GitHub Pages (Site + CMS)

1. **Build Production Version**
   ```powershell
   npm run build
   ```

2. **Configure GitHub Pages**
   - Go to repo Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` (or `master` with `/docs`)
   - Click Save

3. **Deploy**
   ```powershell
   # Install gh-pages package (if not installed)
   npm install -D gh-pages

   # Deploy
   npm run deploy
   ```

4. **Access Site**
   - URL: `https://maxnate-africa.github.io/swai-electronics-testing/`
   - CMS: `https://maxnate-africa.github.io/swai-electronics-testing/admin`
   - Custom domain: Configure in repo settings

### Environment Variables for Production

⚠️ **Important**: Add environment variables to your deployment:

For GitHub Pages builds (gh-pages or GitHub Actions):
- Recommended: set `VITE_WRITE_API_BASE` and avoid embedding a GitHub token in the client.
- If using fallback mode, ensure the token is managed at runtime (Admin → Settings) and never committed.

Example `.env.production` (Worker mode):
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_PRODUCTION_KEY
VITE_WRITE_API_BASE=https://your-worker-subdomain.workers.dev
```

Example `.env.production` (Client fallback mode):
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_PRODUCTION_KEY
VITE_GITHUB_TOKEN=ghp_YOUR_TOKEN
```

Build with production env:
```powershell
npm run build
```

Security Notes:
- `VITE_*` variables are embedded at build time; do not ship secrets unless you intend client-side usage.
- Prefer Worker mode so secrets remain server-side.

---

## ☁️ Cloudflare Worker (Writes)

This API commits JSON updates to GitHub on behalf of the CMS.

### Deploy
```powershell
npm i -g wrangler
wrangler login
cd serverless\cloudflare-worker
wrangler secret put GH_TOKEN   # fine-grained PAT (Contents RW) scoped to repo
wrangler publish               # outputs https://your-worker-subdomain.workers.dev
```

### Configure
- In Worker vars (wrangler.toml or dashboard):
   - `CORS_ORIGINS`: add your Pages origin (e.g., https://maxnate-africa.github.io)
   - `REQUIRE_AUTH`: "true" (auth enforced)
   - `CLERK_JWKS_URL`: https://<instance>.clerk.accounts.dev/.well-known/jwks.json
   - `CLERK_ISSUER` (optional): https://<instance>.clerk.accounts.dev
- In app `.env`:
   ```env
   VITE_WRITE_API_BASE=https://your-worker-subdomain.workers.dev
   ```
- Clerk Dashboard: add your Pages origin and callback URLs.

### Security
- Recommended: enable JWT verification in the Worker using Clerk JWKS.
- Alternatively, add Cloudflare Access in front of a custom domain and check headers.
- Keep the GitHub PAT secret (Worker secret `GH_TOKEN`), scoped to the single repo, Contents RW only.

---

## 🔍 Troubleshooting

### CMS Not Loading Data

**Problem:** CMS shows empty lists

**Solution:**
1. Check `.env` file exists with correct keys
2. Verify GitHub token has `repo` permissions
3. Check browser console for errors
4. Verify file paths in `githubService.ts`:
   ```typescript
   PRODUCTS: 'public/data/products.json'
   OFFERS: 'public/data/offers.json'
   FILTERS: 'public/data/filters.json'
   ```

### Authentication Errors

**Problem:** Can't login to CMS

**Solution:**
1. Verify `VITE_CLERK_PUBLISHABLE_KEY` in `.env`
2. Check Clerk dashboard - application active?
3. Add your email as user in Clerk dashboard
4. Clear browser cache/cookies
5. Try incognito mode

### GitHub API Errors

**Problem:** "Failed to save data" errors

**Solution:**
1. Check GitHub token is valid (not expired)
2. Verify token has `repo` scope
3. Check repo name/owner in `githubService.ts`:
   ```typescript
   const REPO_OWNER = 'Maxnate-Africa';
   const REPO_NAME = 'swai-electronics-testing';
   ```
4. Ensure files exist in `public/data/`

### Build Errors

**Problem:** `npm run build` fails

**Solution:**
1. Delete `node_modules` and reinstall:
   ```powershell
   Remove-Item -Recurse -Force node_modules
   npm install
   ```
2. Clear Vite cache:
   ```powershell
   Remove-Item -Recurse -Force dist
   Remove-Item -Recurse -Force .vite
   ```
3. Check TypeScript errors:
   ```powershell
   npm run lint
   ```

### Data Not Appearing on Website

**Problem:** Products/offers don't show on public site

**Solution:**
1. Check files exist in `public/data/`:
   ```powershell
   Get-ChildItem public/data/
   ```
2. Verify JSON structure:
   - products.json: `{ "products": [...] }`
   - offers.json: `{ "offers": [...] }`
3. Check browser console for fetch errors
4. Restart dev server: `Ctrl+C` then `npm run dev`

---

## 📚 Key Concepts

### Data Flow

```
CMS Edit → GitHub API → Commit to Repo → Public Site Fetches
   ↓                                              ↓
Update UI                                   Display New Data
```

### JSON Structure

**Products:**
```json
{
  "products": [
    {
      "id": "1234567890",
      "title": "Samsung TV 55\"",
      "category": "televisions",
      "price": 850000,
      "sale_price": 750000,
      "image": "/assets/images/tv.jpg",
      "description": "4K Smart TV",
      "featured": true,
      "stock": 10,
      "created_at": "2025-11-27T10:00:00Z",
      "updated_at": "2025-11-27T10:00:00Z"
    }
  ]
}
```

**Offers:**
```json
{
  "offers": [
    {
      "id": "1234567890",
      "title": "Black Friday Sale",
      "discount": "30% OFF",
      "expiry": "2025-12-01",
      "description": "All TVs on sale",
      "active": true,
      "created_at": "2025-11-27T10:00:00Z"
    }
  ]
}
```

**Filters:**
```json
{
  "show_all_link": true,
  "all_label": "All Products",
  "show_sale_filter": true,
  "sale_label": "On Sale",
  "categories": [
    "televisions",
    "audio",
    "home-appliances"
  ]
}
```

---

## 🎨 MaxNate Branding

- **Primary Color**: Teal `#008080`
- **Logo**: MaxNate logo (white version for sidebar)
- **Theme**: Modern, clean, professional
- **Font**: System fonts for performance

### Customizing Branding

**Change Primary Color:**
Edit `src/admin.css` and `src/pages/admin/*.css`:
```css
.admin-sidebar {
  background: #008080; /* Change this */
}
```

**Change Logo:**
Replace `src/assets/maxnate-logo-white.svg`

---

## 📞 Support

**Repository**: [Maxnate-Africa/swai-electronics-testing](https://github.com/Maxnate-Africa/swai-electronics-testing)

**MaxNate Website**: [maxnate.com](https://maxnate.com)

---

## 📄 License

© 2025 Swai Electronics. All rights reserved.  
CMS powered by MaxNate.

---

**Last Updated**: November 27, 2025  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
