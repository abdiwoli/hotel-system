import axios from "axios";
import { Booking, CreateBookingDto, CreatePendingBookingDto, Room } from '@/app/models/room';
import { getBookingsQuery, getBookingsQueryForUser, getFeaturedRoomQuery, getRoomBySlugQuery, getRoomQuery, getRoomTypesQuery } from './SanityQuery';
import sanityClient from './sanity';

export const getStaticProps = async () => {
    const featuredRooms: Room[] = await sanityClient.fetch(getFeaturedRoomQuery);

    // Pick the first room (or random, latest, etc.)
    return {
        rooms: featuredRooms,
    }

};



export const getPendingBookingData = async (txRef: string) => {
    const query = `*[_type == "bending-booking" && txRef == $txRef]{
    _id,
    user,
    hotelroom,
    checkIn,
    checkOut,
    numberOfDays,
    discount,
    adults,
    children,
    totalPrice,
    txRef
  }`;

    const params = { txRef };
    const bookings: Booking[] = await sanityClient.fetch(query, params);

    if (bookings && bookings.length > 0) {
        console.log('Pending booking found:', bookings[0]);
        return bookings[0];
    }

    console.log('No pending booking found for txRef:', txRef);
    return null;
};


export const getRoobBySlug = async (slug: string) => {
    const params = { slug };
    const rooms: Room[] = await sanityClient.fetch(getRoomBySlugQuery, params);
    return rooms;
}


export const getRoomTypes = async () => {
    const rooms: Room[] = await sanityClient.fetch(getRoomTypesQuery);
    const roomTypes = rooms.map((room) => room.roomType).filter((value, index, self) => self.indexOf(value) === index);
    return roomTypes;
}


export const getRoomByQuery = async (name: string, roomType: string, slug: string) => {
    const params = { name, roomType, slug };
    const rooms: Room[] = await sanityClient.fetch(getRoomQuery, params);
    return rooms;
}


export const getBookingByRoomId = async (roomId: string) => {
    console.log('fetching booking')
    const params = { roomId };
    // Query the bookings collection to find all bookings for this room
    const bookings: Booking[] = await sanityClient.fetch(getBookingsQuery, params);

    if (bookings && bookings.length > 0) {
        return bookings;
    }
    console.log("no booking found");
    return [];
};

export const getBookingByUserId = async (userId: string) => {
    const params = { userId };
    const bookings: Booking[] = await sanityClient.fetch(getBookingsQueryForUser, params);
    if (bookings && bookings.length > 0) {
        return bookings;
    }
    console.log("no booking found");
    return [];

}


// libs/apis.ts

export const createBooking = async ({
    adults,
    checkIn,
    checkOut,
    children,
    hotelroom,
    numberOfDays,
    totalPrice,
    discount,
    user,
}: CreateBookingDto) => {
    console.log('Creating booking', {
        adults,
        checkIn,
        checkOut,
        children,
        hotelroom,
        numberOfDays,
        totalPrice,
        discount,
        user,
    });
    const mutation = {
        mutations: [
            {
                create: {
                    _type: 'booking',
                    user: { _type: 'reference', _ref: user },
                    hotelroom: { _type: 'reference', _ref: hotelroom },
                    checkIn,
                    checkOut,
                    numberOfDays,
                    adults,
                    discount,
                    children,
                    totalPrice,
                },
            },
        ],
    };

    const { data } = await axios.post(
        `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
        mutation,
        { headers: { Authorization: `Bearer ${process.env.SANITY_API_TOKEN}` } }
    );

    return { success: true, data, error: false };
};


export const createPendingBooking = async ({
    adults,
    checkIn,
    checkOut,
    children,
    hotelroom,
    numberOfDays,
    totalPrice,
    discount,
    user,
    txRef,
}: CreatePendingBookingDto) => {
    console.log('Creating pending booking')
    const mutation = {
        mutations: [
            {
                create: {
                    _type: 'bending-booking',
                    user: { _type: 'reference', _ref: user },
                    hotelroom: { _type: 'reference', _ref: hotelroom },
                    checkIn,
                    checkOut,
                    numberOfDays,
                    adults,
                    discount,
                    children,
                    totalPrice,
                    txRef,
                },
            },
        ],
    };

    const { data } = await axios.post(
        `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
        mutation,
        { headers: { Authorization: `Bearer ${process.env.SANITY_API_TOKEN}` } }
    );

    return { success: true, data, error: false };
};



export const deletePendingBooking = async (bookingId: string) => {
    if (!bookingId) throw new Error("bookingId is required");

    const mutation = {
        mutations: [
            {
                delete: {
                    id: bookingId,
                },
            },
        ],
    };

    const { data } = await axios.post(
        `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
        mutation,
        {
            headers: {
                Authorization: `Bearer ${process.env.SANITY_API_TOKEN}`,
            },
        }
    );

    return { success: true, data };
};




export async function getRoom(slug: string) {
    const result = await sanityClient.fetch<Room>(
        getRoomQuery,
        { slug },
        { cache: 'no-cache' }
    );

    return result;
}

export const updateHotelRoom = async (hotelRoomId: string) => {
    console.log("updating hotel room", hotelRoomId);
    const mutation = {
        mutations: [
            {
                patch: {
                    id: hotelRoomId,
                    set: {
                        isBooked: true,
                    },
                },
            },
        ],
    };

    const { data } = await axios.post(
        `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
        mutation,
        { headers: { Authorization: `Bearer ${process.env.SANITY_API_TOKEN}` } }
    );

    return data;
};