"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import useInView from '@/hooks/useInView';
import Image from 'next/image';

const testimonials = [
    {
        id: 1,
        name: "Alex R.",
        photo: "/images/users/alex.jpg",
        quote:
            "Reviva totally transformed my RV! The team was professional and on time.",
        rating: 5,
    },
    {
        id: 2,
        name: "Samantha P.",
        photo: "/images/users/samantha.jpg",
        quote:
            "Fast, friendly, and thorough. My car has never looked so good—highly recommend!",
        rating: 4.8,
    },
    {
        id: 3,
        name: "David L.",
        photo: "/images/users/david.jpg",
        quote:
            "They even came to my house. Best mobile detailing service I've used.",
        rating: 4.9,
    },
];

export default function Testimonials() {
    const [ref] = useInView({ threshold: 0.2 }) as unknown as [React.RefObject<HTMLDivElement>];
    return (
        <section ref={ref} className="py-16 px-6 md:px-12 lg:px-24 bg-gray-50">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                What Our Customers Say
            </h2>
            <div>
                <Swiper
                    spaceBetween={24}
                    slidesPerView={1}
                    navigation={{
                        prevEl: '.swiper-button-prev',
                        nextEl: '.swiper-button-next',
                    }}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000 }}
                    modules={[Navigation, Pagination, Autoplay]}
                    breakpoints={{
                        640: { slidesPerView: 1 },
                        1024: { slidesPerView: 2 },
                    }}
                >
                    {testimonials.map((t) => (
                        <SwiperSlide key={t.id}>
                            <div className="bg-white p-6 rounded-lg shadow-lg h-full flex flex-col">
                                <div className="flex items-center mb-4">
                                    <Image
                                        src={t.photo}
                                        alt={t.name}
                                        width={48}
                                        height={48}
                                        className="w-12 h-12 rounded-full mr-4"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-900 leading-tight">{t.name}</p>
                                        <p className="text-yellow-500 text-sm">{"⭐".repeat(Math.round(t.rating))}</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 flex-grow leading-relaxed">&quot;{t.quote}&quot;</p>
                            </div>
                        </SwiperSlide>
                    ))}

                    {/* Custom Navigation Buttons */}
                    <div className="swiper-button-prev">
                        <div
                            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-gray-900 transform transition-transform duration-200 ease-out hover:scale-110 active:scale-90"
                        >
                            ←
                        </div>
                    </div>
                    <div className="swiper-button-next">
                        <div
                            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-gray-900 transform transition-transform duration-200 ease-out hover:scale-110 active:scale-90"
                        >
                            →
                        </div>
                    </div>
                </Swiper>
            </div>
        </section>
    );
} 