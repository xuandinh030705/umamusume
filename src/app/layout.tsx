import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { ToastProvider } from "@/components/ui/toast";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UmaWall - Umamusume Pretty Derby Wallpaper Gallery",
  description: "Your ultimate collection of Umamusume Pretty Derby wallpapers. Download HD & 4K wallpapers for phone, tablet, and PC.",
  keywords: ["umamusume", "pretty derby", "wallpaper", "anime", "horse girl", "トレセン", "ウマ娘"],
  openGraph: {
    title: "UmaWall - Umamusume Pretty Derby Wallpaper Gallery",
    description: "Your ultimate collection of Umamusume Pretty Derby wallpapers",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
