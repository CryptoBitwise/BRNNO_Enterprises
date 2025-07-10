"use client";

import { useState } from "react";
import useInView from '@/hooks/useInView';
import Image from 'next/image';

const samples = [
    {
        id: 1,
        before: "/images/job1-before.jpg",
        after: "/images/job1-after.jpg",
        title: "Sparkle Restorations – Sedan Detail",
    },
    {
        id: 2,
        before: "/images/job2-before.jpg",
        after: "/images/job2-after.jpg",
        title: "Crystal Clear – Motorcycle Polish",
    },
    {
        id: 3,
        before: "/images/job3-before.jpg",
        after: "/images/job3-after.jpg",
        title: "Elite Wash – SUV Deep Clean",
    },
];

export default function BeforeAfterGallery() {
    const [current, setCurrent] = useState(samples[0]);
    const [ref, inView] = useInView({ threshold: 0.2 }) as [React.RefObject<HTMLDivElement>, boolean];

    return (
        <section ref={ref} className="pt-0 pb-4 px-6 md:px-12 lg:px-24 bg-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center mt-8">
                Before & After Gallery
            </h2>
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        {current.title}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative overflow-hidden rounded-lg">
                            <Image
                                src={current.before}
                                alt={`Before ${current.title}`}
                                width={300}
                                height={200}
                                className="w-full h-48 object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">BEFORE</span>
                            </div>
                        </div>
                        <div className="relative overflow-hidden rounded-lg">
                            <Image
                                src={current.after}
                                alt={`After ${current.title}`}
                                width={300}
                                height={200}
                                className="w-full h-48 object-cover"
                            />
                            <div className="absolute inset-0 bg-green-600 bg-opacity-50 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">AFTER</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center space-x-4">
                    {samples.map((item, idx) => (
                        <div
                            key={item.id}
                            onClick={() => setCurrent(item)}
                            className={`px-4 py-2 rounded min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer transform transition-transform duration-200 ease-out ${item.id === current.id
                                ? "bg-blue-500 text-white"
                                : "bg-white text-gray-600 shadow"} opacity-0 ${inView ? 'animate-fadeInUp' : ''}`}
                            style={{ animationDelay: `${500 + idx * 100}ms` }}
                        >
                            {item.id}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
} 