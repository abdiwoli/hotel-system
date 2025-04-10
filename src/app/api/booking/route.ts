import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("📥 Booking API received:", body);

        // Simplified mutation with minimal data to test
        const mutation = {
            mutations: [
                {
                    create: {
                        _type: "booking",
                        user: {
                            _type: "reference",
                            _ref: body.user || "user.test",  // Test with a static user ID for now
                        },
                        hotelRoom: {
                            _type: "reference",
                            _ref: body.hotelRoom || "hotelRoom.test",  // Test with a static room ID for now
                        },
                        checkInDate: body.checkInDate || "2025-04-22",  // Default test date
                        checkOutDate: body.checkOutDate || "2025-04-30",  // Default test date
                        totalPrice: body.totalPrice || 100,  // Test with a default price
                    },
                },
            ],
        };

        const sanityUrl = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/${process.env.NEXT_PUBLIC_SANITY_API_VERSION}/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`;
        const headers = {
            Authorization: `Bearer ${process.env.SANITY_API_TOKEN}`,
        };

        console.log("📡 Sending mutation to Sanity:", mutation);

        const { data } = await axios.post(sanityUrl, mutation, { headers });

        console.log("✅ Booking created:", data);

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error("❌ Booking API error:", error?.response?.data || error.message, error);
        return NextResponse.json(
            { success: false, error: error?.response?.data || error.message },
            { status: 500 }
        );
    }
}
;