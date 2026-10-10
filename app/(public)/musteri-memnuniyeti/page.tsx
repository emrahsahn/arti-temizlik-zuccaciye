"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CustomerReviewsSection } from "@/components/catalog/CustomerReviewsSection";
import { DataService } from "@/lib/dataService";
import { MOCK_MEMNUNIYETLER } from "@/lib/mockData";
import { MusteriMemnuniyeti } from "@/lib/types";
import { HeartHandshake, ChevronLeft, ShieldCheck, Truck, Sparkles } from "lucide-react";

export default function CustomerReviewsPage() {
  const [reviews, setReviews] = useState<MusteriMemnuniyeti[]>(() =>
    MOCK_MEMNUNIYETLER.filter((r) => r.aktif !== false)
  );

  useEffect(() => {
    const syncData = () => {
      setReviews(DataService.getReviews());
    };
    syncData();

    window.addEventListener("arti_reviews_updated", syncData);
    window.addEventListener("storage", syncData);

    return () => {
      window.removeEventListener("arti_reviews_updated", syncData);
      window.removeEventListener("storage", syncData);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full py-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-brand-red transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Ana Sayfa &amp; Vitrine Dön</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white shadow-lg mb-8 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/10">
              <HeartHandshake className="w-3.5 h-3.5 text-brand-red" />
              <span>GÜVEN &amp; YERİNDE TESLİMAT</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Müşteri Memnuniyeti &amp; <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-300">
                Sevkiyat Hikayelerimiz
              </span>
            </h1>

            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Anamur, Bozyazı ve Aydıncık bölgesinde oteller, kafeler, restoranlar, marketler ve haneler için gerçekleştirdiğimiz toptan teslimatlarımız ve iş ortaklarımızın gerçek geri bildirimleri.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-red" />
                <span className="font-semibold text-stone-200">Kendi Araçlarımızla Teslimat</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-stone-200">%100 Orijinal Ürün Garantisi</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-stone-200">Bölgesel Danışman Desteği</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <CustomerReviewsSection
          reviews={reviews}
          showViewAll={false}
          title="Tüm Video ve Fotoğraf Paylaşımları"
          subtitle="İşletmelerimizin sevkiyat anları, ürün kurulumları ve deneyimleri"
        />
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
}
