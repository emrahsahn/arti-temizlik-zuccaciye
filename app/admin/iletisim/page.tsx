"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminIletisimRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/danismanlar");
  }, [router]);

  return (
    <div className="p-8 text-center text-xs text-stone-400">
      Satış Danışmanları ve İletişim Kadrosu ekranına yönlendiriliyorsunuz...
    </div>
  );
}
