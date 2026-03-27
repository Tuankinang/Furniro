"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { inspirationRooms } from "@/lib/data";

const InspirationSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentRoom = inspirationRooms[activeIndex];

  return (
    <section className="w-full bg-[#FCF8F3] overflow-hidden">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row">
        {/* Left — Text */}
        <div className="flex flex-col justify-center gap-6 px-6 md:px-12 py-16 lg:py-24 lg:w-[40%] lg:max-w-[500px]">
          <h2 className="text-3xl md:text-[40px] font-bold text-[#3A3A3A] leading-tight">
            50+ Beautiful rooms inspiration
          </h2>
          <p className="text-sm md:text-base text-[#616161] leading-6">
            Our designer already made a lot of beautiful prototype of rooms that
            inspire you.
          </p>
          <Link
            href="/inspiration"
            className="mt-2 inline-block bg-[#B88E2F] text-white font-semibold px-10 py-4 hover:bg-[#a07828] transition-colors duration-200 self-start"
          >
            Explore More
          </Link>
        </div>

        {/* Right — Image Carousel */}
        <div className="relative flex-1 flex items-end overflow-hidden min-h-[400px] lg:min-h-[600px]">
          {/* Main image */}
          <div className="relative w-full h-full">
            <Image
              src={currentRoom.image}
              alt={currentRoom.name}
              fill
              className="object-cover transition-opacity duration-500"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>

          {/* Room label card */}
          <div className="absolute bottom-[60px] left-0 flex items-center">
            <div className="bg-white/80 backdrop-blur-sm px-8 py-6 shadow-lg">
              <p className="text-sm text-[#616161]">{currentRoom.type}</p>
              <p className="text-2xl font-semibold text-[#3A3A3A]">
                {currentRoom.name}
              </p>
            </div>
            {/* Dots row */}
            <div className="flex gap-2 px-6">
              {inspirationRooms.map((_room, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`transition-all duration-200 rounded-full ${
                    i === activeIndex
                      ? "w-8 h-3 bg-[#B88E2F]"
                      : "w-3 h-3 bg-[#D8D8D8] hover:bg-[#B88E2F]/60"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Arrow button */}
          <button
            onClick={() =>
              setActiveIndex((prev) => (prev + 1) % inspirationRooms.length)
            }
            className="absolute right-4 bottom-16 bg-[#B88E2F] text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#a07828] transition-colors duration-200 shadow-md"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default InspirationSection;
