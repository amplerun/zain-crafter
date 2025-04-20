import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../client/src/context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products/List';
import EditProduct from './pages/Products/Edit';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Settings from './pages/Settings';
import Appearance from './pages/Appearance';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex h-screen bg-gray-100">
          <Sidebar />
          <div className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/edit/:id" element={<EditProduct />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/appearance" element={<Appearance />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
