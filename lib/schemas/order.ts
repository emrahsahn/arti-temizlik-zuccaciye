import { z } from "zod";

export const orderItemSchema = z.object({
  urun_id: z.string().min(1, "Ürün seçimi zorunludur"),
  adet: z
    .number()
    .int("Adet tam sayı olmalıdır")
    .min(1, "En az 1 adet sipariş verilmelidir")
    .max(9999, "Tek kalemde en fazla 9999 adet sipariş verilebilir"),
  not: z.string().max(300, "Kalem notu en fazla 300 karakter olabilir").optional(),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "Sepetinizde en az 1 ürün bulunmalıdır"),
  siparis_notu: z.string().max(1000, "Sipariş notu en fazla 1000 karakter olabilir").optional(),
  danisman_id: z.string().optional().nullable(),
});

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Kullanıcı adı en az 3 karakter olmalıdır")
    .max(50, "Kullanıcı adı en fazla 50 karakter olabilir")
    .regex(/^[a-zA-Z0-9_-]+$/, "Kullanıcı adı sadece harf, rakam, alt çizgi ve tire içerebilir"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  honeypot: z.string().max(0, "Bot aktivitesi tespit edildi").optional(),
});

export type OrderItemInput = z.infer<typeof orderItemSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
