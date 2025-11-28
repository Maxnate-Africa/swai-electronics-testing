import { Link } from 'react-router-dom';
import type { Product } from '../types';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const isInStock = product.inStock !== undefined ? product.inStock : (product.stock ? product.stock > 0 : true);
  
  return (
    <div className="product-card" role="article" aria-label={product.title}>
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.title} />
        ) : (
          <div className="placeholder">No image</div>
        )}
        {product.sale_price && <span className="sale-badge" aria-label="On Sale">SALE</span>}
        <span className={`stock-badge ${isInStock ? 'in-stock' : 'out-of-stock'}`} aria-label={isInStock ? 'In Stock' : 'Out of Stock'}>
          {isInStock ? 'In Stock' : 'Out of Stock'}
        </span>
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
      <div className="card-actions">
        <Link to={`/products/${product.id}`} className="btn-item-details" aria-label={`View details for ${product.title}`}>
          Item Details
        </Link>
      </div>
    </div>
  );
}
