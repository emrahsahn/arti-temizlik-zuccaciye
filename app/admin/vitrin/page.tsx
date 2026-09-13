"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { DataService } from "@/lib/dataService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Kampanya, SiteAyarlari, Urun, Kategori } from "@/lib/types";
import {
  Sparkles,
  Flame,
  CheckCircle2,
  Award,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArrowRight,
  ExternalLink,
  Layers,
  Package,
  Search,
  Check,
} from "lucide-react";

export default function AdminShowcasePage() {
  const [settings, setSettings] = useState<SiteAyarlari>(() => DataService.getSettings());
  const [campaigns, setCampaigns] = useState<Kampanya[]>(() =>
    DataService.getCampaigns(true)
  );
  const [allProducts, setAllProducts] = useState<Urun[]>(() => DataService.getProducts());
  const [categories, setCategories] = useState<Kategori[]>(() =>
    DataService.getCategories({ includeInactive: true })
  );

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Kampanya | null>(null);

  // Product selector filter inside modal
  const [productSearch, setProductSearch] = useState("");
  const [productCatFilter, setProductCatFilter] = useState("all");

  // Form State
  const [formData, setFormData] = useState<{
    baslik: string;
    aciklama: string;
    badge_text: string;
    cta_text: string;
    cta_link: string;
    sira: number;
    aktif: boolean;
    urun_ids: string[];
    link_type: "campaign_page" | "custom_url";
  }>({
    baslik: "",
    aciklama: "",
    badge_text: "",
    cta_text: "",
    cta_link: "",
    sira: 1,
    aktif: true,
    urun_ids: [],
    link_type: "campaign_page",
  });

  // Sync on mount and updates
  useEffect(() => {
    const syncData = () => {
      setSettings(DataService.getSettings());
      setCampaigns(DataService.getCampaigns(true));
      setAllProducts(DataService.getProducts());
      setCategories(DataService.getCategories({ includeInactive: true }));
    };
    syncData();

    window.addEventListener("arti_settings_updated", syncData);
    window.addEventListener("arti_campaigns_updated", syncData);
    window.addEventListener("arti_products_updated", syncData);
    window.addEventListener("storage", syncData);

    return () => {
      window.removeEventListener("arti_settings_updated", syncData);
      window.removeEventListener("arti_campaigns_updated", syncData);
      window.removeEventListener("arti_products_updated", syncData);
      window.removeEventListener("storage", syncData);
    };
  }, []);

  const notifySuccess = (msg: string) => {
    setSuccessMessage(msg);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleToggleMode = (
    field: "cok_satanlar_modu" | "haftanin_urunleri_modu",
    val: "manuel" | "otomatik"
  ) => {
    const updated = DataService.updateSettings({ [field]: val });
    setSettings(updated);
    notifySuccess("Vitrin çalışma modu güncellendi.");
  };

  const handleOpenAddModal = () => {
    setEditingCampaign(null);
    setProductSearch("");
    setProductCatFilter("all");
    const nextId = `kmp-${Date.now()}`;
    setFormData({
      baslik: "",
      aciklama: "",
      badge_text: "ÖZEL FIRSAT",
      cta_text: "Kampanyayı İncele",
      cta_link: `/kampanya/${nextId}`,
      sira: campaigns.length + 1,
      aktif: true,
      urun_ids: [],
      link_type: "campaign_page",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (camp: Kampanya) => {
    setEditingCampaign(camp);
    setProductSearch("");
    setProductCatFilter("all");
    const isCustomUrl = camp.cta_link && !camp.cta_link.startsWith("/kampanya/");
    setFormData({
      baslik: camp.baslik,
      aciklama: camp.aciklama,
      badge_text: camp.badge_text || "ÖZEL FIRSAT",
      cta_text: camp.cta_text || "Kampanyayı İncele",
      cta_link: camp.cta_link || `/kampanya/${camp.id}`,
      sira: camp.sira || 1,
      aktif: camp.aktif !== false,
      urun_ids: camp.urun_ids ? [...camp.urun_ids] : [],
      link_type: isCustomUrl ? "custom_url" : "campaign_page",
    });
    setIsModalOpen(true);
  };

  const handleToggleProductSelection = (productId: string) => {
    setFormData((prev) => {
      const exists = prev.urun_ids.includes(productId);
      const nextUrunIds = exists
        ? prev.urun_ids.filter((id) => id !== productId)
        : [...prev.urun_ids, productId];
      return { ...prev, urun_ids: nextUrunIds };
    });
  };

  const handleSelectAllFiltered = (filteredIds: string[]) => {
    setFormData((prev) => {
      const combined = Array.from(new Set([...prev.urun_ids, ...filteredIds]));
      return { ...prev, urun_ids: combined };
    });
  };

  const handleClearSelected = () => {
    setFormData((prev) => ({ ...prev, urun_ids: [] }));
  };

  const handleToggleActive = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    DataService.toggleCampaignActive(id);
    setCampaigns(DataService.getCampaigns(true));
    notifySuccess("Kampanya görünürlük durumu güncellendi.");
  };

  const handleDeleteCampaign = (id: string, baslik: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`"${baslik}" kampanya kartını silmek istediğinize emin misiniz?`)) {
      DataService.deleteCampaign(id);
      setCampaigns(DataService.getCampaigns(true));
      notifySuccess("Kampanya kartı silindi.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.baslik.trim() || !formData.aciklama.trim()) {
      alert("Lütfen kampanya başlığı ve açıklamasını doldurunuz.");
      return;
    }

    if (editingCampaign) {
      const finalLink =
        formData.link_type === "campaign_page"
          ? `/kampanya/${editingCampaign.id}`
          : formData.cta_link.trim() || `/kampanya/${editingCampaign.id}`;

      DataService.updateCampaign(editingCampaign.id, {
        baslik: formData.baslik.trim(),
        aciklama: formData.aciklama.trim(),
        badge_text: formData.badge_text.trim(),
        cta_text: formData.cta_text.trim(),
        cta_link: finalLink,
        sira: Number(formData.sira) || 1,
        aktif: formData.aktif,
        urun_ids: formData.urun_ids,
      });
      notifySuccess("Kampanya kartı ve dahil edilen ürünler başarıyla güncellendi.");
    } else {
      const newCamp = DataService.createCampaign({
        baslik: formData.baslik.trim(),
        aciklama: formData.aciklama.trim(),
        badge_text: formData.badge_text.trim(),
        cta_text: formData.cta_text.trim(),
        cta_link: "", // Temporary
        sira: Number(formData.sira) || campaigns.length + 1,
        aktif: formData.aktif,
        urun_ids: formData.urun_ids,
      });

      const finalLink =
        formData.link_type === "campaign_page"
          ? `/kampanya/${newCamp.id}`
          : formData.cta_link.trim() || `/kampanya/${newCamp.id}`;

      DataService.updateCampaign(newCamp.id, { cta_link: finalLink });
      notifySuccess("Yeni kampanya kartı ve dahil edilen ürünler başarıyla eklendi.");
    }

    setCampaigns(DataService.getCampaigns(true));
    setIsModalOpen(false);
  };

  // Filtered products inside modal
  const filteredModalProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const matchesSearch =
        !productSearch ||
        p.ad.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.id.toLowerCase().includes(productSearch.toLowerCase());
      const matchesCat =
        productCatFilter === "all" || p.kategori_id === productCatFilter;
      return matchesSearch && matchesCat;
    });
  }, [allProducts, productSearch, productCatFilter]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Vitrin & Kampanya Yönetimi
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Ana sayfa vitrin bloklarının çalışma modlarını ve öne çıkan kampanya kartlarını (içerik ve dahil edilen ürünler) düzenleyin.
          </p>
        </div>

        <Button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-redDark text-white shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Kampanya Kartı Ekle</span>
        </Button>
      </div>

      {/* Success Notification */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2.5 shadow-sm animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Section 1: Showcase Automation Settings */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
        <div className="border-b border-stone-100 pb-4 mb-6">
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-red" />
            <span>Ana Sayfa Vitrin Reyonları Çalışma Modları</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Çok Satanlar ve Haftanın Ürünleri bloklarının otomatik mi yoksa ürün bazlı manuel seçimle mi gösterileceğini belirleyin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Bestsellers mode */}
          <div className="p-5 rounded-2xl border border-stone-200/80 bg-stone-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                  <Flame className="w-4 h-4 text-brand-red" />
                  <span>Çok Satanlar Reyonu Modu</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    settings.cok_satanlar_modu === "manuel"
                      ? "bg-rose-100 text-rose-800"
                      : "bg-sky-100 text-sky-800"
                  }`}
                >
                  {settings.cok_satanlar_modu === "manuel" ? "Manuel Seçim" : "Otomatik"}
                </span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                {settings.cok_satanlar_modu === "manuel"
                  ? "Sadece Ürün Yönetimi sayfasında 'Çok Satan' olarak işaretlediğiniz ürünler ana sayfa reyonunda kayar."
                  : "Sistemde sipariş sıklığına göre en çok talep gören ürünler otomatik olarak vitrinde listelenir."}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-200/60 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleToggleMode("cok_satanlar_modu", "manuel")}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  settings.cok_satanlar_modu === "manuel"
                    ? "bg-brand-red text-white shadow-sm"
                    : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                }`}
              >
                Manuel Seçim
              </button>
              <button
                type="button"
                onClick={() => handleToggleMode("cok_satanlar_modu", "otomatik")}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  settings.cok_satanlar_modu === "otomatik"
                    ? "bg-stone-900 text-white shadow-sm"
                    : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                }`}
              >
                Otomatik Listele
              </button>
            </div>
          </div>

          {/* Card 2: Featured of the week mode */}
          <div className="p-5 rounded-2xl border border-stone-200/80 bg-stone-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-brand-blue" />
                  <span>Haftanın Ürünleri Reyonu Modu</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    settings.haftanin_urunleri_modu === "manuel"
                      ? "bg-rose-100 text-rose-800"
                      : "bg-sky-100 text-sky-800"
                  }`}
                >
                  {settings.haftanin_urunleri_modu === "manuel" ? "Manuel Seçim" : "Otomatik"}
                </span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                {settings.haftanin_urunleri_modu === "manuel"
                  ? "Sadece Ürün Yönetimi sayfasında 'Haftanın Ürünü' rozeti verdiğiniz ürünler ana sayfada listelenir."
                  : "Katalog içerisinden öne çıkan dönemsel ürünler haftalık olarak otomatik vitrine taşınır."}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-200/60 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleToggleMode("haftanin_urunleri_modu", "manuel")}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  settings.haftanin_urunleri_modu === "manuel"
                    ? "bg-brand-blue text-white shadow-sm"
                    : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                }`}
              >
                Manuel Seçim
              </button>
              <button
                type="button"
                onClick={() => handleToggleMode("haftanin_urunleri_modu", "otomatik")}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  settings.haftanin_urunleri_modu === "otomatik"
                    ? "bg-stone-900 text-white shadow-sm"
                    : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
                }`}
              >
                Otomatik Listele
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Active Showcase Hero Campaigns Cards */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-red" />
              <span>Aktif Kampanya ve Fırsat Kartları (Hero Banners)</span>
            </h2>
            <p className="text-xs text-stone-500">
              Ana sayfa en üstünde yer alan 3&apos;lü renkli kampanya kartları ve bu kampanyalara dahil edilen ürünler.
            </p>
          </div>
          <span className="text-xs font-semibold text-stone-400">
            {campaigns.length} Kampanya Kartı Kayıtlı
          </span>
        </div>

        {campaigns.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500">
            <Award className="w-12 h-12 mx-auto text-stone-300 mb-3" />
            <h3 className="text-base font-bold text-stone-800">
              Henüz Kampanya Kartı Eklenmemiş
            </h3>
            <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
              Ana sayfada müşterilerinizi karşılayacak özel indirim ve duyuru kartları oluşturabilirsiniz.
            </p>
            <Button
              onClick={handleOpenAddModal}
              className="mt-5 bg-brand-red hover:bg-brand-redDark text-white gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>İlk Kampanya Kartını Ekle</span>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {campaigns.map((c) => {
              const productCount = c.urun_ids?.length || 0;
              return (
                <div
                  key={c.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between shadow-sm overflow-hidden ${
                    c.aktif
                      ? "border-stone-200/90 hover:border-stone-300 hover:shadow-md"
                      : "border-stone-200/50 bg-stone-50/40 opacity-70"
                  }`}
                >
                  <div className="p-5">
                    {/* Top Status & Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 text-[10px] font-bold tracking-wider uppercase border border-stone-200">
                        {c.badge_text || "ÖZEL FIRSAT"}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => handleToggleActive(c.id, e)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                          c.aktif
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-stone-200 text-stone-600 hover:bg-stone-300"
                        }`}
                      >
                        {c.aktif ? (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Yayında</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Gizli</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Title */}
                    <h3 className="font-extrabold text-stone-900 text-base leading-snug mb-1.5">
                      {c.baslik}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-3">
                      {c.aciklama}
                    </p>

                    {/* Included Products Badge & Link */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-rose-50/70 border border-rose-100 rounded-xl px-3 py-1.5 text-xs">
                        <span className="flex items-center gap-1.5 text-rose-900 font-bold text-[11px]">
                          <Package className="w-3.5 h-3.5 text-brand-red" />
                          <span>Dahil Ürünler:</span>
                        </span>
                        <span className="font-extrabold text-brand-red text-xs">
                          {productCount} Ürün
                        </span>
                      </div>

                      {/* Target Link pill */}
                      <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-2.5 text-[11px] space-y-1">
                        <div className="text-stone-400 font-semibold uppercase tracking-wider text-[9px]">
                          Yönlendirme & Buton
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-stone-800 truncate">
                            {c.cta_text || "Kampanyayı İncele"}
                          </span>
                          <span className="text-brand-blue truncate font-mono text-[10px]">
                            {c.cta_link || `/kampanya/${c.id}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Controls */}
                  <div className="px-5 py-3.5 bg-stone-50/90 border-t border-stone-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-stone-400 font-semibold">
                      Sıra: #{c.sira}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(c)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 text-xs font-bold shadow-sm hover:bg-stone-100 hover:text-stone-950 transition-colors active:scale-95"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-stone-500" />
                        <span>Düzenle & Ürünler</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteCampaign(c.id, c.baslik, e)}
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
      </div>

      {/* Edit / Create Campaign Modal with Product Selector */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCampaign ? "Kampanya Kartını ve Ürünlerini Düzenle" : "Yeni Kampanya Kartı Ekle"}
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Live Preview Pill */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-800 text-white shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="inline-block px-2.5 py-0.5 rounded-lg bg-white/10 text-[10px] font-bold text-stone-200 border border-white/10">
                {formData.badge_text || "ÖZEL FIRSAT"}
              </span>
              <span className="text-[10px] text-stone-400 font-semibold">
                (Canlı Önizleme)
              </span>
            </div>
            <h4 className="text-base font-bold text-white leading-snug">
              {formData.baslik || "Kampanya Başlığı Burada Görünecek"}
            </h4>
            <p className="text-xs text-stone-300 mt-1 line-clamp-2">
              {formData.aciklama || "Kampanya açıklama metni burada görünecektir."}
            </p>
            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                {formData.cta_text || "Kampanyayı İncele"}
                <ArrowRight className="w-3.5 h-3.5 text-brand-red" />
              </span>
              <span className="text-[10px] text-stone-300 font-medium">
                {formData.urun_ids.length} Özel Ürün Seçili
              </span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Kampanya Başlığı *
              </label>
              <Input
                type="text"
                value={formData.baslik}
                onChange={(e) => setFormData({ ...formData, baslik: e.target.value })}
                placeholder="Örn: İşletmelere Özel Toplu Alım İndirimi"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Açıklama Metni *
              </label>
              <textarea
                value={formData.aciklama}
                onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })}
                placeholder="Kampanya detayları ve kapsamı..."
                rows={2}
                required
                className="w-full rounded-xl border border-stone-200 p-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-red bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Rozet Metni (Badge)
              </label>
              <Input
                type="text"
                value={formData.badge_text}
                onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
                placeholder="Örn: TOPTAN AVANTAJ, SEZON FIRSATI"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Buton Metni (CTA Text)
              </label>
              <Input
                type="text"
                value={formData.cta_text}
                onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                placeholder="Örn: Kampanyayı İncele, Fırsatları Gör"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Yönlendirme Türü
              </label>
              <select
                value={formData.link_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    link_type: e.target.value as "campaign_page" | "custom_url",
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-stone-50 text-xs border border-stone-200 font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-red"
              >
                <option value="campaign_page">
                  Özel Kampanya Sayfası (Seçilen Ürünleri Listeler)
                </option>
                <option value="custom_url">Harici URL / Kategori Linki</option>
              </select>
            </div>

            {formData.link_type === "custom_url" ? (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Özel Yönlendirme Linki
                </label>
                <Input
                  type="text"
                  value={formData.cta_link}
                  onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                  placeholder="Örn: /kategori/endustriyel-genel-temizlik veya /iletisim"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Sıralama (Sıra No)
                </label>
                <Input
                  type="number"
                  min={1}
                  value={formData.sira}
                  onChange={(e) => setFormData({ ...formData, sira: Number(e.target.value) })}
                />
              </div>
            )}

            {formData.link_type === "custom_url" && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Sıralama (Sıra No)
                </label>
                <Input
                  type="number"
                  min={1}
                  value={formData.sira}
                  onChange={(e) => setFormData({ ...formData, sira: Number(e.target.value) })}
                />
              </div>
            )}
          </div>

          {/* Section: Product Multi-Selector */}
          <div className="pt-3 border-t border-stone-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">
                    Kampanyaya Dahil Edilecek Ürünler
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-brand-red text-white">
                    {formData.urun_ids.length} Seçili
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Müşteriler bu kampanyaya tıkladığında aşağıdaki seçtiğiniz ürünler özel sayfada gösterilecektir.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleSelectAllFiltered(filteredModalProducts.map((p) => p.id))
                  }
                  className="px-2.5 py-1 text-[11px] font-bold text-brand-blue bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors active:scale-95"
                >
                  Filtrelenenleri Seç ({filteredModalProducts.length})
                </button>
                {formData.urun_ids.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearSelected}
                    className="px-2.5 py-1 text-[11px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors active:scale-95"
                  >
                    Seçimi Temizle
                  </button>
                )}
              </div>
            </div>

            {/* Filter / Search inside product selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ürün adı veya kod ara..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red"
                />
              </div>

              <div>
                <select
                  value={productCatFilter}
                  onChange={(e) => setProductCatFilter(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-red cursor-pointer"
                >
                  <option value="all">Tüm Kategoriler ({allProducts.length} Ürün)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.ad}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Scrollable Product List */}
            <div className="max-h-60 overflow-y-auto border border-stone-200 rounded-xl divide-y divide-stone-100 bg-white touch-scroll">
              {filteredModalProducts.length === 0 ? (
                <div className="p-6 text-center text-stone-400 text-xs">
                  Aramaya uygun ürün bulunamadı.
                </div>
              ) : (
                filteredModalProducts.map((p) => {
                  const isSelected = formData.urun_ids.includes(p.id);
                  const cat = categories.find((c) => c.id === p.kategori_id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleToggleProductSelection(p.id)}
                      className={`p-2.5 flex items-center justify-between gap-3 cursor-pointer select-none transition-colors ${
                        isSelected
                          ? "bg-rose-50/60 hover:bg-rose-50"
                          : "hover:bg-stone-50"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Checkbox */}
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                            isSelected
                              ? "bg-brand-red border-brand-red text-white"
                              : "border-stone-300 bg-white"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>

                        {/* Thumbnail */}
                        <div className="relative w-9 h-9 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden shrink-0">
                          {p.gorsel_url ? (
                            <Image
                              src={p.gorsel_url}
                              alt={p.ad}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-300">
                              <Package className="w-4 h-4" />
                            </div>
                          )}
                        </div>

                        {/* Title & Cat */}
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-stone-900 truncate">
                            {p.ad}
                          </div>
                          <div className="text-[10px] text-stone-500 flex items-center gap-1.5">
                            <span className="truncate">{cat?.ad || "Genel"}</span>
                            <span>•</span>
                            <span>Birim: {p.birim}</span>
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right shrink-0">
                        <div className="text-xs font-extrabold text-stone-900">
                          ₺{p.fiyat.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                        </div>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            isSelected
                              ? "bg-brand-red text-white"
                              : "bg-stone-100 text-stone-600"
                          }`}
                        >
                          {isSelected ? "Dahil" : "+ Ekle"}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Active status checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.aktif}
                onChange={(e) => setFormData({ ...formData, aktif: e.target.checked })}
                className="w-4 h-4 text-brand-red rounded border-stone-300 focus:ring-brand-red"
              />
              <span className="text-xs font-bold text-stone-800">
                Bu kampanya kartı ana sayfada aktif olarak yayınlansın
              </span>
            </label>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Vazgeç
            </Button>
            <Button
              type="submit"
              className="bg-brand-red hover:bg-brand-redDark text-white font-bold"
            >
              {editingCampaign ? "Değişiklikleri Kaydet" : "Kartı ve Ürünleri Ekle"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
