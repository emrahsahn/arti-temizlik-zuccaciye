"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store/cartStore";
import { useAuth } from "@/lib/store/authStore";
import { DataService } from "@/lib/dataService";
import { OrderSuccessModal } from "./OrderSuccessModal";
import { Siparis } from "@/lib/types";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Send,
  LogIn,
  MessageSquareText,
  UserCheck,
} from "lucide-react";

export const CartDrawer: React.FC = () => {
  const {
    isOpen,
    closeCart,
    items,
    removeItem,
    updateQuantity,
    updateItemNote,
    clearCart,
    totalCount,
    totalPrice,
  } = useCart();

  const { user } = useAuth();

  const [orderNote, setOrderNote] = useState("");
  const [activeNoteItemId, setActiveNoteItemId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<Siparis | null>(null);

  // Fetch consultant for the current user if available
  const userConsultant = user?.danisman_id
    ? DataService.getConsultants().find((d) => d.id === user.danisman_id)
    : null;

  const handleOrderSubmit = async () => {
    if (!user) return;
    if (items.length === 0) return;

    setIsSubmitting(true);
    try {
      const order = DataService.createOrder({
        user_id: user.id,
        items: items.map((item) => ({
          urun_id: item.urun.id,
          adet: item.adet,
          not: item.not,
        })),
        siparis_notu: orderNote,
      });

      clearCart();
      setOrderNote("");
      closeCart();
      setSubmittedOrder(order);
    } catch (e) {
      console.error("Sipariş oluşturulamadı:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={closeCart}
        title={
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-red" />
            <span>Sipariş Sepetim</span>
            <span className="text-xs font-normal text-stone-500">
              ({totalCount} Kalem)
            </span>
          </div>
        }
        footer={
          items.length > 0 ? (
            <div className="space-y-4">
              {/* Order note textarea */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Sipariş Notu (İsteğe Bağlı)
                </label>
                <textarea
                  rows={2}
                  placeholder="Teslimat saati, fatura talebi veya özel talimatınız..."
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-red resize-none"
                />
              </div>

              {/* Total Row */}
              <div className="flex items-baseline justify-between pt-2 border-t border-stone-200">
                <div>
                  <div className="text-xs text-stone-500">Tahmini Toplam</div>
                  <div className="text-xs text-stone-400">KDV Dahil / Net Bayi</div>
                </div>
                <div className="text-xl font-extrabold text-stone-900">
                  ₺{totalPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                </div>
              </div>

              {/* Action Button: User vs Guest */}
              {user ? (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full shadow-md hover:shadow-lg"
                  onClick={handleOrderSubmit}
                  isLoading={isSubmitting}
                >
                  <Send className="w-4 h-4 mr-2" />
                  <span>Sipariş Talebini Gönder</span>
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                    <p className="font-semibold">Sipariş vermek için müşteri girişi gereklidir.</p>
                    <p className="text-[11px] text-amber-700 mt-0.5">
                      Fiyatlar kayıtlı bayiler ve kurumsal müşteriler için geçerlidir.
                    </p>
                  </div>
                  <Link href="/giris" onClick={closeCart} className="block w-full">
                    <Button variant="primary" size="lg" className="w-full">
                      <LogIn className="w-4 h-4 mr-2" />
                      <span>Giriş Yap ve Siparişi Tamamla</span>
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : null
        }
      >
        {/* If logged in, show assigned consultant note */}
        {user && userConsultant && (
          <div className="mb-4 p-3 bg-sky-50 border border-sky-100 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-sky-900">
              <UserCheck className="w-4 h-4 text-brand-blue" />
              <div>
                <span className="font-semibold">Satış Danışmanınız: </span>
                <span>{userConsultant.ad_soyad}</span>
              </div>
            </div>
            <a
              href={`tel:${userConsultant.telefon.replace(/\s+/g, "")}`}
              className="text-[11px] font-bold text-brand-blue hover:underline"
            >
              {userConsultant.telefon}
            </a>
          </div>
        )}

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-12 text-stone-500">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4 text-stone-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-stone-800">
              Sepetiniz Henüz Boş
            </h4>
            <p className="text-xs text-stone-500 max-w-xs mt-1">
              Temizlik malzemeleri, ambalaj veya züccaciye ürünlerinden dilediğinizi sepetinize ekleyebilirsiniz.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-6"
              onClick={closeCart}
            >
              Kataloğu İncele
            </Button>
          </div>
        ) : (
          /* Item list */
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.urun.id}
                className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/70 space-y-2.5 transition-colors hover:border-stone-300"
              >
                <div className="flex items-start gap-3">
                  {/* Thumbnail */}
                  <div className="relative w-14 h-14 bg-white rounded-lg border border-stone-200 overflow-hidden flex-shrink-0">
                    {item.urun.gorsel_url ? (
                      <Image
                        src={item.urun.gorsel_url}
                        alt={item.urun.ad}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-stone-900 leading-snug line-clamp-2">
                      {item.urun.ad}
                    </h5>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      ₺{item.urun.fiyat.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} / {item.urun.birim}
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => removeItem(item.urun.id)}
                    className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg transition-colors"
                    aria-label="Ürünü sepetten çıkar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Bottom Row: Stepper and Subtotal */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-200/50">
                  <div className="flex items-center gap-2">
                    {/* Stepper */}
                    <div className="inline-flex items-center border border-stone-200 rounded-lg bg-white p-0.5">
                      <button
                        onClick={() => updateQuantity(item.urun.id, item.adet - 1)}
                        className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded"
                        aria-label="Azalt"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-stone-800">
                        {item.adet}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.urun.id, item.adet + 1)}
                        className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded"
                        aria-label="Artır"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Item note trigger */}
                    <button
                      onClick={() =>
                        setActiveNoteItemId(
                          activeNoteItemId === item.urun.id ? null : item.urun.id
                        )
                      }
                      className="text-[11px] text-stone-500 hover:text-stone-800 flex items-center gap-1"
                    >
                      <MessageSquareText className="w-3 h-3" />
                      <span>{item.not ? "Notu Düzenle" : "+ Kalem Notu"}</span>
                    </button>
                  </div>

                  <div className="text-xs font-bold text-stone-900">
                    ₺{(item.adet * item.urun.fiyat).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                  </div>
                </div>

                {/* Inline item note editor */}
                {(activeNoteItemId === item.urun.id || item.not) && (
                  <div className="pt-2">
                    <input
                      type="text"
                      placeholder="Bu ürüne özel not (örn: Mavi renk olsun)"
                      value={item.not || ""}
                      onChange={(e) => updateItemNote(item.urun.id, e.target.value)}
                      className="w-full text-[11px] px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Drawer>

      {/* Confirmation Modal */}
      <OrderSuccessModal
        order={submittedOrder}
        isOpen={!!submittedOrder}
        onClose={() => setSubmittedOrder(null)}
      />
    </>
  );
};
