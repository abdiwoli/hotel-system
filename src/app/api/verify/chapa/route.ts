import { createBooking } from "@/libs/apis";
import { NextRequest, NextResponse } from "next/server";

// /api/verify/chapa
export async function GET(req: NextRequest) {
    console.log('Chapa verification endpoint hit');
    console.log('Request URL:', req.url);
    const { searchParams } = new URL(req.url);
    const tx_ref = searchParams.get('tx_ref');
    const status = searchParams.get('status');

    if (status !== 'successful' || !tx_ref) {
        return NextResponse.json({ message: 'Payment not successful' }, { status: 400 });
    }

    // Confirm tx_ref with Chapa's verify endpoint
    const res = await fetch(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
        headers: {
            Authorization: `Bearer ${process.env.CHAPA_TEST_PUBLIC_SECRET}`,
        },
    });

    const data = await res.json();

    if (data.status === 'success' && data.data.status === 'success') {
        // ✅ Payment is valid
        // 🔥 Create booking here!
        await createBooking({ ...data.data });
        return NextResponse.json({ message: 'Booking created successfully' });
    }

    return NextResponse.json({ message: 'Payment verification failed' }, { status: 400 });
}
