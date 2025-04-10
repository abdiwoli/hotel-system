import Stripe from 'stripe';

import { AuthOptions as authOptions } from '@/libs/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { getRoom, getRoomByQuery, getRoomBySlug } from '@/libs/apis';
import { Room } from '@/app/models/room';

const stripe = new Stripe(`${process.env.STRIPE_SECRET}`, {
    apiVersion: '2025-03-31.basil',
});


type RequestData = {
    checkinDate: string;
    checkoutDate: string;
    adults: number;
    children: number;
    numberOfDays: number;
    hotelRoomSlug: string;
};

export async function POST(req: Request) {
    try {
        const {
            checkinDate,
            adults,
            checkoutDate,
            children,
            hotelRoomSlug,
            numberOfDays,
        }: RequestData = await req.json();

        // Validate required fields
        if (!checkinDate || !checkoutDate || !adults || !hotelRoomSlug || !numberOfDays) {
            return new NextResponse('All fields are required', { status: 400 });
        }

        const origin = req.headers.get('origin') || 'http://localhost:3000';
        const session = await getServerSession(authOptions);

        // Check if session is valid
        if (!session) return new NextResponse('Authentication required', { status: 401 });

        const userId = session.user.id;
        const formattedCheckoutDate = checkoutDate.split('T')[0];
        const formattedCheckinDate = checkinDate.split('T')[0];

        // Get room details
        const rooms: Room[] = await getRoomByQuery("", "", hotelRoomSlug);
        console.log('hotelRoomSlug', hotelRoomSlug);
        console.log('Room Data:', rooms);
        if (!rooms || rooms.length === 0) return new NextResponse('Room not found', { status: 404 });
        const room: Room = rooms[0];

        // Check if price and discount are valid
        if (typeof room.price !== 'number' || typeof room.discount !== 'number') {
            throw new Error('Invalid price or discount data in room');
        }

        // Calculate the discount price
        const discountPrice = room.price - (room.price / 100) * room.discount;


        // Validate discount price
        if (isNaN(discountPrice) || discountPrice <= 0) {
            throw new Error('Invalid discount price');
        }

        const totalPrice = discountPrice * numberOfDays;

        // Validate total price
        if (isNaN(totalPrice) || totalPrice <= 0) {
            throw new Error('Invalid total price');
        }

        // Check images to ensure they're present
        const images = room?.images?.map(img => img.url.trim()) || ['https://default-image-url.com'];

        // Ensure no invalid URLs
        if (images.some(url => !url)) {
            throw new Error('Invalid image URL(s)');
        }

        // Create Stripe session
        const stripeSession = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: [
                {
                    quantity: 1,
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: room.name,
                            images: images,
                        },
                        unit_amount: Math.round(totalPrice * 100), // Convert to cents
                    },
                },
            ],
            payment_method_types: ['card'],
            success_url: `${origin}/users/${userId}`,
            metadata: {
                adults,
                checkinDate: formattedCheckinDate,
                checkoutDate: formattedCheckoutDate,
                children,
                hotelRoom: room._id,
                numberOfDays,
                user: userId,
                discount: room.discount,
                totalPrice,
            },
        });

        return NextResponse.json(stripeSession, { status: 200 });
    } catch (error: any) {
        console.error('Stripe payment failed:', error);
        return NextResponse.json(
            { message: 'Internal Server Error', error: error.message || 'Unknown error' },
            { status: 500 }
        );
    }
}
