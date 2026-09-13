"use client";

import React from "react";
import { Urun } from "@/lib/types";
import { ProductMarquee } from "./ProductMarquee";
import { Flame } from "lucide-react";

interface BestsellersMarqueeProps {
  products: Urun[];
  onViewAll?: () => void;
  viewAllHref?: string;
}

export const BestsellersMarquee: React.FC<BestsellersMarqueeProps> = ({
  products,
  onViewAll,
  viewAllHref,
}) => {
  return (
    <ProductMarquee
      title="Çok Satan Ürünler"
      subtitle="Bölgedeki otel, restoran ve marketlerin en çok sipariş ettiği ürünler"
      badgeText="Otomatik & Kaydırılabilir"
      badgeColor="red"
      icon={<Flame className="w-5 h-5 text-brand-red animate-pulse" />}
      products={products}
      viewAllHref={viewAllHref}
      onViewAll={onViewAll}
      viewAllText="Tüm İçerikleri Göster"
    />
  );
};
