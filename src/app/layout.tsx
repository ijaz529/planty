import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BasketProvider } from "@/components/basket/basket-provider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Planty — rent plants, we keep them alive",
  description:
    "Rent living plants for your office or home in Dubai. Delivered, installed, and maintained weekly. Transparent monthly prices, no sales call.",
};

export const viewport: Viewport = {
  themeColor: "#2f6b46",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <BasketProvider>{children}</BasketProvider>
      </body>
    </html>
  );
}
