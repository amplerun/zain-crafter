import { useState } from 'react';
import '../styles/Carousel.css';
const Carousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };
  return (
    <div className=\"carousel\">
      <button className=\"carousel-button prev\" onClick={prevSlide}>&#10094;</button>
      <div className=\"carousel-track\">
        {items.map((item, index) => (
          <div 
            key={item._id}
            className={carousel-slide }
          >
            <img src={item.images[0]} alt={item.name} />
            <div className=\"slide-info\">
              <h3>{item.name}</h3>
              <p>£{item.price}</p>
              <button>ADD TO BAG</button>
            </div>
          </div>
        ))}
      </div>
      <button className=\"carousel-button next\" onClick={nextSlide}>&#10095;</button>
      <div className=\"carousel-dots\">
        {items.map((_, index) => (
          <span 
            key={index}
            className={dot }
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};
export default Carousel;
