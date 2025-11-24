# Deployment Guide

This project uses dual deployment:
- **Main website**: GitHub Pages (`https://maxnate-africa.github.io/swai-electronics`)
- **CMS Admin**: Netlify (separate subdomain for content management)

## Automatic Deployment

### GitHub Actions Workflow

The `.github/workflows/deploy.yml` automatically:

1. **Builds Jekyll site** on every push to `master` branch
2. **Deploys main site to GitHub Pages** (excluding CMS admin)
3. **Deploys CMS admin to Netlify** (separate instance)

### Required Secrets

Add these secrets to your GitHub repository (`Settings > Secrets and variables > Actions`):

1. **NETLIFY_AUTH_TOKEN**: 
   - Go to Netlify → User Settings → Applications → Personal Access Tokens
   - Create new token and copy it

2. **NETLIFY_SITE_ID**:
   - Create new Netlify site from CLI or dashboard
   - Copy Site ID from Site Settings → General → Site information

## Setup Instructions

### 1. Enable GitHub Pages
1. Go to repository `Settings > Pages`
2. Source: "Deploy from a branch"
3. Branch: `gh-pages` (created automatically by GitHub Actions)
4. Folder: `/ (root)`

### 2. Configure Netlify CMS
1. Create new Netlify site for CMS admin
2. Connect to this GitHub repository
3. Build settings:
   - Build command: `echo "Build completed by GitHub Actions"`
   - Publish directory: `netlify-deploy`
4. Enable Netlify Identity:
   - Go to `Identity` tab in Netlify dashboard
   - Click "Enable Identity"
   - Set registration preferences (invite only recommended)
5. Enable Git Gateway:
   - In Identity tab, click "Settings and usage"
   - Scroll to "Git Gateway" and enable it
   - This connects Netlify CMS to your GitHub repository

### 3. Update CMS Configuration
Update `cms-admin/config.yml`:
```yaml
backend:
  site_domain: your-cms-site.netlify.app  # Your actual Netlify CMS domain
```

## Manual Deployment Testing

Run the included PowerShell script to test deployment locally:
```powershell
.\deploy.ps1
```

This will:
- Build the Jekyll site
- Prepare CMS admin files for Netlify
- Show you what will be deployed where

## Accessing Your Sites

- **Main Website**: `https://maxnate-africa.github.io/swai-electronics`
- **CMS Admin**: `https://your-cms-site.netlify.app`
- **Content Management**: `https://your-cms-site.netlify.app/admin/`

## Troubleshooting

### Jekyll Build Issues
- Check Ruby version compatibility
- Ensure all gems are installed: `bundle install`
- Test locally: `bundle exec jekyll serve`

### GitHub Actions Issues
- Check Actions tab in GitHub repository
- Verify secrets are properly set
- Ensure branch name is correct (`master` vs `main`)

### Netlify CMS Issues
- Verify Identity is enabled
- Check Git Gateway configuration  
- Ensure user has been invited to CMS
- Check browser console for JavaScript errors

### GitHub Pages Issues
- Verify Pages is enabled with correct source
- Check if custom domain settings interfere
- Wait up to 10 minutes for changes to propagate

## Security Notes

- CMS admin is deployed separately for security
- Only authenticated users can access content management
- Main site remains static and fast
- All content changes go through Git workflow