import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const role = request.cookies.get("arti_user_role")?.value;
  const userId = request.cookies.get("arti_user_id")?.value;
  const isAuthenticated = !!userId;

  // 1. Admin rotaları koruması
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const url = new URL("/giris", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    if (role !== "admin") {
      // Yetkisiz erişim, ana sayfaya veya müşteri paneline yönlendir
      return NextResponse.redirect(new URL("/panel", request.url));
    }
  }

  // 2. Müşteri paneli rotaları koruması
  if (pathname.startsWith("/panel")) {
    if (!isAuthenticated) {
      const url = new URL("/giris", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    // Yönetici hesabı müşteri paneline erişmeye çalışırsa doğrudan /admin paneline yönlendir
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // 3. Giriş sayfası: Zaten giriş yapılmışsa ilgili panele yönlendir
  if (pathname === "/giris" && isAuthenticated) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else {
      return NextResponse.redirect(new URL("/panel", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/panel/:path*", "/giris"],
};
