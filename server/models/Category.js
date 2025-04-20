const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String
  },
  icon: {
    type: String  // Icon or symbol for the category
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null  // null means top-level category
  },
  displayInNavbar: {
    type: Boolean,
    default: false
  },
  displayInSidebar: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0  // For sorting
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create slug from name
CategorySchema.pre('save', function(next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Category', CategorySchema);