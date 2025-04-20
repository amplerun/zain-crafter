import { Link } from 'react-router-dom';
import { FaStar, FaRegStar, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart({
      id: product._id,
      name: product.name,
      price: product.discountedPrice || product.price,
      image: product.images[0],
      quantity: 1,
      stock: product.stock
    });
  };
  
  return (
    <Link 
      to={`/product/${product._id}`} 
      className="group block overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.discountedPrice && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Sale
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{product.name}</h3>
        
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            i < 4 ? <FaStar key={i} className="text-yellow-400" /> : <FaRegStar key={i} className="text-yellow-400" />
          ))}
          <span className="text-xs text-gray-500 ml-1">(24)</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            {product.discountedPrice ? (
              <>
                <span className="text-lg font-bold text-gray-900">${product.discountedPrice.toFixed(2)}</span>
                <span className="text-sm text-gray-500 line-through ml-2">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
            )}
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="p-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
            aria-label="Add to cart"
          >
            <FaShoppingCart size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
