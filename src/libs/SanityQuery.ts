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

export const getBookingsQueryForUser = groq`
  *[_type == "booking" && user._ref == $userId] {
    _id,
    checkIn,
    checkOut,
    adults,
    children,
    totalPrice,
    hotelroom-> {
      _id,
      name,
      slug,
      roomType,
    }
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




export const getReviewsQuery = groq`
  *[_type == "review" && hotelRoom._ref == $ref] {
    _id,
    _createdAt,
    _updatedAt,
    rating,
    comment,
    hotelRoom-> {
      _id,
      name
    },
    user-> {
      _id,
      name,
      image {
        asset-> {
          url
        }
      }
    },


  }`;


