import { Link } from 'react-router-dom';
import '../styles/ProductCard.css';
const ProductCard = ({ product }) => {
  return (
    <div className=\"product-card\">
      <Link to={/product/}>
        <div className=\"product-image\">
          <img src={product.images[0]} alt={product.name} />
          {product.isBestseller && <span className=\"bestseller-badge\">BESTSELLER</span>}
        </div>
        <div className=\"product-info\">
          <h3>{product.name}</h3>
          <p className=\"price\">£{product.price}</p>
          <button className=\"add-to-bag\">ADD TO BAG</button>
        </div>
      </Link>
    </div>
  );
};
export default ProductCard;
