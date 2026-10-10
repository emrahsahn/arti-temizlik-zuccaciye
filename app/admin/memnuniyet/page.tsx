"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { DataService } from "@/lib/dataService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { MusteriMemnuniyeti } from "@/lib/types";
import {
  HeartHandshake,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  Upload,
  Link2,
  Play,
  Search,
  MapPin,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function AdminCustomerReviewsPage() {
  const [reviews, setReviews] = useState<MusteriMemnuniyeti[]>(() =>
    DataService.getReviews(true)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "fotograf" | "video">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<MusteriMemnuniyeti | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    baslik: string;
    musteri_adi: string;
    firma_veya_bolge: string;
    tip: "fotograf" | "video";
    medya_url: string;
    kapak_url: string;
    yorum: string;
    yildiz: number;
    sira: number;
    aktif: boolean;
    tarih: string;
  }>({
    baslik: "",
    musteri_adi: "",
    firma_veya_bolge: "",
    tip: "fotograf",
    medya_url: "",
    kapak_url: "",
    yorum: "",
    yildiz: 5,
    sira: 1,
    aktif: true,
    tarih: new Date().toISOString().split("T")[0],
  });

  // Sync on mount and events
  useEffect(() => {
    const syncData = () => {
      setReviews(DataService.getReviews(true));
    };
    syncData();

    window.addEventListener("arti_reviews_updated", syncData);
    window.addEventListener("storage", syncData);

    return () => {
      window.removeEventListener("arti_reviews_updated", syncData);
      window.removeEventListener("storage", syncData);
    };
  }, []);

  const notifySuccess = (msg: string) => {
    setSuccessMessage(msg);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleOpenAddModal = () => {
    setEditingReview(null);
    setFormData({
      baslik: "",
      musteri_adi: "",
      firma_veya_bolge: "",
      tip: "fotograf",
      medya_url: "",
      kapak_url: "",
      yorum: "",
      yildiz: 5,
      sira: reviews.length + 1,
      aktif: true,
      tarih: new Date().toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (review: MusteriMemnuniyeti) => {
    setEditingReview(review);
    setFormData({
      baslik: review.baslik,
      musteri_adi: review.musteri_adi,
      firma_veya_bolge: review.firma_veya_bolge || "",
      tip: review.tip,
      medya_url: review.medya_url,
      kapak_url: review.kapak_url || "",
      yorum: review.yorum || "",
      yildiz: review.yildiz || 5,
      sira: review.sira || 1,
      aktif: review.aktif !== false,
      tarih: review.tarih || new Date().toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    DataService.toggleReviewActive(id);
    setReviews(DataService.getReviews(true));
    notifySuccess("Görünürlük durumu güncellendi.");
  };

  const handleDeleteReview = (id: string, baslik: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`"${baslik}" müşteri memnuniyet paylaşımını silmek istediğinize emin misiniz?`)) {
      DataService.deleteReview(id);
      setReviews(DataService.getReviews(true));
      notifySuccess("Paylaşım silindi.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (< 8MB for base64 safety in browser localStorage)
    if (file.size > 8 * 1024 * 1024) {
      alert("Lütfen 8MB'dan küçük bir dosya seçiniz.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFormData((prev) => ({
          ...prev,
          medya_url: reader.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Lütfen 5MB'dan küçük bir kapak görseli seçiniz.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFormData((prev) => ({
          ...prev,
          kapak_url: reader.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.baslik.trim() || !formData.musteri_adi.trim() || !formData.medya_url.trim()) {
      alert("Lütfen başlık, müşteri adı ve medya URL / dosyasını eksiksiz giriniz.");
      return;
    }

    if (editingReview) {
      DataService.updateReview(editingReview.id, {
        baslik: formData.baslik.trim(),
        musteri_adi: formData.musteri_adi.trim(),
        firma_veya_bolge: formData.firma_veya_bolge.trim(),
        tip: formData.tip,
        medya_url: formData.medya_url.trim(),
        kapak_url: formData.kapak_url.trim() || undefined,
        yorum: formData.yorum.trim() || undefined,
        yildiz: Number(formData.yildiz) || 5,
        sira: Number(formData.sira) || 1,
        aktif: formData.aktif,
        tarih: formData.tarih || new Date().toISOString().split("T")[0],
      });
      notifySuccess("Müşteri memnuniyet kaydı başarıyla güncellendi.");
    } else {
      DataService.createReview({
        baslik: formData.baslik.trim(),
        musteri_adi: formData.musteri_adi.trim(),
        firma_veya_bolge: formData.firma_veya_bolge.trim(),
        tip: formData.tip,
        medya_url: formData.medya_url.trim(),
        kapak_url: formData.kapak_url.trim() || undefined,
        yorum: formData.yorum.trim() || undefined,
        yildiz: Number(formData.yildiz) || 5,
        sira: Number(formData.sira) || reviews.length + 1,
        aktif: formData.aktif,
        tarih: formData.tarih || new Date().toISOString().split("T")[0],
      });
      notifySuccess("Yeni müşteri memnuniyet kaydı başarıyla eklendi.");
    }

    setReviews(DataService.getReviews(true));
    setIsModalOpen(false);
  };

  // Filtered Reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchesSearch =
        !searchQuery ||
        r.baslik.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.musteri_adi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.firma_veya_bolge && r.firma_veya_bolge.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.yorum && r.yorum.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = typeFilter === "all" || r.tip === typeFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && r.aktif !== false) ||
        (statusFilter === "inactive" && r.aktif === false);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [reviews, searchQuery, typeFilter, statusFilter]);

  // Statistics
  const totalCount = reviews.length;
  const activeCount = reviews.filter((r) => r.aktif !== false).length;
  const videoCount = reviews.filter((r) => r.tip === "video").length;
  const photoCount = reviews.filter((r) => r.tip === "fotograf").length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2.5">
            <HeartHandshake className="w-7 h-7 text-brand-red" />
            <span>Müşteri Memnuniyeti & Teslimat Medyaları</span>
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Sevkiyat, teslimat anı ve müşteri deneyimlerini yansıtan fotoğraf ve videoları yönetin; kamu vitrininde yayınlayın.
          </p>
        </div>

        <Button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-redDark text-white shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Medya & Memnuniyet Ekle</span>
        </Button>
      </div>

      {/* Success Notification */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2.5 shadow-sm animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
          <div className="text-stone-400 text-xs font-bold uppercase tracking-wider">Toplam Gönderi</div>
          <div className="text-2xl font-extrabold text-stone-900 mt-1">{totalCount}</div>
          <div className="text-[11px] text-stone-500 mt-0.5">Kayıtlı medya içeriği</div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
          <div className="text-emerald-600 text-xs font-bold uppercase tracking-wider">Yayında Olanlar</div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">{activeCount}</div>
          <div className="text-[11px] text-stone-500 mt-0.5">Vitrinde aktif gösterilen</div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
          <div className="text-brand-blue text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5" />
            <span>Videolar</span>
          </div>
          <div className="text-2xl font-extrabold text-brand-blue mt-1">{videoCount}</div>
          <div className="text-[11px] text-stone-500 mt-0.5">Teslimat & tanıtım klibi</div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
          <div className="text-amber-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Fotoğraflar</span>
          </div>
          <div className="text-2xl font-extrabold text-amber-700 mt-1">{photoCount}</div>
          <div className="text-[11px] text-stone-500 mt-0.5">Sevkiyat ve ürün kareleri</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Başlık, müşteri veya bölge ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-stone-50 rounded-xl text-xs sm:text-sm border border-stone-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <div className="inline-flex bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setTypeFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                typeFilter === "all" ? "bg-white text-stone-900 shadow-sm" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setTypeFilter("fotograf")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                typeFilter === "fotograf" ? "bg-white text-stone-900 shadow-sm" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Fotoğraf</span>
            </button>
            <button
              onClick={() => setTypeFilter("video")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                typeFilter === "video" ? "bg-white text-stone-900 shadow-sm" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video</span>
            </button>
          </div>

          {/* Status Filter */}
          <div className="inline-flex bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === "all" ? "bg-white text-stone-900 shadow-sm" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Tüm Durumlar
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all text-emerald-700 ${
                statusFilter === "active" ? "bg-white shadow-sm font-extrabold" : "hover:text-emerald-900"
              }`}
            >
              Yayında
            </button>
            <button
              onClick={() => setStatusFilter("inactive")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all text-stone-600 ${
                statusFilter === "inactive" ? "bg-white shadow-sm font-extrabold" : "hover:text-stone-900"
              }`}
            >
              Gizli
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Reviews */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500">
          <HeartHandshake className="w-12 h-12 mx-auto text-stone-300 mb-3" />
          <h3 className="text-base font-bold text-stone-800">Müşteri Memnuniyeti Kaydı Bulunamadı</h3>
          <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
            {searchQuery || typeFilter !== "all" || statusFilter !== "all"
              ? "Arama ve filtre kriterlerinize uygun kayıt yok."
              : "Henüz fotoğraf veya video memnuniyet kaydı eklenmemiş."}
          </p>
          <Button onClick={handleOpenAddModal} className="mt-5 bg-brand-red hover:bg-brand-redDark text-white gap-1.5">
            <Plus className="w-4 h-4" />
            <span>İlk Memnuniyet Kaydını Ekle</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((r) => {
            const isVideo = r.tip === "video";
            const isYouTube = isVideo && (r.medya_url.includes("youtube.com") || r.medya_url.includes("youtu.be"));
            const displayCover = r.kapak_url || (isVideo ? "/logo.png" : r.medya_url);

            return (
              <div
                key={r.id}
                className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between shadow-sm overflow-hidden ${
                  r.aktif ? "border-stone-200/90 hover:border-stone-300 hover:shadow-md" : "border-stone-200/50 bg-stone-50/40 opacity-70"
                }`}
              >
                <div>
                  {/* Media Visual Preview Header */}
                  <div className="relative w-full aspect-video bg-stone-900 overflow-hidden flex items-center justify-center">
                    {r.medya_url && !isVideo ? (
                      <Image
                        src={r.medya_url}
                        alt={r.baslik}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    ) : r.kapak_url ? (
                      <Image
                        src={r.kapak_url}
                        alt={r.baslik}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-stone-400 gap-2 p-4 text-center">
                        <Video className="w-8 h-8 text-brand-red animate-pulse" />
                        <span className="text-[11px] font-semibold text-stone-300 line-clamp-1">
                          {isYouTube ? "YouTube Video Yayını" : "Doğrudan Video Medyası"}
                        </span>
                      </div>
                    )}

                    {/* Media Type Badge */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-stone-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-white/10">
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
                    </div>

                    {/* Active/Inactive Badge */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleActive(r.id, e)}
                      className={`absolute top-3 right-3 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md transition-all shadow-md ${
                        r.aktif
                          ? "bg-emerald-500/90 text-white hover:bg-emerald-600"
                          : "bg-stone-800/90 text-stone-300 hover:bg-stone-900"
                      }`}
                    >
                      {r.aktif ? (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Yayında</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Gizli</span>
                        </>
                      )}
                    </button>

                    {/* Video Play Overlay for Video types */}
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-stone-950/30">
                        <div className="w-12 h-12 rounded-full bg-brand-red/90 text-white flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content Info */}
                  <div className="p-5 space-y-3">
                    {/* Date */}
                    {r.tarih && (
                      <div className="flex items-center justify-end text-[11px] text-stone-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{r.tarih}</span>
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="font-extrabold text-stone-900 text-base leading-snug line-clamp-2">
                      {r.baslik}
                    </h3>

                    {/* Customer & Location */}
                    <div className="bg-stone-50 border border-stone-100 rounded-xl p-3 text-xs space-y-1">
                      <div className="font-bold text-stone-800 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-brand-blue" />
                        <span>{r.musteri_adi}</span>
                      </div>
                      {r.firma_veya_bolge && (
                        <div className="text-stone-500 text-[11px] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-brand-red shrink-0" />
                          <span className="truncate">{r.firma_veya_bolge}</span>
                        </div>
                      )}
                    </div>

                    {/* Review Quote */}
                    {r.yorum && (
                      <p className="text-xs text-stone-600 italic bg-rose-50/40 p-3 rounded-xl border border-rose-100/60 line-clamp-3 leading-relaxed">
                        &quot;{r.yorum}&quot;
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Controls */}
                <div className="px-5 py-3.5 bg-stone-50/90 border-t border-stone-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-stone-400 font-semibold">Sıra: #{r.sira}</span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(r)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 text-xs font-bold shadow-sm hover:bg-stone-100 hover:text-stone-950 transition-colors active:scale-95"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-stone-500" />
                      <span>Düzenle</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleDeleteReview(r.id, r.baslik, e)}
                      className="p-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors active:scale-95"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingReview ? "Müşteri Memnuniyeti Kaydını Düzenle" : "Yeni Müşteri Memnuniyeti & Medya Ekle"}
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Media Type Switcher */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, tip: "fotograf" })}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                formData.tip === "fotograf"
                  ? "bg-amber-50 border-amber-400 text-amber-900 shadow-sm"
                  : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
              }`}
            >
              <ImageIcon className="w-4 h-4 text-amber-600" />
              <span>Fotoğraf Paylaşımı</span>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, tip: "video" })}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                formData.tip === "video"
                  ? "bg-rose-50 border-brand-red text-brand-red shadow-sm"
                  : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
              }`}
            >
              <Video className="w-4 h-4 text-brand-red" />
              <span>Video Klip Paylaşımı</span>
            </button>
          </div>

          {/* Media URL / File Upload Section */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Link2 className="w-4 h-4 text-brand-red" />
                <span>{formData.tip === "fotograf" ? "Fotoğraf Medyası *" : "Video Medyası (URL / Dosya) *"}</span>
              </label>
              <span className="text-[10px] text-stone-400">YouTube, Doğrudan Link veya Dosya Yükle</span>
            </div>

            <div className="space-y-2">
              <Input
                type="text"
                value={formData.medya_url}
                onChange={(e) => setFormData({ ...formData, medya_url: e.target.value })}
                placeholder={
                  formData.tip === "fotograf"
                    ? "https://images.unsplash.com/... veya dosya yükleyin"
                    : "https://www.youtube.com/watch?v=... veya MP4 linki"
                }
                required
              />

              {/* File upload alternative */}
              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-100 transition-colors shadow-sm">
                  <Upload className="w-3.5 h-3.5 text-stone-500" />
                  <span>Cihazdan Dosya Seç</span>
                  <input
                    type="file"
                    accept={formData.tip === "fotograf" ? "image/*" : "video/*,image/*"}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {formData.medya_url && formData.medya_url.startsWith("data:") && (
                  <span className="text-[11px] text-emerald-600 font-bold">✓ Dosya seçildi</span>
                )}
              </div>
            </div>

            {/* Video Cover (Optional) */}
            {formData.tip === "video" && (
              <div className="pt-3 border-t border-stone-200/70 space-y-2">
                <label className="block text-xs font-bold text-stone-700">
                  Video Kapak Görseli (Opsiyonel Thumbnail)
                </label>
                <Input
                  type="text"
                  value={formData.kapak_url}
                  onChange={(e) => setFormData({ ...formData, kapak_url: e.target.value })}
                  placeholder="https://... görsel URL'i"
                />
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-stone-200 text-stone-600 text-[11px] font-semibold hover:bg-stone-100 transition-colors">
                    <Upload className="w-3 h-3 text-stone-500" />
                    <span>Kapak Görseli Yükle</span>
                    <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">Paylaşım Başlığı *</label>
              <Input
                type="text"
                value={formData.baslik}
                onChange={(e) => setFormData({ ...formData, baslik: e.target.value })}
                placeholder="Örn: Anamur Resort Otel - Sezonluk Temizlik Kimyasalları Sevkiyatımız"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Müşteri / Yetkili Adı *</label>
              <Input
                type="text"
                value={formData.musteri_adi}
                onChange={(e) => setFormData({ ...formData, musteri_adi: e.target.value })}
                placeholder="Örn: Kemal Bey (Satınalma Müdürü)"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Firma / İşletme & Bölge</label>
              <Input
                type="text"
                value={formData.firma_veya_bolge}
                onChange={(e) => setFormData({ ...formData, firma_veya_bolge: e.target.value })}
                placeholder="Örn: Anamur Resort Otel / İskele"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Müşteri Memnuniyet Yorumu / Alıntısı (Opsiyonel)
              </label>
              <textarea
                value={formData.yorum}
                onChange={(e) => setFormData({ ...formData, yorum: e.target.value })}
                placeholder="Müşterinin geri bildirimi veya teslimatla ilgili notlar..."
                rows={3}
                className="w-full rounded-xl border border-stone-200 p-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-red bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">Sıralama (Sıra No)</label>
              <Input
                type="number"
                min={1}
                value={formData.sira}
                onChange={(e) => setFormData({ ...formData, sira: Number(e.target.value) })}
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="text-stone-600"
            >
              İptal
            </Button>
            <Button type="submit" className="bg-brand-red hover:bg-brand-redDark text-white shadow-sm font-bold">
              {editingReview ? "Değişiklikleri Kaydet" : "Paylaşımı Yayınla"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
