import { Link } from 'react-router-dom';
import type { Product } from '../types';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.title} />
        ) : (
          <div className="placeholder">No image</div>
        )}
        {product.sale_price && <span className="sale-badge">SALE</span>}
      </div>
      
      <div className="product-info">
        <h3>{product.title}</h3>
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
      </div>
    </Link>
  );
}
