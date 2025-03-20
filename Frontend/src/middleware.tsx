import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = "your_secret_key"; // ใช้คีย์เดียวกับฝั่ง Backend

export function middleware(req: NextRequest) {
    const tokenCookie = req.cookies.get("token");

    const { pathname } = req.nextUrl;

    if (!tokenCookie) {
        // กรณีผู้ใช้ไม่ได้ล็อกอิน
        if (pathname.startsWith("/pages/admin")) {
            return NextResponse.redirect(new URL("/pages/authenticate/login", req.url));
        }
        return NextResponse.next();
    }

    const token = tokenCookie.value; // ดึงค่า token
    try {
        const decoded: any = jwt.verify(token, SECRET_KEY);
        const role = decoded.role;

        // **Admin** -> เข้าได้ทุกหน้า
        if (role === "admin") {
            return NextResponse.next();
        }

        // **User** -> ห้ามเข้า `/admin`
        if (role === "user" && pathname.startsWith("/pages/admin")) {
            return NextResponse.redirect(new URL("/", req.url)); // ส่งกลับไปหน้า Home
        }

        return NextResponse.next();
    } catch (error) {
        return NextResponse.redirect(new URL("/pages/authenticate/login", req.url));
    }
}

// **กำหนดเส้นทางที่ต้องใช้ Middleware**
export const config = {
    matcher: ["/admin/:path*", "/pages/report/:path*"],
};
