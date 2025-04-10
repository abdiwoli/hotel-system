"use client";

import { Room } from "@/app/models/room";
import Image from "next/image";
import React from "react";

type Props = {
    room: Room;
    setView: (view: boolean) => void;
    setRoom: (room: Room) => void;
};

const RoomCard: React.FC<Props> = ({ room, setView, setRoom }) => {
    const discountedPrice = room.discount
        ? room.price - (room.price * room.discount) / 100
        : null;

    const handleViewRoomClick = () => {
        setRoom(room);
        setView(true);
    };

    return (
        <div className="bg-white/5 border border-gray-800 rounded-2xl overflow-hidden shadow-md backdrop-blur">
            <div className="relative aspect-video">
                <Image
                    src={room.coverImage.url}
                    alt={room.name}
                    fill
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                />
            </div>
            <div className="p-4 space-y-2">
                <h3 className="text-xl font-semibold truncate">{room.name}</h3>
                <p className="text-sm text-gray-400 truncate">{room.roomType}</p>
                <div className="flex items-center gap-2 text-sm">
                    {room.discount ? (
                        <>
                            <span className="line-through text-red-400">
                                ${room.price.toFixed(2)}
                            </span>
                            <span className="text-green-500 font-medium">
                                ${discountedPrice?.toFixed(2)} / night
                            </span>
                        </>
                    ) : (
                        <span className="text-green-500 font-medium">
                            ${room.price.toFixed(2)} / night
                        </span>
                    )}
                </div>

                <button
                    onClick={handleViewRoomClick}
                    className="inline-block mt-2 text-blue-500 hover:text-blue-700 font-medium border-b-2 border-transparent hover:border-blue-500 transition-all duration-200"
                >
                    View Room →
                </button>
            </div>
        </div>
    );
};

export default RoomCard;
