import Link from 'next/link';
import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaTripadvisor } from 'react-icons/fa';

const Footer: React.FC = () => {
    const links = [
        { text: process.env.REACT_APP_HOME_TEXT || 'Home', href: process.env.REACT_APP_HOME_LINK || '/' },
        { text: process.env.REACT_APP_ROOMS_TEXT || 'Rooms', href: process.env.REACT_APP_ROOMS_LINK || 'rooms' },
        { text: process.env.REACT_APP_DINING_TEXT || 'Dining', href: process.env.REACT_APP_DINING_LINK || 'dining' },
        { text: process.env.REACT_APP_CONTACT_TEXT || 'Contact Us', href: process.env.REACT_APP_CONTACT_LINK || 'contact' },
    ];

    const socialLinks = [
        { icon: <FaFacebook size={20} />, href: process.env.REACT_APP_FACEBOOK_LINK || '#' },
        { icon: <FaTwitter size={20} />, href: process.env.REACT_APP_TWITTER_LINK || '#' },
        { icon: <FaInstagram size={20} />, href: process.env.REACT_APP_INSTAGRAM_LINK || '#' },
        { icon: <FaTripadvisor size={20} />, href: process.env.REACT_APP_TRIPADVISOR_LINK || '#' },
    ];

    return (
        <footer className="bg-gray-400 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
                    {/* About Section */}
                    <div className="animate-fadeIn">
                        <h3 className="text-lg font-semibold mb-4 hover:text-gray-300 transition duration-300">About Us</h3>
                        <p className="text-sm">
                            {process.env.FOOTER_ABOUT_US as string}
                        </p>
                    </div>

                    {/* Links Section */}
                    <div className="animate-fadeIn delay-100">
                        <h3 className="text-lg font-semibold mb-4 hover:text-gray-300 transition duration-300">Quick Links</h3>
                        <ul className="flex flex-wrap gap-x-4 gap-y-2 w-full max-w-md">
                            {links.map((link, index) => (
                                <li key={index} className="whitespace-nowrap">
                                    <Link href={link.href} className="hover:underline hover:text-gray-300 transition duration-300">
                                        {link.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>



                    {/* Contact Section */}
                    <div className="animate-fadeIn delay-200">
                        <h3 className="text-lg font-semibold mb-4 hover:text-gray-300 transition duration-300">Contact Us</h3>
                        <p className="text-sm">123 Luxury Lane, Paradise City</p>
                        <p className="text-sm">Phone: +1 (555) 123-4567</p>
                        <p className="text-sm">Email: info@hotelsystem.com</p>
                    </div>

                    {/* Social Media Section */}
                    <div className="animate-fadeIn delay-300">
                        <h3 className="text-lg font-semibold mb-4 hover:text-gray-300 transition duration-300">Follow Us</h3>
                        <div className="flex justify-center md:justify-start space-x-4">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    className="text-gray-400 hover:text-white transition duration-300 transform hover:scale-110"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center border-t border-gray-700 pt-6 animate-fadeIn delay-400">
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} Hotel System. All rights reserved. Designed with care for your comfort.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;