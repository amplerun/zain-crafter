const express = require('express');
const router = express.Router();
const { 
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderToPaid,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.post('/', createOrder);
router.get('/myorders', getUserOrders);
router.get('/:id', getOrderById);
router.put('/:id/pay', updateOrderToPaid);
router.put('/:id/status', updateOrderStatus);

module.exports = router;