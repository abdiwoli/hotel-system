import { NextRequest } from 'next/server';
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

export async function POST(req: NextRequest) {
    const rawBody = await req.text(); // Not `buffer()` in App Router, use `req.text()`
    const signature = req.headers.get('stripe-signature') || '';

    let event: Stripe.Event;

    try {
        // Skip signature check for testing, or keep it if signature is valid
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err: any) {
        console.error('❌ Webhook signature verification failed:', err.message);
        return new Response(JSON.stringify({ error: err.message }), { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata ?? {};

        console.log('✅ Stripe session metadata:', metadata);

        const bookingData = {
            adults: parseInt(metadata.adults),
            children: parseInt(metadata.children),
            checkIn: metadata.checkinDate,
            checkOut: metadata.checkoutDate,
            hotelroom: metadata.hotelRoom,
            numberOfDays: parseInt(metadata.numberOfDays),
            totalPrice: parseFloat(metadata.totalPrice),
            discount: parseFloat(metadata.discount),
            user: metadata.user,
        };

        try {
            await createBooking(bookingData);
            await updateHotelRoom(metadata.hotelRoom);
            console.log('✅ Booking created successfully');
        } catch (err: any) {
            console.error('❌ Booking error:', err.message);
            return new Response(JSON.stringify({ error: 'Booking failed', details: err.message }), { status: 500 });
        }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
}
