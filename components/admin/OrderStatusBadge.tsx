import React from "react";
import { SiparisDurumu } from "@/lib/types";
import { Clock, CheckCircle2, CheckCheck, XCircle } from "lucide-react";

interface OrderStatusBadgeProps {
  status: SiparisDurumu;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case "beklemede":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />
          Beklemede
        </span>
      );
    case "onaylandi":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
          Onaylandı / Hazırlanıyor
        </span>
      );
    case "tamamlandi":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
          Tamamlandı / Teslim Edildi
        </span>
      );
    case "iptal":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          İptal Edildi
        </span>
      );
    default:
      return null;
  }
};
