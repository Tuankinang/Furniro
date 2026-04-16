"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!user) {
      toast.error("Please log in to access the admin dashboard.");
      window.location.href = "/login";
      return;
    }

    if (user.role !== "ADMIN") {
      toast.error("You do not have permission to access this page.");
      window.location.href = "/";
    }
  }, [user, mounted]);

  // Show loading while waiting for hydration
  if (!mounted || !user || user.role !== "ADMIN") {
    return (
      <div className="flex flex-col md:flex-row min-h-screen w-full bg-background animate-pulse">
        {/* Sidebar Skeleton */}
        <div className="hidden md:flex w-64 border-r border-border bg-card flex-col p-4 gap-6">
          <div className="h-8 w-32 bg-muted rounded-md mb-8" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-5 w-5 bg-muted rounded-md" />
                <div className="h-4 w-24 bg-muted rounded-md" />
              </div>
            ))}
          </div>
        </div>
        {/* Main Content Skeleton */}
        <div className="flex-1 flex flex-col">
          {/* Header Skeleton */}
          <div className="h-16 border-b border-border bg-card flex items-center px-6 justify-between">
            <div className="h-5 w-5 bg-muted rounded-md md:hidden" />
            <div className="flex items-center gap-4 ml-auto">
              <div className="h-8 w-8 rounded-full bg-muted" />
            </div>
          </div>
          {/* Content Area Skeleton */}
          <div className="flex-1 p-6 bg-muted/30">
            <div className="h-full w-full bg-card rounded-xl border border-border opacity-50" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-background">
        <AdminSidebar />
        <SidebarInset className="flex flex-col flex-1 overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-auto p-6 bg-muted/30">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
