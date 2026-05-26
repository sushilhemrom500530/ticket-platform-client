"use client";

import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TESTIMONIALS = [
    {
        name: "Sarah K.",
        role: "Music Lover",
        text: "Found my favorite band's concert in seconds. The experience from booking to entry was seamless!",
        avatar: "SK",
    },
    {
        name: "James R.",
        role: "Corporate Planner",
        text: "Used this platform for our company workshop. Easy bulk booking and instant e-tickets. Highly recommend.",
        avatar: "JR",
    },
    {
        name: "Priya M.",
        role: "Frequent Attendee",
        text: "The premium section is worth it — exclusive events I can't find anywhere else. Already booked 5 this year.",
        avatar: "PM",
    },
];

export function Testimonials() {
    const sliderRef = useRef<Slider>(null);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4500,
        arrows: false,
        appendDots: (dots: React.ReactNode) => (
            <div>
                <ul className="flex justify-center gap-2 mt-6">{dots}</ul>
            </div>
        ),
        customPaging: () => (
            <div className="w-2.5 h-2.5 rounded-full bg-gray-300 transition-all duration-300" />
        ),
    };

    return (
        <section className="bg-blue-50 py-16 mt-14">
            <div className="container mx-auto px-6 max-w-2xl text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-10">
                    What Attendees Say
                </h2>
                <div className="relative">
                    <Slider ref={sliderRef} {...settings}>
                        {TESTIMONIALS.map((testimonial, i) => (
                            <div key={i} className="px-2">
                                <div className="bg-white rounded-2xl p-8 shadow-sm border border-blue-100 transition-all duration-500">
                                    <Quote className="w-8 h-8 text-blue-200 mx-auto mb-3 rotate-180" />
                                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-sm">
                                        {testimonial.avatar}
                                    </div>
                                    <p className="text-gray-700 italic mb-5 leading-relaxed text-lg">
                                        &ldquo;{testimonial.text}&rdquo;
                                    </p>
                                    <div className="font-semibold text-gray-900">
                                        {testimonial.name}
                                    </div>
                                    <div className="text-blue-500 text-sm">
                                        {testimonial.role}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>

                    {/* Custom Navigation Arrows */}
                    <div className="flex justify-center gap-3 mt-2">
                        <button
                            onClick={() => sliderRef.current?.slickPrev()}
                            className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-blue-50 flex items-center justify-center transition cursor-pointer"
                        >
                            <ChevronLeft className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                            onClick={() => sliderRef.current?.slickNext()}
                            className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-blue-50 flex items-center justify-center transition cursor-pointer"
                        >
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Slick dot active state override */}
            <style jsx global>{`
                .bg-blue-50 .slick-dots li {
                    margin: 0;
                    width: auto;
                    height: auto;
                }
                .bg-blue-50 .slick-dots li div {
                    width: 10px;
                    height: 10px;
                }
                .bg-blue-50 .slick-dots li.slick-active div {
                    background-color: #2563eb;
                    width: 24px;
                    border-radius: 9999px;
                }
            `}</style>
        </section>
    );
}