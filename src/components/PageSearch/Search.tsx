"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { FC } from "react";
import { useRouter } from "next/navigation";
import { getRoomTypes } from "@/libs/options";

type Props = {
    RoomTypeFilter: string;
    setRoomTypeFilter: (value: string) => void;
    searchQuery: string;
    setSearchQuery: (value: string) => void;
};


const Search: FC<Props> = ({ RoomTypeFilter, searchQuery, setRoomTypeFilter, setSearchQuery }) => {
    const router = useRouter();

    const [options, setOptions] = useState([{ label: "All", value: "" }]);

    useEffect(() => {
        const fetchRoomTypes = async () => {
            try {
                console.log("Fetching room types...");
                const types = await getRoomTypes();
                setOptions(types);
            } catch (error) {
                console.error("Error fetching room types:", error);
            }
        };

        fetchRoomTypes();
    }, []);

    function searchQueryValue(event: ChangeEvent<HTMLInputElement>): void {
        setSearchQuery(event.target.value);
    }

    function handleRoomTypeChange(event: ChangeEvent<HTMLSelectElement>): void {
        const newFilter = event.target.value;

        if (newFilter !== RoomTypeFilter) {
            setRoomTypeFilter(newFilter);

            if (window.location.pathname.startsWith("/rooms")) {
                router.push(`/rooms?roomType=${newFilter}`);
            }
        }
    }



    const handleSearch = () => {
        router.push('/rooms?name=' + searchQuery + '&roomType=' + RoomTypeFilter);
    }


    return (
        <section className="px-4 py-6 rounded-lg -mt-10 ">
            <div className="container mx-auto flex flex-wrap md:flex-nowrap justify-center items-center flex flex-row gap-4">
                {/* Room Type Filter */}
                <div className="w-full md:w-1/3">
                    <div className="relative">
                        <select
                            onChange={handleRoomTypeChange}
                            value={RoomTypeFilter}
                            className="w-full rounded-2xl px-4 py-3 border border-gray-300 rounded leading-tight focus:outline-none placeholder-gray-500 pr-10"
                        >
                            {options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}

                        </select>
                    </div>
                </div>

                {/* Search Input */}
                <div className="w-full md:w-1/3 relative rounded-2xl">
                    <div className="relative">
                        <input
                            type="search"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={searchQueryValue}
                            className=" rounded-2xl w-full px-4 py-3 border dark: bg-gray-100 dark:text-black border-gray-300 rounded leading-tight focus:outline-none placeholder-gray-500 pr-10"
                        />
                        {/* Search Icon Button */}
                        <button
                            onClick={handleSearch}
                            className="rounded-full absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800">
                            <MagnifyingGlassIcon className="w-5 h-5 " />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Search;
