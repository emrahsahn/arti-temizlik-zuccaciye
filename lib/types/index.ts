export type UserRole = "admin" | "musteri";

export interface Profile {
  id: string;
  username: string;
  role: UserRole;
  danisman_id?: string | null;
  ad_soyad?: string;
  firma_adi?: string;
  telefon?: string;
  adres?: string;
  created_at: string;
}

export interface Danisman {
  id: string;
  ad_soyad: string;
  telefon: string;
  aktif?: boolean;
}

export interface Kategori {
  id: string;
  ad: string;
  slug: string;
  sira: number;
  parent_id?: string | null;
  icon_name?: string;
  aktif?: boolean;
}

export interface Urun {
  id: string;
  ad: string;
  kategori_id: string;
  fiyat: number;
  birim: string; // "Koli", "Paket", "Adet", "Litre"
  aciklama?: string;
  gorsel_url?: string;
  aktif: boolean;
  cok_satan: boolean;
  haftanin_urunu: boolean;
  stok_durumu?: "var" | "tukendi" | "sorunuz";
  created_at?: string;
}

export type SiparisDurumu = "beklemede" | "onaylandi" | "tamamlandi" | "iptal";

export interface SiparisKalemi {
  id: string;
  siparis_id: string;
  urun_id: string;
  adet: number;
  birim_fiyat: number;
  not?: string;
  urun?: Urun;
}

export interface Siparis {
  id: string;
  user_id: string;
  danisman_id?: string | null;
  status: SiparisDurumu;
  toplam_tutar: number;
  siparis_notu?: string;
  created_at: string;
  kalemler?: SiparisKalemi[];
  musteri?: Profile;
  danisman?: Danisman;
}

export interface Kampanya {
  id: string;
  baslik: string;
  aciklama: string;
  gorsel_url?: string;
  cta_link?: string;
  cta_text?: string;
  badge_text?: string;
  sira: number;
  aktif: boolean;
  urun_ids?: string[];
}

export interface IletisimKisi {
  id: string;
  ad_soyad: string;
  unvan: string;
  telefon: string;
  sira: number;
  aktif?: boolean;
  footer_goster?: boolean;
}

export interface SiteAyarlari {
  id: string;
  cok_satanlar_modu: "manuel" | "otomatik";
  haftanin_urunleri_modu: "manuel" | "otomatik";
}

export interface CartItem {
  urun: Urun;
  adet: number;
  not?: string;
}
