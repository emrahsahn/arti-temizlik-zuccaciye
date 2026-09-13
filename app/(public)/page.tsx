"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { StickyCategoryNav } from "@/components/layout/StickyCategoryNav";
import { ShowcaseBanners } from "@/components/catalog/ShowcaseBanners";
import { ProductCard } from "@/components/catalog/ProductCard";
import { BestsellersMarquee } from "@/components/catalog/BestsellersMarquee";
import { ProductMarquee } from "@/components/catalog/ProductMarquee";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { DataService } from "@/lib/dataService";
import {
  MOCK_KATEGORILER,
  MOCK_URUNLER,
  MOCK_AYARLAR,
  MOCK_KAMPANYALAR,
} from "@/lib/mockData";
import { Kategori, Urun, SiteAyarlari, Kampanya } from "@/lib/types";
import {
  Sparkles,
  Package,
  RotateCcw,
  Layers,
  Trash2,
  Brush,
  UtensilsCrossed,
  Droplets,
  FolderOpen,
} from "lucide-react";

function getCategoryIcon(slug: string, iconName?: string) {
  if (iconName === "Sparkles" || slug.includes("temizlik") || slug.includes("endustriyel")) {
    return <Sparkles className="w-5 h-5 text-sky-600" />;
  }
  if (iconName === "ScrollText" || slug.includes("kagit")) {
    return <Layers className="w-5 h-5 text-amber-600" />;
  }
  if (iconName === "Trash2" || slug.includes("cop") || slug.includes("poset")) {
    return <Trash2 className="w-5 h-5 text-emerald-600" />;
  }
  if (iconName === "Brush" || slug.includes("mop") || slug.includes("ekipman")) {
    return <Brush className="w-5 h-5 text-indigo-600" />;
  }
  if (
    iconName === "UtensilsCrossed" ||
    slug.includes("zuccaciye") ||
    slug.includes("mutfak")
  ) {
    return <UtensilsCrossed className="w-5 h-5 text-rose-600" />;
  }
  if (iconName === "Droplets" || slug.includes("hijyen") || slug.includes("sabun")) {
    return <Droplets className="w-5 h-5 text-cyan-600" />;
  }
  return <Package className="w-5 h-5 text-brand-red" />;
}

export default function HomePage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize with deterministic mock data to ensure exact SSR/Client hydration match
  const [categories, setCategories] = useState<Kategori[]>(() =>
    [...MOCK_KATEGORILER].sort((a, b) => a.sira - b.sira)
  );
  const [allProducts, setAllProducts] = useState<Urun[]>(() => [...MOCK_URUNLER]);
  const [settings, setSettings] = useState<SiteAyarlari>(() => ({ ...MOCK_AYARLAR }));
  const [campaigns, setCampaigns] = useState<Kampanya[]>(() =>
    MOCK_KAMPANYALAR.filter((k) => k.aktif)
  );

  // Sync client-side localStorage modifications after hydration
  useEffect(() => {
    const syncData = () => {
      setCategories(DataService.getCategories());
      setAllProducts(DataService.getProducts());
      setSettings(DataService.getSettings());
      setCampaigns(DataService.getCampaigns());
    };
    syncData();

    window.addEventListener("arti_categories_updated", syncData);
    window.addEventListener("arti_products_updated", syncData);
    window.addEventListener("arti_settings_updated", syncData);
    window.addEventListener("arti_campaigns_updated", syncData);
    window.addEventListener("storage", syncData);

    return () => {
      window.removeEventListener("arti_categories_updated", syncData);
      window.removeEventListener("arti_products_updated", syncData);
      window.removeEventListener("arti_settings_updated", syncData);
      window.removeEventListener("arti_campaigns_updated", syncData);
      window.removeEventListener("storage", syncData);
    };
  }, []);

  // Filtered products for active search or specific category view
  const filteredProducts = useMemo(() => {
    let prods = allProducts.filter((p) => p.aktif);
    if (selectedCategoryId) {
      prods = prods.filter((p) => p.kategori_id === selectedCategoryId);
    }
    if (searchQuery && searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      prods = prods.filter(
        (p) =>
          p.ad.toLowerCase().includes(q) ||
          p.aciklama?.toLowerCase().includes(q) ||
          p.birim.toLowerCase().includes(q)
      );
    }
    return prods;
  }, [allProducts, selectedCategoryId, searchQuery]);

  // Bestsellers (auto or manual)
  const bestsellers = useMemo(() => {
    if (settings.cok_satanlar_modu === "otomatik") {
      return allProducts.filter((p) => p.aktif).slice(0, 10);
    }
    return allProducts.filter((p) => p.aktif && p.cok_satan);
  }, [allProducts, settings]);

  // Category-grouped products for showcase marquees
  const categorySections = useMemo(() => {
    return categories
      .map((cat) => {
        const catProducts = allProducts.filter(
          (p) => p.aktif && p.kategori_id === cat.id
        );
        return {
          category: cat,
          products: catProducts,
        };
      })
      .filter((s) => s.products.length > 0);
  }, [categories, allProducts]);

  const activeCategory = categories.find((c) => c.id === selectedCategoryId);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
      />

      {/* Sticky Category Bar */}
      <StickyCategoryNav
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={(id) => setSelectedCategoryId(id)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full pb-16">
        {/* If user is NOT searching and NO category is selected, show animated marquees */}
        {!searchQuery && !selectedCategoryId ? (
          <div className="space-y-6 my-6">
            {/* Top Marketing Banners */}
            <ShowcaseBanners campaigns={campaigns} />

            {/* Bestsellers Continuous Infinite Marquee Section */}
            {bestsellers.length > 0 && (
              <BestsellersMarquee
                products={bestsellers}
                viewAllHref="/kategori/endustriyel-genel-temizlik"
              />
            )}

            {/* Category Sliding Marquees for each active category */}
            {categorySections.map(({ category, products }) => (
              <ProductMarquee
                key={category.id}
                title={category.ad}
                subtitle={`${products.length} çeşit profesyonel ürün seçeneği`}
                badgeText="Kategori Vitrini"
                badgeColor="stone"
                icon={getCategoryIcon(category.slug, category.icon_name)}
                products={products}
                viewAllHref={`/kategori/${category.slug}`}
                viewAllText="Tüm İçerikleri Göster"
              />
            ))}
          </div>
        ) : (
          /* Filtered Grid Catalog Section (When searching or a category tab is clicked) */
          <section className="mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-stone-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                  {searchQuery
                    ? `"${searchQuery}" için Arama Sonuçları`
                    : activeCategory
                    ? activeCategory.ad
                    : "Tüm Ürün Kataloğu"}
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Toplam <span className="font-bold text-stone-800">{filteredProducts.length}</span> ürün listeleniyor
                </p>
              </div>

              {(selectedCategoryId || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategoryId(null);
                    setSearchQuery("");
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg transition-colors w-fit"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Vitrin Görünümüne Dön</span>
                </button>
              )}
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500 my-8">
                <Package className="w-12 h-12 mx-auto text-stone-300 mb-3" />
                <h3 className="text-base font-bold text-stone-800">
                  Aradığınız Kriterlere Uygun Ürün Bulunamadı
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                  Farklı bir arama terimi deneyebilir veya kategorilerden diğer temizlik ve züccaciye ürünlerine göz atabilirsiniz.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategoryId(null);
                    setSearchQuery("");
                  }}
                  className="mt-5 px-4 py-2 text-xs font-bold text-brand-red border border-brand-red rounded-xl hover:bg-rose-50 transition-colors"
                >
                  Vitrine Dön
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Slide-over cart drawer */}
      <CartDrawer />

      {/* Footer */}
      <Footer />
    </div>
  );
}
