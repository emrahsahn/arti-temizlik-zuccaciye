"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { DataService } from "@/lib/dataService";
import { Urun } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  Package,
  Plus,
  Trash2,
  Edit2,
  Flame,
  Sparkles,
  Search,
  Check,
  Upload,
  X,
  ImageIcon,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Eye,
  EyeOff,
  Filter,
} from "lucide-react";

export default function AdminProductsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filterTab, setFilterTab] = useState<
    "all" | "active" | "hidden" | "in_stock" | "out_of_stock"
  >("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Urun | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    ad: "",
    kategori_id: "kat-1",
    fiyat: 0,
    birim: "Koli",
    aciklama: "",
    gorsel_url: "",
    aktif: true,
    stok_durumu: "var" as "var" | "tukendi" | "sorunuz",
    cok_satan: false,
    haftanin_urunu: false,
  });

  const categories = useMemo(() => {
    void refreshKey;
    return DataService.getCategories({ includeInactive: true });
  }, [refreshKey]);

  const rawProducts = useMemo(() => {
    void refreshKey;
    return DataService.getProducts({ search, includeInactive: true });
  }, [refreshKey, search]);

  const categoryFilteredProducts = useMemo(() => {
    if (selectedCategory === "all") return rawProducts;
    return rawProducts.filter((p) => p.kategori_id === selectedCategory);
  }, [rawProducts, selectedCategory]);

  const products = useMemo(() => {
    let list = categoryFilteredProducts;
    if (filterTab === "active") return list.filter((p) => p.aktif !== false);
    if (filterTab === "hidden") return list.filter((p) => p.aktif === false);
    if (filterTab === "in_stock")
      return list.filter((p) => (p.stok_durumu || "var") === "var");
    if (filterTab === "out_of_stock")
      return list.filter((p) => p.stok_durumu === "tukendi");
    return list;
  }, [categoryFilteredProducts, filterTab]);

  const stats = useMemo(() => {
    const total = categoryFilteredProducts.length;
    const active = categoryFilteredProducts.filter((p) => p.aktif !== false).length;
    const hidden = categoryFilteredProducts.filter((p) => p.aktif === false).length;
    const inStock = categoryFilteredProducts.filter((p) => (p.stok_durumu || "var") === "var").length;
    const outOfStock = categoryFilteredProducts.filter((p) => p.stok_durumu === "tukendi").length;
    return { total, active, hidden, inStock, outOfStock };
  }, [categoryFilteredProducts]);

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Lütfen 5 MB'dan küçük bir görsel seçiniz.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData((prev) => ({
          ...prev,
          gorsel_url: event.target!.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      ad: "",
      kategori_id: categories[0]?.id || "kat-1",
      fiyat: 100,
      birim: "Koli",
      aciklama: "",
      gorsel_url: "",
      aktif: true,
      stok_durumu: "var",
      cok_satan: false,
      haftanin_urunu: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: Urun) => {
    setEditingProduct(prod);
    setFormData({
      ad: prod.ad,
      kategori_id: prod.kategori_id,
      fiyat: prod.fiyat,
      birim: prod.birim,
      aciklama: prod.aciklama || "",
      gorsel_url: prod.gorsel_url || "",
      aktif: prod.aktif,
      stok_durumu: prod.stok_durumu || "var",
      cok_satan: prod.cok_satan,
      haftanin_urunu: prod.haftanin_urunu,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      DataService.updateProduct(editingProduct.id, {
        ad: formData.ad.trim(),
        kategori_id: formData.kategori_id,
        fiyat: Number(formData.fiyat),
        birim: formData.birim,
        aciklama: formData.aciklama.trim(),
        gorsel_url: formData.gorsel_url,
        aktif: formData.aktif,
        stok_durumu: formData.stok_durumu,
        cok_satan: formData.cok_satan,
        haftanin_urunu: formData.haftanin_urunu,
      });
    } else {
      DataService.addProduct({
        ad: formData.ad.trim(),
        kategori_id: formData.kategori_id,
        fiyat: Number(formData.fiyat),
        birim: formData.birim,
        aciklama: formData.aciklama.trim(),
        gorsel_url: formData.gorsel_url,
        aktif: formData.aktif,
        stok_durumu: formData.stok_durumu,
        cok_satan: formData.cok_satan,
        haftanin_urunu: formData.haftanin_urunu,
      });
    }
    setIsModalOpen(false);
    setRefreshKey((prev) => prev + 1);
  };

  const handleDelete = (id: string, ad: string) => {
    if (confirm(`"${ad}" ürününü silmek istediğinize emin misiniz?`)) {
      DataService.deleteProduct(id);
      setRefreshKey((prev) => prev + 1);
    }
  };

  const toggleStock = (id: string, currentStock: string | undefined) => {
    const next = currentStock === "tukendi" ? "var" : "tukendi";
    DataService.updateProduct(id, { stok_durumu: next });
    setRefreshKey((prev) => prev + 1);
  };

  const toggleActive = (id: string, currentActive: boolean) => {
    DataService.updateProduct(id, { aktif: !currentActive });
    setRefreshKey((prev) => prev + 1);
  };

  const toggleFlag = (id: string, field: "cok_satan" | "haftanin_urunu", current: boolean) => {
    DataService.updateProduct(id, { [field]: !current });
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Ürün Kataloğu ve Stok / Fiyat Yönetimi
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Ürünlerin fiyatlarını, stok durumlarını (Stokta Var / Tükendi) ve vitrin rozetlerini yönetin.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={handleOpenAdd} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          <span>Yeni Ürün Ekle</span>
        </Button>
      </div>

      {/* Filters & Stats Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
          {/* Search input */}
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ürün adı veya açıklama ile ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-50 text-xs border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>

          {/* Category Filter Select */}
          <div className="w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 rounded-xl bg-stone-50 text-xs border border-stone-200 font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-red cursor-pointer"
            >
              <option value="all">Tüm Kategoriler ({rawProducts.length} Ürün)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.ad} {c.aktif === false ? "(Gizli Kategori)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar touch-scroll flex-nowrap sm:flex-wrap py-0.5 w-full lg:w-auto">
          <button
            onClick={() => setFilterTab("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 ${
              filterTab === "all"
                ? "bg-stone-900 text-white shadow-sm"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            Tümü ({stats.total})
          </button>
          <button
            onClick={() => setFilterTab("active")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 ${
              filterTab === "active"
                ? "bg-sky-600 text-white shadow-sm"
                : "bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Yayında ({stats.active})</span>
          </button>
          <button
            onClick={() => setFilterTab("hidden")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 ${
              filterTab === "hidden"
                ? "bg-stone-700 text-white shadow-sm"
                : "bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200"
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Gizli ({stats.hidden})</span>
          </button>
          <button
            onClick={() => setFilterTab("in_stock")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 ${
              filterTab === "in_stock"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Stokta ({stats.inStock})</span>
          </button>
          <button
            onClick={() => setFilterTab("out_of_stock")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 ${
              filterTab === "out_of_stock"
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100"
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Tükendi ({stats.outOfStock})</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/60 text-stone-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Görsel & Ürün</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Birim</th>
                <th className="py-3 px-4">Net Fiyat</th>
                <th className="py-3 px-4 text-center">Stok Durumu</th>
                <th className="py-3 px-4 text-center">Yayın Durumu</th>
                <th className="py-3 px-4 text-center">Çok Satan</th>
                <th className="py-3 px-4 text-center">Haftanın Ürünü</th>
                <th className="py-3 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.map((prod) => {
                const category = categories.find((c) => c.id === prod.kategori_id);
                const isOut = prod.stok_durumu === "tukendi";
                const isAsk = prod.stok_durumu === "sorunuz";
                const isAvailable = !isOut && !isAsk;

                return (
                  <tr
                    key={prod.id}
                    className={`hover:bg-stone-50/50 transition-colors ${
                      !prod.aktif ? "opacity-60 bg-stone-50/30" : ""
                    }`}
                  >
                    {/* Image & Product Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden flex-shrink-0">
                          {prod.gorsel_url ? (
                            <Image
                              src={prod.gorsel_url}
                              alt={prod.ad}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-300">
                              <Package className="w-4 h-4" />
                            </div>
                          )}
                          {isOut && (
                            <div className="absolute inset-0 bg-rose-900/60 flex items-center justify-center text-[9px] font-bold text-white uppercase">
                              Tükendi
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-stone-900 leading-snug">
                            {prod.ad}
                          </div>
                          {prod.aciklama && (
                            <div className="text-[11px] text-stone-400 line-clamp-1 max-w-xs">
                              {prod.aciklama}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-stone-600">
                      {category?.ad || "-"}
                    </td>

                    {/* Unit */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-stone-100 font-semibold text-stone-700">
                        {prod.birim}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      ₺{prod.fiyat.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                    </td>

                    {/* Stock Status Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleStock(prod.id, prod.stok_durumu)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all shadow-2xs ${
                          isOut
                            ? "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                            : isAsk
                            ? "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                        }`}
                        title="Stok durumunu değiştirmek için tıklayın (Stokta / Tükendi)"
                      >
                        {isOut ? (
                          <>
                            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span>Tükendi</span>
                          </>
                        ) : isAsk ? (
                          <>
                            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Sorunuz</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Stokta Var</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Active / Hidden Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleActive(prod.id, prod.aktif)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                          prod.aktif
                            ? "bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100"
                            : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                        }`}
                        title="Sitedeki görünürlüğü değiştir"
                      >
                        {prod.aktif ? (
                          <>
                            <Eye className="w-3 h-3 text-sky-600" />
                            <span>Yayında</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-stone-400" />
                            <span>Gizli</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Bestseller toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleFlag(prod.id, "cok_satan", prod.cok_satan)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          prod.cok_satan
                            ? "bg-rose-50 border-rose-200 text-brand-red shadow-sm"
                            : "bg-stone-50 border-stone-200 text-stone-300 hover:text-stone-500"
                        }`}
                        title="Çok Satan Olarak İşaretle"
                      >
                        <Flame className="w-4 h-4" />
                      </button>
                    </td>

                    {/* Featured toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleFlag(prod.id, "haftanin_urunu", prod.haftanin_urunu)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          prod.haftanin_urunu
                            ? "bg-sky-50 border-sky-200 text-brand-blue shadow-sm"
                            : "bg-stone-50 border-stone-200 text-stone-300 hover:text-stone-500"
                        }`}
                        title="Haftanın Ürünü Olarak İşaretle"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(prod)}
                          className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
                          title="Düzenle"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(prod.id, prod.ad)}
                          className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Ürünü ve Stok Durumunu Düzenle" : "Yeni Ürün Ekle"}
        maxWidth="2xl"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <Input
              label="Ürün Adı *"
              placeholder="örn: Ultra Yoğun Çamaşır Suyu (20 Kg)"
              value={formData.ad}
              onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Kategori
              </label>
              <select
                value={formData.kategori_id}
                onChange={(e) =>
                  setFormData({ ...formData, kategori_id: e.target.value })
                }
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-red"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.ad}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Input
                label="Fiyat (₺) *"
                type="number"
                step="0.01"
                min="0"
                value={formData.fiyat}
                onChange={(e) =>
                  setFormData({ ...formData, fiyat: parseFloat(e.target.value) || 0 })
                }
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Birim
              </label>
              <select
                value={formData.birim}
                onChange={(e) =>
                  setFormData({ ...formData, birim: e.target.value })
                }
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-red"
              >
                <option value="Bidon">Bidon</option>
                <option value="Koli">Koli</option>
                <option value="Paket">Paket</option>
                <option value="Adet">Adet</option>
                <option value="Litre">Litre</option>
                <option value="Kutu">Kutu</option>
              </select>
            </div>
          </div>

          {/* Stock Status Selector */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              Stok Durumu
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <label
                className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                  formData.stok_durumu === "var"
                    ? "border-emerald-500 bg-emerald-50/70 text-emerald-900 shadow-xs"
                    : "border-stone-200 bg-white hover:bg-stone-100 text-stone-700"
                }`}
              >
                <input
                  type="radio"
                  name="stok_durumu"
                  value="var"
                  checked={formData.stok_durumu === "var"}
                  onChange={() => setFormData({ ...formData, stok_durumu: "var" })}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Stokta Var</span>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                  formData.stok_durumu === "tukendi"
                    ? "border-rose-500 bg-rose-50/70 text-rose-900 shadow-xs"
                    : "border-stone-200 bg-white hover:bg-stone-100 text-stone-700"
                }`}
              >
                <input
                  type="radio"
                  name="stok_durumu"
                  value="tukendi"
                  checked={formData.stok_durumu === "tukendi"}
                  onChange={() => setFormData({ ...formData, stok_durumu: "tukendi" })}
                  className="text-rose-600 focus:ring-rose-500"
                />
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Tükendi / Stok Yok</span>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                  formData.stok_durumu === "sorunuz"
                    ? "border-amber-500 bg-amber-50/70 text-amber-900 shadow-xs"
                    : "border-stone-200 bg-white hover:bg-stone-100 text-stone-700"
                }`}
              >
                <input
                  type="radio"
                  name="stok_durumu"
                  value="sorunuz"
                  checked={formData.stok_durumu === "sorunuz"}
                  onChange={() => setFormData({ ...formData, stok_durumu: "sorunuz" })}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>Stok Sorunuz</span>
                </div>
              </label>
            </div>
          </div>

          {/* Product Image */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Ürün Görseli (Cihazdan Yükle veya Link Ver)
            </label>
            <div className="flex flex-col sm:flex-row gap-4 items-start p-3 bg-stone-50 rounded-xl border border-stone-200">
              {/* Preview Thumbnail */}
              <div className="relative w-24 h-24 rounded-xl bg-white border border-stone-200 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm">
                {formData.gorsel_url ? (
                  <>
                    <Image
                      src={formData.gorsel_url}
                      alt="Görsel Önizleme"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, gorsel_url: "" }))}
                      className="absolute top-1 right-1 p-1 bg-stone-900/80 hover:bg-rose-600 text-white rounded-full transition-colors z-10"
                      title="Görseli Kaldır"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-2 text-stone-300 text-center">
                    <ImageIcon className="w-8 h-8 stroke-[1.5]" />
                    <span className="text-[10px] mt-0.5 text-stone-400">Görsel Yok</span>
                  </div>
                )}
              </div>

              {/* Actions & Input */}
              <div className="flex-1 space-y-2.5 w-full">
                <div className="flex items-center gap-2 flex-wrap">
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 text-xs font-bold cursor-pointer transition-colors shadow-sm active:scale-95">
                    <Upload className="w-3.5 h-3.5 text-brand-red" />
                    <span>Cihazdan Fotoğraf Seç</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageFileUpload}
                    />
                  </label>
                  <span className="text-[11px] text-stone-400">
                    PNG, JPG, WEBP (Maks. 5 MB)
                  </span>
                </div>

                <div>
                  <Input
                    placeholder="veya internetten doğrudan görsel linki yapıştırın (https://...)"
                    value={formData.gorsel_url}
                    onChange={(e) =>
                      setFormData({ ...formData, gorsel_url: e.target.value })
                    }
                    className="text-xs bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Açıklama & Detaylar
            </label>
            <textarea
              rows={3}
              placeholder="Ürünün kullanım alanı, koli adedi, koku veya hijyen özellikleri..."
              value={formData.aciklama}
              onChange={(e) =>
                setFormData({ ...formData, aciklama: e.target.value })
              }
              className="w-full rounded-lg border border-stone-300 bg-white p-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-red resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
              <input
                type="checkbox"
                checked={formData.aktif}
                onChange={(e) =>
                  setFormData({ ...formData, aktif: e.target.checked })
                }
                className="rounded border-stone-300 text-brand-red focus:ring-brand-red"
              />
              <span>Sitede Yayınla (Aktif)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
              <input
                type="checkbox"
                checked={formData.cok_satan}
                onChange={(e) =>
                  setFormData({ ...formData, cok_satan: e.target.checked })
                }
                className="rounded border-stone-300 text-brand-red focus:ring-brand-red"
              />
              <span>Çok Satan Rozeti</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-700">
              <input
                type="checkbox"
                checked={formData.haftanin_urunu}
                onChange={(e) =>
                  setFormData({ ...formData, haftanin_urunu: e.target.checked })
                }
                className="rounded border-stone-300 text-brand-blue focus:ring-brand-blue"
              />
              <span>Haftanın Fırsat Ürünü</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-stone-100">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsModalOpen(false)}
            >
              İptal
            </Button>
            <Button type="submit" variant="primary" size="md">
              Kaydet
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
