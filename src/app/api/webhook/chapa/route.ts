// File: /app/api/webhook/chapa/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createBooking, deletePendingBooking, getPendingBookingData } from '@/libs/apis';

export async function POST(req: NextRequest) {
    try {
        const chapaSecret = process.env.STRIPE_WEBHOOK_SECRET!;
        const signature = req.headers.get('x-chapa-signature');

        if (!signature || signature !== chapaSecret) {
            console.warn('⚠️ Invalid or missing Chapa signature');
            console.log('Received signature:', signature);
            console.log('Expected signature:', chapaSecret);
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        console.log('📬 Chapa Webhook Received:', body);

        const { status, data } = body;

        if (status === 'success' && data.status === 'success') {
            const txRef = data.tx_ref;

            const bookingData = await getPendingBookingData(txRef);
            if (!bookingData) {
                return NextResponse.json({ message: 'Pending booking not found' }, { status: 404 });
            }

            const bookingPayload = {
                adults: bookingData.adults,
                checkIn: bookingData.checkIn,
                checkOut: bookingData.checkOut,
                children: bookingData.children,
                hotelroom: bookingData.hotelroom._ref,
                numberOfDays: bookingData.numberOfDays,
                totalPrice: bookingData.totalPrice,
                discount: bookingData.discount,
                user: bookingData.user._ref,
            };

            const create = await createBooking(bookingPayload);
            if (!create) {
                return NextResponse.json({ message: 'Failed to create booking' }, { status: 500 });
            }

            const deleted = await deletePendingBooking(bookingData._id);
            if (!deleted) {
                console.error('Failed to delete pending booking:', deleted);
                return NextResponse.json({ message: 'Failed to delete pending booking' }, { status: 500 });
            }

            return NextResponse.json({ message: 'Booking confirmed' }, { status: 200 });
        }

        return NextResponse.json({ message: 'Ignored non-success payment' }, { status: 200 });
    } catch (err: any) {
        console.error('❌ Webhook error:', err.message);
        return NextResponse.json({ message: 'Internal error' }, { status: 500 });
    }
}
