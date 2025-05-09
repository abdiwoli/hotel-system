import { defineField, defineType } from 'sanity';


const verificationToken = defineType({
    name: 'verificationToken',
    title: 'Verification Token',
    type: 'document',
    fields: [
        defineField({
            name: 'identifier',
            title: 'Identifier',
            type: 'string',
        }),
        defineField({
            name: 'token',
            title: 'Token',
            type: 'string',
        }),
        defineField({
            name: 'expires',
            title: 'Expires',
            type: 'datetime',
        }),
    ],
});

export default verificationToken;