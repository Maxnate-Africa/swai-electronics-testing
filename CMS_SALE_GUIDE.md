# Swai Electronics CMS - Sale Items Guide

## 📋 **How to Create Sale Items**

### **Step 1: Access Product Editor**
1. Login to the CMS at `/cms-admin/`
2. Navigate to **Products** collection
3. Either create a new product or edit existing one

### **Step 2: Set Sale Pricing**
In the **"Pricing & Sales"** section:

1. **Regular Price (TSh)**: Enter the normal selling price
2. **Sale Price (TSh)**: Enter the discounted price
   - ⚠️ Must be lower than regular price
   - 💡 This makes the product appear in "Sale Items" filter
3. **Sale Start Date** (Optional): When the sale begins
4. **Sale End Date** (Optional): When the sale expires

### **Step 3: Preview & Validate**
- Preview shows sale badge and discount calculation
- CMS validates sale price is lower than regular price
- Date validation prevents invalid sale periods
- Success message confirms sale filter integration

## 🎯 **Sale Items Filter Integration**

### **Automatic Features**
- Products with valid sale pricing automatically appear in "Sale Items" filter
- Counter updates automatically: 🏷️ Sale Items (2)
- Real-time validation prevents invalid sales
- Date-based activation/expiration

### **Display Examples**

**Active Sale:**
```
[SALE]
TSh 380,000  ~~TSh 450,000~~
[15% OFF] [Save TSh 70,000]
```

**Time-Limited Sale:**
```
[SALE] - Ends: Dec 31, 2025
TSh 720,000  ~~TSh 850,000~~
[15% OFF] [Save TSh 130,000]
```

**Regular Pricing:**
```
TSh 1,200,000
```

## ✅ **Validation Rules**

### **Pricing Validation**
- Sale price must be lower than regular price
- Both prices must be positive numbers
- Minimum regular price: TSh 1,000
- Minimum sale price: TSh 100

### **Date Validation**
- Sale start date must be before end date
- Empty dates are allowed (immediate/permanent sales)
- Invalid dates are rejected with clear error messages

### **Error Messages**
- ❌ "Sale price (TSh X) must be lower than regular price (TSh Y)"
- ❌ "Sale start date must be before end date"
- ✅ "Sale item created! X% discount will appear in Sale Items filter"

## 🔍 **Testing Your Sale Items**

### **In CMS Preview**
- Sale badge appears immediately
- Discount percentage calculated automatically
- Sale dates shown if specified
- Inactive sales marked clearly

### **On Website**
1. Visit the website frontend
2. Click "🏷️ Sale Items" in navigation
3. Verify your product appears
4. Check pricing display is correct
5. Test WhatsApp ordering functionality

## 📊 **Managing Multiple Sales**

### **Best Practices**
1. **Clear Sale Periods**: Always set end dates for limited-time sales
2. **Competitive Pricing**: Ensure sale prices are attractive but profitable
3. **Category Balance**: Spread sales across different product categories
4. **Seasonal Sales**: Use date ranges for holiday promotions

### **Bulk Management**
- Edit multiple products to create category-wide sales
- Use consistent discount percentages for professional appearance
- Coordinate sale start/end dates across related products

## 🎨 **Visual Guidelines**

### **Sale Badge Colors**
- Red gradient background for maximum visibility
- White text for contrast and readability
- Pulsing animation to attract attention

### **Price Display**
- Sale price: Bold red (brand color)
- Original price: Gray with strikethrough
- Discount info: Red background highlight
- Savings amount: Green background

## 🚀 **Advanced Features**

### **URL Integration**
- Direct sale filter links: `/?filter=on-sale`
- Shareable sale pages for marketing
- SEO-friendly sale product URLs

### **Analytics Ready**
- Sale products tagged for tracking
- Conversion optimization through clear pricing
- A/B testing support for different discount displays

## 🛠 **Troubleshooting**

### **Product Not Showing in Sale Filter**
1. Check sale price is lower than regular price
2. Verify sale dates (if specified) include current date
3. Ensure product is published and in stock
4. Clear browser cache and refresh

### **Pricing Display Issues**
1. Verify number format (no commas in price fields)
2. Check currency symbols are not included in numbers
3. Ensure positive values only
4. Validate date format if using sale periods

### **CMS Validation Errors**
1. Read error message carefully
2. Check pricing relationship (sale < regular)
3. Verify date chronology (start < end)
4. Ensure required fields are filled

---

**Need Help?** Contact the development team or refer to the technical documentation in `PRICING_SYSTEM.md`

*CMS Guide v1.0 - Powered by Maxnate*