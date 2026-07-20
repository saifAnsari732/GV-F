"use client";
import React, { useState, useEffect } from 'react';
import { FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const testimonials = [
  {
    quote: "The DCA course at GV Computer Center completely changed my career path. The instructors were incredibly supportive, and the hands-on projects gave me the confidence to apply for jobs.",
    name: "Rahul Sharma",
    role: "Placed at TechCorp",
    rating: 5,
    image: "/student_girl.jpg",
    bgColor: "from-cyan-500/10 to-blue-500/10",
    accentColor: "border-cyan-500/30 text-cyan-600"
  },
  {
    quote: "I enrolled in the ADCA program. The curriculum is perfectly aligned with industry standards. Within two months of graduating, I secured a great IT position!",
    name: "Sneha Patel",
    role: "Placed at InfoSys",
    rating: 5,
    image: "/student_girl.jpg",
    bgColor: "from-purple-500/10 to-pink-500/10",
    accentColor: "border-purple-500/30 text-purple-600"
  },
  {
    quote: "Best institute in Fazilnagar! The practical training approach and 100% job support promise are real. I highly recommend GV to anyone looking to start a tech career.",
    name: "Amit Verma",
    role: "Freelance Developer",
    rating: 5,
    image: "/student_girl.jpg",
    bgColor: "from-emerald-500/10 to-teal-500/10",
    accentColor: "border-emerald-500/30 text-emerald-600"
  }
];

export const TestimonialSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <div className="relative max-w-4xl mx-auto px-4 font-['Space_Grotesk',sans-serif]">
      {/* Testimonial Card Container */}
      <div className="relative overflow-hidden min-h-[340px] sm:min-h-[280px]">
        {testimonials.map((t, idx) => {
          const isActive = idx === current;
          return (
            <div
              key={idx}
              className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out transform flex flex-col items-center text-center justify-center p-6 sm:p-10 bg-gradient-to-br ${t.bgColor} border ${t.accentColor} rounded-3xl shadow-lg ${
                isActive
                  ? 'opacity-100 translate-x-0 scale-100 pointer-events-auto z-10'
                  : 'opacity-0 translate-x-full scale-95 pointer-events-none z-0'
              }`}
              style={{
                transform: isActive ? 'translateX(0) scale(1)' : idx < current ? 'translateX(-100%) scale(0.95)' : 'translateX(100%) scale(0.95)'
              }}
            >
              <FaQuoteLeft className="text-5xl text-gray-400/20 absolute top-6 left-8" />
              
              {/* Star Rating */}
              <div className="flex justify-center text-amber-400 gap-1.5 mb-5">
                {[...Array(t.rating)].map((_, i) => (
                  <FaStar key={i} className="text-base drop-shadow-[0_2px_4px_rgba(245,158,11,0.2)]" />
                ))}
              </div>

              {/* Quote Text */}
              <p className="text-gray-700 font-medium text-base sm:text-lg leading-relaxed max-w-2xl mb-8 italic font-serif">
                "{t.quote}"
              </p>

              {/* Profile Wrapper */}
              <div className="flex items-center gap-4 text-left">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md bg-white shrink-0">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-['Syne',sans-serif] font-extrabold text-gray-900 text-base">{t.name}</h4>
                  <p className="text-xs text-gray-500 font-semibold">{t.role}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center items-center gap-6 mt-8">
        <button
          onClick={handlePrev}
          className="w-11 h-11 flex items-center justify-center bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer z-20"
        >
          <FaChevronLeft className="text-sm" />
        </button>

        {/* Indicators */}
        <div className="flex gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === current ? 'w-8 bg-cyan-500' : 'w-2.5 bg-gray-200'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-11 h-11 flex items-center justify-center bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer z-20"
        >
          <FaChevronRight className="text-sm" />
        </button>
      </div>
    </div>
  );
};

export default TestimonialSlider;
