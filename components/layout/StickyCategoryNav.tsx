"use client";

import React, { useRef } from "react";
import { Kategori } from "@/lib/types";
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";

interface StickyCategoryNavProps {
  categories: Kategori[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
}

export const StickyCategoryNav: React.FC<StickyCategoryNavProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -240 : 240;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="sticky top-[86px] sm:top-[74px] md:top-[77px] z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 py-2 px-3 sm:px-4 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto flex items-center gap-2 relative">
        {/* Scroll Left Button */}
        <button
          onClick={() => handleScroll("left")}
          className="hidden md:flex p-1.5 rounded-xl border border-stone-200 bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 shadow-sm active:scale-95"
          aria-label="Sola Kaydır"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Categories Horizontal Scroll */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar touch-scroll py-0.5 flex-1"
        >
          {/* All Categories Pill */}
          <button
            onClick={(e) => {
              onSelectCategory(null);
              (e.currentTarget as HTMLElement).scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
            }}
            className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-95 ${
              selectedCategoryId === null
                ? "bg-brand-red text-white shadow-sm shadow-rose-200"
                : "bg-stone-100 text-stone-700 hover:bg-stone-200"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Tüm Ürünler</span>
          </button>

          {/* Individual Category Pills */}
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={(e) => {
                  onSelectCategory(cat.id);
                  (e.currentTarget as HTMLElement).scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                }}
                className={`flex-shrink-0 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all active:scale-95 whitespace-nowrap ${
                  isSelected
                    ? "bg-brand-blue text-white font-semibold shadow-sm shadow-sky-200"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                {cat.ad}
              </button>
            );
          })}
        </div>

        {/* Scroll Right Button */}
        <button
          onClick={() => handleScroll("right")}
          className="hidden md:flex p-1.5 rounded-xl border border-stone-200 bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 shadow-sm active:scale-95"
          aria-label="Sağa Kaydır"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
