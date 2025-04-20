const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const User = require('../models/User');
const SiteSettings = require('../models/SiteSettings');
const fs = require('fs');
const path = require('path');

// @desc    Get seller products
// @route   GET /api/seller/products
// @access  Private/Seller
exports.getSellerProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.page) || 1;
    
    const count = await Product.countDocuments({});
    
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    
    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add new product
// @route   POST /api/seller/products
// @access  Private/Seller
exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      comparePrice,
      category,
      subcategory,
      featured,
      stock,
      variants
    } = req.body;
    
    // Process uploaded images
    const images = req.files ? req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      alt: name
    })) : [];
    
    // Parse variants if they exist
    let parsedVariants = [];
    if (variants) {
      parsedVariants = typeof variants === 'string' 
        ? JSON.parse(variants) 
        : variants;
    }
    
    const product = await Product.create({
      name,
      description,
      price,
      comparePrice: comparePrice || null,
      images,
      category: category || null,
      subcategory: subcategory || null,
      featured: featured === 'true',
      stock: Number(stock) || 0,
      variants: parsedVariants
    });
    
    const populatedProduct = await Product.findById(product._id)
      .populate('category', 'name')
      .populate('subcategory', 'name');
    
    res.status(201).json(populatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/seller/products/:id
// @access  Private/Seller
exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      comparePrice,
      category,
      subcategory,
      featured,
      stock,
      variants,
      removeImages
    } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Process uploaded images
    let updatedImages = [...product.images];
    
    // Remove images if specified
    if (removeImages) {
      const imagesToRemove = typeof removeImages === 'string' 
        ? [removeImages] 
        : removeImages;
      
      // Delete files from server
      imagesToRemove.forEach(imageUrl => {
        const imagePath = path.join(__dirname, '..', imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
      
      // Filter out removed images
      updatedImages = updatedImages.filter(
        img => !imagesToRemove.includes(img.url)
      );
    }
    
    // Add new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        alt: name || product.name
      }));
      
      updatedImages = [...updatedImages, ...newImages];
    }
    
    // Parse variants if they exist
    let parsedVariants = product.variants;
    if (variants) {
      parsedVariants = typeof variants === 'string' 
        ? JSON.parse(variants) 
        : variants;
    }
    
    // Update product
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? Number(price) : product.price;
    product.comparePrice = comparePrice !== undefined 
      ? Number(comparePrice) || null 
      : product.comparePrice;
    product.images = updatedImages;
    product.category = category || product.category;
    product.subcategory = subcategory || product.subcategory;
    product.featured = featured !== undefined ? featured === 'true' : product.featured;
    product.stock = stock !== undefined ? Number(stock) : product.stock;
    product.variants = parsedVariants;
    product.updatedAt = Date.now();
    
    const updatedProduct = await product.save();
    
    const populatedProduct = await Product.findById(updatedProduct._id)
      .populate('category', 'name')
      .populate('subcategory', 'name');
    
    res.json(populatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/seller/products/:id
// @access  Private/Seller
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete product images
    product.images.forEach(image => {
      const imagePath = path.join(__dirname, '..', image.url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });
    
    await product.remove();
    
    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Upload product image
// @route   POST /api/seller/products/upload
// @access  Private/Seller
exports.uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      url: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get seller orders
// @route   GET /api/seller/orders
// @access  Private/Seller
exports.getSellerOrders = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.page) || 1;
    const status = req.query.status || null;
    
    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }
    
    const count = await Order.countDocuments(query);
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'name email phone')
      .populate('items.product', 'name')
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    
    res.json({
      orders,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/seller/orders/:id/status
// @access  Private/Seller
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, notes } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
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
    // Continuing sellerController.js...

// @desc    Get customers
// @route   GET /api/seller/customers
// @access  Private/Seller
exports.getCustomers = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.page) || 1;
    
    const count = await User.countDocuments({ role: 'customer' });
    
    const customers = await User.find({ role: 'customer' })
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    
    res.json({
      customers,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update site settings
// @route   PUT /api/seller/site-settings
// @access  Private/Seller
exports.updateSiteSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    
    // Create settings if they don't exist
    if (!settings) {
      settings = new SiteSettings({});
    }
    
    // Update site name and basic settings
    if (req.body.siteName) settings.siteName = req.body.siteName;
    if (req.body.accentColor) settings.accentColor = req.body.accentColor;
    if (req.body.secondaryColor) settings.secondaryColor = req.body.secondaryColor;
    if (req.body.about) settings.about = req.body.about;
    
    // Update logo if uploaded
    if (req.file) {
      settings.logo = {
        url: `/uploads/${req.file.filename}`,
        alt: req.body.siteName || settings.siteName
      };
    }
    
    // Update contact info
    if (req.body.contactEmail || req.body.contactPhone || req.body.contactAddress || req.body.contactWhatsapp) {
      settings.contact = {
        email: req.body.contactEmail || settings.contact?.email,
        phone: req.body.contactPhone || settings.contact?.phone,
        address: req.body.contactAddress || settings.contact?.address,
        whatsapp: req.body.contactWhatsapp || settings.contact?.whatsapp,
      };
    }
    
    // Update social links
    if (req.body.socialFacebook || req.body.socialInstagram || req.body.socialTwitter || req.body.socialYoutube) {
      settings.social = {
        facebook: req.body.socialFacebook || settings.social?.facebook,
        instagram: req.body.socialInstagram || settings.social?.instagram,
        twitter: req.body.socialTwitter || settings.social?.twitter,
        youtube: req.body.socialYoutube || settings.social?.youtube,
      };
    }
    
    // Update footer
    if (req.body.footerText) {
      settings.footer = {
        text: req.body.footerText,
        links: settings.footer?.links || []
      };
    }
    
    // Update footer links if provided
    if (req.body.footerLinks) {
      let footerLinks;
      try {
        footerLinks = JSON.parse(req.body.footerLinks);
      } catch (e) {
        footerLinks = settings.footer?.links || [];
      }
      
      settings.footer = {
        ...settings.footer,
        links: footerLinks
      };
    }
    
    // Update FAQs if provided
    if (req.body.faqs) {
      let faqs;
      try {
        faqs = JSON.parse(req.body.faqs);
      } catch (e) {
        faqs = settings.faq || [];
      }
      
      settings.faq = faqs;
    }
    
    // Update notification settings
    if (req.body.hasOwnProperty('enableSellerWhatsapp')) {
      settings.notifications = {
        ...settings.notifications,
        sellerWhatsapp: {
          enabled: req.body.enableSellerWhatsapp === 'true',
          number: req.body.sellerWhatsappNumber || settings.notifications?.sellerWhatsapp?.number
        }
      };
    }
    
    if (req.body.hasOwnProperty('enableCustomerWhatsapp')) {
      settings.notifications = {
        ...settings.notifications,
        customerWhatsapp: {
          enabled: req.body.enableCustomerWhatsapp === 'true'
        }
      };
    }
    
    // Update Google Sheets settings
    if (req.body.hasOwnProperty('enableGoogleSheets')) {
      settings.googleSheets = {
        enabled: req.body.enableGoogleSheets === 'true',
        sheetId: req.body.googleSheetsId || settings.googleSheets?.sheetId
      };
    }
    
    // Update meta tags
    if (req.body.metaTitle || req.body.metaDescription || req.body.metaKeywords) {
      settings.metaTags = {
        title: req.body.metaTitle || settings.metaTags?.title,
        description: req.body.metaDescription || settings.metaTags?.description,
        keywords: req.body.metaKeywords || settings.metaTags?.keywords
      };
    }
    
    const updatedSettings = await settings.save();
    
    res.json(updatedSettings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add new category
// @route   POST /api/seller/categories
// @access  Private/Seller
exports.addCategory = async (req, res) => {
  try {
    const {
      name,
      description,
      parent,
      displayInNavbar,
      displayInSidebar,
      order
    } = req.body;
    
    // Check if category name already exists
    const categoryExists = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    });
    
    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    
    // Process uploaded icon
    const icon = req.file ? `/uploads/${req.file.filename}` : null;
    
    const category = await Category.create({
      name,
      description,
      icon,
      parent: parent || null,
      displayInNavbar: displayInNavbar === 'true',
      displayInSidebar: displayInSidebar === 'true',
      order: Number(order) || 0
    });
    
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update category
// @route   PUT /api/seller/categories/:id
// @access  Private/Seller
exports.updateCategory = async (req, res) => {
  try {
    const {
      name,
      description,
      parent,
      displayInNavbar,
      displayInSidebar,
      order,
      removeIcon
    } = req.body;
    
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Process icon
    let updatedIcon = category.icon;
    
    // Remove icon if specified
    if (removeIcon === 'true' && category.icon) {
      const iconPath = path.join(__dirname, '..', category.icon);
      if (fs.existsSync(iconPath)) {
        fs.unlinkSync(iconPath);
      }
      updatedIcon = null;
    }
    
    // Add new icon
    if (req.file) {
      // Delete old icon if exists
      if (category.icon) {
        const iconPath = path.join(__dirname, '..', category.icon);
        if (fs.existsSync(iconPath)) {
          fs.unlinkSync(iconPath);
        }
      }
      
      updatedIcon = `/uploads/${req.file.filename}`;
    }
    
    // Update category
    category.name = name || category.name;
    category.description = description || category.description;
    category.icon = updatedIcon;
    category.parent = parent === '' ? null : parent || category.parent;
    category.displayInNavbar = displayInNavbar !== undefined ? displayInNavbar === 'true' : category.displayInNavbar;
    category.displayInSidebar = displayInSidebar !== undefined ? displayInSidebar === 'true' : category.displayInSidebar;
    category.order = order !== undefined ? Number(order) : category.order;
    
    const updatedCategory = await category.save();
    
    res.json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete category
// @route   DELETE /api/seller/categories/:id
// @access  Private/Seller
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if category has child categories
    const childCategories = await Category.countDocuments({ parent: category._id });
    
    if (childCategories > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category with subcategories. Please delete subcategories first.' 
      });
    }
    
    // Check if category has products
    const products = await Product.countDocuments({ 
      $or: [
        { category: category._id },
        { subcategory: category._id }
      ]
    });
    
    if (products > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category with products. Please reassign or delete products first.' 
      });
    }
    
    // Delete icon if exists
    if (category.icon) {
      const iconPath = path.join(__dirname, '..', category.icon);
      if (fs.existsSync(iconPath)) {
        fs.unlinkSync(iconPath);
      }
    }
    
    await category.remove();
    
    res.json({ message: 'Category removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};