"use client";

import { ChevronLeft, ChevronRight, Star } from "lucide-react";
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
    {
        name: "Alex D.",
        role: "Sports Fan",
        text: "Got front row seats to the playoffs. The UI is incredibly intuitive and fast.",
        avatar: "AD",
    },
    {
        name: "Michael T.",
        role: "Theater Enthusiast",
        text: "Best ticketing experience I've had. Customer support was incredibly helpful when I needed to change dates.",
        avatar: "MT",
    },
];

export function Testimonials() {
    const sliderRef = useRef<Slider>(null);

    const settings = {
        className: "center",
        centerMode: true,
        infinite: true,
        centerPadding: "0px",
        slidesToShow: 3,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 4500,
        arrows: false,
        dots: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    centerPadding: "0px",
                },
            },
        ],
        appendDots: (dots: React.ReactNode) => (
            <div>
                <ul className="flex justify-center gap-2 mt-4">
                    {dots}
                </ul>
            </div>
        ),
        customPaging: () => (
            <div className="w-2.5 h-2.5 rounded-full bg-white/30 transition-all duration-300" />
        ),
    };

    return (
        <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 py-24 mt-14 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-12">

                    {/* Left Content */}
                    <div className="lg:w-1/3 text-left w-full z-10">
                        <h2 className="text-5xl lg:text-6xl font-extrabold text-white mb-2 leading-tight tracking-tight drop-shadow-sm">
                            What<br />
                            <span className="text-blue-300">Attendees</span><br />
                            Say
                        </h2>
                        <div className="flex gap-4 mt-8">
                            <div className="w-14 h-14 bg-white/10 backdrop-blur-md text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-xl border border-white/20">
                                5<Star className="w-5 h-5 ml-1 text-yellow-400 fill-yellow-400" />
                            </div>
                            <div className="w-14 h-14 bg-white/10 backdrop-blur-md text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-xl border border-white/20">
                                10k+
                            </div>
                        </div>
                    </div>

                    {/* Right Slider */}
                    <div className="lg:w-2/3 w-full testimonial-slider-container">
                        <Slider ref={sliderRef} {...settings}>
                            {TESTIMONIALS.map((testimonial, i) => (
                                <div key={i} className="py-10">
                                    <div className="testimonial-card bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center mx-3 transition-all duration-500 ease-out border border-white">
                                        <div className="w-24 h-24 rounded-full border-4 border-indigo-500 p-1 mb-6 shadow-md bg-white">
                                            <div className="w-full h-full bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
                                                {testimonial.avatar}
                                            </div>
                                        </div>
                                        <h3 className="font-extrabold text-slate-900 text-xl mb-2">{testimonial.name}</h3>
                                        <div className="flex items-center justify-center gap-1 mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-orange-500 fill-orange-500" />
                                            ))}
                                            <span className="text-slate-900 font-bold ml-2 text-sm">5.0</span>
                                        </div>
                                        <p className="text-slate-500 text-sm leading-relaxed font-medium px-2">
                                            {testimonial.text}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </Slider>

                        {/* Custom Navigation Arrows */}
                        <div className="flex justify-center gap-4 mt-2">
                            <button
                                onClick={() => sliderRef.current?.slickPrev()}
                                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 flex items-center justify-center transition shadow-lg border border-white/30 cursor-pointer z-10"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => sliderRef.current?.slickNext()}
                                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 flex items-center justify-center transition shadow-lg border border-white/30 cursor-pointer z-10"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slick dot active state override and center mode scaling */}
            <style jsx global>{`
                .testimonial-slider-container .slick-track {
                    display: flex;
                    align-items: center;
                }
                
                .testimonial-slider-container .slick-slide {
                    transition: all 0.5s ease;
                    transform: scale(0.85);
                    opacity: 0.6;
                    outline: none;
                }
                
                .testimonial-slider-container .slick-slide.slick-center {
                    transform: scale(1.05);
                    opacity: 1;
                    z-index: 10;
                }
                
                .testimonial-slider-container .slick-slide.slick-center .testimonial-card {
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
                    border-color: rgba(255, 255, 255, 1);
                }

                .testimonial-slider-container .slick-dots li {
                    margin: 0;
                    width: auto;
                    height: auto;
                }
                .testimonial-slider-container .slick-dots li div {
                    width: 8px;
                    height: 8px;
                }
                .testimonial-slider-container .slick-dots li.slick-active div {
                    background-color: #ffffff;
                    width: 24px;
                    border-radius: 9999px;
                }
            `}</style>
        </section>
    );
}