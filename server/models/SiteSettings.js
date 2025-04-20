const mongoose = require('mongoose');

const SiteSettingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    required: true,
    default: 'Zain Crafter'
  },
  logo: {
    url: String,
    alt: String
  },
  favicon: String,
  accentColor: {
    type: String,
    default: '#3B82F6'  // Default blue color
  },
  secondaryColor: {
    type: String,
    default: '#1E40AF'
  },
  about: {
    type: String,
    default: 'Welcome to our online store.'
  },
  contact: {
    email: String,
    phone: String,
    whatsapp: String,
    address: String
  },
  social: {
    facebook: String,
    instagram: String,
    twitter: String,
    youtube: String
  },
  footer: {
    text: String,
    links: [
      {
        text: String,
        url: String
      }
    ]
  },
  faq: [
    {
      question: String,
      answer: String
    }
  ],
  notifications: {
    sellerWhatsapp: {
      enabled: {
        type: Boolean,
        default: true
      },
      number: String  // Seller's WhatsApp number
    },
    customerWhatsapp: {
      enabled: {
        type: Boolean,
        default: true
      }
    }
  },
  googleSheets: {
    enabled: {
      type: Boolean,
      default: true
    },
    sheetId: String
  },
  metaTags: {
    title: String,
    description: String,
    keywords: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema);