import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  FAMILY_AUTH_COOKIE,
} from "@/lib/auth-constants";
import {
  isValidClerkToken,
  isValidFamilyToken,
} from "@/lib/auth-tokens-edge";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clerkAuthed = await isValidClerkToken(
    request.cookies.get(AUTH_COOKIE)?.value,
  );
  const familyAuthed = await isValidFamilyToken(
    request.cookies.get(FAMILY_AUTH_COOKIE)?.value,
  );

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!clerkAuthed) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (pathname === "/admin/login" && clerkAuthed) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (pathname.startsWith("/family") && pathname !== "/family/login") {
    if (!familyAuthed) {
      return NextResponse.redirect(new URL("/family/login", request.url));
    }
  }

  if (pathname === "/family/login" && familyAuthed) {
    return NextResponse.redirect(new URL("/family", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/family/:path*"],
};
