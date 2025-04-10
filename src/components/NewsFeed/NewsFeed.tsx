'use client';

import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiClock, FiCalendar, FiTag } from 'react-icons/fi';

interface NewsItem {
    id: number;
    title: string;
    excerpt: string;
    date: string;
    type: 'announcement' | 'promotion' | 'event';
    imageUrl?: string;
    link?: string;

}

const images = [
    "https://plus.unsplash.com/premium_photo-1682093007363-b05f4c3dc932?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1733760124994-8e621ccb1553?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1733514432827-554ebb42efa0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1661916762370-4768aa1fc4c4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDUzfHx8ZW58MHx8fHx8",
    "https://plus.unsplash.com/premium_photo-1681487479203-464a22302b27?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDYwfHx8ZW58MHx8fHx8",
    "https://plus.unsplash.com/premium_photo-1661770069841-4c64dc77269c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDY4fHx8ZW58MHx8fHx8"
];

export default function NewsFeed() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);



    // Sample data - replace with your API calls
    const newsItems: NewsItem[] = [
        {
            id: 1,
            title: "Summer Special: 20% Off All Suites",
            excerpt: "Book now and enjoy our luxurious suites with a special summer discount. Limited time offer.",
            date: "2023-06-15",
            type: "promotion",
            imageUrl: images[0],
            link: "/promotions/summer-special"
        },
        {
            id: 2,
            title: "New Wellness Center Now Open",
            excerpt: "Experience our state-of-the-art wellness center featuring a spa, gym, and yoga studio.",
            date: "2023-06-10",
            type: "announcement",
            imageUrl: images[1],
            link: "/facilities/wellness-center"
        },
        {
            id: 3,
            title: "Weekly Live Music Evenings",
            excerpt: "Join us every Friday and Saturday night for live jazz performances in our lobby lounge.",
            date: "2023-06-05",
            type: "event",
            imageUrl: images[2],
            link: "/events/live-music"
        },
        {
            id: 4,
            title: "Seasonal Menu Launch at Our Restaurant",
            excerpt: "Our executive chef has prepared a new seasonal menu featuring local ingredients.",
            date: "2023-05-28",
            type: "announcement",
            imageUrl: images[3],
            link: "/dining/restaurant"
        }
    ];

    // Auto-rotate items
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % newsItems.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, newsItems.length]);

    const goToPrev = () => {
        setActiveIndex((prev) => (prev - 1 + newsItems.length) % newsItems.length);
        setIsAutoPlaying(false);
    };

    const goToNext = () => {
        setActiveIndex((prev) => (prev + 1) % newsItems.length);
        setIsAutoPlaying(false);
    };

    const goToIndex = (index: number) => {
        setActiveIndex(index);
        setIsAutoPlaying(false);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'promotion': return <FiTag className="mr-1" />;
            case 'event': return <FiClock className="mr-1" />;
            default: return <FiCalendar className="mr-1" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'promotion': return 'bg-amber-100 text-amber-800';
            case 'event': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">News & Updates</h2>
                    <p className="text-lg text-gray-600">Stay informed about our latest offers and events</p>
                </div>

                <div className="relative overflow-hidden rounded-xl shadow-lg bg-white">
                    {/* Main Carousel */}
                    <div className="relative h-96 md:h-[32rem]">
                        {newsItems.map((item, index) => (
                            <div
                                key={item.id}
                                className={`absolute inset-0 transition-opacity duration-500 flex ${index === activeIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                            >
                                <div className="w-full md:w-1/2 h-full">
                                    <img
                                        src={item.imageUrl || '/images/default-news.jpg'}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="hidden md:flex md:w-1/2 h-full p-8 flex-col justify-center bg-gradient-to-r from-white via-white to-transparent">
                                    <div className="max-w-md ml-auto">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(item.type)}`}>
                                            {getTypeIcon(item.type)}
                                            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                        </span>
                                        <h3 className="mt-4 text-3xl font-bold text-gray-900">{item.title}</h3>
                                        <p className="mt-3 text-lg text-gray-600">{item.excerpt}</p>
                                        <div className="mt-4 text-sm text-gray-500">
                                            Posted on {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </div>
                                        {item.link && (
                                            <a
                                                href={item.link}
                                                className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white  hover:bg-indigo-200 transition-colors"
                                            >
                                                Learn more
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Mobile View */}
                        <div className="md:hidden absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent">
                            <div className="p-6 text-white">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(newsItems[activeIndex].type)}`}>
                                    {getTypeIcon(newsItems[activeIndex].type)}
                                    {newsItems[activeIndex].type.charAt(0).toUpperCase() + newsItems[activeIndex].type.slice(1)}
                                </span>
                                <h3 className="mt-2 text-2xl font-bold">{newsItems[activeIndex].title}</h3>
                                <p className="mt-1 text-gray-200">{newsItems[activeIndex].excerpt}</p>
                                {newsItems[activeIndex].link && (
                                    <a
                                        href={newsItems[activeIndex].link}
                                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-gray-100 transition-colors"
                                    >
                                        Learn more
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Navigation Arrows */}
                        <button
                            onClick={goToPrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all hover:scale-110 z-10"
                            aria-label="Previous news"
                        >
                            <FiChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all hover:scale-110 z-10"
                            aria-label="Next news"
                        >
                            <FiChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                        {newsItems.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all ${index === activeIndex ? 'bg-white w-6' : 'bg-white/50'}`}
                                aria-label={`Go to news item ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* List View for Smaller Screens */}
                <div className="mt-8 grid gap-6 md:hidden">
                    {newsItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <img
                                src={item.imageUrl || '/images/default-news.jpg'}
                                alt={item.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(item.type)}`}>
                                    {getTypeIcon(item.type)}
                                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                </span>
                                <h3 className="mt-2 text-xl font-bold text-gray-900">{item.title}</h3>
                                <p className="mt-1 text-gray-600">{item.excerpt}</p>
                                <div className="mt-2 text-sm text-gray-500">
                                    Posted on {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </div>
                                {item.link && (
                                    <a
                                        href={item.link}
                                        className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                                    >
                                        Learn more
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

