'use client';
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-red-600 mb-4">Something went wrong!</h1>
            {/* Display the specific error message */}
            <p className="text-lg text-gray-700 mb-8">
                {error.message || 'An unexpected error occurred. Please try again.'}
            </p>
            <button
                onClick={() => reset()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            >
                Try Again
            </button>
        </div>
    );
}
