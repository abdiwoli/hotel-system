import { buffer } from 'micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { createBooking, updateHotelRoom } from '@/libs/apis';

export const config = {
    api: {
        bodyParser: false,
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

    const buf = await buffer(req);
    const signature = req.headers['stripe-signature'] as string;

    // Debug: Log raw request body and signature
    console.log('Received Raw Body:', buf.toString());
    console.log('Stripe Signature:', signature);

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(buf.toString(), signature, webhookSecret);
        console.log('Webhook event verified:', event);  // Log verified event
    } catch (err: any) {
        console.error('❌ Webhook Error:', err.message);
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        // Debug: Log the session object and metadata
        console.log('Received session:', session);
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
        console.log('Hotel Room:', hotelRoom);
        console.log('User:', user);

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

        // Debug: Log the data to be saved
        console.log('Booking data prepared:', bookingData);

        try {
            await createBooking(bookingData);
            await updateHotelRoom(hotelRoom);
            console.log('✅ Booking saved');
        } catch (err: any) {
            console.error('❌ Booking failed for room:', hotelRoom, 'and user:', user, 'Error:', err.message);
            return res.status(500).json({ error: 'Booking failed', details: err.message });
        }
    }

    res.status(200).json({ received: true });
}
