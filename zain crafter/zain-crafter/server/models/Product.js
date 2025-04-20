const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
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
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  comparePrice: {
    type: Number,
    min: 0
  },
  images: [
    {
      url: String,
      alt: String
    }
  ],
  videos: [
    {
      url: String,
      thumbnail: String
    }
  ],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  featured: {
    type: Boolean,
    default: false
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  variants: [
    {
      name: String,
      options: [
        {
          value: String,
          price: Number,
          stock: Number
        }
      ]
    }
  ],
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create slug from name before saving
ProductSchema.pre('save', function(next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', ProductSchema);