"use client";

import React, { useState, useMemo } from "react";
import { DataService } from "@/lib/dataService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Profile } from "@/lib/types";
import {
  Users,
  UserPlus,
  Shield,
  Building2,
  Phone,
  MapPin,
  CheckCircle2,
} from "lucide-react";

export default function AdminUsersPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firma_adi: "",
    ad_soyad: "",
    telefon: "",
    adres: "",
    danisman_id: "dan-1",
  });

  const profiles = useMemo(() => {
    void refreshKey;
    return DataService.getProfiles();
  }, [refreshKey]);
  const consultants = useMemo(() => DataService.getConsultants(), []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username) return;

    DataService.addProfile({
      username: formData.username.toLowerCase().trim(),
      role: "musteri",
      firma_adi: formData.firma_adi,
      ad_soyad: formData.ad_soyad,
      telefon: formData.telefon,
      adres: formData.adres,
      danisman_id: formData.danisman_id,
    });

    setSuccessMsg(`"${formData.username}" müşteri hesabı başarıyla tanımlandı.`);
    setTimeout(() => setSuccessMsg(null), 3500);

    setFormData({
      username: "",
      password: "",
      firma_adi: "",
      ad_soyad: "",
      telefon: "",
      adres: "",
      danisman_id: consultants[0]?.id || "dan-1",
    });
    setIsModalOpen(false);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Müşteri ve Bayi Hesapları
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Kapalı devre mimari: Sadece admin yeni müşteri tanımlayabilir ve sorumlu satış danışmanı atayabilir.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsModalOpen(true)}
          className="gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Yeni Müşteri Tanımla</span>
        </Button>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/60 text-stone-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Kullanıcı Adı</th>
                <th className="py-3 px-4">Firma / Yetkili</th>
                <th className="py-3 px-4">Rol</th>
                <th className="py-3 px-4">Sorumlu Danışman</th>
                <th className="py-3 px-4">Telefon</th>
                <th className="py-3 px-4">Bölge / Adres</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {profiles.map((p) => {
                const danisman = consultants.find((d) => d.id === p.danisman_id);

                return (
                  <tr key={p.id} className="hover:bg-stone-50/50">
                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      @{p.username}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">
                        {p.firma_adi || "-"}
                      </div>
                      <div className="text-[11px] text-stone-400">
                        {p.ad_soyad || "-"}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {p.role === "admin" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-brand-red border border-rose-200">
                          <Shield className="w-3 h-3" />
                          YÖNETİCİ
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-brand-blue border border-sky-200">
                          MÜŞTERİ / BAYİ
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">
                      {danisman ? danisman.ad_soyad : p.role === "admin" ? "Sistem" : "Atanmadı"}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">
                      {p.telefon || "-"}
                    </td>
                    <td className="py-3.5 px-4 text-stone-500 max-w-xs truncate">
                      {p.adres || "Anamur / Mersin"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Yeni Müşteri / Bayi Hesabı Tanımla"
        maxWidth="lg"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                label="Kullanıcı Adı"
                placeholder="örn: bozyazirestoran"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Input
                label="İlk Giriş Şifresi"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                label="Firma / İşletme Adı"
                placeholder="örn: Bozyazi Sahil Restoran"
                value={formData.firma_adi}
                onChange={(e) =>
                  setFormData({ ...formData, firma_adi: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Input
                label="Yetkili Adı Soyadı"
                placeholder="örn: Ali Demir"
                value={formData.ad_soyad}
                onChange={(e) =>
                  setFormData({ ...formData, ad_soyad: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                label="Telefon"
                placeholder="0530 000 00 00"
                value={formData.telefon}
                onChange={(e) =>
                  setFormData({ ...formData, telefon: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Sorumlu Danışman
              </label>
              <select
                value={formData.danisman_id}
                onChange={(e) =>
                  setFormData({ ...formData, danisman_id: e.target.value })
                }
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-red"
              >
                {consultants.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.ad_soyad} ({c.telefon})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Input
              label="Teslimat Adresi"
              placeholder="Mahalle, Cadde, No, İlçe"
              value={formData.adres}
              onChange={(e) =>
                setFormData({ ...formData, adres: e.target.value })
              }
            />
          </div>

          <p className="text-[11px] text-stone-400 italic">
            * Müşteri sisteme bu kullanıcı adı ve belirlediğiniz şifre ile giriş yapacak, siparişleri seçtiğiniz danışmana yönlendirilecektir.
          </p>

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
              Hesabı Oluştur
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
