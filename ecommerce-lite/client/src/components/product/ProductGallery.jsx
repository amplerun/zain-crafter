import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

const ProductGallery = ({ images }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  // Mock data - replace with actual images from props
  const productImages = [
    'https://via.placeholder.com/800x800/FF6B6B/FFFFFF?text=Product+1',
    'https://via.placeholder.com/800x800/4ECDC4/FFFFFF?text=Product+2',
    'https://via.placeholder.com/800x800/FFE66D/000000?text=Product+3',
    'https://via.placeholder.com/800x800/FF8E8E/FFFFFF?text=Product+4'
  ];

  return (
    <div className="space-y-4">
      {/* Main image slider */}
      <Swiper
        style={{
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff',
        }}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="rounded-lg overflow-hidden"
      >
        {productImages.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              <img
                src={image}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail slider */}
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="thumbnail-slider"
      >
        {productImages.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="aspect-square bg-gray-100 rounded-md overflow-hidden cursor-pointer">
              <img
                src={image}
                alt={`Product Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductGallery;
