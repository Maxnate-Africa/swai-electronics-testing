# Quick Deployment Reference

## Prerequisites Checklist

- [ ] GitHub repository set up
- [ ] Netlify account created
- [ ] Firebase project configured
- [ ] Ruby 3.2.2 installed
- [ ] Node.js 18+ installed
- [ ] Bundler installed (`gem install bundler`)

## Netlify Configuration

### Required Settings

1. **Build Settings**:
   ```
   Build command: bash scripts/netlify-build.sh
   Publish directory: netlify-deploy
   Branch: master
   ```

2. **Environment Variables** (if needed):
   ```
   JEKYLL_ENV=production
   NODE_VERSION=18
   RUBY_VERSION=3.2.2
   ```

3. **Identity Settings**:
   - Enable Netlify Identity
   - Enable Git Gateway
   - Set registration to "Invite only"

### GitHub Secrets (for Actions)

Add to repository Settings → Secrets:

- `NETLIFY_AUTH_TOKEN`: From Netlify User Settings → Applications
- `NETLIFY_SITE_ID`: From Site Settings → Site details → API ID

## Manual Build & Deploy

### Local Testing

```powershell
# Install dependencies
bundle install

# Build site
bundle exec jekyll serve

# Access at http://localhost:4000
# Admin at http://localhost:4000/admin/
```

### Build for Production

```powershell
# Set environment
$env:JEKYLL_ENV="production"

# Build
bundle exec jekyll build

# Prepare deployment
bash scripts/netlify-build.sh

# Check output
ls netlify-deploy
```

### Deploy to Netlify (CLI)

```powershell
# Install Netlify CLI (if not already)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link site (first time only)
netlify link

# Deploy
netlify deploy --prod --dir=netlify-deploy
```

## Automatic Deployment

Push to `master` branch triggers GitHub Actions:

```powershell
git add .
git commit -m "Update content"
git push origin master
```

Monitor deployment:
- GitHub: Actions tab
- Netlify: Deploys tab

## CMS Access

### Admin URL
```
https://your-site.netlify.app/admin/
```

### Login Flow
1. Enter Firebase credentials
2. Wait for authentication
3. Decap CMS loads automatically

## Quick Fixes

### CMS won't load
```powershell
# Check Netlify Identity is enabled
# Verify Git Gateway is active
# Ensure user is invited in Identity
```

### Build fails
```powershell
# Clear cache
rm -rf _site
rm -rf .jekyll-cache

# Reinstall dependencies
rm -rf vendor
bundle install

# Rebuild
bundle exec jekyll build
```

### Authentication issues
```
# Check Firebase console for user status
# Verify firebase-config.js has correct credentials
# Clear browser cache and cookies
```

## File Locations

| Component | Path |
|-----------|------|
| CMS Entry Point | `/admin/index.html` |
| CMS Dashboard | `/admin/cms.html` |
| CMS Config | `/admin/config.yml` |
| Firebase Config | `/new cms admin/js/firebase-config.js` |
| Build Script | `/scripts/netlify-build.sh` |
| Deploy Workflow | `/.github/workflows/deploy-netlify.yml` |

## Status Checks

### Verify Jekyll Build
```powershell
bundle exec jekyll build
# Should create _site directory with admin folder
```

### Verify Admin Files
```powershell
ls _site/admin
# Should show: index.html, cms.html, config.yml
```

### Verify Netlify Deploy
```powershell
ls netlify-deploy
# Should show: index.html, cms.html, config.yml, new cms admin/, assets/
```

## Common Commands

```powershell
# Start development server
bundle exec jekyll serve --livereload

# Build for production
JEKYLL_ENV=production bundle exec jekyll build

# Run build script
bash scripts/netlify-build.sh

# Deploy to Netlify
netlify deploy --prod --dir=netlify-deploy

# View Netlify logs
netlify logs

# Open Netlify dashboard
netlify open
```

## Support Links

- [CMS Setup Guide](./CMS_SETUP_GUIDE.md)
- [Netlify Dashboard](https://app.netlify.com)
- [Firebase Console](https://console.firebase.google.com)
- [GitHub Actions](https://github.com/[YOUR-REPO]/actions)
