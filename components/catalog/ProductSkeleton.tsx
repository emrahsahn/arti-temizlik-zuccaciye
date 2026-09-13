import React from "react";

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden animate-pulse">
      <div className="w-full aspect-square bg-stone-200" />
      <div className="p-4 sm:p-5 space-y-3">
        <div className="h-4 bg-stone-200 rounded w-1/3" />
        <div className="h-5 bg-stone-200 rounded w-5/6" />
        <div className="h-3 bg-stone-200 rounded w-full" />
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="h-6 bg-stone-200 rounded w-1/3" />
          <div className="h-9 bg-stone-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
};
