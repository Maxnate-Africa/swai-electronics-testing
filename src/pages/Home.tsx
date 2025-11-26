import { useState, useEffect } from 'react';
import type { Product, Filters } from '../types';
import ProductCard from '../components/ProductCard';
import FilterBar from '../components/FilterBar';
import OffersCard from '../components/OffersCard';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Filters | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSaleOnly, setShowSaleOnly] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/data/products.json').then(r => r.json()),
      fetch('/data/filters.json').then(r => r.json())
    ]).then(([productsData, filtersData]) => {
      setProducts(productsData.products || []);
      setFilters(filtersData);
    });
  }, []);

  const filteredProducts = products.filter(product => {
    if (showSaleOnly && !product.sale_price) return false;
    if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="home">
      <OffersCard />
      
      <FilterBar
        filters={filters}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        showSaleOnly={showSaleOnly}
        onSaleToggle={setShowSaleOnly}
      />

      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}
