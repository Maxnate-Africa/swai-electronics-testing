# CMS Integration Validation Script
# Run this to check if everything is properly configured

Write-Host "=== Swai Electronics CMS Integration Validator ===" -ForegroundColor Cyan
Write-Host ""

$errors = @()
$warnings = @()
$success = @()

# Check 1: Admin folder structure
Write-Host "Checking admin folder structure..." -ForegroundColor Yellow
if (Test-Path "admin/index.html") {
    $success += "[OK] admin/index.html exists"
} else {
    $errors += "[ERROR] admin/index.html missing"
}

if (Test-Path "admin/cms.html") {
    $success += "[OK] admin/cms.html exists"
} else {
    $errors += "[ERROR] admin/cms.html missing"
}

if (Test-Path "admin/config.yml") {
    $success += "[OK] admin/config.yml exists"
} else {
    $errors += "[ERROR] admin/config.yml missing"
}

# Check 2: Custom CMS assets
Write-Host "Checking custom CMS assets..." -ForegroundColor Yellow
if (Test-Path "new cms admin/css/admin.css") {
    $success += "[OK] Custom CSS exists"
} else {
    $warnings += "[WARN] Custom CSS not found"
}

if (Test-Path "new cms admin/js/firebase-config.js") {
    $success += "[OK] Firebase config exists"
} else {
    $errors += "[ERROR] Firebase config missing"
}

# Check 3: Build scripts
Write-Host "Checking build configuration..." -ForegroundColor Yellow
if (Test-Path "scripts/netlify-build.sh") {
    $content = Get-Content "scripts/netlify-build.sh" -Raw
    if ($content -match "admin") {
        $success += "[OK] Build script configured for admin"
    } else {
        $errors += "[ERROR] Build script not updated for admin"
    }
} else {
    $errors += "[ERROR] netlify-build.sh missing"
}

# Check 4: GitHub Actions workflow
Write-Host "Checking GitHub Actions workflow..." -ForegroundColor Yellow
if (Test-Path ".github/workflows/deploy-netlify.yml") {
    $success += "[OK] Deploy workflow exists"
} else {
    $warnings += "[WARN] GitHub Actions workflow not found"
}

# Check 5: Jekyll config
Write-Host "Checking Jekyll configuration..." -ForegroundColor Yellow
if (Test-Path "_config.yml") {
    $content = Get-Content "_config.yml" -Raw
    if ($content -match "admin") {
        $success += "[OK] _config.yml includes admin folder"
    } else {
        $errors += "[ERROR] _config.yml missing admin include"
    }
} else {
    $errors += "[ERROR] _config.yml missing"
}

# Check 6: Documentation
Write-Host "Checking documentation..." -ForegroundColor Yellow
if (Test-Path "CMS_SETUP_GUIDE.md") {
    $success += "[OK] Setup guide exists"
} else {
    $warnings += "[WARN] Setup guide missing"
}

if (Test-Path "DEPLOYMENT_QUICK_REF.md") {
    $success += "[OK] Quick reference exists"
} else {
    $warnings += "[WARN] Quick reference missing"
}

# Check 7: Ruby and Bundler
Write-Host "Checking Ruby environment..." -ForegroundColor Yellow
try {
    $rubyVersion = ruby --version
    $success += "[OK] Ruby installed: $rubyVersion"
} catch {
    $warnings += "[WARN] Ruby not found in PATH"
}

try {
    $bundlerVersion = bundle --version
    $success += "[OK] Bundler installed: $bundlerVersion"
} catch {
    $warnings += "[WARN] Bundler not found"
}

# Check 8: Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    $success += "[OK] Node.js installed: $nodeVersion"
} catch {
    $warnings += "[WARN] Node.js not found in PATH"
}

# Check 9: Git repository
Write-Host "Checking Git configuration..." -ForegroundColor Yellow
if (Test-Path ".git") {
    $success += "[OK] Git repository initialized"
    
    try {
        $remote = git remote get-url origin 2>$null
        if ($remote) {
            $success += "[OK] Git remote configured: $remote"
        } else {
            $warnings += "[WARN] No Git remote configured"
        }
    } catch {
        $warnings += "[WARN] Unable to check Git remote"
    }
} else {
    $warnings += "[WARN] Not a Git repository"
}

# Print Results
Write-Host ""
Write-Host "=== Validation Results ===" -ForegroundColor Cyan
Write-Host ""

if ($success.Count -gt 0) {
    Write-Host "SUCCESS ($($success.Count)):" -ForegroundColor Green
    foreach ($item in $success) {
        Write-Host "  $item" -ForegroundColor Green
    }
    Write-Host ""
}

if ($warnings.Count -gt 0) {
    Write-Host "WARNINGS ($($warnings.Count)):" -ForegroundColor Yellow
    foreach ($item in $warnings) {
        Write-Host "  $item" -ForegroundColor Yellow
    }
    Write-Host ""
}

if ($errors.Count -gt 0) {
    Write-Host "ERRORS ($($errors.Count)):" -ForegroundColor Red
    foreach ($item in $errors) {
        Write-Host "  $item" -ForegroundColor Red
    }
    Write-Host ""
}

# Final verdict
Write-Host "=== Verdict ===" -ForegroundColor Cyan
if ($errors.Count -eq 0) {
    if ($warnings.Count -eq 0) {
        Write-Host "[SUCCESS] All checks passed! Ready to deploy." -ForegroundColor Green
    } else {
        Write-Host "[SUCCESS] Core setup complete. Check warnings above." -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Test locally: bundle exec jekyll serve" -ForegroundColor White
    Write-Host "2. Visit: http://localhost:4000/admin/" -ForegroundColor White
    Write-Host "3. Push to GitHub: git push origin master" -ForegroundColor White
    Write-Host "4. Configure Netlify (see CMS_SETUP_GUIDE.md)" -ForegroundColor White
} else {
    Write-Host "[FAILED] Setup incomplete. Fix errors above before deploying." -ForegroundColor Red
    Write-Host ""
    Write-Host "See CMS_SETUP_GUIDE.md for detailed instructions." -ForegroundColor Yellow
}

Write-Host ""
