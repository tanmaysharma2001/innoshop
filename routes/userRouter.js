const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router
  .post('/cart', authController.protect, cartController.addToCart)
  .get('/cart', authController.protect, cartController.getCartItems);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

router.patch('/updateMe', authController.protect, userController.updateMe);


router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .get(authController.protect, userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
