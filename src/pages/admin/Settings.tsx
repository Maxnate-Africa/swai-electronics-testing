import { useUser } from '@clerk/clerk-react';
import AdminLayout from '../../components/AdminLayout';
import { useAdmin } from '../../contexts/AdminContext';
import * as githubService from '../../services/githubService';

export default function Settings() {
  const { user } = useUser();
  const { products, offers, filters } = useAdmin();
  const { refreshData } = useAdmin();

  function parseCSV(text: string): Array<Record<string,string>> {
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length === 0) return [];
    const header = lines[0].split(',').map(h => h.trim());
    const rows: Array<Record<string,string>> = [];
    for (let i = 1; i < lines.length; i++) {
      const row = [] as string[];
      let cur = '';
      let inQuotes = false;
      const line = lines[i];
      for (let j = 0; j < line.length; j++) {
        const ch = line[j];
        if (ch === '"') {
          if (inQuotes && line[j+1] === '"') { cur += '"'; j++; }
          else { inQuotes = !inQuotes; }
        } else if (ch === ',' && !inQuotes) {
          row.push(cur); cur = '';
        } else {
          cur += ch;
        }
      }
      row.push(cur);
      const obj: Record<string,string> = {};
      header.forEach((h, idx) => { obj[h] = (row[idx] ?? '').trim(); });
      rows.push(obj);
    }
    return rows;
  }

  function rowsToProducts(rows: Array<Record<string,string>>): any[] {
    return rows.map(r => ({
      id: r.id || Date.now().toString() + Math.random().toString().slice(2),
      title: r.title,
      category: r.category,
      price: r.price ? Number(r.price) : 0,
      sale_price: r.sale_price ? Number(r.sale_price) : undefined,
      image: r.image || '',
      description: r.description || '',
      featured: String(r.featured).toLowerCase() === 'true',
      stock: r.stock ? Number(r.stock) : undefined,
      created_at: r.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
  }

  // CSV import is limited to Products only; offers CSV mapping removed.

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
              Export all your content data (products, offers, filters) as a JSON backup file. You can also import from Excel via CSV, but CSV import is supported for <strong>Products only</strong>. Offers and Filters must be imported via JSON.
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
              <button className="btn-secondary" style={{marginLeft:'0.5rem'}} onClick={() => {
                const headers = [
                  'title','category','price','sale_price','image','description','featured','stock','id','created_at'
                ];
                const example = 'Samsung TV 55";televisions;850000;750000;/assets/images/tv.jpg;4K Smart TV;true;10;;\n';
                const csv = headers.join(',') + '\n' + example.replace(/;/g, ',');
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'products-template.csv';
                a.click();
                URL.revokeObjectURL(url);
              }}>
                Download Products CSV Template
              </button>

              <label className="btn-secondary" style={{marginLeft:'0.5rem', cursor:'pointer'}}>
                Import Backup (JSON or Products CSV)
                <input
                  type="file"
                  accept="application/json,.json,text/csv,.csv"
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const text = await file.text();
                      if (file.name.toLowerCase().endsWith('.csv')) {
                        const rows = parseCSV(text);
                        if (!rows.length) throw new Error('CSV has no data');
                        // Determine type by headers
                        const headers = Object.keys(rows[0]).map(h => h.toLowerCase());
                        if (!(headers.includes('category') && headers.includes('price'))) {
                          throw new Error('CSV import is supported for Products only. Use JSON to import Offers and Filters.');
                        }
                        const payload: githubService.BackupPayload = {
                          products: rowsToProducts(rows),
                          offers: await githubService.getOffers(),
                          filters: await githubService.getFilters(),
                        };
                        await githubService.importBackup(payload);
                      } else {
                        const parsed = JSON.parse(text);
                        if (!parsed || typeof parsed !== 'object') throw new Error('Invalid JSON');
                        if (!('products' in parsed) || !('offers' in parsed) || !('filters' in parsed)) {
                          throw new Error('Backup must include products, offers, and filters');
                        }
                        await githubService.importBackup(parsed);
                      }
                      await refreshData();
                      alert('Import completed successfully. Data has been updated.');
                    } catch (err) {
                      alert(`Failed to import backup: ${err instanceof Error ? err.message : String(err)}`);
                    } finally {
                      e.target.value = '';
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
