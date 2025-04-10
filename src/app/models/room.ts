type CoverImage = {
    url: string;
    alt: string;
}

export type Image = {
    _key: string;
    url: string;
}

type Amenity = {
    _key: string;
    icon: string;
    name: string;
}

type Slug = {
    _type: string;
    current: string;
}

export type Room = {
    _id: string;
    name: string;
    description: string;
    roomType: string;
    price: number;
    coverImage: CoverImage;
    images: Image[];
    url: string;
    discount: number;
    isBooked: boolean;
    isFeatured: boolean;
    numberOfBeds: number;
    amenities: Amenity[];
    slug: Slug;
    specialNote: string;
}

export type CreateBookingDto = {
    user: string;
    hotelroom: string;
    checkIn: string;
    checkOut: string;
    numberOfDays: number;
    discount: number,
    adults: number;
    children: number;
    totalPrice: number;

}

export type Booking = {
    _createdAt: string;  // Date in ISO format
    _id: string;  // Unique ID for the booking
    _rev: string;  // Revision ID for the booking (for Sanity or similar systems)
    _type: "booking";  // Fixed type to indicate this is a booking document
    _updatedAt: string;  // Date when the booking was last updated
    adults: number;  // Number of adults
    checkIn: string;  // Check-in date in YYYY-MM-DD format
    checkOut: string;  // Check-out date in YYYY-MM-DD format
    children: number;  // Number of children
    discount: number;  // Discount applied to the booking
    hotelroom: {  // Reference to the hotel room being booked
        _ref: string;  // Room ID reference
        _type: "reference";  // Type indicating this is a reference
    };
    numberOfDays: number;  // Duration of the stay in days
    totalPrice: number;  // Total price for the stay
    user: {  // Reference to the user who made the booking
        _ref: string;  // User ID reference
        _type: "reference";  // Type indicating this is a reference
    };
};


