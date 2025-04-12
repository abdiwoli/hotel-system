import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const CHAPA_SECRET = process.env.STRIPE_WEBHOOK_SECRET!; // Using same env var

function verifySignature({
    payload,
    signature,
    type,
}: {
    payload: string;
    signature: string;
    type: 'x-chapa-signature' | 'Chapa-Signature';
}) {
    const dataToSign = type === 'x-chapa-signature' ? payload : CHAPA_SECRET;
    const expectedSignature = crypto
        .createHmac('sha256', CHAPA_SECRET)
        .update(dataToSign)
        .digest('hex');

    return signature === expectedSignature;
}

export async function POST(req: NextRequest) {
    const chapaSig = req.headers.get('Chapa-Signature');
    const xChapaSig = req.headers.get('x-chapa-signature');
    const rawBody = await req.text();

    const isValidX =
        xChapaSig &&
        verifySignature({
            payload: rawBody,
            signature: xChapaSig,
            type: 'x-chapa-signature',
        });

    const isValidChapa =
        chapaSig &&
        verifySignature({
            payload: rawBody,
            signature: chapaSig,
            type: 'Chapa-Signature',
        });

    const isValid = isValidX || isValidChapa;

    console.log('Chapa Webhook Signature Valid:', isValid);

    // Continue processing regardless of signature validity
    try {
        const data = JSON.parse(rawBody);
        console.log('Webhook event:', data);

        // Your event processing logic goes here

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
}
