"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartSidebar from "@/components/ui/CartSidebar";

function AuthInitializer() {
  const initializeAuth = useAuthStore((s) => s.initializeAuth);
  useEffect(() => {
    initializeAuth();
  }, []);
  return null;
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthInitializer />
      <Navbar />
      <CartSidebar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
