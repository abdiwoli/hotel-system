import { Room } from "@/app/models/room";

/**
 * Function to search for rooms by name (partial matching).
 * @param rooms - List of rooms to search through.
 * @param nameQuery - The name to search for (could be partial).
 * @returns Filtered list of rooms.
 */
export const searchRoomsByName = (rooms: Room[], nameQuery: string): Room[] => {
    if (!nameQuery || nameQuery.toLowerCase() == "all") return rooms;
    const lowercasedQuery = nameQuery.toLowerCase();
    return rooms.filter(room =>
        room.name.toLowerCase().includes(lowercasedQuery)
    );
};
