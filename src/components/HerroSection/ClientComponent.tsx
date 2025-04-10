"use client";

import { useRouter } from "next/navigation";
import CountNumber from "../CountNumper/CountNumber";
import React, { FC } from "react";

type Props = {
    headingText: {
        title: string;
        description: string;
    };
    imagesSection?: React.ReactNode;
};

const ClientComponent: FC<Props> = ({ headingText, imagesSection }) => {
    const router = useRouter();

    const handleClick = () => {
        router.push("/rooms");
    };

    return (
        <section className="container flex flex-col -mt-9 md:flex-row px-6 items-center justify-center min-h-screen ">
            {/* Left Side - Text */}
            <div className="flex-1 text-center md:text-left py-10 flex flex-col items-center md:items-start">
                <h1 className="font-heading mb-4">{headingText.title}</h1>
                <p className="text-lg leading-relaxed mb-4 max-w-lg text-center md:text-left">
                    {headingText.description}
                </p>
                <button
                    className="btn-primary mb-6 sm:ml-0 md:ml-20"
                    onClick={handleClick}
                >
                    Get Started
                </button>

                {/* Room Information - Fully Centered */}
                <div className="w-full flex items-center justify-center py-6 rounded-3xl shadow-lg bg-white dark:bg-gray-400">
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {[
                            { name: "Basic Room", count: 20 },
                            { name: "Luxury Room", count: 10 },
                            { name: "Family Room", count: 40 },
                            { name: "Single Room", count: 30 }
                        ].map((room, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <p className="text-sm lg:text-lg font-medium text-gray-600 dark:text-gray-800">{room.name}</p>
                                <CountNumber endValue={room.count} duration={2} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Images */}
            {imagesSection ? imagesSection : null}
        </section>
    );
};

export default ClientComponent;
