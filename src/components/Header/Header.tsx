"use client";
import { useContext, useState, useEffect, useRef } from 'react';
import ThemeContext from '@/Context/ThemeContext';
import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa';
import { MdDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { signOut, useSession } from "next-auth/react";
import { HiMenu, HiX } from 'react-icons/hi';

function Header() {
    const { theme, setTheme } = useContext(ThemeContext);
    const { data: session } = useSession();
    const [showDropdown, setShowDropdown] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

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
        <header className="py-4 px-4 container mx-auto flex flex-col md:flex-row items-center justify-between">
            <div className='w-full flex items-center justify-between'>
                <Link href="/" className='font-black text-tertiary-blue text-2xl'>Munawara</Link>
                <button className='md:hidden text-3xl' onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <HiX /> : <HiMenu />}
                </button>
            </div>

            <nav className={`w-full md:w-auto mt-4 md:mt-0 md:flex md:items-center ${menuOpen ? 'block' : 'hidden'}`}>
                <ul className='flex flex-col md:flex-row md:items-center gap-4 md:gap-6 text-base'>
                    <li className='hover:-translate-y-1 duration-300'>
                        <Link href='/'>Home</Link>
                    </li>
                    <li className='hover:-translate-y-1 duration-300'>
                        <Link
                            href="/rooms"
                            onClick={() => window.dispatchEvent(new Event("rooms:resetView"))}
                        >
                            Rooms
                        </Link>
                    </li>
                    <li className='hover:-translate-y-1 duration-300'>
                        <Link href='/contact'>Contact</Link>
                    </li>
                </ul>
            </nav>

            <div className='mt-4 md:mt-0 ml-4 md:ml-8 flex items-center gap-6 md:gap-8'>

                <div className='relative' ref={dropdownRef}>
                    {session?.user ? (
                        <div className="cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
                            {session.user.image ? (
                                <div className='w-10 h-10 rounded-full overflow-hidden'>
                                    <img src={session.user.image} alt="user" className='scale-animation img' />
                                </div>
                            ) : (
                                <FaUserCircle className='w-8 h-8' />
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
                </div>

                <div>
                    {theme ? (
                        <MdOutlineLightMode
                            className="cursor-pointer text-2xl"
                            onClick={() => {
                                localStorage.removeItem('hotel-theme');
                                setTheme(false);
                            }}
                        />
                    ) : (
                        <MdDarkMode
                            className="cursor-pointer text-2xl"
                            onClick={() => {
                                localStorage.setItem('hotel-theme', 'true');
                                setTheme(true);
                            }}
                        />
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
