import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/ProductPage.css';
const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedShade, setSelectedShade] = useState('');
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(/api/products/);
        setProduct(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
      }
    };
    fetchProduct();
  }, [id]);
  if (loading) return <div className=\"loading-spinner\">Loading...</div>;
  if (!product) return <div>Product not found</div>;
  return (
    <div className=\"product-page\">
      <div className=\"product-images\">
        {product.images.map((img, index) => (
          <img key={index} src={img} alt={product.name} />
        ))}
      </div>
      <div className=\"product-details\">
        <h1>{product.name}</h1>
        <p className=\"price\">£{product.price}</p>
        <p className=\"description\">{product.description}</p>
        {product.options?.shades?.length > 0 && (
          <div className=\"shade-selector\">
            <h3>Shades</h3>
            <div className=\"shade-options\">
              {product.options.shades.map(shade => (
                <div 
                  key={shade.name}
                  className={shade-option }
                  style={{ backgroundColor: shade.hexCode }}
                  onClick={() => setSelectedShade(shade.name)}
                  title={shade.name}
                />
              ))}
            </div>
          </div>
        )}
        <div className=\"quantity-selector\">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>
        <button className=\"add-to-bag\">ADD TO BAG</button>
        <button className=\"buy-now\">BUY NOW</button>
      </div>
    </div>
  );
};
export default ProductPage;
