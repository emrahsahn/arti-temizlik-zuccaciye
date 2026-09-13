"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { StickyCategoryNav } from "@/components/layout/StickyCategoryNav";
import { ProductCard } from "@/components/catalog/ProductCard";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { DataService } from "@/lib/dataService";
import { Kampanya, Urun, Kategori } from "@/lib/types";
import {
  Award,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  Package,
  Search,
  CheckCircle2,
  Filter,
} from "lucide-react";

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<Kampanya | null>(null);
  const [allProducts, setAllProducts] = useState<Urun[]>([]);
  const [categories, setCategories] = useState<Kategori[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Sync data on mount and updates
  useEffect(() => {
    const syncData = () => {
      const camps = DataService.getCampaigns(true);
      const current = camps.find((c) => c.id === campaignId) || null;
      setCampaign(current);
      setAllProducts(DataService.getProducts());
      setCategories(DataService.getCategories());
      setIsLoading(false);
    };
    syncData();

    window.addEventListener("arti_campaigns_updated", syncData);
    window.addEventListener("arti_products_updated", syncData);
    window.addEventListener("storage", syncData);

    return () => {
      window.removeEventListener("arti_campaigns_updated", syncData);
      window.removeEventListener("arti_products_updated", syncData);
      window.removeEventListener("storage", syncData);
    };
  }, [campaignId]);

  // Campaign products
  const campaignProducts = useMemo(() => {
    if (!campaign) return [];
    const productIds = campaign.urun_ids || [];

    let list = allProducts.filter((p) => p.aktif && productIds.includes(p.id));

    // If no specific IDs were attached, fallback to showing all active products or empty
    if (productIds.length === 0) {
      list = allProducts.filter((p) => p.aktif).slice(0, 12);
    }

    // Filter by selected category if any
    if (selectedCategoryId) {
      list = list.filter((p) => p.kategori_id === selectedCategoryId);
    }

    // Filter by search query if any
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.ad.toLowerCase().includes(q) ||
          (p.aciklama && p.aciklama.toLowerCase().includes(q))
      );
    }

    return list;
  }, [campaign, allProducts, selectedCategoryId, searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-400">
            <Award className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-stone-900 mb-2">
            Kampanya Bulunamadı veya Sona Erdi
          </h1>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
            Aradığınız kampanya sayfası yayından kaldırılmış olabilir. Ana sayfadaki diğer fırsatları inceleyebilirsiniz.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-red text-white text-xs font-bold shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ana Sayfaya Dön</span>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <StickyCategoryNav
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      <main className="flex-1 max-w-7xl mx-auto px-3.5 sm:px-6 py-6 w-full space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
          <Link href="/" className="hover:text-stone-900 transition-colors">
            Ana Sayfa
          </Link>
          <span>/</span>
          <span className="text-stone-400">Kampanyalar</span>
          <span>/</span>
          <span className="text-stone-900 font-bold truncate max-w-xs">
            {campaign.baslik}
          </span>
        </div>

        {/* Campaign Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-950 via-stone-900 to-stone-800 text-white p-6 sm:p-10 shadow-xl border border-stone-800">
          {/* Ambient Glows */}
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-brand-red/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-brand-blue/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md text-xs font-bold text-stone-200 border border-white/15 mb-3 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-brand-red" />
              <span>{campaign.badge_text || "ÖZEL KAMPANYA"}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {campaign.baslik}
            </h1>

            <p className="mt-3 text-xs sm:text-base text-stone-300 leading-relaxed max-w-2xl">
              {campaign.aciklama}
            </p>

            <div className="mt-5 flex items-center gap-4 text-xs text-stone-300">
              <div className="flex items-center gap-1.5 font-bold bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                <Package className="w-4 h-4 text-rose-400" />
                <span>{campaign.urun_ids?.length || campaignProducts.length} Kampanyalı Ürün</span>
              </div>
              <span className="hidden sm:inline text-stone-500">•</span>
              <span className="hidden sm:inline text-stone-400">
                Anamur & Bozyazı Hızlı Dağıtım ve Net Bayi Fiyatları
              </span>
            </div>
          </div>
        </div>

        {/* Campaign Product Grid Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-red" />
                <span>Kampanyaya Dahil Ürünler</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Aşağıdaki ürünlerden dilediğinizi sepetinize ekleyip sipariş talebinizi oluşturabilirsiniz.
              </p>
            </div>

            <div className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl self-start">
              {campaignProducts.length} Ürün Listeleniyor
            </div>
          </div>

          {/* Product Grid */}
          {campaignProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500">
              <ShoppingBag className="w-12 h-12 mx-auto text-stone-300 mb-3" />
              <h3 className="text-base font-bold text-stone-800">
                Kriterlere Uygun Ürün Bulunamadı
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Farklı bir kategori seçebilir veya tüm ürünleri görüntüleyebilirsiniz.
              </p>
              {selectedCategoryId && (
                <button
                  onClick={() => setSelectedCategoryId(null)}
                  className="mt-4 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold shadow-sm"
                >
                  Tüm Kampanya Ürünlerini Göster
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {campaignProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </section>
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
}
