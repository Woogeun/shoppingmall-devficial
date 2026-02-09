import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shoe Mall | 신발 쇼핑몰",
  description: "온라인 신발 쇼핑몰 - 다양한 신발을 검색하고 구매하세요.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  const cartCount = session
    ? await prisma.cartItem.aggregate({ where: { userId: session.id }, _count: true }).then((r) => r._count)
    : 0;

  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <Header session={session} cartCount={cartCount} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
