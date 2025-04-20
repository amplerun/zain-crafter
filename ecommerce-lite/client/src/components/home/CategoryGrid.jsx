import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const CategoryGrid = () => {
  const { theme } = useTheme();

  const categories = [
    {
      id: 1,
      name: 'Makeup',
      image: 'https://via.placeholder.com/600x600/FF6B6B/FFFFFF?text=Makeup',
      link: '/makeup'
    },
    {
      id: 2,
      name: 'Skincare',
      image: 'https://via.placeholder.com/600x600/4ECDC4/FFFFFF?text=Skincare',
      link: '/skincare'
    },
    {
      id: 3,
      name: 'Fragrance',
      image: 'https://via.placeholder.com/600x600/FFE66D/000000?text=Fragrance',
      link: '/fragrance'
    },
    {
      id: 4,
      name: 'Gifts',
      image: 'https://via.placeholder.com/600x600/FF8E8E/FFFFFF?text=Gifts',
      link: '/gifts'
    }
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center" style={{ color: theme.primaryColor }}>
          Shop By Category
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              to={category.link} 
              key={category.id} 
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-square">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <h3 className="text-2xl font-bold text-white group-hover:text-primary-300 transition-colors">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
