export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  sale_price?: number;
  image?: string;
  description?: string;
  featured?: boolean;
}

export interface Offer {
  id: string;
  title: string;
  discount: string;
  expiry: string;
  description?: string;
}

export interface Filters {
  show_all_link: boolean;
  all_label: string;
  show_sale_filter: boolean;
  sale_label: string;
  categories: string[];
}
