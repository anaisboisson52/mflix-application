import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; 

const SECRET_KEY = process.env.JWT_SECRET || "super-secret-key";

// Liste des routes publiques
const publicRoutes = ["api/auth/login", "api/auth/signup", "/api-doc"];

export async function middleware(req: NextRequest) {
  if (publicRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Essayez de récupérer le token depuis les cookies, ou depuis l'en-tête Authorization (si présent)
  const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.split(' ')[1];
  const refreshToken = req.cookies.get('refreshToken')?.value;

  if (!token && !refreshToken) {
    return NextResponse.redirect(new URL("api/auth/login", req.url));
  }

  try {
    // Vérification du token JWT avec 'jose'
    await jwtVerify(token!, new TextEncoder().encode(SECRET_KEY));
    return NextResponse.next();
  } catch (error) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("api/auth/login", req.url));
    }

    // Essayer de rafraîchir le token
    try {
      const refreshResponse = await fetch(new URL("/api/auth/signup", req.url), {
        method: "GET",
        headers: { Cookie: `refreshToken=${refreshToken}` }
      });

      if (!refreshResponse.ok) {
        return NextResponse.redirect(new URL("api/auth/login", req.url));
      }

      const { token: newToken } = await refreshResponse.json();
      const response = NextResponse.next();
      response.cookies.set("token", newToken, { httpOnly: true, secure: true, path: "/" });

      return response;
    } catch {
      return NextResponse.redirect(new URL("api/auth/login", req.url));
    }
  }
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
