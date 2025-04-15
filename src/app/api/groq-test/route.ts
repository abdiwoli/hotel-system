// app/api/chat/route.ts
import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Helper function to read knowledge file
async function getHotelKnowledge(): Promise<string> {
    try {
        const knowledgePath = path.join(process.cwd(), 'knowledge', 'hotel-info.md');
        return await fs.promises.readFile(knowledgePath, 'utf-8');
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
      You are the AI concierge for Munawara hotel System. Use the following knowledge to answer questions about the hotel.
      For non-hotel questions, use your general knowledge.
      
      Hotel Knowledge:
      ${hotelKnowledge}
      
      Guidelines:
      1. Be friendly and professional
      2. If asked about hotel policies, amenities, or services, reference the knowledge base
      3. For unrelated questions, answer using your general knowledge
      4. If unsure, say "I'll check with our staff and get back to you"
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