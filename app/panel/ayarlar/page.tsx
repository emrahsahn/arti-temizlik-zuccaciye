"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/store/authStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldCheck, KeyRound, CheckCircle2, AlertCircle, User } from "lucide-react";

export default function CustomerSettingsPage() {
  const { user, updatePassword } = useAuth();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("Yeni şifreler birbiriyle eşleşmiyor.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Yeni şifre en az 6 karakter olmalıdır.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await updatePassword(oldPassword, newPassword);
      if (res.success) {
        setSuccess("Şifreniz başarıyla güncellendi.");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(res.error || "Şifre güncellenirken hata oluştu.");
      }
    } catch {
      setError("İşlem gerçekleştirilemedi. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-stone-900">Hesap ve Şifre Güvenliği</h2>
        <p className="text-xs text-stone-500">
          Kullanıcı hesabınıza ait güvenlik ayarlarını buradan yönetebilirsiniz.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <User className="w-4 h-4 text-brand-blue" />
          <span>Firma ve İletişim Bilgileri</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-stone-50 rounded-xl">
            <span className="text-stone-400 block mb-0.5">Kullanıcı Adı</span>
            <span className="font-bold text-stone-900">@{user.username}</span>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl">
            <span className="text-stone-400 block mb-0.5">Firma / Unvan</span>
            <span className="font-bold text-stone-900">
              {user.firma_adi || user.ad_soyad || "-"}
            </span>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl">
            <span className="text-stone-400 block mb-0.5">Telefon</span>
            <span className="font-bold text-stone-900">{user.telefon || "-"}</span>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl">
            <span className="text-stone-400 block mb-0.5">Adres</span>
            <span className="font-bold text-stone-900">{user.adres || "Anamur / Mersin"}</span>
          </div>
        </div>

        <p className="text-[11px] text-stone-400 italic">
          * Firma unvanı veya adres değişikliği için lütfen sorumlu satış danışmanınızla iletişime geçiniz.
        </p>
      </div>

      {/* Password Change Form */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-4">
          <KeyRound className="w-4 h-4 text-brand-red" />
          <span>Şifremi Değiştir</span>
        </h3>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Mevcut Şifre"
            type="password"
            placeholder="••••••••"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />

          <Input
            label="Yeni Şifre"
            type="password"
            placeholder="En az 6 karakter"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <Input
            label="Yeni Şifre (Tekrar)"
            type="password"
            placeholder="Yeni şifrenizi doğrulayın"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            className="w-full sm:w-auto"
          >
            Şifreyi Güncelle
          </Button>
        </form>
      </div>
    </div>
  );
}
