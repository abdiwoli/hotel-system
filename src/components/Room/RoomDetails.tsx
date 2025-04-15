'use client';

import { FC, useEffect, useState, useRef } from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { FaBed, FaTv, FaWifi } from 'react-icons/fa';
import { Booking, Room } from '@/app/models/room';
import CheckDate from '../CheckDate/CheckDate';
import { getBookingByRoomId, getPendingBookingData } from '@/libs/apis';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { getStripe } from '@/libs/stripe';
import LoadingSpinner from '@/app/(web)/loading';
import { useRouter } from 'next/navigation';
import PaymentMethodSelector from './PaymentMethodSelector';
import RoomReviews from '../Review/RoomReviews';


interface Props {
    room: Room | null;
}

const iconMap: Record<string, React.ReactNode> = {
    'fa-bed': <FaBed />,
    'fa-tv': <FaTv />,
    'fa-wifi': <FaWifi />,
};

const RoomDetails: FC<Props> = ({ room }) => {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const { data: session } = useSession();
    const [numberOfDays, setNumberOfDays] = useState(0);
    const [loading, setLoading] = useState(false);
    const [Books, setBooks] = useState<Booking[]>([]);
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'chapa'>('stripe');
    const paymentMethodRef = useRef<'stripe' | 'chapa'>('stripe');



    const updatePaymentMethod = (method: 'stripe' | 'chapa') => {
        paymentMethodRef.current = method;
        setPaymentMethod(method);
    };

    const handleDateChange = (newCheckIn: string, newCheckOut: string, newAdults: number, newChildren: number) => {
        setCheckIn(newCheckIn);
        setCheckOut(newCheckOut);
        setAdults(newAdults);
        setChildren(newChildren);

        const checkInDate = new Date(newCheckIn);
        const checkOutDate = new Date(newCheckOut);
        const diffTime = checkOutDate.getTime() - checkInDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        setNumberOfDays(diffDays);
        if (diffDays > 0 && room) {
            const pricePerNight = room.discount ? room.price * (1 - room.discount / 100) : room.price;
            setTotalPrice(diffDays * pricePerNight);
        } else {
            setTotalPrice(0);
        }
    };

    useEffect(() => {
        async function fetchBookingData() {
            if (!room || !room.isBooked) return;
            try {
                const books = await getBookingByRoomId(room._id);
                if (books && books.length > 0) {
                    setBooks(books);
                }
            } catch (error: any) {
                console.log("error fetching booking data", error);
            }
        }
        fetchBookingData();
    }, [room]);

    const handleBooking = async () => {
        try {
            setLoading(true);
            const method = paymentMethodRef.current; // 🔥 always fresh
            console.log('Final method selected:', method); // Optional debug

            const payload = {
                adults,
                checkinDate: checkIn,
                checkoutDate: checkOut,
                children,
                numberOfDays,
                hotelRoomSlug: room?.slug.current,
            };

            if (method === 'stripe') {
                const stripe = await getStripe();
                const { data: stripeSession } = await axios.post('/api/stripe', payload);
                await stripe?.redirectToCheckout({ sessionId: stripeSession.id });
            } else if (method === 'chapa') {
                const { data } = await axios.post('/api/chapa', payload);
                console.log('Chapa response:', data);
                router.push(data?.checkout_url);
            }

        } catch (error: any) {
            setLoading(false);
            if (error?.response?.status === 401) {
                const shouldLogin = window.confirm('You need to log in to book a room. Do you want to go to the login page?');
                if (shouldLogin) {
                    router.push(`/auth?url=rooms&slug=${room?.slug.current}&roomType=${room?.roomType}`);
                }
                return;
            }
            toast.error(`Booking failed: ${error?.response?.data?.message || error.message}`);
        }
    };



    if (!room) return <>No room selected.</>;

    const galleryImages = [
        {
            original: room.coverImage.url.trim(),
            thumbnail: room.coverImage.url.trim(),
            originalAlt: room.coverImage.alt || room.name,
        },
        ...room.images.map((img) => ({
            original: img.url.trim(),
            thumbnail: img.url.trim(),
            originalAlt: room.name,
        })),
    ];

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h1 className="text-3xl font-bold capitalize">{room.name}</h1>
                <div className="text-right">
                    {room.discount && <div className="text-lg text-red-500 line-through">${room.price}</div>}
                    <div className="text-2xl font-semibold text-green-600">
                        ${room.discount ? (room.price * (1 - room.discount / 100)).toFixed(2) : room.price}/night
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Left: Images, Details */}
                <div className="space-y-6">
                    <ImageGallery
                        items={galleryImages}
                        showPlayButton={false}
                        showFullscreenButton
                        showNav
                        lazyLoad
                        thumbnailPosition="bottom"
                    />

                    <div>
                        <h2 className="text-xl font-semibold mt-4 mb-2">Amenities</h2>
                        <div className="flex flex-wrap gap-3">
                            {room.amenities.map((amenity) => (
                                <div
                                    key={amenity._key}
                                    className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl shadow-sm text-blue-800"
                                >
                                    {iconMap[amenity.icon] || <FaBed />}<span className="capitalize">{amenity.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <InfoCard label="Room Type" value={room.roomType} />
                        <InfoCard label="Beds" value={room.numberOfBeds?.toString()} />
                    </div>
                </div>

                {/* Right: Description and CheckDate */}
                <div className="flex flex-col gap-6">
                    <div>
                        <p className="whitespace-pre-wrap text-gray-700">{room.description}</p>
                        {room.specialNote && (
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4 rounded-lg shadow">
                                <p className="text-sm text-yellow-800">{room.specialNote}</p>
                            </div>
                        )}
                    </div>

                    <CheckDate onDateChange={handleDateChange} bookings={Books} />
                    <PaymentMethodSelector selected={paymentMethod} onSelect={updatePaymentMethod} />

                    {totalPrice > 0 && (
                        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
                            <div className="text-xl font-semibold">Total: ${totalPrice.toFixed(2)}</div>
                            <button
                                onClick={handleBooking}
                                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition shadow text-lg"
                            >
                                Book Now
                            </button>
                        </div>
                    )}
                </div>

            </div>
            <RoomReviews hotelRoomId={room._id} slug={room.slug.current} />

            {/* Booking Status */}

            {loading && (
                <div className="fixed inset-0 z-50 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            )}
        </div>
    );
};

const InfoCard: FC<{ label: string; value: string; status?: boolean }> = ({ label, value, status }) => (
    <div className="bg-gray-100 rounded-xl p-4 text-center shadow">
        <span className="block text-sm text-gray-500">{label}</span>
        <span className={`text-lg font-medium ${label === 'Status' ? (status ? 'text-red-600' : 'text-green-600') : ''}`}>
            {value}
        </span>
    </div>
);

export default RoomDetails;
