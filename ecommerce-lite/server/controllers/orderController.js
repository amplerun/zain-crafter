const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendOrderConfirmation, notifySeller } = require('../services/whatsapp360');
const { updateGoogleSheet } = require('../services/googleSheets');
const asyncHandler = require('express-async-handler');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res) => {
  const { 
    orderItems, 
    shippingAddress, 
    paymentMethod, 
    itemsPrice, 
    taxPrice, 
    shippingPrice, 
    totalPrice 
  } = req.body;
  
  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }
  
  // Verify products and calculate prices
  const items = await Promise.all(
    orderItems.map(async (item) => {
      const product = await Product.findById(item.product);
      
      if (!product) {
        res.status(404);
        throw new Error(`Product not found: ${item.product}`);
      }
      
      if (product.stock < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for: ${product.name}`);
      }
      
      // Update product stock
      product.stock -= item.quantity;
      await product.save();
      
      return {
        name: product.name,
        quantity: item.quantity,
        image: product.images[0],
        price: product.discountedPrice || product.price,
        product: item.product
      };
    })
  );
  
  const order = new Order({
    user: req.user._id,
    orderItems: items,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });
  
  const createdOrder = await order.save();
  
  // Send WhatsApp notifications
  try {
    await sendOrderConfirmation({
      ...createdOrder.toObject(),
      customer: {
        name: req.user.name,
        phone: req.user.phone
      }
    });
    
    await notifySeller({
      ...createdOrder.toObject(),
      customer: {
        name: req.user.name,
        phone: req.user.phone
      }
    });
  } catch (error) {
    console.error('WhatsApp notification error:', error);
  }
  
  // Update Google Sheets
  try {
    await updateGoogleSheet('orders', [
      createdOrder._id,
      new Date().toISOString(),
      req.user.name || req.user.email || req.user.phone,
      createdOrder.totalPrice,
      createdOrder.orderItems.map(item => item.name).join(', '),
      createdOrder.shippingAddress
    ]);
  } catch (error) {
    console.error('Google Sheets update error:', error);
  }
  
  res.status(201).json(createdOrder);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  
  // Check if the order belongs to the user or if user is admin
  if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized');
  }
  
  res.json(order);
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  
  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer.email_address
  };
  
  const updatedOrder = await order.save();
  
  res.json(updatedOrder);
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
exports.updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  
  const updatedOrder = await order.save();
  
  res.json(updatedOrder);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});
