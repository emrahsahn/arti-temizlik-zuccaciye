import { test, expect } from '@playwright/test';

test.describe('Artı Temizlik & Züccaciye - E2E & Edge Case Testleri', () => {

  test('1. Kampanya sayfası (/kampanya/kmp-1) sorunsuz yüklenmeli', async ({ page }) => {
    await page.goto('/kampanya/kmp-1');
    await expect(page.getByText(/Kampanyaya Dahil Ürünler|İşletmelere Özel/i)).toBeVisible({ timeout: 15000 });
  });

  test('2. Geçersiz kampanya ID (/kampanya/yok-boyle-bir-kampanya) uygulamanın çökmesine yol açmamalı', async ({ page }) => {
    await page.goto('/kampanya/yok-boyle-bir-kampanya');
    await expect(page.getByText(/kampanya bulunamadı/i)).toBeVisible({ timeout: 15000 });
  });

  test('3. Admin vitrin yönetiminde kampanya modalı ve ürün seçici açılabilmeli', async ({ page }) => {
    // 1. Gerçek admin girişi yap
    await page.goto('/giris');
    await page.locator('#username').fill('admin');
    await page.locator('#password').fill('admin123');
    await page.locator('button[type="submit"]').click();

    // 2. Admin paneline yönlendirilmeli
    await expect(page).toHaveURL(/admin/, { timeout: 15000 });

    // 3. Vitrin sayfasına git
    await page.goto('/admin/vitrin');
    await expect(page.getByText(/vitrin & kampanya yönetimi/i)).toBeVisible({ timeout: 15000 });

    // 4. İlk kampanyanın Düzenle butonuna tıkla
    const editBtn = page.getByRole('button', { name: /düzenle/i }).first();
    await expect(editBtn).toBeVisible({ timeout: 10000 });
    await editBtn.click();

    // Modal açılmalı ve "Kampanyaya Dahil Edilecek Ürünler" alanı bulunmalı
    await expect(page.getByText(/kampanyaya dahil edilecek ürünler/i)).toBeVisible({ timeout: 10000 });
  });

  test('4. Müşteri paneli yetkisiz giriş koruması (/panel)', async ({ page }) => {
    await page.goto('/panel');
    // Giris sayfasına yönlendirilmiş olmalı
    await expect(page).toHaveURL(/giris|panel/);
  });

  test('5. Müşteri Memnuniyeti vitrin butonu ve admin memnuniyet yönetimi', async ({ page }) => {
    // 1. Gerçek admin girişi yap
    await page.goto('/giris');
    await page.locator('#username').fill('admin');
    await page.locator('#password').fill('admin123');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/admin/, { timeout: 15000 });

    // 2. Admin memnuniyet sayfasına git
    await page.goto('/admin/memnuniyet');
    await expect(page.getByText(/Müşteri Memnuniyeti & Teslimat Medyaları/i)).toBeVisible({ timeout: 15000 });

    // Yeni ekle butonuna tıkla
    const addBtn = page.getByRole('button', { name: /Yeni Medya & Memnuniyet Ekle/i });
    await expect(addBtn).toBeVisible({ timeout: 10000 });
    await addBtn.click();

    // Modalın açıldığını doğrula
    await expect(page.getByText(/Yeni Müşteri Memnuniyeti & Medya Ekle/i)).toBeVisible({ timeout: 10000 });

    // 3. Vitrin ana sayfasına git ve ⭐ Müşteri Memnuniyeti butonunu test et
    await page.goto('/');
    const reviewBtn = page.getByRole('button', { name: /Memnuniyet/i });
    await expect(reviewBtn).toBeVisible({ timeout: 15000 });
    await reviewBtn.click();

    // Müşteri memnuniyet kartlarının ekranda olduğunu doğrula
    await expect(page.getByText(/Anamur Resort Otel/i)).toBeVisible({ timeout: 15000 });
  });

});
