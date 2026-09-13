"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Urun } from "@/lib/types";
import { useCart } from "@/lib/store/cartStore";
import { useAuth } from "@/lib/store/authStore";
import {
  Plus,
  Minus,
  ShoppingBag,
  Check,
  Flame,
  Sparkles,
  Eye,
  Lock,
} from "lucide-react";

interface ProductCardProps {
  product: Urun;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = "",
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { addItem, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Check if item is already in cart
  const cartItem = items.find((i) => i.urun.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => Math.min(prev + 1, 999));
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div
      onClick={() => router.push(`/urun/${product.id}`)}
      className={`group bg-white rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-stone-300 transition-all duration-200 flex flex-col overflow-hidden relative cursor-pointer ${className}`}
    >
        {/* Badges container */}
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

        {/* Product Image Area with Hover Overlay */}
        <div className="relative w-full aspect-square bg-stone-50 border-b border-stone-100 flex items-center justify-center overflow-hidden">
          {product.gorsel_url && !imgError ? (
            <Image
              src={product.gorsel_url}
              alt={product.ad}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-stone-300">
              <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
              <span className="text-[11px] mt-1 font-medium text-stone-400">
                Artı Temizlik
              </span>
            </div>
          )}

          {/* Quick Preview Hover Pill */}
          <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/80 text-white text-xs font-semibold backdrop-blur-sm shadow-lg">
              <Eye className="w-3.5 h-3.5" />
              <span>Detaylı İncele</span>
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Unit badge */}
            <div className="flex items-center justify-between mb-1 sm:mb-1.5 gap-1">
              <span className="text-[10px] sm:text-[11px] font-semibold text-stone-500 bg-stone-100 px-1.5 sm:px-2 py-0.5 rounded-md truncate">
                Birim: {product.birim}
              </span>
              {user && cartItem && (
                <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded-md shrink-0">
                  {cartItem.adet} adet
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-bold text-stone-900 text-xs sm:text-base leading-tight sm:leading-snug line-clamp-2 min-h-[1.9rem] sm:min-h-[2.5rem] group-hover:text-brand-red transition-colors">
              {product.ad}
            </h3>

            {/* Description snippet */}
            {product.aciklama && (
              <p className="mt-1 text-[11px] sm:text-xs text-stone-500 line-clamp-1 sm:line-clamp-2">
                {product.aciklama}
              </p>
            )}
          </div>

          {/* Price and Cart controls */}
          <div className="mt-2.5 sm:mt-4 pt-2.5 sm:pt-3 border-t border-stone-100">
            {user ? (
              <>
                {/* Price Display for Logged-in Users */}
                <div className="flex items-baseline justify-between mb-2 sm:mb-3">
                  <div>
                    <span className="text-base sm:text-xl font-extrabold text-stone-900">
                      ₺{product.fiyat.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-stone-500 ml-1">
                      /{product.birim}
                    </span>
                  </div>

                  {product.stok_durumu === "tukendi" && (
                    <span className="text-[9px] sm:text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded-md">
                      Tükendi
                    </span>
                  )}
                </div>

                {product.stok_durumu === "tukendi" ? (
                  /* Out of stock disabled button */
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="w-full h-8 sm:h-9 px-2 sm:px-3 rounded-xl font-bold text-[11px] sm:text-xs bg-stone-100 text-stone-500 border border-stone-200 flex items-center justify-center gap-1.5 cursor-not-allowed select-none"
                  >
                    <span>Stokta Yok</span>
                  </div>
                ) : (
                  /* Stepper & Add button */
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* Quantity Stepper */}
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center border border-stone-200 rounded-xl bg-stone-50 p-0.5 shrink-0"
                    >
                      <button
                        type="button"
                        onClick={handleDecrement}
                        className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-white rounded-lg transition-colors active:scale-90"
                        aria-label="Adet Azalt"
                      >
                        <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                      <span className="w-6 sm:w-8 text-center text-xs font-bold text-stone-800 select-none">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={handleIncrement}
                        className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-white rounded-lg transition-colors active:scale-90"
                        aria-label="Adet Artır"
                      >
                        <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className={`flex-1 h-8 sm:h-9 px-2 sm:px-3 rounded-xl font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 transition-all shadow-sm active:scale-95 ${
                        isAdded
                          ? "bg-emerald-600 text-white"
                          : "bg-brand-red hover:bg-brand-redDark text-white"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>Eklendi</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>Ekle</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Locked Price Notice for Guest Users */
              <div className="flex items-center justify-between gap-1 text-[11px] sm:text-xs font-semibold text-stone-600 bg-stone-50 px-2 sm:px-2.5 py-1.5 rounded-xl border border-stone-200/70">
                <div className="flex items-center gap-1 truncate">
                  <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-red shrink-0" />
                  <span className="truncate">Giriş Yapın</span>
                </div>
                {product.stok_durumu === "tukendi" && (
                  <span className="text-[9px] sm:text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1 py-0.5 rounded shrink-0">
                    Tükendi
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
  );
};
