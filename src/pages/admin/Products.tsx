import { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import AdminLayout from '../../components/AdminLayout';
import type { Product } from '../../types';

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: 0,
    sale_price: undefined as number | undefined,
    longDescription: '',
    specsText: '',
    image: '',
    featured: false,
    stock: 0,
    inStock: true,
  });

  const optimizeImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = async () => {
          try {
            // Generate multiple variants: original, 600px, 300px
            const variants: string[] = [];
            const widths = [img.width, 600, 300].filter((w, i, arr) => 
              w <= img.width && arr.indexOf(w) === i
            ).sort((a, b) => b - a);
            
            for (const targetWidth of widths) {
              const canvas = document.createElement('canvas');
              let width = img.width;
              let height = img.height;
              
              if (targetWidth < img.width) {
                const ratio = targetWidth / img.width;
                width = targetWidth;
                height = Math.max(1, Math.round(img.height * ratio));
              }
              
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(img, 0, 0, width, height);
              
              // Determine quality based on size
              const quality = file.size > 500000 ? 0.7 : 0.85;
              
              // Try AVIF first, fallback to WebP, then JPEG
              const imageData = await new Promise<string>((res) => {
                canvas.toBlob(
                  (blob) => {
                    if (blob) {
                      const reader2 = new FileReader();
                      reader2.onloadend = () => res(reader2.result as string);
                      reader2.readAsDataURL(blob);
                    } else {
                      // Fallback to WebP
                      canvas.toBlob(
                        (webpBlob) => {
                          if (webpBlob) {
                            const reader3 = new FileReader();
                            reader3.onloadend = () => res(reader3.result as string);
                            reader3.readAsDataURL(webpBlob);
                          } else {
                            // Final fallback to JPEG
                            res(canvas.toDataURL('image/jpeg', quality));
                          }
                        },
                        'image/webp',
                        quality
                      );
                    }
                  },
                  'image/avif',
                  quality
                );
              });
              
              variants.push(imageData);
            }
            
            // Return the best quality (first variant - original or largest)
            resolve(variants[0]);
          } catch (error) {
            reject(error);
          }
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPG, PNG, GIF, WebP, BMP, SVG)');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB');
      return;
    }
    
    try {
      setUploading(true);
      const optimizedImage = await optimizeImage(file);
      setFormData({ ...formData, image: optimizedImage });
      setImagePreview(optimizedImage);
    } catch (error) {
      alert('Failed to process image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const specs: Record<string,string> = {};
    formData.specsText.split(/\r?\n/).map(l => l.trim()).filter(Boolean).forEach(line => {
      const [k, ...rest] = line.split(':');
      const v = rest.join(':').trim();
      if (k && v) specs[k.trim()] = v;
    });

    const payload = {
      title: formData.title,
      category: formData.category,
      price: formData.price,
      sale_price: formData.sale_price,
      longDescription: formData.longDescription,
      specs,
      image: formData.image,
      featured: formData.featured,
      stock: formData.stock,
      inStock: formData.inStock,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct(payload);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      price: 0,
      sale_price: undefined,
      longDescription: '',
      specsText: '',
      image: '',
      featured: false,
      stock: 0,
      inStock: true,
    });
    setImagePreview('');
    setEditingProduct(null);
    setShowModal(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      category: product.category,
      price: product.price,
      sale_price: product.sale_price,
      longDescription: product.longDescription || '',
      specsText: product.specs ? Object.entries(product.specs).map(([k,v]) => `${k}: ${v}`).join('\n') : '',
      image: product.image || '',
      featured: product.featured || false,
      stock: product.stock || 0,
      inStock: product.inStock !== undefined ? product.inStock : true,
    });
    setImagePreview(product.image || '');
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-section">
        <div className="section-header">
          <h2>Products Management</h2>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Product
          </button>
        </div>

        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Sale Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={9} className="empty-state">No products found. Add your first product!</td>
                </tr>
              ) : (
                products.map((product) => {
                  const isInStock = product.inStock !== undefined ? product.inStock : (product.stock ? product.stock > 0 : true);
                  return (
                  <tr key={product.id}>
                    <td>
                      {product.image && (
                        <img src={product.image} alt={product.title} className="table-image" />
                      )}
                    </td>
                    <td>{product.title}</td>
                    <td>{product.category}</td>
                    <td>TZS {product.price.toLocaleString()}</td>
                    <td>{product.sale_price ? `TZS ${product.sale_price.toLocaleString()}` : '-'}</td>
                    <td>{product.stock || 0}</td>
                    <td>
                      <span className={`admin-stock-badge ${isInStock ? 'in-stock' : 'out-of-stock'}`}>
                        {isInStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td>{product.featured ? '✓' : '-'}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon" onClick={() => handleEdit(product)} title="Edit">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button className="btn-icon btn-danger" onClick={() => handleDelete(product.id)} title="Delete">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="modal-close" onClick={resetForm}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="title">Product Title *</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <input
                    type="text"
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="stock">Stock</label>
                  <input
                    type="number"
                    id="stock"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price (TZS) *</label>
                  <input
                    type="number"
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="sale_price">Sale Price (TZS)</label>
                  <input
                    type="number"
                    id="sale_price"
                    value={formData.sale_price || ''}
                    onChange={(e) => setFormData({ ...formData, sale_price: e.target.value ? parseFloat(e.target.value) : undefined })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Product Image</label>
                <div style={{marginBottom: '1rem'}}>
                  <label className="btn-secondary" style={{cursor: 'pointer', display: 'inline-block', padding: '0.75rem 1rem', marginRight: '0.5rem'}}>
                    {uploading ? 'Uploading...' : 'Upload Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <span style={{color: '#666', fontSize: '0.9rem'}}>or enter URL below</span>
                </div>
                <input
                  type="url"
                  id="image"
                  value={formData.image.startsWith('data:') ? '' : formData.image}
                  onChange={(e) => {
                    setFormData({ ...formData, image: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                  placeholder="https://example.com/image.jpg"
                  disabled={uploading}
                />
                {imagePreview && (
                  <div style={{marginTop: '1rem', textAlign: 'center'}}>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', border: '2px solid #e0e0e0'}}
                    />
                    <button 
                      type="button" 
                      onClick={() => {
                        setFormData({ ...formData, image: '' });
                        setImagePreview('');
                      }}
                      style={{display: 'block', margin: '0.5rem auto', padding: '0.5rem 1rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'}}
                    >
                      Remove Image
                    </button>
                  </div>
                )}
                <p style={{color: '#666', fontSize: '0.85rem', marginTop: '0.5rem'}}>
                  Supports JPG, PNG, GIF, WebP, BMP, SVG (max 10MB). Generates optimized AVIF/WebP variants (original, 600px, 300px).
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="longDescription">Description</label>
                <textarea
                  id="longDescription"
                  value={formData.longDescription}
                  onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                  rows={8}
                  placeholder="Detailed product information, features, usage notes, warranties, etc."
                />
              </div>

              <div className="form-group">
                <label htmlFor="specs">Specifications (key: value per line)</label>
                <textarea
                  id="specs"
                  value={formData.specsText}
                  onChange={(e) => setFormData({ ...formData, specsText: e.target.value })}
                  rows={6}
                  placeholder={"Brand: Samsung\nSize: 55\"\nResolution: 4K\nPanel: QLED"}
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  <span>Featured Product</span>
                </label>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  />
                  <span>In Stock</span>
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
