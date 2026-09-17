"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/store/authStore";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FolderTree,
  Layers,
  Users,
  PhoneCall,
  UserCheck,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  mobileOpen = false,
  onMobileClose,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const links = [
    { href: "/admin", label: "Genel Bakış", icon: LayoutDashboard },
    { href: "/admin/siparisler", label: "Sipariş Yönetimi", icon: ShoppingBag },
    { href: "/admin/urunler", label: "Ürün Kataloğu & Fiyat", icon: Package },
    { href: "/admin/kategoriler", label: "Kategori Yönetimi", icon: FolderTree },
    { href: "/admin/vitrin", label: "Vitrin & Kampanyalar", icon: Layers },
    { href: "/admin/danismanlar", label: "Danışmanlar & İletişim", icon: UserCheck },
    { href: "/admin/kullanicilar", label: "Müşteri / Bayi Hesapları", icon: Users },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white">
      {/* Header / Brand */}
      <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between">
        <div>
          <Link href="/" onClick={onMobileClose} className="block">
            <Image
              src="/logo.png"
              alt="Artı Temizlik Züccaciye"
              width={320}
              height={101}
              className="h-10 sm:h-11 w-auto object-contain"
            />
          </Link>
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-bold text-brand-red bg-rose-50 px-2 py-0.5 rounded-lg w-fit">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>YÖNETİCİ PANELİ</span>
          </div>
        </div>
      </div>

      {/* Nav menu */}
      <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto touch-scroll">
        {links.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-98 ${
                isActive
                  ? "bg-brand-red text-white shadow-sm shadow-rose-200"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer controls */}
      <div className="p-4 border-t border-stone-100 space-y-2 bg-stone-50/70 pb-safe">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            <span>Site Vitrinini Aç</span>
          </span>
        </Link>

        <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between">
          <div className="text-xs truncate pr-2">
            <div className="font-bold text-stone-800 truncate">
              {user?.ad_soyad || user?.username}
            </div>
            <div className="text-[10px] text-stone-400">Yönetici Oturumu</div>
          </div>
          <button
            onClick={() => {
              logout();
              window.location.href = "/giris";
            }}
            className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors active:scale-95"
            title="Çıkış Yap"
            aria-label="Çıkış Yap"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (lg and above) */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-stone-200 flex-col flex-shrink-0 min-h-screen sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (below lg) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm animate-fade-in"
            onClick={onMobileClose}
            aria-hidden="true"
          />

          {/* Slide-over Menu Panel */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-2xl border-r border-stone-200 flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
