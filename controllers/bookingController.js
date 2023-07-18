const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Purchase = require('../models/purchaseModel');
const users = require('../models/userModel');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const { ids, names, quantities } = req.body;

  const products = [];

  for (let i = 0; i < ids.length; i++) {
    const product = await Product.findById(ids[i]);
    product.name = names[i];
    product.quantity = quantities[i];
    products.push(product);
  }

  const prices = [];
  for (let i = 0; i < products.length; i++) {
    const { price } = products[i];
    prices.push(price);
  }

  const items = [];

  products.forEach((ele) => {
    items.push({
      price_data: {
        currency: 'rub',
        unit_amount: ele.price * 100,
        product_data: {
          name: `${ele.name} Product`,
          description: ele.summary,
          images: [`http://localhost:3001/${ele.photoID}.jpg`],
        },
      },
      quantity: ele.quantity,
    });
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?product=[${ids}]&user=${
      req.user.id
    }&price=[${prices}]&name=[${names}]&quantity=[${quantities}]`,
    cancel_url: `${req.protocol}://localhost:3000/fail`,
    customer_email: req.user.email,
    client_reference_id: req.params.productID,
    line_items: items,
    mode: 'payment',
  });

  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { product, user, price, name, quantity } = req.query;

  if (!product && !user && !price && !name && !quantity) return next();

  const products = product.slice(1, -1).split(',');
  const prices = price.slice(1, -1).split(',');
  const names = name.slice(1, -1).split(',');
  const quantities = quantity.slice(1, -1).split(',');

  console.log(prices);

  for (let i = 0; i < products.length; i++) {
    await Purchase.create({
      product: products[i],
      user: user,
      price: Number(prices[i]),
      name: names[i],
      quantity: Number(quantities[i]),
    });
  }

  // await Booking.create({ product, user, price });

  res.redirect('http://localhost:3000/success');
});

exports.getPurchasedItems = catchAsync(async (req, res, next) => {

  const id = req.params.id;

  console.log(id);

  const products = await Purchase.find({ user: id });

  console.log(products);

  res.status(200).json({
    status: 'success',
    products,
  });
});
