import { useState } from 'react';
import type { Filters } from '../types';

interface Props {
  filters: Filters | null;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  showSaleOnly: boolean;
  onSaleToggle: (show: boolean) => void;
}

export default function Navbar({ filters, selectedCategory, onCategoryChange, showSaleOnly, onSaleToggle }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCategoryClick = (category: string) => {
    onCategoryChange(category);
    setMobileMenuOpen(false);
  };

  const handleSaleToggle = () => {
    onSaleToggle(!showSaleOnly);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-brand">
          <a href="/" className="logo-link">
            <img 
              src={`${import.meta.env.BASE_URL}logo.svg`} 
              alt="Swai Electronics" 
              className="logo-img" 
            />
          </a>
        </div>

        {/* Desktop Filters - Text Links */}
        {filters && (
          <ul className="navbar-menu desktop-only">
            {filters.show_all_link && (
              <li>
                <a
                  href="#"
                  className={selectedCategory === 'all' ? 'active' : ''}
                  onClick={(e) => { e.preventDefault(); onCategoryChange('all'); }}
                >
                  {filters.all_label}
                </a>
              </li>
            )}
            
            {filters.categories.map(category => (
              <li key={category}>
                <a
                  href="#"
                  className={selectedCategory === category ? 'active' : ''}
                  onClick={(e) => { e.preventDefault(); onCategoryChange(category); }}
                >
                  {category}
                </a>
              </li>
            ))}

            {filters.show_sale_filter && (
              <li className="sale-item">
                <a
                  href="#"
                  className={`sale-link ${showSaleOnly ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); onSaleToggle(!showSaleOnly); }}
                >
                  🔥 {filters.sale_label}
                </a>
              </li>
            )}
            {/* Contacts anchor link */}
            <li>
              <a href="#contact">Contacts</a>
            </li>
          </ul>
        )}

        {/* Mobile Hamburger */}
        <button 
          className={`hamburger mobile-only ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {filters && (
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-content">
            {filters.show_all_link && (
              <a
                href="#"
                className={`mobile-menu-item ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleCategoryClick('all'); }}
              >
                {filters.all_label}
              </a>
            )}
            
            {filters.categories.map(category => (
              <a
                key={category}
                href="#"
                className={`mobile-menu-item ${selectedCategory === category ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleCategoryClick(category); }}
              >
                {category}
              </a>
            ))}

            {filters.show_sale_filter && (
              <a
                href="#"
                className={`mobile-menu-item sale-link ${showSaleOnly ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleSaleToggle(); }}
              >
                🔥 {filters.sale_label}
              </a>
            )}
            <a
              href="#contact"
              className="mobile-menu-item"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contacts
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
