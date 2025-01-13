import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../context/AuthContext"; // เพิ่มการ import AuthProvider
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider> {/* ครอบ AuthProvider เพื่อให้ context ใช้งานได้ทั่วทั้งแอป */}
          <Navbar />
            {children}
        </AuthProvider>
      </body>
    </html>
  );
}
