import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createBooking, deletePendingBooking, getPendingBookingData } from '@/libs/apis';

const CHAPA_SECRET = process.env.STRIPE_WEBHOOK_SECRET!; // Using same env var

function verifySignature({
    payload,
    signature,
    type,
}: {
    payload: string;
    signature: string;
    type: 'x-chapa-signature' | 'Chapa-Signature';
}) {
    const dataToSign = type === 'x-chapa-signature' ? payload : CHAPA_SECRET;
    const expectedSignature = crypto
        .createHmac('sha256', CHAPA_SECRET)
        .update(dataToSign)
        .digest('hex');

    return signature === expectedSignature;
}

export async function POST(req: NextRequest) {
    const chapaSig = req.headers.get('Chapa-Signature');
    const xChapaSig = req.headers.get('x-chapa-signature');
    const rawBody = await req.text();

    const isValidX =
        xChapaSig &&
        verifySignature({
            payload: rawBody,
            signature: xChapaSig,
            type: 'x-chapa-signature',
        });

    const isValidChapa =
        chapaSig &&
        verifySignature({
            payload: rawBody,
            signature: chapaSig,
            type: 'Chapa-Signature',
        });

    const isValid = isValidX || isValidChapa;

    console.log('Chapa Webhook Signature Valid:', isValid);

    // Continue processing regardless of signature validity
    try {
        const data = JSON.parse(rawBody);
        console.log('Webhook event:', data);

        // Your event processing logic goes here
        // Here you would typically create a booking in your database

        const bookingData = await getPendingBookingData(data.tx_ref);
        console.log("📦 Booking data:", bookingData);
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

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
}
