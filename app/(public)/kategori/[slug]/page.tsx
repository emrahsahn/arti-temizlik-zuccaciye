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
import { MOCK_KATEGORILER, MOCK_URUNLER } from "@/lib/mockData";
import { Kategori, Urun } from "@/lib/types";
import { ArrowLeft, Package } from "lucide-react";

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [categories, setCategories] = useState<Kategori[]>(() =>
    [...MOCK_KATEGORILER].sort((a, b) => a.sira - b.sira)
  );
  const [allProducts, setAllProducts] = useState<Urun[]>(() => [...MOCK_URUNLER]);

  useEffect(() => {
    const sync = () => {
      setCategories(DataService.getCategories());
      setAllProducts(DataService.getProducts());
    };
    sync();

    window.addEventListener("arti_categories_updated", sync);
    window.addEventListener("arti_products_updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("arti_categories_updated", sync);
      window.removeEventListener("arti_products_updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const activeCategory = categories.find((c) => c.slug === slug);

  const products = useMemo(() => {
    if (!activeCategory) return [];
    return allProducts.filter((p) => p.aktif && p.kategori_id === activeCategory.id);
  }, [activeCategory, allProducts]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      <Header />

      <StickyCategoryNav
        categories={categories}
        selectedCategoryId={activeCategory?.id || null}
        onSelectCategory={(id) => {
          if (id === null) {
            window.location.href = "/";
          } else {
            const cat = categories.find((c) => c.id === id);
            if (cat) window.location.href = `/kategori/${cat.slug}`;
          }
        }}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Tüm Ürün Kataloğuna Dön
        </Link>

        {activeCategory ? (
          <div>
            {/* Header */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 mb-8 shadow-sm">
              <span className="text-[11px] font-bold text-brand-blue uppercase tracking-wider bg-sky-50 px-2.5 py-1 rounded-md">
                KATEGORİ
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
                {activeCategory.ad}
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                Bu kategoride toplam <span className="font-bold text-stone-800">{products.length}</span> ürün bulunmaktadır.
              </p>
            </div>

            {/* Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {products.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500">
                <Package className="w-12 h-12 mx-auto text-stone-300 mb-3" />
                <h3 className="text-base font-bold text-stone-800">
                  Bu kategoride henüz ürün bulunmuyor.
                </h3>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500">
            <h3 className="text-lg font-bold text-stone-800">Kategori Bulunamadı</h3>
            <Link href="/" className="mt-4 inline-block text-xs font-bold text-brand-red">
              Ana Sayfaya Dön
            </Link>
          </div>
        )}
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
}
