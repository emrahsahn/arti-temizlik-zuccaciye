-- 001_initial_schema.sql
-- Artı Temizlik Züccaciye Veritabanı Şeması

-- 1. Danışmanlar Tablosu
CREATE TABLE IF NOT EXISTS public.danismanlar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ad_soyad TEXT NOT NULL,
    telefon TEXT NOT NULL,
    aktif BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Kullanıcı Profilleri (auth.users ile 1-1)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'musteri' CHECK (role IN ('admin', 'musteri')),
    danisman_id UUID REFERENCES public.danismanlar(id) ON DELETE SET NULL,
    ad_soyad TEXT,
    firma_adi TEXT,
    telefon TEXT,
    adres TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Kategoriler Tablosu
CREATE TABLE IF NOT EXISTS public.kategoriler (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ad TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    sira INT DEFAULT 0,
    parent_id UUID REFERENCES public.kategoriler(id) ON DELETE CASCADE,
    icon_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Ürünler Tablosu
CREATE TABLE IF NOT EXISTS public.urunler (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ad TEXT NOT NULL,
    kategori_id UUID REFERENCES public.kategoriler(id) ON DELETE SET NULL,
    fiyat NUMERIC(12, 2) NOT NULL DEFAULT 0,
    birim TEXT NOT NULL DEFAULT 'Adet', -- Koli, Paket, Adet, Litre
    aciklama TEXT,
    gorsel_url TEXT,
    aktif BOOLEAN DEFAULT true,
    cok_satan BOOLEAN DEFAULT false,
    haftanin_urunu BOOLEAN DEFAULT false,
    stok_durumu TEXT DEFAULT 'var' CHECK (stok_durumu IN ('var', 'tukendi', 'sorunuz')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Siparişler Tablosu
CREATE TABLE IF NOT EXISTS public.siparisler (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    danisman_id UUID REFERENCES public.danismanlar(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'beklemede' CHECK (status IN ('beklemede', 'onaylandi', 'tamamlandi', 'iptal')),
    toplam_tutar NUMERIC(12, 2) NOT NULL DEFAULT 0,
    siparis_notu TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Sipariş Kalemleri Tablosu
CREATE TABLE IF NOT EXISTS public.siparis_kalemleri (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    siparis_id UUID REFERENCES public.siparisler(id) ON DELETE CASCADE NOT NULL,
    urun_id UUID REFERENCES public.urunler(id) ON DELETE RESTRICT NOT NULL,
    adet INT NOT NULL CHECK (adet > 0),
    birim_fiyat NUMERIC(12, 2) NOT NULL DEFAULT 0,
    not TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Kampanyalar ve Vitrin Bannerları
CREATE TABLE IF NOT EXISTS public.kampanyalar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    baslik TEXT NOT NULL,
    aciklama TEXT,
    gorsel_url TEXT,
    cta_link TEXT DEFAULT '/',
    cta_text TEXT DEFAULT 'İncele',
    badge_text TEXT,
    sira INT DEFAULT 0,
    aktif BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Dinamik İletişim Kişileri (Örn. Mustafa Köprülü, Serpil Köprülü)
CREATE TABLE IF NOT EXISTS public.iletisim_kisileri (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ad_soyad TEXT NOT NULL,
    unvan TEXT NOT NULL,
    telefon TEXT NOT NULL,
    sira INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Site Ayarları (Çok Satanlar & Haftanın Ürünleri Modu vb.)
CREATE TABLE IF NOT EXISTS public.ayarlar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cok_satanlar_modu TEXT DEFAULT 'manuel' CHECK (cok_satanlar_modu IN ('manuel', 'otomatik')),
    haftanin_urunleri_modu TEXT DEFAULT 'manuel' CHECK (haftanin_urunleri_modu IN ('manuel', 'otomatik')),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Varsayılan tekil ayar kaydı
INSERT INTO public.ayarlar (id, cok_satanlar_modu, haftanin_urunleri_modu)
VALUES ('00000000-0000-0000-0000-000000000001', 'manuel', 'manuel')
ON CONFLICT (id) DO NOTHING;
