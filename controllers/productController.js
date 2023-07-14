const fs = require('fs');
const Product = require('../models/productModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const currentPhotoID = async () => {
  const maxPhotoIDDocument = await Product.find()
    .sort({ photoID: -1 })
    .limit(1);

  const maxPhotoID = maxPhotoIDDocument[0].photoID;

  const id = Number(maxPhotoID) + 1;

  return id;
};

function getFileExtension(filename) {
  // Get the last index of the dot character
  const dotIndex = filename.lastIndexOf('.');

  if (dotIndex === -1 || dotIndex === filename.length - 1) {
    // If no dot character found or dot is the last character, return an empty string
    return '';
  }

  // Extract the substring from the dot character to the end of the string
  const extension = filename.slice(dotIndex + 1);

  return extension;
}

// Product Controllers
const getProducts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query;

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: products.length,
    data: {
      products: products,
    },
  });
});

const postProduct = catchAsync(async (req, res, next) => {

  req.body.photoID = currentPhotoID();

  const newProduct = await Product.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      product: newProduct,
    },
  });
});

const getProductWithID = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});

const updateProductWithID = catchAsync(async (req, res, next) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedProduct) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product: updatedProduct,
    },
  });
});

const deleteProductWithID = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const addImage = catchAsync(async (req, res, next) => {
  const currentID = await currentPhotoID();

  console.log(currentID);

  const tmp_path = `uploads/${req.file.filename}`;

  const extension = getFileExtension(req.file.filename);

  const target_path = `dev-data/Images/${currentID}.${extension}`;

  var src = fs.createReadStream(tmp_path);
  var dest = fs.createWriteStream(target_path);
  src.pipe(dest);
  src.on('end', () => {
    res.status(200).send();
  });
  src.on('error', (err) => {
    res.status(500).send();
  });
});

module.exports = {
  getProducts,
  getProductWithID,
  postProduct,
  updateProductWithID,
  deleteProductWithID,
  addImage,
};
