"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/store/authStore";
import { DataService } from "@/lib/dataService";
import {
  Package,
  KeyRound,
  LogOut,
  ShoppingBag,
  PhoneCall,
  ArrowLeft,
  Building2,
} from "lucide-react";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/giris");
      } else if (user.role === "admin") {
        router.replace("/admin");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role === "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red" />
      </div>
    );
  }

  const consultant = user.danisman_id
    ? DataService.getConsultants().find((d) => d.id === user.danisman_id)
    : null;

  const navLinks = [
    { href: "/panel", label: "Sipariş Geçmişim", icon: Package },
    { href: "/panel/ayarlar", label: "Şifre ve Güvenlik", icon: KeyRound },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      {/* Top customer header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Artı Temizlik Züccaciye"
                width={220}
                height={70}
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </Link>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 text-xs font-semibold">
              Müşteri / Bayi Portalı
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-brand-red" />
              <span>Ürün Vitrini</span>
            </Link>

            <button
              onClick={() => {
                logout();
                window.location.href = "/giris";
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Çıkış</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main portal body */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-4 sm:py-8 w-full flex-1 pb-safe">
        {/* Welcome & Consultant banner */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-sm mb-5 sm:mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-brand-redLight text-brand-red flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold text-stone-900 truncate">
                  {user.firma_adi || user.ad_soyad || user.username}
                </h1>
                <span className="text-[10px] sm:text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                  @{user.username}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5 truncate">
                {user.adres || "Anamur / Mersin"}
              </p>
            </div>
          </div>

          {/* Connected consultant badge */}
          {consultant && (
            <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center flex-shrink-0">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-sky-800 font-semibold">
                  Sorumlu Saha Danışmanınız:
                </div>
                <div className="text-xs font-bold text-sky-950">
                  {consultant.ad_soyad} —{" "}
                  <a
                    href={`tel:${consultant.telefon.replace(/\s+/g, "")}`}
                    className="text-brand-blue hover:underline"
                  >
                    {consultant.telefon}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-5 sm:mb-6 border-b border-stone-200 pb-2 overflow-x-auto no-scrollbar touch-scroll">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 active:scale-95 ${
                  isActive
                    ? "bg-stone-900 text-white shadow-sm"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
