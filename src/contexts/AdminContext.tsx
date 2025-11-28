import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Product, Offer, Filters } from '../types';
import * as githubService from '../services/githubService';
import { useAuth } from '@clerk/clerk-react';

interface AdminContextType {
  // Data
  products: Product[];
  offers: Offer[];
  filters: Filters;
  loading: boolean;
  error: string | null;
  
  // Products
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  // Offers
  addOffer: (offer: Omit<Offer, 'id' | 'created_at'>) => Promise<void>;
  updateOffer: (id: string, offer: Partial<Offer>) => Promise<void>;
  deleteOffer: (id: string) => Promise<void>;
  
  // Filters
  updateFilters: (filters: Filters) => Promise<void>;
  
  // Refresh
  refreshData: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const { getToken } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filters, setFilters] = useState<Filters>({
    show_all_link: true,
    all_label: "All Products",
    show_sale_filter: true,
    sale_label: "On Sale",
    categories: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all data from GitHub on mount
  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [productsData, offersData, filtersData] = await Promise.all([
        githubService.getProducts(),
        githubService.getOffers(),
        githubService.getFilters(),
      ]);
      setProducts(productsData);
      setOffers(offersData);
      setFilters(filtersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Provide Clerk token to githubService for external API writes if configured
    githubService.setApiAuthTokenProvider(async () => {
      try { return await getToken(); } catch { return null; }
    });
    refreshData();
  }, []);

  // Products
  const addProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const newProduct = await githubService.addProduct(product);
      setProducts(prev => [...prev, newProduct]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      setLoading(true);
      await githubService.updateProduct(id, updates);
      setProducts(prev =>
        prev.map(p => (p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setLoading(true);
      await githubService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Offers
  const addOffer = async (offer: Omit<Offer, 'id' | 'created_at'>) => {
    try {
      setLoading(true);
      const newOffer = await githubService.addOffer(offer);
      setOffers(prev => [...prev, newOffer]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add offer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateOffer = async (id: string, updates: Partial<Offer>) => {
    try {
      setLoading(true);
      await githubService.updateOffer(id, updates);
      setOffers(prev => prev.map(o => (o.id === id ? { ...o, ...updates } : o)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update offer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteOffer = async (id: string) => {
    try {
      setLoading(true);
      await githubService.deleteOffer(id);
      setOffers(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete offer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Filters
  const updateFilters = async (newFilters: Filters) => {
    try {
      setLoading(true);
      await githubService.updateFilters(newFilters);
      setFilters(newFilters);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update filters');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        offers,
        filters,
        loading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
        addOffer,
        updateOffer,
        deleteOffer,
        updateFilters,
        refreshData,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
