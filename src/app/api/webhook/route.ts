import { Room } from '@/app/models/room';
import { createBooking, getRoomByQuery, updateHotelRoom } from '@/libs/apis';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
    apiVersion: '2025-03-31.basil',
});

const webhookSecret = process.env.WEBHOOK_SECRET_K!;

export async function POST(req: Request) {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature || !webhookSecret) {
        return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
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
        } = session.metadata!;

        // Log the metadata to inspect its contents
        console.log('Session Metadata:', session.metadata);

        if (hotelRoom) {
            try {
                console.log('✅ Checkout Session Completed:', session.id);
                console.log(`📦 Booking confirmed for room ${hotelRoom} by user ${user}`);

                // ✅ Convert all required numbers from string
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

                console.log('Creating booking with data:', bookingData);

                try {
                    await createBooking(bookingData);
                    await updateHotelRoom(hotelRoom);
                    console.log('Booking successfully created');
                } catch (err: any) {
                    console.error('❌ Failed to create booking:', err.message);
                    return NextResponse.json({ error: 'Booking failed', details: err.message }, { status: 500 });
                }

            } catch (err: any) {
                console.error('Error fetching room:', err);
                return NextResponse.json({ error: 'Room fetching failed', details: err.message }, { status: 500 });
            }
        } else {
            console.log("Hotel room slug is invalid or empty");
            return NextResponse.json({ error: 'Invalid hotel room slug' }, { status: 400 });
        }
    }

    return NextResponse.json({ received: true }, { status: 200 });
}
