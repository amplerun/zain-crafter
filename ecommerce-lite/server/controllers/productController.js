const Product = require('../models/Product');
const { bucket } = require('../config/firebase');
const { updateGoogleSheet } = require('../services/googleSheets');
const asyncHandler = require('express-async-handler');
const admin = require('firebase-admin');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getAllProducts = asyncHandler(async (req, res) => {
  const { category, featured, search, sort } = req.query;
  
  let query = {};
  
  if (category) {
    query.category = category;
  }
  
  if (featured) {
    query.isFeatured = featured === 'true';
  }
  
  if (search) {
    query. = [
      { name: { : search, : 'i' } },
      { description: { : search, : 'i' } }
    ];
  }
  
  let sortOption = { createdAt: -1 };
  
  if (sort) {
    const sortFields = sort.split(',').join(' ');
    sortOption = sortFields;
  }
  
  const products = await Product.find(query).sort(sortOption);
  res.json(products);
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  res.json(product);
});

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, subCategory, stock, isFeatured, features, discountedPrice } = req.body;
  
  if (!req.files || !req.files.images) {
    res.status(400);
    throw new Error('Please upload at least one image');
  }
  
  // Upload images to Firebase Storage
  const imageUrls = await Promise.all(
    req.files.images.map(async (file) => {
      const fileName = `products/${Date.now()}_${file.originalname}`;
      const fileUpload = bucket.file(fileName);
      
      await fileUpload.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });
      
      // Get public URL
      const [url] = await fileUpload.getSignedUrl({
        action: 'read',
        expires: '03-09-2491', // Far future date
      });
      
      return url;
    })
  );
  
  const product = new Product({
    name,
    description,
    price,
    discountedPrice,
    category,
    subCategory,
    stock,
    isFeatured,
    features: features ? features.split(',') : [],
    images: imageUrls,
  });
  
  const createdProduct = await product.save();
  
  // Update Google Sheets
  await updateGoogleSheet('products', [
    createdProduct.name,
    createdProduct.price,
    createdProduct.category,
    new Date().toISOString()
  ]);
  
  res.status(201).json(createdProduct);
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, subCategory, stock, isFeatured, features, discountedPrice } = req.body;
  
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  let imageUrls = product.images;
  
  // If new images are uploaded
  if (req.files && req.files.images) {
    // First delete old images from Firebase
    await Promise.all(
      product.images.map(async (imageUrl) => {
        const fileName = imageUrl.split('/').pop().split('?')[0];
        try {
          await bucket.file(`products/${fileName}`).delete();
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      })
    );
    
    // Upload new images
    imageUrls = await Promise.all(
      req.files.images.map(async (file) => {
        const fileName = `products/${Date.now()}_${file.originalname}`;
        const fileUpload = bucket.file(fileName);
        
        await fileUpload.save(file.buffer, {
          metadata: {
            contentType: file.mimetype,
          },
        });
        
        // Get public URL
        const [url] = await fileUpload.getSignedUrl({
          action: 'read',
          expires: '03-09-2491',
        });
        
        return url;
      })
    );
  }
  
  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.discountedPrice = discountedPrice !== undefined ? discountedPrice : product.discountedPrice;
  product.category = category || product.category;
  product.subCategory = subCategory || product.subCategory;
  product.stock = stock || product.stock;
  product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
  product.features = features ? features.split(',') : product.features;
  product.images = imageUrls;
  
  const updatedProduct = await product.save();
  
  res.json(updatedProduct);
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  // Delete images from Firebase
  await Promise.all(
    product.images.map(async (imageUrl) => {
      const fileName = imageUrl.split('/').pop().split('?')[0];
      try {
        await bucket.file(`products/${fileName}`).delete();
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    })
  );
  
  await product.remove();
  
  res.json({ message: 'Product removed' });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true }).limit(8);
  res.json(products);
});

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
exports.getProductCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');
  res.json(categories);
});
