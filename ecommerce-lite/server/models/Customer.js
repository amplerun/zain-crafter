const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String },
  email: { 
    type: String, 
    unique: true,
    sparse: true
  },
  phone: {
    type: String,
    unique: true,
    sparse: true
  },
  password: { type: String },
  avatar: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String }
  },
  authMethod: { 
    type: String, 
    enum: ['google', 'phone', 'email'], 
    required: true 
  },
  isAdmin: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Customer', customerSchema);
