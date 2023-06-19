const Product = require('./../models/productModel');
const APIFeatures = require('./../utils/apiFeatures');

// Product Controllers
const getProducts = async (req, res) => {

  try {

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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

const postProduct = async (req, res) => {

  try {
    const newProduct = await Product.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        product: newProduct,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }
};

const getProductWithID = (req, res) => {

  try {
    const product = Product.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        product
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
};

const updateProductWithID = async (req, res) => {
  try {

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    res.status(200).json({
      status: 'success',
      data: {
        product: updatedProduct,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
};

const deleteProductWithID = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch(err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    })

  }
};

module.exports = {
  getProducts,
  getProductWithID,
  postProduct,
  updateProductWithID,
  deleteProductWithID
};
