"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/store/authStore";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Menu, ShieldCheck, ExternalLink, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/giris?redirect=/admin");
      } else if (user.role !== "admin") {
        router.push("/panel");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FAFAF9]">
      {/* Mobile Top Admin Header (below lg) */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-stone-200 px-4 py-2.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-1.5 text-stone-700 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors active:scale-95"
            aria-label="Admin Menüsünü Aç"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/admin" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Artı Temizlik"
              width={160}
              height={50}
              className="h-7 w-auto object-contain"
            />
          </Link>
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            href="/"
            target="_blank"
            className="p-2 text-stone-500 hover:text-stone-800 rounded-xl hover:bg-stone-100 transition-colors active:scale-95"
            title="Site Vitrinini Aç"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <button
            onClick={() => {
              logout();
              window.location.href = "/giris";
            }}
            className="p-2 text-stone-500 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors active:scale-95"
            title="Çıkış Yap"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Responsive Sidebar (Static on lg+, Drawer on <lg) */}
      <AdminSidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-3.5 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto pb-safe">
        {children}
      </main>
    </div>
  );
}
