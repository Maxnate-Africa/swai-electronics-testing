import { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import type { Filters } from '../../types';
import './Filters.css';

export default function FiltersManagement() {
  const { filters, updateFilters, loading } = useAdmin();
  const [editedFilters, setEditedFilters] = useState<Filters>(filters);
  const [newCategory, setNewCategory] = useState('');
  const [saving, setSaving] = useState(false);

  // Sync editedFilters when filters load from GitHub
  useEffect(() => {
    setEditedFilters(filters);
  }, [filters]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateFilters(editedFilters);
      alert('Filters updated successfully!');
    } catch {
      alert('Failed to update filters');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCategory = () => {
    const name = newCategory.trim();
    if (!name) return;
    setEditedFilters(prev => {
      const exists = prev.categories.some(c => c.toLowerCase() === name.toLowerCase());
      if (exists) return prev;
      return {
        ...prev,
        categories: [...prev.categories, name]
      };
    });
    setNewCategory('');
  };

  const handleRemoveCategory = (category: string) => {
    setEditedFilters({
      ...editedFilters,
      categories: editedFilters.categories.filter(c => c !== category)
    });
  };

  const handleMoveCategory = (index: number, direction: 'up' | 'down') => {
    const newCategories = [...editedFilters.categories];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < newCategories.length) {
      [newCategories[index], newCategories[newIndex]] = [newCategories[newIndex], newCategories[index]];
      setEditedFilters({
        ...editedFilters,
        categories: newCategories
      });
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading filters...</div>;
  }

  return (
    <div className="filters-page">
      <div className="filters-header">
        <h1>Filter Settings</h1>
        <button 
          className="save-btn" 
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="filters-sections">
        {/* Display Options */}
        <section className="filter-section">
          <h2>Display Options</h2>
          
          <div className="filter-option">
            <label>
              <input
                type="checkbox"
                checked={editedFilters.show_all_link}
                onChange={e => setEditedFilters({
                  ...editedFilters,
                  show_all_link: e.target.checked
                })}
              />
              Show "All Products" Filter
            </label>
          </div>

          {editedFilters.show_all_link && (
            <div className="filter-input">
              <label htmlFor="all-label">"All Products" Label:</label>
              <input
                id="all-label"
                type="text"
                value={editedFilters.all_label}
                onChange={e => setEditedFilters({
                  ...editedFilters,
                  all_label: e.target.value
                })}
                placeholder="All Products"
              />
            </div>
          )}

          <div className="filter-option">
            <label>
              <input
                type="checkbox"
                checked={editedFilters.show_sale_filter}
                onChange={e => setEditedFilters({
                  ...editedFilters,
                  show_sale_filter: e.target.checked
                })}
              />
              Show "On Sale" Filter
            </label>
          </div>

          {editedFilters.show_sale_filter && (
            <div className="filter-input">
              <label htmlFor="sale-label">"On Sale" Label:</label>
              <input
                id="sale-label"
                type="text"
                value={editedFilters.sale_label}
                onChange={e => setEditedFilters({
                  ...editedFilters,
                  sale_label: e.target.value
                })}
                placeholder="On Sale"
              />
            </div>
          )}
        </section>

        {/* Categories */}
        <section className="filter-section">
          <h2>Product Categories</h2>
          
          <div className="add-category">
            <input
              type="text"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
              placeholder="Add new category..."
            />
            <button type="button" onClick={handleAddCategory} className="add-btn">
              Add Category
            </button>
          </div>

          <div className="categories-list">
            {editedFilters.categories.length === 0 ? (
              <p className="no-categories">No categories yet. Add one above.</p>
            ) : (
              editedFilters.categories.map((category, index) => (
                <div key={category} className="category-item">
                  <span className="category-name">{category}</span>
                  <div className="category-actions">
                    <button
                      onClick={() => handleMoveCategory(index, 'up')}
                      disabled={index === 0}
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handleMoveCategory(index, 'down')}
                      disabled={index === editedFilters.categories.length - 1}
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => handleRemoveCategory(category)}
                      className="delete-btn"
                      title="Remove category"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
