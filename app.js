const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const bookingController = require('./controllers/bookingController');

const app = express();
const productRouter = require('./routes/productRouter');
const userRouter = require('./routes/userRouter');
const bookingRouter = require('./routes/bookingRouter');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

app.use(cors());

// Global Middlewares

// set security HTTP headers
app.use(helmet());

// development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// limir requests from same IP
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests fromt this IP, please try again later!',
// });

// app.use('/api', limiter);

// body parser, reading data from body into req.body
app.use(express.json({ limit: '500kb' }));

app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// data sanitization against NOSQL query injection
app.use(mongoSanitize());

// data sanitization against XSS
app.use(xss());

// prevent parameter pollution
// app.use(
//   hpp({
//     whitelist: ['type', 'price']
//   })
// )

// serving static files
const dir = path.join(__dirname, 'dev-data/Images');
app.use(express.static(dir));

// request time middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/', bookingController.createBookingCheckout);

// Routes
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/bookings', bookingRouter);

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Unhandled Routes
// always at the end of all routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorController);

module.exports = app;
