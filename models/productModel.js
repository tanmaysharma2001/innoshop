const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require('validator');

const productSchema = new mongoose.Schema({
  addition_time: {
    type: Date,
    default: Date.now(),
    select: false
  },
  name: {
    type: String,
    required: [true, 'A product must have a name!'],
    unique: true,
    trim: true,
    maxlength: [40, 'A product name must have less than or equal to 40 characters.'],
    minLength: [10, 'A product name must have more than or equal to 10 characters.'],
    validate: [validator.isAlpha, 'Product name must only contain characters.']
  },
  slug: String,
  price: {
    type: Number,
    required: [true, 'A product must have a price!'],
    min: [10, 'Product price must be above or equal to 10']
  },
  type: {
    type: String,
    required: [true, 'A product must be of some type!'],
    enum: {
      values: ['sweatshirt', 'T-shirt', 'bag', 'notepad', 'meal', 'hat', 'gloves',
        'accommodation', 'bottle', 'mug', 'accessories', 'cap', 'T-Shirt', null, 'game', 'service'],
      message: 'Type of the product doesn\'t belong to the types of product acceptable.'
    }
  },
  varieties: {
    type: Array
  }
});

// Document Middleware: runs before .save() and .create()
productSchema.pre('save', function(next) {
  this.slug = slugify(this.name, {lower: true});
  next();
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;