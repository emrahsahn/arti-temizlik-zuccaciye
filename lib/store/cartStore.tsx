"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Urun } from "../types";

interface CartContextType {
  items: CartItem[];
  addItem: (urun: Urun, adet?: number) => void;
  removeItem: (urunId: string) => void;
  updateQuantity: (urunId: string, adet: number) => void;
  updateItemNote: (urunId: string, not: string) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "arti_temizlik_cart";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Sepet verisi okunamadı:", e);
    }
    setIsInitialized(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error("Sepet kaydedilemedi:", e);
      }
    }
  }, [items, isInitialized]);

  const addItem = (urun: Urun, adet: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.urun.id === urun.id);
      if (existing) {
        return prev.map((item) =>
          item.urun.id === urun.id
            ? { ...item, adet: item.adet + adet }
            : item
        );
      }
      return [...prev, { urun, adet }];
    });
    setIsOpen(true);
  };

  const removeItem = (urunId: string) => {
    setItems((prev) => prev.filter((item) => item.urun.id !== urunId));
  };

  const updateQuantity = (urunId: string, adet: number) => {
    if (adet <= 0) {
      removeItem(urunId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.urun.id === urunId ? { ...item, adet: Math.min(adet, 9999) } : item
      )
    );
  };

  const updateItemNote = (urunId: string, not: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.urun.id === urunId ? { ...item, not } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCount = items.reduce((sum, item) => sum + item.adet, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.adet * item.urun.fiyat,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateItemNote,
        clearCart,
        totalCount,
        totalPrice,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
