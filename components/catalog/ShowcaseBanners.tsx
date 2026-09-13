"use client";

import React from "react";
import Link from "next/link";
import { Kampanya } from "@/lib/types";
import { ArrowRight, Sparkles, Truck, Award } from "lucide-react";

interface ShowcaseBannersProps {
  campaigns: Kampanya[];
}

export const ShowcaseBanners: React.FC<ShowcaseBannersProps> = ({ campaigns }) => {
  const icons = [Sparkles, Award, Truck];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 my-6">
      {campaigns.map((camp, idx) => {
        const IconComponent = icons[idx % icons.length];
        const productCount = camp.urun_ids?.length || 0;
        const targetHref = camp.cta_link || `/kampanya/${camp.id}`;

        return (
          <Link
            key={camp.id}
            href={targetHref}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-900 to-stone-800 text-white p-5 sm:p-7 flex flex-col justify-between shadow-md transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            {/* Background decoration */}
            <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/5 blur-2xl group-hover:bg-brand-red/20 transition-all" />

            <div>
              {/* Badge & Product Count */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-md text-[10px] sm:text-xs font-bold tracking-wider text-stone-200 border border-white/10">
                  <IconComponent className="w-3.5 h-3.5 text-brand-red" />
                  <span>{camp.badge_text || "ÖZEL FIRSAT"}</span>
                </span>

                {productCount > 0 && (
                  <span className="text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-md">
                    {productCount} Özel Ürün
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-base sm:text-xl font-bold text-white tracking-tight leading-snug">
                {camp.baslik}
              </h2>

              {/* Description */}
              <p className="mt-2 text-xs sm:text-sm text-stone-300 line-clamp-2">
                {camp.aciklama}
              </p>
            </div>

            {/* CTA */}
            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white group-hover:text-rose-400 transition-colors">
                <span>{camp.cta_text || "Kampanyayı İncele"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
