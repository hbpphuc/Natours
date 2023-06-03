const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            require: [true, 'Review can not be empty!'],
        },
        rating: {
            type: Number,
            default: 5,
            min: 1,
            max: 5,
        },
        tour: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Tour',
            require: [true, 'Review must belong to a tour.'],
        },
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            require: [true, 'Review must belong to a user.'],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true,
    }
);

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name photo',
    });
    next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
