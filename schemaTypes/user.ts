import { de } from 'date-fns/locale';
import { defineField, defineType } from 'sanity';

const user = {
    name: 'user',
    title: 'User',
    type: 'document',
    fields: [
        defineField(
            {
                name: 'admin',
                title: 'Is Admin',
                type: 'boolean',
                description: 'Is this user an admin?',
                initialValue: false,
                validation: (Rule) => Rule.required(),
                // readOnly: true
                //hidden: true
            }
        ),
        defineField(
            {
                name: 'name',
                title: 'Name',
                type: 'string',
                description: 'Name of the user',
                readOnly: true,
                validation: (Rule) => Rule.required(),
            }
        ),
        defineField(
            {
                name: 'email',
                title: 'Email',
                type: 'string',
                description: 'Email of the user',
                readOnly: true,
                validation: (Rule) => Rule.required().email(),
            }
        ),
        defineField(
            {
                name: 'image',
                title: 'Image',
                type: 'url',
                description: 'Image of the user',
                readOnly: true,
            }),
        defineField(
            {
                name: 'createdAt',
                title: 'Created At',
                type: 'datetime',
                description: 'Date of creation',
                options: {
                    dateFormat: 'YYYY-MM-DD',
                    timeFormat: 'HH:mm:ss',
                    timeStep: 2,
                },
                readOnly: true,
            }
        ),
        defineField(
            {
                name: 'updatedAt',
                title: 'Updated At',
                type: 'datetime',
                description: 'Date of last update',
                options: {
                    dateFormat: 'YYYY-MM-DD',
                    timeFormat: 'HH:mm:ss',
                    timeStep: 2,
                },
                readOnly: true,
            }
        ),
        defineField(
            {
                name: 'password',
                title: 'Password',
                type: 'string',
                description: 'Password of the user',
                hidden: true,
                readOnly: true,

            }),
        defineField({
            name: "about",
            title: "About",
            type: "text",
            description: "About the user",
        })


    ]
}

export default user;
