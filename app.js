const path = require('path');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./controllers/bookingController');

const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// 1) GLOBAL MIDDLEWARES
const corsOptions = {
    origin: true, //included origin as true
    credentials: true, //included credentials as true
};
app.use(cors(corsOptions));
// app.options('*', cors());

// Set security HTTP headers
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);

// Development environment logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Limit request from same IP
const limiter = rateLimit.rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// app.post(
//     '/webhook-checkout',
//     express.raw({ type: 'application/json' }),
//     bookingController.webhookCheckout
// );

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
    hpp({
        whitelist: [
            'duration',
            'maxGroupSize',
            'difficulty',
            'ratingsAverage',
            'ratingsQuantity',
            'price',
        ],
    })
);

app.use(compression());

// Test middleware
app.use((req, res, next) => {
    // console.log('cookies: ', req.cookies);
    next();
});

// 2) ROUTES

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', function (req, res, next) {
    next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
