import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const HeroCarousel = ({ offers }) => {
  const { theme } = useTheme();

  const slides = [
    {
      id: 1,
      title: 'New Collection',
      subtitle: 'Discover the latest trends',
      image: 'https://via.placeholder.com/1200x500/FF6B6B/FFFFFF?text=New+Collection',
      cta: 'Shop Now',
      link: '/new-arrivals'
    },
    {
      id: 2,
      title: 'Summer Sale',
      subtitle: 'Up to 50% off',
      image: 'https://via.placeholder.com/1200x500/4ECDC4/FFFFFF?text=Summer+Sale',
      cta: 'Discover Offers',
      link: '/offers'
    },
    {
      id: 3,
      title: 'Best Sellers',
      subtitle: 'Shop customer favorites',
      image: 'https://via.placeholder.com/1200x500/FFE66D/000000?text=Best+Sellers',
      cta: 'View All',
      link: '/bestsellers'
    }
  ];

  return (
    <div className="relative mt-16">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-96 md:h-[500px] w-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center">
                <div className="container mx-auto px-4 text-white">
                  <h2 className="text-4xl md:text-6xl font-bold mb-2">{slide.title}</h2>
                  <p className="text-xl md:text-2xl mb-6">{slide.subtitle}</p>
                  <Link
                    to={slide.link}
                    className="inline-block px-8 py-3 font-medium rounded-full hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    {slide.cta}
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroCarousel;
