import { NextRequest, NextResponse } from "next/server";

// /api/verify/chapa
export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const tx_ref = url.searchParams.get("tx_ref");
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
