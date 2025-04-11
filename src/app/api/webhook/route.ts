import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { createBooking, updateHotelRoom } from '@/libs/apis';

const checkout_session_completed = 'checkout.session.completed';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-03-31.basil',
});

export async function POST(req: Request, res: Response) {
    const reqBody = await req.text();
    const sig = req.headers.get('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    try {
        if (!sig || !webhookSecret) return;
        event = stripe.webhooks.constructEvent(reqBody, sig, webhookSecret);
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 500 });
    }

    // load our event
    switch (event.type) {
        case checkout_session_completed:
            const session = event.data.object;


            // @ts-ignore
            const metadata = session.metadata ?? {};
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


            await createBooking(bookingData);

            //   Update hotel Room
            await updateHotelRoom(metadata.hotelRoom);

            return NextResponse.json('Booking successful', {
                status: 200,
                statusText: 'Booking Successful',
            });

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json('Event Received', {
        status: 200,
        statusText: 'Event Received',
    });
}