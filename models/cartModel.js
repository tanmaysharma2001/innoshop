const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',

    required: [true, 'Purchase must belong to a Product.'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Purchase must belong to a User!'],
  },
  name: {
    type: String,
    required: [true, 'Product must have a name!'],
  },
  price: {
    type: Number,
    required: [true, 'Purchase must have a price'],
  },
  size: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
  quantity: {
    type: Number,
    default: 1,
  }
});

cartSchema.pre(/^find/, function(next) {
  this.populate('user').populate({
    path: 'product',
    select: 'name',
  });
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
