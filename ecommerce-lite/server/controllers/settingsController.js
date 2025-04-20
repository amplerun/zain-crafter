const Settings = require('../models/Settings');
const asyncHandler = require('express-async-handler');
const { bucket } = require('../config/firebase');

// @desc    Get store settings
// @route   GET /api/settings
// @access  Public
exports.getSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.findOne();
  
  if (!settings) {
    // Return default settings if none exist
    return res.json({
      storeName: 'My Store',
      logo: '',
      primaryColor: '#4F46E5',
      secondaryColor: '#10B981',
      accentColor: '#F59E0B',
      whatsappNotifications: true,
      currency: 'USD',
      currencySymbol: '$',
      shippingFee: 0,
      taxRate: 0,
      aboutUs: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      socialMedia: {
        facebook: '',
        instagram: '',
        twitter: ''
      },
      faqs: []
    });
  }
  
  res.json(settings);
});

// @desc    Update store settings
// @route   PUT /api/settings
// @access  Private/Admin
exports.updateSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  
  if (!settings) {
    settings = new Settings(req.body);
  } else {
    settings.storeName = req.body.storeName || settings.storeName;
    settings.primaryColor = req.body.primaryColor || settings.primaryColor;
    settings.secondaryColor = req.body.secondaryColor || settings.secondaryColor;
    settings.accentColor = req.body.accentColor || settings.accentColor;
    settings.whatsappNotifications = req.body.whatsappNotifications !== undefined 
      ? req.body.whatsappNotifications 
      : settings.whatsappNotifications;
    settings.currency = req.body.currency || settings.currency;
    settings.currencySymbol = req.body.currencySymbol || settings.currencySymbol;
    settings.shippingFee = req.body.shippingFee || settings.shippingFee;
    settings.taxRate = req.body.taxRate || settings.taxRate;
    settings.aboutUs = req.body.aboutUs || settings.aboutUs;
    settings.contactEmail = req.body.contactEmail || settings.contactEmail;
    settings.contactPhone = req.body.contactPhone || settings.contactPhone;
    settings.address = req.body.address || settings.address;
    settings.socialMedia = req.body.socialMedia || settings.socialMedia;
    settings.faqs = req.body.faqs || settings.faqs;
  }
  
  // Handle logo upload
  if (req.file) {
    // Delete old logo if exists
    if (settings.logo) {
      const oldFileName = settings.logo.split('/').pop().split('?')[0];
      try {
        await bucket.file(`logos/${oldFileName}`).delete();
      } catch (error) {
        console.error('Error deleting old logo:', error);
      }
    }
    
    // Upload new logo
    const fileName = `logos/${Date.now()}_${req.file.originalname}`;
    const fileUpload = bucket.file(fileName);
    
    await fileUpload.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
      },
    });
    
    // Get public URL
    const [url] = await fileUpload.getSignedUrl({
      action: 'read',
      expires: '03-09-2491',
    });
    
    settings.logo = url;
  }
  
  const updatedSettings = await settings.save();
  res.json(updatedSettings);
});
