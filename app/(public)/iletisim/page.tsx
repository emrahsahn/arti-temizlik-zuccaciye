"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { DataService } from "@/lib/dataService";
import { MOCK_ILETISIM_KISILERI, MOCK_DANISMANLAR } from "@/lib/mockData";
import { IletisimKisi, Danisman } from "@/lib/types";
import {
  Phone,
  MapPin,
  Clock,
  Truck,
  ArrowLeft,
  UserCheck,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";

export default function ContactPage() {
  const [contacts, setContacts] = useState<IletisimKisi[]>(() => [...MOCK_ILETISIM_KISILERI]);
  const [consultants, setConsultants] = useState<Danisman[]>(() => [...MOCK_DANISMANLAR]);

  useEffect(() => {
    const sync = () => {
      setContacts(DataService.getContactPersons());
      setConsultants(DataService.getConsultants());
    };
    sync();

    window.addEventListener("arti_contacts_updated", sync);
    window.addEventListener("arti_consultants_updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("arti_contacts_updated", sync);
      window.removeEventListener("arti_consultants_updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kataloğa Geri Dön
        </Link>

        {/* Hero Section */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-10 shadow-sm mb-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-brand-red text-xs font-bold mb-3 border border-rose-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              DOĞRUDAN DANIŞMAN İLETİŞİMİ
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Satış Danışmanlarımız ve İletişim
            </h1>
            <p className="mt-2 text-sm text-stone-600 leading-relaxed">
              Toptan temizlik malzemeleri, koli alımları ve züccaciye ürünleri için işletmenize özel danışmanlarımızla hemen irtibata geçebilirsiniz.
            </p>
          </div>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Danışmanlar */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2 mb-4">
              <UserCheck className="w-5 h-5 text-brand-blue" />
              <span>Bölge Satış ve Saha Danışmanları</span>
            </h2>
            <div className="space-y-4">
              {consultants.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between hover:border-brand-blue/30 transition-all"
                >
                  <div>
                    <div className="font-bold text-stone-900 text-sm">
                      {c.ad_soyad}
                    </div>
                    <div className="text-xs text-stone-500 mt-0.5">
                      Saha ve Sipariş Yönetimi
                    </div>
                  </div>
                  <a
                    href={`tel:${c.telefon.replace(/\s+/g, "")}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 text-brand-blue hover:bg-brand-blue hover:text-white font-bold text-xs transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{c.telefon}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Mağaza & Koordinatörler */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5 text-brand-red" />
              <span>Yönetim ve Mağaza İletişimi</span>
            </h2>
            <div className="space-y-4">
              {contacts.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between hover:border-brand-red/30 transition-all"
                >
                  <div>
                    <div className="font-bold text-stone-900 text-sm">
                      {c.ad_soyad}
                    </div>
                    <div className="text-xs text-stone-500 mt-0.5">
                      {c.unvan}
                    </div>
                  </div>
                  <a
                    href={`tel:${c.telefon.replace(/\s+/g, "")}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 text-brand-red hover:bg-brand-red hover:text-white font-bold text-xs transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{c.telefon}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Address and Distribution Coverage */}
        <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-brand-red flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-sm text-white">Merkez Mağaza & Depo</h3>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Saray Mahallesi, İnönü Caddesi No: 45/A, Anamur / Mersin
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-brand-blue flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-sm text-white">Dağıtım Ağı</h3>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Anamur ilçe merkezi, Bozyazı ve Aydıncık ilçelerine kendi araçlarımızla düzenli sevkiyat.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-sm text-white">Çalışma Saatleri</h3>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Pazartesi - Cumartesi: 08:00 - 19:00
                <br />
                Sipariş talepleri 7/24 web sitemizden verilebilir.
              </p>
            </div>
          </div>
        </div>
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
}
