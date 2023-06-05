const Review = require('../models/reviewModel');
const crudHandler = require('./../controllers/crudHandler');

exports.getAllReview = crudHandler.getAll(Review);

exports.setTourUserId = (req, res, next) => {
    // Allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;

    next();
};

exports.getReview = crudHandler.getOne(Review);
exports.createReview = crudHandler.createOne(Review);
exports.updateReview = crudHandler.updateOne(Review);
exports.deleteReview = crudHandler.deleteOne(Review);
