# SWAI Electronics - E-commerce Website

A modern, responsive e-commerce website for SWAI Electronics built with Jekyll and designed for electronics retail business in Tanzania.

## 🚀 Features

- **Modern Design**: Clean, professional layout with SWAI branding
- **Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Product Catalog**: Organized by categories (Televisions, Audio, Home Appliances)
- **Quick View**: Detailed product information in modal dialogs
- **WhatsApp Integration**: Direct ordering through WhatsApp for each product
- **Search & Filter**: Product search and category filtering
- **Sale System**: Support for sale prices and promotional offers
- **Fast Performance**: Optimized for quick loading and smooth user experience

## 📦 Product Categories

### 📺 Televisions
- LG 55" OLED
- Samsung 55" UHD 4K
- Samsung 65" QLED
- Sony 50" BRAVIA

### 🎵 Audio
- Apple AirPods Pro
- Bose QuietComfort 45
- Samsung Soundbar Q600B
- Sony WH-1000XM5

### 🏠 Home Appliances
- Hisense Fridge 200L
- Philips Air Fryer
- Samsung Washing Machine
- Whirlpool Refrigerator

## 🛠️ Technology Stack

- **Jekyll**: Static site generator
- **Liquid**: Templating language
- **SCSS/CSS**: Styling and responsive design
- **JavaScript**: Interactive features and functionality
- **HTML5**: Modern markup

## 🏃‍♂️ Quick Start

### Prerequisites
- Ruby (3.0 or higher)
- Bundler gem
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd swai-electronics
   ```

2. **Install dependencies**
   ```bash
   bundle install
   ```

3. **Run the development server**
   ```bash
   bundle exec jekyll serve --host 0.0.0.0 --port 4000 --livereload
   ```

4. **Open in browser**
   Navigate to `http://localhost:4000`

## 📁 Project Structure

```
swai-electronics/
├── _config.yml          # Jekyll configuration
├── _layouts/            # Page layouts
│   ├── default.html
│   └── product.html
├── _includes/           # Reusable components
│   ├── head.html
│   ├── sidebar.html
│   └── trust.html
├── _products/           # Product data files
│   ├── lg-55-oled.md
│   ├── samsung-65-qled.md
│   └── ...
├── _offers/             # Sale/offer data
├── _plugins/            # Custom Jekyll plugins
├── assets/              # Static assets
│   ├── css/
│   └── images/
├── cms-admin/           # CMS configuration
├── index.html           # Homepage
└── README.md           # This file
```

## 📝 Content Management

### Adding Products

1. Create a new `.md` file in `_products/` directory
2. Use the following front matter structure:

```yaml
---
title: "Product Name"
price: 1000000
category: televisions # or audio, home-appliances
image: /assets/images/products/product-image.png
whatsapp_message: "I'm interested in Product Name"
short_description: "Brief product description"
long_description: >
  Detailed product description with features and benefits.
key_features:
  - "Feature 1"
  - "Feature 2" 
  - "Feature 3"
specs:
  - label: "Screen Size"
    value: "55 inches"
  - label: "Resolution"
    value: "4K UHD"
---
```

### Sale Prices

Add sale pricing using either:

**Method 1: Direct fields**
```yaml
price: 1000000
sale_price: 850000
```

**Method 2: Pricing info object**
```yaml
pricing_info:
  price: 1000000
  sale_price: 850000
  sale_start: 2025-11-20T00:00:00.000Z
  sale_end: 2025-12-31T23:59:59.000Z
```

## 🎨 Customization

### Colors & Branding
- Main brand color: `#E60000` (SWAI Red)
- Edit `assets/css/style.css` for styling changes
- Update sidebar content in `_includes/sidebar.html`

### WhatsApp Integration
- Configure phone number in `_config.yml`:
```yaml
whatsapp_phone: "255123456789"
```

### Categories
Supported categories:
- `televisions`
- `audio`
- `home-appliances`

## 📱 Mobile Optimization

- Responsive grid layout
- Touch-friendly interface
- Optimized images with WebP support
- Mobile-first CSS approach

## 🔧 Development

### Building for Production
```bash
bundle exec jekyll build
```

### Running Tests
```bash
bundle exec jekyll build --trace
```

## 📈 Performance Features

- **Image Optimization**: WebP format with fallbacks
- **Lazy Loading**: Images load as needed
- **Minified Assets**: Compressed CSS and JS
- **Caching**: Browser caching enabled
- **Fast Navigation**: Static site generation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software for SWAI Electronics.

## 📞 Support

For support and questions:
- WhatsApp: [Your WhatsApp Number]
- Email: [Your Email]

## 🏆 Credits

**Developed for SWAI Electronics**
- Modern e-commerce solution
- Tanzanian electronics retailer
- Premium quality products

---

*Built with ❤️ for SWAI Electronics - Premium Quality, Affordable, Reliable, Exceptional.*