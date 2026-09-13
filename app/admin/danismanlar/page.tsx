"use client";

import React, { useState, useMemo } from "react";
import { DataService } from "@/lib/dataService";
import { Danisman, IletisimKisi } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  UserCheck,
  Plus,
  Phone,
  Users,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ArrowUp,
  ArrowDown,
  Building2,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

type MemberType = "danisman" | "yonetim";

export default function UnifiedConsultantsAndContactsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => setRefreshKey((prev) => prev + 1);

  const [activeTab, setActiveTab] = useState<"all" | "danisman" | "yonetim">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    id: string;
    type: MemberType;
    ad_soyad: string;
    unvan: string;
    telefon: string;
    aktif: boolean;
  } | null>(null);

  const [deletingItem, setDeletingItem] = useState<{
    id: string;
    type: MemberType;
    ad_soyad: string;
    unvan: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    type: "danisman" as MemberType,
    ad_soyad: "",
    unvan: "Bölge Satış Danışmanı",
    telefon: "",
    aktif: true,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const consultants = useMemo(() => {
    void refreshKey;
    return DataService.getConsultants();
  }, [refreshKey]);

  const contacts = useMemo(() => {
    void refreshKey;
    return DataService.getContactPersons();
  }, [refreshKey]);

  const profiles = useMemo(() => {
    void refreshKey;
    return DataService.getProfiles();
  }, [refreshKey]);

  // Open modal for new member
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      type: activeTab === "yonetim" ? "yonetim" : "danisman",
      ad_soyad: "",
      unvan: activeTab === "yonetim" ? "Mağaza & Sipariş Yetkilisi" : "Bölge Satış Danışmanı",
      telefon: "05",
      aktif: true,
    });
    setIsModalOpen(true);
  };

  // Open modal for editing existing member
  const handleOpenEdit = (item: {
    id: string;
    type: MemberType;
    ad_soyad: string;
    unvan: string;
    telefon: string;
    aktif: boolean;
  }) => {
    setEditingItem(item);
    setFormData({
      type: item.type,
      ad_soyad: item.ad_soyad,
      unvan: item.unvan,
      telefon: item.telefon,
      aktif: item.aktif,
    });
    setIsModalOpen(true);
  };

  // Save handler (Add or Update)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ad_soyad.trim() || !formData.telefon.trim()) return;

    if (editingItem) {
      if (editingItem.type === "danisman") {
        DataService.updateConsultant(editingItem.id, {
          ad_soyad: formData.ad_soyad.trim(),
          telefon: formData.telefon.trim(),
          aktif: formData.aktif,
        });
      } else {
        DataService.updateContactPerson(editingItem.id, {
          ad_soyad: formData.ad_soyad.trim(),
          unvan: formData.unvan.trim(),
          telefon: formData.telefon.trim(),
          aktif: formData.aktif,
        });
      }
      showToast(`${formData.ad_soyad} başarıyla güncellendi.`);
    } else {
      if (formData.type === "danisman") {
        DataService.addConsultant({
          ad_soyad: formData.ad_soyad.trim(),
          telefon: formData.telefon.trim(),
          aktif: formData.aktif,
        });
      } else {
        DataService.addContactPerson({
          ad_soyad: formData.ad_soyad.trim(),
          unvan: formData.unvan.trim() || "Mağaza Yetkilisi",
          telefon: formData.telefon.trim(),
          sira: contacts.length + 1,
          aktif: formData.aktif,
        });
      }
      showToast(`Yeni kişi (${formData.ad_soyad}) eklendi.`);
    }

    setIsModalOpen(false);
    refresh();
  };

  // Toggle active status
  const handleToggleActive = (id: string, type: MemberType) => {
    if (type === "danisman") {
      DataService.toggleConsultantActive(id);
    } else {
      DataService.toggleContactPersonActive(id);
    }
    refresh();
  };

  // Up / Down reorder
  const handleReorder = (id: string, type: MemberType, dir: "up" | "down") => {
    if (type === "danisman") {
      DataService.reorderConsultant(id, dir);
    } else {
      DataService.reorderContactPerson(id, dir);
    }
    refresh();
  };

  // Delete handler
  const handleConfirmDelete = () => {
    if (!deletingItem) return;

    if (deletingItem.type === "danisman") {
      DataService.deleteConsultant(deletingItem.id);
    } else {
      DataService.deleteContactPerson(deletingItem.id);
    }

    showToast(`${deletingItem.ad_soyad} kaydı silindi.`);
    setDeletingItem(null);
    refresh();
  };

  // Combined unified list
  const unifiedList = useMemo(() => {
    const list: Array<{
      id: string;
      type: MemberType;
      ad_soyad: string;
      unvan: string;
      telefon: string;
      aktif: boolean;
      assignedCount?: number;
      originalIndex: number;
    }> = [];

    if (activeTab === "all" || activeTab === "danisman") {
      consultants.forEach((c, idx) => {
        const assigned = profiles.filter((p) => p.danisman_id === c.id).length;
        list.push({
          id: c.id,
          type: "danisman",
          ad_soyad: c.ad_soyad,
          unvan: "Bölge Satış Danışmanı",
          telefon: c.telefon,
          aktif: c.aktif !== false,
          assignedCount: assigned,
          originalIndex: idx,
        });
      });
    }

    if (activeTab === "all" || activeTab === "yonetim") {
      contacts.forEach((c, idx) => {
        list.push({
          id: c.id,
          type: "yonetim",
          ad_soyad: c.ad_soyad,
          unvan: c.unvan || "Mağaza & Koordinasyon",
          telefon: c.telefon,
          aktif: c.aktif !== false,
          originalIndex: idx,
        });
      });
    }

    return list;
  }, [consultants, contacts, profiles, activeTab]);

  const totalMembers = consultants.length + contacts.length;
  const totalActive =
    consultants.filter((c) => c.aktif !== false).length +
    contacts.filter((c) => c.aktif !== false).length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-brand-red" />
              <span>Satış Danışmanları &amp; İletişim Kadrosu</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-brand-red border border-rose-100">
              Toplam {totalMembers} Yetkili ({totalActive} Aktif)
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Saha satış danışmanlarını ve mağaza iletişim yetkililerini tek karttan yönetin, aktiflik durumlarını ve sıralamalarını belirleyin.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="gap-2 bg-brand-red hover:bg-rose-700 text-white shadow-sm text-xs font-bold self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Kişi Tanımla</span>
        </Button>
      </div>

      {/* Filter / View Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "all"
              ? "bg-brand-red text-white shadow-sm shadow-rose-200"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900"
          }`}
        >
          Tüm Kadro ({totalMembers})
        </button>

        <button
          onClick={() => setActiveTab("danisman")}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "danisman"
              ? "bg-brand-blue text-white shadow-sm shadow-sky-200"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900"
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Satış Danışmanları ({consultants.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("yonetim")}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "yonetim"
              ? "bg-emerald-600 text-white shadow-sm shadow-emerald-200"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Mağaza &amp; Yönetim Yetkilileri ({contacts.length})</span>
        </button>
      </div>

      {/* Unified Card Container & Table (as requested by user) */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-stone-900">
              Kayıtlı Kadro Listesi ({unifiedList.length})
            </h2>
          </div>
          <span className="text-xs text-stone-400">
            Oklar ile sıralamayı değiştirebilir, butona tıklayarak Aktif/Pasif yapabilirsiniz
          </span>
        </div>

        {unifiedList.length === 0 ? (
          <div className="text-center py-12 text-stone-400 text-xs">
            Bu kategoride kayıtlı danışman veya yetkili bulunmuyor.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 border-b border-stone-200/70 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 w-16 text-center">Sıra</th>
                  <th className="py-3 px-4">Yetkili / Danışman</th>
                  <th className="py-3 px-4">Görev / Kadro Türü</th>
                  <th className="py-3 px-4">Telefon Numarası</th>
                  <th className="py-3 px-4 text-center">Görünürlük Durumu</th>
                  <th className="py-3 px-4 text-center">Bağlı Bayi</th>
                  <th className="py-3 px-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {unifiedList.map((item, index) => {
                  const isDanisman = item.type === "danisman";
                  const canMoveUp = item.originalIndex > 0;
                  const canMoveDown =
                    item.originalIndex <
                    (isDanisman ? consultants.length - 1 : contacts.length - 1);

                  return (
                    <tr
                      key={`${item.type}-${item.id}`}
                      className={`hover:bg-stone-50/80 transition-colors ${
                        !item.aktif ? "bg-stone-50/40 opacity-75" : ""
                      }`}
                    >
                      {/* Sıra & Reorder Buttons */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleReorder(item.id, item.type, "up")}
                            disabled={!canMoveUp}
                            className="p-1 text-stone-400 hover:text-stone-800 disabled:opacity-20 disabled:hover:text-stone-400 transition-colors"
                            title="Yukarı Taşı"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-5 text-center font-bold text-stone-700">
                            {index + 1}
                          </span>
                          <button
                            onClick={() => handleReorder(item.id, item.type, "down")}
                            disabled={!canMoveDown}
                            className="p-1 text-stone-400 hover:text-stone-800 disabled:opacity-20 disabled:hover:text-stone-400 transition-colors"
                            title="Aşağı Taşı"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Ad Soyad */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                              isDanisman
                                ? "bg-sky-50 text-brand-blue"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {item.ad_soyad.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-stone-900 text-sm">
                              {item.ad_soyad}
                            </div>
                            <div className="text-[10px] text-stone-400">
                              ID: {item.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Görev & Kadro Türü */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-xs font-semibold">
                            {item.unvan}
                          </span>
                          <div>
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                isDanisman
                                  ? "bg-sky-50 text-brand-blue border border-sky-100"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              }`}
                            >
                              {isDanisman ? "Saha Danışmanı" : "Mağaza & Yönetim"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Telefon */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-stone-800">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-stone-400" />
                          <a
                            href={`tel:${item.telefon.replace(/\s+/g, "")}`}
                            className="hover:text-brand-red transition-colors"
                          >
                            {item.telefon}
                          </a>
                        </div>
                      </td>

                      {/* Aktiflik / Görünürlük Durumu Toggle (As requested) */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(item.id, item.type)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all border cursor-pointer active:scale-95 ${
                            item.aktif
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                              : "bg-stone-100 text-stone-500 border-stone-300 hover:bg-stone-200"
                          }`}
                          title={item.aktif ? "Tıkla: Pasif Yap" : "Tıkla: Aktif Yap"}
                        >
                          {item.aktif ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>AKTİF</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-stone-400" />
                              <span>PASİF</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Bağlı Bayi / Müşteri Sayısı */}
                      <td className="py-3.5 px-4 text-center">
                        {isDanisman ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-stone-100 text-stone-700 font-bold text-xs">
                            <Users className="w-3 h-3 text-stone-400" />
                            <span>{item.assignedCount} Bayi</span>
                          </span>
                        ) : (
                          <span className="text-stone-300 text-xs">—</span>
                        )}
                      </td>

                      {/* İşlemler */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors border border-stone-200"
                            title="Düzenle"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setDeletingItem({
                                id: item.id,
                                type: item.type,
                                ad_soyad: item.ad_soyad,
                                unvan: item.unvan,
                              })
                            }
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
                            title="Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Yetkili / Danışman Düzenle" : "Yeni Yetkili / Danışman Ekle"}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {!editingItem && (
            <div>
              <label className="block font-bold text-stone-700 mb-1.5">
                Kadro Türü
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      type: "danisman",
                      unvan: "Bölge Satış Danışmanı",
                    })
                  }
                  className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                    formData.type === "danisman"
                      ? "border-brand-blue bg-sky-50 text-brand-blue shadow-sm"
                      : "border-stone-200 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs">
                    <UserCheck className="w-4 h-4" />
                    <span>Satış Danışmanı</span>
                  </div>
                  <div className="text-[10px] text-stone-400 font-normal mt-0.5">
                    Müşteri &amp; sipariş bağlanabilir
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      type: "yonetim",
                      unvan: "Mağaza & Sipariş Koordinatörü",
                    })
                  }
                  className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                    formData.type === "yonetim"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm"
                      : "border-stone-200 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs">
                    <Building2 className="w-4 h-4" />
                    <span>Mağaza / Yönetim</span>
                  </div>
                  <div className="text-[10px] text-stone-400 font-normal mt-0.5">
                    İletişim sayfasında doğrudan hat
                  </div>
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-stone-700 mb-1">
              Ad Soyad <span className="text-brand-red">*</span>
            </label>
            <Input
              type="text"
              required
              value={formData.ad_soyad}
              onChange={(e) => setFormData({ ...formData, ad_soyad: e.target.value })}
              placeholder="Örn: Mehmet Kaya"
              className="text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">
              Görev / Ünvan <span className="text-brand-red">*</span>
            </label>
            <Input
              type="text"
              required
              value={formData.unvan}
              onChange={(e) => setFormData({ ...formData, unvan: e.target.value })}
              placeholder="Örn: Saha Satış &amp; Sipariş Danışmanı"
              className="text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">
              Telefon Numarası <span className="text-brand-red">*</span>
            </label>
            <Input
              type="tel"
              required
              value={formData.telefon}
              onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
              placeholder="0532 000 00 00"
              className="text-xs"
            />
          </div>

          <div className="pt-2 border-t border-stone-100">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-800 select-none">
              <input
                type="checkbox"
                checked={formData.aktif}
                onChange={(e) => setFormData({ ...formData, aktif: e.target.checked })}
                className="w-4 h-4 rounded border-stone-300 text-brand-red accent-brand-red cursor-pointer"
              />
              <span>Sistemde ve Vitrinde Aktif Göster</span>
            </label>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-stone-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="text-xs"
            >
              Vazgeç
            </Button>
            <Button
              type="submit"
              className="bg-brand-red hover:bg-rose-700 text-white text-xs font-bold"
            >
              {editingItem ? "Değişiklikleri Kaydet" : "Kaydet"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        title="Kişi / Danışman Kaydını Sil"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-rose-50 text-rose-800 rounded-xl flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>{deletingItem?.ad_soyad}</strong> ({deletingItem?.unvan}) adlı kaydı listeden silmek istediğinize emin misiniz?
            </p>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingItem(null)}
              className="text-xs"
            >
              Vazgeç
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
            >
              Kaydı Sil
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
