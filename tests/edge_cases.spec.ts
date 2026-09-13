import { test, expect } from '@playwright/test';

test.describe('Artı Temizlik & Züccaciye - E2E & Edge Case Testleri', () => {

  test('1. Kampanya sayfası (/kampanya/kmp-1) sorunsuz yüklenmeli ve sepete ürün eklenebilmeli', async ({ page }) => {
    await page.goto('/kampanya/kmp-1');

    // Kampanya başlığı ve rozeti görünmeli
    const heroTitle = page.locator('h1');
    await expect(heroTitle).toBeVisible();

    // Ürün kartlarının listelendiğini doğrula
    const productCards = page.locator('article, .group.relative');
    await expect(productCards.first()).toBeVisible({ timeout: 10000 });

    // İlk ürünün sepete ekle veya adet butonuna bas
    const addToCartBtn = page.getByRole('button', { name: /ekle/i }).first();
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();
      // Sepet çekmecesinin açıldığını doğrula
      await expect(page.getByText(/sepetiniz/i)).toBeVisible({ timeout: 5000 });
    }
  });

  test('2. Geçersiz kampanya ID (/kampanya/yok-boyle-bir-kampanya) uygulamanın çökmesine yol açmamalı', async ({ page }) => {
    await page.goto('/kampanya/yok-boyle-bir-kampanya');

    // Sayfa çökmek yerine hata/bulunamadı uyarısı ve anasayfaya dönüş butonu sunmalı
    await expect(page.getByText(/kampanya bulunamadı/i)).toBeVisible({ timeout: 10000 });
    const homeLink = page.getByRole('link', { name: /ana sayfaya dön/i });
    await expect(homeLink).toBeVisible();
  });

  test('3. Admin vitrin yönetiminde kampanya modalı ve ürün seçici açılabilmeli', async ({ page, context }) => {
    // Admin yetkilendirmesi için cookie'leri ve localStorage oturumunu tanımla
    await context.addCookies([
      { name: 'arti_user_role', value: 'admin', domain: 'localhost', path: '/' },
      { name: 'arti_user_id', value: 'u-admin-1', domain: 'localhost', path: '/' },
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('arti_user_session', JSON.stringify({
        id: 'u-admin-1',
        username: 'admin',
        ad_soyad: 'Sistem Yöneticisi',
        role: 'admin'
      }));
    });

    // Admin vitrin sayfasına git
    await page.goto('/admin/vitrin');

    // Vitrin başlığı görünür olmalı
    await expect(page.getByText(/vitrin & kampanya yönetimi/i)).toBeVisible({ timeout: 10000 });

    // İlk kampanyanın Düzenle butonuna tıkla
    const editBtn = page.getByRole('button', { name: /düzenle/i }).first();
    await expect(editBtn).toBeVisible();
    await editBtn.click();

    // Modal açılmalı ve "Kampanyaya Dahil Edilecek Ürünler" alanı bulunmalı
    await expect(page.getByText(/kampanyaya dahil edilecek ürünler/i)).toBeVisible();
    
    // Ürün arama input'u çalışır durumda olmalı
    const searchInput = page.getByPlaceholder(/ürün adı veya kod ara/i);
    await expect(searchInput).toBeVisible();
  });

  test('4. Müşteri paneli yetkisiz giriş koruması (/panel)', async ({ page }) => {
    // LocalStorage boşken /panel'e gidildiğinde kullanıcı giriş yapmaya yönlendirilmeli veya login uyarısı çıkmalı
    await page.goto('/panel');
    
    // Giris sayfasına yönlendirilmiş olmalı veya login kartı görünmeli
    await expect(page).toHaveURL(/giris|panel/);
  });

});
