import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { AuthOptions as authOptions } from '@/libs/auth';
import { createPendingBooking, getRoomByQuery } from '@/libs/apis';
import { Room } from '@/app/models/room';

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

    if (!checkinDate || !checkoutDate || !adults || !hotelRoomSlug || !numberOfDays) {
      return new NextResponse('All fields are required', { status: 400 });
    }

    const origin = req.headers.get('origin') || 'http://localhost:3000';
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id || !session.user.email || !session.user.name) {
      return new NextResponse('Authentication required or missing user data', { status: 401 });
    }

    const userId = session.user.id;
    const formattedCheckinDate = checkinDate.split('T')[0];
    const formattedCheckoutDate = checkoutDate.split('T')[0];

    const rooms: Room[] = await getRoomByQuery("", "", hotelRoomSlug);
    if (!Array.isArray(rooms) || rooms.length === 0) {
      return new NextResponse('Room not found', { status: 404 });
    }
    const room: Room = rooms[0];

    if (typeof room.price !== 'number' || typeof room.discount !== 'number') {
      throw new Error('Invalid price or discount data in room');
    }

    const discountPrice = room.price - (room.price / 100) * room.discount;
    if (isNaN(discountPrice) || discountPrice <= 0) throw new Error('Invalid discount price');

    const totalPrice = discountPrice * numberOfDays;
    if (isNaN(totalPrice) || totalPrice <= 0) throw new Error('Invalid total price');

    const txRef = `tx-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const images = room?.images?.map(img => img.url.trim()) || ['https://default-image-url.com'];
    const imageUrl = images[0] || 'https://default-image-url.com';

    // Fix Chapa validation: Title max 16 chars, description must be clean
    const safeTitle = room.name?.slice(0, 16) || 'Hotel Room';
    const rawDescription = `Booking for ${numberOfDays} night(s)`;
    const safeDescription = rawDescription.replace(/[^a-zA-Z0-9\-_.\s]/g, '');

    const chapaRes = await fetch('https://api.chapa.co/v1/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CHAPA_TEST_PUBLIC_SECRET}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: totalPrice.toString(),
        currency: 'ETB',
        email: session.user.email,
        first_name: session.user.name?.split(' ')[0] || 'Guest',
        last_name: session.user.name?.split(' ')[1] || 'User',
        tx_ref: txRef,
        callback_url: `${origin}/api/verify/chapa?`,
        return_url: `${origin}/users/${userId}`,
        customization: {
          title: safeTitle,
          description: safeDescription,
          logo: imageUrl,
        },
      }),
    });

    const chapaData = await chapaRes.json();

    if (!chapaData || chapaData.status !== 'success') {
      console.error('Chapa failed:', chapaData);
      return NextResponse.json({ message: 'Chapa Init Failed', error: chapaData?.message || 'Unknown error' }, { status: 500 });
    }

    console.log('Chapa payment initialized and creating pending book:', chapaData);
    const bending = await createPendingBooking({
      adults,
      checkIn: formattedCheckinDate,
      checkOut: formattedCheckoutDate,
      children,
      hotelroom: room._id,
      numberOfDays,
      user: userId,
      discount: room.discount,
      totalPrice,
      txRef,
    })
    if (!bending) {
      console.error('Failed to create pending booking:', bending);
      return NextResponse.json({ message: 'Failed to create pending booking' }, { status: 500 });
    }
    console.log('Pending booking created successfully:', bending);

    return NextResponse.json({ checkout_url: chapaData.data.checkout_url }, { status: 200 });
  } catch (error: any) {
    console.error('Chapa payment failed:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
