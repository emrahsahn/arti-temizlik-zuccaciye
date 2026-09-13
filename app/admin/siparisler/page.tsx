"use client";

import React, { useState, useMemo } from "react";
import { DataService } from "@/lib/dataService";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { SiparisDurumu } from "@/lib/types";
import {
  ShoppingBag,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  User,
  PhoneCall,
  Filter,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const orders = useMemo(() => {
    void refreshKey;
    return DataService.getOrders();
  }, [refreshKey]);

  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  const handleStatusChange = (orderId: string, status: SiparisDurumu) => {
    DataService.updateOrderStatus(orderId, status);
    setRefreshKey((prev) => prev + 1);
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Sipariş Yönetimi
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Müşteri siparişlerini onaylayın, hazırlık durumunu güncelleyin ve tamamlayın.
          </p>
        </div>

        {/* Status filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-scroll bg-stone-100 p-1 rounded-xl w-full sm:w-auto">
          {[
            { id: "all", label: "Tümü" },
            { id: "beklemede", label: "Bekleyenler" },
            { id: "onaylandi", label: "Onaylananlar" },
            { id: "tamamlandi", label: "Tamamlananlar" },
            { id: "iptal", label: "İptal Edilenler" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 active:scale-95 ${
                statusFilter === f.id
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500">
          <ShoppingBag className="w-12 h-12 mx-auto text-stone-300 mb-3" />
          <h3 className="text-base font-bold text-stone-800">
            Seçilen Kriterde Sipariş Bulunamadı
          </h3>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
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
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:border-stone-300 transition-all"
              >
                {/* Header row */}
                <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-stone-50/40">
                  <div
                    onClick={() => toggleExpand(order.id)}
                    className="flex-1 flex items-start gap-4 cursor-pointer select-none"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-700 shadow-sm flex-shrink-0">
                      <ShoppingBag className="w-5 h-5 text-brand-red" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-stone-900 text-sm">
                          Sipariş #{order.id}
                        </span>
                        <OrderStatusBadge status={order.status} />
                      </div>

                      <div className="flex items-center gap-3 text-xs text-stone-500 mt-1 flex-wrap">
                        <span className="font-semibold text-stone-800 flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-stone-400" />
                          {order.musteri?.firma_adi || order.musteri?.ad_soyad || "Kayıtlı Bayi"}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {dateStr}
                        </span>
                        <span>•</span>
                        <span>{order.kalemler?.length || 0} Kalem</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div className="flex items-center justify-between lg:justify-end gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-200">
                    <div className="text-right">
                      <div className="text-[10px] text-stone-400 uppercase font-semibold">Tutar</div>
                      <div className="text-base font-extrabold text-stone-900">
                        ₺{order.toplam_tutar.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as SiparisDurumu)
                        }
                        className="text-xs font-semibold px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-red cursor-pointer"
                      >
                        <option value="beklemede">Durum: Beklemede</option>
                        <option value="onaylandi">Durum: Onaylandı</option>
                        <option value="tamamlandi">Durum: Tamamlandı</option>
                        <option value="iptal">Durum: İptal</option>
                      </select>

                      <button
                        onClick={() => toggleExpand(order.id)}
                        className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
                        aria-label="Detayları Aç/Kapat"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 border-t border-stone-100 bg-white space-y-4">
                    {/* Customer & Consultant details box */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-stone-50 text-xs">
                      <div>
                        <div className="font-bold text-stone-800 mb-1">Müşteri Detayları:</div>
                        <div className="text-stone-600">
                          {order.musteri?.ad_soyad} ({order.musteri?.telefon || "Tel yok"})
                        </div>
                        <div className="text-stone-500 mt-0.5">
                          {order.musteri?.adres || "Adres bilgisi yok"}
                        </div>
                      </div>

                      <div>
                        <div className="font-bold text-stone-800 mb-1">Sorumlu Danışman:</div>
                        <div className="text-stone-600 flex items-center gap-1">
                          <PhoneCall className="w-3.5 h-3.5 text-brand-blue" />
                          <span>
                            {order.danisman?.ad_soyad || "Atanmadı"} - {order.danisman?.telefon || "-"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {order.siparis_notu && (
                      <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs flex items-start gap-2 text-amber-900">
                        <FileText className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Müşteri Sipariş Notu: </span>
                          <span>{order.siparis_notu}</span>
                        </div>
                      </div>
                    )}

                    {/* Line items table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="border-b border-stone-200 text-stone-400 uppercase tracking-wider font-semibold">
                            <th className="py-2 px-2">Ürün Adı</th>
                            <th className="py-2 px-2 text-center">Birim</th>
                            <th className="py-2 px-2 text-center">Adet</th>
                            <th className="py-2 px-2 text-right">Birim Fiyat</th>
                            <th className="py-2 px-2 text-right">Kalem Toplamı</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {order.kalemler?.map((kalem) => (
                            <tr key={kalem.id}>
                              <td className="py-2.5 px-2">
                                <div className="font-bold text-stone-900">
                                  {kalem.urun?.ad || "Ürün #" + kalem.urun_id}
                                </div>
                                {kalem.not && (
                                  <div className="text-[11px] text-stone-500 italic mt-0.5">
                                    Özel Not: {kalem.not}
                                  </div>
                                )}
                              </td>
                              <td className="py-2.5 px-2 text-center text-stone-600">
                                {kalem.urun?.birim || "Adet"}
                              </td>
                              <td className="py-2.5 px-2 text-center font-bold text-stone-800">
                                {kalem.adet}
                              </td>
                              <td className="py-2.5 px-2 text-right text-stone-600">
                                ₺{kalem.birim_fiyat.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                              </td>
                              <td className="py-2.5 px-2 text-right font-bold text-stone-900">
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
