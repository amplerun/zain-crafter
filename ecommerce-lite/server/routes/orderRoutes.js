const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/auth');

router.route('/')
  .post(protect, orderController.createOrder)
  .get(protect, admin, orderController.getOrders);

router.route('/myorders').get(protect, orderController.getMyOrders);
router.route('/:id').get(protect, orderController.getOrderById);
router.route('/:id/pay').put(protect, orderController.updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, orderController.updateOrderToDelivered);

module.exports = router;
