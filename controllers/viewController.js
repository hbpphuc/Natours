const catchAsync = require('../utils/catchAsync');
const Tour = require('./../models/tourModel');

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

    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour,
    });
});
