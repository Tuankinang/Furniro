"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/useAuthStore";
import { Bell, User } from "lucide-react";

export default function AdminHeader() {
  const { user } = useAuthStore();

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-white px-6">
      {/* Sidebar toggle button */}
      <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
      <Separator orientation="vertical" className="h-6" />

      {/* Title / Breadcrumb area */}
      <div className="flex-1">
        <h1 className="text-base font-semibold text-foreground">
          Furniro Admin
        </h1>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
        </button>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-muted transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-none">
              {user?.name || "Admin"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
