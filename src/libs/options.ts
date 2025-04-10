import { Room } from "@/app/models/room";
import sanityClient from "./sanity";
import { getRoomTypesQuery } from "./SanityQuery";

export const getRoomTypes = async () => {
    const roomTypes: Room[] = await sanityClient.fetch(getRoomTypesQuery);
    const uniqueRoomTypes = Array.from(new Set(roomTypes.map((room: Room) => room.roomType)));

    const options = uniqueRoomTypes.map((type: string) => ({
        value: type.toLowerCase(),
        label: type.charAt(0).toUpperCase() + type.slice(1),
    }));

    return [{ value: "", label: "All" }, ...options];
};
