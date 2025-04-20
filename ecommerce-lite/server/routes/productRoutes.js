const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, admin } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.route('/')
  .get(productController.getAllProducts)
  .post(protect, admin, upload.array('images', 10), productController.createProduct);

router.route('/featured').get(productController.getFeaturedProducts);
router.route('/categories').get(productController.getProductCategories);

router.route('/:id')
  .get(productController.getProductById)
  .put(protect, admin, upload.array('images', 10), productController.updateProduct)
  .delete(protect, admin, productController.deleteProduct);

module.exports = router;
