const Order = require('../models/Order');
const Product = require('../models/Product');
const { updateGoogleSheet } = require('../utils/googleSheets');
const { sendWhatsAppNotification } = require('../utils/whatsapp');
const SiteSettings = require('../models/SiteSettings');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Check if all items are in stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `${product.name} is out of stock. Only ${product.stock} available.` 
        });
      }
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems.map(item => ({
        product: item.product,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        variant: item.variant,
        image: item.image
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice
    });

    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // Get site settings for notifications
    const siteSettings = await SiteSettings.findOne();

    // Save order details to Google Sheets if enabled
    if (siteSettings?.googleSheets?.enabled && siteSettings?.googleSheets?.sheetId) {
      try {
        await updateGoogleSheet(order, req.user);
      } catch (error) {
        console.error('Google Sheets update error:', error);
        // Continue even if Google Sheets fails
      }
    }

    // Send WhatsApp notifications if enabled
    if (siteSettings?.notifications?.sellerWhatsapp?.enabled && 
        siteSettings?.notifications?.sellerWhatsapp?.number) {
      try {
        await sendWhatsAppNotification({
          to: siteSettings.notifications.sellerWhatsapp.number,
          type: 'new-order',
          data: { order, user: req.user }
        });
        
        // Mark notification as sent
        order.notificationSent.seller = true;
        await order.save();
      } catch (error) {
        console.error('WhatsApp notification error:', error);
        // Continue even if notification fails
      }
    }
    
    // Send WhatsApp confirmation to customer if enabled
    if (siteSettings?.notifications?.customerWhatsapp?.enabled && 
        shippingAddress.phone) {
      try {
        await sendWhatsAppNotification({
          to: shippingAddress.phone,
          type: 'order-confirmation',
          data: { order }
        });
        
        // Mark notification as sent
        order.notificationSent.customer = true;
        await order.save();
      } catch (error) {
        console.error('Customer WhatsApp notification error:', error);
        // Continue even if notification fails
      }
    }

    // Return success with order details
    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('items.product');
      
    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is authorized to view this order
    if (
      order.user._id.toString() !== req.user._id.toString() && 
      req.user.role !== 'seller' && 
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name image');
    
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Update order payment status
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      updateTime: req.body.update_time,
      email: req.body.payer.email_address
    };
    
    const updatedOrder = await order.save();
    
    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, notes } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Only allow seller or admin to update status
    if (req.user.role !== 'seller' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update order status' });
    }
    
    order.status = status || order.status;
    
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    
    if (notes) {
      order.notes = notes;
    }
    
    // If status is delivered, update delivered status
    if (status === 'delivered' && !order.isDelivered) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    
    const updatedOrder = await order.save();
    
    // Get site settings for notifications
    const siteSettings = await SiteSettings.findOne();
    
    // Send WhatsApp status update to customer if enabled and number exists
    if (
      siteSettings?.notifications?.customerWhatsapp?.enabled && 
      order.shippingAddress.phone && 
      status !== order.status
    ) {
      try {
        await sendWhatsAppNotification({
          to: order.shippingAddress.phone,
          type: 'order-status-update',
          data: { order: updatedOrder }
        });
      } catch (error) {
        console.error('Customer status notification error:', error);
        // Continue even if notification fails
      }
    }
    
    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};