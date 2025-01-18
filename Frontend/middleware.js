import { NextResponse } from "next/server";
import jwtDecode from "jwt-decode";

export function middleware(req) {
    const token = req.cookies.get("token");

    if (!token) {
        return NextResponse.redirect(new URL("/pages/authenticate/login", req.url));
    }

    try {
        const user = jwtDecode(token);
        req.user = user; // ใช้ใน API Routes ได้
    } catch (error) {
        return NextResponse.redirect(new URL("/pages/authenticate/login", req.url));
    }
}

export const config = {
    matcher: ["/pages/admin/:path*", "/pages/user/:path*"], // ป้องกันเฉพาะหน้าเหล่านี้
};
