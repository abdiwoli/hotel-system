"use client";

import { Room } from "@/app/models/room";
import RoomCard from "@/components/Room/RoomCard";
import { getRoobBySlug, getRoomByQuery } from "@/libs/apis";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import LoadingSpinner from "./loading";
import { searchRoomsByName } from "./searchRoomsByName";
import RoomDetails from "@/components/Room/RoomDetails";
import PageSearch from "@/components/PageSearch/PageSearch";

const Rooms = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const [view, setView] = useState(false);
    const [isSlug, setisSlug] = useState(false);

    useEffect(() => {
        const fetchRooms = async () => {
            setLoading(true);
            const query = searchParams.get("name") || "";
            const type = searchParams.get("roomType") || "";
            const slug = searchParams.get("slug") || "";
            const roomFilter = query.toLowerCase() === "" ? "" : query;
            const typeFilter = type.toLowerCase() === "all" ? "" : type;

            try {
                let rooms1;
                if (slug) {
                    rooms1 = await getRoobBySlug(slug);
                    if (rooms1.length > 0) {
                        setRoom(rooms1[0]);
                        setisSlug(true);
                    } else {
                        setRoom(null);
                    }

                } else {
                    rooms1 = await getRoomByQuery("", typeFilter, "");
                }
                const rooms = searchRoomsByName(rooms1, roomFilter);
                setRooms(rooms);
            } catch (error) {
                console.error("Error fetching rooms:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, [searchParams]);

    useEffect(() => {
        if (isSlug) {
            setView(true);
        }
    }, [isSlug]);


    useEffect(() => {
        const handleResetView = () => {
            setView(false);
            setRoom(null);
        };
        window.addEventListener("rooms:resetView", handleResetView);

        return () => {
            window.removeEventListener("rooms:resetView", handleResetView);
        };

    }, []);

    const handleBook = (room: Room) => {
        console.log("Booking room:", room.name);
    };



    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <LoadingSpinner />
            </div>
        );
    }


    return (
        <>
            <PageSearch />
            {!view ? (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {rooms.length > 0 ? (
                        rooms.map((room) => (
                            <RoomCard
                                key={room._id}
                                room={room}
                                setView={setView}
                                setRoom={setRoom}
                            />
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-400">
                            No rooms found.
                        </p>
                    )}
                </div>
            ) : (
                <>
                    {room ? (
                        <RoomDetails room={room} />
                    ) : (
                        <p className="text-center text-gray-500">No room selected.</p>
                    )}
                </>
            )}

        </>
    );
};

export default Rooms;


//room page
