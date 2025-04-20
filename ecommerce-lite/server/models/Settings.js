const mongoose = require('mongoose');

const socialMediaSchema = new mongoose.Schema({
  facebook: { type: String, default: '' },
  instagram: { type: String, default: '' },
  twitter: { type: String, default: '' },
  youtube: { type: String, default: '' },
  linkedin: { type: String, default: '' }
});

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
});

const settingsSchema = new mongoose.Schema({
  storeName: { type: String, default: 'My Store' },
  logo: { type: String, default: '' },
  primaryColor: { type: String, default: '#4F46E5' },
  secondaryColor: { type: String, default: '#10B981' },
  accentColor: { type: String, default: '#F59E0B' },
  whatsappNotifications: { type: Boolean, default: true },
  currency: { type: String, default: 'USD' },
  currencySymbol: { type: String, default: '$' },
  shippingFee: { type: Number, default: 0 },
  taxRate: { type: Number, default: 0 },
  aboutUs: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
  contactPhone: { type: String, default: '' },
  address: { type: String, default: '' },
  socialMedia: socialMediaSchema,
  faqs: [faqSchema]
});

module.exports = mongoose.model('Settings', settingsSchema);
