import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import './App.css';

function App() {
  return (
    <div className="app">
      <header>
        <div className="container">
          <h1>Swai Electronics</h1>
          <p>Premium Quality Electronics in Mwanza</p>
        </div>
      </header>
      
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </main>
      
      <footer>
        <div className="container">
          <p>&copy; 2025 Swai Electronics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
