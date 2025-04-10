"use client";
import { Room } from "@/app/models/room";
import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { iconMap } from "@/libs/iconMap";
import Link from "next/link";

type Props = {
    featuredRooms: Room[];
};

const FeaturedRoom: FC<Props> = ({ featuredRooms }) => {
    const [featuredRoom, setFeaturedRoom] = useState(featuredRooms[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * featuredRooms.length);
            setFeaturedRoom(featuredRooms[randomIndex]);
        }, 5000);

        return () => clearInterval(interval);
    }, [featuredRooms]);

    return (
        <section className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row gap-10 bg-white/5 backdrop-blur rounded-2xl p-6 shadow-lg border border-gray-800">
                {/* Image Gallery */}
                <div className="md:w-1/2 space-y-4">
                    <div className="rounded-2xl overflow-hidden aspect-video shadow-md">
                        <Image
                            src={featuredRoom.coverImage.url}
                            alt={featuredRoom.name}
                            width={800}
                            height={500}
                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {featuredRoom.images.slice(1, 3).map((image) => (
                            <div key={image._key} className="rounded-2xl overflow-hidden aspect-video shadow-sm">
                                <Image
                                    src={image.url}
                                    alt={image._key}
                                    width={400}
                                    height={300}
                                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Room Info */}
                <div className="md:w-1/2 flex flex-col justify-between">
                    <div>
                        <h2 className="text-3xl font-bold mb-4">{featuredRoom.name}</h2>
                        <p className="mb-6 leading-relaxed">{featuredRoom.description}</p>

                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                {featuredRoom.roomType}
                            </span>

                            {featuredRoom.discount ? (
                                <>
                                    <span className="bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm font-medium line-through">
                                        ${featuredRoom.price.toFixed(2)}
                                    </span>
                                    <span className="bg-green-200 text-green-900 px-3 py-1 rounded-full text-sm font-medium">
                                        $
                                        {(
                                            featuredRoom.price -
                                            (featuredRoom.price * featuredRoom.discount) / 100
                                        ).toFixed(2)}{" "}
                                        / night
                                    </span>
                                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {featuredRoom.discount}% Off
                                    </span>
                                </>
                            ) : (
                                <span className="bg-green-200 text-green-900 px-3 py-1 rounded-full text-sm font-medium">
                                    ${featuredRoom.price.toFixed(2)} / night
                                </span>
                            )}
                        </div>

                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                            <ul className="grid grid-cols-2 gap-x-4 gap-y-2  text-sm">
                                {featuredRoom.amenities.map((amenity) => (
                                    <li key={amenity._key} className="flex items-center gap-2">
                                        {iconMap[amenity.icon as keyof typeof iconMap] && (
                                            <FontAwesomeIcon
                                                icon={iconMap[amenity.icon as keyof typeof iconMap]}
                                                className="  w-4 h-4"
                                            />
                                        )}
                                        {amenity.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Link
                            href={`/rooms?slug=${featuredRoom.slug.current}`}
                            className="inline-block  hover:bg-blue-200  font-medium px-6 py-3 rounded-xl transition-all duration-300 shadow-md"
                        >
                            Book Now
                            <span className="ml-2">→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedRoom;
