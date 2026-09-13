"use client";

import React, { useState, useMemo } from "react";
import { DataService } from "@/lib/dataService";
import { Kategori } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  FolderTree,
  Plus,
  Trash2,
  Edit2,
  Search,
  Check,
  AlertCircle,
  Package,
  Layers,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AdminCategoriesPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "active" | "hidden">("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Kategori | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    ad: "",
    slug: "",
    sira: 1,
    icon_name: "Package",
    aktif: true,
  });

  const rawCategories = useMemo(() => {
    void refreshKey;
    const cats = DataService.getCategories({ includeInactive: true });
    if (!search.trim()) return cats;
    const q = search.toLowerCase().trim();
    return cats.filter(
      (c) => c.ad.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    );
  }, [refreshKey, search]);

  const categories = useMemo(() => {
    if (filterTab === "active") return rawCategories.filter((c) => c.aktif !== false);
    if (filterTab === "hidden") return rawCategories.filter((c) => c.aktif === false);
    return rawCategories;
  }, [rawCategories, filterTab]);

  const stats = useMemo(() => {
    const total = rawCategories.length;
    const active = rawCategories.filter((c) => c.aktif !== false).length;
    const hidden = rawCategories.filter((c) => c.aktif === false).length;
    return { total, active, hidden };
  }, [rawCategories]);

  const allProducts = useMemo(() => {
    void refreshKey;
    return DataService.getProducts({ includeInactive: true });
  }, [refreshKey]);

  // Product counts per category (total and active)
  const productStats = useMemo(() => {
    const totalCounts: Record<string, number> = {};
    const activeCounts: Record<string, number> = {};
    allProducts.forEach((p) => {
      totalCounts[p.kategori_id] = (totalCounts[p.kategori_id] || 0) + 1;
      if (p.aktif !== false) {
        activeCounts[p.kategori_id] = (activeCounts[p.kategori_id] || 0) + 1;
      }
    });
    return { totalCounts, activeCounts };
  }, [allProducts]);

  const handleOpenAdd = () => {
    setErrorMsg(null);
    setEditingCategory(null);
    setFormData({
      ad: "",
      slug: "",
      sira: rawCategories.length + 1,
      icon_name: "Package",
      aktif: true,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (cat: Kategori) => {
    setErrorMsg(null);
    setEditingCategory(cat);
    setFormData({
      ad: cat.ad,
      slug: cat.slug,
      sira: cat.sira,
      icon_name: cat.icon_name || "Package",
      aktif: cat.aktif !== false,
    });
    setIsAddModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (editingCategory) {
      DataService.updateCategory(editingCategory.id, {
        ad: formData.ad.trim(),
        slug: formData.slug.trim() || undefined,
        sira: Number(formData.sira) || 1,
        aktif: formData.aktif,
      });
    } else {
      DataService.addCategory({
        ad: formData.ad.trim(),
        slug: formData.slug.trim() || undefined,
        sira: Number(formData.sira) || rawCategories.length + 1,
        aktif: formData.aktif,
      });
    }

    setRefreshKey((k) => k + 1);
    setIsAddModalOpen(false);
  };

  const toggleCategoryActive = (id: string) => {
    DataService.toggleCategoryActive(id);
    setRefreshKey((k) => k + 1);
  };

  const handleDelete = (id: string, name: string) => {
    setErrorMsg(null);
    const count = productStats.totalCounts[id] || 0;
    if (count > 0) {
      alert(
        `"${name}" kategorisine bağlı ${count} adet ürün bulunmaktadır. Kategoriyi silmek için önce bağlı ürünleri başka bir kategoriye taşıyınız veya siliniz.`
      );
      return;
    }

    if (window.confirm(`"${name}" kategorisini silmek istediğinize emin misiniz?`)) {
      const res = DataService.deleteCategory(id);
      if (!res.success) {
        alert(res.error || "Kategori silinemedi.");
      } else {
        setRefreshKey((k) => k + 1);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">
              Kategori Yönetimi
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-100 text-stone-700">
              {rawCategories.length} Kategori
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Ürün kategorilerini ekleyin, URL sluglarını, yayın durumunu (Yayında / Gizli) ve vitrin menü sıralamasını yönetin.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="bg-brand-red hover:bg-brand-redDark text-white gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Kategori Ekle</span>
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Kategori adı veya slug ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar touch-scroll flex-nowrap sm:flex-wrap py-0.5 w-full sm:w-auto">
          <button
            type="button"
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
            type="button"
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
            type="button"
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
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 w-16 text-center">Sıra</th>
                <th className="py-3 px-4">Kategori Adı</th>
                <th className="py-3 px-4">URL Slug (Bağlantı)</th>
                <th className="py-3 px-4 text-center">Ürün Sayısı</th>
                <th className="py-3 px-4 text-center">Yayın Durumu</th>
                <th className="py-3 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-400">
                    Kategori bulunamadı.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => {
                  const totalCount = productStats.totalCounts[cat.id] || 0;
                  const activeCount = productStats.activeCounts[cat.id] || 0;
                  const isActive = cat.aktif !== false;

                  return (
                    <tr
                      key={cat.id}
                      className={`hover:bg-stone-50/60 transition-colors ${
                        !isActive ? "opacity-60 bg-stone-50/30" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center font-bold text-stone-600">
                        {cat.sira}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                              isActive
                                ? "bg-rose-50 text-brand-red border-rose-100"
                                : "bg-stone-100 text-stone-400 border-stone-200"
                            }`}
                          >
                            <Layers className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
                              <span>{cat.ad}</span>
                              {!isActive && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] bg-stone-200 text-stone-600 font-semibold">
                                  Gizli
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-stone-400">
                              ID: {cat.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <code className="text-stone-600 bg-stone-100 px-2 py-0.5 rounded text-[11px] font-mono">
                          /kategori/{cat.slug}
                        </code>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                            totalCount > 0
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-stone-100 text-stone-400"
                          }`}
                          title={`${activeCount} Yayında, ${totalCount - activeCount} Gizli`}
                        >
                          <Package className="w-3 h-3" />
                          <span>{totalCount} Ürün ({activeCount} Yayında)</span>
                        </span>
                      </td>
                      {/* Active Status Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleCategoryActive(cat.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                            isActive
                              ? "bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100"
                              : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                          }`}
                          title="Kategorinin sitedeki görünürlüğünü aç/kapat"
                        >
                          {isActive ? (
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
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(cat)}
                            className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
                            title="Düzenle"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id, cat.ad)}
                            className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingCategory ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-brand-red flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <Input
              label="Kategori Adı"
              placeholder="örn: Oto Bakım & Yıkama"
              value={formData.ad}
              onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div>
            <Input
              label="URL Slug (Boş bırakılırsa otomatik üretilir)"
              placeholder="örn: oto-bakim-yikama"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            />
          </div>

          <div>
            <Input
              label="Görüntülenme Sırası"
              type="number"
              min="1"
              value={formData.sira}
              onChange={(e) =>
                setFormData({ ...formData, sira: parseInt(e.target.value, 10) || 1 })
              }
              required
            />
          </div>

          {/* Yayın Durumu Checkbox */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-stone-800">Sitede Yayında Göster</div>
              <div className="text-[11px] text-stone-500">
                Kapalı olduğunda kategori vitrinde ve menüde listelenmez.
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.aktif}
                onChange={(e) => setFormData({ ...formData, aktif: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-stone-100">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsAddModalOpen(false)}
            >
              İptal
            </Button>
            <Button
              type="submit"
              size="md"
              className="bg-brand-red hover:bg-brand-redDark text-white"
            >
              {editingCategory ? "Değişiklikleri Kaydet" : "Kategoriyi Oluştur"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
