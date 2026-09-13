"use client";

import React from "react";
import { AuthProvider } from "@/lib/store/authStore";
import { CartProvider } from "@/lib/store/cartStore";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
}
