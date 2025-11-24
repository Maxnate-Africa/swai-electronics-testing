# Enhanced Pricing System Documentation

## Overview
The enhanced pricing system for Swai Electronics provides comprehensive support for regular pricing, sale pricing, discount displays, and promotional scheduling. This system integrates seamlessly with Decap CMS and provides a professional ecommerce experience.

## Features

### 🏷️ **Pricing Fields**
- **Regular Price**: Base selling price in TSh (Tanzanian Shillings)
- **Sale Price**: Discounted price (optional, must be lower than regular price)
- **Sale Start Date**: When promotional pricing begins (optional)
- **Sale End Date**: When promotional pricing ends (optional)

### 💰 **Currency Formatting**
- Automatic "TSh" prefix
- Comma-separated thousands (e.g., TSh 1,200,000)
- No decimal places for cleaner display
- Consistent formatting across all templates

### 🎯 **Sale Indicators**
- **Sale Badge**: Animated "SALE" indicator with red gradient
- **Strikethrough Pricing**: Original price crossed out during sales
- **Discount Percentage**: Shows percentage savings (e.g., "15% OFF")
- **Savings Amount**: Shows actual money saved (e.g., "Save TSh 70,000")

### ⏰ **Smart Sale Logic**
- **Date Validation**: Sales only active within specified date ranges
- **Price Validation**: Sale price must be lower than regular price
- **Effective Price**: Uses sale price when active, regular price otherwise
- **Auto-Calculation**: Discount percentages calculated automatically

## CMS Integration

### Product Fields (Decap CMS)
```yaml
# Core Product Information
- Title (required)
- Brand (optional)
- Category (televisions, audio, home-appliances)

# Pricing Section
- Regular Price (TSh) - minimum 1000, required
- Sale Price (TSh) - minimum 100, optional
- Sale Start Date - optional datetime
- Sale End Date - optional datetime

# Additional Fields
- Image, Stock Status, WhatsApp Message
- Short Description, Long Description
```

### CMS Features
- **Live Preview**: Real-time preview of pricing display
- **Validation**: Prevents invalid sale prices and dates
- **User-Friendly**: Clear hints and field organization
- **Error Handling**: Proper error messages for invalid input

## Template Usage

### Basic Product Display
```liquid
<!-- Check if product is on sale -->
{% assign on_sale = product | is_on_sale %}

<!-- Display pricing -->
{% if on_sale %}
  <div class="sale-badge">SALE</div>
  <span class="current-price">{{ product.sale_price | format_price }}</span>
  <span class="original-price">{{ product.price | format_price }}</span>
  <span class="discount">{{ product.price | calculate_discount: product.sale_price }}% OFF</span>
{% else %}
  <span class="price">{{ product.price | format_price }}</span>
{% endif %}
```

### Available Liquid Filters
- `format_price` - Formats number as TSh currency
- `format_price_raw` - Formats number without TSh prefix
- `is_on_sale` - Returns true/false if product is currently on sale
- `get_effective_price` - Returns current selling price (sale or regular)
- `calculate_discount` - Calculates percentage discount
- `format_savings` - Formats savings amount

## Visual Design

### Sale Pricing Display
```
[SALE]
TSh 380,000  ~~TSh 450,000~~
[15% OFF] [Save TSh 70,000]
```

### Color Scheme
- **Sale Badge**: Red gradient (`#ff4757` to `#ff3838`)
- **Current Price**: Brand red (`#E60000`)
- **Original Price**: Gray (`#888`) with strikethrough
- **Discount Info**: Red background highlight
- **Savings**: Green background highlight

### Animations
- **Sale Badge**: Pulsing animation to attract attention
- **Price Highlight**: Shimmer effect on hover
- **Card Interactions**: Enhanced hover states for sale items

## Implementation Examples

### Product with Active Sale
```yaml
---
title: "Sony Soundbar HT-S20R"
price: 450000
sale_price: 380000
category: "audio"
image: "/assets/images/products/sony-soundbar.png"
---
```
**Result**: TSh 380,000 ~~TSh 450,000~~ 15% OFF Save TSh 70,000

### Time-Limited Sale
```yaml
---
title: "Hisense Fridge 200L"
price: 850000
sale_price: 720000
sale_start: "2025-11-20T00:00:00.000Z"
sale_end: "2025-12-31T23:59:59.000Z"
category: "home-appliances"
---
```
**Result**: Active only between Nov 20 - Dec 31, 2025

### Regular Pricing
```yaml
---
title: "Samsung 55\" UHD 4K"
price: 1200000
category: "televisions"
---
```
**Result**: TSh 1,200,000

## Mobile Optimization

### Responsive Design
- Smaller sale badges on mobile
- Stacked pricing layout
- Touch-friendly interactions
- Optimized font sizes

### Performance
- Minimal JavaScript impact
- CSS-based animations
- Efficient DOM manipulation
- Battery-conscious design

## Development Notes

### File Structure
```
├── _plugins/formatting.rb          # Ruby filters
├── cms-admin/config.yml           # CMS field definitions
├── cms-admin/preview-templates.js # Live preview
├── assets/css/style.css          # Pricing styles
└── index.html                    # Product grid template
```

### Testing Scenarios
1. **Regular Products**: No sale pricing
2. **Active Sales**: Current date within sale period
3. **Expired Sales**: Sale end date passed
4. **Future Sales**: Sale start date not reached
5. **Invalid Sales**: Sale price >= regular price

### Browser Support
- Modern browsers (ES6+)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Graceful degradation for older browsers

## Maintenance

### Adding New Features
- **Flash Sales**: Add flash sale badges and timers
- **Bulk Discounts**: Category-wide discount support
- **Currency Conversion**: Multi-currency support
- **Stock Alerts**: Low stock indicators with pricing

### Performance Monitoring
- Monitor Liquid template performance
- Check CMS field validation effectiveness
- Validate date range calculations
- Test mobile responsiveness

## Support

For questions about the pricing system:
1. Check this documentation
2. Review the CMS field hints
3. Test in CMS preview mode
4. Contact development team

---
*Enhanced Pricing System v1.0 - Powered by Maxnate*