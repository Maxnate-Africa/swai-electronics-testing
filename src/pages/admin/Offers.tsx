import { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import AdminLayout from '../../components/AdminLayout';
import type { Offer } from '../../types';

export default function Offers() {
  const { offers, addOffer, updateOffer, deleteOffer } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    discount: '',
    expiry: '',
    description: '',
    active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingOffer) {
      updateOffer(editingOffer.id, formData);
    } else {
      addOffer(formData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      discount: '',
      expiry: '',
      description: '',
      active: true,
    });
    setEditingOffer(null);
    setShowModal(false);
  };

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      discount: offer.discount,
      expiry: offer.expiry,
      description: offer.description || '',
      active: offer.active !== false,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this offer?')) {
      deleteOffer(id);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-section">
        <div className="section-header">
          <h2>Special Offers Management</h2>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Offer
          </button>
        </div>

        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Discount</th>
                <th>Expiry Date</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-state">No offers found. Create your first offer!</td>
                </tr>
              ) : (
                offers.map((offer) => (
                  <tr key={offer.id}>
                    <td>{offer.title}</td>
                    <td><span className="badge badge-discount">{offer.discount}</span></td>
                    <td>{offer.expiry}</td>
                    <td className="description-cell">{offer.description || '-'}</td>
                    <td>
                      <span className={`badge ${offer.active !== false ? 'badge-active' : 'badge-inactive'}`}>
                        {offer.active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon" onClick={() => handleEdit(offer)} title="Edit">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button className="btn-icon btn-danger" onClick={() => handleDelete(offer.id)} title="Delete">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingOffer ? 'Edit Offer' : 'Add New Offer'}</h3>
              <button className="modal-close" onClick={resetForm}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="title">Offer Title *</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g., Summer Sale"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="discount">Discount *</label>
                  <input
                    type="text"
                    id="discount"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    required
                    placeholder="e.g., 20% OFF"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="expiry">Expiry Date *</label>
                  <input
                    type="date"
                    id="expiry"
                    value={formData.expiry}
                    onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Optional offer details..."
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  />
                  <span>Active Offer</span>
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingOffer ? 'Update Offer' : 'Add Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
