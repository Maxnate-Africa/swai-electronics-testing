// CMS Preview Templates for Enhanced Pricing
const ProductPreview = createClass({
  render: function() {
    const entry = this.props.entry;
    const title = entry.getIn(['data', 'title']);
    
    // Flattened pricing structure (raw values)
    const priceRaw = entry.getIn(['data', 'price']);
    const salePriceRaw = entry.getIn(['data', 'sale_price']);
    const saleStart = entry.getIn(['data', 'sale_start']);
    const saleEnd = entry.getIn(['data', 'sale_end']);
    
    // Sanitize numeric input (remove commas, spaces, currency) and parse as float
    const parseAmount = (val) => {
      if (val === undefined || val === null) return null;
      const cleaned = val.toString().replace(/[^0-9.]/g, '').replace(/\.(?=.*\.)/, ''); // remove all but first dot
      if (!cleaned) return null;
      const num = parseFloat(cleaned);
      return Number.isFinite(num) ? num : null;
    };

    const price = parseAmount(priceRaw);
    const salePrice = parseAmount(salePriceRaw);

    // Determine if sale is valid and active
    const validSale = salePrice !== null && price !== null && salePrice < price;
    const now = new Date();
    let saleActive = false;
    if (validSale) {
      saleActive = true;
      if (saleStart) saleActive = saleActive && new Date(saleStart) <= now;
      if (saleEnd) saleActive = saleActive && new Date(saleEnd) >= now;
    }
    const category = entry.getIn(['data', 'category']);
    const stock = entry.getIn(['data', 'stock'], 1);
    const image = entry.getIn(['data', 'image']);
    const description = entry.getIn(['data', 'short_description']);
    
    // Use calculated sale status
    const isOnSale = saleActive;
    const discount = isOnSale ? Math.max(0, Math.round(((price - salePrice) / price) * 100)) : 0;
    const savings = isOnSale ? Math.max(0, (price - salePrice)) : 0;
    
    // Format currency
    const formatPrice = (amount) => {
      if (!amount) return '';
      return 'TSh ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    
    return h('div', {className: 'cms-preview-card'}, [
      h('div', {className: 'cms-preview-image'}, [
        image ? h('img', {src: entry.getIn(['data', 'image'])}) : h('div', {className: 'placeholder'}, '📷')
      ]),
      h('div', {className: 'cms-preview-info'}, [
        h('h3', {}, [
          title,
          h('span', {
            className: `badge ${stock ? 'in-stock' : 'out-stock'}`
          }, stock ? 'In Stock' : 'Out of Stock')
        ]),
        h('div', {className: 'cms-preview-pricing'}, [
          isOnSale ? [
            h('div', {className: 'sale-badge'}, 'SALE'),
            h('div', {className: 'price-group'}, [
              h('span', {className: 'price current-price'}, formatPrice(salePriceRaw || salePrice)),
              h('span', {className: 'price original-price'}, formatPrice(priceRaw || price))
            ]),
            h('div', {className: 'discount-info'}, [
              h('span', {className: 'discount-percent'}, `${discount}% OFF`),
              h('span', {className: 'savings-amount'}, `Save ${formatPrice(savings)}`)
            ]),
            (saleStart || saleEnd) ? h('div', {className: 'sale-dates'}, [
              saleStart ? `Starts: ${new Date(saleStart).toLocaleDateString()}` : '',
              saleEnd ? ` | Ends: ${new Date(saleEnd).toLocaleDateString()}` : ''
            ].filter(Boolean).join('')) : null
          ] : [
            h('span', {className: 'price'}, formatPrice(priceRaw || price)),
            (salePriceRaw && !validSale) ? h('div', {className: 'sale-inactive'}, 'Invalid sale price (must be lower)') : null,
            (validSale && !saleActive) ? h('div', {className: 'sale-inactive'}, 'Sale Not Active') : null
          ]
        ]),
        description ? h('p', {className: 'description'}, description) : null
      ])
    ]);
  }
});

// Register the preview template
CMS.registerPreviewTemplate("products", ProductPreview);

// Add custom CSS for preview
const previewStyles = `
  .cms-preview-card {
    max-width: 300px;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  
  .cms-preview-image {
    aspect-ratio: 1;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .cms-preview-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .placeholder {
    font-size: 2rem;
    opacity: 0.3;
  }
  
  .cms-preview-info {
    padding: 16px;
  }
  
  .cms-preview-info h3 {
    margin: 0 0 8px 0;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .badge {
    font-size: 0.7rem;
    padding: 2px 6px;
    border-radius: 12px;
    font-weight: 600;
  }
  
  .in-stock {
    background: #d4edda;
    color: #155724;
  }
  
  .out-stock {
    background: #f8d7da;
    color: #721c24;
  }
  
  .cms-preview-pricing {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 8px 0;
  }
  
  .sale-badge {
    background: linear-gradient(135deg, #ff4757, #ff3838);
    color: white;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 20px;
    width: fit-content;
    text-transform: uppercase;
  }
  
  .price-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .price {
    font-family: 'Segoe UI', sans-serif;
    font-weight: 700;
  }
  
  .current-price {
    color: #E60000;
    font-size: 1.2rem;
  }
  
  .original-price {
    color: #888;
    text-decoration: line-through;
    font-size: 1rem;
  }
  
  .discount-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  
  .discount-percent {
    background: rgba(230, 0, 0, 0.1);
    color: #E60000;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 12px;
    width: fit-content;
  }
  
  .savings-amount {
    background: rgba(40, 167, 69, 0.1);
    color: #28a745;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 12px;
    width: fit-content;
  }
  
  .description {
    font-size: 0.9rem;
    color: #666;
    margin: 8px 0 0 0;
  }
  
  .sale-dates {
    font-size: 0.7rem;
    color: #666;
    background: rgba(0, 0, 0, 0.05);
    padding: 4px 8px;
    border-radius: 8px;
    margin-top: 4px;
  }
  
  .sale-inactive {
    font-size: 0.8rem;
    color: #888;
    background: rgba(255, 193, 7, 0.1);
    padding: 2px 6px;
    border-radius: 8px;
    margin-top: 4px;
  }
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = previewStyles;
document.head.appendChild(styleSheet);