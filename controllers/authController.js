const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signup = catchAsync(async (req, res, next) => {
  // we cannot receive everything that the user is sending
  // in request body
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = jwt.sign(
    { id: newUser._id },
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRES_IN
  );

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

const login = (req, res, next) => {
  const { email, password } = req.body;

  // 1. checck if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2. Check if user exists && password is correct
  const user = User.findOne({ email: email });


  // 3. if everything is okay, send token to client
  const token = '';

  res.status(200).json({
    status: 'success',
    token,
  });
};

module.exports = {
  signup,
  login,
};
