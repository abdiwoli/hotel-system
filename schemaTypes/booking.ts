import { defineField } from 'sanity';

const booking = {
    name: 'booking',
    title: 'Booking',
    type: 'document',
    fields: [
        defineField({
            name: 'user',
            title: 'User',
            type: 'reference',
            to: [{ type: 'user' }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'hotelroom',
            title: 'HotelRoom',
            type: 'reference',
            to: [{ type: 'hotelRoom' }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'checkIn',
            title: 'Check In',
            type: 'datetime',
            options: {
                dateFormat: 'YYYY-MM-DD',
                timeFormat: 'HH:mm:ss',
                timeStep: 2,
            },
        }),
        defineField({
            name: 'checkOut',
            title: 'Check Out',
            type: 'datetime',
            options: {
                dateFormat: 'YYYY-MM-DD',
                timeFormat: 'HH:mm:ss',
                timeStep: 2,
            },
        }),
        defineField({
            name: 'numberOfDays',
            title: 'Number of Days',
            type: 'number',
            initialValue: 1,
            validation: (Rule) => Rule.required().min(1).max(30),
            description: 'Number of days for the booking',
        }),
        defineField({
            name: 'discount',
            title: 'Discount',
            type: 'number',
            initialValue: 0,
            validation: (Rule) => Rule.min(0).max(100),
            description: 'Discount percentage for the booking (0-100)',
        }),
        defineField({
            name: 'adults',
            title: 'Adults',
            type: 'number',
            initialValue: 1,
            validation: (Rule) => Rule.required().min(1).max(10),
            description: 'Number of adults for the booking',
        }),
        defineField({
            name: 'children',
            title: 'Children',
            type: 'number',
            initialValue: 0,
            validation: (Rule) => Rule.min(0).max(10),
            description: 'Number of children for the booking',
        }),
        defineField({
            name: 'totalPrice',
            title: 'Total Price',
            type: 'number',
            validation: (Rule) => Rule.required().min(0),
            description: 'Total price for the booking',
        }),
    ],
    preview: {
        select: {
            title: 'hotelroom.name',
            subtitle: 'user.name',
        },
        prepare({ title, subtitle }: any) {
            return {
                title: `${title} - ${subtitle}`,
                subtitle: `Booking for ${title} by ${subtitle}`,
            };
        },
    },
};

export default booking;