const express = require('express');
const router = express.Router();
const { 
  addProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
  getSellerOrders,
  updateSiteSettings,
  addCategory,
  updateCategory,
  deleteCategory,
  uploadProductImage,
  getCustomers,
  updateOrderStatus
} = require('../controllers/sellerController');
const { protect, sellerOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All routes are protected and for sellers only
router.use(protect);
router.use(sellerOnly);

// Product routes
router.get('/products', getSellerProducts);
router.post('/products', upload.array('images', 5), addProduct);
router.put('/products/:id', upload.array('images', 5), updateProduct);
router.delete('/products/:id', deleteProduct);
router.post('/products/upload', upload.single('image'), uploadProductImage);

// Order routes
router.get('/orders', getSellerOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Customer routes
router.get('/customers', getCustomers);

// Site settings routes
router.put('/site-settings', upload.single('logo'), updateSiteSettings);

// Category routes
router.post('/categories', upload.single('icon'), addCategory);
router.put('/categories/:id', upload.single('icon'), updateCategory);
router.delete('/categories/:id', deleteCategory);

module.exports = router;