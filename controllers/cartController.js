const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Cart = require('./../models/cartModel');
// const Product = require('./../models/productModel');


const addToCart = async (req, res, next) => {
  const { product, user, name, price, quantity } = req.body;

  if (!product || !user || !!name || !price || !quantity) {
    return next(new AppError('Provide all the fields.'));
  }

  const CartItem = await Cart.create({
    product,
    user,
    name,
    price,
    quantity
  });

  res.status(201).json({
    status: 'success',
    data: {
      product: CartItem,
    },
  });
};


const getCartItems = async (req, res, next) => {
  const itemsOfUser = await Cart.find({ user: req.params.id });

  for(let i = 0; i < itemsOfUser.length; i++) {
    console.log(await Product.find({id: itemsOfUser[i]}));
  }

  res.send(200).json({
    status: 'success'
  })

};


// const addManyToCart = async (req, res, next) => {
//   const items = req.body.products;
//
//   for(let i = 0; i < items.length; i++) {
//     const CartItem = await Cart.create({
//       items[i].product,
//       items[i].user,
//       items[i].name,
//       items[i].price,
//     });
//   }
//
//   res.status(201).json({
//     status: 'success',
//     data: {
//       product: items,
//     },
//   });
// };

module.exports = {
  addToCart,
  getCartItems
}