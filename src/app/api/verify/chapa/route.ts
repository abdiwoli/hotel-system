import { createBooking, deletePendingBooking, getPendingBookingData } from "@/libs/apis";
import { NextRequest, NextResponse } from "next/server";

// /api/verify/chapa
export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const tx_ref = url.searchParams.get("trx_ref");
    const status = url.searchParams.get("status");

    console.log("🌐 Chapa verification endpoint hit");
    console.log("🔗 Full URL:", url.toString());
    console.log("📦 Received params:", { tx_ref, status });

    // Basic validation
    if (!tx_ref) {
        console.log("❌ Missing tx_ref");
        return NextResponse.json({ message: "Missing tx_ref" }, { status: 400 });
    }

    if (!status) {
        console.log("❌ Missing status");
        return NextResponse.json({ message: "Missing status" }, { status: 400 });
    }

    // Make sure status is actually marked successful
    if (status.toLowerCase() !== "success" && status.toLowerCase() !== "successful") {
        console.log("❌ Status is not 'success' or 'successful'");
        return NextResponse.json({ message: "Payment not successful" }, { status: 400 });
    }

    // Hit Chapa verify endpoint
    const verifyUrl = `https://api.chapa.co/v1/transaction/verify/${tx_ref}`;
    console.log("🔍 Verifying with Chapa:", verifyUrl);

    try {
        const chapaRes = await fetch(verifyUrl, {
            headers: {
                Authorization: `Bearer ${process.env.CHAPA_TEST_PUBLIC_SECRET}`,
                "Content-Type": "application/json",
            },
        });

        const data = await chapaRes.json();
        console.log("✅ Chapa response:", data);

        if (data.status === "success" && data.data?.status === "success") {
            console.log("🎉 Payment verified successfully");
            // Here you would typically create a booking in your database

            const bookingData = await getPendingBookingData(tx_ref);
            console.log("📦 Booking data:", bookingData);
            if (!bookingData) {
                return NextResponse.json({ message: 'Pending booking not found' }, { status: 404 });
            }

            const bookingPayload = {
                adults: bookingData.adults,
                checkIn: bookingData.checkIn,
                checkOut: bookingData.checkOut,
                children: bookingData.children,
                hotelroom: bookingData.hotelroom._ref,
                numberOfDays: bookingData.numberOfDays,
                totalPrice: bookingData.totalPrice,
                discount: bookingData.discount,
                user: bookingData.user._ref,
            };

            const create = await createBooking(bookingPayload);
            if (!create) {
                return NextResponse.json({ message: 'Failed to create booking' }, { status: 500 });
            }

            const deleted = await deletePendingBooking(bookingData._id);
            if (!deleted) {
                console.error('Failed to delete pending booking:', deleted);
                return NextResponse.json({ message: 'Failed to delete pending booking' }, { status: 500 });
            }





            // return NextResponse.json({ message: "Payment verified successfully" });
            return NextResponse.json({ message: "Booking created successfully" });
        } else {
            console.error("❌ Chapa verification failed:", data);
            return NextResponse.json({ message: "Payment verification failed", data }, { status: 400 });
        }
    } catch (err) {
        console.error("💥 Verification error:", err);
        return NextResponse.json({ message: "Server error during verification" }, { status: 500 });
    }
}
