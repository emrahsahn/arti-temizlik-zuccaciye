"use client";

import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { Urun } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export interface ProductMarqueeProps {
  title: string;
  subtitle?: string;
  badgeText?: string;
  badgeColor?: "red" | "blue" | "emerald" | "amber" | "stone";
  icon?: React.ReactNode;
  products: Urun[];
  viewAllHref?: string;
  onViewAll?: () => void;
  viewAllText?: string;
  className?: string;
}

export const ProductMarquee: React.FC<ProductMarqueeProps> = ({
  title,
  subtitle,
  badgeText,
  badgeColor = "red",
  icon,
  products,
  viewAllHref,
  onViewAll,
  viewAllText = "Tüm İçerikleri Göster",
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const hasMovedRef = useRef(false);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Repeat items sufficiently to ensure a seamless infinite scroll even with small product counts
  const marqueeItems = useMemo(() => {
    if (!products || products.length === 0) return [];
    const minTargetItems = 12;
    const repeatCount = Math.max(3, Math.ceil(minTargetItems / products.length));
    const items: { item: Urun; uniqueKey: string }[] = [];
    for (let r = 0; r < repeatCount; r++) {
      products.forEach((p, idx) => {
        items.push({ item: p, uniqueKey: `${p.id}-${r}-${idx}` });
      });
    }
    return items;
  }, [products]);

  // Pause auto-scroll briefly after manual interaction
  const pauseAutoScrollTemporarily = useCallback((durationMs = 3500) => {
    setIsPaused(true);
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, durationMs);
  }, []);

  // Initial scroll position to the middle third so user can scroll backward immediately
  useEffect(() => {
    const el = containerRef.current;
    if (!el || products.length === 0) return;

    const timer = setTimeout(() => {
      const singleSetWidth = el.scrollWidth / 3;
      if (el.scrollLeft === 0) {
        el.scrollLeft = singleSetWidth;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [products]);

  // Infinite wrap-around check
  const handleInfiniteWrap = useCallback(() => {
    const el = containerRef.current;
    if (!el || products.length === 0) return;

    const singleSetWidth = el.scrollWidth / 3;

    // Scrolled past the 2nd set -> jump back to middle
    if (el.scrollLeft >= singleSetWidth * 2) {
      el.scrollLeft -= singleSetWidth;
    }
    // Scrolled back before the 1st set -> jump forward to middle
    else if (el.scrollLeft <= 5) {
      el.scrollLeft += singleSetWidth;
    }
  }, [products.length]);

  // Smooth continuous auto-scroll loop
  useEffect(() => {
    const el = containerRef.current;
    if (!el || products.length === 0) return;

    const step = () => {
      if (!isPaused && !isDragging) {
        el.scrollLeft += 0.75; // Smooth crawl speed
        handleInfiniteWrap();
      }
      animationFrameRef.current = requestAnimationFrame(step);
    };

    animationFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPaused, isDragging, handleInfiniteWrap, products.length]);

  // Manual Arrow Scroll
  const scrollManual = (direction: "left" | "right") => {
    const el = containerRef.current;
    if (!el) return;

    pauseAutoScrollTemporarily(4000);
    const scrollAmount = direction === "left" ? -300 : 300;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });

    setTimeout(handleInfiniteWrap, 400);
  };

  // Mouse Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;

    setIsDragging(true);
    hasMovedRef.current = false;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftStartRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const el = containerRef.current;
    if (!el) return;

    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.3;
    if (Math.abs(walk) > 4) {
      hasMovedRef.current = true;
    }
    el.scrollLeft = scrollLeftStartRef.current - walk;
    handleInfiniteWrap();
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      pauseAutoScrollTemporarily(3000);
    }
  };

  if (!products || products.length === 0) return null;

  const badgeColorClasses = {
    red: "bg-rose-50 text-brand-red border-rose-200",
    blue: "bg-sky-50 text-brand-blue border-sky-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    stone: "bg-stone-100 text-stone-700 border-stone-200",
  }[badgeColor];

  return (
    <section className={`my-8 sm:my-10 overflow-hidden select-none ${className}`}>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5 px-1">
        {/* Left: Title & Badge */}
        <div className="flex items-center gap-3">
          {icon && (
            <div className="p-2.5 rounded-2xl bg-white border border-stone-200/90 shadow-sm flex-shrink-0">
              {icon}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 tracking-tight">
                {title}
              </h2>
              {badgeText && (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-xs ${badgeColorClasses}`}
                >
                  {badgeText}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right Controls: View All Button + Arrow Navigators */}
        <div className="flex items-center justify-between sm:justify-end gap-2 self-stretch sm:self-auto pt-1 sm:pt-0">
          {/* View All Button */}
          {viewAllHref ? (
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-stone-950 hover:bg-stone-50 hover:border-stone-300 text-xs font-bold shadow-sm transition-all active:scale-95 group"
            >
              <span>{viewAllText}</span>
              <ArrowRight className="w-3.5 h-3.5 text-brand-red group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : onViewAll ? (
            <button
              type="button"
              onClick={onViewAll}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-stone-950 hover:bg-stone-50 hover:border-stone-300 text-xs font-bold shadow-sm transition-all active:scale-95 group"
            >
              <span>{viewAllText}</span>
              <ArrowRight className="w-3.5 h-3.5 text-brand-red group-hover:translate-x-0.5 transition-transform" />
            </button>
          ) : null}

          {/* Arrow Buttons Group */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scrollManual("left")}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-stone-950 hover:bg-stone-50 shadow-sm transition-transform active:scale-95"
              aria-label="Önceki Ürünler"
              title="Geriye Doğru Kaydır"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              type="button"
              onClick={() => scrollManual("right")}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-stone-950 hover:bg-stone-50 shadow-sm transition-transform active:scale-95"
              aria-label="Sonraki Ürünler"
              title="İleriye Doğru Kaydır"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Slider Track with Edge Gradient Masks */}
      <div
        className="relative w-full overflow-hidden py-1"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          if (!isDragging) setIsPaused(false);
          handleMouseUp();
        }}
      >
        {/* Left Gradient Fade */}
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#FAFAF9] to-transparent z-10"
          aria-hidden="true"
        />

        {/* Right Gradient Fade */}
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#FAFAF9] to-transparent z-10"
          aria-hidden="true"
        />

        {/* Scrollable Track */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onScroll={handleInfiniteWrap}
          className={`flex gap-3 sm:gap-6 overflow-x-auto no-scrollbar touch-scroll py-3 px-2 ${
            isDragging ? "cursor-grabbing scroll-auto" : "cursor-grab"
          }`}
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {marqueeItems.map(({ item: prod, uniqueKey }) => (
            <div
              key={uniqueKey}
              className="w-[200px] xs:w-[230px] sm:w-[260px] md:w-[275px] flex-shrink-0"
              onClickCapture={(e) => {
                // Prevent accidental card navigation if user was dragging
                if (hasMovedRef.current) {
                  e.stopPropagation();
                  e.preventDefault();
                }
              }}
            >
              <ProductCard
                product={prod}
                className="w-full shadow-sm hover:shadow-xl transition-all"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
