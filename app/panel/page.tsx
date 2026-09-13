"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/store/authStore";
import { DataService } from "@/lib/dataService";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import {
  Package,
  Calendar,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Clock,
  FileText,
} from "lucide-react";

export default function CustomerOrdersPage() {
  const { user } = useAuth();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const orders = useMemo(() => {
    if (!user) return [];
    return DataService.getOrders(user.id);
  }, [user]);

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Sipariş Geçmişim</h2>
          <p className="text-xs text-stone-500">
            Geçmiş ve hazırlık aşamasındaki tüm siparişlerinizin durumunu buradan takip edebilirsiniz.
          </p>
        </div>

        <Link href="/">
          <Button variant="primary" size="sm" className="gap-1.5">
            <ShoppingBag className="w-4 h-4" />
            <span>Yeni Sipariş Talebi Oluştur</span>
          </Button>
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-400">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-stone-800">
            Henüz Kayıtlı Bir Siparişiniz Bulunmuyor
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
            Ürün kataloğumuzdan temizlik kimyasalları veya züccaciye ürünlerini sepetinize ekleyerek ilk siparişinizi verebilirsiniz.
          </p>
          <Link href="/" className="mt-6 inline-block">
            <Button variant="primary" size="md">
              Kataloğu Aç
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const dateStr = new Date(order.created_at).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm transition-all hover:border-stone-300"
              >
                {/* Header Row */}
                <div
                  onClick={() => toggleExpand(order.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none bg-stone-50/50 hover:bg-stone-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-700 shadow-sm flex-shrink-0">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm">
                          Sipariş #{order.id}
                        </span>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {dateStr}
                        </span>
                        <span>•</span>
                        <span>{order.kalemler?.length || 0} Kalem</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                    <div className="text-right">
                      <div className="text-[11px] text-stone-400">Toplam Tutar</div>
                      <div className="text-base font-extrabold text-stone-900">
                        ₺{order.toplam_tutar.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
                      aria-label="Detayları Göster"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 border-t border-stone-100 bg-white space-y-4">
                    {order.siparis_notu && (
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs flex items-start gap-2 text-stone-700">
                        <FileText className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-stone-900">Sipariş Notunuz: </span>
                          <span>{order.siparis_notu}</span>
                        </div>
                      </div>
                    )}

                    {/* Items table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="border-b border-stone-200 text-stone-400 uppercase tracking-wider font-semibold">
                            <th className="py-2.5 px-2">Ürün</th>
                            <th className="py-2.5 px-2 text-center">Birim</th>
                            <th className="py-2.5 px-2 text-center">Adet</th>
                            <th className="py-2.5 px-2 text-right">Birim Fiyat</th>
                            <th className="py-2.5 px-2 text-right">Toplam</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {order.kalemler?.map((kalem) => (
                            <tr key={kalem.id} className="hover:bg-stone-50/50">
                              <td className="py-3 px-2">
                                <div className="font-bold text-stone-900">
                                  {kalem.urun?.ad || "Ürün #" + kalem.urun_id}
                                </div>
                                {kalem.not && (
                                  <div className="text-[11px] text-stone-500 italic mt-0.5">
                                    Not: {kalem.not}
                                  </div>
                                )}
                              </td>
                              <td className="py-3 px-2 text-center text-stone-600">
                                {kalem.urun?.birim || "Adet"}
                              </td>
                              <td className="py-3 px-2 text-center font-bold text-stone-800">
                                {kalem.adet}
                              </td>
                              <td className="py-3 px-2 text-right text-stone-600">
                                ₺{kalem.birim_fiyat.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                              </td>
                              <td className="py-3 px-2 text-right font-bold text-stone-900">
                                ₺{(kalem.adet * kalem.birim_fiyat).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
