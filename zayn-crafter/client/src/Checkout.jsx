import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Checkout.css';
const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'United Kingdom'
  });
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get('/api/cart');
        setCart(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching cart:', err);
      }
    };
    fetchCart();
  }, []);
  const handleAddressChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value
    });
  };
  const handleContactChange = (e) => {
    setContact({
      ...contact,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        items: cart.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
          shade: item.shade,
          size: item.size
        })),
        total: cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
        shippingAddress: address,
        contact: contact
      };
      const res = await axios.post('/api/orders', orderData);
      navigate(/order-confirmation/);
    } catch (err) {
      console.error('Error placing order:', err);
    }
  };
  if (loading) return <div className=\"loading-spinner\">Loading...</div>;
  return (
    <div className=\"checkout-page\">
      <div className=\"checkout-form\">
        <h2>Shipping Information</h2>
        <form onSubmit={handleSubmit}>
          <div className=\"form-section\">
            <h3>Contact Details</h3>
            <div className=\"form-group\">
              <label>Full Name</label>
              <input
                type=\"text\"
                name=\"name\"
                value={contact.name}
                onChange={handleContactChange}
                required
              />
            </div>
            <div className=\"form-group\">
              <label>Email</label>
              <input
                type=\"email\"
                name=\"email\"
                value={contact.email}
                onChange={handleContactChange}
                required
              />
            </div>
            <div className=\"form-group\">
              <label>Phone Number</label>
              <input
                type=\"tel\"
                name=\"phone\"
                value={contact.phone}
                onChange={handleContactChange}
                required
              />
            </div>
          </div>
          <div className=\"form-section\">
            <h3>Shipping Address</h3>
            <div className=\"form-group\">
              <label>Street Address</label>
              <input
                type=\"text\"
                name=\"street\"
                value={address.street}
                onChange={handleAddressChange}
                required
              />
            </div>
            <div className=\"form-group\">
              <label>City</label>
              <input
                type=\"text\"
                name=\"city\"
                value={address.city}
                onChange={handleAddressChange}
                required
              />
            </div>
            <div className=\"form-group\">
              <label>State/Region</label>
              <input
                type=\"text\"
                name=\"state\"
                value={address.state}
                onChange={handleAddressChange}
              />
            </div>
            <div className=\"form-group\">
              <label>Postal Code</label>
              <input
                type=\"text\"
                name=\"zip\"
                value={address.zip}
                onChange={handleAddressChange}
                required
              />
            </div>
            <div className=\"form-group\">
              <label>Country</label>
              <select
                name=\"country\"
                value={address.country}
                onChange={handleAddressChange}
              >
                <option value=\"United Kingdom\">United Kingdom</option>
                <option value=\"United States\">United States</option>
                <option value=\"Canada\">Canada</option>
                <option value=\"Australia\">Australia</option>
                <option value=\"Other\">Other</option>
              </select>
            </div>
          </div>
          <button type=\"submit\" className=\"place-order-btn\">
            Place Order
          </button>
        </form>
      </div>
      <div className=\"order-summary\">
        <h2>Your Order</h2>
        <div className=\"order-items\">
          {cart.map(item => (
            <div key={${item.product._id}-} className=\"order-item\">
              <img src={item.product.images[0]} alt={item.product.name} />
              <div className=\"item-details\">
                <h4>{item.product.name}</h4>
                {item.shade && <p>Shade: {item.shade}</p>}
                <p>Qty: {item.quantity}</p>
                <p>£{(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className=\"order-totals\">
          <div className=\"total-row\">
            <span>Subtotal</span>
            <span>£{cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toFixed(2)}</span>
          </div>
          <div className=\"total-row\">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className=\"total-row grand-total\">
            <span>Total</span>
            <span>£{cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Checkout;
