const express = require('express');

const router = express.Router();
const multer = require('multer');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

// router.param('id', productController.checkId);

const fileStorage = multer({
  storage: multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});


router
  .route('/')
  .get(productController.getProducts)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    productController.postProduct
  );

router
  .route('/upload')
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    fileStorage.single('image'),
    productController.addImage
  );

router
  .route('/:id')
  .get(productController.getProductWithID)
  .patch(productController.updateProductWithID)
  .delete(productController.deleteProductWithID);

module.exports = router;
