export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  sale_price?: number;
  image?: string;
  description?: string;
  longDescription?: string;
  specs?: Record<string, string>;
  featured?: boolean;
  stock?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Offer {
  id: string;
  title: string;
  discount: string;
  expiry: string;
  description?: string;
  active?: boolean;
  created_at?: string;
}

export interface Filters {
  show_all_link: boolean;
  all_label: string;
  show_sale_filter: boolean;
  sale_label: string;
  categories: string[];
}

export interface AdminUser {
  email: string;
  isAuthenticated: boolean;
}
