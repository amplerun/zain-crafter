const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Fetch all products with pagination
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.page) || 1;
    
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};
      
    const count = await Product.countDocuments({ ...keyword, active: true });
    
    const products = await Product.find({ ...keyword, active: true })
      .sort({ createdAt: -1 })
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    
    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/id/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Fetch single product by slug
// @route   GET /api/products/:slug
// @access  Public
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, active: true })
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Fetch featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 6;
    
    const products = await Product.find({ featured: true, active: true })
      .sort({ createdAt: -1 })
      .populate('category', 'name slug')
      .limit(limit);
    
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Fetch products by category
// @route   GET /api/products/category/:categorySlug
// @access  Public
exports.getProductsByCategory = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.page) || 1;
    
    // Find category by slug
    const category = await Category.findOne({ slug: req.params.categorySlug });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Find all subcategories of this category
    const subcategories = await Category.find({ parent: category._id });
    const subcategoryIds = subcategories.map(sub => sub._id);
    
    // Find products in this category or its subcategories
    const query = {
      $or: [
        { category: category._id },
        { subcategory: { $in: subcategoryIds } }
      ],
      active: true
    };
    
    const count = await Product.countDocuments(query);
    
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    
    res.json({
      products,
      category,
      subcategories,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
exports.searchProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.page) || 1;
    const { keyword, category, minPrice, maxPrice, sort } = req.query;
    
    // Build query
    const query = { active: true };
    
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }
    
    if (category) {
      const categoryObj = await Category.findOne({ slug: category });
      if (categoryObj) {
        query.category = categoryObj._id;
      }
    }
    
    if (minPrice !== undefined) {
      query.price = { ...query.price, $gte: Number(minPrice) };
    }
    
    if (maxPrice !== undefined) {
      query.price = { ...query.price, $lte: Number(maxPrice) };
    }
    
    // Determine sort order
    let sortOption = { createdAt: -1 }; // Default: newest first
    
    if (sort === 'price-asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price-desc') {
      sortOption = { price: -1 };
    } else if (sort === 'name-asc') {
      sortOption = { name: 1 };
    } else if (sort === 'name-desc') {
      sortOption = { name: -1 };
    }
    
    const count = await Product.countDocuments(query);
    
    const products = await Product.find(query)
      .sort(sortOption)
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    
    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};