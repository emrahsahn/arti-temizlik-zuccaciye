"use client";

import React from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { CheckCircle2, PackageCheck, PhoneCall, ArrowRight } from "lucide-react";
import { Siparis } from "@/lib/types";

interface OrderSuccessModalProps {
  order: Siparis | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="text-center py-4">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h3 className="text-xl font-bold text-stone-900">
          Sipariş Talebiniz Alındı!
        </h3>
        <p className="text-xs text-stone-500 mt-1">
          Sipariş Numaranız:{" "}
          <span className="font-bold text-stone-800">#{order.id}</span>
        </p>

        {/* Order Brief Box */}
        <div className="mt-6 p-4 rounded-xl bg-stone-50 border border-stone-200 text-left text-xs space-y-2">
          <div className="flex justify-between text-stone-600">
            <span>Toplam Kalem:</span>
            <span className="font-bold text-stone-800">
              {order.kalemler?.length || 0} ürün
            </span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>Tahmini Tutar:</span>
            <span className="font-bold text-stone-900 text-sm">
              ₺{order.toplam_tutar.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
            </span>
          </div>
          {order.danisman && (
            <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-stone-600">
              <span>Sorumlu Danışman:</span>
              <span className="font-semibold text-brand-blue flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5" />
                {order.danisman.ad_soyad} ({order.danisman.telefon})
              </span>
            </div>
          )}
        </div>

        <p className="text-xs text-stone-500 mt-4 leading-relaxed">
          Talebiniz sorumlu satış danışmanımıza iletilmiştir. Ürün hazırlığı ve sevkiyat planlaması için kısa süre içerisinde sizinle iletişime geçilecektir.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Alışverişe Devam Et
          </Button>
          <Link href="/panel" className="flex-1" onClick={onClose}>
            <Button variant="primary" className="w-full flex items-center justify-center gap-1.5">
              <PackageCheck className="w-4 h-4" />
              <span>Siparişlerime Git</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Modal>
  );
};
