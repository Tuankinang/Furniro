"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/axios";
import { formatPrice } from "@/lib/utils";
import FeaturesBar from "@/components/ui/FeaturesBar";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, clearCart, isLoading: isCartLoading } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect nếu chưa đăng nhập hoặc giỏ hàng trống
  useEffect(() => {
    if (!mounted || isCartLoading) return;

    if (!user) {
      toast.error("Please log in to proceed to checkout!");
      router.push("/login");
    } else if (items.length === 0) {
      router.push("/cart");
    }
  }, [user, items, router, mounted, isCartLoading]);

  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("VNPAY");

  // State lưu trữ dữ liệu Form Address
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    country: "Vietnam",
    streetAddress: "",
    city: "",
    province: "",
    zipCode: "",
    phone: "",
    email: "",
    additionalInfo: "",
  });

  const totalAmount = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Hàm xử lý Đặt hàng
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/orders/checkout", {
        billingAddress: formData,
        paymentMethod: paymentMethod,
      });

      if (response.data.success) {
        if (response.data.paymentUrl) {
          window.location.href = response.data.paymentUrl;
        } else {
          clearCart();
          toast.success("🎉 Order placed successfully! Thank you for shopping with us.");
          router.push("/");
        }
      }
    } catch (error: any) {
      console.error("Order error:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while placing your order. Please try again!",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted || isCartLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B88E2F]"></div>
      </div>
    );
  }

  if (!user || items.length === 0) return null; // Chống nháy UI trong lúc chờ redirect

  return (
    <main className="w-full bg-white">
      {/* 1. BANNER & BREADCRUMB */}
      <section className="relative w-full h-[316px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/shop-hero.png"
            alt="Checkout Banner"
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
            Checkout
          </h1>
          <div className="flex items-center gap-2 text-base">
            <Link href="/" className="font-medium hover:text-[#B88E2F]">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="font-light">Checkout</span>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT (FORM & ORDER SUMMARY) */}
      <section className="w-full max-w-[1440px] mx-auto px-4 md:px-16 lg:px-[72px] pt-[60px] pb-[100px]">
        <form
          onSubmit={handlePlaceOrder}
          className="flex flex-col lg:flex-row gap-8 lg:gap-[100px]"
        >
          {/* CỘT TRÁI: BILLING DETAILS */}
          <div className="flex-1 w-full lg:max-w-[608px]">
            <h2 className="text-[36px] font-semibold text-black mb-9">
              Billing details
            </h2>
            <div className="flex flex-col gap-9">
              {/* Name Row */}
              <div className="flex flex-col sm:flex-row gap-8">
                <div className="flex flex-col gap-5 flex-1">
                  <label className="text-base font-medium">First Name</label>
                  <input
                    required
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full h-[75px] border border-[#9F9F9F] rounded-[10px] px-5 outline-none focus:border-[#B88E2F]"
                  />
                </div>
                <div className="flex flex-col gap-5 flex-1">
                  <label className="text-base font-medium">Last Name</label>
                  <input
                    required
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full h-[75px] border border-[#9F9F9F] rounded-[10px] px-5 outline-none focus:border-[#B88E2F]"
                  />
                </div>
              </div>

              {/* Company */}
              <div className="flex flex-col gap-5">
                <label className="text-base font-medium">
                  Company Name (Optional)
                </label>
                <input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full h-[75px] border border-[#9F9F9F] rounded-[10px] px-5 outline-none focus:border-[#B88E2F]"
                />
              </div>

              {/* Country */}
              <div className="flex flex-col gap-5">
                <label className="text-base font-medium">
                  Country / Region
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full h-[75px] border border-[#9F9F9F] rounded-[10px] px-5 outline-none focus:border-[#B88E2F] bg-white text-[#9F9F9F]"
                >
                  <option value="Vietnam">Vietnam</option>
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="United States">United States</option>
                  <option value="Japan">Japan</option>
                  <option value="South Korea">South Korea</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>

              {/* Street */}
              <div className="flex flex-col gap-5">
                <label className="text-base font-medium">Street address</label>
                <input
                  required
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  className="w-full h-[75px] border border-[#9F9F9F] rounded-[10px] px-5 outline-none focus:border-[#B88E2F]"
                />
              </div>

              {/* City */}
              <div className="flex flex-col gap-5">
                <label className="text-base font-medium">Town / City</label>
                <input
                  required
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full h-[75px] border border-[#9F9F9F] rounded-[10px] px-5 outline-none focus:border-[#B88E2F]"
                />
              </div>

              {/* Province */}
              <div className="flex flex-col gap-5">
                <label className="text-base font-medium">Province</label>
                <input
                  required
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className="w-full h-[75px] border border-[#9F9F9F] rounded-[10px] px-5 outline-none focus:border-[#B88E2F]"
                  placeholder="Western Province"
                />
              </div>

              {/* ZIP */}
              <div className="flex flex-col gap-5">
                <label className="text-base font-medium">ZIP code</label>
                <input
                  required
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full h-[75px] border border-[#9F9F9F] rounded-[10px] px-5 outline-none focus:border-[#B88E2F]"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-5">
                <label className="text-base font-medium">Phone</label>
                <input
                  required
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full h-[75px] border border-[#9F9F9F] rounded-[10px] px-5 outline-none focus:border-[#B88E2F]"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-5">
                <label className="text-base font-medium">Email address</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-[75px] border border-[#9F9F9F] rounded-[10px] px-5 outline-none focus:border-[#B88E2F]"
                />
              </div>

              {/* Additional Info */}
              <div className="flex flex-col gap-5 mt-4">
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  placeholder="Additional information"
                  className="w-full h-[75px] pt-6 border border-[#9F9F9F] rounded-[10px] px-5 outline-none focus:border-[#B88E2F] resize-none"
                />
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: ORDER SUMMARY */}
          <div className="w-full lg:w-[533px] pt-9">
            <div className="flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-medium text-black">Product</h3>
                <h3 className="text-2xl font-medium text-black">Subtotal</h3>
              </div>

              {/* Product List */}
              <div className="flex flex-col gap-4 mb-6">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}-${item.color}`}
                    className="flex justify-between items-center"
                  >
                    <p className="text-base text-[#9F9F9F]">
                      {item.name}{" "}
                      <span className="text-black ml-2">x {item.quantity}</span>
                    </p>
                    <p className="text-base font-light text-black">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Subtotal */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-base font-normal text-black">
                  Subtotal
                </span>
                <span className="text-base font-light text-black">
                  {formatPrice(totalAmount)}
                </span>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pb-8 border-b border-[#D9D9D9] mb-6">
                <span className="text-base font-normal text-black">Total</span>
                <span className="text-2xl font-bold text-[#B88E2F]">
                  {formatPrice(totalAmount)}
                </span>
              </div>

              {/* Payment Methods */}
              <div className="flex flex-col gap-4 mb-6">
                <label className="flex items-start gap-4 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="VNPAY"
                    checked={paymentMethod === "VNPAY"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-3.5 h-3.5 mt-1 accent-black"
                  />
                  <div className="flex flex-col gap-3">
                    <span
                      className={`text-base font-medium ${paymentMethod === "VNPAY" ? "text-black" : "text-[#9F9F9F]"}`}
                    >
                      Payment via VNPAY
                    </span>
                    {paymentMethod === "VNPAY" && (
                      <p className="text-base text-[#9F9F9F] text-justify font-light leading-relaxed">
                        Secure payments can be made through the VNPAY payment
                        gateway using domestic ATM cards, international cards,
                        or e-wallets.
                      </p>
                    )}
                  </div>
                </label>

                <label className="flex items-center gap-4 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-3.5 h-3.5 accent-black text-[#9F9F9F]"
                  />
                  <span
                    className={`text-base font-medium ${paymentMethod === "COD" ? "text-black" : "text-[#9F9F9F]"}`}
                  >
                    Cash On Delivery
                  </span>
                </label>
              </div>

              {/* Privacy Policy Text */}
              <p className="text-base text-black font-light leading-relaxed mb-10 text-justify">
                Your personal data will be used to support your experience
                throughout this website, to manage access to your account, and
                for other purposes described in our{" "}
                <span className="font-semibold cursor-pointer hover:underline">
                  privacy policy.
                </span>
              </p>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-[318px] h-[64px] rounded-[15px] border border-black text-black text-xl hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-wait"
                >
                  {isLoading ? "Processing..." : "Place order"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>

      <FeaturesBar />
    </main>
  );
}
