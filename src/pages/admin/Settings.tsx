import { useUser, useAuth } from '@clerk/clerk-react';
import AdminLayout from '../../components/AdminLayout';
import { useAdmin } from '../../contexts/AdminContext';
import { setGitHubToken, clearGitHubToken, hasGitHubToken, verifyToken } from '../../services/githubService';
import { useState } from 'react';

const WRITE_API_BASE = import.meta.env.VITE_WRITE_API_BASE as string;

export default function Settings() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { products, offers, filters } = useAdmin();
  const HAS_API = !!import.meta.env.VITE_WRITE_API_BASE;
  const [tokenInput, setTokenInput] = useState('');
  const [tokenStatus, setTokenStatus] = useState<null | { ok: boolean; msg: string }>(null);
  const [writeStatus, setWriteStatus] = useState<null | { ok: boolean; msg: string }>(null);
  const [writePending, setWritePending] = useState(false);

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
              <span className="info-label">Auth Provider:</span>
              <span className="info-value">Clerk</span>
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
            <h3>System Information</h3>
            <div className="info-row">
              <span className="info-label">CMS Version:</span>
              <span className="info-value">MaxCMS 1.0</span>
            </div>
            <div className="info-row">
              <span className="info-label">Storage:</span>
              <span className="info-value">GitHub API (JSON)</span>
            </div>
            <div className="info-row">
              <span className="info-label">Authentication:</span>
              <span className="info-value">Clerk</span>
            </div>
            <div className="info-row">
              <span className="info-label">Platform:</span>
              <span className="info-value">React + TypeScript</span>
            </div>
            <div className="info-row">
              <span className="info-label">GitHub Token:</span>
              <span className="info-value">{HAS_API ? 'Managed by API' : (hasGitHubToken() ? 'Configured (session)' : 'Not set')}</span>
            </div>
          </div>

          <div className="settings-card">
            <h3>Data Management</h3>
            <p className="settings-description">
              All content is stored in GitHub repository as JSON files. Each change creates a commit in your repository.
            </p>
            {!HAS_API && (
            <div className="token-box" style={{marginTop: '0.75rem'}}>
              <label style={{display:'block', marginBottom: '0.5rem', fontWeight:600}}>GitHub Fine-Grained Token (session only)</label>
              <input
                type="password"
                placeholder="Paste token with access to Maxnate-Africa/swai-electronics-testing"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                style={{width:'100%', padding:'0.75rem', border:'2px solid #e0e0e0', borderRadius:8, fontFamily:'inherit'}}
              />
              <div className="button-group" style={{marginTop:'0.5rem', display:'flex', gap:'0.5rem', flexWrap:'wrap'}}>
                <button
                  className="btn-primary"
                  onClick={async () => {
                    if (!tokenInput) { setTokenStatus({ ok:false, msg:'Please paste a token' }); return; }
                    try {
                      setGitHubToken(tokenInput);
                      const user = await verifyToken();
                      setTokenStatus({ ok:true, msg:`Token OK for @${user?.login}` });
                    } catch (e) {
                      clearGitHubToken();
                      setTokenStatus({ ok:false, msg: e instanceof Error ? e.message : 'Invalid token' });
                    }
                  }}
                >Save Token</button>
                <button
                  className="btn-secondary"
                  onClick={() => { clearGitHubToken(); setTokenStatus({ ok:true, msg:'Token cleared from session' }); }}
                >Clear Token</button>
                <button
                  className="btn-secondary"
                  onClick={async () => {
                    try {
                      const u = await verifyToken();
                      if (u) setTokenStatus({ ok:true, msg:`Token OK for @${u.login}` });
                      else setTokenStatus({ ok:false, msg:'No token set' });
                    } catch (e) {
                      setTokenStatus({ ok:false, msg: e instanceof Error ? e.message : 'Token invalid' });
                    }
                  }}
                >Verify</button>
              </div>
              {tokenStatus && (
                <p style={{marginTop:'0.5rem', color: tokenStatus.ok ? '#198754' : '#dc3545'}}>{tokenStatus.msg}</p>
              )}
              <p className="settings-description" style={{marginTop:'0.5rem'}}>
                Recommended scopes: Repository access limited to <code>Maxnate-Africa/swai-electronics-testing</code> with <strong>Contents: Read and Write</strong>.
                The token is kept in <strong>sessionStorage</strong> and cleared on logout/browser close.
              </p>
            </div>
            )}
            <div className="button-group">
              <button className="btn-secondary" onClick={() => {
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
                Export Data
              </button>
            </div>
          </div>

          {/* Test Write Card */}
          {HAS_API && (
            <div className="settings-card">
              <h3>Test Worker Write</h3>
              <p className="settings-description">
                Click the button below to perform a test write to the GitHub repo via the Cloudflare Worker.
                This verifies your Clerk authentication and Worker allowlist are configured correctly.
              </p>
              <div className="button-group" style={{ marginTop: '1rem' }}>
                <button
                  className="btn-primary"
                  disabled={writePending}
                  onClick={async () => {
                    setWritePending(true);
                    setWriteStatus(null);
                    try {
                      // Get standard Clerk JWT (no custom template needed)
                      const token = await getToken();
                      if (!token) throw new Error('Could not get Clerk token. Are you signed in?');
                      const res = await fetch(`${WRITE_API_BASE}/update-file`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          owner: 'Maxnate-Africa',
                          repo: 'swai-electronics-testing',
                          path: 'public/data/test-write.json',
                          message: 'test write via CMS Settings UI',
                          content: JSON.stringify({
                            source: 'CMS Settings',
                            user: user?.primaryEmailAddress?.emailAddress || 'unknown',
                            ts: new Date().toISOString(),
                          }, null, 2),
                        }),
                      });
                      const data = await res.json();
                      if (res.ok) {
                        setWriteStatus({ ok: true, msg: `Success! Commit: ${data.commit}` });
                      } else {
                        // Show debug info if available (for allowlist troubleshooting)
                        let errorMsg = data.error || `HTTP ${res.status}`;
                        if (data.debug) {
                          errorMsg += `\n\nDebug Info:\nUser ID: ${data.debug.userId || 'N/A'}\nEmails: ${JSON.stringify(data.debug.emails) || 'N/A'}`;
                          if (data.debug.allClaims) {
                            errorMsg += `\n\nAll JWT Claims:\n${JSON.stringify(data.debug.allClaims, null, 2)}`;
                          }
                        }
                        setWriteStatus({ ok: false, msg: errorMsg });
                      }
                    } catch (e) {
                      setWriteStatus({ ok: false, msg: e instanceof Error ? e.message : 'Unknown error' });
                    } finally {
                      setWritePending(false);
                    }
                  }}
                >
                  {writePending ? 'Writing…' : 'Test Write'}
                </button>
              </div>
              {writeStatus && (
                <div style={{ marginTop: '0.75rem', color: writeStatus.ok ? '#198754' : '#dc3545', fontWeight: 500, whiteSpace: 'pre-wrap', fontFamily: writeStatus.ok ? 'inherit' : 'monospace', fontSize: writeStatus.ok ? 'inherit' : '0.9em' }}>
                  {writeStatus.msg}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
