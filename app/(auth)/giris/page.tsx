"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, User, AlertCircle, ArrowLeft, ShieldCheck } from "lucide-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const { login, user } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Progressive lockout state
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        router.push(redirect || "/admin");
      } else {
        router.push(redirect || "/panel");
      }
    }
  }, [user, router, redirect]);

  // Handle countdown timer
  useEffect(() => {
    if (lockoutTimer > 0) {
      const timer = setTimeout(() => {
        setLockoutTimer((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [lockoutTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Honeypot check
    if (honeypot) {
      console.warn("Spam bot detected via honeypot field");
      return;
    }

    // 2. Lockout check
    if (lockoutTimer > 0) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await login(username, password);

      if (!res.success) {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);

        if (nextAttempts >= 5) {
          setLockoutTimer(30);
          setError("Çok fazla hatalı deneme yapıldı. Lütfen 30 saniye bekleyin.");
        } else if (nextAttempts >= 3) {
          setLockoutTimer(5);
          setError("Hatalı giriş. Güvenliğiniz için 5 saniye bekleyin.");
        } else {
          setError(res.error || "Kullanıcı adı veya şifre hatalı.");
        }
      } else {
        // Success
        setFailedAttempts(0);
      }
    } catch {
      setError("Bağlantı hatası oluştu. Lütfen tekrar deneyiniz.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setError(null);
  };

  return (
    <div className="w-full max-w-md">
      {/* Back to Showcase link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Ürün Kataloğuna Geri Dön
      </Link>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/60 border border-stone-200/80 p-5 sm:p-8">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/logo.png"
              alt="Artı Temizlik Züccaciye"
              width={260}
              height={82}
              className="h-14 w-auto mx-auto object-contain"
              priority
            />
          </Link>
          <h1 className="mt-4 text-xl font-bold text-stone-900">
            Müşteri & Bayi Girişi
          </h1>
          <p className="mt-1 text-xs text-stone-500">
            Sipariş vermek ve geçmiş siparişlerinizi takip etmek için giriş yapınız.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot field */}
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div>
            <div className="relative">
              <Input
                label="Kullanıcı Adı"
                id="username"
                type="text"
                placeholder="örn: anamurotel"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoCapitalize="none"
                autoCorrect="off"
              />
              <User className="w-4 h-4 text-stone-400 absolute right-3.5 top-9 pointer-events-none" />
            </div>
          </div>

          <div>
            <div className="relative">
              <Input
                label="Şifre"
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock className="w-4 h-4 text-stone-400 absolute right-3.5 top-9 pointer-events-none" />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={isLoading}
            disabled={lockoutTimer > 0}
          >
            {lockoutTimer > 0
              ? `${lockoutTimer}s Bekleyin...`
              : "Güvenli Giriş Yap"}
          </Button>
        </form>

        {/* Security Note */}
        <div className="mt-6 pt-5 border-t border-stone-100 flex items-center justify-center gap-2 text-[11px] text-stone-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>256-Bit SSL ve Brute-Force Korumalı Sistem</span>
        </div>
      </div>

      {/* Demo Accounts Quick-Fill Box */}
      <div className="mt-6 p-4 rounded-xl bg-stone-100/90 border border-stone-200 text-xs text-stone-600">
        <div className="font-bold text-stone-800 mb-2 flex items-center justify-between">
          <span>Hızlı Test Hesapları:</span>
          <span className="text-[10px] bg-stone-200 px-1.5 py-0.5 rounded text-stone-600">
            Tıkla & Doldur
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleDemoFill("admin", "admin123")}
            className="p-2 bg-white border border-stone-200 rounded-lg hover:border-brand-red hover:text-brand-red text-left transition-colors"
          >
            <div className="font-semibold text-[11px]">Yönetici (Admin)</div>
            <div className="text-[10px] text-stone-400">admin / admin123</div>
          </button>
          <button
            type="button"
            onClick={() => handleDemoFill("anamurotel", "otel123")}
            className="p-2 bg-white border border-stone-200 rounded-lg hover:border-brand-blue hover:text-brand-blue text-left transition-colors"
          >
            <div className="font-semibold text-[11px]">Anamur Otel (Bayi)</div>
            <div className="text-[10px] text-stone-400">anamurotel / otel123</div>
          </button>
          <button
            type="button"
            onClick={() => handleDemoFill("akdenizmarket", "market123")}
            className="p-2 bg-white border border-stone-200 rounded-lg hover:border-brand-blue hover:text-brand-blue text-left transition-colors"
          >
            <div className="font-semibold text-[11px]">Akdeniz Market</div>
            <div className="text-[10px] text-stone-400">akdenizmarket / market123</div>
          </button>
        </div>
        <p className="mt-2 text-[10px] text-stone-400 text-center">
          Yeni müşteri hesabı tanımlama ve şifre sıfırlama işlemleri sadece Admin panelinden gerçekleştirilir.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-[#FAFAF9]">
      <Suspense
        fallback={
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red" />
        }
      >
        <LoginFormContent />
      </Suspense>
    </main>
  );
}
