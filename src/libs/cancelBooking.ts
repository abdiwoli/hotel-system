import sanityClient from "./sanity";

const cancelBooking = async (bookingId: string) => {
    const mutation = [
        {
            delete: {
                id: bookingId,
            },
        },
    ];

    try {
        const response = await sanityClient.mutate(mutation);
        return response;
    } catch (error) {
        console.error("Error cancelling booking:", error);
        throw new Error("Failed to cancel booking");
    }
}

export default cancelBooking;