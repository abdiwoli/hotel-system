"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Search from "./Search";

const PageSearch = () => {
    const searchParams = useSearchParams();
    const initialRoomType = searchParams.get("roomType") || "";
    const initialQuery = searchParams.get("query") || "";

    const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
    const [roomTypeFilter, setRoomTypeFilter] = useState<string>(initialRoomType);

    return (
        <Search
            RoomTypeFilter={roomTypeFilter}
            searchQuery={searchQuery}
            setRoomTypeFilter={setRoomTypeFilter}
            setSearchQuery={setSearchQuery}
        />
    );
};

export default PageSearch;


