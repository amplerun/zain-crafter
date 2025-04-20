import { useState } from 'react';
import { FaMinus, FaPlus, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const AddToCart = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.discountedPrice || product.price,
      image: product.images[0],
      quantity,
      stock: product.stock
    });
  };

  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity > 0 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => handleQuantityChange(-1)}
          className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
          disabled={quantity <= 1}
        >
          <FaMinus size={14} />
        </button>
        <span className="text-lg font-medium w-8 text-center">{quantity}</span>
        <button 
          onClick={() => handleQuantityChange(1)}
          className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
          disabled={quantity >= product.stock}
        >
          <FaPlus size={14} />
        </button>
        <span className="text-sm text-gray-500">{product.stock} available</span>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={handleAddToCart}
          className="flex-1 flex items-center justify-center space-x-2 py-3 px-6 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
        >
          <FaShoppingCart />
          <span>Add to Bag</span>
        </button>
        <button className="p-3 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors">
          <FaHeart />
        </button>
      </div>

      {!user && (
        <div className="text-sm text-gray-500">
          <Link to="/login" className="text-primary-500 hover:underline">Login</Link> to earn rewards points
        </div>
      )}
    </div>
  );
};

export default AddToCart;
