import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

interface CustomToken {
  user?: {
    name?: string;
    email?: string;
  };
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/auth") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }
  const token = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as CustomToken;

  if (!token && req.nextUrl.pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  const username = token?.user?.name || "Guest";
  console.log(`User: ${username}, Path: ${pathname}`);
  return NextResponse.next();
}
