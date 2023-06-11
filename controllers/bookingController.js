const Stripe = require('stripe');
const crudHandler = require('./../controllers/crudHandler');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // 1. Get current booked tour
    const tour = await Tour.findById(req.params.tourId);

    // 2. Create checkout session
    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?tour=${
            req.params.tourId
        }&user=${req.user.id}&price=${tour.price}&alert=booking`,
        // success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                price_data: {
                    product_data: {
                        name: `${tour.name} Tour`,
                        description: tour.summary,
                        images: [
                            `${req.protocol}://${req.get('host')}/img/tours/${
                                tour.imageCover
                            }`,
                        ],
                    },
                    unit_amount: tour.price * 100,
                    currency: 'usd',
                },
                quantity: 1,
            },
        ],
    });

    // 3. Create session at response
    res.status(200).json({
        status: 'success',
        session,
    });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
    // This is only TEMPORARY, because it's UNSECURE: averyone can make bookings without paying
    const { tour, user, price } = req.query;

    if (!tour && !user && !price) return next();
    await Booking.create({ tour, user, price });

    res.redirect(req.originalUrl.split('?')[0]);
});

// const createBookingCheckout = async (session) => {
//     const tour = session.client_reference_id;
//     const user = (await User.findOne({ email: session.customer_email })).id;
//     const price = session.line_items[0].price_data.unit_amount / 100;
//     await Booking.create({ tour, user, price });
// };

// exports.webhookCheckout = (req, res, next) => {
//     const signature = req.headers['stripe-signature'];

//     let event;
//     try {
//         event = stripe.webhooks.constructEvent(
//             req.body,
//             signature,
//             process.env.STRIPE_WEBHOOK_SECRET
//         );
//     } catch (error) {
//         return res.status(400).send(`Webhook error: ${error.message}`);
//     }

//     if (event.type === 'checkout.session.completed')
//         createBookingCheckout(event.data.object);

//     res.status(200).json({ received: true });
// };

exports.getAllBookings = crudHandler.getAll(Booking);
exports.createBooking = crudHandler.createOne(Booking);
exports.getBooking = crudHandler.getOne(Booking);
exports.updateBooking = crudHandler.updateOne(Booking);
exports.deleteBooking = crudHandler.deleteOne(Booking);
