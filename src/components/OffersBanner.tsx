import { useState, useEffect, useMemo } from 'react';
import type { Offer } from '../types';

interface Props {
  offers: Offer[];
}

function checkIfDismissed(activeOffers: Offer[]): boolean {
  const dismissedData = localStorage.getItem('offers-dismissed');
  if (!dismissedData) return false;
  
  try {
    const { timestamp, offersHash } = JSON.parse(dismissedData);
    const currentHash = JSON.stringify(activeOffers.map(o => o.id)).slice(0, 50);
    
    // If offers changed, show banner again
    if (offersHash !== currentHash) {
      localStorage.removeItem('offers-dismissed');
      return false;
    }
    
    // If dismissed within last 24 hours, keep hidden
    const hoursSinceDismissed = (Date.now() - timestamp) / (1000 * 60 * 60);
    return hoursSinceDismissed < 24;
  } catch {
    return false;
  }
}

export default function OffersBanner({ offers }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  // Filter active offers
  const activeOffers = useMemo(() => offers.filter(offer => {
    if (offer.active === false) return false;
    return true;
  }), [offers]);

  // Check if dismissed on mount
  useEffect(() => {
    setIsDismissed(checkIfDismissed(activeOffers));
  }, [activeOffers]);

  useEffect(() => {
    // Show banner with animation after a short delay
    if (activeOffers.length > 0 && !isDismissed) {
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, [activeOffers.length, isDismissed]);

  // Auto-rotate offers
  useEffect(() => {
    if (activeOffers.length > 1) {
      const interval = setInterval(() => {
        setCurrentOfferIndex(prev => (prev + 1) % activeOffers.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeOffers.length]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsDismissed(true);
      localStorage.setItem('offers-dismissed', JSON.stringify({
        timestamp: Date.now(),
        offersHash: JSON.stringify(activeOffers.map(o => o.id)).slice(0, 50)
      }));
    }, 300);
  };

  if (activeOffers.length === 0 || isDismissed) return null;

  const currentOffer = activeOffers[currentOfferIndex];

  return (
    <div className={`offers-banner ${isVisible ? 'visible' : ''}`}>
      <div className="offers-banner-content">
        <span className="offer-icon">🎉</span>
        <div className="offer-text">
          <strong>{currentOffer.title}</strong>
          <span className="offer-discount">{currentOffer.discount}</span>
          {currentOffer.description && (
            <span className="offer-description">- {currentOffer.description}</span>
          )}
        </div>
        {activeOffers.length > 1 && (
          <div className="offer-dots">
            {activeOffers.map((_, index) => (
              <span 
                key={index} 
                className={`dot ${index === currentOfferIndex ? 'active' : ''}`}
                onClick={() => setCurrentOfferIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
      <button className="offers-banner-close" onClick={handleDismiss} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}
