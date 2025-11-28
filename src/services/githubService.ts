import { Octokit } from '@octokit/rest';
import type { Product, Offer, Filters } from '../types';

// GitHub repository configuration
const REPO_OWNER = 'Maxnate-Africa';
const REPO_NAME = 'swai-electronics-testing';
const BRANCH = 'master';

// JSON file paths in the repository
const FILES = {
  PRODUCTS: 'public/data/products.json',
  OFFERS: 'public/data/offers.json',
  FILTERS: 'public/data/filters.json',
};

// Runtime-managed GitHub token for GitHub Pages compatibility
let RUNTIME_GH_TOKEN: string | null = null;
const API_BASE = import.meta.env.VITE_WRITE_API_BASE as string | undefined;
let apiAuthProvider: (() => Promise<string | null>) | null = null;

// Load token from sessionStorage on module init (do not persist long-term)
if (typeof window !== 'undefined') {
  try {
    const saved = sessionStorage.getItem('gh_pat');
    if (saved) RUNTIME_GH_TOKEN = saved;
  } catch {}
}

export function setGitHubToken(token: string) {
  RUNTIME_GH_TOKEN = token;
  try { sessionStorage.setItem('gh_pat', token); } catch {}
}

export function clearGitHubToken() {
  RUNTIME_GH_TOKEN = null;
  try { sessionStorage.removeItem('gh_pat'); } catch {}
}

export function hasGitHubToken(): boolean {
  return !!RUNTIME_GH_TOKEN;
}

export function setApiAuthTokenProvider(provider: () => Promise<string | null>) {
  apiAuthProvider = provider;
}

// Initialize Octokit; allow unauthenticated for reads, require token for writes
const getOctokit = (requireAuth: boolean = false) => {
  if (requireAuth && !RUNTIME_GH_TOKEN) {
    throw new Error('GitHub token missing. Go to Admin > Settings and paste a fine-grained token.');
  }
  return RUNTIME_GH_TOKEN ? new Octokit({ auth: RUNTIME_GH_TOKEN }) : new Octokit();
};

interface GitHubFile {
  sha: string;
  content: string;
}

/**
 * Get file content and SHA from GitHub
 */
async function getFileFromGitHub(path: string): Promise<GitHubFile | null> {
  try {
    const octokit = getOctokit(false);
    const { data } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path,
      ref: BRANCH,
    });

    if ('content' in data) {
      return {
        sha: data.sha,
        content: atob(data.content),
      };
    }
    return null;
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
      return null; // File doesn't exist yet
    }
    throw error;
  }
}

/**
 * Update or create file on GitHub
 */
async function updateFileOnGitHub(
  path: string,
  content: string,
  message: string,
  sha?: string
): Promise<void> {
  // If an external write API is configured, use it instead of client-side token
  if (API_BASE) {
    const headers: Record<string,string> = { 'Content-Type': 'application/json' };
    if (apiAuthProvider) {
      try {
        const clerkToken = await apiAuthProvider();
        if (clerkToken) headers['Authorization'] = `Bearer ${clerkToken}`;
      } catch {}
    }
    const res = await fetch(`${API_BASE.replace(/\/$/, '')}/update-file`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ owner: REPO_OWNER, repo: REPO_NAME, branch: BRANCH, path, content, message, sha }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Write API error: ${res.status} ${text}`);
    }
    return;
  }

  const octokit = getOctokit(true);
  await octokit.repos.createOrUpdateFileContents({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    path,
    message,
    content: btoa(content),
    branch: BRANCH,
    sha,
  });
}

/** Verify the current token by fetching the authenticated user */
export async function verifyToken(): Promise<{ login: string } | null> {
  if (!RUNTIME_GH_TOKEN) return null;
  const octokit = getOctokit(true);
  const { data } = await octokit.rest.users.getAuthenticated();
  return { login: data.login };
}

/**
 * Generic function to read JSON data from GitHub
 * Handles both wrapped objects { "key": [...] } and bare arrays
 */
async function readData<T>(filePath: string, wrapKey?: string): Promise<T[]> {
  const file = await getFileFromGitHub(filePath);
  if (!file) {
    return [];
  }
  const parsed = JSON.parse(file.content);
  
  // If wrapKey provided, unwrap the object
  if (wrapKey && parsed[wrapKey]) {
    return parsed[wrapKey];
  }
  
  // Otherwise return as-is (for filters.json)
  return Array.isArray(parsed) ? parsed : [parsed];
}

/**
 * Generic function to write JSON data to GitHub
 * Wraps data in object with specified key if provided
 */
async function writeData<T>(
  filePath: string,
  data: T[] | T,
  commitMessage: string,
  wrapKey?: string
): Promise<void> {
  const file = await getFileFromGitHub(filePath);
  
  // If wrapKey provided, wrap the array in an object
  const contentToSave = wrapKey ? { [wrapKey]: data } : data;
  
  const content = JSON.stringify(contentToSave, null, 2);
  await updateFileOnGitHub(filePath, content, commitMessage, file?.sha);
}

// ==================== PRODUCTS ====================

export async function getProducts(): Promise<Product[]> {
  return readData<Product>(FILES.PRODUCTS, 'products');
}

export async function addProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
  const products = await getProducts();
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  products.push(newProduct);
  await writeData(FILES.PRODUCTS, products, `Add product: ${newProduct.title}`, 'products');
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  const products = await getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Product not found');
  
  products[index] = {
    ...products[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  await writeData(FILES.PRODUCTS, products, `Update product: ${products[index].title}`, 'products');
}

export async function deleteProduct(id: string): Promise<void> {
  const products = await getProducts();
  const product = products.find(p => p.id === id);
  if (!product) throw new Error('Product not found');
  
  const filtered = products.filter(p => p.id !== id);
  await writeData(FILES.PRODUCTS, filtered, `Delete product: ${product.title}`, 'products');
}

// ==================== OFFERS ====================

export async function getOffers(): Promise<Offer[]> {
  return readData<Offer>(FILES.OFFERS, 'offers');
}

export async function addOffer(offer: Omit<Offer, 'id' | 'created_at'>): Promise<Offer> {
  const offers = await getOffers();
  const newOffer: Offer = {
    ...offer,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
  };
  offers.push(newOffer);
  await writeData(FILES.OFFERS, offers, `Add offer: ${newOffer.title}`, 'offers');
  return newOffer;
}

export async function updateOffer(id: string, updates: Partial<Offer>): Promise<void> {
  const offers = await getOffers();
  const index = offers.findIndex(o => o.id === id);
  if (index === -1) throw new Error('Offer not found');
  
  offers[index] = { ...offers[index], ...updates };
  await writeData(FILES.OFFERS, offers, `Update offer: ${offers[index].title}`, 'offers');
}

export async function deleteOffer(id: string): Promise<void> {
  const offers = await getOffers();
  const offer = offers.find(o => o.id === id);
  if (!offer) throw new Error('Offer not found');
  
  const filtered = offers.filter(o => o.id !== id);
  await writeData(FILES.OFFERS, filtered, `Delete offer: ${offer.title}`, 'offers');
}

// ==================== FILTERS ====================

export async function getFilters(): Promise<Filters> {
  const file = await getFileFromGitHub(FILES.FILTERS);
  if (!file) {
    // Return default filters structure
    return {
      show_all_link: true,
      all_label: "All Products",
      show_sale_filter: true,
      sale_label: "On Sale",
      categories: []
    };
  }
  return JSON.parse(file.content);
}

export async function updateFilters(filters: Filters): Promise<void> {
  await writeData(FILES.FILTERS, filters, 'Update filters configuration');
}

// ==================== BACKUP IMPORT ====================

export interface BackupPayload {
  products: Product[];
  offers: Offer[];
  filters: Filters;
  exportDate?: string;
}

/**
 * Import a full backup, overwriting products, offers, and filters files in one operation.
 * Uses three commits (one per file) via the configured write mechanism (Worker or PAT).
 */
export async function importBackup(payload: BackupPayload): Promise<void> {
  // Normalize products: ensure timestamps exist
  const normalizedProducts = (payload.products || []).map(p => ({
    ...p,
    created_at: p.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  const normalizedOffers = payload.offers || [];
  const normalizedFilters = payload.filters || {
    show_all_link: true,
    all_label: 'All Products',
    show_sale_filter: true,
    sale_label: 'On Sale',
    categories: [],
  };

  // Write each file
  await writeData(FILES.PRODUCTS, normalizedProducts, 'Import backup: products', 'products');
  await writeData(FILES.OFFERS, normalizedOffers, 'Import backup: offers', 'offers');
  await writeData(FILES.FILTERS, normalizedFilters, 'Import backup: filters');
}
