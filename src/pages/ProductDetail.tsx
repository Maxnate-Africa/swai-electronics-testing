import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Product } from '../types';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [showFallback, setShowFallback] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    fetch(`${base}data/products.json`)
      .then(r => r.json())
      .then((data: { products: Product[] }) => {
        const found = data.products.find(p => p.id === id);
        setProduct(found || null);
      });
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-detail">
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.title} />
        ) : (
          <div className="placeholder">No image</div>
        )}
      </div>
      
      <div className="product-info">
        <h1>{product.title}</h1>
        <p className="category">{product.category}</p>
        
        <div className="price">
          {product.sale_price ? (
            <>
              <span className="sale-price">TSh {product.sale_price.toLocaleString()}</span>
              <span className="original-price">TSh {product.price.toLocaleString()}</span>
            </>
          ) : (
            <span>TSh {product.price.toLocaleString()}</span>
          )}
        </div>

        {product.description && (
          <div className="description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
        )}

        {product.longDescription && (
          <div className="long-description">
            <h3>Details</h3>
            <p>{product.longDescription}</p>
          </div>
        )}

        {product.specs && Object.keys(product.specs).length > 0 && (
          <div className="specs">
            <h3>Specifications</h3>
            <ul>
              {Object.entries(product.specs).map(([key, value]) => (
                <li key={key}><strong>{key}:</strong> {value}</li>
              ))}
            </ul>
          </div>
        )}

        {(() => {
          const phone = '255685129530';
          const displayPrice = product.sale_price ? product.sale_price : product.price;
          const msg = `Hello Swai Electronics! I would like to order: ${product.title} (ID: ${product.id}). Category: ${product.category}. Price: TSh ${displayPrice.toLocaleString()}${product.sale_price ? ` (On Sale, original TSh ${product.price.toLocaleString()})` : ''}. Please confirm availability & delivery.`;
          const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent);
          return (
            <button
              type="button"
              className="order-button"
              aria-label={`Order ${product.title} via WhatsApp`}
              onClick={() => {
                if (isMobile) {
                  window.open(waLink, '_blank');
                } else {
                  setShowFallback(true);
                }
              }}
            >
              Order via WhatsApp
            </button>
          );
        })()}
      </div>
      {showFallback && product && (
        <div className="fallback-overlay" role="dialog" aria-modal="true" aria-label="WhatsApp Order Fallback">
          <div className="fallback-modal">
            <h3>Order via WhatsApp</h3>
            <p>You are on a desktop device. Copy the message below and send it manually through WhatsApp Web or your phone.</p>
            <div className="fallback-message-box">
              <code>{`Hello Swai Electronics! I would like to order: ${product.title} (ID: ${product.id}). Category: ${product.category}. Price: TSh ${(product.sale_price ? product.sale_price : product.price).toLocaleString()}${product.sale_price ? ` (On Sale, original TSh ${product.price.toLocaleString()})` : ''}. Please confirm availability & delivery.`}</code>
            </div>
            <div className="fallback-actions">
              <button
                type="button"
                className="btn-copy"
                onClick={() => {
                  const text = `Hello Swai Electronics! I would like to order: ${product.title} (ID: ${product.id}). Category: ${product.category}. Price: TSh ${(product.sale_price ? product.sale_price : product.price).toLocaleString()}${product.sale_price ? ` (On Sale, original TSh ${product.price.toLocaleString()})` : ''}. Please confirm availability & delivery.`;
                  navigator.clipboard.writeText(text).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1800);
                  }).catch(() => {});
                }}
              >
                {copied ? 'Copied!' : 'Copy Message'}
              </button>
              <a
                href={`https://wa.me/255685129530`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-open-web"
              >Open WhatsApp Web</a>
              <button type="button" className="btn-close" onClick={() => setShowFallback(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
