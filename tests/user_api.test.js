const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../index');
const bcrypt = require('bcryptjs');
const { setTimeout } = require("timers/promises");


const api = supertest(app);

// Models of Documents
const User = require('../models/userModel');

describe('Simple Signup and Signin Process', () => {
  test('simple signup', async () => {
    const newUser = {
      name: "tanmay",
      email: "tanmay@jonas.io",
      password: "pass1234",
      passwordConfirm: "pass1234",
    };

    const response = await api
      .post('/api/v1/users/signup')
      .send(newUser)
      .expect(201)
      .catch((err) => {
        console.log(err);
      });
  }, 100000);

  test('simple signin', async () => {

    const user = {
      email: "tanmay@jonas.io",
      password: "pass1234",
    };

    const response = await api
      .post('/api/v1/users/login')
      .send(user)
      .expect(200)
      .catch((err) => {
        console.log(err);
      });

  }, 100000);
});


afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});