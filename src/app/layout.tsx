import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";
import SessionProvider from "@/components/providers/SessionProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Sri SM Skills | Wear Confidence. Live Your Style.",
    template: "%s | Sri SM Skills",
  },
  description:
    "Discover premium-quality clothing at Sri SM Skills. Stylish, comfortable, and affordable fashion for modern lifestyles.",
  keywords: ["clothing", "fashion", "Sri SM Skills", "online shopping", "premium clothing"],
  openGraph: {
    title: "Sri SM Skills | Wear Confidence. Live Your Style.",
    description: "Premium-quality clothing designed for modern lifestyles.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <SessionProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: "#0a0a0a", color: "#fff", borderRadius: "0" },
            }}
          />
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
