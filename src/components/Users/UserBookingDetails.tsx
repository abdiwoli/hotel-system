import { Booking } from "@/app/models/room";
import { getBookingByUserId } from "@/libs/apis";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import cancelBooking from "@/libs/cancelBooking";

interface UserBookingDetailsProps {
    userId: string;
}

const UserBookingDetails: React.FC<UserBookingDetailsProps> = ({ userId }) => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchBookingData() {
            if (userId) {
                try {
                    const bookings: Booking[] = await getBookingByUserId(userId);
                    setBookings(bookings);
                } catch (error) {
                    console.error("Error fetching booking data:", error);
                }
            }
        }
        fetchBookingData();
    }, [userId]);

    const handleCancel = async (bookingId: string) => {
        setLoading(true);
        try {
            await cancelBooking(bookingId); // Assuming you have an API for canceling the booking
            setBookings((prevBookings) => prevBookings.filter((b) => b._id !== bookingId));
            alert("Booking canceled successfully!");
        } catch (error) {
            console.error("Error canceling booking:", error);
            alert("Error canceling the booking.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Bookings</h2>
            {loading && <p className="text-gray-500">Loading...</p>}
            {bookings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {bookings.map((booking) => {
                        const isValid = new Date(booking.checkIn) >= new Date(); // Check if the booking is upcoming
                        return (
                            <div
                                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                key={booking._id}
                            >
                                <h3 className="text-xl font-bold text-gray-700"></h3>
                                <p className="text-gray-600">Check-in: {format(new Date(booking.checkIn), 'MMM dd, yyyy')}</p>
                                <p className="text-gray-600">Check-out: {format(new Date(booking.checkOut), 'MMM dd, yyyy')}</p>
                                <p className="text-gray-600">Adults: {booking.adults}</p>
                                <p className="text-gray-600">Children: {booking.children}</p>
                                <p className="text-gray-600 font-semibold">Total Price: ${booking.totalPrice}</p>
                                <p className="text-gray-600">Status: {isValid ? "Current" : "Past"}</p>

                                {isValid && (
                                    <button
                                        onClick={() => handleCancel(booking._id)}
                                        className="mt-4 px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-300"
                                    >
                                        Cancel Booking
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-gray-500">You have no bookings.</p>
            )}
        </div>
    );
};

export default UserBookingDetails;
