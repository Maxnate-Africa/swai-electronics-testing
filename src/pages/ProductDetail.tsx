import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Product } from '../types';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch('/data/products.json')
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

        <button className="cta-button">Contact Us</button>
      </div>
    </div>
  );
}
