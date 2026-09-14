import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, ShieldCheck, Mail } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-stone-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <Image
              src="/logo.png"
              alt="Artı Temizlik Züccaciye"
              width={240}
              height={76}
              className="h-12 w-auto object-contain"
            />
            <p className="text-xs text-stone-500 leading-relaxed">
              Anamur ve çevresinde temizlik kimyasalları, sarf kağıt ürünleri, endüstriyel hijyen ekipmanları ve züccaciye toptan &amp; perakende tedarikçisi.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-700 pt-2">
              <ShieldCheck className="w-4 h-4 text-brand-red" />
              <span>Yetkili Bölge Dağıtıcısı</span>
            </div>
          </div>

          {/* Col 2: Adres ve Çalışma Saatleri */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Adres &amp; Sevkiyat
            </h4>
            <div className="space-y-2.5 text-xs text-stone-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                <span>
                  Sağlık Mahallesi, H.Edip Adıvar Cad. No: 36/B, Anamur / Mersin
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
                <span>
                  Pazartesi - Cumartesi: 08:00 - 19:00
                  <br />
                  Pazar: Kapalı (Acil Sipariş: Danışman Hattı)
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
                <span>siparis@artitemizlik.com</span>
              </div>
            </div>
          </div>

          {/* Col 3: Hızlı Bağlantılar */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Kurumsal &amp; Destek
            </h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>
                <Link href="/" className="hover:text-brand-red transition-colors">
                  Ürün Kataloğu
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="hover:text-brand-red transition-colors">
                  İletişim &amp; Danışmanlar
                </Link>
              </li>
              <li>
                <Link href="/giris" className="hover:text-brand-red transition-colors">
                  Müşteri &amp; Bayi Girişi
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & Developer Credit */}
        <div className="mt-12 pt-6 border-t border-stone-100 flex flex-col items-center justify-center gap-2 text-xs text-stone-400 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2.5">
            <p>© {new Date().getFullYear()} Artı Temizlik Züccaciye. Tüm hakları saklıdır.</p>
            <span className="hidden sm:inline text-stone-300">•</span>
            <p>Anamur, Bozyazı ve Aydıncık bölgesine özel toptan &amp; perakende tedarik.</p>
          </div>

          <div className="pt-0.5">
            <a
              href="https://www.linkedin.com/in/emrah-şahin/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-stone-400 hover:text-brand-red transition-colors"
            >
              <span>Tasarım &amp; Yazılım:</span>
              <span className="font-medium text-stone-600 hover:text-brand-red underline decoration-stone-300 underline-offset-2 hover:decoration-brand-red">
                Emrah Şahin
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
