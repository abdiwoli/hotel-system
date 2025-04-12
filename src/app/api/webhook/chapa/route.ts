// File: /app/api/webhook/chapa/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createBooking, getPendingBookingData } from '@/libs/apis';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        console.log('📬 Chapa Webhook Received:', body);

        const event = body; // Chapa sends event in plain JSON
        const { status, tx_ref, data } = event;

        if (status === 'success' && data.status === 'success') {
            const txRef = data.tx_ref;

            // 🔍 1. Lookup your temporary data from DB using txRef
            const bookingData = await getPendingBookingData(txRef);

            if (!bookingData) {
                return NextResponse.json({ message: 'Pending booking not found' }, { status: 404 });
            }

            // Manually pick required fields
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

            // ✅ Create confirmed booking
            await createBooking(bookingPayload);


            // 🧹 3. Optionally clean up the pending record

            return NextResponse.json({ message: 'Booking confirmed' }, { status: 200 });
        }

        return NextResponse.json({ message: 'Ignored non-success payment' }, { status: 200 });
    } catch (err: any) {
        console.error('❌ Webhook error:', err.message);
        return NextResponse.json({ message: 'Internal error' }, { status: 500 });
    }
}
