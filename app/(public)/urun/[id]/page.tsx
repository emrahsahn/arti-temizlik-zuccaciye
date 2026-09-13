"use client";

import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
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
import { useCart } from "@/lib/store/cartStore";
import { useAuth } from "@/lib/store/authStore";
import {
  ArrowLeft,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Flame,
  Sparkles,
  Phone,
  ShieldCheck,
  Truck,
  RotateCcw,
  Layers,
  Share2,
  Package,
  Lock,
  LogIn,
} from "lucide-react";

export default function StandaloneProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const { user } = useAuth();
  const { addItem, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

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

  const product = useMemo(
    () => allProducts.find((p) => p.id === productId),
    [allProducts, productId]
  );

  const category = useMemo(() => {
    if (!product) return null;
    return categories.find((c) => c.id === product.kategori_id) || null;
  }, [product, categories]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((p) => p.aktif && p.kategori_id === product.kategori_id && p.id !== product.id)
      .slice(0, 4);
  }, [allProducts, product]);

  const cartItem = items.find((i) => i.urun.id === product?.id);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-3xl p-12 border border-stone-200 shadow-sm">
            <Package className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-stone-900">
              Ürün Bulunamadı
            </h1>
            <p className="text-sm text-stone-500 mt-2">
              Aradığınız ürün katalogdan kaldırılmış veya bağlantı hatalı olabilir.
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-red text-white text-sm font-bold shadow-md hover:bg-brand-redDark transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Ana Sayfa Kataloğuna Dön
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Merhaba, Artı Temizlik web sitenizdeki "${product.ad}" (Birim: ${product.birim} - Fiyat: ₺${product.fiyat}) hakkında bilgi ve toptan sipariş şartlarını öğrenmek istiyorum.`
  );
  const whatsappUrl = `https://wa.me/905325551001?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      <Header />

      {/* Category Navigation Bar */}
      <StickyCategoryNav
        categories={categories}
        selectedCategoryId={product.kategori_id}
        onSelectCategory={(id) => {
          if (id === null) {
            router.push("/");
          } else {
            const cat = categories.find((c) => c.id === id);
            if (cat) router.push(`/kategori/${cat.slug}`);
          }
        }}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full py-8">
        {/* Breadcrumbs & Back link */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <nav className="flex items-center gap-2 text-xs font-semibold text-stone-500 flex-wrap">
            <Link href="/" className="hover:text-stone-900 transition-colors">
              Ana Sayfa
            </Link>
            <span>/</span>
            {category && (
              <>
                <Link
                  href={`/kategori/${category.slug}`}
                  className="hover:text-stone-900 transition-colors"
                >
                  {category.ad}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-stone-900 line-clamp-1 max-w-xs sm:max-w-md">
              {product.ad}
            </span>
          </nav>

          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Geri Dön</span>
          </button>
        </div>

        {/* Product Hero Card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden p-6 sm:p-10 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Product Image Area (5 cols) */}
            <div className="lg:col-span-5">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-stone-50 border border-stone-200/80 flex items-center justify-center">
                {/* Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
                  {product.cok_satan && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-red text-white text-xs font-bold shadow-md">
                      <Flame className="w-4 h-4" />
                      ÇOK SATAN
                    </span>
                  )}
                  {product.haftanin_urunu && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-blue text-white text-xs font-bold shadow-md">
                      <Sparkles className="w-4 h-4" />
                      HAFTANIN ÜRÜNÜ
                    </span>
                  )}
                </div>

                {product.gorsel_url && !imgError ? (
                  <Image
                    src={product.gorsel_url}
                    alt={product.ad}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-stone-300">
                    <ShoppingBag className="w-20 h-20 stroke-[1.5]" />
                    <span className="text-sm mt-3 font-medium text-stone-400">
                      Artı Temizlik & Züccaciye
                    </span>
                  </div>
                )}
              </div>

              {/* Share & Code bar */}
              <div className="mt-4 flex items-center justify-between text-xs text-stone-500 px-1">
                <span>Ürün Kodu: <strong className="text-stone-700">{product.id}</strong></span>
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 font-semibold text-stone-600 hover:text-stone-900 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-600">Bağlantı Kopyalandı</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span>Ürünü Paylaş</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right: Info & Actions (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6">
              <div>
                {/* Category & Stock Tag */}
                <div className="flex items-center gap-3 flex-wrap mb-3">
                  {category && (
                    <Link
                      href={`/kategori/${category.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-blue bg-sky-50 border border-sky-100 px-3 py-1 rounded-lg hover:bg-sky-100 transition-colors"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      {category.ad}
                    </Link>
                  )}
                  {product.stok_durumu === "tukendi" ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span>Tükendi / Stokta Yok</span>
                    </div>
                  ) : product.stok_durumu === "sorunuz" ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Stok Durumunu Sorunuz</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Stokta Var / Hızlı Sevkiyat</span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
                  {product.ad}
                </h1>

                {/* In Cart Indicator */}
                {/* In Cart Indicator */}
                {user && cartItem && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Bu üründen sepetinizde {cartItem.adet} adet bulunuyor</span>
                  </div>
                )}

                {/* Pricing Box */}
                {user ? (
                  <div className="mt-5 p-5 rounded-2xl bg-stone-50 border border-stone-200">
                    <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
                      Toptan & Perakende Bayi Satış Fiyatı
                    </div>
                    <div className="flex items-baseline gap-3 mt-1">
                      <span className="text-3xl sm:text-4xl font-black text-stone-900">
                        ₺{product.fiyat.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-sm font-semibold text-stone-600">
                        / {product.birim}
                      </span>
                      <span className="text-xs text-stone-400">
                        (KDV Dahildir)
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-2">
                      * Yüksek adetli koli ve palet siparişlerinizde özel iskonto oranları için satış danışmanınızla görüşebilirsiniz.
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 p-5 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-start gap-3.5">
                    <Lock className="w-6 h-6 text-brand-red flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-bold text-stone-900">
                        Toptan & Bayi Fiyatı Korumalıdır
                      </div>
                      <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                        Kurumsal müşteri ve toptan bayi fiyatlarımızı görüntülemek ve sipariş listesi oluşturmak için lütfen sisteme giriş yapınız.
                      </p>
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="mt-6">
                  <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">
                    Ürün Açıklaması & Kullanım Alanı
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                    {product.aciklama ||
                      "Profesyonel hijyen ve temizlik standartlarına uygun, yüksek kaliteli ve verimli formüle sahip endüstriyel temizlik ürünüdür."}
                  </p>
                </div>

                {/* Value Propositions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-6 border-t border-stone-100">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50/80 border border-stone-100">
                    <Truck className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-stone-900">
                        Anamur & Bozyazı Hızlı Teslimat
                      </div>
                      <div className="text-[11px] text-stone-500">
                        İşletmenize kendi servis araçlarımızla kapıya teslim.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50/80 border border-stone-100">
                    <ShieldCheck className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-stone-900">
                        Kurumsal Güvence & Fatura
                      </div>
                      <div className="text-[11px] text-stone-500">
                        Tüm siparişler eksiksiz ve resmi faturalı teslim edilir.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Controls */}
              <div className="pt-6 border-t border-stone-200 space-y-4">
                {product.stok_durumu === "tukendi" ? (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-2">
                    <div className="text-sm font-bold text-rose-900">
                      Bu Ürün Geçici Olarak Stoklarımızda Tükenmiştir
                    </div>
                    <p className="text-xs text-rose-700">
                      Yeni parti sevkiyatı ve tahmini temin tarihi hakkında bilgi almak için lütfen satış danışmanımızla WhatsApp üzerinden iletişime geçiniz.
                    </p>
                  </div>
                ) : user ? (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Quantity Stepper */}
                    <div className="inline-flex items-center justify-between border border-stone-300 rounded-xl bg-stone-50 p-1 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
                        className="w-10 h-10 flex items-center justify-center text-stone-700 hover:text-stone-950 hover:bg-white rounded-lg transition-colors"
                        aria-label="Adet Azalt"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center text-base font-bold text-stone-900 select-none">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(q + 1, 999))}
                        className="w-10 h-10 flex items-center justify-center text-stone-700 hover:text-stone-950 hover:bg-white rounded-lg transition-colors"
                        aria-label="Adet Artır"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className={`flex-1 h-12 px-6 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-95 ${
                        isAdded
                          ? "bg-emerald-600 text-white"
                          : "bg-brand-red hover:bg-brand-redDark text-white"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-5 h-5 stroke-[3]" />
                          <span>{quantity} Adet Sepete Eklendi!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-5 h-5" />
                          <span>{quantity} Adet Sepete Ekle</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/giris"
                    className="w-full h-12 px-6 rounded-2xl font-bold text-sm bg-stone-900 hover:bg-black text-white flex items-center justify-center gap-2.5 shadow-md transition-all active:scale-95"
                  >
                    <LogIn className="w-4 h-4 text-rose-400" />
                    <span>Fiyatları Görmek ve Sipariş Vermek İçin Giriş Yapın</span>
                  </Link>
                )}

                {/* WhatsApp Direct Inquire */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 px-4 rounded-xl border border-emerald-300 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Danışman ile WhatsApp Üzerinden Toptan Bilgi Al</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                  Benzer ve Tamamlayıcı Ürünler
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Bu kategoride en çok tercih edilen diğer profesyonel temizlik ürünleri
                </p>
              </div>

              {category && (
                <Link
                  href={`/kategori/${category.slug}`}
                  className="text-xs font-bold text-brand-red hover:text-red-700 flex items-center gap-1"
                >
                  Tümünü Gör ({category.ad}) →
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Mobile Sticky Order Bar (Bottom) */}
      {product && (
        <div className="md:hidden sticky bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-3 pb-safe shadow-2xl">
          <div className="flex items-center justify-between gap-2.5">
            {user ? (
              <>
                <div className="flex flex-col shrink-0">
                  <span className="text-[10px] text-stone-500 font-medium">Birim Fiyat</span>
                  <span className="text-base font-extrabold text-stone-900 leading-tight">
                    ₺{product.fiyat.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {product.stok_durumu === "tukendi" ? (
                  <span className="px-3 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200">
                    Tükendi
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5 flex-1 justify-end">
                    <div className="inline-flex items-center border border-stone-200 rounded-xl bg-stone-50 p-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
                        className="w-7 h-7 flex items-center justify-center text-stone-600 active:scale-90"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-stone-800">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(q + 1, 999))}
                        className="w-7 h-7 flex items-center justify-center text-stone-600 active:scale-90"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className={`h-9 px-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 ${
                        isAdded
                          ? "bg-emerald-600 text-white"
                          : "bg-brand-red text-white"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Eklendi</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Sepete Ekle</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link
                href="/giris"
                className="w-full h-10 px-4 rounded-xl font-bold text-xs bg-brand-red text-white flex items-center justify-center gap-2 shadow-sm active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>Giriş Yaparak Fiyat Gör & Sipariş Ver</span>
              </Link>
            )}
          </div>
        </div>
      )}

      <CartDrawer />
      <Footer />
    </div>
  );
}
