const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Booking = require('../models/bookingModel');

exports.alerts = (req, res, next) => {
    const { alert } = req.query;
    if (alert === 'booking')
        res.locals.alert =
            'Your booking was successful! Please check your email for a confirmation.';
    next();
};

exports.getOverview = catchAsync(async (req, res, next) => {
    // 1. Get tours data
    const tours = await Tour.find();

    // 2.Build template
    // 3. Render template
    res.status(200).render('overview', {
        title: 'All Tours',
        tours,
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user',
    });

    if (!tour) {
        return next(new AppError('There is no tour with that name', 404));
    }

    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour,
    });
});

exports.getLoginForm = (req, res) => {
    res.status(200).render('login', {
        title: 'Log into your account',
    });
};

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'My Account',
    });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            name: req.body.name,
            email: req.body.email,
        },
        { new: true, runValidators: true }
    );
    res.status(200).render('account', {
        title: 'My Account',
        user: updatedUser,
    });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
    // 1. Find all booking
    const bookings = await Booking.find({ user: req.user.id });
    // 2. Find tour with the returned ids
    const tourIds = bookings.map((item) => item.tour);
    const tours = await Tour.find({ _id: { $in: tourIds } });

    res.status(200).render('overview', {
        title: 'My Tours',
        tours,
    });
});
