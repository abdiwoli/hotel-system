import { defineField, defineType } from 'sanity';

const review = defineType({
    name: 'review',
    title: 'Review',
    type: 'document',
    fields: [
        defineField({
            name: 'user',
            type: 'reference',
            title: 'User',
            to: [{ type: 'user' }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'hotelRoom',
            type: 'reference',
            title: 'Hotel Room',
            to: [{ type: 'hotelRoom' }],
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'rating',
            type: 'number',
            title: 'Rating',
            validation: (Rule) => Rule.required().min(1).max(5).error('Rating is required and should be between 1 and 5.'),
        }),
        defineField({
            name: 'comment',
            type: 'text',
            title: 'Comment',
        }),
        defineField({
            name: 'date',
            type: 'datetime',
            title: 'Date of Review',
        }),
    ],
});

export default review;