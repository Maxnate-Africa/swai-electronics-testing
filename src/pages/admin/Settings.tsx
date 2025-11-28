import { useUser } from '@clerk/clerk-react';
import AdminLayout from '../../components/AdminLayout';
import { useAdmin } from '../../contexts/AdminContext';

export default function Settings() {
  const { user } = useUser();
  const { products, offers, filters } = useAdmin();

  const stats = {
    totalProducts: products.length,
    activeOffers: offers.filter(o => o.active !== false).length,
    totalCategories: filters.categories.length,
    featuredProducts: products.filter(p => p.featured).length,
  };

  return (
    <AdminLayout>
      <div className="admin-section">
        <div className="section-header">
          <h2>Settings & Information</h2>
        </div>

        <div className="settings-grid">
          <div className="settings-card">
            <h3>Account Information</h3>
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{user?.primaryEmailAddress?.emailAddress}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Name:</span>
              <span className="info-value">{user?.fullName || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Member Since:</span>
              <span className="info-value">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>

          <div className="settings-card">
            <h3>Content Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{stats.totalProducts}</div>
                <div className="stat-label">Total Products</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.featuredProducts}</div>
                <div className="stat-label">Featured Products</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.activeOffers}</div>
                <div className="stat-label">Active Offers</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.totalCategories}</div>
                <div className="stat-label">Product Categories</div>
              </div>
            </div>
          </div>

          <div className="settings-card">
            <h3>Website Information</h3>
            <div className="info-row">
              <span className="info-label">Site Name:</span>
              <span className="info-value">Swai Electronics</span>
            </div>
            <div className="info-row">
              <span className="info-label">CMS Version:</span>
              <span className="info-value">1.0</span>
            </div>
            <div className="info-row">
              <span className="info-label">Live Site:</span>
              <span className="info-value">
                <a href="https://maxnate-africa.github.io/swai-electronics-testing/" target="_blank" rel="noopener noreferrer" style={{color:'#007bff'}}>
                  View Site
                </a>
              </span>
            </div>
          </div>

          <div className="settings-card">
            <h3>Data Backup</h3>
            <p className="settings-description">
              Export all your content data (products, offers, filters) as a JSON backup file.
            </p>
            <div className="button-group" style={{marginTop:'1rem'}}>
              <button className="btn-primary" onClick={() => {
                const data = {
                  products,
                  offers,
                  filters,
                  exportDate: new Date().toISOString(),
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `swai-electronics-backup-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}>
                Export Backup
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
