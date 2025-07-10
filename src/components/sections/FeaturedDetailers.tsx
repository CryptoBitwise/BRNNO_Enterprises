"use client";

import Link from "next/link";
import useInView from '@/hooks/useInView';

const sampleDetailers = [
    { id: 1, name: "Sparkle Restorations", rating: 4.9, reviews: 124, distance: "2.3 mi", mobile: true },
    { id: 2, name: "Crystal Clear Detailing", rating: 4.8, reviews: 98, distance: "1.7 mi", mobile: false },
    { id: 3, name: "Elite Wash Pros", rating: 4.7, reviews: 76, distance: "3.1 mi", mobile: true },
];

export default function FeaturedDetailers() {
    const [ref, inView] = useInView({ threshold: 0.3 }) as [React.RefObject<HTMLElement>, boolean];
    return (
        <section ref={ref} className="pt-4 pb-0 px-6 md:px-12 lg:px-24">
            <h2
                className={`text-3xl font-bold text-gray-600 mb-8 text-center opacity-0 ${inView ? 'animate-fadeInUp' : ''}`}
                style={{ animationDelay: '100ms' }}
            >
                Featured Detailers Near You
            </h2>

            <div
                className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto opacity-0 ${inView ? 'animate-fadeInUp' : ''}`}
                style={{ animationDelay: '300ms' }}
            >
                {sampleDetailers.map((d, i) => (
                    <div
                        key={d.id}
                        className={`bg-white rounded-lg shadow p-6 flex flex-col justify-between transform transition-transform duration-200 ease-out hover:scale-102 active:scale-98 opacity-0 ${inView ? 'animate-fadeInUp' : ''}`}
                        style={{ animationDelay: `${500 + i * 100}ms` }}
                    >
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{d.name}</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                ⭐ {d.rating} ({d.reviews} reviews) · {d.distance}
                            </p>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            {d.mobile && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    Mobile
                                </span>
                            )}
                            <Link
                                href={`/profile/${d.id}`}
                                className="px-4 py-2 bg-blue-500 text-white rounded min-h-[44px] flex items-center justify-center transform transition-transform duration-200 ease-out hover:scale-105 active:scale-95"
                            >
                                Book Now
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
} 