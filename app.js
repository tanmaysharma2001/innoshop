const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');

const app = express();
const productRouter = require('./routes/productRouter');
const userRouter = require('./routes/userRouter');

app.use(cors());

// Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

// serving static files
const dir = path.join(__dirname, 'dev-data/Images');

app.use(express.static(dir));

// request time middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);

// Unhandled Routes
// always at the end of all routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorController);

module.exports = app;
