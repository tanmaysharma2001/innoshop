const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../index');

const api = supertest(app);

// Models of Documents
const Product = require('../models/productModel');

const initialProducts = [
  {
    photoID: 1,
    name: 'Inno Basic TShirt',
    price: 900,
    type: 'T-Shirt',
  },
  {
    photoID: 2,
    name: 'Inno Cup',
    price: 100,
    type: 'mug',
  },
];

beforeEach(async () => {
  await Product.deleteMany({});
  let productObject = new Product(initialProducts[0]);
  await productObject.save();
  productObject = new Product(initialProducts[1]);
  await productObject.save();
}, 100000);

describe('when there is initially some products saved', () => {
  test('products are returned as json', async () => {
    const response = await api
      .get('/api/v1/products/')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  }, 100000);

  test('all products are returned', async () => {
    const response = await api.get('/api/v1/products/');

    expect(response.body.data.products).toHaveLength(initialProducts.length);
  });

  test('a specific product is within the returned notes', async () => {
    const response = await api.get('/api/v1/products/');

    const names = response.body.data.products.map((r) => r.name);

    expect(names).toContain('Inno Cup');
  });
});


describe('viewing a specific product', () => {
  test('succeeds with a valid id', async () => {
    const allProducts = await api.get('/api/v1/products/').then((response) => {
      return response.body.data.products;
    });

    const productToView = allProducts[0];

    const resultProduct = await api
      .get(`/api/v1/products/${productToView._id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    delete resultProduct.body.data.product['__v'];

    expect(resultProduct.body.data.product).toEqual(productToView);
  });
});


describe('addition of a new product', () => {
  test('succeeds with valid data', async () => {
    const loginResponse = await api.post('/api/v1/users/login').send({
      email: 'tanmay@jonas.io',
      password: 'pass1234',
    });

    const headerString = `Bearer ${loginResponse.body.token}`;

    const newProduct = {
      name: 'Inno Simple TShirt',
      price: 200,
      type: 'T-Shirt',
    };

    const postProductResponse = await api
      .post('/api/v1/products/')
      .send(newProduct)
      .set({ Authorization: headerString })
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const allProductsResponse = await api.get('/api/v1/products');

    const allProducts = allProductsResponse.body.data.products;

    expect(allProducts).toHaveLength(initialProducts.length + 1);

    const names = allProducts.map((n) => n.name);
    expect(names).toContain('Inno Cup');
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
