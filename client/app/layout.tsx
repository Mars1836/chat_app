import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/toaster";
import { AuthGuard } from "@/wrapper/authGuard";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auth Demo",
  description: "Simple authentication demo with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AuthGuard>{children}</AuthGuard>

          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
