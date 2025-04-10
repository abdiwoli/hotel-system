import { Booking } from "@/app/models/room";

export const getAvailableDates = (bookings: Booking[], monthsToShow = 3): {
    disabledDates: Date[],
    availableDateRanges: { start: Date, end: Date }[]
} => {
    if (!bookings || bookings.length === 0) {
        // All dates are available if no bookings
        const today = new Date();
        const futureDate = new Date();
        futureDate.setMonth(today.getMonth() + monthsToShow);
        return {
            disabledDates: [],
            availableDateRanges: [{ start: today, end: futureDate }]
        };
    }

    // Sort bookings by check-in date
    const sortedBookings = [...bookings].sort((a, b) =>
        new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime()
    );

    // Find all unavailable date ranges (booked periods)
    const unavailableRanges = sortedBookings.map(booking => ({
        start: new Date(booking.checkIn),
        end: new Date(booking.checkOut)
    }));

    // Find available date ranges between bookings
    const availableDateRanges: { start: Date, end: Date }[] = [];
    let lastEndDate = new Date(); // Start from today

    for (const range of unavailableRanges) {
        if (range.start > lastEndDate) {
            availableDateRanges.push({
                start: new Date(lastEndDate),
                end: new Date(range.start)
            });
        }
        if (range.end > lastEndDate) {
            lastEndDate = new Date(range.end);
        }
    }

    // Add the remaining dates after last booking
    const futureDate = new Date();
    futureDate.setMonth(lastEndDate.getMonth() + monthsToShow);
    availableDateRanges.push({
        start: new Date(lastEndDate),
        end: futureDate
    });

    // Generate all disabled dates (for react-datepicker)
    const disabledDates: Date[] = [];
    unavailableRanges.forEach(range => {
        const current = new Date(range.start);
        while (current < range.end) {
            disabledDates.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
    });

    return { disabledDates, availableDateRanges };
};