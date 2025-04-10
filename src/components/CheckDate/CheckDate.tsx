import { Booking } from '@/app/models/room';
import { getAvailableDates } from '@/libs/dateAvailability';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface CheckDateProps {
    onDateChange: (
        checkIn: string,
        checkOut: string,
        adults: number,
        children: number
    ) => void;
    bookings: Booking[];
}

const CheckDate: React.FC<CheckDateProps> = ({ onDateChange, bookings }) => {
    const [checkIn, setCheckIn] = useState<Date | null>(null);
    const [checkOut, setCheckOut] = useState<Date | null>(null);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [error, setError] = useState('');
    const [availableDates, setAvailableDates] = useState({
        disabledDates: [] as Date[],
        availableDateRanges: [] as { start: Date; end: Date }[],
    });

    useEffect(() => {
        setAvailableDates(getAvailableDates(bookings));
    }, [bookings]);

    const handleCheckInChange = (date: Date | null) => {
        setCheckIn(date);
        setCheckOut(null);
        if (date && checkOut && date >= checkOut) {
            setError('Check-out must be after check-in');
        } else {
            setError('');
            updateParent(date, checkOut);
        }
    };

    const handleCheckOutChange = (date: Date | null) => {
        setCheckOut(date);
        if (date && checkIn && date <= checkIn) {
            setError('Check-out must be after check-in');
        } else {
            setError('');
            updateParent(checkIn, date);
        }
    };

    const updateParent = (newCheckIn: Date | null, newCheckOut: Date | null) => {
        if (newCheckIn && newCheckOut) {
            onDateChange(
                newCheckIn.toISOString().split('T')[0],
                newCheckOut.toISOString().split('T')[0],
                adults,
                children
            );
        }
    };

    const isDateAvailable = (date: Date) =>
        availableDates.availableDateRanges.some(
            (range) => date >= range.start && date <= range.end
        );

    const getDayClassName = (date: Date) => {
        const baseClasses = 'react-datepicker__day';
        if (!isDateAvailable(date)) {
            return `${baseClasses} bg-red-50 text-red-800 border border-red-300 line-through cursor-not-allowed`;
        }
        return `${baseClasses} hover:bg-blue-50`;
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-4 space-y-4 w-full">
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium block mb-1">Check-In</label>
                    <DatePicker
                        selected={checkIn}
                        onChange={handleCheckInChange}
                        selectsStart
                        startDate={checkIn}
                        endDate={checkOut}
                        minDate={new Date()}
                        filterDate={isDateAvailable}
                        dayClassName={getDayClassName}
                        className="p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholderText="Select check-in date"
                        popperPlacement="bottom-start"
                        excludeDates={availableDates.disabledDates}
                    />
                </div>
                <div>
                    <label className="text-sm font-medium block mb-1">Check-Out</label>
                    <DatePicker
                        selected={checkOut}
                        onChange={handleCheckOutChange}
                        selectsEnd
                        startDate={checkIn}
                        endDate={checkOut}
                        minDate={checkIn || new Date()}
                        filterDate={isDateAvailable}
                        dayClassName={getDayClassName}
                        className="p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholderText="Select check-out date"
                        popperPlacement="bottom-start"
                        disabled={!checkIn}
                        excludeDates={availableDates.disabledDates}
                    />
                </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="adults" className="text-sm font-medium block mb-1">
                        Adults
                    </label>
                    <input
                        type="number"
                        id="adults"
                        min={1}
                        value={adults}
                        onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            setAdults(val);
                            if (checkIn && checkOut) updateParent(checkIn, checkOut);
                        }}
                        className="p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="children" className="text-sm font-medium block mb-1">
                        Children
                    </label>
                    <input
                        type="number"
                        id="children"
                        min={0}
                        value={children}
                        onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setChildren(val);
                            if (checkIn && checkOut) updateParent(checkIn, checkOut);
                        }}
                        className="p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex items-center text-xs text-gray-500 space-x-6">
                <span className="flex items-center">
                    <span className="w-3 h-3 bg-green-100 border border-green-500 mr-1"></span>
                    Available
                </span>
                <span className="flex items-center">
                    <span className="w-3 h-3 bg-red-100 border border-red-500 mr-1"></span>
                    Booked
                </span>
            </div>
        </div>
    );
};

export default CheckDate;
