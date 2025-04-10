import { defineField } from 'sanity';

const hotelRoomTypes = [{
    title: 'Single', value: 'single'
},
{ title: 'Double', value: 'double' },
{ title: 'Suite', value: 'suite' },
{ title: 'Deluxe', value: 'deluxe' },
{ title: 'Family', value: 'family' },
{ title: 'Presidential', value: 'presidential' },
];

const hotelRoom = {
    name: 'hotelRoom',
    title: 'Hotel Room',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule) => Rule.required().max(100).error('Name is required and should be less than 100 characters.'),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required().error('Slug is required.'),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            validation: (Rule) => Rule.required().error('Description is required.'),
        }),
        defineField({
            name: 'price',
            title: 'Price',
            type: 'number',
            validation: (Rule) => Rule.required().min(30).error('Price is required and should be a positive number.'),
        }),
        defineField({
            name: 'images',
            title: 'Images',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'url', type: 'url', title: 'Image URL' },
                        { name: 'file', type: 'file', title: 'File' },
                    ]
                }],

            validation: (Rule) => Rule.required().min(2).error('At least 2 image URL is required.'),
        }),
        defineField({
            name: 'url',
            title: 'URL',
            type: 'url',
            validation: (Rule) => Rule.required().uri({ allowRelative: false }).error('A valid URL is required.'),
        }),
        defineField({
            name: 'discount',
            title: 'Discount',
            type: 'number',
            validation: (Rule) => Rule.min(0).max(100).error('Discount should be between 0 and 100.'),
        }),
        defineField({
            name: 'coverImage',
            title: 'Cover Image',
            type: 'object',
            fields: [
                { name: 'url', type: 'url', title: 'Image URL' },
                { name: 'alt', type: 'string', title: 'Alt Text' },
            ],
            validation: (Rule) => Rule.required().error('Cover Image is required.'),
        }),

        defineField({
            name: 'roomType',
            title: 'Room Type',
            type: 'string',
            initialValue: 'single',
            options: {
                list: hotelRoomTypes,
            },
            validation: (Rule) => Rule.required().error('Room Type is required.'),
        }),
        defineField({
            name: 'specialNote',
            title: 'Special Note',
            type: 'text',
            initialValue: 'check-in time is 2:00 PM and check-out time is 11:00 AM',
            description: 'Special note for the room',
            validation: (Rule) => Rule.max(500).error('Special Note should not exceed 500 characters.'),
        }),
        defineField({
            name: 'dimension',
            title: 'Dimension',
            type: 'object',
            fields: [
                { name: 'width', type: 'number', title: 'Width' },
                { name: 'length', type: 'number', title: 'Length' },
                { name: 'height', type: 'number', title: 'Height' },
            ],
            description: 'Dimensions of the room (optional)',
        }),
        defineField({
            name: 'numberOfBeds',
            title: 'Number of Beds',
            type: 'number',
            initialValue: 1,
            validation: (Rule) => Rule.required().min(1).max(10).error('Number of beds is required and should be between 1 and 10.'),
        }),
        defineField({
            name: 'amenities',
            title: 'Amenities',
            type: 'array',
            of: [{
                type: 'object', fields: [
                    { name: 'name', type: 'string', title: 'Amenity Name' },
                    { name: 'icon', type: 'string', title: 'Icon' },
                ]
            }],
            validation: (Rule) => Rule.required().min(1).error('At least one amenity is required.'),
        }),
        defineField({
            name: 'isBooked',
            title: 'Is Booked',
            type: 'boolean',
            initialValue: false,
            description: 'Indicates whether the room is currently booked',
        }),
        defineField({
            name: 'isFeatured',
            title: 'Is Featured',
            type: 'boolean',
            initialValue: false,
            description: 'Indicates whether the room is featured on the website',
        }),
        defineField({
            name: 'reviews',
            title: 'Reviews',
            type: 'array',
            of: [
                {
                    type: 'review',
                },
            ],
        }),
    ],
};

export default hotelRoom;