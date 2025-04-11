"use client";
import { useContext, useState, useEffect, useRef } from 'react';
import ThemeContext from '@/Context/ThemeContext';
import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa';
import { MdDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { signOut, useSession } from "next-auth/react";

function Header() {
    const { theme, setTheme } = useContext(ThemeContext);
    const { data: session } = useSession();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="py-6 px-4 container mx-auto text-xl flex flex-wrap md:flex-nowrap items-center justify-between">
            <div className='flex items-center w-full md:w-2/3 relative'>
                <Link href="/" className='font-black text-tertiary-blue text-3xl'>Munawara</Link>
                <ul className="flex items-center ml-5">
                    <li className='relative' ref={dropdownRef}>
                        {session?.user ? (
                            <div className="cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
                                {session.user.image ? (
                                    <div className='w-10 h-10 rounded-full overflow-hidden'>
                                        <img src={session.user.image} alt="user" className='scale-animation img' />
                                    </div>
                                ) : (
                                    <FaUserCircle className='w-10 h-10' />
                                )}
                                {showDropdown && (
                                    <div className='absolute mt-2 bg-white dark:bg-gray-800 shadow-md rounded-md z-50 right-0 min-w-[150px]'>
                                        <Link href={`/users/${session.user.id}`} className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700'>
                                            Profile
                                        </Link>
                                        <button
                                            onClick={() => signOut()}
                                            className='w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/auth">
                                <FaUserCircle className='cursor-pointer w-8 h-8' />
                            </Link>
                        )}
                    </li>

                    <li className='ml-3'>
                        {theme ? (
                            <MdOutlineLightMode
                                className="cursor-pointer"
                                onClick={() => {
                                    localStorage.removeItem('hotel-theme');
                                    setTheme(false);
                                }}
                            />
                        ) : (
                            <MdDarkMode
                                className="cursor-pointer"
                                onClick={() => {
                                    localStorage.setItem('hotel-theme', 'true');
                                    setTheme(true);
                                }}
                            />
                        )}
                    </li>
                </ul>
            </div>

            <ul className='flex items-center justify-between w-full md:w-1/3 mt-4 md:mt-0 text-base'>
                <li className='hover:-translate-y-2 duration-500 transition-all'>
                    <Link href='/'>Home</Link>
                </li>
                <li className='hover:-translate-y-2 duration-500 transition-all'>
                    <Link
                        href="/rooms"
                        onClick={() => window.dispatchEvent(new Event("rooms:resetView"))}
                    >
                        Rooms
                    </Link>
                </li>
                <li className='hover:-translate-y-2 duration-500 transition-all'>
                    <Link href='/contact'>Contact</Link>
                </li>
            </ul>
        </header>
    );
}

export default Header;
