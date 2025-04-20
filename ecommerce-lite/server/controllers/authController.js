const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Customer = require('../models/Customer');
const admin = require('firebase-admin');

// @desc    Authenticate user with Google
// @route   POST /api/auth/google
// @access  Public
exports.googleAuth = asyncHandler(async (req, res) => {
  const { token } = req.body;
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { email, name, picture } = decodedToken;
    
    let customer = await Customer.findOne({ email });
    
    if (!customer) {
      customer = new Customer({
        email,
        name,
        avatar: picture,
        authMethod: 'google'
      });
      await customer.save();
    }
    
    const authToken = generateToken(customer._id);
    
    res.json({
      _id: customer._id,
      name: customer.name,
      email: customer.email,
      avatar: customer.avatar,
      token: authToken
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// @desc    Authenticate user with Phone
// @route   POST /api/auth/phone
// @access  Public
exports.phoneAuth = asyncHandler(async (req, res) => {
  const { token } = req.body;
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { phone_number } = decodedToken;
    
    let customer = await Customer.findOne({ phone: phone_number });
    
    if (!customer) {
      customer = new Customer({
        phone: phone_number,
        authMethod: 'phone'
      });
      await customer.save();
    }
    
    const authToken = generateToken(customer._id);
    
    res.json({
      _id: customer._id,
      phone: customer.phone,
      token: authToken
    });
  } catch (error) {
    console.error('Phone auth error:', error);
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
exports.getUserProfile = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.user.id).select('-password');
  
  if (!customer) {
    res.status(404);
    throw new Error('User not found');
  }
  
  res.json(customer);
});

// @desc    Update user profile
// @route   PUT /api/auth/me
// @access  Private
exports.updateUserProfile = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.user.id);
  
  if (!customer) {
    res.status(404);
    throw new Error('User not found');
  }
  
  customer.name = req.body.name || customer.name;
  customer.email = req.body.email || customer.email;
  customer.phone = req.body.phone || customer.phone;
  customer.address = req.body.address || customer.address;
  
  if (req.body.password) {
    customer.password = req.body.password;
  }
  
  const updatedCustomer = await customer.save();
  
  res.json({
    _id: updatedCustomer._id,
    name: updatedCustomer.name,
    email: updatedCustomer.email,
    phone: updatedCustomer.phone,
    address: updatedCustomer.address
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logoutUser = asyncHandler(async (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};
