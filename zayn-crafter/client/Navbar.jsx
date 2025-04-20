import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
const Navbar = () => {
  return (
    <nav className=\"navbar\">
      <div className=\"navbar-left\">
        <Link to=\"/\" className=\"logo\">Zayn Crafter</Link>
        <div className=\"search-bar\">
          <input type=\"text\" placeholder=\"Search product, shade, colour\" />
        </div>
      </div>
      <div className=\"navbar-center\">
        <Link to=\"/new\">NEW IN</Link>
        <Link to=\"/makeup\">MAKEUP</Link>
        <Link to=\"/skincare\">SKINCARE</Link>
        <Link to=\"/bestsellers\">BEST SELLERS</Link>
        <Link to=\"/fragrance\">FRAGRANCE</Link>
        <Link to=\"/gifts\">GIFTS</Link>
      </div>
      <div className=\"navbar-right\">
        <Link to=\"/account\">Account</Link>
        <Link to=\"/cart\">Bag (0)</Link>
      </div>
    </nav>
  );
};
export default Navbar;
