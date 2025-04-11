import Stripe from 'stripe';
import { createBooking, updateHotelRoom } from '@/libs/apis';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-03-31.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const checkout_session_completed = 'checkout.session.completed';

export async function POST(request: Request): Promise<Response> {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');

    if (!sig || !webhookSecret) {
        return new Response('Missing signature or webhook secret', { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
        console.error('❌ Webhook Error:', err.message);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    if (event.type === checkout_session_completed) {
        const session = event.data.object as Stripe.Checkout.Session;
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

        try {
            await createBooking(bookingData);
            await updateHotelRoom(metadata.hotelRoom);

            return new Response('✅ Booking successful', { status: 200 });
        } catch (err: any) {
            console.error('❌ Booking creation error:', err.message);
            return new Response(`Error: ${err.message}`, { status: 500 });
        }
    }

    return new Response('✅ Event received', { status: 200 });
}
