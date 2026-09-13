"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Urun, Kategori } from "@/lib/types";
import { useCart } from "@/lib/store/cartStore";
import { useAuth } from "@/lib/store/authStore";
import { Modal } from "@/components/ui/modal";
import {
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Flame,
  Sparkles,
  Phone,
  Share2,
  ExternalLink,
  ShieldCheck,
  Truck,
  Layers,
  Lock,
  LogIn,
} from "lucide-react";

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Urun;
  category?: Kategori | null;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
  category,
}) => {
  const { user } = useAuth();
  const { addItem, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Check if item is in cart
  const cartItem = items.find((i) => i.urun.id === product.id);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/urun/${product.id}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Merhaba, Artı Temizlik sitenizdeki "${product.ad}" (Birim: ${product.birim} - Ürün Kodu: ${product.id}) hakkında detaylı toptan bilgi almak istiyorum.`
  );
  const whatsappUrl = `https://wa.me/905325551001?text=${whatsappMessage}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-1">
        {/* Left: Product Image (5 cols) */}
        <div className="md:col-span-5 flex flex-col justify-between">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-stone-50 border border-stone-200/80 flex items-center justify-center">
            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
              {product.cok_satan && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-red text-white text-[10px] font-bold shadow-sm">
                  <Flame className="w-3 h-3" />
                  ÇOK SATAN
                </span>
              )}
              {product.haftanin_urunu && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-blue text-white text-[10px] font-bold shadow-sm">
                  <Sparkles className="w-3 h-3" />
                  HAFTANIN ÜRÜNÜ
                </span>
              )}
            </div>

            {product.gorsel_url && !imgError ? (
              <Image
                src={product.gorsel_url}
                alt={product.ad}
                fill
                sizes="(max-width: 768px) 100vw, 350px"
                className="object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-stone-300">
                <ShoppingBag className="w-16 h-16 stroke-[1.5]" />
                <span className="text-xs mt-2 font-medium text-stone-400">
                  Artı Temizlik
                </span>
              </div>
            )}
          </div>

          {/* Share & Code bar */}
          <div className="mt-3 flex items-center justify-between text-xs text-stone-500 px-1">
            <span>
              Ürün Kodu: <strong className="text-stone-700">{product.id}</strong>
            </span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1 font-semibold text-stone-600 hover:text-stone-900 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Kopyalandı</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Paylaş</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Info & Actions (7 cols) */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-4">
          <div>
            {/* Category & Stock Tag */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              {category && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-brand-blue bg-sky-50 border border-sky-100 px-2.5 py-0.5 rounded-md">
                  <Layers className="w-3 h-3" />
                  {category.ad}
                </span>
              )}
              {product.stok_durumu === "tukendi" ? (
                <div className="flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>Tükendi</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Stokta Var</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h2 className="text-xl font-extrabold text-stone-900 leading-snug">
              {product.ad}
            </h2>

            {/* In Cart Info */}
            {user && cartItem && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sepetinizde {cartItem.adet} adet var</span>
              </div>
            )}

            {/* Pricing Box */}
            {user ? (
              <div className="mt-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Toptan / Bayi Satış Fiyatı
                </div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-black text-stone-900">
                    ₺{product.fiyat.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs font-semibold text-stone-600">
                    / {product.birim}
                  </span>
                  <span className="text-[10px] text-stone-400">
                    (KDV Dahildir)
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-3.5 rounded-xl bg-rose-50/60 border border-rose-100 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-stone-900">
                    Toptan & Bayi Fiyatı Korumalıdır
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Fiyatları görüntülemek ve sepete eklemek için lütfen giriş yapınız.
                  </p>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mt-4">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
                Ürün Açıklaması
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed max-h-32 overflow-y-auto">
                {product.aciklama ||
                  "Profesyonel hijyen ve temizlik standartlarına uygun, yüksek kaliteli ve verimli formüle sahip endüstriyel temizlik ürünüdür."}
              </p>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-stone-100">
              <div className="flex items-center gap-2 text-[11px] text-stone-600">
                <Truck className="w-3.5 h-3.5 text-brand-red flex-shrink-0" />
                <span>Anamur & Bozyazı Hızlı Dağıtım</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-stone-600">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-blue flex-shrink-0" />
                <span>Faturalı Kurumsal Satış</span>
              </div>
            </div>
          </div>

          {/* Controls & Action Buttons */}
          <div className="pt-4 border-t border-stone-100 space-y-2.5">
            {product.stok_durumu === "tukendi" ? (
              <div className="w-full p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-center text-xs font-bold text-rose-800">
                Bu ürün geçici olarak tükenmiştir
              </div>
            ) : user ? (
              <div className="flex items-center gap-2.5">
                {/* Stepper */}
                <div className="inline-flex items-center border border-stone-200 rounded-xl bg-stone-50 p-0.5">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
                    className="w-8 h-8 flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-white rounded-lg transition-colors"
                    aria-label="Adet Azalt"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-9 text-center text-xs font-bold text-stone-800 select-none">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(q + 1, 999))}
                    className="w-8 h-8 flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-white rounded-lg transition-colors"
                    aria-label="Adet Artır"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add To Cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 h-9 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                    isAdded
                      ? "bg-emerald-600 text-white"
                      : "bg-brand-red hover:bg-brand-redDark text-white active:scale-95"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{quantity} Adet Eklendi!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{quantity} Adet Sepete Ekle</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <Link
                href="/giris"
                onClick={onClose}
                className="w-full h-9 px-4 rounded-xl font-bold text-xs bg-stone-900 hover:bg-black text-white flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-rose-400" />
                <span>Fiyatlar & Sipariş İçin Giriş Yapın</span>
              </Link>
            )}

            {/* Standalone Page Link & WhatsApp */}
            <div className="flex items-center gap-2">
              <Link
                href={`/urun/${product.id}`}
                onClick={onClose}
                className="flex-1 h-8 px-3 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Ayrı Sayfada Aç</span>
                <ExternalLink className="w-3 h-3 text-stone-400" />
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-8 px-3 rounded-lg border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3 h-3 text-emerald-600" />
                <span>WhatsApp Danışmanı</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
