"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MusteriMemnuniyeti } from "@/lib/types";
import {
  HeartHandshake,
  Play,
  Image as ImageIcon,
  Video,
  MapPin,
  Calendar,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface CustomerReviewsSectionProps {
  reviews: MusteriMemnuniyeti[];
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  viewAllHref?: string;
}

export const CustomerReviewsSection: React.FC<CustomerReviewsSectionProps> = ({
  reviews,
  title = "Müşteri Memnuniyeti & Teslimat Hikayeleri",
  subtitle = "Anamur, Bozyazı ve Aydıncık'taki işletmelere ve hanelere gerçekleştirdiğimiz sevkiyatlar ve müşteri deneyimleri",
  showViewAll = true,
  viewAllHref = "/musteri-memnuniyeti",
}) => {
  const [activeType, setActiveType] = useState<"all" | "fotograf" | "video">("all");
  const [selectedMedia, setSelectedMedia] = useState<MusteriMemnuniyeti | null>(null);

  const filtered = reviews.filter((r) => {
    if (activeType === "all") return true;
    return r.tip === activeType;
  });

  const getYouTubeEmbedUrl = (url: string) => {
    try {
      if (url.includes("youtu.be/")) {
        const id = url.split("youtu.be/")[1].split("?")[0];
        return `https://www.youtube.com/embed/${id}?autoplay=1`;
      }
      if (url.includes("youtube.com/watch")) {
        const params = new URL(url).searchParams;
        const v = params.get("v");
        return `https://www.youtube.com/embed/${v}?autoplay=1`;
      }
      if (url.includes("youtube.com/shorts/")) {
        const id = url.split("youtube.com/shorts/")[1].split("?")[0];
        return `https://www.youtube.com/embed/${id}?autoplay=1`;
      }
    } catch {
      // fallback
    }
    return url;
  };

  return (
    <section className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-8 shadow-sm my-6 overflow-hidden">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-6 border-b border-stone-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-brand-red text-xs font-bold uppercase tracking-wider mb-2">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>GÜVEN &amp; MEMNUNİYET</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter pills */}
          <div className="inline-flex bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveType("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeType === "all"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Tümü ({reviews.length})
            </button>
            <button
              onClick={() => setActiveType("fotograf")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeType === "fotograf"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
              <span>Fotoğraflar</span>
            </button>
            <button
              onClick={() => setActiveType("video")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeType === "video"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Video className="w-3.5 h-3.5 text-brand-red" />
              <span>Videolar</span>
            </button>
          </div>

          {showViewAll && viewAllHref && (
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-red hover:text-brand-redDark px-3 py-1.5 rounded-xl hover:bg-rose-50 transition-colors ml-auto sm:ml-0"
            >
              <span>Tümünü Gör</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Media Cards Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center text-stone-400 bg-stone-50 rounded-2xl border border-stone-200/60">
          <HeartHandshake className="w-12 h-12 mx-auto text-stone-300 mb-2" />
          <p className="text-sm font-bold text-stone-600">Bu kategoride henüz içerik bulunmamaktadır.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => {
            const isVideo = item.tip === "video";
            const thumbnail = item.kapak_url || item.medya_url;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedMedia(item)}
                className="group cursor-pointer bg-stone-50/60 hover:bg-white rounded-2xl border border-stone-200/80 hover:border-stone-300 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Media Visual Aspect Box */}
                  <div className="relative w-full aspect-video bg-stone-900 overflow-hidden">
                    {thumbnail ? (
                      <Image
                        src={thumbnail}
                        alt={item.baslik}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400">
                        <Video className="w-10 h-10 text-brand-red" />
                      </div>
                    )}

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    {/* Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase bg-stone-900/80 backdrop-blur-md text-white border border-white/10 shadow-sm">
                        {isVideo ? (
                          <>
                            <Video className="w-3.5 h-3.5 text-brand-red" />
                            <span>Video</span>
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                            <span>Fotoğraf</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Play icon overlay for videos */}
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-brand-red/90 group-hover:bg-brand-red text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 space-y-2.5">
                    {/* Date / Metadata */}
                    {item.tarih && (
                      <div className="flex items-center gap-1 text-[11px] text-stone-400 font-medium">
                        <Calendar className="w-3 h-3" />
                        <span>{item.tarih}</span>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-brand-red transition-colors">
                      {item.baslik}
                    </h3>

                    {/* Customer quote if available */}
                    {item.yorum && (
                      <p className="text-xs text-stone-600 italic line-clamp-2 leading-relaxed bg-white/80 p-2 rounded-xl border border-stone-100">
                        &quot;{item.yorum}&quot;
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer / Customer Info */}
                <div className="px-4 sm:px-5 py-3 bg-stone-100/70 border-t border-stone-200/60 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-stone-800 truncate flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-brand-blue shrink-0" />
                      <span className="truncate">{item.musteri_adi}</span>
                    </div>
                    {item.firma_veya_bolge && (
                      <div className="text-[11px] text-stone-500 truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-brand-red shrink-0" />
                        <span className="truncate">{item.firma_veya_bolge}</span>
                      </div>
                    )}
                  </div>

                  <span className="text-[11px] font-bold text-brand-blue group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 shrink-0">
                    <span>Aç</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox / Video Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-md animate-fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setSelectedMedia(null)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between gap-3 bg-stone-50/80">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-red text-white">
                    {selectedMedia.tip === "video" ? "Video Klip" : "Fotoğraf Galerisi"}
                  </span>
                  {selectedMedia.firma_veya_bolge && (
                    <span className="text-xs text-stone-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-brand-red" />
                      <span>{selectedMedia.firma_veya_bolge}</span>
                    </span>
                  )}
                </div>
                <h3 className="font-extrabold text-stone-900 text-base sm:text-lg leading-snug truncate">
                  {selectedMedia.baslik}
                </h3>
              </div>

              <button
                onClick={() => setSelectedMedia(null)}
                className="p-2 text-stone-400 hover:text-stone-800 rounded-xl hover:bg-stone-200/70 transition-colors"
                aria-label="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Media Body */}
            <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
              {selectedMedia.tip === "video" ? (
                selectedMedia.medya_url.includes("youtube.com") ||
                selectedMedia.medya_url.includes("youtu.be") ? (
                  <iframe
                    src={getYouTubeEmbedUrl(selectedMedia.medya_url)}
                    title={selectedMedia.baslik}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={selectedMedia.medya_url}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                )
              ) : (
                <Image
                  src={selectedMedia.medya_url}
                  alt={selectedMedia.baslik}
                  fill
                  className="object-contain"
                  unoptimized
                />
              )}
            </div>

            {/* Modal Footer / Review Text */}
            <div className="p-4 sm:p-6 bg-white space-y-3 overflow-y-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-red/10 text-brand-red font-extrabold flex items-center justify-center text-xs">
                    {selectedMedia.musteri_adi.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">
                      {selectedMedia.musteri_adi}
                    </div>
                    <div className="text-[11px] text-stone-400">
                      {selectedMedia.firma_veya_bolge || "Anamur Bölgesi"}
                    </div>
                  </div>
                </div>

                {selectedMedia.tarih && (
                  <span className="text-xs text-stone-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{selectedMedia.tarih}</span>
                  </span>
                )}
              </div>

              {selectedMedia.yorum && (
                <div className="p-3.5 bg-rose-50/50 rounded-2xl border border-rose-100 text-stone-700 text-xs sm:text-sm leading-relaxed italic">
                  &quot;{selectedMedia.yorum}&quot;
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
