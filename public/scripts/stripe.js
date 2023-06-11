import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
    'pk_test_51NH2f7JJHGbnV32oBTXNwCgMJZ9XeVGNaAIVeEDskmRsC3eiseRmpL7Bmn86jFHZ8MDIPllWh3uo5oKRLRbLUSsy00md1vvP4y'
);

export const bookTour = async (tourId) => {
    try {
        // 1. Get checkout session from api
        const session = await axios.get(`/api/v1/bookings/checkout/${tourId}`);

        console.log(session);

        // 2. Create checkout from + chanre credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id,
        });
    } catch (error) {
        showAlert('error', error);
    }
};
