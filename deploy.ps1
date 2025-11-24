# Deploy script for testing GitHub Actions locally

Write-Host "Building Jekyll site..." -ForegroundColor Green
bundle exec jekyll build --trace

if ($LASTEXITCODE -eq 0) {
    Write-Host "Jekyll build successful!" -ForegroundColor Green
    
    Write-Host "Preparing CMS admin for Netlify..." -ForegroundColor Yellow
    
    # Create netlify-deploy directory
    if (Test-Path "netlify-deploy") {
        Remove-Item "netlify-deploy" -Recurse -Force
    }
    New-Item -ItemType Directory -Path "netlify-deploy" -Force | Out-Null
    
    # Copy CMS admin files
    if (Test-Path "_site\cms-admin") {
        Copy-Item "_site\cms-admin\*" "netlify-deploy\" -Recurse -Force
        Write-Host "CMS admin files copied" -ForegroundColor Green
    }
    
    # Copy necessary assets
    New-Item -ItemType Directory -Path "netlify-deploy\assets" -Force | Out-Null
    if (Test-Path "_site\assets\css") {
        Copy-Item "_site\assets\css" "netlify-deploy\assets\" -Recurse -Force
        Write-Host "CSS assets copied" -ForegroundColor Green
    }
    if (Test-Path "_site\assets\images") {
        Copy-Item "_site\assets\images" "netlify-deploy\assets\" -Recurse -Force
        Write-Host "Image assets copied" -ForegroundColor Green
    }
    
    Write-Host "Deployment preparation complete!" -ForegroundColor Green
    Write-Host "  - Main site: _site/ (for GitHub Pages)" -ForegroundColor Cyan
    Write-Host "  - CMS admin: netlify-deploy/ (for Netlify)" -ForegroundColor Cyan
} else {
    Write-Host "Jekyll build failed!" -ForegroundColor Red
    exit 1
}