// app/api/chat/route.ts
import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import getMenu from '@/libs/getMenu';

// Helper function to read knowledge file
async function getHotelKnowledge(): Promise<string> {
    try {
        const knowledgePath = path.join(process.cwd(), 'knowledge', 'hotel-info.md');

        // Wait for the menu data and file reading to finish
        const foodMenu = await getMenu();
        const fileText = await fs.promises.readFile(knowledgePath, 'utf-8');

        // Convert the foodMenu array of objects to a string (including price)
        const foodMenuText = foodMenu.map(item => {
            const priceText = item.price ? ` \n Price: $${item.price.toFixed(2)}` : '';
            return `${item.name}: ${item.description}${priceText}`;
        }).join('\n');

        // Concatenate the food menu text and the file text
        return `${foodMenuText}\n\n\n\n${fileText}`;
    } catch (error) {
        console.error('Error reading knowledge file:', error);
        return '';
    }
}



export async function POST(request: Request) {
    if (!process.env.GROQ_API_KEY) {
        return NextResponse.json(
            { error: 'Server configuration error' },
            { status: 500 }
        );
    }

    try {
        const { message } = await request.json();
        const hotelKnowledge = await getHotelKnowledge();

        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });

        const systemPrompt = `
You are the AI concierge for Munawara Hotel & Resort. Use the following knowledge to answer questions about the hotel.
For questions that are not related to the hotel or its services, use your best general knowledge based on your training (i.e., knowledge that is not part of the hotel's specific knowledge base).

Hotel Knowledge:
${hotelKnowledge}

Guidelines:
1. Be friendly, professional, and concise.
2. Always format your responses in a structured and readable way.
3. When listing things like a menu, use numbered lists with proper spacing and clear formatting.
4. Present each item with its **name**, **description**, and **price**, ensuring each piece of information is easy to find.
5. If a response requires multiple pieces of information, use bullet points or numbered lists to keep the answer neat and organized.
6. If unsure, say "I'll check with our staff and get back to you."
7. For non-hotel related queries, use your best knowledge from your training outside the hotel's knowledge base.
`;


        const response = await groq.chat.completions.create({
            model: 'llama3-70b-8192',
            messages: [
                {
                    role: 'system',
                    content: systemPrompt,
                },
                {
                    role: 'user',
                    content: message,
                },
            ],
            temperature: 0.7,
            max_tokens: 1024,
        });

        const botResponse = response.choices[0]?.message?.content;

        if (!botResponse) {
            throw new Error('No response from AI model');
        }

        return NextResponse.json({ message: botResponse });

    } catch (error: any) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to process request' },
            { status: 500 }
        );
    }
}