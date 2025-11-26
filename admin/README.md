# Admin Interface

This directory contains the integrated CMS admin interface for Swai Electronics.

## Components

### index.html
Main entry point with Firebase authentication wrapper. Users log in here before accessing the CMS.

### cms.html
Decap CMS dashboard loaded after successful authentication.

### config.yml
Decap CMS configuration defining collections, fields, and backend settings.

## Access

**URL**: `/admin/`

**Login**: Firebase email/password authentication

## Features

- Secure Firebase authentication layer
- Full Decap CMS functionality
- Product management
- Special offers management
- Site settings configuration
- Media uploads

## Architecture

```
User Request → index.html (Firebase Auth) → cms.html (Decap CMS) → Git Gateway → GitHub
```

## Configuration

Edit `config.yml` to modify:
- Collections and fields
- Backend settings
- Media folder paths
- Workflow settings

## Security

- Firebase authentication required
- Netlify Identity + Git Gateway for GitHub access
- Invite-only user registration
- HTTPS only

For detailed setup instructions, see [CMS_SETUP_GUIDE.md](../CMS_SETUP_GUIDE.md)
