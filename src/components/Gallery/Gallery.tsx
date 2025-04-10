'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight, FiX, FiMaximize } from 'react-icons/fi';

const images = [
    "https://plus.unsplash.com/premium_photo-1682093007363-b05f4c3dc932?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1733760124994-8e621ccb1553?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1733514432827-554ebb42efa0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1661916762370-4768aa1fc4c4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDUzfHx8ZW58MHx8fHx8",
    "https://plus.unsplash.com/premium_photo-1681487479203-464a22302b27?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDYwfHx8ZW58MHx8fHx8",
    "https://plus.unsplash.com/premium_photo-1661770069841-4c64dc77269c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDY4fHx8ZW58MHx8fHx8"
];

const imageTitles = [
    "Luxury Suite with Ocean View",
    "Infinity Pool at Sunset",
    "Executive Lounge Area",
    "Gourmet Restaurant Interior",
    "Spa & Wellness Center",
    "Grand Ballroom for Events"
];

export default function HotelGallery() {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        document.body.style.overflow = 'auto';
    };

    const navigate = (direction: 'prev' | 'next') => {
        if (direction === 'prev') {
            setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
        } else {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }
    };

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Gallery</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover the elegance and comfort of our hotel through these captivating images
                    </p>
                </div>

                {/* Main Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((src, index) => (
                        <div
                            key={index}
                            className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                                <Image
                                    src={src}
                                    alt={imageTitles[index]}
                                    width={800}
                                    height={400}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-white text-xl font-semibold">{imageTitles[index]}</h3>
                                    <button
                                        onClick={() => openLightbox(index)}
                                        className="mt-3 inline-flex items-center px-4 py-2 bg-white/90 text-gray-900 rounded-lg hover:bg-white transition-colors"
                                    >
                                        <FiMaximize className="mr-2" />
                                        View Fullscreen
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Lightbox Modal */}
                {lightboxOpen && (
                    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
                        <button
                            onClick={closeLightbox}
                            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors"
                            aria-label="Close lightbox"
                        >
                            <FiX className="w-8 h-8" />
                        </button>

                        <div className="relative w-full max-w-6xl">
                            <div className="aspect-w-16 aspect-h-9">
                                <Image
                                    src={images[currentImageIndex]}
                                    alt={imageTitles[currentImageIndex]}
                                    width={1200}
                                    height={800}
                                    className="w-full h-full object-contain"
                                    priority
                                />
                            </div>
                            <div className="mt-4 text-center text-white">
                                <h3 className="text-xl font-semibold">{imageTitles[currentImageIndex]}</h3>
                                <p className="text-gray-300">{currentImageIndex + 1} of {images.length}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('prev')}
                            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
                            aria-label="Previous image"
                        >
                            <FiChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => navigate('next')}
                            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
                            aria-label="Next image"
                        >
                            <FiChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}