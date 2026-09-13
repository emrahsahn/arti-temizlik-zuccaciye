-- rls.sql
-- Artı Temizlik Züccaciye Row Level Security Politikaları

-- RLS Etkinleştirme
ALTER TABLE public.danismanlar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kategoriler ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.urunler ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.siparisler ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.siparis_kalemleri ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kampanyalar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iletisim_kisileri ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ayarlar ENABLE ROW LEVEL SECURITY;

-- Yardımcı Fonksiyon: Kullanıcının admin olup olmadığını sorgular
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Danışmanlar: Herkes okuyabilir, sadece admin yönetebilir
CREATE POLICY "Danismanlar herkes tarafindan okunabilir"
ON public.danismanlar FOR SELECT USING (true);

CREATE POLICY "Danismanlar sadece admin tarafindan yonetilir"
ON public.danismanlar FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 2. Profiller: Kullanıcı kendi profilini okur; Admin tümünü okur ve yönetir
CREATE POLICY "Profilleri sahibi ve admin okuyabilir"
ON public.profiles FOR SELECT
USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Kullanici kendi profilini guncelleyebilir"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin profilleri yonetebilir"
ON public.profiles FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 3. Kategoriler & Ürünler & Kampanyalar & İletişim: Herkes okuyabilir, admin yönetir
CREATE POLICY "Kategoriler halka acik okunur"
ON public.kategoriler FOR SELECT USING (true);
CREATE POLICY "Kategorileri sadece admin yonetir"
ON public.kategoriler FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Urunler halka acik okunur"
ON public.urunler FOR SELECT USING (aktif = true OR public.is_admin());
CREATE POLICY "Urunleri sadece admin yonetir"
ON public.urunler FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Kampanyalar halka acik okunur"
ON public.kampanyalar FOR SELECT USING (aktif = true OR public.is_admin());
CREATE POLICY "Kampanyalari sadece admin yonetir"
ON public.kampanyalar FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Iletisim kisileri halka acik okunur"
ON public.iletisim_kisileri FOR SELECT USING (true);
CREATE POLICY "Iletisim kisilerini sadece admin yonetir"
ON public.iletisim_kisileri FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Ayarlar herkes tarafindan okunur"
ON public.ayarlar FOR SELECT USING (true);
CREATE POLICY "Ayarlari sadece admin gunceller"
ON public.ayarlar FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 4. Siparişler: Müşteri kendi siparişini görür ve ekler; Admin hepsini görür ve düzenler
CREATE POLICY "Musteri kendi siparisini gorur, admin hepsini gorur"
ON public.siparisler FOR SELECT
USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Musteri kendi siparisini ekler"
ON public.siparisler FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin siparisleri guncelleyebilir"
ON public.siparisler FOR UPDATE
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 5. Sipariş Kalemleri
CREATE POLICY "Musteri kendi siparis kalemlerini gorur, admin hepsini gorur"
ON public.siparis_kalemleri FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.siparisler
    WHERE public.siparisler.id = siparis_kalemleri.siparis_id
    AND (public.siparisler.user_id = auth.uid() OR public.is_admin())
  )
);

CREATE POLICY "Musteri siparis kalemi ekler"
ON public.siparis_kalemleri FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.siparisler
    WHERE public.siparisler.id = siparis_kalemleri.siparis_id
    AND public.siparisler.user_id = auth.uid()
  )
);
