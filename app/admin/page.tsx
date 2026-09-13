"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { DataService } from "@/lib/dataService";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { SiparisDurumu } from "@/lib/types";
import {
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const orders = useMemo(() => {
    void refreshKey;
    return DataService.getOrders();
  }, [refreshKey]);
  const products = useMemo(() => {
    void refreshKey;
    return DataService.getProducts();
  }, [refreshKey]);
  const profiles = useMemo(() => {
    void refreshKey;
    return DataService.getProfiles();
  }, [refreshKey]);

  const pendingOrders = orders.filter((o) => o.status === "beklemede");
  const totalRevenue = orders
    .filter((o) => o.status !== "iptal")
    .reduce((sum, o) => sum + o.toplam_tutar, 0);

  const handleStatusChange = (orderId: string, newStatus: SiparisDurumu) => {
    DataService.updateOrderStatus(orderId, newStatus);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
          Yönetim Genel Bakış
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Artı Temizlik Züccaciye işletme sipariş ve ürün gösterge paneli
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Revenue */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">
              Toplam Sipariş Hacmi
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-stone-900">
            ₺{totalRevenue.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-[11px] text-stone-400">
            {orders.length} toplam sipariş
          </div>
        </div>

        {/* Card 2: Pending orders */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">
              Bekleyen Siparişler
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-amber-700">
            {pendingOrders.length}
          </div>
          <div className="mt-1 text-[11px] text-stone-400">
            İşlem bekleyen talep
          </div>
        </div>

        {/* Card 3: Products */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">
              Aktif Ürünler
            </span>
            <div className="p-2 rounded-xl bg-sky-50 text-brand-blue">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-stone-900">
            {products.length}
          </div>
          <div className="mt-1 text-[11px] text-stone-400">
            Toptan ve perakende katalog
          </div>
        </div>

        {/* Card 4: Customers */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">
              Kayıtlı Bayi & Müşteriler
            </span>
            <div className="p-2 rounded-xl bg-rose-50 text-brand-red">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-stone-900">
            {profiles.filter((p) => p.role === "musteri").length}
          </div>
          <div className="mt-1 text-[11px] text-stone-400">
            Yetkili müşteri hesabı
          </div>
        </div>
      </div>

      {/* Pending Orders Section */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Son Gelen Sipariş Talepleri</span>
            </h2>
            <p className="text-xs text-stone-500">
              Müşterilerin gönderdiği yeni siparişler
            </p>
          </div>
          <Link
            href="/admin/siparisler"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-red hover:underline"
          >
            <span>Tüm Siparişleri Gör</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/50 text-stone-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Sipariş No</th>
                <th className="py-3 px-4">Müşteri / Firma</th>
                <th className="py-3 px-4">Sorumlu Danışman</th>
                <th className="py-3 px-4">Tutar</th>
                <th className="py-3 px-4">Durum</th>
                <th className="py-3 px-4 text-right">Hızlı İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-stone-50/50">
                  <td className="py-3.5 px-4 font-bold text-stone-900">
                    #{order.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-stone-900">
                      {order.musteri?.firma_adi || order.musteri?.ad_soyad || "Kayıtlı Bayi"}
                    </div>
                    <div className="text-[11px] text-stone-400">
                      @{order.musteri?.username || "musteri"}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-stone-600">
                    {order.danisman?.ad_soyad || "Atanmadı"}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-stone-900">
                    ₺{order.toplam_tutar.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {order.status === "beklemede" ? (
                      <button
                        onClick={() => handleStatusChange(order.id, "onaylandi")}
                        className="px-2.5 py-1 bg-sky-50 text-brand-blue hover:bg-brand-blue hover:text-white rounded-lg font-semibold transition-colors"
                      >
                        Onayla
                      </button>
                    ) : order.status === "onaylandi" ? (
                      <button
                        onClick={() => handleStatusChange(order.id, "tamamlandi")}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg font-semibold transition-colors"
                      >
                        Tamamla
                      </button>
                    ) : (
                      <span className="text-stone-400 text-[11px]">İşlem Yok</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
