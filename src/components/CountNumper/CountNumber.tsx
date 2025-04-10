"use client";
// Removed unused import
import { FC, useEffect, useState } from 'react';

type Props = {
    endValue?: number;
    duration?: number;
}

const CountNumber: FC<Props> = ({ endValue = 100, duration = 2 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start: number;
        let animationFrameId: number | null = null;
        const updateCount = (timeStamp: number) => {
            if (!start) start = timeStamp;
            const progress = Math.min((timeStamp - start) / (duration * 1000), 1);
            if (progress < 1) {
                setCount(Math.floor(progress * endValue));
                animationFrameId = requestAnimationFrame(updateCount);
            } else {
                setCount(endValue);
            }
        }
        animationFrameId = requestAnimationFrame(updateCount);
        return () => cancelAnimationFrame(animationFrameId as number);

    }, [endValue, duration]);

    return <p className="text-2xl md:text-4xl font-bold text-blue-800 dark:text-blue-800">{Math.round(count)}</p>;
}
export default CountNumber;

