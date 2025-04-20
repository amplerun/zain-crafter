import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBox, FaShoppingBag, FaUsers, FaCog, FaPalette } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-gray-800 text-white h-full fixed">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
      </div>
      
      <nav className="p-4 space-y-2">
        <Link
          to="/"
          className={`flex items-center space-x-2 p-2 rounded ${isActive('/') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
        >
          <FaHome />
          <span>Dashboard</span>
        </Link>
        
        <Link
          to="/products"
          className={`flex items-center space-x-2 p-2 rounded ${isActive('/products') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
        >
          <FaBox />
          <span>Products</span>
        </Link>
        
        <Link
          to="/orders"
          className={`flex items-center space-x-2 p-2 rounded ${isActive('/orders') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
        >
          <FaShoppingBag />
          <span>Orders</span>
        </Link>
        
        <Link
          to="/customers"
          className={`flex items-center space-x-2 p-2 rounded ${isActive('/customers') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
        >
          <FaUsers />
          <span>Customers</span>
        </Link>
        
        <Link
          to="/settings"
          className={`flex items-center space-x-2 p-2 rounded ${isActive('/settings') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
        >
          <FaCog />
          <span>Settings</span>
        </Link>
        
        <Link
          to="/appearance"
          className={`flex items-center space-x-2 p-2 rounded ${isActive('/appearance') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
        >
          <FaPalette />
          <span>Appearance</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
