import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/providers/ClientProviders";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Artı Temizlik & Züccaciye | Toptan ve Perakende Sipariş",
  description: "Anamur ve çevresine kaliteli temizlik, ambalaj, sarf ve züccaciye ürünleri toptan ve perakende tedarik platformu.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={inter.className}>
      <body className="min-h-screen bg-[#FAFAF9] text-stone-900 antialiased flex flex-col">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}

