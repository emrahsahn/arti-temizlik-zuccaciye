"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200 animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 border-b border-stone-100 flex-shrink-0 bg-white">
            <div className="text-base sm:text-lg font-bold text-stone-900">{title}</div>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors active:scale-95"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 touch-scroll">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="border-t border-stone-100 p-4 sm:p-6 bg-stone-50/70 flex-shrink-0 pb-safe">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
