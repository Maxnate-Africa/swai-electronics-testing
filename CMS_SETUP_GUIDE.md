# Integrated CMS Setup Guide

This guide explains how to set up and use the integrated CMS system that uses **Netlify Identity** for authentication with Decap CMS for the Swai Electronics Jekyll site.

## Architecture Overview

The CMS system uses **Netlify Identity** for authentication:

1. **Netlify Identity Authentication** - Secure login managed by Netlify
2. **Decap CMS Dashboard** - Main content management interface (shown after login)
3. **Netlify Git Gateway** - Backend for Decap CMS to connect to GitHub

## Features

- ✅ Secure Netlify Identity authentication
- ✅ No external dependencies (no Firebase needed)
- ✅ Full Decap CMS functionality for content management
- ✅ Automatic deployment to Netlify via GitHub Actions
- ✅ Product management with pricing and sale features
- ✅ Special offers management
- ✅ Site settings configuration
- ✅ Media management with direct image uploads

## Directory Structure

```
swai-electronics/
├── admin/                          # Integrated CMS admin
│   ├── index.html                 # Main entry point (Netlify Identity auth)
│   ├── cms.html                   # Decap CMS dashboard
│   └── config.yml                 # Decap CMS configuration
├── new cms admin/                 # Custom CMS assets (for styling)
│   ├── assets/
│   └── css/
│       └── admin.css
├── .github/
│   └── workflows/
│       └── deploy-netlify.yml     # Auto-deployment workflow
└── scripts/
    └── netlify-build.sh           # Build script
```

## Initial Setup

### 1. Configure Netlify Site

1. Go to [Netlify](https://app.netlify.com)
2. Create a new site from your GitHub repository
3. Configure build settings:
   - **Build command**: `bash scripts/netlify-build.sh`
   - **Publish directory**: `netlify-deploy`
   - **Branch**: `master`

### 2. Enable Netlify Identity & Git Gateway

1. In your Netlify site dashboard, go to **Identity**
2. Click **Enable Identity**
3. Under **Settings** → **Identity** → **Services**, enable **Git Gateway**
4. Under **Registration preferences**, set to **Invite only** (recommended)
5. Invite admin users via email

### 3. Configure GitHub Secrets

For auto-deployment, add these secrets to your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add the following secrets:
   - `NETLIFY_AUTH_TOKEN`: Get from Netlify → User Settings → Applications → Personal access tokens
   - `NETLIFY_SITE_ID`: Get from Netlify → Site settings → Site details → API ID

### 4. Firebase Configuration

The Firebase configuration is already set up in `new cms admin/js/firebase-config.js`. 

**Important**: For production, you should:
1. Review Firebase security rules
2. Set up proper user authentication
3. Consider moving Firebase config to environment variables

### 5. Create Admin Users

#### Firebase Users
1. Go to Firebase Console → Authentication
2. Add users manually or enable email/password authentication
3. Share credentials with admin users

#### Netlify Identity Users
1. In Netlify dashboard, go to Identity tab
2. Click **Invite users**
3. Enter admin email addresses
4. Users will receive invitation emails

## Usage

### Accessing the CMS

1. Navigate to `https://your-site.netlify.app/admin/`
2. Click "Login with Netlify Identity"
3. Enter your Netlify Identity credentials
4. After authentication, Decap CMS dashboard loads automatically
5. Use Decap CMS to manage:
   - Products
   - Special Offers
   - Site Settings

### Managing Content

#### Products
- Add new products with pricing, images, and descriptions
- Set sale prices and discount percentages
- Categorize products
- Toggle featured/in-stock status

#### Special Offers
- Create time-limited promotional offers
- Set start and end dates
- Define priority levels
- Toggle active status

#### Site Settings
- Update site title and description
- Configure analytics (Google Analytics, Meta Pixel)
- Set WhatsApp contact number

### Workflow

1. **Create/Edit Content** in Decap CMS
2. **Review Changes** in the editorial workflow
3. **Publish** to push changes to GitHub
4. **Auto-Deploy** via GitHub Actions to Netlify

## Auto-Deployment

The GitHub Actions workflow (`.github/workflows/deploy-netlify.yml`) automatically:

1. Triggers on push to `master` branch
2. Builds the Jekyll site
3. Prepares the admin interface
4. Deploys to Netlify

### Manual Deployment

To deploy manually from your local machine:

```powershell
# Build the site
bundle exec jekyll build

# Run the deployment script
bash scripts/netlify-build.sh

# Deploy using Netlify CLI (if installed)
netlify deploy --prod --dir=netlify-deploy
```

## Customization

### Modify CMS Fields

Edit `admin/config.yml` to:
- Add new collections
- Modify field types
- Change validation rules
- Add custom widgets

### Customize Authentication UI

Edit `admin/index.html` and `new cms admin/css/admin.css` to:
- Update branding
- Change color scheme
- Modify login form

### Add Preview Templates

In `admin/cms.html`, register custom preview templates:

```javascript
CMS.registerPreviewTemplate("products", ProductPreview);
```

## Security Considerations

### Firebase
- Use environment variables for sensitive config
- Enable Firebase App Check
- Set up proper security rules
- Use HTTPS only

### Netlify
- Keep Identity set to "Invite only"
- Use strong passwords
- Enable 2FA for admin accounts
- Review Git Gateway permissions

### GitHub
- Protect the `master` branch
- Require pull request reviews
- Enable branch protection rules
- Rotate access tokens regularly

## Troubleshooting

### "Unable to load CMS" error
- Check that Git Gateway is enabled in Netlify
- Verify Netlify Identity is configured
- Ensure user is invited and accepted invitation

### Firebase login fails
- Verify Firebase credentials
- Check Firebase console for user status
- Review browser console for errors

### Build fails on Netlify
- Check build logs in Netlify dashboard
- Verify Ruby and Node versions
- Ensure all dependencies are in Gemfile

### Changes not appearing
- Verify changes were committed to GitHub
- Check GitHub Actions workflow status
- Review Netlify deploy logs

## Support

For issues:
1. Check browser console for errors
2. Review Netlify build/deploy logs
3. Check GitHub Actions workflow runs
4. Verify Firebase and Netlify configurations

## Additional Resources

- [Decap CMS Documentation](https://decapcms.org/docs/intro/)
- [Netlify Identity Documentation](https://docs.netlify.com/visitor-access/identity/)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
