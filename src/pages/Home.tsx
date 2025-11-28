import { useState, useEffect, useMemo } from 'react';
import type { Product, Filters, Offer } from '../types';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import OffersBanner from '../components/OffersBanner';
import WhatsAppButton from '../components/WhatsAppButton';

type SortOption = 'default' | 'price-low' | 'price-high' | 'name-az' | 'name-za';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Filters | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSaleOnly, setShowSaleOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('default');

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    Promise.all([
      fetch(`${base}data/products.json`).then(r => r.json()),
      fetch(`${base}data/filters.json`).then(r => r.json()),
      fetch(`${base}data/offers.json`).then(r => r.json())
    ]).then(([productsData, filtersData, offersData]) => {
      setProducts(productsData.products || []);
      setFilters(filtersData);
      setOffers(offersData.offers || []);
    });
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(product => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
      // Sale filter
      if (showSaleOnly && !product.sale_price) return false;
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          product.title.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          (product.description && product.description.toLowerCase().includes(query))
        );
      }
      return true;
    });

    // Sort
    switch (sortBy) {
      case 'price-low':
        result = [...result].sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
        break;
      case 'price-high':
        result = [...result].sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
        break;
      case 'name-az':
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-za':
        result = [...result].sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return result;
  }, [products, selectedCategory, showSaleOnly, searchQuery, sortBy]);

  return (
    <>
      <Navbar
        filters={filters}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        showSaleOnly={showSaleOnly}
        onSaleToggle={setShowSaleOnly}
      />

      {/* Floating Offers Banner */}
      <OffersBanner offers={offers} />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span>PREMIUM</span>
            <span>QUALITY.</span>
          </h1>
          <p className="hero-subtitle">Affordable. Reliable. Exceptional.</p>
        </div>

        {/* Search & Sort Bar */}
        <div className="search-sort-bar">
          <div className="search-box">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')}>×</button>
            )}
          </div>

          <div className="sort-dropdown">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)}>
              <option value="default">Sort by: Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-az">Name: A to Z</option>
              <option value="name-za">Name: Z to A</option>
            </select>
          </div>
        </div>
      </section>

      <div className="home">
        <div className="products-grid">
          {filteredAndSortedProducts.length === 0 ? (
            <p className="no-products">No products found.</p>
          ) : (
            filteredAndSortedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="contact-inner">
          <h2 className="contact-title">Contact Us</h2>
          <p className="contact-intro">We’re here to help with product advice, availability, and nationwide delivery.</p>

          <div className="contact-grid">
            <div className="contact-card">
              <h3>Call or WhatsApp</h3>
              <p><a href="tel:+255685129530">+255 685 129 530</a></p>
              <p><a href="https://wa.me/255685129530" target="_blank" rel="noreferrer">Chat on WhatsApp</a></p>
            </div>

            <div className="contact-card">
              <h3>Email</h3>
              <p><a href="mailto:info@swaielectronics.co.tz">info@swaielectronics.co.tz</a></p>
              <p>Response within business hours</p>
            </div>

            <div className="contact-card">
              <h3>Hours</h3>
              <p>Mon–Sat: 08:00 – 18:00</p>
              <p>Sun: Closed</p>
            </div>

            <div className="contact-card">
              <h3>Locations & Service</h3>
              <p>Head Office: Mwanza, Tanzania</p>
              <p>We deliver to all 26 regions</p>
            </div>
          </div>
        </div>
      </section>

      <WhatsAppButton phoneNumber="255685129530" />
    </>
  );
}
