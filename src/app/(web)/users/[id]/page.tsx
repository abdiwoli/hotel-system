// src/app/web/users/[id]/page.tsx

'use client';

import UserBookingDetails from '@/components/Users/UserBookingDetails';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function UserPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Check if the session is loading or not available
    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (!session) {
        // Redirect or show a message if the user is not authenticated
        router.push('/api/auth/signin');
        return null;
    }

    const user = session.user;

    return (
        <div className="container mx-auto p-6">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center space-x-6">
                    <div className="flex-shrink-0">
                        {/* Profile Image */}
                        <Image
                            src={user.image || '/default-avatar.png'} // Fallback to a default avatar
                            alt="Profile Picture"
                            width={120}
                            height={120}
                            className="rounded-full border-2 border-gray-200"
                        />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                        <p className="text-lg text-gray-600">{user.email}</p>
                    </div>
                </div>

                <div className="mt-6">
                    <h2 className="text-2xl font-semibold text-gray-800">User Details</h2>
                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-lg font-medium text-gray-600">User ID:</span>
                            <span className="text-lg text-gray-800">{user.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-lg font-medium text-gray-600">Email:</span>
                            <span className="text-lg text-gray-800">{user.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-lg font-medium text-gray-600">Joined At:</span>
                        </div>
                        {user.id && <UserBookingDetails userId={user.id} />}
                    </div>
                </div>
            </div>

        </div>
    );
}
