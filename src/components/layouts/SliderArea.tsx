"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function Slider() {
    const slides = [
        "/images/slide1.jpg",
        "/images/slide2.jpg"
    ];

    return (
        <div className="w-full mx-auto">
            <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                className="h-[180px] rounded-[15px]"
            >
                {slides.map((src, idx) => (
                    <SwiperSlide key={idx}>
                        <img
                            src={src}
                            alt={`Slide ${idx + 1}`}
                            className="w-full h-64 object-cover rounded-lg"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
