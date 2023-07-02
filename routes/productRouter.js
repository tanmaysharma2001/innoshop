const express = require('express');

const router = express.Router();
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

// router.param('id', productController.checkId);

router
  .route('/')
  .get(productController.getProducts)
  .post(authController.protect, productController.postProduct);

router
  .route('/:id')
  .get(productController.getProductWithID)
  .patch(productController.updateProductWithID)
  .delete(productController.deleteProductWithID);

module.exports = router;
