const express = require('express');
const router = express.Router();
const { 
  getProducts,
  getProductById,
  getProductBySlug, 
  getFeaturedProducts,
  getProductsByCategory,
  searchProducts
} = require('../controllers/productController');

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/search', searchProducts);
router.get('/category/:categorySlug', getProductsByCategory);
router.get('/id/:id', getProductById);
router.get('/:slug', getProductBySlug);

module.exports = router;