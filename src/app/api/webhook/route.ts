import { buffer } from 'micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { createBooking, updateHotelRoom } from '@/libs/apis';

export const config = {
    api: {
        bodyParser: false, // This ensures the raw body is preserved for signature verification
    },
};

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
    apiVersion: '2025-03-31.basil',
});

const webhookSecret = process.env.WEBHOOK_SECRET_K!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end('Method Not Allowed');
    }

    // Get the raw body from the request
    const buf = await buffer(req);

    // COMMENT OUT THE SIGNATURE VERIFICATION FOR TESTING
    // const signature = req.headers['stripe-signature'] as string;
    // let event: Stripe.Event;

    // Try to process the event without verifying the signature
    let event: Stripe.Event;
    try {
        // Skipping the signature verification for now (not recommended for production)
        event = stripe.webhooks.constructEvent(buf.toString(), '', webhookSecret);
    } catch (err: any) {
        console.error('❌ Webhook Error:', err.message);
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        const {
            hotelRoom,
            user,
            adults,
            children,
            checkinDate,
            checkoutDate,
            numberOfDays,
            totalPrice,
            discount,
        } = session.metadata ?? {};

        console.log('✅ Metadata:', session.metadata);

        if (!hotelRoom) {
            return res.status(400).json({ error: 'Invalid hotel room slug' });
        }

        const bookingData = {
            adults: parseInt(adults),
            children: parseInt(children),
            checkIn: checkinDate,
            checkOut: checkoutDate,
            hotelroom: hotelRoom,
            numberOfDays: parseInt(numberOfDays),
            totalPrice: parseFloat(totalPrice),
            discount: parseFloat(discount),
            user,
        };

        try {
            await createBooking(bookingData);
            await updateHotelRoom(hotelRoom);
            console.log('✅ Booking saved');
        } catch (err: any) {
            console.error('❌ Booking failed:', err.message);
            return res.status(500).json({ error: 'Booking failed', details: err.message });
        }
    }

    res.status(200).json({ received: true });
}
