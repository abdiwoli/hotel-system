import axios from "axios";
import { Booking, CreateBookingDto, Room } from '@/app/models/room';
import { getBookingsQuery, getRoomQuery, getRoomTypesQuery } from './SanityQuery';
import sanityClient from './sanity';


export const getRoomByQuery = async (name: string, roomType: string, slug: string) => {
    console.log("Fetching rooms with params:", { name, roomType, slug });
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


export const getRoomTypes = async () => {
    const rooms: Room[] = await sanityClient.fetch(getRoomTypesQuery);
    const roomTypes = rooms.map((room) => room.roomType).filter((value, index, self) => self.indexOf(value) === index);
    return roomTypes;
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


export async function getRoom(slug: string) {
    const result = await sanityClient.fetch<Room>(
        getRoomQuery,
        { slug },
        { cache: 'no-cache' }
    );

    return result;
}

export const updateHotelRoom = async (hotelRoomId: string) => {
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