const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      name: String,
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      price: {
        type: Number,
        required: true,
        min: 0
      },
      variant: {
        name: String,
        value: String
      },
      image: String
    }
  ],
  shippingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phone: String
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cod', 'online', 'paypal', 'other']
  },
  paymentResult: {
    id: String,
    status: String,
    updateTime: String,
    email: String
  },
  itemsPrice: {
    type: Number,
    required: true,
    min: 0
  },
  shippingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  taxPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  notificationSent: {
    seller: {
      type: Boolean,
      default: false
    },
    customer: {
      type: Boolean,
      default: false
    }
  },
  trackingNumber: String,
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);