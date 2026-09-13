import {
  MOCK_KATEGORILER,
  MOCK_URUNLER,
  MOCK_DANISMANLAR,
  MOCK_KAMPANYALAR,
  MOCK_ILETISIM_KISILERI,
  MOCK_SIPARISLER,
  MOCK_AYARLAR,
  MOCK_PROFILES,
} from "./mockData";
import {
  Kategori,
  Urun,
  Danisman,
  Kampanya,
  IletisimKisi,
  Siparis,
  SiteAyarlari,
  Profile,
  SiparisDurumu,
} from "./types";

const PRODUCTS_KEY = "arti_products";
const CATEGORIES_KEY = "arti_categories";
const ORDERS_KEY = "arti_orders";
const SETTINGS_KEY = "arti_settings";
const PROFILES_KEY = "arti_profiles";
const CONSULTANTS_KEY = "arti_consultants";
const CONTACTS_KEY = "arti_contacts";
const CAMPAIGNS_KEY = "arti_campaigns";

let memoryCategories: Kategori[] = [...MOCK_KATEGORILER];
let memoryProducts: Urun[] = [...MOCK_URUNLER];
let memoryOrders: Siparis[] = [...MOCK_SIPARISLER];
let memorySettings: SiteAyarlari = { ...MOCK_AYARLAR };
let memoryProfiles: Profile[] = [...MOCK_PROFILES];
let memoryConsultants: Danisman[] = [...MOCK_DANISMANLAR];
let memoryContacts: IletisimKisi[] = [...MOCK_ILETISIM_KISILERI];
let memoryCampaigns: Kampanya[] = [...MOCK_KAMPANYALAR];

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function slugify(text: string): string {
  const trMap: Record<string, string> = {
    ç: "c",
    Ç: "c",
    ğ: "g",
    Ğ: "g",
    ı: "i",
    İ: "i",
    ö: "o",
    Ö: "o",
    ş: "s",
    Ş: "s",
    ü: "u",
    Ü: "u",
  };
  return text
    .split("")
    .map((c) => trMap[c] || c)
    .join("")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getStoredCategories(): Kategori[] {
  if (isBrowser()) {
    try {
      const saved = localStorage.getItem(CATEGORIES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return memoryCategories;
}

export function saveCategories(categories: Kategori[]) {
  memoryCategories = categories;
  if (!isBrowser()) return;
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    window.dispatchEvent(new Event("arti_categories_updated"));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredProducts(): Urun[] {
  if (isBrowser()) {
    try {
      const saved = localStorage.getItem(PRODUCTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return memoryProducts;
}

export function saveProducts(products: Urun[]) {
  memoryProducts = products;
  if (!isBrowser()) return;
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event("arti_products_updated"));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredOrders(): Siparis[] {
  if (isBrowser()) {
    try {
      const saved = localStorage.getItem(ORDERS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return memoryOrders;
}

export function saveOrders(orders: Siparis[]) {
  memoryOrders = orders;
  if (!isBrowser()) return;
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event("arti_orders_updated"));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredSettings(): SiteAyarlari {
  if (isBrowser()) {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return memorySettings;
}

export function saveSettings(settings: SiteAyarlari) {
  memorySettings = settings;
  if (!isBrowser()) return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event("arti_settings_updated"));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredProfiles(): Profile[] {
  if (isBrowser()) {
    try {
      const saved = localStorage.getItem(PROFILES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return memoryProfiles;
}

export function saveProfiles(profiles: Profile[]) {
  memoryProfiles = profiles;
  if (!isBrowser()) return;
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredConsultants(): Danisman[] {
  if (isBrowser()) {
    try {
      const saved = localStorage.getItem(CONSULTANTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return memoryConsultants;
}

export function saveConsultants(consultants: Danisman[]) {
  memoryConsultants = consultants;
  if (!isBrowser()) return;
  try {
    localStorage.setItem(CONSULTANTS_KEY, JSON.stringify(consultants));
    window.dispatchEvent(new Event("arti_consultants_updated"));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredContacts(): IletisimKisi[] {
  if (isBrowser()) {
    try {
      const saved = localStorage.getItem(CONTACTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return memoryContacts;
}

export function saveContacts(contacts: IletisimKisi[]) {
  memoryContacts = contacts;
  if (!isBrowser()) return;
  try {
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
    window.dispatchEvent(new Event("arti_contacts_updated"));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredCampaigns(): Kampanya[] {
  if (isBrowser()) {
    try {
      const saved = localStorage.getItem(CAMPAIGNS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return memoryCampaigns;
}

export function saveCampaigns(campaigns: Kampanya[]) {
  memoryCampaigns = campaigns;
  if (!isBrowser()) return;
  try {
    localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
    window.dispatchEvent(new Event("arti_campaigns_updated"));
  } catch (e) {
    console.error(e);
  }
}

// Data query methods
export const DataService = {
  getCategories(filter?: { includeInactive?: boolean }): Kategori[] {
    const list = getStoredCategories().sort((a, b) => a.sira - b.sira);
    if (filter?.includeInactive) {
      return list;
    }
    return list.filter((c) => c.aktif !== false);
  },

  getCategoryById(id: string): Kategori | undefined {
    return getStoredCategories().find((c) => c.id === id);
  },

  getCategoryBySlug(slug: string): Kategori | undefined {
    return getStoredCategories().find((c) => c.slug === slug);
  },

  addCategory(data: {
    ad: string;
    slug?: string;
    icon_name?: string;
    aktif?: boolean;
    sira?: number;
  }): Kategori {
    const categories = getStoredCategories();
    const baseSlug = data.slug?.trim() || slugify(data.ad);
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (categories.some((c) => c.slug === uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${counter++}`;
    }

    const newCategory: Kategori = {
      id: "kat-" + Date.now(),
      ad: data.ad.trim(),
      slug: uniqueSlug,
      sira: data.sira !== undefined ? data.sira : categories.length + 1,
      icon_name: data.icon_name || "Package",
      aktif: data.aktif !== undefined ? data.aktif : true,
    };

    const updated = [...categories, newCategory];
    saveCategories(updated);
    return newCategory;
  },

  updateCategory(id: string, updates: Partial<Kategori>): Kategori | null {
    const categories = getStoredCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) return null;

    if (updates.ad && !updates.slug) {
      updates.slug = slugify(updates.ad);
    }

    categories[index] = { ...categories[index], ...updates };
    saveCategories(categories);
    return categories[index];
  },

  toggleCategoryActive(id: string): Kategori | null {
    const categories = getStoredCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) return null;
    const current = categories[index].aktif !== false;
    categories[index] = { ...categories[index], aktif: !current };
    saveCategories(categories);
    return categories[index];
  },

  deleteCategory(id: string): { success: boolean; error?: string } {
    const products = getStoredProducts();
    const hasProducts = products.some((p) => p.kategori_id === id);
    if (hasProducts) {
      return {
        success: false,
        error: "Bu kategoriye bağlı ürünler bulunmaktadır. Önce ilgili ürünleri başka bir kategoriye taşıyın veya silin.",
      };
    }

    const categories = getStoredCategories();
    const updated = categories.filter((c) => c.id !== id);
    saveCategories(updated);
    return { success: true };
  },

  getProducts(filter?: {
    categoryId?: string;
    search?: string;
    onlyBestsellers?: boolean;
    onlyFeatured?: boolean;
    includeInactive?: boolean;
  }): Urun[] {
    let products = getStoredProducts();

    if (!filter?.includeInactive) {
      products = products.filter((p) => p.aktif !== false);
    }
    if (filter?.categoryId) {
      products = products.filter((p) => p.kategori_id === filter.categoryId);
    }
    if (filter?.onlyBestsellers) {
      products = products.filter((p) => p.cok_satan);
    }
    if (filter?.onlyFeatured) {
      products = products.filter((p) => p.haftanin_urunu);
    }
    if (filter?.search && filter.search.trim() !== "") {
      const q = filter.search.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.ad.toLowerCase().includes(q) ||
          p.aciklama?.toLowerCase().includes(q) ||
          p.birim.toLowerCase().includes(q)
      );
    }
    return products;
  },

  getProductById(id: string): Urun | undefined {
    return getStoredProducts().find((p) => p.id === id);
  },

  addProduct(newProduct: Omit<Urun, "id">): Urun {
    const products = getStoredProducts();
    const product: Urun = {
      ...newProduct,
      id: "urn-" + Date.now(),
      created_at: new Date().toISOString(),
    };
    const updated = [product, ...products];
    saveProducts(updated);
    return product;
  },

  updateProduct(id: string, updates: Partial<Urun>): Urun | null {
    const products = getStoredProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...updates };
    saveProducts(products);
    return products[index];
  },

  deleteProduct(id: string): boolean {
    const products = getStoredProducts();
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
    return true;
  },

  toggleProductStock(id: string): "var" | "tukendi" {
    const products = getStoredProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return "var";
    const current = products[index].stok_durumu || "var";
    const next = current === "var" ? "tukendi" : "var";
    products[index].stok_durumu = next;
    saveProducts(products);
    return next;
  },

  toggleProductActive(id: string): boolean {
    const products = getStoredProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    products[index].aktif = !products[index].aktif;
    saveProducts(products);
    return products[index].aktif;
  },

  getCampaigns(includeInactive = false): Kampanya[] {
    const list = getStoredCampaigns().sort((a, b) => (a.sira ?? 0) - (b.sira ?? 0));
    if (includeInactive) return list;
    return list.filter((k) => k.aktif !== false);
  },

  getCampaignById(id: string): Kampanya | undefined {
    return getStoredCampaigns().find((c) => c.id === id);
  },

  createCampaign(data: Omit<Kampanya, "id">): Kampanya {
    const campaigns = getStoredCampaigns();
    const newCamp: Kampanya = {
      ...data,
      id: `kmp-${Date.now()}`,
      sira: data.sira || campaigns.length + 1,
      aktif: data.aktif !== false,
    };
    campaigns.push(newCamp);
    saveCampaigns(campaigns);
    return newCamp;
  },

  updateCampaign(id: string, updates: Partial<Kampanya>): Kampanya | null {
    const campaigns = getStoredCampaigns();
    const index = campaigns.findIndex((c) => c.id === id);
    if (index === -1) return null;
    campaigns[index] = { ...campaigns[index], ...updates };
    saveCampaigns(campaigns);
    return campaigns[index];
  },

  deleteCampaign(id: string): boolean {
    const campaigns = getStoredCampaigns();
    const updated = campaigns.filter((c) => c.id !== id);
    saveCampaigns(updated);
    return true;
  },

  toggleCampaignActive(id: string): boolean {
    const campaigns = getStoredCampaigns();
    const index = campaigns.findIndex((c) => c.id === id);
    if (index === -1) return false;
    campaigns[index].aktif = !campaigns[index].aktif;
    saveCampaigns(campaigns);
    return true;
  },

  getContactPersons(onlyFooter?: boolean): IletisimKisi[] {
    let list = getStoredContacts().sort((a, b) => a.sira - b.sira);
    if (onlyFooter) {
      list = list.filter((c) => c.footer_goster !== false);
    }
    return list;
  },

  toggleContactFooter(id: string): boolean {
    const contacts = getStoredContacts();
    const index = contacts.findIndex((c) => c.id === id);
    if (index === -1) return false;
    const current = contacts[index].footer_goster !== false;
    contacts[index].footer_goster = !current;
    saveContacts(contacts);
    return true;
  },

  toggleContactPersonActive(id: string): boolean {
    const contacts = getStoredContacts();
    const index = contacts.findIndex((c) => c.id === id);
    if (index === -1) return false;
    const current = contacts[index].aktif !== false;
    contacts[index].aktif = !current;
    saveContacts(contacts);
    return true;
  },

  addContactPerson(data: Omit<IletisimKisi, "id">): IletisimKisi {
    const contacts = getStoredContacts();
    const newPerson: IletisimKisi = {
      ...data,
      id: "ilt-" + Date.now(),
      sira: data.sira || contacts.length + 1,
    };
    const updated = [...contacts, newPerson];
    saveContacts(updated);
    return newPerson;
  },

  updateContactPerson(id: string, updates: Partial<IletisimKisi>): IletisimKisi | null {
    const contacts = getStoredContacts();
    const index = contacts.findIndex((c) => c.id === id);
    if (index === -1) return null;
    contacts[index] = { ...contacts[index], ...updates };
    saveContacts(contacts);
    return contacts[index];
  },

  deleteContactPerson(id: string): boolean {
    const contacts = getStoredContacts();
    const updated = contacts.filter((c) => c.id !== id);
    saveContacts(updated);
    return true;
  },

  reorderContactPerson(id: string, direction: "up" | "down"): boolean {
    const contacts = [...getStoredContacts()].sort((a, b) => a.sira - b.sira);
    const index = contacts.findIndex((c) => c.id === id);
    if (index === -1) return false;

    if (direction === "up" && index > 0) {
      const tempSira = contacts[index].sira;
      contacts[index].sira = contacts[index - 1].sira;
      contacts[index - 1].sira = tempSira;
      // Ensure unique sorting in case of duplicate numbers
      if (contacts[index].sira === contacts[index - 1].sira) {
        contacts[index].sira = index;
        contacts[index - 1].sira = index + 1;
      }
      saveContacts(contacts);
      return true;
    } else if (direction === "down" && index < contacts.length - 1) {
      const tempSira = contacts[index].sira;
      contacts[index].sira = contacts[index + 1].sira;
      contacts[index + 1].sira = tempSira;
      if (contacts[index].sira === contacts[index + 1].sira) {
        contacts[index].sira = index + 2;
        contacts[index + 1].sira = index + 1;
      }
      saveContacts(contacts);
      return true;
    }
    return false;
  },

  getConsultants(onlyActive?: boolean): Danisman[] {
    const list = getStoredConsultants();
    if (onlyActive) {
      return list.filter((c) => c.aktif !== false);
    }
    return list;
  },

  addConsultant(data: Omit<Danisman, "id">): Danisman {
    const consultants = getStoredConsultants();
    const newConsultant: Danisman = {
      ...data,
      id: "dan-" + Date.now(),
      aktif: data.aktif !== undefined ? data.aktif : true,
    };
    const updated = [...consultants, newConsultant];
    saveConsultants(updated);
    return newConsultant;
  },

  updateConsultant(id: string, updates: Partial<Danisman>): Danisman | null {
    const consultants = getStoredConsultants();
    const index = consultants.findIndex((c) => c.id === id);
    if (index === -1) return null;
    consultants[index] = { ...consultants[index], ...updates };
    saveConsultants(consultants);
    return consultants[index];
  },

  toggleConsultantActive(id: string): boolean {
    const consultants = getStoredConsultants();
    const index = consultants.findIndex((c) => c.id === id);
    if (index === -1) return false;
    const current = consultants[index].aktif !== false;
    consultants[index].aktif = !current;
    saveConsultants(consultants);
    return true;
  },

  reorderConsultant(id: string, direction: "up" | "down"): boolean {
    const consultants = [...getStoredConsultants()];
    const index = consultants.findIndex((c) => c.id === id);
    if (index === -1) return false;

    if (direction === "up" && index > 0) {
      const temp = consultants[index];
      consultants[index] = consultants[index - 1];
      consultants[index - 1] = temp;
      saveConsultants(consultants);
      return true;
    } else if (direction === "down" && index < consultants.length - 1) {
      const temp = consultants[index];
      consultants[index] = consultants[index + 1];
      consultants[index + 1] = temp;
      saveConsultants(consultants);
      return true;
    }
    return false;
  },

  deleteConsultant(id: string): { success: boolean; unassignedCount: number } {
    const consultants = getStoredConsultants();
    const updatedConsultants = consultants.filter((c) => c.id !== id);
    saveConsultants(updatedConsultants);

    // Unassign profiles that belonged to this consultant
    const profiles = getStoredProfiles();
    let unassignedCount = 0;
    profiles.forEach((p) => {
      if (p.danisman_id === id) {
        p.danisman_id = null;
        unassignedCount++;
      }
    });
    if (unassignedCount > 0) {
      saveProfiles(profiles);
    }

    return { success: true, unassignedCount };
  },

  getOrders(userId?: string): Siparis[] {
    const orders = getStoredOrders();
    if (userId) {
      return orders.filter((o) => o.user_id === userId);
    }
    return orders;
  },

  createOrder(payload: {
    user_id: string;
    items: { urun_id: string; adet: number; not?: string }[];
    siparis_notu?: string;
  }): Siparis {
    const products = getStoredProducts();
    const profiles = getStoredProfiles();
    const consultants = getStoredConsultants();

    const user = profiles.find((p) => p.id === payload.user_id);
    const danisman = consultants.find((d) => d.id === user?.danisman_id);

    let total = 0;
    const orderItems = payload.items.map((item, idx) => {
      const urun = products.find((p) => p.id === item.urun_id);
      const price = urun ? urun.fiyat : 0;
      total += price * item.adet;
      return {
        id: `kal-${Date.now()}-${idx}`,
        siparis_id: "",
        urun_id: item.urun_id,
        adet: item.adet,
        birim_fiyat: price,
        not: item.not,
        urun,
      };
    });

    const newOrder: Siparis = {
      id: "sip-" + Math.floor(1000 + Math.random() * 9000),
      user_id: payload.user_id,
      danisman_id: user?.danisman_id || null,
      status: "beklemede",
      toplam_tutar: total,
      siparis_notu: payload.siparis_notu,
      created_at: new Date().toISOString(),
      kalemler: orderItems,
      musteri: user,
      danisman,
    };

    newOrder.kalemler?.forEach((k) => (k.siparis_id = newOrder.id));

    const allOrders = [newOrder, ...getStoredOrders()];
    saveOrders(allOrders);
    return newOrder;
  },

  updateOrderStatus(orderId: string, status: SiparisDurumu): Siparis | null {
    const orders = getStoredOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return null;
    order.status = status;
    saveOrders(orders);
    return order;
  },

  getSettings(): SiteAyarlari {
    return getStoredSettings();
  },

  updateSettings(updates: Partial<SiteAyarlari>): SiteAyarlari {
    const current = getStoredSettings();
    const updated = { ...current, ...updates };
    saveSettings(updated);
    return updated;
  },

  getProfiles(): Profile[] {
    return getStoredProfiles();
  },

  addProfile(data: Omit<Profile, "id" | "created_at">): Profile {
    const profiles = getStoredProfiles();
    const newProfile: Profile = {
      ...data,
      id: "usr-" + Date.now(),
      created_at: new Date().toISOString(),
    };
    const updated = [...profiles, newProfile];
    saveProfiles(updated);
    return newProfile;
  },
};
