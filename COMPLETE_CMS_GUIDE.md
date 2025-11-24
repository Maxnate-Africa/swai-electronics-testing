# Swai Electronics CMS - Complete User Guide

## 📋 **Table of Contents**
1. [Getting Started](#getting-started)
2. [Product Management](#product-management)
3. [Sale Items & Pricing](#sale-items--pricing)
4. [Offers & Promotions](#offers--promotions)
5. [Media Management](#media-management)
6. [SEO Optimization](#seo-optimization)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## 🚀 **Getting Started**

### **Accessing the CMS**
1. Navigate to your website's CMS: `yoursite.com/cms-admin/`
2. Click "Login with Netlify Identity"
3. Enter your credentials
4. You'll see the main CMS dashboard

### **Dashboard Overview**
- **Products**: Manage all electronic items in your store
- **Offers**: Create promotional campaigns and special deals
- **Media**: Upload and manage product images
- **Workflow**: Review and publish content changes

### **User Roles & Permissions**
- **Admin**: Full access to all content and settings
- **Editor**: Can create and edit products and offers
- **Contributor**: Can create drafts for review

---

## 📦 **Product Management**

### **Creating a New Product**

#### **Step 1: Basic Information**
1. Go to **Products** → **New Product**
2. Fill in required fields:
   - **Title**: Product name (e.g., "Samsung 55\" UHD 4K TV")
   - **Brand**: Manufacturer name (optional)
   - **Category**: Select from:
     - `televisions`
     - `audio`
     - `home-appliances`

#### **Step 2: Pricing & Sales**
Configure your product pricing in the **"Pricing & Sales"** section:

**Regular Pricing:**
- **Regular Price (TSh)**: Base selling price
  - Minimum: 1,000 TSh
  - Enter numbers only (no commas or currency symbols)
  - Example: `1200000` for TSh 1,200,000

**Sale Pricing (Optional):**
- **Sale Price (TSh)**: Discounted price
  - Must be lower than regular price
  - Creates automatic entry in "Sale Items" filter
  - Example: `950000` for TSh 950,000

**Sale Scheduling (Optional):**
- **Sale Start Date**: When promotion begins
- **Sale End Date**: When promotion expires
- Leave empty for immediate/permanent sales

#### **Step 3: Product Details**
- **Image**: Upload high-quality product photo
  - Recommended: 800x800px minimum
  - Supported formats: JPG, PNG, WebP
  - File size: Under 2MB for best performance

- **Availability**: Set stock status
  - "In Stock": Product available for purchase
  - "Out of Stock": Product unavailable

- **WhatsApp Message**: Custom message for orders
  - Example: "I'm interested in the Samsung 55\" UHD TV"

#### **Step 4: Descriptions & Features**
- **Short Description**: Brief product summary (1-2 sentences)
- **Long Description**: Detailed product information (Markdown supported)
- **Key Features**: Bullet-point list of main selling points
- **Specifications**: Technical details (Label-Value pairs)

#### **Step 5: SEO Optimization**
In the **SEO** section (optional but recommended):
- **SEO Title**: Custom page title for search engines
- **SEO Description**: Meta description (150-160 characters)
- **SEO Image**: Custom image for social media sharing

### **Editing Existing Products**
1. Go to **Products** collection
2. Click on the product you want to edit
3. Make your changes in the form
4. Click **Save** to apply changes
5. Click **Publish** to make changes live

### **Product Preview**
The CMS provides real-time preview showing:
- How pricing will display (regular vs. sale)
- Discount percentages and savings amounts
- Sale badges and promotional indicators
- Stock status display

---

## 🏷️ **Sale Items & Pricing**

### **Creating Sale Items**

#### **Basic Sale Setup**
1. Edit any product in the CMS
2. In **"Pricing & Sales"** section:
   - Set **Regular Price**: Your normal selling price
   - Set **Sale Price**: Your discounted price (must be lower)
3. Save the product

**Result**: Product automatically appears in "🏷️ Sale Items" filter on website

#### **Advanced Sale Features**

**Time-Limited Sales:**
```
Regular Price: 850000
Sale Price: 720000
Sale Start: 2025-11-20 00:00:00
Sale End: 2025-12-31 23:59:59
```
**Result**: 15% OFF sale active only between specified dates

**Flash Sales:**
```
Regular Price: 450000
Sale Price: 380000
Sale Start: [Leave empty for immediate start]
Sale End: 2025-11-25 23:59:59
```
**Result**: Immediate sale ending on Black Friday

**Permanent Discounts:**
```
Regular Price: 1200000
Sale Price: 999000
Sale Start: [Empty]
Sale End: [Empty]
```
**Result**: Always shows sale price until manually changed

### **Sale Display Examples**

**Active Sale Display:**
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

### **Sale Validation Rules**

#### **Automatic Validation**
- ❌ Sale price must be lower than regular price
- ❌ Sale start date must be before end date
- ❌ Prices must be positive numbers only
- ✅ Valid sales show success confirmation

#### **Error Messages**
- "❌ Sale price (TSh 950,000) must be lower than regular price (TSh 850,000)"
- "❌ Sale start date must be before end date"
- "✅ Sale item created! 15% discount will appear in Sale Items filter"

### **Managing Multiple Sales**

#### **Category-Wide Sales**
1. Filter products by category
2. Edit multiple products to apply same discount percentage
3. Use consistent start/end dates for coordinated promotions

#### **Seasonal Promotions**
1. Plan sales calendar in advance
2. Set up sales with future start dates
3. Monitor active sales through CMS preview
4. Update end dates to extend successful promotions

#### **Sale Performance Tracking**
- Monitor which products appear in "Sale Items" filter
- Test sale display on frontend regularly
- Adjust pricing based on customer response
- Use sale dates for limited-time urgency

---

## 🎯 **Offers & Promotions**

### **Creating Promotional Offers**

#### **Offer Types**
1. **Product-Specific**: Highlight individual items
2. **Category Promotions**: Feature product categories
3. **Store-Wide**: General promotional messages
4. **Seasonal**: Holiday and event-based offers

#### **Offer Configuration**
- **Title**: Catchy promotional headline
- **Priority**: Higher numbers show first
- **Start/End Dates**: Campaign scheduling
- **Published**: Control offer visibility
- **Image**: Eye-catching promotional graphics
- **CTA Text**: Call-to-action button text
- **CTA URL**: Link destination (product page, category, etc.)
- **WhatsApp Message**: Direct contact message

#### **Offer Content**
- **Body**: Rich text content with Markdown support
- **Tags**: Organize offers by themes/categories
- **Features**: Key promotional points
- **Specifications**: Detailed offer terms

### **Promotional Best Practices**
1. **Clear Value Proposition**: Highlight savings and benefits
2. **Urgency**: Use time-limited offers effectively
3. **Visual Appeal**: High-quality promotional images
4. **Consistent Messaging**: Align with sale items and pricing

---

## 📸 **Media Management**

### **Image Guidelines**

#### **Product Images**
- **Resolution**: Minimum 800x800px, recommended 1200x1200px
- **Format**: JPG (photos), PNG (graphics), WebP (modern browsers)
- **File Size**: Under 2MB for optimal loading
- **Background**: Clean, preferably white or transparent
- **Lighting**: Well-lit, showing product details clearly

#### **Promotional Images**
- **Aspect Ratio**: 16:9 for banners, 1:1 for squares
- **Text Overlay**: Readable fonts, high contrast
- **Brand Consistency**: Use brand colors and logo
- **Call-to-Action**: Clear visual emphasis on offers

### **Image Optimization**
The system automatically creates:
- **Multiple Sizes**: 300px, 600px, original
- **WebP Versions**: Modern format for faster loading
- **Responsive Images**: Adaptive loading based on device
- **Lazy Loading**: Images load as user scrolls

### **Upload Process**
1. Click **Choose File** in any image field
2. Select image from your computer
3. Wait for upload completion
4. Image automatically optimized for web
5. Preview appears immediately in CMS

---

## 🔍 **SEO Optimization**

### **Product SEO**

#### **Title Optimization**
- Include brand, model, and key features
- Keep under 60 characters for search results
- Example: "Samsung 55\" UHD 4K Smart TV - Crystal Display"

#### **Description Writing**
- 150-160 characters for optimal display
- Include main keywords naturally
- Highlight key benefits and features
- Call-to-action at the end

#### **Image SEO**
- Descriptive filenames (samsung-55-uhd-tv.jpg)
- Alt text automatically generated from product title
- Proper image sizing for fast loading

### **Technical SEO**
The system automatically handles:
- **Structured Data**: Product schema markup
- **Meta Tags**: Open Graph and Twitter cards
- **Sitemap**: XML sitemap generation
- **Mobile Optimization**: Responsive design
- **Page Speed**: Optimized loading times

### **Content Guidelines**
1. **Unique Descriptions**: Avoid manufacturer copy
2. **Keyword Inclusion**: Natural integration of search terms
3. **Feature Benefits**: Focus on customer value
4. **Local SEO**: Include "Tanzania", "Dar es Salaam" where relevant

---

## 🎯 **Best Practices**

### **Content Creation**

#### **Product Titles**
✅ **Good**: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones"
❌ **Poor**: "Sony headphones"

#### **Descriptions**
✅ **Good**: "Experience studio-quality sound with Sony's industry-leading noise cancellation technology."
❌ **Poor**: "Good headphones for music."

#### **Pricing Strategy**
- **Competitive Analysis**: Research market prices
- **Psychological Pricing**: Use .99 endings strategically
- **Sale Frequency**: Balance promotions with regular pricing
- **Margin Protection**: Ensure profitable sale prices

### **Workflow Management**

#### **Content Review Process**
1. **Draft Creation**: Initial product setup
2. **Internal Review**: Check accuracy and completeness
3. **Preview Testing**: Verify display on website
4. **Publication**: Make content live
5. **Performance Monitoring**: Track engagement and sales

#### **Update Scheduling**
- **Regular Updates**: Weekly product review
- **Seasonal Adjustments**: Holiday pricing changes
- **Inventory Sync**: Stock status updates
- **Promotional Calendar**: Plan sales in advance

### **Quality Assurance**

#### **Pre-Publication Checklist**
- [ ] Product title is clear and descriptive
- [ ] Images are high-quality and properly cropped
- [ ] Pricing is accurate and competitive
- [ ] Sale dates are correctly set
- [ ] WhatsApp message is customer-friendly
- [ ] SEO fields are completed
- [ ] Preview displays correctly

#### **Post-Publication Verification**
- [ ] Product appears in correct category
- [ ] Sale items show in sale filter
- [ ] Images load properly on all devices
- [ ] WhatsApp integration works
- [ ] Pricing displays correctly

---

## 🛠️ **Troubleshooting**

### **Common Issues**

#### **Product Not Appearing in Sale Filter**
**Problem**: Sale product doesn't show in "🏷️ Sale Items"

**Solutions**:
1. ✅ Verify sale price is lower than regular price
2. ✅ Check sale dates include current date
3. ✅ Ensure product is published and in stock
4. ✅ Clear browser cache and refresh page

#### **Image Upload Problems**
**Problem**: Images not uploading or displaying

**Solutions**:
1. ✅ Check file size (must be under 2MB)
2. ✅ Use supported formats (JPG, PNG, WebP)
3. ✅ Ensure stable internet connection
4. ✅ Try refreshing the page and uploading again

#### **Pricing Display Issues**
**Problem**: Prices not showing correctly

**Solutions**:
1. ✅ Enter numbers only (no commas or currency)
2. ✅ Verify pricing structure in CMS
3. ✅ Check for validation errors in form
4. ✅ Ensure positive values only

#### **Sale Validation Errors**
**Problem**: Cannot save sale pricing

**Error Messages & Solutions**:
- **"Sale price must be lower"**: Reduce sale price below regular price
- **"Start date must be before end date"**: Correct date chronology
- **"Required field missing"**: Fill in all required product information

### **CMS Navigation Issues**

#### **Login Problems**
1. Clear browser cookies and cache
2. Verify correct login credentials
3. Check internet connection stability
4. Contact administrator for access issues

#### **Saving Problems**
1. Check all required fields are filled
2. Verify image uploads completed
3. Ensure stable internet connection
4. Try refreshing page and re-saving

#### **Preview Not Updating**
1. Wait a few seconds for processing
2. Refresh the preview panel
3. Check that changes were saved
4. Verify content is published

### **Technical Support**

#### **When to Contact Support**
- Persistent login issues
- Image upload failures
- Data loss or corruption
- Performance problems
- Feature requests

#### **Information to Include**
- Browser type and version
- Screenshot of the issue
- Steps to reproduce the problem
- Error messages (exact text)
- Time when issue occurred

---

## 📈 **Advanced Features**

### **Bulk Operations**
- **Category Updates**: Apply changes to multiple products
- **Seasonal Pricing**: Batch update sale dates
- **Image Management**: Replace multiple product images
- **SEO Updates**: Bulk optimize descriptions

### **Analytics Integration**
- **Product Performance**: Track popular items
- **Sale Effectiveness**: Monitor discount impact
- **Customer Engagement**: Analyze user behavior
- **Conversion Tracking**: Measure purchase funnel

### **Automation Features**
- **Sale Expiration**: Automatic price reversion
- **Stock Updates**: Inventory synchronization
- **SEO Generation**: Automatic meta descriptions
- **Image Optimization**: Automatic resizing and compression

---

## 📚 **Additional Resources**

### **Documentation Files**
- `PRICING_SYSTEM.md`: Technical pricing implementation
- `CMS_SALE_GUIDE.md`: Detailed sale management
- Product templates and examples
- SEO best practices guide

### **Training Materials**
- Video tutorials for common tasks
- Step-by-step workflow guides
- Keyboard shortcuts reference
- Advanced feature documentation

### **Support Contacts**
- **Technical Support**: development team contact
- **Content Guidelines**: editorial team contact  
- **Business Questions**: management contact
- **Emergency Issues**: priority support line

---

## 🎯 **Success Metrics**

### **Content Quality KPIs**
- Product completion rate (all fields filled)
- Image optimization scores
- SEO field completion
- Sale conversion rates

### **User Experience Metrics**
- Page load times
- Mobile responsiveness scores
- Search functionality usage
- Customer engagement rates

### **Business Impact**
- Product discovery rates
- Sale item performance
- Category popularity
- WhatsApp conversion rates

---

**This guide covers all aspects of managing content for Swai Electronics through the CMS. For specific technical questions or advanced customization, contact the development team.**

*Complete CMS Guide v1.0 - Powered by Maxnate | Updated November 2025*