import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/template/footer";
import Header from "@/components/template/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "the Image Viewer",
  description: "画像を簡単にアップロードして、大切な思い出を安全に保管できます",
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
      <Header />
      {children}
      <Footer />
      </body>
    </html>
  );
}
