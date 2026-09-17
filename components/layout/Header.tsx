"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/store/authStore";
import { useCart } from "@/lib/store/cartStore";
import { Search, ShoppingBag, User, LogOut, Shield, X } from "lucide-react";

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery = "",
  onSearchChange,
}) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { totalCount, openCart } = useCart();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    if (onSearchChange) {
      onSearchChange("");
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center">
          <Image
            src="/logo.png"
            alt="Artı Temizlik Züccaciye"
            width={320}
            height={101}
            className="h-11 sm:h-12 md:h-14 lg:h-16 w-auto object-contain"
            priority
          />
        </Link>

        {/* Live Search bar (Desktop) */}
        <div className="flex-1 max-w-xl mx-2 sm:mx-6 hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ürün adı, koli içeriği veya marka ara... (Örn: Çamaşır Suyu, Bardak, Mop)"
              value={localSearch}
              onChange={handleSearch}
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-stone-100 hover:bg-stone-50 focus:bg-white text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 border border-transparent focus:border-stone-300 focus:outline-none transition-all shadow-inner"
            />
            {localSearch && (
              <button
                onClick={handleClearSearch}
                className="p-1.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 rounded-lg"
                aria-label="Aramayı temizle"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* User profile / login button */}
          {user ? (
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                href={user.role === "admin" ? "/admin" : "/panel"}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors active:scale-95"
              >
                {user.role === "admin" ? (
                  <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-red shrink-0" />
                ) : (
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-blue shrink-0" />
                )}
                <span className="hidden sm:inline max-w-[120px] truncate">
                  {user.firma_adi || user.ad_soyad || user.username}
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-white text-stone-600 border border-stone-200">
                  {user.role === "admin" ? "YÖNETİCİ" : "BAYİ"}
                </span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  window.location.href = "/";
                }}
                className="p-1.5 sm:p-2 text-stone-400 hover:text-red-600 rounded-xl hover:bg-rose-50 transition-colors active:scale-95"
                title="Çıkış Yap"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/giris"
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-brand-red hover:bg-brand-redDark text-white shadow-sm transition-transform active:scale-95"
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              <span>Bayi Girişi</span>
            </Link>
          )}

          {/* Cart Button with slide-over drawer trigger - only shown when logged in */}
          {user && (
            <button
              onClick={openCart}
              id="cart-trigger-button"
              className="relative inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-brand-red hover:bg-brand-redDark text-white font-semibold text-xs sm:text-sm shadow-sm transition-transform active:scale-95"
              aria-label="Sepeti Aç"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Sepetim</span>
              {totalCount > 0 && (
                <span className="min-w-[1.25rem] h-5 px-1 bg-white text-brand-red text-xs font-bold rounded-full flex items-center justify-center shadow-sm animate-pulse">
                  {totalCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="px-3 pb-2.5 md:hidden">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Ürün adı veya barkod ara..."
            value={localSearch}
            onChange={handleSearch}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-stone-100 text-xs text-stone-900 placeholder:text-stone-400 border border-stone-200 focus:outline-none focus:bg-white focus:border-brand-red transition-all shadow-inner"
          />
          {localSearch && (
            <button
              onClick={handleClearSearch}
              className="p-1.5 absolute right-1.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              aria-label="Aramayı temizle"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
