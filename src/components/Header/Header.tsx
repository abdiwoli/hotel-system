"use client";
import { useContext, useEffect } from 'react';
import ThemeContext from '@/Context/ThemeContext';
import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa';
import { MdDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { signOut, useSession } from "next-auth/react";



function Header() {
    const { theme, setTheme } = useContext(ThemeContext);
    const { data: session } = useSession();



    return (
        <header className="py-10 px-4 container mx-auto text-xl flex flex-wrap md:flex-nowrap items-center justify-between">
            <div className='flex items-center w-full md:w-2/3'>
                <Link href="/" className='font-black text-tertiary-blue text-3xl'>Munawara</Link>
                <ul className="flex items-center ml-5">
                    <li className='flex items-center'>
                        {session?.user ? (
                            <Link href={`/users/${session.user.id}`}>
                                {session.user.image ? (
                                    <div className='w-10 h-10 rounded-full overflow-hidden'>
                                        <img src={session.user.image} alt="user" className='scale-animation img' />
                                    </div>) : (
                                    <FaUserCircle className='w-10 h-10' />
                                )}
                            </Link>
                        ) : (<Link href="/auth">
                            <FaUserCircle className='cursor-pointer' />
                        </Link>)}
                    </li>
                    <li className='ml-2'>
                        {theme ? (
                            <MdOutlineLightMode
                                className="cursor-pointer"
                                onClick={() => {
                                    localStorage.removeItem('hotel-theme');
                                    setTheme(false)
                                }
                                }
                            />
                        ) : (
                            <MdDarkMode
                                className="cursor-pointer"
                                onClick={() => {
                                    localStorage.setItem('hotel-theme', 'true');
                                    setTheme(true)
                                }}
                            />
                        )}
                    </li>
                </ul>
            </div>
            <ul className='flex items-center justify-between w-full md:w-1/3 mt-4'>
                <li className='hover:-translate-y-2 duration-500 transition-all'>
                    <Link href='/'>Home</Link>
                </li>
                <li className='hover:-translate-y-2 duration-500 transition-all'>
                    <Link
                        href="/rooms"
                        onClick={() => {
                            // Dispatch a custom event
                            window.dispatchEvent(new Event("rooms:resetView"));
                        }}
                    >
                        Rooms
                    </Link>
                </li>

                <li className='hover:-translate-y-2 duration-500 transition-all'>
                    <Link href='/contact'>Contact</Link>
                </li>
                <li>
                    <button onClick={() => signOut()}>Sign Out</button>
                </li>
            </ul>
        </header>
    );
}

export default Header;
