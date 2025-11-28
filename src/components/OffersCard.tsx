import { useState, useEffect } from 'react';
import type { Offer } from '../types';

export default function OffersCard() {
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    fetch(`${base}data/offers.json`)
      .then(r => r.json())
      .then(data => setOffers(data.offers || []));
  }, []);

  if (offers.length === 0) return null;

  return (
    <div className="offers-card">
      <h2>🎉 Special Offers</h2>
      <div className="offers-list">
        {offers.map(offer => (
          <div key={offer.id} className="offer">
            <h3>{offer.title}</h3>
            <p className="discount">{offer.discount}</p>
            <p className="expiry">Expires: {offer.expiry}</p>
            {offer.description && <p>{offer.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
