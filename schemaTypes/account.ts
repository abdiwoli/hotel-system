import { defineField } from "sanity";

const account = {
    name: 'account',
    title: 'Account',
    type: 'document',
    fields: [
        defineField({
            name: 'providerType',
            type: 'string',
        }),
        defineField({
            name: 'providerId',
            type: 'string',
        }),
        defineField({
            name: 'providerAccountId',
            type: 'string',
        }),
        defineField({
            name: 'refreshToken',
            type: 'string',
        }),
        defineField({
            name: 'accessToken',
            type: 'string',
        }),
        defineField({
            name: 'expires_at',
            type: 'number',
        }),
        defineField({
            name: 'user',
            type: 'reference',
            title: 'user',
            to: [{ type: 'user' }],
        }),
    ]
};

export default account;
