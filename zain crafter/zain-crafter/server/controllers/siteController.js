const SiteSettings = require('../models/SiteSettings');
const Category = require('../models/Category');

// @desc    Get site settings
// @route   GET /api/site/settings
// @access  Public
exports.getSiteSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    
    // Create default settings if none exist
    if (!settings) {
      settings = await SiteSettings.create({
        siteName: 'Zain Crafter',
        accentColor: '#3B82F6',
        about: 'Welcome to our online store.'
      });
    }
    
    // Remove sensitive information
    const publicSettings = {
      siteName: settings.siteName,
      logo: settings.logo,
      favicon: settings.favicon,
      accentColor: settings.accentColor,
      secondaryColor: settings.secondaryColor,
      about: settings.about,
      contact: {
        email: settings.contact?.email,
        phone: settings.contact?.phone,
        address: settings.contact?.address
      },
      social: settings.social,
      footer: settings.footer,
      metaTags: settings.metaTags
    };
    
    res.json(publicSettings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all categories
// @route   GET /api/site/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    // Get parent categories
    const parentCategories = await Category.find({ 
      parent: null, 
      active: true 
    }).sort({ order: 1 });
    
    // Get all categories for building the tree
    const allCategories = await Category.find({ active: true });
    
    // Build category tree
    const categoryTree = parentCategories.map(parent => {
      const children = allCategories.filter(
        cat => cat.parent && cat.parent.toString() === parent._id.toString()
      );
      
      return {
        _id: parent._id,
        name: parent.name,
        slug: parent.slug,
        icon: parent.icon,
        displayInNavbar: parent.displayInNavbar,
        displayInSidebar: parent.displayInSidebar,
        order: parent.order,
        children: children.map(child => ({
          _id: child._id,
          name: child.name,
          slug: child.slug,
          icon: child.icon,
          displayInNavbar: child.displayInNavbar,
          displayInSidebar: child.displayInSidebar,
          order: child.order
        }))
      };
    });
    
    res.json(categoryTree);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get FAQs
// @route   GET /api/site/faqs
// @access  Public
exports.getFaqs = async (req, res) => {
  try {
    const settings = await SiteSettings.findOne();
    
    if (!settings || !settings.faq) {
      return res.json([]);
    }
    
    res.json(settings.faq);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get contact info
// @route   GET /api/site/contact
// @access  Public
exports.getContactInfo = async (req, res) => {
  try {
    const settings = await SiteSettings.findOne();
    
    if (!settings || !settings.contact) {
      return res.json({});
    }
    
    const contactInfo = {
      email: settings.contact.email,
      phone: settings.contact.phone,
      address: settings.contact.address,
      social: settings.social
    };
    
    res.json(contactInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};