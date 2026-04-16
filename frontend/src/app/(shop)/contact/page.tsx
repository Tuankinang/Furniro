"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, MapPin, Phone, Clock } from "lucide-react";
import toast from "react-hot-toast";
import FeaturesBar from "@/components/ui/FeaturesBar";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Giả lập gửi API
    setTimeout(() => {
      toast.success("Thank you for reaching out! We will get back to you as soon as possible.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <main className="w-full bg-white">
      {/* 1. BANNER & BREADCRUMB */}
      <section className="relative w-full h-[316px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/shop-hero.png"
            alt="Contact Banner"
            fill
            className="object-cover opacity-70"
            priority
          />
        </div>
        <div className="flex flex-col items-center text-center relative z-10">
          <Image
            src="/images/house_logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="mb-2"
          />
          <h1 className="text-[48px] font-medium text-black leading-tight">
            Contact
          </h1>
          <div className="flex items-center gap-2 text-base">
            <Link href="/" className="font-medium hover:text-[#B88E2F]">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="font-light">Contact</span>
          </div>
        </div>
      </section>

      {/* 2. CONTACT CONTENT */}
      <section className="w-full max-w-[1440px] mx-auto px-4 md:px-16 lg:px-[72px] pt-[98px] pb-[63px]">
        {/* Header Text */}
        <div className="flex flex-col items-center text-center mb-[100px]">
          <h2 className="text-[36px] font-semibold text-black mb-2">
            Get In Touch With Us
          </h2>
          <p className="text-base text-[#9F9F9F] max-w-[644px] leading-relaxed">
            For More Information About Our Product & Services. Please Feel Free
            To Drop Us An Email. Our Staff Always Be There To Help You Out. Do
            Not Hesitate!
          </p>
        </div>

        {/* Contact Info & Form */}
        <div className="flex flex-col lg:flex-row gap-[50px] lg:gap-[120px] justify-center">
          {/* CỘT TRÁI: THÔNG TIN LIÊN HỆ */}
          <div className="flex flex-col gap-[42px] lg:w-[393px] pt-12">
            {/* Address */}
            <div className="flex gap-6 items-start">
              <MapPin className="w-7 h-7 text-black shrink-0 mt-1" />
              <div className="flex flex-col">
                <h3 className="text-[24px] font-medium text-black mb-2">
                  Address
                </h3>
                <p className="text-base text-black font-normal leading-relaxed">
                  236 5th SE Avenue, New York NY10000, United States
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-6 items-start">
              <Phone className="w-7 h-7 text-black shrink-0 mt-1" />
              <div className="flex flex-col">
                <h3 className="text-[24px] font-medium text-black mb-2">
                  Phone
                </h3>
                <p className="text-base text-black font-normal leading-relaxed">
                  Mobile: +(84) 546-6789
                  <br />
                  Hotline: +(84) 456-6789
                </p>
              </div>
            </div>

            {/* Working Time */}
            <div className="flex gap-6 items-start">
              <Clock className="w-7 h-7 text-black shrink-0 mt-1" />
              <div className="flex flex-col">
                <h3 className="text-[24px] font-medium text-black mb-2">
                  Working Time
                </h3>
                <p className="text-base text-black font-normal leading-relaxed">
                  Monday-Friday: 9:00 - 22:00
                  <br />
                  Saturday-Sunday: 9:00 - 21:00
                </p>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: FORM LIÊN HỆ */}
          <div className="flex-1 lg:max-w-[531px]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-9">
              {/* Name */}
              <div className="flex flex-col gap-5">
                <label className="text-base font-medium text-black">
                  Your name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Abc"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full h-[75px] border border-[#9F9F9F] rounded-[10px] px-8 text-base outline-none focus:border-[#B88E2F] placeholder:text-[#9F9F9F]"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-5">
                <label className="text-base font-medium text-black">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Abc@def.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-[75px] border border-[#9F9F9F] rounded-[10px] px-8 text-base outline-none focus:border-[#B88E2F] placeholder:text-[#9F9F9F]"
                />
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-5">
                <label className="text-base font-medium text-black">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  placeholder="This is an optional"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full h-[75px] border border-[#9F9F9F] rounded-[10px] px-8 text-base outline-none focus:border-[#B88E2F] placeholder:text-[#9F9F9F]"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-5">
                <label className="text-base font-medium text-black">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  placeholder="Hi! i'd like to ask about"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full h-[120px] py-6 border border-[#9F9F9F] rounded-[10px] px-8 text-base outline-none focus:border-[#B88E2F] placeholder:text-[#9F9F9F] resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-[237px] h-[55px] bg-[#B88E2F] text-white rounded-[5px] text-base font-normal mt-2 hover:bg-[#a07b28] transition-colors disabled:opacity-70 disabled:cursor-wait"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 3. FEATURES BAR */}
      <FeaturesBar />
    </main>
  );
}
