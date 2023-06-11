const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            require: [true, 'Booking must belong a Tour'],
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            require: [true, 'Booking must belong a User'],
        },
        price: {
            type: Number,
            require: [true, 'Booking must have a price'],
        },
        paid: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

bookingSchema.pre(/^find/, function (next) {
    this.populate('user').populate({ path: 'tour', select: 'name' });
    next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
