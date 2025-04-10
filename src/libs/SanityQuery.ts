// libs/roomFragments.js
// libs/roomQueries.js
import groq from 'groq';

// Define the query for fetching bookings for a specific room
// Define the query for fetching bookings for a specific room
export const getBookingsQuery = groq`
  *[_type == "booking" && hotelroom._ref == $roomId] {
    checkIn,
    checkOut,
  }
`;



// 1. Define reusable fields at the top
const roomFields = groq`
  _id,
  description,
  discount,
  images,
  isFeatured,
  isBooked,
  name,
  price,
  amenities,
  roomType,
  slug,
  coverImage,
  numberOfBeds,
`;

// 2. Use the fields in your queries
export const getAllRooms = groq`
  *[_type == "hotelRoom"] {
    ${roomFields}
  }
`;

export const getFeaturedRoomQuery = groq`
  *[_type == "hotelRoom" && isFeatured == true] {
    ${roomFields}
  }
`;

export const getRoomBySlugQuery = groq`
 *[_type == "hotelRoom" && ($slug == "" || slug.current == $slug)] {
  ${roomFields}
}
`;

export const getRoomQuery = groq`
  *[_type == "hotelRoom" 
    && ($slug == "" || slug.current == $slug)
    && ($roomType == "" || roomType == $roomType)
    && ($name == "" || name == $name)
  ] {
    ${roomFields}
  }
`;


export const getRoomTypesQuery = groq`
 *[_type == "hotelRoom"] {
  roomType
}
`;


