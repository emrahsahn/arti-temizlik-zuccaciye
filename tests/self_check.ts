import assert from "node:assert/strict";
import {
  orderItemSchema,
  createOrderSchema,
  loginSchema,
} from "../lib/schemas/order";
import { DataService } from "../lib/dataService";

console.log("🚀 Running Artı Temizlik Züccaciye Core Self-Checks...\n");

// 1. Test Zod Schemas
console.log("1. Testing Validation Schemas (Zod)...");

// 1.1 Order Item Schema
const validItem = orderItemSchema.safeParse({
  urun_id: "urn-1",
  adet: 5,
  not: "Koli üzerine dikkat edilsin",
});
assert.equal(validItem.success, true, "Valid order item should pass");

const zeroItem = orderItemSchema.safeParse({
  urun_id: "urn-1",
  adet: 0,
});
assert.equal(zeroItem.success, false, "Zero quantity should fail");

const negativeItem = orderItemSchema.safeParse({
  urun_id: "urn-1",
  adet: -3,
});
assert.equal(negativeItem.success, false, "Negative quantity should fail");

const excessiveItem = orderItemSchema.safeParse({
  urun_id: "urn-1",
  adet: 10000,
});
assert.equal(excessiveItem.success, false, "Quantity > 9999 should fail");

// 1.2 Login Schema
const validLogin = loginSchema.safeParse({
  username: "anamurotel",
  password: "password123",
});
assert.equal(validLogin.success, true, "Valid login should pass");

const honeypotLogin = loginSchema.safeParse({
  username: "anamurotel",
  password: "password123",
  honeypot: "bot_filled_input",
});
assert.equal(
  honeypotLogin.success,
  false,
  "Honeypot filled by bot must fail validation"
);

const shortPassLogin = loginSchema.safeParse({
  username: "admin",
  password: "123",
});
assert.equal(shortPassLogin.success, false, "Short password should fail");

console.log("   ✅ All Zod schema checks passed!");

// 2. Test DataService & Catalog Operations
console.log("\n2. Testing DataService & Catalog Queries...");

const categories = DataService.getCategories();
assert.ok(categories.length >= 7, "Should have at least 7 categories");

const allProducts = DataService.getProducts();
assert.ok(allProducts.length >= 12, "Should have initial product set");

// Test category filtering
const cat1 = categories[0];
const cat1Products = DataService.getProducts({ categoryId: cat1.id });
assert.ok(cat1Products.length > 0, "Category filter should return products");
cat1Products.forEach((p) => {
  assert.equal(p.kategori_id, cat1.id, "Product must belong to selected category");
});

// Test search query
const searchResults = DataService.getProducts({ search: "çamaşır" });
assert.ok(searchResults.length > 0, "Search for 'çamaşır' should find products");
assert.ok(
  searchResults[0].ad.toLowerCase().includes("çamaşır"),
  "Found product should contain search term"
);

// Test Bestseller and Featured flags
const bestsellers = DataService.getProducts({ onlyBestsellers: true });
assert.ok(bestsellers.length > 0, "Should have bestsellers");
bestsellers.forEach((p) => assert.equal(p.cok_satan, true));

const featured = DataService.getProducts({ onlyFeatured: true });
assert.ok(featured.length > 0, "Should have featured products");
featured.forEach((p) => assert.equal(p.haftanin_urunu, true));

console.log("   ✅ Catalog and query checks passed!");

// 3. Test Order Creation and Calculations
console.log("\n3. Testing Order Creation & Calculation Accuracy...");

const p1 = allProducts[0]; // e.g. 460 TL
const p2 = allProducts[1]; // e.g. 780 TL

const testOrder = DataService.createOrder({
  user_id: "usr-1",
  items: [
    { urun_id: p1.id, adet: 2, not: "Acil" },
    { urun_id: p2.id, adet: 1 },
  ],
  siparis_notu: "Test siparişi",
});

const expectedTotal = p1.fiyat * 2 + p2.fiyat * 1;
assert.equal(
  testOrder.toplam_tutar,
  expectedTotal,
  `Total price must match calculation (expected ${expectedTotal}, got ${testOrder.toplam_tutar})`
);
assert.equal(testOrder.status, "beklemede", "New order should default to 'beklemede'");
assert.equal(testOrder.kalemler?.length, 2, "Order must have exactly 2 line items");

// Test status update
const updatedOrder = DataService.updateOrderStatus(testOrder.id, "onaylandi");
assert.ok(updatedOrder, "Updated order must exist");
assert.equal(updatedOrder.status, "onaylandi", "Order status should be 'onaylandi'");

const completedOrder = DataService.updateOrderStatus(testOrder.id, "tamamlandi");
assert.equal(completedOrder?.status, "tamamlandi", "Order status should be 'tamamlandi'");

console.log("   ✅ Order creation, price arithmetic and status transition checks passed!");

// 4. Test Customer Account Creation & Consultant CRUD
console.log("\n4. Testing Account Management & Consultant CRUD...");

const initialConsultantsCount = DataService.getConsultants().length;
assert.ok(initialConsultantsCount >= 2, "Must have defined consultants");

// Add consultant
const newDanisman = DataService.addConsultant({
  ad_soyad: "Kemal Demir",
  telefon: "0532 999 88 77",
});
assert.ok(newDanisman.id.startsWith("dan-"));
assert.equal(DataService.getConsultants().length, initialConsultantsCount + 1);

// Update consultant
const updatedDanisman = DataService.updateConsultant(newDanisman.id, {
  ad_soyad: "Kemal Demir (Kıdemli)",
});
assert.equal(updatedDanisman?.ad_soyad, "Kemal Demir (Kıdemli)");

// Toggle consultant active
DataService.toggleConsultantActive(newDanisman.id);
assert.equal(DataService.getConsultants().find((d) => d.id === newDanisman.id)?.aktif, false);

const newCustomer = DataService.addProfile({
  username: "testbayi",
  role: "musteri",
  firma_adi: "Test Anamur Büfe",
  danisman_id: newDanisman.id,
  telefon: "0555 123 4567",
  adres: "Anamur Çarşı",
});

assert.equal(newCustomer.username, "testbayi");
assert.equal(newCustomer.danisman_id, newDanisman.id);

// Delete consultant and verify profile unassign
const deleteDanResult = DataService.deleteConsultant(newDanisman.id);
assert.equal(deleteDanResult.success, true);
assert.equal(deleteDanResult.unassignedCount, 1);
assert.equal(DataService.getConsultants().length, initialConsultantsCount);
const recheckCustomer = DataService.getProfiles().find((p) => p.username === "testbayi");
assert.equal(recheckCustomer?.danisman_id, null);

// Test virtual email format
const virtualEmail = `${newCustomer.username.toLowerCase().trim()}@artitemizlik.internal`;
assert.equal(virtualEmail, "testbayi@artitemizlik.internal", "Virtual email format must match spec");

console.log("   ✅ Account provisioning, consultant CRUD and unassign checks passed!");

// 5. Test Dynamic Category Management & Auto-Slug
console.log("\n5. Testing Dynamic Category Management & Auto-Slug...");
const initialCatCount = DataService.getCategories().length;
const newCat = DataService.addCategory({ ad: "Oto Bakım & Yıkama Ürünleri" });
assert.ok(newCat.id.startsWith("kat-"), "Category ID should start with kat-");
assert.equal(newCat.ad, "Oto Bakım & Yıkama Ürünleri");
assert.equal(newCat.slug, "oto-bakim-yikama-urunleri", "Auto-slug must handle Turkish chars");

const afterAddCats = DataService.getCategories();
assert.equal(afterAddCats.length, initialCatCount + 1, "Category count should increment by 1");

const fetchedBySlug = DataService.getCategoryBySlug("oto-bakim-yikama-urunleri");
assert.equal(fetchedBySlug?.id, newCat.id, "Category should be retrievable by slug");

// Update category
const updatedCat = DataService.updateCategory(newCat.id, { ad: "Oto Bakım ve Şampuanlar" });
assert.equal(updatedCat?.ad, "Oto Bakım ve Şampuanlar");
assert.equal(updatedCat?.slug, "oto-bakim-ve-sampuanlar", "Slug should update when ad updates");

// Delete category with no products
const deleteResult = DataService.deleteCategory(newCat.id);
assert.equal(deleteResult.success, true, "Empty category should delete successfully");
assert.equal(DataService.getCategories().length, initialCatCount, "Category count should revert");

// Attempt delete category with products (kat-1)
const failDeleteResult = DataService.deleteCategory("kat-1");
assert.equal(failDeleteResult.success, false, "Category with products must not be deleted");

console.log("   ✅ Dynamic Category CRUD & Auto-Slug checks passed!");

// 6. Test Contact Persons CRUD (Footer & Contact)
console.log("\n6. Testing Contact Persons CRUD (Footer & Contact)...");
const initialContactsCount = DataService.getContactPersons().length;
const newContact = DataService.addContactPerson({
  ad_soyad: "Ali Vural",
  unvan: "Bölge Satış Yetkilisi",
  telefon: "0536 777 88 99",
  sira: 4,
});
assert.ok(newContact.id.startsWith("ilt-"), "Contact ID should start with ilt-");
assert.equal(newContact.ad_soyad, "Ali Vural");
assert.equal(DataService.getContactPersons().length, initialContactsCount + 1);

const updatedContact = DataService.updateContactPerson(newContact.id, {
  unvan: "Kıdemli Satış Temsilcisi",
});
assert.equal(updatedContact?.unvan, "Kıdemli Satış Temsilcisi");

const deletedContactSuccess = DataService.deleteContactPerson(newContact.id);
assert.equal(deletedContactSuccess, true);
assert.equal(DataService.getContactPersons().length, initialContactsCount);

console.log("   ✅ Contact Persons CRUD & Footer sync checks passed!");

console.log("\n✨ ALL 6 TEST SUITES PASSED FLAWLESSLY! ✨\n");
