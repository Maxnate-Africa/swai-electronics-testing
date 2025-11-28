import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Products from './pages/admin/Products';
import Offers from './pages/admin/Offers';
import Filters from './pages/admin/Filters';
import Settings from './pages/admin/Settings';
import { AdminProvider } from './contexts/AdminContext';
import './App.css';
import './admin.css';

// Get Clerk publishable key from environment
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY environment variable');
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn afterSignInUrl={location.pathname} afterSignUpUrl={location.pathname} />
      </SignedOut>
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={
        <div className="app">
          <main>
            <Home />
          </main>
          
          <footer>
            <div className="footer-inner">
              <div className="footer-col">
                <img
                  src={`${import.meta.env.BASE_URL}logo.svg`}
                  alt="Swai Electronics"
                  className="footer-logo"
                />
                <p>Tanzania's trusted electronics store for premium TVs, audio, and home appliances. Genuine products, competitive prices, and nationwide delivery.</p>
              </div>
              <div className="footer-col">
                <h4>Contact</h4>
                <ul>
                  <li>Phone/WhatsApp: <a href="tel:+255685129530">+255 685 129 530</a></li>
                  <li>Email: <a href="mailto:info@swaielectronics.co.tz">info@swaielectronics.co.tz</a></li>
                  <li>Head Office: Mwanza, Tanzania</li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Hours & Service</h4>
                <ul>
                  <li>Mon–Sat: 08:00 – 18:00</li>
                  <li>Sun: Closed</li>
                  <li>Nationwide delivery to all 26 regions</li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Follow Us</h4>
                <div className="social-icons" aria-label="Social media links">
                  <a href="https://www.facebook.com/swaielectronics" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12.07C22 6.5 17.52 2 12 2S2 6.5 2 12.07c0 5 3.66 9.13 8.44 9.93v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.48-3.89 3.76-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.58v1.9h2.78l-.44 2.9h-2.34v7.03C18.34 21.2 22 17.07 22 12.07Z"/></svg>
                  </a>
                  <a href="https://www.instagram.com/swaielectronics" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z"/><circle cx="17.5" cy="6.5" r="1"/></svg>
                  </a>
                  <a href="https://twitter.com/swaielectronics" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2h3.314l-7.24 8.273L22 22h-6.422l-4.98-6.455L4.8 22H1.485l7.73-8.833L2 2h6.578l4.508 5.993L18.244 2Zm-2.244 18h1.833L8.146 4H6.21l9.79 16Z"/></svg>
                  </a>
                  <a href="https://www.linkedin.com/company/swaielectronics" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.5 8h4v14h-4V8Zm7.5 0h3.83v2.05h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.67 4.8 6.14V22h-4v-6.14c0-1.46-.03-3.34-2.03-3.34-2.04 0-2.35 1.6-2.35 3.24V22h-4V8Z"/></svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="footer-bottom">
              <p className="footer-legal">&copy; 2025 Swai Electronics. All rights reserved. Designed by <a href="https://www.maxnate.com" target="_blank" rel="noopener noreferrer">Maxnate</a></p>
            </div>
          </footer>
        </div>
      } />
      <Route path="/products/:id" element={
        <div className="app">
          <header className="simple-header">
            <div className="container">
              <a href={`${import.meta.env.BASE_URL}`} className="back-home">← Back to Products</a>
              <h1>Swai Electronics</h1>
            </div>
          </header>
          
          <main>
            <ProductDetail />
          </main>
          
          <footer>
            <div className="footer-inner">
              <div className="footer-col">
                <img
                  src={`${import.meta.env.BASE_URL}logo.svg`}
                  alt="Swai Electronics"
                  className="footer-logo"
                />
                <p>Tanzania's trusted electronics store for premium TVs, audio, and home appliances. Genuine products, competitive prices, and nationwide delivery.</p>
              </div>
              <div className="footer-col">
                <h4>Contact</h4>
                <ul>
                  <li>Phone/WhatsApp: <a href="tel:+255685129530">+255 685 129 530</a></li>
                  <li>Email: <a href="mailto:info@swaielectronics.co.tz">info@swaielectronics.co.tz</a></li>
                  <li>Head Office: Mwanza, Tanzania</li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Hours & Service</h4>
                <ul>
                  <li>Mon–Sat: 08:00 – 18:00</li>
                  <li>Sun: Closed</li>
                  <li>Nationwide delivery to all 26 regions</li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Follow Us</h4>
                <div className="social-icons" aria-label="Social media links">
                  <a href="https://www.facebook.com/swaielectronics" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12.07C22 6.5 17.52 2 12 2S2 6.5 2 12.07c0 5 3.66 9.13 8.44 9.93v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.48-3.89 3.76-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.58v1.9h2.78l-.44 2.9h-2.34v7.03C18.34 21.2 22 17.07 22 12.07Z"/></svg>
                  </a>
                  <a href="https://www.instagram.com/swaielectronics" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z"/><circle cx="17.5" cy="6.5" r="1"/></svg>
                  </a>
                  <a href="https://twitter.com/swaielectronics" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2h3.314l-7.24 8.273L22 22h-6.422l-4.98-6.455L4.8 22H1.485l7.73-8.833L2 2h6.578l4.508 5.993L18.244 2Zm-2.244 18h1.833L8.146 4H6.21l9.79 16Z"/></svg>
                  </a>
                  <a href="https://www.linkedin.com/company/swaielectronics" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.5 8h4v14h-4V8Zm7.5 0h3.83v2.05h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.67 4.8 6.14V22h-4v-6.14c0-1.46-.03-3.34-2.03-3.34-2.04 0-2.35 1.6-2.35 3.24V22h-4V8Z"/></svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="footer-bottom">
              <p className="footer-legal">&copy; 2025 Swai Electronics. All rights reserved. Designed by <a href="https://www.maxnate.com" target="_blank" rel="noopener noreferrer">Maxnate</a></p>
            </div>
          </footer>
        </div>
      } />

      {/* Admin Routes - Protected by Clerk */}
      <Route path="/admin/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
      <Route path="/admin/offers" element={<ProtectedRoute><Offers /></ProtectedRoute>} />
      <Route path="/admin/filters" element={<ProtectedRoute><Filters /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/admin" element={<Navigate to="/admin/products" />} />
    </Routes>
  );
}

function ClerkProviderWithRoutes() {
  const navigate = useNavigate();
  
  return (
    <ClerkProvider 
      publishableKey={CLERK_PUBLISHABLE_KEY}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
    >
      <AdminProvider>
        <AppRoutes />
      </AdminProvider>
    </ClerkProvider>
  );
}

function App() {
  return <ClerkProviderWithRoutes />;
}

export default App;
